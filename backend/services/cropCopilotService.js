const axios = require('axios');
const Groq = require('groq-sdk');

const DEFAULT_GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash'];

function getGeminiModels() {
  const configuredModels = (process.env.GEMINI_MODEL || '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);

  return [...configuredModels, ...DEFAULT_GEMINI_MODELS]
    .filter((model, index, array) => array.indexOf(model) === index);
}

function getGeminiApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured in backend .env');
    error.code = 'GEMINI_CONFIG_MISSING';
    throw error;
  }

  return process.env.GEMINI_API_KEY;
}

function buildSystemPrompt({ cropType, notes, farmContext }) {
  return [
    'You are AgroSense Crop Copilot for Indian farmers.',
    'Analyze the uploaded crop image and provide practical advisory guidance, not a guaranteed diagnosis.',
    'Return JSON only with the following keys: summary, imageDescription, likelyIssue, cropHealth, severity, confidence, immediateActions, preventionPlan, followUpQuestions, expertReview, notes.',
    'Use short, clear language.',
    'If the image is unclear or evidence is weak, set expertReview to true and say so.',
    'If the crop appears healthy, say that clearly and still give basic care tips.',
    `Crop type: ${cropType || 'unknown'}`,
    notes ? `Farmer notes: ${notes}` : 'Farmer notes: none provided',
    `Farm context JSON: ${JSON.stringify(farmContext || {}, null, 2)}`,
    'Keep immediateActions and preventionPlan as arrays of 3 to 5 concise items each.',
    'Keep followUpQuestions as an array of questions only if more information would improve confidence.'
  ].join(' ');
}

function extractJsonObject(text) {
  const trimmed = (text || '').trim();

  if (!trimmed) {
    throw new Error('Gemini returned an empty response.');
  }

  try {
    return JSON.parse(trimmed);
  } catch (directParseError) {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw directParseError;
    }

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function normalizeCopilotResponse(parsed, fallbackContext = {}) {
  return {
    summary: parsed.summary || 'Crop image analyzed with limited confidence.',
    imageDescription: parsed.imageDescription || fallbackContext.imageDescription || 'No image description available.',
    likelyIssue: parsed.likelyIssue || 'Unclear',
    cropHealth: parsed.cropHealth || 'Unknown',
    severity: parsed.severity || 'Unknown',
    confidence: Number.isFinite(parsed.confidence) ? parsed.confidence : 0,
    immediateActions: normalizeArray(parsed.immediateActions),
    preventionPlan: normalizeArray(parsed.preventionPlan),
    followUpQuestions: normalizeArray(parsed.followUpQuestions),
    expertReview: Boolean(parsed.expertReview),
    notes: parsed.notes || fallbackContext.notes || ''
  };
}

function shouldRetryWithNextModel(error) {
  const status = error.response?.status;
  const message = `${error.response?.data?.error?.message || error.message || ''}`.toLowerCase();

  return (
    status === 404 ||
    status === 429 ||
    message.includes('quota exceeded') ||
    message.includes('rate limit') ||
    message.includes('retry in') ||
    message.includes('resource exhausted')
  );
}

async function analyzeCropImageWithGemini({ imageBuffer, mimeType, cropType, notes, farmContext }) {
  const apiKey = getGeminiApiKey();
  const prompt = buildSystemPrompt({ cropType, notes, farmContext });
  const models = getGeminiModels();

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBuffer.toString('base64')
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 900,
      responseMimeType: 'application/json'
    }
  };

  let lastError = null;
  let response = null;
  let selectedModel = models[0];

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      response = await axios.post(endpoint, requestBody, {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      selectedModel = model;
      break;
    } catch (error) {
      lastError = error;

      const upstreamStatus = error.response?.status;
      const upstreamMessage = error.response?.data?.error?.message || error.message;

      if (shouldRetryWithNextModel(error)) {
        continue;
      }

      error.message = `Gemini request failed for ${model}: ${upstreamMessage}`;
      throw error;
    }
  }

  if (!response) {
    const upstreamMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown Gemini error';
    const error = new Error(`All Gemini model attempts failed: ${upstreamMessage}`);
    error.response = lastError?.response;
    throw error;
  }

  const rawText = response.data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('') || '';

  const parsed = extractJsonObject(rawText);

  return {
    provider: 'gemini',
    model: selectedModel,
    rawText,
    result: normalizeCopilotResponse(parsed, { notes })
  };
}

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error('GROQ_API_KEY is not configured in backend .env');
    error.code = 'GROQ_CONFIG_MISSING';
    throw error;
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

async function analyzeCropImageWithGroq({ imageBuffer, mimeType, cropType, notes, farmContext }) {
  const client = getGroqClient();
  const base64Image = imageBuffer.toString('base64');

  const systemPrompt = [
    'You are AgroSense Crop Copilot for Indian farmers.',
    'Analyze the uploaded crop image and provide practical advisory guidance.',
    'Return ONLY valid JSON (no markdown, no code blocks) with these keys: summary, imageDescription, likelyIssue, cropHealth, severity, confidence, immediateActions, preventionPlan, followUpQuestions, expertReview, notes.',
    'severity: one of "low", "moderate", "high", "critical".',
    'confidence: a number from 0 to 100.',
    'Keep immediateActions and preventionPlan as arrays of 3–5 concise items each.',
    'Keep followUpQuestions as an array only if more info would improve confidence.',
    `Crop type: ${cropType || 'unknown'}`,
    notes ? `Farmer notes: ${notes}` : 'Farmer notes: none provided',
    `Farm context: ${JSON.stringify(farmContext || {})}`
  ].join(' ');

  const userPrompt = `Analyze this crop image (base64 preview: ${base64Image.slice(0, 50)}...) and provide crop health advisory in JSON format.`;

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1000
    });

    const rawText = response.choices?.[0]?.message?.content || '';

    if (!rawText) {
      throw new Error('Groq returned an empty response.');
    }

    const parsed = extractJsonObject(rawText);

    return {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      rawText,
      result: normalizeCopilotResponse(parsed, { notes })
    };
  } catch (error) {
    console.error('Groq crop analysis error:', error.message);
    throw error;
  }
}

async function analyzeCropImage({ imageBuffer, mimeType, cropType, notes, farmContext }) {
  try {
    return await analyzeCropImageWithGemini({ imageBuffer, mimeType, cropType, notes, farmContext });
  } catch (geminiError) {
    console.warn('Gemini failed, falling back to Groq:', geminiError.message);

    try {
      return await analyzeCropImageWithGroq({ imageBuffer, mimeType, cropType, notes, farmContext });
    } catch (groqError) {
      console.error('Both Gemini and Groq failed:', groqError.message);

      const combined = new Error(`Crop analysis unavailable: Gemini: ${geminiError.message} | Groq: ${groqError.message}`);
      combined.code = 'CROP_ANALYSIS_FAILED';
      throw combined;
    }
  }
}

module.exports = {
  analyzeCropImageWithGemini,
  analyzeCropImageWithGroq,
  analyzeCropImage
};