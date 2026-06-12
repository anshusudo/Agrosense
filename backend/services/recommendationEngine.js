// 🌾 Comprehensive crop database with requirements and yield data
const cropDatabase = {
  wheat: {
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 40, max: 70 },
    optimalRainfall: { min: 400, max: 600 },
    defaultFertilizer: 'NPK 20-20-20',
    quantityPerAcre: 50,
    irrigationDays: 7,
    baseIrrigation: 'Moderate irrigation every 7 days',
    growthPeriod: '120 days',
    avgYield: 45,
    pricePerQuintal: 2500,
    costPerAcre: 8000,
    region: 'North India',
    seasons: ['Rabi'],
    lossFactors: { pest: 8, disease: 12, weather: 10 }
  },
  rice: {
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 70, max: 95 },
    optimalRainfall: { min: 1000, max: 1500 },
    defaultFertilizer: 'Urea + DAP',
    quantityPerAcre: 60,
    irrigationDays: 3,
    baseIrrigation: 'High irrigation, maintain water level',
    growthPeriod: '120-150 days',
    avgYield: 50,
    pricePerQuintal: 3100,
    costPerAcre: 10000,
    region: 'Eastern India',
    seasons: ['Kharif'],
    lossFactors: { pest: 12, disease: 15, weather: 8 }
  },
  corn: {
    optimalTemp: { min: 18, max: 28 },
    optimalHumidity: { min: 50, max: 75 },
    optimalRainfall: { min: 500, max: 750 },
    defaultFertilizer: 'NPK 18-46-0',
    quantityPerAcre: 45,
    irrigationDays: 5,
    baseIrrigation: 'Moderate irrigation every 5 days',
    growthPeriod: '90-120 days',
    avgYield: 40,
    pricePerQuintal: 2000,
    costPerAcre: 7500,
    region: 'Central India',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 10, disease: 8, weather: 9 }
  },
  cotton: {
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 45, max: 70 },
    optimalRainfall: { min: 600, max: 900 },
    defaultFertilizer: 'NPK 16-8-24',
    quantityPerAcre: 40,
    irrigationDays: 7,
    baseIrrigation: 'Moderate to low irrigation every 7-10 days',
    growthPeriod: '150-180 days',
    avgYield: 18,
    pricePerQuintal: 5500,
    costPerAcre: 12000,
    region: 'Western India',
    seasons: ['Kharif'],
    lossFactors: { pest: 15, disease: 10, weather: 12 }
  },
  sugarcane: {
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 60, max: 85 },
    optimalRainfall: { min: 1000, max: 2500 },
    defaultFertilizer: 'NPK 0-0-40 + N',
    quantityPerAcre: 80,
    irrigationDays: 5,
    baseIrrigation: 'Heavy irrigation every 5-7 days',
    growthPeriod: '12 months',
    avgYield: 70,
    pricePerQuintal: 1800,
    costPerAcre: 14000,
    region: 'North India',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 9, disease: 11, weather: 7 }
  },
  barley: {
    optimalTemp: { min: 12, max: 22 },
    optimalHumidity: { min: 40, max: 65 },
    optimalRainfall: { min: 300, max: 500 },
    defaultFertilizer: 'NPK 20-10-10',
    quantityPerAcre: 35,
    irrigationDays: 10,
    baseIrrigation: 'Light irrigation every 10 days',
    growthPeriod: '110-140 days',
    avgYield: 40,
    pricePerQuintal: 2200,
    costPerAcre: 6500,
    region: 'North India',
    seasons: ['Rabi'],
    lossFactors: { pest: 6, disease: 8, weather: 10 }
  },
  pulses: {
    optimalTemp: { min: 18, max: 28 },
    optimalHumidity: { min: 50, max: 70 },
    optimalRainfall: { min: 500, max: 750 },
    defaultFertilizer: 'NPK 0-12-40',
    quantityPerAcre: 25,
    irrigationDays: 14,
    baseIrrigation: 'Light irrigation every 14 days',
    growthPeriod: '90-120 days',
    avgYield: 20,
    pricePerQuintal: 5000,
    costPerAcre: 5500,
    region: 'Central India',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 8, disease: 10, weather: 9 }
  },
  vegetables: {
    optimalTemp: { min: 18, max: 28 },
    optimalHumidity: { min: 60, max: 80 },
    optimalRainfall: { min: 400, max: 600 },
    defaultFertilizer: 'NPK 30-10-10',
    quantityPerAcre: 55,
    irrigationDays: 3,
    baseIrrigation: 'Regular irrigation every 2-3 days',
    growthPeriod: '60-120 days',
    avgYield: 35,
    pricePerQuintal: 3500,
    costPerAcre: 8500,
    region: 'All Regions',
    seasons: ['Year-round'],
    lossFactors: { pest: 12, disease: 14, weather: 11 }
  },
  jowar: {
    optimalTemp: { min: 24, max: 34 },
    optimalHumidity: { min: 40, max: 65 },
    optimalRainfall: { min: 400, max: 700 },
    defaultFertilizer: 'NPK 40-20-0',
    quantityPerAcre: 35,
    irrigationDays: 8,
    baseIrrigation: 'Moderate irrigation every 7-8 days',
    growthPeriod: '100-120 days',
    avgYield: 28,
    pricePerQuintal: 3000,
    costPerAcre: 6500,
    region: 'Maharashtra & Central India',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 9, disease: 10, weather: 11 }
  },
  bajra: {
    optimalTemp: { min: 24, max: 35 },
    optimalHumidity: { min: 35, max: 60 },
    optimalRainfall: { min: 300, max: 600 },
    defaultFertilizer: 'NPK 40-20-20',
    quantityPerAcre: 30,
    irrigationDays: 9,
    baseIrrigation: 'Light to moderate irrigation every 8-10 days',
    growthPeriod: '75-100 days',
    avgYield: 22,
    pricePerQuintal: 2600,
    costPerAcre: 5500,
    region: 'Rajasthan & Gujarat',
    seasons: ['Kharif'],
    lossFactors: { pest: 8, disease: 9, weather: 10 }
  },
  soybean: {
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 50, max: 75 },
    optimalRainfall: { min: 600, max: 1000 },
    defaultFertilizer: 'NPK 20-40-20',
    quantityPerAcre: 45,
    irrigationDays: 6,
    baseIrrigation: 'Moderate irrigation every 5-6 days',
    growthPeriod: '90-120 days',
    avgYield: 18,
    pricePerQuintal: 4500,
    costPerAcre: 7000,
    region: 'Madhya Pradesh & Maharashtra',
    seasons: ['Kharif'],
    lossFactors: { pest: 10, disease: 12, weather: 9 }
  },
  groundnut: {
    optimalTemp: { min: 22, max: 30 },
    optimalHumidity: { min: 50, max: 70 },
    optimalRainfall: { min: 500, max: 900 },
    defaultFertilizer: 'Gypsum + SSP',
    quantityPerAcre: 35,
    irrigationDays: 7,
    baseIrrigation: 'Moderate irrigation every 6-7 days',
    growthPeriod: '100-130 days',
    avgYield: 20,
    pricePerQuintal: 6000,
    costPerAcre: 8500,
    region: 'Gujarat & Andhra Pradesh',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 11, disease: 10, weather: 8 }
  },
  ragi: {
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 45, max: 70 },
    optimalRainfall: { min: 500, max: 900 },
    defaultFertilizer: 'NPK 40-20-20',
    quantityPerAcre: 30,
    irrigationDays: 8,
    baseIrrigation: 'Moderate irrigation every 7-8 days',
    growthPeriod: '95-120 days',
    avgYield: 18,
    pricePerQuintal: 3400,
    costPerAcre: 6000,
    region: 'Karnataka & Tamil Nadu',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 7, disease: 9, weather: 10 }
  },
  chickpea: {
    optimalTemp: { min: 18, max: 30 },
    optimalHumidity: { min: 35, max: 60 },
    optimalRainfall: { min: 400, max: 700 },
    defaultFertilizer: 'DAP + SSP',
    quantityPerAcre: 28,
    irrigationDays: 12,
    baseIrrigation: 'Light irrigation every 10-12 days',
    growthPeriod: '100-120 days',
    avgYield: 14,
    pricePerQuintal: 5500,
    costPerAcre: 5200,
    region: 'Madhya Pradesh & Rajasthan',
    seasons: ['Rabi'],
    lossFactors: { pest: 9, disease: 11, weather: 8 }
  },
  pigeonpea: {
    optimalTemp: { min: 20, max: 33 },
    optimalHumidity: { min: 45, max: 70 },
    optimalRainfall: { min: 600, max: 1000 },
    defaultFertilizer: 'NPK 20-50-20',
    quantityPerAcre: 30,
    irrigationDays: 11,
    baseIrrigation: 'Moderate irrigation every 10-12 days',
    growthPeriod: '150-180 days',
    avgYield: 12,
    pricePerQuintal: 7000,
    costPerAcre: 6500,
    region: 'Maharashtra & Karnataka',
    seasons: ['Kharif'],
    lossFactors: { pest: 12, disease: 11, weather: 10 }
  },
  moong: {
    optimalTemp: { min: 22, max: 35 },
    optimalHumidity: { min: 40, max: 65 },
    optimalRainfall: { min: 450, max: 800 },
    defaultFertilizer: 'NPK 15-40-20',
    quantityPerAcre: 22,
    irrigationDays: 9,
    baseIrrigation: 'Light irrigation every 8-10 days',
    growthPeriod: '65-90 days',
    avgYield: 8,
    pricePerQuintal: 7500,
    costPerAcre: 4800,
    region: 'Rajasthan & Maharashtra',
    seasons: ['Kharif', 'Summer'],
    lossFactors: { pest: 8, disease: 9, weather: 9 }
  },
  urad: {
    optimalTemp: { min: 24, max: 34 },
    optimalHumidity: { min: 45, max: 70 },
    optimalRainfall: { min: 500, max: 900 },
    defaultFertilizer: 'NPK 20-40-20',
    quantityPerAcre: 24,
    irrigationDays: 9,
    baseIrrigation: 'Light irrigation every 8-10 days',
    growthPeriod: '80-100 days',
    avgYield: 9,
    pricePerQuintal: 7000,
    costPerAcre: 5000,
    region: 'Madhya Pradesh & Uttar Pradesh',
    seasons: ['Kharif'],
    lossFactors: { pest: 9, disease: 10, weather: 9 }
  },
  lentil: {
    optimalTemp: { min: 18, max: 28 },
    optimalHumidity: { min: 35, max: 60 },
    optimalRainfall: { min: 350, max: 650 },
    defaultFertilizer: 'DAP + Potash',
    quantityPerAcre: 22,
    irrigationDays: 13,
    baseIrrigation: 'Light irrigation every 12-14 days',
    growthPeriod: '100-120 days',
    avgYield: 10,
    pricePerQuintal: 6500,
    costPerAcre: 4500,
    region: 'Madhya Pradesh & Uttar Pradesh',
    seasons: ['Rabi'],
    lossFactors: { pest: 7, disease: 9, weather: 8 }
  },
  mustard: {
    optimalTemp: { min: 15, max: 28 },
    optimalHumidity: { min: 35, max: 60 },
    optimalRainfall: { min: 300, max: 500 },
    defaultFertilizer: 'NPK 80-40-40 + Sulphur',
    quantityPerAcre: 26,
    irrigationDays: 12,
    baseIrrigation: 'Light irrigation every 10-12 days',
    growthPeriod: '110-140 days',
    avgYield: 12,
    pricePerQuintal: 6200,
    costPerAcre: 6000,
    region: 'Rajasthan & Haryana',
    seasons: ['Rabi'],
    lossFactors: { pest: 8, disease: 10, weather: 8 }
  },
  sunflower: {
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 40, max: 65 },
    optimalRainfall: { min: 500, max: 800 },
    defaultFertilizer: 'NPK 60-40-40',
    quantityPerAcre: 30,
    irrigationDays: 8,
    baseIrrigation: 'Moderate irrigation every 7-8 days',
    growthPeriod: '90-120 days',
    avgYield: 10,
    pricePerQuintal: 5200,
    costPerAcre: 6200,
    region: 'Karnataka & Maharashtra',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 8, disease: 9, weather: 9 }
  },
  sesame: {
    optimalTemp: { min: 24, max: 35 },
    optimalHumidity: { min: 40, max: 65 },
    optimalRainfall: { min: 400, max: 700 },
    defaultFertilizer: 'NPK 25-25-20',
    quantityPerAcre: 20,
    irrigationDays: 10,
    baseIrrigation: 'Light irrigation every 9-10 days',
    growthPeriod: '80-100 days',
    avgYield: 5,
    pricePerQuintal: 9000,
    costPerAcre: 4200,
    region: 'West Bengal & Gujarat',
    seasons: ['Kharif'],
    lossFactors: { pest: 7, disease: 8, weather: 9 }
  },
  potato: {
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 55, max: 80 },
    optimalRainfall: { min: 500, max: 750 },
    defaultFertilizer: 'NPK 10-26-26',
    quantityPerAcre: 70,
    irrigationDays: 5,
    baseIrrigation: 'Moderate irrigation every 4-5 days',
    growthPeriod: '90-120 days',
    avgYield: 80,
    pricePerQuintal: 1400,
    costPerAcre: 18000,
    region: 'Uttar Pradesh & West Bengal',
    seasons: ['Rabi'],
    lossFactors: { pest: 11, disease: 13, weather: 9 }
  },
  onion: {
    optimalTemp: { min: 18, max: 30 },
    optimalHumidity: { min: 50, max: 75 },
    optimalRainfall: { min: 600, max: 900 },
    defaultFertilizer: 'NPK 20-20-20 + micronutrients',
    quantityPerAcre: 55,
    irrigationDays: 4,
    baseIrrigation: 'Regular irrigation every 3-4 days',
    growthPeriod: '100-140 days',
    avgYield: 75,
    pricePerQuintal: 1800,
    costPerAcre: 16000,
    region: 'Maharashtra & Karnataka',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 10, disease: 12, weather: 10 }
  },
  tomato: {
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 55, max: 80 },
    optimalRainfall: { min: 500, max: 800 },
    defaultFertilizer: 'NPK 19-19-19 + Calcium',
    quantityPerAcre: 60,
    irrigationDays: 3,
    baseIrrigation: 'Frequent irrigation every 2-3 days',
    growthPeriod: '90-120 days',
    avgYield: 100,
    pricePerQuintal: 1200,
    costPerAcre: 20000,
    region: 'Andhra Pradesh & Karnataka',
    seasons: ['Year-round'],
    lossFactors: { pest: 12, disease: 14, weather: 11 }
  },
  chilli: {
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 50, max: 75 },
    optimalRainfall: { min: 600, max: 1000 },
    defaultFertilizer: 'NPK 20-20-20 + Potash',
    quantityPerAcre: 40,
    irrigationDays: 5,
    baseIrrigation: 'Moderate irrigation every 4-5 days',
    growthPeriod: '120-180 days',
    avgYield: 18,
    pricePerQuintal: 9000,
    costPerAcre: 22000,
    region: 'Andhra Pradesh & Telangana',
    seasons: ['Kharif', 'Rabi'],
    lossFactors: { pest: 13, disease: 14, weather: 10 }
  },
  turmeric: {
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 60, max: 85 },
    optimalRainfall: { min: 1000, max: 1500 },
    defaultFertilizer: 'Organic manure + NPK 30-30-60',
    quantityPerAcre: 65,
    irrigationDays: 6,
    baseIrrigation: 'Moderate irrigation every 5-6 days',
    growthPeriod: '210-300 days',
    avgYield: 25,
    pricePerQuintal: 7000,
    costPerAcre: 26000,
    region: 'Telangana & Maharashtra',
    seasons: ['Kharif'],
    lossFactors: { pest: 9, disease: 11, weather: 9 }
  },
  tea: {
    optimalTemp: { min: 18, max: 30 },
    optimalHumidity: { min: 70, max: 95 },
    optimalRainfall: { min: 1500, max: 3000 },
    defaultFertilizer: 'NPK 10-5-20 + organic mulch',
    quantityPerAcre: 50,
    irrigationDays: 7,
    baseIrrigation: 'Supplemental irrigation every 7 days in dry spells',
    growthPeriod: 'Perennial (commercial plucking after establishment)',
    avgYield: 9,
    pricePerQuintal: 20000,
    costPerAcre: 32000,
    region: 'Assam & West Bengal',
    seasons: ['Perennial'],
    lossFactors: { pest: 10, disease: 12, weather: 9 }
  },
  coffee: {
    optimalTemp: { min: 18, max: 28 },
    optimalHumidity: { min: 60, max: 85 },
    optimalRainfall: { min: 1200, max: 2500 },
    defaultFertilizer: 'NPK 30-10-30 + compost',
    quantityPerAcre: 45,
    irrigationDays: 8,
    baseIrrigation: 'Moderate irrigation every 7-8 days during dry months',
    growthPeriod: 'Perennial (bearing starts after establishment)',
    avgYield: 7,
    pricePerQuintal: 28000,
    costPerAcre: 30000,
    region: 'Karnataka & Kerala',
    seasons: ['Perennial'],
    lossFactors: { pest: 11, disease: 12, weather: 8 }
  },
  banana: {
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 60, max: 90 },
    optimalRainfall: { min: 1000, max: 2500 },
    defaultFertilizer: 'NPK 10-10-20 + organic manure',
    quantityPerAcre: 90,
    irrigationDays: 3,
    baseIrrigation: 'Regular irrigation every 2-3 days',
    growthPeriod: '10-14 months',
    avgYield: 130,
    pricePerQuintal: 1600,
    costPerAcre: 28000,
    region: 'Tamil Nadu & Maharashtra',
    seasons: ['Year-round'],
    lossFactors: { pest: 11, disease: 12, weather: 9 }
  },
  coconut: {
    optimalTemp: { min: 22, max: 34 },
    optimalHumidity: { min: 60, max: 90 },
    optimalRainfall: { min: 1000, max: 2500 },
    defaultFertilizer: 'NPK 0.5-0.32-1.2 kg/tree equivalent',
    quantityPerAcre: 35,
    irrigationDays: 7,
    baseIrrigation: 'Moderate irrigation every 6-7 days in dry periods',
    growthPeriod: 'Perennial',
    avgYield: 95,
    pricePerQuintal: 3000,
    costPerAcre: 18000,
    region: 'Kerala & Tamil Nadu',
    seasons: ['Perennial'],
    lossFactors: { pest: 9, disease: 10, weather: 8 }
  },
  mango: {
    optimalTemp: { min: 24, max: 35 },
    optimalHumidity: { min: 50, max: 80 },
    optimalRainfall: { min: 750, max: 2500 },
    defaultFertilizer: 'NPK 100-50-100 + organic manure',
    quantityPerAcre: 40,
    irrigationDays: 10,
    baseIrrigation: 'Moderate irrigation every 7-10 days during dry periods',
    growthPeriod: 'Perennial (bearing after establishment)',
    avgYield: 60,
    pricePerQuintal: 3000,
    costPerAcre: 22000,
    region: 'Uttar Pradesh, Andhra Pradesh & Maharashtra',
    seasons: ['Perennial'],
    lossFactors: { pest: 10, disease: 11, weather: 9 }
  },
  grapes: {
    optimalTemp: { min: 18, max: 32 },
    optimalHumidity: { min: 45, max: 70 },
    optimalRainfall: { min: 500, max: 900 },
    defaultFertilizer: 'NPK 19-19-19 + micronutrients',
    quantityPerAcre: 55,
    irrigationDays: 4,
    baseIrrigation: 'Frequent irrigation every 3-4 days',
    growthPeriod: 'Perennial',
    avgYield: 90,
    pricePerQuintal: 4500,
    costPerAcre: 35000,
    region: 'Maharashtra & Karnataka',
    seasons: ['Perennial'],
    lossFactors: { pest: 12, disease: 13, weather: 10 }
  },
  sapota: {
    optimalTemp: { min: 22, max: 34 },
    optimalHumidity: { min: 50, max: 80 },
    optimalRainfall: { min: 800, max: 1500 },
    defaultFertilizer: 'NPK 8-8-16 + organic compost',
    quantityPerAcre: 45,
    irrigationDays: 7,
    baseIrrigation: 'Moderate irrigation every 6-7 days',
    growthPeriod: 'Perennial',
    avgYield: 70,
    pricePerQuintal: 3200,
    costPerAcre: 24000,
    region: 'Karnataka, Gujarat & Maharashtra',
    seasons: ['Perennial'],
    lossFactors: { pest: 10, disease: 10, weather: 8 }
  },
  papaya: {
    optimalTemp: { min: 22, max: 34 },
    optimalHumidity: { min: 55, max: 80 },
    optimalRainfall: { min: 700, max: 1500 },
    defaultFertilizer: 'NPK 15-15-15 + organic manure',
    quantityPerAcre: 50,
    irrigationDays: 5,
    baseIrrigation: 'Regular irrigation every 4-5 days',
    growthPeriod: '8-12 months',
    avgYield: 120,
    pricePerQuintal: 1800,
    costPerAcre: 20000,
    region: 'Andhra Pradesh, Gujarat & Maharashtra',
    seasons: ['Year-round'],
    lossFactors: { pest: 11, disease: 12, weather: 9 }
  },
  watermelon: {
    optimalTemp: { min: 24, max: 35 },
    optimalHumidity: { min: 45, max: 70 },
    optimalRainfall: { min: 400, max: 700 },
    defaultFertilizer: 'NPK 20-20-20 + Potash',
    quantityPerAcre: 35,
    irrigationDays: 4,
    baseIrrigation: 'Frequent irrigation every 3-4 days',
    growthPeriod: '80-100 days',
    avgYield: 130,
    pricePerQuintal: 1200,
    costPerAcre: 16000,
    region: 'Karnataka, Tamil Nadu & Andhra Pradesh',
    seasons: ['Summer', 'Zaid'],
    lossFactors: { pest: 9, disease: 10, weather: 9 }
  },
  strawberry: {
    optimalTemp: { min: 12, max: 26 },
    optimalHumidity: { min: 55, max: 80 },
    optimalRainfall: { min: 500, max: 1000 },
    defaultFertilizer: 'NPK 12-12-17 + calcium nitrate',
    quantityPerAcre: 45,
    irrigationDays: 3,
    baseIrrigation: 'Frequent light irrigation every 2-3 days',
    growthPeriod: '120-150 days',
    avgYield: 70,
    pricePerQuintal: 9000,
    costPerAcre: 45000,
    region: 'Maharashtra & Himachal Pradesh',
    seasons: ['Rabi', 'Winter'],
    lossFactors: { pest: 12, disease: 13, weather: 10 }
  },
  carrot: {
    optimalTemp: { min: 15, max: 28 },
    optimalHumidity: { min: 50, max: 75 },
    optimalRainfall: { min: 500, max: 900 },
    defaultFertilizer: 'NPK 40-20-20',
    quantityPerAcre: 35,
    irrigationDays: 6,
    baseIrrigation: 'Moderate irrigation every 5-6 days',
    growthPeriod: '90-120 days',
    avgYield: 95,
    pricePerQuintal: 1400,
    costPerAcre: 15000,
    region: 'Punjab, Haryana & Karnataka',
    seasons: ['Rabi', 'Winter'],
    lossFactors: { pest: 8, disease: 9, weather: 8 }
  }
};

const cropAliases = {
  maize: 'corn',
  makka: 'corn',
  paddy: 'rice',
  dhaan: 'rice',
  kapas: 'cotton',
  'sugar cane': 'sugarcane',
  sorghum: 'jowar',
  jawar: 'jowar',
  jowar: 'jowar',
  'finger millet': 'ragi',
  madua: 'ragi',
  'pearl millet': 'bajra',
  bajara: 'bajra',
  soyabean: 'soybean',
  'soy bean': 'soybean',
  'ground nut': 'groundnut',
  peanut: 'groundnut',
  chana: 'chickpea',
  gram: 'chickpea',
  'bengal gram': 'chickpea',
  tur: 'pigeonpea',
  toor: 'pigeonpea',
  arhar: 'pigeonpea',
  mung: 'moong',
  'green gram': 'moong',
  'black gram': 'urad',
  masoor: 'lentil',
  sarson: 'mustard',
  rai: 'mustard',
  mirchi: 'chilli',
  haldi: 'turmeric',
  aloo: 'potato',
  pyaz: 'onion',
  nariyal: 'coconut',
  kela: 'banana',
  aam: 'mango',
  angoor: 'grapes',
  chikoo: 'sapota',
  chiku: 'sapota',
  sapodilla: 'sapota',
  papeeta: 'papaya',
  papaia: 'papaya',
  tarbooj: 'watermelon',
  kharbooja: 'watermelon',
  gajar: 'carrot',
  beri: 'strawberry',
  gehu: 'wheat'
};

const triggerReasonMap = {
  highHumidity: 'High humidity creates favorable conditions for fungal spread',
  lowHumidity: 'Low humidity can stress plants and increase susceptibility',
  highTemp: 'High temperature stress weakens plant resistance',
  lowTemp: 'Low temperature stress can trigger disease vulnerability',
  heavyRain: 'Excess rainfall increases leaf wetness and infection risk',
  lowRain: 'Low rainfall stress can reduce plant immunity',
  waterlogging: 'Poor drainage and moisture accumulation can cause root diseases',
  windy: 'Strong winds can damage tissue and spread pathogens'
};

const cropDiseaseProfiles = {
  rice: [
    { name: 'Rice Blast', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Use disease-resistant variety and maintain balanced nitrogen use.' },
    { name: 'Sheath Blight', triggerKeys: ['highHumidity', 'waterlogging'], preventiveCare: 'Avoid over-irrigation and keep proper plant spacing for airflow.' }
  ],
  wheat: [
    { name: 'Rust Disease', triggerKeys: ['highHumidity', 'lowTemp'], preventiveCare: 'Use resistant seed and monitor crop regularly after cool humid spells.' },
    { name: 'Powdery Mildew', triggerKeys: ['highHumidity', 'lowTemp'], preventiveCare: 'Avoid excess nitrogen and improve air movement in dense crop stands.' }
  ],
  cotton: [
    { name: 'Bacterial Blight', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Use certified seed, avoid overhead irrigation, and rotate crops.' },
    { name: 'Root Rot', triggerKeys: ['waterlogging'], preventiveCare: 'Ensure drainage and avoid prolonged standing water near root zone.' }
  ],
  sugarcane: [
    { name: 'Red Rot', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Use healthy setts and remove infected clumps early.' },
    { name: 'Smut', triggerKeys: ['highTemp', 'lowRain'], preventiveCare: 'Treat planting material and maintain field sanitation.' }
  ],
  tomato: [
    { name: 'Early Blight', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Avoid leaf wetness, remove infected leaves, and follow crop rotation.' },
    { name: 'Bacterial Wilt', triggerKeys: ['highTemp', 'waterlogging'], preventiveCare: 'Use raised beds and improve soil drainage.' }
  ],
  potato: [
    { name: 'Late Blight', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Use preventive sprays and avoid overhead irrigation in humid periods.' },
    { name: 'Black Scurf', triggerKeys: ['waterlogging', 'lowTemp'], preventiveCare: 'Use treated seed tubers and well-drained soil.' }
  ],
  onion: [
    { name: 'Downy Mildew', triggerKeys: ['highHumidity', 'lowTemp'], preventiveCare: 'Keep wider spacing and avoid late-evening irrigation.' },
    { name: 'Purple Blotch', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Maintain field hygiene and remove infected plant debris.' }
  ],
  chilli: [
    { name: 'Anthracnose', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Use disease-free seed and avoid fruit injury during handling.' },
    { name: 'Damping Off', triggerKeys: ['waterlogging', 'highHumidity'], preventiveCare: 'Use raised nursery beds and avoid overwatering.' }
  ],
  banana: [
    { name: 'Sigatoka Leaf Spot', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Prune old leaves and ensure proper spacing for ventilation.' },
    { name: 'Panama Wilt', triggerKeys: ['waterlogging', 'highTemp'], preventiveCare: 'Improve drainage and avoid movement of contaminated soil.' }
  ],
  mango: [
    { name: 'Anthracnose', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Prune dense canopy and spray preventive fungicide before monsoon.' },
    { name: 'Powdery Mildew', triggerKeys: ['highHumidity', 'lowTemp'], preventiveCare: 'Monitor flowering stage and maintain orchard airflow.' }
  ],
  grapes: [
    { name: 'Downy Mildew', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Train canopy for ventilation and avoid prolonged leaf wetness.' },
    { name: 'Anthracnose', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Prune infected shoots and follow timely protective sprays.' }
  ],
  sapota: [
    { name: 'Leaf Spot', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Remove infected leaves and avoid dense canopy moisture traps.' },
    { name: 'Root Rot', triggerKeys: ['waterlogging'], preventiveCare: 'Maintain good drainage and avoid stagnant water near roots.' }
  ],
  papaya: [
    { name: 'Papaya Ring Spot Virus', triggerKeys: ['highTemp', 'lowRain'], preventiveCare: 'Control vectors (aphids) and remove infected plants early.' },
    { name: 'Powdery Mildew', triggerKeys: ['highHumidity'], preventiveCare: 'Improve air circulation and monitor lower leaf canopy.' }
  ],
  watermelon: [
    { name: 'Fusarium Wilt', triggerKeys: ['highTemp', 'lowRain'], preventiveCare: 'Follow crop rotation and use tolerant varieties.' },
    { name: 'Downy Mildew', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Avoid water splash and ensure vine canopy airflow.' }
  ],
  strawberry: [
    { name: 'Grey Mold', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Mulch properly and keep fruits off wet soil surface.' },
    { name: 'Powdery Mildew', triggerKeys: ['highHumidity', 'lowTemp'], preventiveCare: 'Maintain spacing and remove infected plant parts quickly.' }
  ],
  carrot: [
    { name: 'Alternaria Leaf Blight', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Use healthy seed and avoid dense overhead irrigation patterns.' },
    { name: 'Root Rot', triggerKeys: ['waterlogging'], preventiveCare: 'Improve drainage and avoid repeated irrigation saturation.' }
  ],
  __default: [
    { name: 'Leaf Spot Complex', triggerKeys: ['highHumidity', 'heavyRain'], preventiveCare: 'Scout weekly and remove infected foliage promptly.' },
    { name: 'Root Rot', triggerKeys: ['waterlogging'], preventiveCare: 'Maintain proper drainage and avoid over-irrigation.' },
    { name: 'Powdery Mildew', triggerKeys: ['highHumidity', 'lowTemp'], preventiveCare: 'Improve airflow through spacing and pruning.' }
  ]
};

function normalizeCropName(cropName) {
  const normalizedInput = String(cropName || '').trim().toLowerCase();
  return cropAliases[normalizedInput] || normalizedInput;
}

// Soil characteristics database
const soilDatabase = {
  clay: {
    drainageRisk: 'high',
    advice: ['Improve drainage to prevent waterlogging', 'Add sand and organic matter for better structure'],
    waterHoldingCapacity: 'high',
    organicMatterNeeded: 'moderate'
  },
  sandy: {
    drainageRisk: 'low',
    advice: ['Add organic compost to improve nutrient retention', 'Increase irrigation frequency due to poor water retention'],
    waterHoldingCapacity: 'low',
    organicMatterNeeded: 'high'
  },
  loamy: {
    drainageRisk: 'low',
    advice: ['Maintain organic matter levels', 'Continue regular soil testing for nutrient balance'],
    waterHoldingCapacity: 'medium',
    organicMatterNeeded: 'low'
  },
  acidic: {
    drainageRisk: 'medium',
    advice: ['Apply lime (CaCO3) to neutralize acidity', 'Consider pH adjustment before planting'],
    waterHoldingCapacity: 'medium',
    organicMatterNeeded: 'medium'
  },
  alkaline: {
    drainageRisk: 'medium',
    advice: ['Apply sulfur or iron supplements to lower pH', 'Use chelated micronutrients for better absorption'],
    waterHoldingCapacity: 'medium',
    organicMatterNeeded: 'high'
  },
  laterite: {
    drainageRisk: 'medium',
    advice: ['Add organic matter to improve fertility', 'Use balanced fertilizer approach'],
    waterHoldingCapacity: 'medium',
    organicMatterNeeded: 'high'
  }
};

// Risk Assessment Scoring System
function calculateRiskScore(crop, weather, soilType) {
  let riskScore = 0;
  let riskFactors = [];

  const cropData = cropDatabase[normalizeCropName(crop)];
  if (!cropData) return { riskScore: 0, riskFactors: ['Unknown crop'] };

  // Temperature risk (0-30 points)
  const temp = weather.temperature;
  if (temp < cropData.optimalTemp.min - 5 || temp > cropData.optimalTemp.max + 5) {
    riskScore += 30;
    riskFactors.push(`Temperature ${temp}°C is outside optimal range (${cropData.optimalTemp.min}-${cropData.optimalTemp.max}°C)`);
  } else if (temp < cropData.optimalTemp.min || temp > cropData.optimalTemp.max) {
    riskScore += 15;
    riskFactors.push(`Temperature ${temp}°C is suboptimal`);
  }

  // Humidity risk (0-25 points)
  const humidity = weather.humidity;
  if (humidity < cropData.optimalHumidity.min - 10 || humidity > cropData.optimalHumidity.max + 10) {
    riskScore += 25;
    riskFactors.push(`Humidity ${humidity}% is critically outside optimal range (${cropData.optimalHumidity.min}-${cropData.optimalHumidity.max}%)`);
  } else if (humidity < cropData.optimalHumidity.min || humidity > cropData.optimalHumidity.max) {
    riskScore += 12;
    riskFactors.push(`Humidity ${humidity}% is suboptimal`);
  }

  // Rainfall risk (0-20 points)
  if (weather.rainfall !== undefined) {
    const rainfall = weather.rainfall;
    if (rainfall < cropData.optimalRainfall.min / 30 || rainfall > cropData.optimalRainfall.max / 30) {
      riskScore += 20;
      riskFactors.push(`Monthly rainfall ${rainfall}mm is outside optimal range`);
    }
  }

  // Soil type compatibility (0-15 points)
  const soilData = soilDatabase[soilType.toLowerCase()];
  if (soilData && soilData.drainageRisk === 'high' && humidity > 75) {
    riskScore += 15;
    riskFactors.push(`Clay soil with high humidity increases waterlogging risk`);
  }

  // Wind speed risk (0-10 points)
  if (weather.windSpeed !== undefined && weather.windSpeed > 25) {
    riskScore += 10;
    riskFactors.push(`High wind speed (${weather.windSpeed} km/h) may damage crops`);
  }

  return { 
    riskScore: Math.min(riskScore, 100),
    riskLevel: riskScore >= 70 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 30 ? 'MODERATE' : 'LOW',
    riskFactors 
  };
}

//  Weather-based irrigation adjustment
function adjustIrrigation(cropData, weather) {
  let irrigationSchedule = cropData.baseIrrigation;
  const adjustments = [];

  // High temperature adjustment
  if (weather.temperature > cropData.optimalTemp.max + 5) {
    irrigationSchedule = `Increase irrigation to every ${Math.max(2, cropData.irrigationDays - 2)} days due to high temperature`;
    adjustments.push('High temperature requires more frequent irrigation');
  }

  // Low humidity adjustment
  if (weather.humidity < 40) {
    adjustments.push('Low humidity detected - increase irrigation frequency');
  }

  // High humidity adjustment
  if (weather.humidity > 80) {
    irrigationSchedule = `Reduce irrigation to every ${cropData.irrigationDays + 2} days to prevent waterlogging`;
    adjustments.push('High humidity - reduce irrigation frequency');
  }

  // Low rainfall adjustment
  if (weather.rainfall !== undefined && weather.rainfall < cropData.optimalRainfall.min / 30) {
    adjustments.push('Rainfall below optimal - supplement with irrigation');
  }

  return { irrigationSchedule, adjustments };
}

function inferDiseaseTriggers(cropData, weather, soilType) {
  const soilData = soilDatabase[String(soilType || '').toLowerCase()];
  const monthlyRainMax = cropData.optimalRainfall.max / 30;
  const monthlyRainMin = cropData.optimalRainfall.min / 30;

  return {
    highHumidity: weather.humidity > cropData.optimalHumidity.max,
    lowHumidity: weather.humidity < cropData.optimalHumidity.min,
    highTemp: weather.temperature > cropData.optimalTemp.max,
    lowTemp: weather.temperature < cropData.optimalTemp.min,
    heavyRain: weather.rainfall !== undefined && weather.rainfall > monthlyRainMax,
    lowRain: weather.rainfall !== undefined && weather.rainfall < monthlyRainMin,
    waterlogging: (soilData?.drainageRisk === 'high' || soilData?.drainageRisk === 'medium') && weather.humidity > 72,
    windy: weather.windSpeed !== undefined && weather.windSpeed > 25
  };
}

function inferPossibleDiseases(cropKey, cropData, weather, soilType, riskLevel) {
  const triggers = inferDiseaseTriggers(cropData, weather, soilType);
  const profile = cropDiseaseProfiles[cropKey] || cropDiseaseProfiles.__default;

  const results = profile
    .map((entry) => {
      const activeTriggers = entry.triggerKeys.filter((key) => triggers[key]);
      let likelihood = 'LOW';

      if (activeTriggers.length >= 2) {
        likelihood = 'HIGH';
      } else if (activeTriggers.length === 1 || ['HIGH', 'CRITICAL'].includes(riskLevel)) {
        likelihood = 'MODERATE';
      }

      const reason = activeTriggers.length > 0
        ? activeTriggers.map((key) => triggerReasonMap[key]).join('; ')
        : 'General disease risk increases when scouting, hygiene, and preventive care are skipped.';

      return {
        disease: entry.name,
        likelihood,
        why: reason,
        preventiveCare: entry.preventiveCare
      };
    })
    .filter((item) => item.likelihood !== 'LOW' || ['HIGH', 'CRITICAL'].includes(riskLevel));

  return results.slice(0, 3);
}

function getRecommendation({ crop, soilType, area, weather }) {
  const cropKey = normalizeCropName(crop);
  const soilKey = soilType.toLowerCase();

  // Validate inputs
  const cropData = cropDatabase[cropKey];
  const soilData = soilDatabase[soilKey];

  if (!cropData) {
    return {
      fertilizer: 'Unknown crop',
      quantity: 'N/A',
      irrigation: 'Please select a valid crop',
      advice: [`Select from: ${Object.keys(cropDatabase).join(', ')}`],
      risk: [],
      riskScore: 0,
      riskLevel: 'UNKNOWN',
      diseaseRisks: []
    };
  }

  // Calculate base recommendations
  const fertilizer = cropData.defaultFertilizer;
  const quantity = `${Math.round(area * cropData.quantityPerAcre)} kg`;

  // Get weather-adjusted irrigation
  const { irrigationSchedule, adjustments: irrigationAdjustments } = adjustIrrigation(cropData, weather);

  // Build advice array
  let advice = [];
  if (soilData) {
    advice = [...soilData.advice];
  }
  advice.push(`Growth period: ${cropData.growthPeriod}`);
  advice.push('Use organic fertilizer every 30 days as supplement');
  advice.push('Soil testing recommended before next planting cycle');
  advice.push(...irrigationAdjustments);

  // Calculate risk assessment
  const { riskScore, riskLevel, riskFactors } = calculateRiskScore(crop, weather, soilType);
  const diseaseRisks = inferPossibleDiseases(cropKey, cropData, weather, soilType, riskLevel);

  return {
    fertilizer,
    quantity,
    irrigation: irrigationSchedule,
    advice,
    risk: riskFactors,
    riskScore,
    riskLevel,
    diseaseRisks,
    cropOptimalConditions: cropData ? {
      temperature: `${cropData.optimalTemp.min}-${cropData.optimalTemp.max}°C`,
      humidity: `${cropData.optimalHumidity.min}-${cropData.optimalHumidity.max}%`,
      rainfall: `${cropData.optimalRainfall.min}-${cropData.optimalRainfall.max}mm annually`
    } : null,
    currentWeather: {
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: weather.rainfall || 'N/A',
      windSpeed: weather.windSpeed || 'N/A'
    }
  };
}

// Calculate crop suitability score
function calculateCropSuitabilityScore(cropName, weather, soilType) {
  const crop = cropDatabase[normalizeCropName(cropName)];
  if (!crop) return 0;

  let score = 100;

  // Temperature compatibility (0-25 points)
  const tempDiff = Math.min(
    Math.abs(weather.temperature - crop.optimalTemp.min),
    Math.abs(weather.temperature - crop.optimalTemp.max)
  );
  const tempPenalty = Math.min(25, (tempDiff / 10) * 25);
  score -= tempPenalty;

  // Humidity compatibility (0-20 points)
  const humidityDiff = Math.min(
    Math.abs(weather.humidity - crop.optimalHumidity.min),
    Math.abs(weather.humidity - crop.optimalHumidity.max)
  );
  const humidityPenalty = Math.min(20, (humidityDiff / 10) * 20);
  score -= humidityPenalty;

  // Soil compatibility (0-15 points)
  const soilData = soilDatabase[soilType.toLowerCase()];
  if (soilData && soilData.drainageRisk === 'high') {
    score -= 10;
  }

  // Rainfall compatibility (0-15 points)
  if (weather.rainfall !== undefined) {
    const rainfallDiff = Math.min(
      Math.abs(weather.rainfall - (crop.optimalRainfall.min / 30)),
      Math.abs(weather.rainfall - (crop.optimalRainfall.max / 30))
    );
    const rainfallPenalty = Math.min(15, (rainfallDiff / 50) * 15);
    score -= rainfallPenalty;
  }

  // Wind speed compatibility (0-10 points)
  if (weather.windSpeed !== undefined && weather.windSpeed > 25) {
    score -= 10;
  }

  return Math.max(0, score);
}

//  Get alternative crop recommendations
function getAlternativeCropRecommendations(currentCrop, weather, soilType) {
  const cropNames = Object.keys(cropDatabase);
  const scores = {};
  const currentCropKey = normalizeCropName(currentCrop);

  cropNames.forEach(crop => {
    if (crop.toLowerCase() !== currentCropKey) {
      scores[crop] = calculateCropSuitabilityScore(crop, weather, soilType);
    }
  });

  // Sort by score and get top 3
  const topCrops = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cropName, score]) => ({
      name: cropName,
      score: Math.round(score),
      data: cropDatabase[cropName]
    }));

  return topCrops;
}

//  Calculate yield and loss prediction
function calculateYieldAndLoss(crop, weather, soilType, area) {
  const cropData = cropDatabase[normalizeCropName(crop)];
  if (!cropData) return null;

  // Base yield per acre
  const baseYield = cropData.avgYield;
  const totalYield = baseYield * area;

  // Calculate yield adjustment based on weather conditions
  let weatherAdjustment = 1.0;
  const tempOptimal = (cropData.optimalTemp.min + cropData.optimalTemp.max) / 2;
  const tempDeviation = Math.abs(weather.temperature - tempOptimal);
  weatherAdjustment -= (tempDeviation / 20) * 0.1;

  const humidityOptimal = (cropData.optimalHumidity.min + cropData.optimalHumidity.max) / 2;
  const humidityDeviation = Math.abs(weather.humidity - humidityOptimal);
  weatherAdjustment -= (humidityDeviation / 25) * 0.1;

  weatherAdjustment = Math.max(0.6, Math.min(1.1, weatherAdjustment));

  // Adjusted yield
  const adjustedYield = Math.round(totalYield * weatherAdjustment);

  // Calculate losses
  const lossFactors = cropData.lossFactors;
  const totalLossPercentage = Math.min(
    35,
    (lossFactors.pest || 8) + (lossFactors.disease || 10) + (lossFactors.weather || 8)
  );

  const totalLoss = Math.round(adjustedYield * (totalLossPercentage / 100));
  const finalYield = adjustedYield - totalLoss;

  // Revenue calculation
  const revenue = finalYield * cropData.pricePerQuintal;
  const totalCost = cropData.costPerAcre * area;
  const profit = revenue - totalCost;

  return {
    cropName: crop,
    baseYield,
    totalYieldQuintals: adjustedYield,
    lossQuintals: totalLoss,
    lossPercentage: totalLossPercentage,
    finalYieldQuintals: finalYield,
    pricePerQuintal: cropData.pricePerQuintal,
    revenue: Math.round(revenue),
    totalCost: Math.round(totalCost),
    profit: Math.round(profit),
    profitMargin: Math.round((profit / revenue) * 100),
    lossBreakdown: {
      pest: lossFactors.pest,
      disease: lossFactors.disease,
      weather: lossFactors.weather
    }
  };
}

//  Get recommendations for top crops with yield/loss
function getTopCropsWithYieldAnalysis(weather, soilType, area) {
  const topCrops = getAlternativeCropRecommendations('', weather, soilType);
  
  return topCrops.map(crop => {
    const yieldLoss = calculateYieldAndLoss(crop.name, weather, soilType, area);
    return {
      ...crop,
      yieldAnalysis: yieldLoss
    };
  });
}

module.exports = { 
  getRecommendation,
  getAlternativeCropRecommendations,
  calculateYieldAndLoss,
  getTopCropsWithYieldAnalysis,
  calculateCropSuitabilityScore,
  normalizeCropName,
  cropDatabase
};
