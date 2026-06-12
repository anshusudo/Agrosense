const Groq = require('groq-sdk');

const MODEL_NAME = 'llama-3.3-70b-versatile';
let groqClient = null;

function getClient() {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error('GROQ_API_KEY is not configured in backend .env');
    error.code = 'GROQ_CONFIG_MISSING';
    throw error;
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
}

function buildSystemPrompt(language) {
  const languageName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';

  return [
    'You are AgroSense AI assistant for Indian farmers.',
    `Reply in ${languageName}.`,
    'Give practical and concise advice based on the farm context provided.',
    'If data is missing, say what is missing before giving generic guidance.',
    'Never claim guaranteed outcomes.',
    'Do not provide unsafe chemical dosing without caution.',
    'Always include a short safety note: consult local agriculture expert for critical decisions.'
  ].join(' ');
}

function buildUserPrompt({ message, context }) {
  return [
    `Farmer question: ${message}`,
    'Farm context JSON:',
    JSON.stringify(context || {}, null, 2)
  ].join('\n');
}

async function askAgroChatbot({ message, context, language = 'en' }) {
  const client = getClient();

  try {
    const chatCompletion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: buildSystemPrompt(language) },
        { role: 'user', content: buildUserPrompt({ message, context }) }
      ],
      temperature: 0.4,
      max_tokens: 500
    });

    const reply = (chatCompletion.choices?.[0]?.message?.content || '').trim();

    return {
      reply: reply || 'I could not generate a response right now. Please try again.',
      model: MODEL_NAME,
      provider: 'groq',
      usage: chatCompletion.usage || null
    };
  } catch (error) {
    console.error('Groq raw error:', error.message, '| status:', error.status);

    if (error.status === 401) {
      const customError = new Error('Invalid Groq API key. Update GROQ_API_KEY in backend .env.');
      customError.code = 'GROQ_INVALID_KEY';
      throw customError;
    }

    if (error.status === 429) {
      const customError = new Error('Groq rate limit exceeded. Please try again in a moment.');
      customError.code = 'GROQ_RATE_LIMIT';
      throw customError;
    }

    throw error;
  }
}

async function getChatbotHealthStatus() {
  const configured = Boolean(process.env.GROQ_API_KEY);

  return {
    provider: 'groq',
    configured,
    reachable: configured,
    model: MODEL_NAME,
    modelAvailable: configured
  };
}

module.exports = {
  askAgroChatbot,
  getChatbotHealthStatus
};
