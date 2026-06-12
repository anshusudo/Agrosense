const PDFDocument = require('pdfkit');

function sanitizeText(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022]/g, '-')
    .replace(/[^\x20-\x7E\n\r°%₹]/g, '');
}

function formatCurrency(value) {
  const numValue = Number(value || 0);
  return `Rs. ${Math.round(numValue).toLocaleString('en-IN')}`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

function riskColor(level) {
  if (level === 'CRITICAL') return '#C62828';
  if (level === 'HIGH') return '#EF6C00';
  if (level === 'MODERATE') return '#F9A825';
  return '#2E7D32';
}

function sectionTitle(doc, title) {
  doc.moveDown(0.5);
  const y = doc.y;
  doc.rect(40, y, 515, 22).fill('#1E88E5');
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text(sanitizeText(title), 50, y + 6);
  doc.moveDown(1.6);
  doc.fillColor('#222222').font('Helvetica');
}

function metricCard(doc, x, y, width, label, value, color = '#1565C0') {
  doc.roundedRect(x, y, width, 54, 6).fillAndStroke('#F7FAFF', '#D7E6FF');
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#666666').text(sanitizeText(label), x + 10, y + 10, { width: width - 20 });
  doc.font('Helvetica-Bold').fontSize(14).fillColor(color).text(sanitizeText(value), x + 10, y + 24, { width: width - 20 });
}

function progressBar(doc, x, y, width, label, value, max = 100, color = '#43A047') {
  const safeValue = Math.max(0, Number(value || 0));
  const safeMax = Math.max(1, Number(max || 1));
  const ratio = Math.min(1, safeValue / safeMax);

  doc.font('Helvetica').fontSize(9).fillColor('#333333').text(sanitizeText(label), x, y);
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#333333').text(`${Math.round(safeValue)}`, x + width - 45, y);

  const barY = y + 12;
  doc.roundedRect(x, barY, width, 8, 3).fill('#ECEFF1');
  doc.roundedRect(x, barY, width * ratio, 8, 3).fill(color);
}

function drawRiskBand(doc, x, y, width, level, score) {
  const segments = [
    { label: 'LOW', color: '#2E7D32' },
    { label: 'MODERATE', color: '#F9A825' },
    { label: 'HIGH', color: '#EF6C00' },
    { label: 'CRITICAL', color: '#C62828' }
  ];

  const segmentWidth = width / segments.length;

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151').text('Risk Band', x, y - 12);
  segments.forEach((segment, index) => {
    const startX = x + index * segmentWidth;
    doc.roundedRect(startX, y, segmentWidth - 3, 16, 3).fill(segment.color);
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#FFFFFF').text(segment.label, startX, y + 5, {
      width: segmentWidth - 3,
      align: 'center'
    });
  });

  const safeScore = Math.max(0, Math.min(100, Number(score || 0)));
  const pointerX = x + (safeScore / 100) * width;
  doc.polygon(
    [pointerX, y + 20],
    [pointerX - 5, y + 28],
    [pointerX + 5, y + 28]
  ).fill('#111827');

  doc.font('Helvetica-Bold').fontSize(8).fillColor(riskColor(level)).text(
    `${level} (${Math.round(safeScore)}/100)`,
    x,
    y + 31,
    { width, align: 'center' }
  );
}

function rankBadgeStyle(rank) {
  if (rank === 1) return { fill: '#D97706', stroke: '#B45309', text: '#FFFFFF' };
  if (rank === 2) return { fill: '#64748B', stroke: '#475569', text: '#FFFFFF' };
  if (rank === 3) return { fill: '#0F766E', stroke: '#115E59', text: '#FFFFFF' };
  return { fill: '#E5E7EB', stroke: '#CBD5E1', text: '#334155' };
}

function safeText(doc, text, options = {}) {
  doc.text(sanitizeText(text), options.x, options.y, options);
}

function drawHeader(doc) {
  doc.font('Helvetica-Bold').fontSize(24).fillColor('#1B5E20').text('AGROSENSE', { align: 'center' });
  doc.font('Helvetica').fontSize(11).fillColor('#444444').text('Crop Recommendation Report', { align: 'center' });
  doc.font('Helvetica').fontSize(9).fillColor('#777777').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#D0D7DE');
  doc.moveDown(1);
}

function drawOverviewPage(doc, data) {
  drawHeader(doc);

  sectionTitle(doc, 'Farm Overview');
  doc.fontSize(10).font('Helvetica').fillColor('#222222');
  safeText(doc, `Crop: ${data.farm.crop}`, { x: 50 });
  safeText(doc, `Soil Type: ${data.farm.soilType}`, { x: 50 });
  safeText(doc, `Area: ${data.farm.area} acres`, { x: 50 });

  doc.moveDown(0.6);
  sectionTitle(doc, 'Weather Snapshot');
  safeText(doc, `Temperature: ${data.weather.temperature} C`, { x: 50 });
  safeText(doc, `Humidity: ${data.weather.humidity}%`, { x: 50 });
  safeText(doc, `Rainfall: ${data.weather.rainfall || 0} mm`, { x: 50 });
  safeText(doc, `Wind Speed: ${data.weather.windSpeed || 0} km/h`, { x: 50 });

  doc.moveDown(0.6);
  sectionTitle(doc, 'Primary Recommendation');
  const level = data.recommendation.riskLevel || 'LOW';
  const score = Number(data.recommendation.riskScore || 0);

  metricCard(doc, 50, doc.y, 155, 'Risk Level', level, riskColor(level));
  metricCard(doc, 220, doc.y, 155, 'Risk Score', `${score}/100`, riskColor(level));
  metricCard(doc, 390, doc.y, 155, 'Fertilizer Quantity', data.recommendation.quantity || 'N/A', '#1565C0');
  doc.moveDown(4);

  drawRiskBand(doc, 50, doc.y, 495, level, score);
  doc.moveDown(2.8);

  safeText(doc, `Fertilizer: ${data.recommendation.fertilizer || 'N/A'}`, { x: 50 });
  safeText(doc, `Irrigation: ${data.recommendation.irrigation || 'N/A'}`, { x: 50 });

  const advice = Array.isArray(data.recommendation.advice) ? data.recommendation.advice.slice(0, 5) : [];
  if (advice.length > 0) {
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#1E293B').text('Top Action Points', 50);
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    advice.forEach((item, index) => {
      safeText(doc, `${index + 1}. ${item}`, { x: 60 });
    });
  }

  const risks = Array.isArray(data.recommendation.risk) ? data.recommendation.risk.slice(0, 4) : [];
  if (risks.length > 0) {
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#B91C1C').text('Risk Alerts', 50);
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(9).fillColor('#7F1D1D');
    risks.forEach((item) => {
      safeText(doc, `- ${item}`, { x: 60 });
    });
  }

  const diseaseRisks = Array.isArray(data.recommendation.diseaseRisks)
    ? data.recommendation.diseaseRisks.slice(0, 3)
    : [];
  if (diseaseRisks.length > 0) {
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#6B21A8').text('Possible Diseases (if care is not taken)', 50);
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(9).fillColor('#4C1D95');
    diseaseRisks.forEach((item, index) => {
      safeText(
        doc,
        `${index + 1}. ${item.disease} (${item.likelihood}) - ${item.why}`,
        { x: 60, width: 485 }
      );
      safeText(doc, `Care gap alert: ${item.preventiveCare}`, { x: 70, width: 475 });
      doc.moveDown(0.15);
    });
  }
}

function drawStatisticsPage(doc, data) {
  doc.addPage();
  drawHeader(doc);

  sectionTitle(doc, 'Performance Metrics');
  const stats = data.statistics || {};

  metricCard(doc, 50, doc.y, 118, 'Environmental', `${Number(stats.environmentalScore || 0)}/100`, '#2E7D32');
  metricCard(doc, 181, doc.y, 118, 'Soil Health', `${Number(stats.soilHealthScore || 0)}/100`, '#1565C0');
  metricCard(doc, 312, doc.y, 118, 'Confidence', `${Number(stats.confidenceScore || 0)}%`, '#6A1B9A');
  metricCard(doc, 443, doc.y, 102, 'Risk', `${Number(stats.riskScore || 0)}/100`, '#EF6C00');
  doc.moveDown(4.2);

  sectionTitle(doc, 'Yield Analysis');
  const yieldData = stats.yieldAnalysis || {};
  const predicted = Number(yieldData.predicted || 0);
  const benchmark = Number(yieldData.benchmark || 0);

  progressBar(doc, 50, doc.y, 490, 'Predicted Yield (quintals)', predicted, Math.max(predicted, benchmark, 1), '#43A047');
  doc.moveDown(1.2);
  progressBar(doc, 50, doc.y, 490, 'Benchmark Yield (quintals)', benchmark, Math.max(predicted, benchmark, 1), '#1E88E5');
  doc.moveDown(1.3);

  doc.font('Helvetica').fontSize(9).fillColor('#333333');
  safeText(doc, `Efficiency: ${yieldData.efficiency || 0}%`, { x: 50 });
  safeText(doc, `Status: ${yieldData.comparison || 'N/A'}`, { x: 240, y: doc.y - 10 });

  sectionTitle(doc, 'Risk Distribution');
  const labels = stats.riskDistribution?.labels || [];
  const values = stats.riskDistribution?.data || [];

  if (labels.length === 0) {
    doc.font('Helvetica').fontSize(9).fillColor('#666666').text('No risk distribution data available.', 50);
  } else {
    labels.forEach((label, index) => {
      progressBar(doc, 50, doc.y, 490, `${label} (%)`, Number(values[index] || 0), 100, '#FB8C00');
      doc.moveDown(1.15);
    });
  }
}

function drawCropComparisonPage(doc, data) {
  doc.addPage();
  drawHeader(doc);
  sectionTitle(doc, 'Alternative Crops Comparison');

  const rows = Array.isArray(data.cropRecommendations)
    ? data.cropRecommendations
    : data.cropRecommendations && typeof data.cropRecommendations === 'object'
      ? Object.values(data.cropRecommendations)
      : [];
  if (rows.length === 0) {
    doc.font('Helvetica').fontSize(10).fillColor('#555555').text('No alternative crop recommendations available.', 50);
    return;
  }

  const rankedRows = [...rows]
    .sort((a, b) => Number(b.yieldAnalysis?.profit || 0) - Number(a.yieldAnalysis?.profit || 0))
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const tableStartY = doc.y;
  const colX = [50, 95, 240, 315, 385, 460];
  const widths = [40, 140, 70, 70, 70, 90];

  doc.rect(40, tableStartY, 515, 22).fill('#1565C0');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF');
  doc.text('Rank', colX[0], tableStartY + 7, { width: widths[0] });
  doc.text('Crop', colX[1], tableStartY + 7, { width: widths[1] });
  doc.text('Suitability', colX[2], tableStartY + 7, { width: widths[2] });
  doc.text('Yield (q)', colX[3], tableStartY + 7, { width: widths[3] });
  doc.text('Loss %', colX[4], tableStartY + 7, { width: widths[4] });
  doc.text('Profit', colX[5], tableStartY + 7, { width: widths[5] });

  doc.moveDown(1.8);

  let bestCrop = rankedRows[0];
  rankedRows.forEach((item) => {
    if ((item.yieldAnalysis?.profit || 0) > (bestCrop.yieldAnalysis?.profit || 0)) {
      bestCrop = item;
    }
  });

  rankedRows.forEach((item, index) => {
    const y = doc.y;
    const bg = index % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    doc.rect(40, y, 515, 22).fillAndStroke(bg, '#E2E8F0');

    const profit = Number(item.yieldAnalysis?.profit || 0);
    const profitColor = profit >= 0 ? '#2E7D32' : '#C62828';
    const badge = rankBadgeStyle(item.rank);

    doc.roundedRect(colX[0], y + 4, 28, 14, 4).fillAndStroke(badge.fill, badge.stroke);
    doc.font('Helvetica-Bold').fontSize(8).fillColor(badge.text).text(`#${item.rank}`, colX[0], y + 8, {
      width: 28,
      align: 'center'
    });

    doc.font('Helvetica').fontSize(9).fillColor('#1F2937');
    doc.text(sanitizeText(item.cropName || 'N/A'), colX[1], y + 7, { width: widths[1] });
    doc.text(`${Number(item.suitabilityScore || 0)}%`, colX[2], y + 7, { width: widths[2] });
    doc.text(`${Number(item.yieldAnalysis?.finalYieldQuintals || 0)}`, colX[3], y + 7, { width: widths[3] });
    doc.text(`${Number(item.yieldAnalysis?.lossPercentage || 0)}%`, colX[4], y + 7, { width: widths[4] });
    doc.font('Helvetica-Bold').fillColor(profitColor).text(formatNumber(profit), colX[5], y + 7, { width: widths[5] });

    doc.moveDown(1.5);
  });

  doc.moveDown(0.8);
  const boxY = doc.y;
  const boxHeight = 62;
  doc.roundedRect(40, boxY, 515, boxHeight, 6).fillAndStroke('#E8F5E9', '#81C784');

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#1B5E20').text('Best Profit Option', 50, boxY + 10, {
    width: 495
  });

  doc.font('Helvetica').fontSize(9).fillColor('#1B5E20').text(
    `${sanitizeText(bestCrop.cropName || 'N/A')} | Profit: ${formatCurrency(bestCrop.yieldAnalysis?.profit || 0)}`,
    50,
    boxY + 29,
    { width: 495 }
  );

  doc.font('Helvetica').fontSize(9).fillColor('#1B5E20').text(
    `Suitability: ${Number(bestCrop.suitabilityScore || 0)}%`,
    50,
    boxY + 44,
    { width: 495 }
  );

  doc.y = boxY + boxHeight + 6;
}

function drawFinalNotesPage(doc, data) {
  doc.addPage();
  drawHeader(doc);
  sectionTitle(doc, 'Recommended Next Steps');

  const steps = [
    'Prioritize the top profit crop only if suitability score is acceptable for your conditions.',
    'Use the fertilizer and irrigation schedule exactly as recommended in this report.',
    'Track pest, disease, and weather risks weekly and adjust practices early.',
    'Compare actual yield and cost against this report to improve future planning.',
    'Repeat recommendation analysis before major seasonal changes.'
  ];

  doc.font('Helvetica').fontSize(10).fillColor('#2D3748');
  steps.forEach((step, index) => {
    safeText(doc, `${index + 1}. ${step}`, { x: 50, width: 500 });
    doc.moveDown(0.35);
  });

  doc.moveDown(1.2);
  sectionTitle(doc, 'Quick Summary');

  const stats = data.statistics || {};
  const best = (data.cropRecommendations || []).reduce((prev, curr) => {
    if (!prev) return curr;
    return (curr.yieldAnalysis?.profit || 0) > (prev.yieldAnalysis?.profit || 0) ? curr : prev;
  }, null);

  doc.font('Helvetica').fontSize(10).fillColor('#1F2937');
  safeText(doc, `Primary Crop: ${data.farm.crop}`, { x: 50 });
  safeText(doc, `Risk Level: ${data.recommendation.riskLevel || 'N/A'} (${data.recommendation.riskScore || 0}/100)`, { x: 50 });
  safeText(doc, `Predicted Yield: ${stats.yieldAnalysis?.predicted || 0} quintals`, { x: 50 });
  safeText(doc, `Confidence: ${stats.confidenceScore || 0}%`, { x: 50 });

  if (best) {
    safeText(doc, `Top Alternative: ${best.cropName} with expected profit ${formatCurrency(best.yieldAnalysis?.profit || 0)}`, { x: 50, width: 500 });
  }

  const diseaseRisks = Array.isArray(data.recommendation.diseaseRisks)
    ? data.recommendation.diseaseRisks.slice(0, 2)
    : [];
  if (diseaseRisks.length > 0) {
    doc.moveDown(0.8);
    sectionTitle(doc, 'Disease Watch');
    doc.font('Helvetica').fontSize(9).fillColor('#4C1D95');
    diseaseRisks.forEach((item) => {
      safeText(
        doc,
        `- ${item.disease} (${item.likelihood}) | Preventive care: ${item.preventiveCare}`,
        { x: 50, width: 500 }
      );
      doc.moveDown(0.25);
    });
  }
}

async function generateEnhancedReport(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      drawOverviewPage(doc, data);
      drawStatisticsPage(doc, data);
      drawCropComparisonPage(doc, data);
      drawFinalNotesPage(doc, data);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function generateAIReport(data) {
  return generateEnhancedReport(data);
}

module.exports = { generateEnhancedReport, generateAIReport };
