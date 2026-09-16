// 📈 Chart Generator Service using ChartJS Node Canvas

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 800;
const height = 400;

/**
 * Generate Risk Distribution Pie Chart
 */
async function generateRiskPieChart(riskDistribution) {
  try {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
      chartCallback: (ChartJS) => {
        // Register plugins if needed
      }
    });

    const configuration = {
      type: 'doughnut',
      data: {
        labels: riskDistribution.labels,
        datasets: [
          {
            data: riskDistribution.data,
            backgroundColor: riskDistribution.colors,
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: { size: 12 }
            }
          },
          title: {
            display: true,
            text: 'Risk Factor Distribution',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    };

    const image = await chartJSNodeCanvas.drawChart(configuration);
    return image;
  } catch (error) {
    console.error('Error generating risk pie chart:', error);
    throw error;
  }
}

/**
 * Generate Yield Prediction Bar Chart
 */
async function generateYieldChart(yieldAnalysis) {
  try {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
      type: 'bar',
      data: {
        labels: ['Benchmark Yield', 'Predicted Yield'],
        datasets: [
          {
            label: 'Yield (Quintals)',
            data: [yieldAnalysis.benchmark, yieldAnalysis.predicted],
            backgroundColor: [
              '#36A2EB',
              yieldAnalysis.predicted >= yieldAnalysis.benchmark ? '#4BC0C0' : '#FF6384'
            ],
            borderColor: ['#36A2EB', yieldAnalysis.predicted >= yieldAnalysis.benchmark ? '#4BC0C0' : '#FF6384'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Yield Prediction Analysis',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            labels: { padding: 15 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quintals'
            }
          }
        }
      }
    };

    const image = await chartJSNodeCanvas.drawChart(configuration);
    return image;
  } catch (error) {
    console.error('Error generating yield chart:', error);
    throw error;
  }
}

/**
 * Generate Health Score Radar Chart
 */
async function generateHealthScoreChart(statistics) {
  try {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const metrics = [
      statistics.environmentalScore || 0,
      statistics.soilHealthScore || 0,
      statistics.confidenceScore || 0,
      statistics.weatherImpact?.impactScore || 0,
      100 - (statistics.recommendation?.riskScore || 0)
    ];

    const configuration = {
      type: 'radar',
      data: {
        labels: ['Environmental', 'Soil Health', 'Confidence', 'Weather Impact', 'Risk Mitigation'],
        datasets: [
          {
            label: 'Overall Health Score',
            data: metrics,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Farm Health Score',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            labels: { padding: 15 }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    };

    const image = await chartJSNodeCanvas.drawChart(configuration);
    return image;
  } catch (error) {
    console.error('Error generating health score chart:', error);
    throw error;
  }
}

/**
 * Generate Fertilizer & Irrigation Requirements Chart
 */
async function generateResourcesChart(statistics) {
  try {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Irrigation (Liters)',
            data: [
              statistics.irrigationAnalysis?.estimatedWaterNeeds || 0,
              statistics.irrigationAnalysis?.estimatedWaterNeeds || 0,
              statistics.irrigationAnalysis?.estimatedWaterNeeds || 0,
              statistics.irrigationAnalysis?.estimatedWaterNeeds || 0
            ],
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Fertilizer (g/sq.m)',
            data: [
              statistics.fertilizerAnalysis?.perAcre || 0,
              (statistics.fertilizerAnalysis?.perAcre || 0) * 0.8,
              (statistics.fertilizerAnalysis?.perAcre || 0) * 0.6,
              (statistics.fertilizerAnalysis?.perAcre || 0) * 0.4
            ],
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Resource Management Schedule',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            position: 'bottom',
            labels: { padding: 15 }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const image = await chartJSNodeCanvas.drawChart(configuration);
    return image;
  } catch (error) {
    console.error('Error generating resources chart:', error);
    throw error;
  }
}

/**
 * Generate Confidence Score Gauge Chart
 */
async function generateConfidenceGaugeChart(statistics) {
  try {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const score = statistics.confidenceScore || 0;
    const colors = score >= 80 ? '#4BC0C0' : score >= 60 ? '#FFCE56' : '#FF6384';

    const configuration = {
      type: 'doughnut',
      data: {
        labels: ['Confidence Level', 'Remaining'],
        datasets: [
          {
            data: [score, 100 - score],
            backgroundColor: [colors, '#e0e0e0'],
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Recommendation Confidence: ${score}%`,
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: false
          }
        }
      }
    };

    const image = await chartJSNodeCanvas.drawChart(configuration);
    return image;
  } catch (error) {
    console.error('Error generating confidence gauge chart:', error);
    throw error;
  }
}

/**
 * Generate all charts and return as buffer objects
 */
async function generateAllCharts(statistics) {
  try {
    const charts = {};

    // Generate all charts
    charts.riskDistribution = await generateRiskPieChart(statistics.riskDistribution);
    charts.yieldPrediction = await generateYieldChart(statistics.yieldAnalysis);
    charts.healthScore = await generateHealthScoreChart(statistics);
    charts.resources = await generateResourcesChart(statistics);
    charts.confidence = await generateConfidenceGaugeChart(statistics);

    return charts;
  } catch (error) {
    console.error('Error generating all charts:', error);
    throw error;
  }
}

module.exports = {
  generateRiskPieChart,
  generateYieldChart,
  generateHealthScoreChart,
  generateResourcesChart,
  generateConfidenceGaugeChart,
  generateAllCharts
};
