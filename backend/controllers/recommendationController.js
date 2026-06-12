const Farm = require('../models/Farm');
const { getRecommendation, getTopCropsWithYieldAnalysis } = require('../services/recommendationEngine');
const { generateStatistics, analyzeCropRecommendations } = require('../services/analyticsEngine');
const { generateEnhancedReport } = require('../services/pdfServices');
const { sendAIReport } = require('../services/emailService');
const { getWeatherByCity } = require('../services/weatherService');

exports.getAIRecommendation = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    const city = farm.city;
    if (!city) {
      return res.status(400).json({ msg: 'Farm city is missing. Please update farm location.' });
    }

    const weather = await getWeatherByCity(city);

    const recommendation = getRecommendation({
      crop: farm.crop,
      soilType: farm.soilType,
      area: farm.area,
      weather
    });

    // Generate advanced statistics
    const statistics = generateStatistics(
      {
        crop: farm.crop,
        soilType: farm.soilType,
        area: farm.area,
        weather
      },
      recommendation
    );

    // Get alternative crop recommendations with yield analysis
    const cropRecommendations = analyzeCropRecommendations(
      weather,
      farm.soilType,
      farm.area
    );

    // Generate chart data for frontend visualization
    const chartData = {
      riskDistributionChart: {
        type: 'doughnut',
        labels: statistics.riskDistribution.labels,
        datasets: [{
          data: statistics.riskDistribution.data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          borderColor: '#fff',
          borderWidth: 2
        }],
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Risk Factor Distribution' }
          }
        }
      },

      healthScoreChart: {
        type: 'radar',
        labels: ['Environmental', 'Soil Health', 'Weather Impact', 'Confidence'],
        datasets: [{
          label: 'Farm Health Score',
          data: [
            statistics.environmentalScore,
            statistics.soilHealthScore,
            statistics.weatherImpact?.impactScore || 0,
            statistics.confidenceScore
          ],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#667eea'
        }],
        options: {
          responsive: true,
          scales: {
            r: { beginAtZero: true, max: 100 }
          }
        }
      },

      yieldComparisonChart: {
        type: 'bar',
        labels: ['Benchmark', 'Predicted'],
        datasets: [{
          label: 'Yield (Quintals)',
          data: [statistics.yieldAnalysis.benchmark, statistics.yieldAnalysis.predicted],
          backgroundColor: ['#36A2EB', statistics.yieldAnalysis.predicted >= statistics.yieldAnalysis.benchmark ? '#4BC0C0' : '#FF6384'],
          borderWidth: 1
        }],
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Yield Prediction Analysis' }
          },
          scales: { y: { beginAtZero: true } }
        }
      },

      soilHealthPieChart: {
        type: 'pie',
        labels: ['Healthy', 'Needs Improvement'],
        datasets: [{
          data: [statistics.soilHealthScore, 100 - statistics.soilHealthScore],
          backgroundColor: ['#4BC0C0', '#FFB6C1'],
          borderColor: '#fff',
          borderWidth: 2
        }],
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Soil Health Assessment' }
          }
        }
      },

      confidenceGaugeChart: {
        type: 'doughnut',
        labels: ['Confidence', 'Remaining'],
        datasets: [{
          data: [statistics.confidenceScore, 100 - statistics.confidenceScore],
          backgroundColor: [
            statistics.confidenceScore >= 80 ? '#4BC0C0' : 
            statistics.confidenceScore >= 60 ? '#FFCE56' : '#FF6384',
            '#e0e0e0'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }],
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: `Recommendation Confidence: ${statistics.confidenceScore}%` }
          }
        }
      }
    };

    res.json({
      farm: {
        crop: farm.crop,
        soilType: farm.soilType,
        city: farm.city,
        area: farm.area
      },
      weather,
      recommendation: {
        ...recommendation,
        statistics: {
          riskScore: recommendation.riskScore,
          riskLevel: recommendation.riskLevel,
          riskDistribution: statistics.riskDistribution,
          environmentalScore: statistics.environmentalScore,
          yieldAnalysis: statistics.yieldAnalysis,
          soilHealthScore: statistics.soilHealthScore,
          confidenceScore: statistics.confidenceScore,
          weatherImpact: statistics.weatherImpact,
          fertilizerAnalysis: statistics.fertilizerAnalysis,
          irrigationAnalysis: statistics.irrigationAnalysis
        }
      },
      cropRecommendations,
      statistics: {
        riskScore: recommendation.riskScore,
        riskLevel: recommendation.riskLevel,
        riskDistribution: statistics.riskDistribution,
        environmentalScore: statistics.environmentalScore,
        yieldAnalysis: statistics.yieldAnalysis,
        soilHealthScore: statistics.soilHealthScore,
        confidenceScore: statistics.confidenceScore,
        weatherImpact: statistics.weatherImpact,
        fertilizerAnalysis: statistics.fertilizerAnalysis,
        irrigationAnalysis: statistics.irrigationAnalysis
      },
      charts: chartData
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'AI recommendation failed' });
  }
};

exports.generateAndEmailReport = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    const city = farm.city;
    if (!city) {
      return res.status(400).json({ msg: 'Farm city is missing. Please update farm location.' });
    }
    const weather = await getWeatherByCity(city);

    // Get recommendation
    const recommendation = getRecommendation({
      crop: farm.crop,
      soilType: farm.soilType,
      area: farm.area,
      weather
    });

    // Generate statistics
    const statistics = generateStatistics(
      {
        crop: farm.crop,
        soilType: farm.soilType,
        area: farm.area,
        weather
      },
      recommendation
    );

    // Get alternative crop recommendations with yield analysis
    const cropRecommendations = analyzeCropRecommendations(
      weather,
      farm.soilType,
      farm.area
    );

    const farmData = {
      farm: {
        crop: farm.crop,
        soilType: farm.soilType,
        city: farm.city,
        area: farm.area
      },
      weather,
      recommendation,
      cropRecommendations,
      statistics
    };

    console.log('📄 Generating PDF...');
    // Generate PDF (text-based, no chart images)
    const pdfBuffer = await generateEnhancedReport(farmData);

    console.log('📧 Sending email with report...');
    // Prepare full statistics for email
    const statisticsForEmail = {
      recommendation,
      environmentalScore: statistics.environmentalScore,
      soilHealthScore: statistics.soilHealthScore,
      confidenceScore: statistics.confidenceScore,
      yieldAnalysis: statistics.yieldAnalysis,
      fertilizerAnalysis: statistics.fertilizerAnalysis,
      irrigationAnalysis: statistics.irrigationAnalysis,
      weatherImpact: statistics.weatherImpact
    };

    // Send email
    await sendAIReport(req.user.email, pdfBuffer, farmData, statisticsForEmail);

    res.json({
      msg: 'Report generated and sent successfully!',
      statistics: {
        riskScore: recommendation.riskScore,
        riskLevel: recommendation.riskLevel,
        environmentalScore: statistics.environmentalScore,
        yieldAnalysis: statistics.yieldAnalysis,
        soilHealthScore: statistics.soilHealthScore,
        confidenceScore: statistics.confidenceScore
      }
    });

  } catch (err) {
    console.error('Generate and email report error:', err);
    res.status(500).json({ msg: 'Failed to generate and send report', error: err.message });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    const city = farm.city;
    if (!city) {
      return res.status(400).json({ msg: 'Farm city is missing. Please update farm location.' });
    }
    const weather = await getWeatherByCity(city);

    const recommendation = getRecommendation({
      crop: farm.crop,
      soilType: farm.soilType,
      area: farm.area,
      weather
    });

    const statistics = generateStatistics(
      {
        crop: farm.crop,
        soilType: farm.soilType,
        area: farm.area,
        weather
      },
      recommendation
    );

    const cropRecommendations = analyzeCropRecommendations(
      weather,
      farm.soilType,
      farm.area
    );

    const farmData = {
      farm: {
        crop: farm.crop,
        soilType: farm.soilType,
        city: farm.city,
        area: farm.area
      },
      weather,
      recommendation,
      cropRecommendations,
      statistics
    };

    const pdfBuffer = await generateEnhancedReport(farmData);

    const cropName = String(farm.crop || 'crop').replace(/[^a-zA-Z0-9-_]/g, '_');
    const datePart = new Date().toISOString().slice(0, 10);
    const fileName = `AgroSense_Report_${cropName}_${datePart}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Download report error:', err);
    return res.status(500).json({ msg: 'Failed to generate report', error: err.message });
  }
};
