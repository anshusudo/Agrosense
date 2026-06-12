# AgroSense Crop Recommendations & Yield/Loss Analysis Enhancement

## Overview
This document outlines the enhancements made to the AgroSense application to provide comprehensive crop recommendations with yield and loss analysis, displayed in PDF reports with financial comparisons.

## Features Implemented

### 1. Enhanced Recommendation Engine (`backend/services/recommendationEngine.js`)

#### New Data Structure
- **Crop Database Enhanced** with yield metrics:
  - `avgYield`: Average yield in quintals per acre
  - `pricePerQuintal`: Market price for each crop
  - `costPerAcre`: Total cost of production per acre
  - `lossFactors`: Breakdown of losses from pest, disease, and weather

#### New Functions

##### `calculateCropSuitabilityScore(cropName, weather, soilType)`
- Calculates how suitable a crop is for the given conditions (0-100 score)
- Factors considered:
  - Temperature compatibility (0-25 points)
  - Humidity compatibility (0-20 points)
  - Soil compatibility (0-15 points)
  - Rainfall compatibility (0-15 points)
  - Wind speed compatibility (0-10 points)

##### `getAlternativeCropRecommendations(currentCrop, weather, soilType)`
- Returns top 3 alternative crops ranked by suitability score
- Excludes the current crop from recommendations
- Returns crop name, score, and full crop data

##### `calculateYieldAndLoss(crop, weather, soilType, area)`
- Calculates detailed yield and loss prediction
- Returns:
  - `baseYield`: Base yield per acre
  - `totalYieldQuintals`: Adjusted yield based on weather
  - `lossQuintals`: Estimated loss in quintals
  - `lossPercentage`: Total loss as percentage
  - `finalYieldQuintals`: Final yield after losses
  - `pricePerQuintal`: Market price
  - `revenue`: Total revenue (₹)
  - `totalCost`: Total production cost (₹)
  - `profit`: Net profit (₹)
  - `profitMargin`: Profit margin percentage
  - `lossBreakdown`: Detailed breakdown by pest, disease, weather

##### `getTopCropsWithYieldAnalysis(weather, soilType, area)`
- Combines crop recommendations with yield/loss analysis
- Returns array of recommended crops with complete financial analysis

### 2. Enhanced Analytics Engine (`backend/services/analyticsEngine.js`)

#### New Functions

##### `analyzeCropRecommendations(weather, soilType, area)`
- Generates crop recommendations with yield analysis
- Returns array of crops with:
  - Crop name and suitability score
  - Complete yield analysis
  - Financial recommendation data (expected profit, profit margin)

##### `generateCropYieldLossData(cropRecommendations)`
- Creates structured data for visualization
- Includes:
  - Yield and loss chart data
  - Profit comparison data
  - Loss breakdown by factors (pest, disease, weather)
  - Color-coded visualization data

### 3. Enhanced PDF Report Service (`backend/services/pdfServices.js`)

#### New Pages Added

**Page 3: Alternative Crop Recommendations** (if recommendations available)
- Lists top 3 recommended crops
- For each crop displays:
  - Crop name and suitability score
  - Yield & Loss Analysis:
    - Total yield in quintals
    - Loss percentage and quantity
    - Final yield
  - Profit Box showing:
    - Revenue and cost
    - Net profit in ₹
    - Profit margin %
  - Loss factors breakdown (pest, disease, weather)

**Page 4: Yield & Loss Comparison Summary**
- Table format showing all recommended crops:
  - Crop name
  - Final yield (quintals)
  - Loss percentage
  - Net profit (₹)
- **Top Recommendation**: Highlighted based on highest profit

**Page 5: Next Steps** (Updated)
- Enhanced action items including crop recommendations
- Emphasis on crop rotation and comparison analysis

### 4. Updated Recommendation Controller (`backend/controllers/recommendationController.js`)

#### `getAIRecommendation` Endpoint
- Now includes `cropRecommendations` in the response
- Crops ranked by suitability score
- Contains full yield/loss analysis for each crop

#### `generateAndEmailReport` Endpoint
- Passes `cropRecommendations` to PDF generator
- Creates comprehensive report with crop alternatives
- Emails report with complete analysis

## Data Structure: Crop Analysis Response

```json
{
  "cropName": "rice",
  "suitabilityScore": 85,
  "yieldAnalysis": {
    "cropName": "rice",
    "baseYield": 50,
    "totalYieldQuintals": 48,
    "lossQuintals": 7,
    "lossPercentage": 15,
    "finalYieldQuintals": 41,
    "pricePerQuintal": 3100,
    "revenue": 127100,
    "totalCost": 50000,
    "profit": 77100,
    "profitMargin": 60,
    "lossBreakdown": {
      "pest": 12,
      "disease": 15,
      "weather": 8
    }
  }
}
```

## Crop Database Information

All crops include these metrics (example for Wheat):
- **Optimal Conditions**: Temperature, humidity, rainfall ranges
- **Fertilizer Requirements**: Type and quantity
- **Irrigation Schedule**: Frequency and intensity
- **Average Yield**: 45 quintals/acre
- **Price**: ₹2,500 per quintal
- **Production Cost**: ₹8,000 per acre
- **Loss Factors**: Pest 8%, Disease 12%, Weather 10%

### Available Crops
1. **Wheat** - North India, Rabi season
2. **Rice** - Eastern India, Kharif season
3. **Corn** - Central India, Kharif & Rabi
4. **Cotton** - Western India, Kharif season
5. **Sugarcane** - North India, Kharif & Rabi
6. **Barley** - North India, Rabi season
7. **Pulses** - Central India, Kharif & Rabi
8. **Vegetables** - All regions, Year-round

## API Response Enhancement

### GET `/api/recommendation/:farmId`
- Returns crop recommendations in response
- Each recommendation includes suitability score and yield analysis

```json
{
  "farm": { /* farm details */ },
  "weather": { /* weather conditions */ },
  "recommendation": { /* current crop recommendation */ },
  "cropRecommendations": [
    {
      "cropName": "rice",
      "suitabilityScore": 85,
      "yieldAnalysis": { /* yield/loss data */ }
    }
    // ... more crops
  ],
  "statistics": { /* existing statistics */ }
}
```

### POST `/api/recommendation/:farmId/generate-report`
- PDF report now includes crop recommendations
- 5-page report with comprehensive analysis:
  1. Farm details & risk assessment
  2. Statistical analysis
  3. Crop recommendations with yield/loss
  4. Yield comparison summary
  5. Action items & next steps

## Financial Analysis Features

### Yield Prediction
- Base yield adjusted based on:
  - Temperature deviation from optimal
  - Humidity deviation from optimal
  - Weather conditions
- Weather adjustment factor: 0.6 to 1.1

### Loss Calculation
- Pest damage, disease, and weather impact
- Percentage-based loss on total yield
- Maximum loss cap: 35% of total yield

### Profit Calculation
- Revenue = Final Yield × Price per Quintal
- Cost = Production Cost per Acre × Total Area
- Profit = Revenue - Cost
- Profit Margin = (Profit / Revenue) × 100

## Usage Example

```javascript
// In recommendation controller
const cropRecommendations = analyzeCropRecommendations(
  weather,
  farm.soilType,
  farm.area
);

// Pass to PDF generator
const farmData = {
  farm: { /* farm data */ },
  weather: { /* weather data */ },
  recommendation: { /* current crop */ },
  cropRecommendations: cropRecommendations,
  statistics: { /* statistics */ }
};

const pdfBuffer = await generateEnhancedReport(farmData);
```

## Benefits

1. **Data-Driven Decisions**: Farmers can compare profitability of different crops
2. **Risk Assessment**: Loss factors help predict potential challenges
3. **Financial Clarity**: Clear revenue, cost, and profit calculations
4. **Suitability Matching**: Crop recommendations based on specific conditions
5. **Visual Comparison**: PDF charts make comparisons easy to understand
6. **Comprehensive Analysis**: Complete yield and financial projection

## Technical Stack

- **Backend**: Node.js + Express
- **Recommendation Engine**: Custom algorithm with weather/soil analysis
- **Analytics**: Statistical analysis service
- **PDF Generation**: pdfkit library
- **Data Storage**: MongoDB (Farm model)

## Future Enhancements

1. Add pie charts for loss breakdown visualization in PDF
2. Historical yield comparison with farmer's past crops
3. Seasonal recommendations for crop rotation
4. Weather forecast integration for extended prediction
5. Machine learning for improved yield prediction
6. Market price trending analysis
7. Cost comparison analysis between crops

## Testing Checklist

- [ ] Verify crop recommendations generate with correct suitability scores
- [ ] Test yield calculations with different weather conditions
- [ ] Verify PDF generation includes crop recommendation pages
- [ ] Test financial calculations (revenue, cost, profit)
- [ ] Verify loss breakdown calculations
- [ ] Test with different soil types and weather conditions
- [ ] Email report delivery with PDF attachment
- [ ] Check data accuracy for all 8 crop types
- [ ] Verify suitability scoring algorithm
- [ ] Test edge cases (extreme weather, poor soil)

## Migration Notes

No database migrations required. The enhancements are:
- Service layer additions (new functions)
- API response enhancements (backward compatible)
- PDF report expansion (additional pages)

All existing functionality remains unchanged and operational.
