// 📊 Analytics Engine for generating statistical insights

const { getTopCropsWithYieldAnalysis, calculateYieldAndLoss, normalizeCropName } = require('./recommendationEngine');

const cropDatabase = {
  wheat: { avgYield: 45, region: 'North India', seasons: ['Rabi'] },
  rice: { avgYield: 50, region: 'Eastern India', seasons: ['Kharif'] },
  corn: { avgYield: 40, region: 'Central India', seasons: ['Kharif', 'Rabi'] },
  cotton: { avgYield: 18, region: 'Western India', seasons: ['Kharif'] },
  sugarcane: { avgYield: 70, region: 'North India', seasons: ['Kharif', 'Rabi'] },
  barley: { avgYield: 40, region: 'North India', seasons: ['Rabi'] },
  pulses: { avgYield: 20, region: 'Central India', seasons: ['Kharif', 'Rabi'] },
  vegetables: { avgYield: 35, region: 'All Regions', seasons: ['Year-round'] },
  jowar: { avgYield: 28, region: 'Maharashtra & Central India', seasons: ['Kharif', 'Rabi'] },
  bajra: { avgYield: 22, region: 'Rajasthan & Gujarat', seasons: ['Kharif'] },
  soybean: { avgYield: 18, region: 'Madhya Pradesh & Maharashtra', seasons: ['Kharif'] },
  groundnut: { avgYield: 20, region: 'Gujarat & Andhra Pradesh', seasons: ['Kharif', 'Rabi'] },
  ragi: { avgYield: 18, region: 'Karnataka & Tamil Nadu', seasons: ['Kharif', 'Rabi'] },
  chickpea: { avgYield: 14, region: 'Madhya Pradesh & Rajasthan', seasons: ['Rabi'] },
  pigeonpea: { avgYield: 12, region: 'Maharashtra & Karnataka', seasons: ['Kharif'] },
  moong: { avgYield: 8, region: 'Rajasthan & Maharashtra', seasons: ['Kharif', 'Summer'] },
  urad: { avgYield: 9, region: 'Madhya Pradesh & Uttar Pradesh', seasons: ['Kharif'] },
  lentil: { avgYield: 10, region: 'Madhya Pradesh & Uttar Pradesh', seasons: ['Rabi'] },
  mustard: { avgYield: 12, region: 'Rajasthan & Haryana', seasons: ['Rabi'] },
  sunflower: { avgYield: 10, region: 'Karnataka & Maharashtra', seasons: ['Kharif', 'Rabi'] },
  sesame: { avgYield: 5, region: 'West Bengal & Gujarat', seasons: ['Kharif'] },
  potato: { avgYield: 80, region: 'Uttar Pradesh & West Bengal', seasons: ['Rabi'] },
  onion: { avgYield: 75, region: 'Maharashtra & Karnataka', seasons: ['Kharif', 'Rabi'] },
  tomato: { avgYield: 100, region: 'Andhra Pradesh & Karnataka', seasons: ['Year-round'] },
  chilli: { avgYield: 18, region: 'Andhra Pradesh & Telangana', seasons: ['Kharif', 'Rabi'] },
  turmeric: { avgYield: 25, region: 'Telangana & Maharashtra', seasons: ['Kharif'] },
  tea: { avgYield: 9, region: 'Assam & West Bengal', seasons: ['Perennial'] },
  coffee: { avgYield: 7, region: 'Karnataka & Kerala', seasons: ['Perennial'] },
  banana: { avgYield: 130, region: 'Tamil Nadu & Maharashtra', seasons: ['Year-round'] },
  coconut: { avgYield: 95, region: 'Kerala & Tamil Nadu', seasons: ['Perennial'] },
  mango: { avgYield: 60, region: 'Uttar Pradesh, Andhra Pradesh & Maharashtra', seasons: ['Perennial'] },
  grapes: { avgYield: 90, region: 'Maharashtra & Karnataka', seasons: ['Perennial'] },
  sapota: { avgYield: 70, region: 'Karnataka, Gujarat & Maharashtra', seasons: ['Perennial'] },
  papaya: { avgYield: 120, region: 'Andhra Pradesh, Gujarat & Maharashtra', seasons: ['Year-round'] },
  watermelon: { avgYield: 130, region: 'Karnataka, Tamil Nadu & Andhra Pradesh', seasons: ['Summer', 'Zaid'] },
  strawberry: { avgYield: 70, region: 'Maharashtra & Himachal Pradesh', seasons: ['Rabi', 'Winter'] },
  carrot: { avgYield: 95, region: 'Punjab, Haryana & Karnataka', seasons: ['Rabi', 'Winter'] }
};

/**
 * Generate comprehensive statistical analysis
 */
function generateStatistics(farmData, recommendation) {
  const crop = normalizeCropName(farmData.crop);
  const cropInfo = cropDatabase[crop] || { avgYield: 0, region: 'Unknown' };

  // 1. Risk Distribution Analysis
  const riskDistribution = calculateRiskDistribution(recommendation);

  // 2. Environmental Suitability Score
  const environmentalScore = calculateEnvironmentalScore(farmData, recommendation);

  // 3. Yield Prediction Analysis
  const yieldAnalysis = calculateYieldPrediction(farmData, cropInfo, recommendation);

  // 4. Weather Impact Assessment
  const weatherImpact = analyzeWeatherImpact(farmData.weather, recommendation);

  // 5. Soil Health Score
  const soilHealthScore = calculateSoilHealthScore(farmData.soilType, recommendation);

  // 6. Recommendation Confidence Score
  const confidenceScore = calculateConfidenceScore(recommendation, farmData);

  // 7. Fertilizer Efficiency Analysis
  const fertilizerAnalysis = analyzeFertilizerRequirements(farmData.area, recommendation);

  // 8. Irrigation Optimization
  const irrigationAnalysis = analyzeIrrigationNeeds(farmData, recommendation);

  return {
    riskDistribution,
    environmentalScore,
    yieldAnalysis,
    weatherImpact,
    soilHealthScore,
    confidenceScore,
    fertilizerAnalysis,
    irrigationAnalysis,
    timestamp: new Date().toISOString(),
    cropInfo
  };
}

/**
 * Calculate risk distribution for pie chart
 */
function calculateRiskDistribution(recommendation) {
  let temperature = 0, humidity = 0, rainfall = 0, soil = 0, wind = 0;

  recommendation.risk.forEach(factor => {
    if (factor.toLowerCase().includes('temperature')) temperature += 25;
    else if (factor.toLowerCase().includes('humidity')) humidity += 25;
    else if (factor.toLowerCase().includes('rainfall')) rainfall += 25;
    else if (factor.toLowerCase().includes('soil') || factor.toLowerCase().includes('waterlogging')) soil += 25;
    else if (factor.toLowerCase().includes('wind')) wind += 25;
  });

  const total = temperature + humidity + rainfall + soil + wind || 1;
  
  return {
    labels: ['Temperature', 'Humidity', 'Rainfall', 'Soil', 'Wind'],
    data: [
      Math.round((temperature / total) * 100),
      Math.round((humidity / total) * 100),
      Math.round((rainfall / total) * 100),
      Math.round((soil / total) * 100),
      Math.round((wind / total) * 100)
    ],
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
  };
}

/**
 * Calculate environmental suitability score
 */
function calculateEnvironmentalScore(farmData, recommendation) {
  let score = 100;

  // Deduct based on risk factors
  score -= recommendation.riskScore * 0.5; // Risk score impacts environmental score

  // Factor in advice count (more advice = less optimal conditions)
  if (recommendation.advice.length > 5) score -= 10;

  return Math.max(0, Math.round(score));
}

/**
 * Predict yield based on conditions
 */
function calculateYieldPrediction(farmData, cropInfo, recommendation) {
  let baseYield = cropInfo.avgYield || 40;
  let efficiency = 100;

  // Adjust based on environmental conditions
  if (recommendation.riskScore > 70) efficiency -= 40;
  else if (recommendation.riskScore > 50) efficiency -= 20;
  else if (recommendation.riskScore > 30) efficiency -= 10;

  const predictedYield = Math.round((baseYield * farmData.area * efficiency) / 100);
  const benchmarkYield = Math.round(baseYield * farmData.area);

  return {
    predicted: predictedYield,
    benchmark: benchmarkYield,
    efficiency: Math.max(0, Math.min(100, efficiency)),
    unit: 'quintals',
    comparison: predictedYield >= benchmarkYield ? 'Above Average' : 'Below Benchmark'
  };
}

/**
 * Analyze weather impact
 */
function analyzeWeatherImpact(weather, recommendation) {
  const impacts = {
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    overall: 0
  };

  const riskFactors = recommendation.risk || [];

  riskFactors.forEach(factor => {
    if (factor.toLowerCase().includes('temperature')) impacts.temperature = 1;
    if (factor.toLowerCase().includes('humidity')) impacts.humidity = 1;
    if (factor.toLowerCase().includes('rainfall')) impacts.rainfall = 1;
  });

  const affectedFactors = Object.values(impacts).filter(v => v === 1).length;
  impacts.overall = 100 - (affectedFactors * 25);

  return {
    temperature: weather.temperature || 'N/A',
    humidity: weather.humidity || 'N/A',
    rainfall: weather.rainfall || 'N/A',
    windSpeed: weather.windSpeed || 'N/A',
    impactScore: impacts.overall
  };
}

/**
 * Calculate soil health score
 */
function calculateSoilHealthScore(soilType, recommendation) {
  let score = 85;
  const soilKey = soilType.toLowerCase();

  if (soilKey === 'sandy') score = 65;
  else if (soilKey === 'clay') score = 70;
  else if (soilKey === 'loamy') score = 95;
  else if (soilKey === 'acidic') score = 60;
  else if (soilKey === 'alkaline') score = 65;

  // Adjust based on advice
  if (recommendation.advice.some(a => a.toLowerCase().includes('organic'))) score += 10;
  if (recommendation.advice.some(a => a.toLowerCase().includes('drainage'))) score -= 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate recommendation confidence score
 */
function calculateConfidenceScore(recommendation, farmData) {
  let confidence = 85;

  if (recommendation.riskLevel === 'CRITICAL') confidence -= 35;
  else if (recommendation.riskLevel === 'HIGH') confidence -= 20;
  else if (recommendation.riskLevel === 'MODERATE') confidence -= 10;

  // High confidence if data is complete
  if (farmData.weather.temperature && farmData.weather.humidity) confidence += 5;

  return Math.max(0, Math.min(100, confidence));
}

/**
 * Analyze fertilizer requirements
 */
function analyzeFertilizerRequirements(area, recommendation) {
  const quantityMatch = recommendation.quantity.match(/(\d+)/);
  const totalQuantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
  const perAcre = area > 0 ? Math.round(totalQuantity / area) : 0;

  return {
    fertilizer: recommendation.fertilizer,
    totalQuantity: totalQuantity,
    unit: 'kg',
    perAcre: perAcre,
    perAcreUnit: 'kg/acre',
    recommendedFrequency: 'Every 30 days',
    organicSupplement: '20-30% of total recommendation'
  };
}

/**
 * Analyze irrigation needs
 */
function analyzeIrrigationNeeds(farmData, recommendation) {
  const irrigationText = recommendation.irrigation.toLowerCase();
  let frequency = 'Every 7 days';
  let intensity = 'Moderate';

  if (irrigationText.includes('high') || irrigationText.includes('every 3')) {
    frequency = 'Every 3-5 days';
    intensity = 'High';
  } else if (irrigationText.includes('light') || irrigationText.includes('every 10')) {
    frequency = 'Every 10-14 days';
    intensity = 'Low';
  }

  const estimatedWaterNeeds = farmData.area * (intensity === 'High' ? 50 : intensity === 'Moderate' ? 35 : 20);

  return {
    schedule: recommendation.irrigation,
    frequency,
    intensity,
    estimatedWaterNeeds: Math.round(estimatedWaterNeeds),
    unit: 'liters per irrigation',
    adjustments: recommendation.advice.filter(a => a.toLowerCase().includes('irrigation'))
  };
}

/**
 * Generate performance metrics
 */
function generatePerformanceMetrics(statistics) {
  return {
    overallHealth: Math.round(
      (statistics.environmentalScore +
        statistics.soilHealthScore +
        statistics.confidenceScore) / 3
    ),
    yieldPotential: statistics.yieldAnalysis.efficiency,
    weatherResilience: statistics.weatherImpact.impactScore,
    managementComplexity: 100 - (statistics.advice?.length * 10 || 0)
  };
}

/**
 * Analyze alternative crop recommendations with yield and loss
 */
function analyzeCropRecommendations(weather, soilType, area) {
  try {
    const topCrops = getTopCropsWithYieldAnalysis(weather, soilType, area);
    
    return topCrops.map(crop => ({
      cropName: crop.name,
      suitabilityScore: crop.score,
      yieldAnalysis: crop.yieldAnalysis,
      recommendation: {
        reason: `Suitability Score: ${crop.score}%`,
        expectedProfit: crop.yieldAnalysis.profit,
        profitMargin: crop.yieldAnalysis.profitMargin
      }
    }));
  } catch (error) {
    console.error('Error analyzing crop recommendations:', error);
    return [];
  }
}

/**
 * Generate crop yield vs loss comparison data for charts
 */
function generateCropYieldLossData(cropRecommendations) {
  if (!cropRecommendations || cropRecommendations.length === 0) {
    return null;
  }

  return {
    crops: cropRecommendations.map(c => c.cropName),
    yieldData: cropRecommendations.map(c => c.yieldAnalysis.finalYieldQuintals),
    lossData: cropRecommendations.map(c => c.yieldAnalysis.lossQuintals),
    profitData: cropRecommendations.map(c => c.yieldAnalysis.profit),
    colors: ['#4CAF50', '#FF9800', '#2196F3', '#F44336'],
    chartData: {
      yieldAndLoss: {
        labels: cropRecommendations.map(c => c.cropName),
        datasets: [
          {
            label: 'Final Yield (Quintals)',
            data: cropRecommendations.map(c => c.yieldAnalysis.finalYieldQuintals),
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Loss (Quintals)',
            data: cropRecommendations.map(c => c.yieldAnalysis.lossQuintals),
            backgroundColor: '#FF6B6B'
          }
        ]
      },
      profitComparison: {
        labels: cropRecommendations.map(c => c.cropName),
        datasets: [{
          label: 'Net Profit (₹)',
          data: cropRecommendations.map(c => c.yieldAnalysis.profit),
          backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#F44336']
        }]
      },
      lossBreakdown: cropRecommendations.map(c => ({
        crop: c.cropName,
        pest: c.yieldAnalysis.lossBreakdown.pest,
        disease: c.yieldAnalysis.lossBreakdown.disease,
        weather: c.yieldAnalysis.lossBreakdown.weather
      }))
    }
  };
}

module.exports = {
  generateStatistics,
  generatePerformanceMetrics,
  calculateRiskDistribution,
  calculateEnvironmentalScore,
  calculateYieldPrediction,
  analyzeWeatherImpact,
  calculateSoilHealthScore,
  calculateConfidenceScore,
  analyzeFertilizerRequirements,
  analyzeIrrigationNeeds,
  analyzeCropRecommendations,
  generateCropYieldLossData
};
