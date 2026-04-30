// Simulated base market prices (₹) for phones by brand + model
// Used for instant client-side price prediction when no backend is connected

const BASE_PRICES = {
  samsung: {
    'Galaxy S24 Ultra': 129999, 'Galaxy S24+': 99999, 'Galaxy S24': 79999,
    'Galaxy S23 Ultra': 109999, 'Galaxy S23+': 84999, 'Galaxy S23': 69999,
    'Galaxy Z Fold 5': 154999, 'Galaxy Z Flip 5': 99999,
    'Galaxy A54': 38999, 'Galaxy A34': 30999, 'Galaxy A14': 13999,
    'Galaxy M34': 18999, 'Galaxy M54': 26999, 'Galaxy F15': 12999,
    'Galaxy S22 Ultra': 89999, 'Galaxy S21 FE': 44999,
  },
  apple: {
    'iPhone 16 Pro Max': 144900, 'iPhone 16 Pro': 119900, 'iPhone 16 Plus': 89900, 'iPhone 16': 79900,
    'iPhone 15 Pro Max': 134900, 'iPhone 15 Pro': 109900, 'iPhone 15 Plus': 79900, 'iPhone 15': 69900,
    'iPhone 14 Pro Max': 109900, 'iPhone 14 Pro': 99900, 'iPhone 14': 59900, 'iPhone 13': 49900,
    'iPhone SE (3rd Gen)': 39900, 'iPhone 12': 39900, 'iPhone 11': 29900,
  },
  oneplus: {
    'OnePlus 12': 64999, 'OnePlus 12R': 39999, 'OnePlus Open': 139999,
    'OnePlus 11': 56999, 'OnePlus 11R': 39999,
    'OnePlus Nord CE 4': 24999, 'OnePlus Nord 3': 33999, 'OnePlus Nord CE 3 Lite': 19999,
    'OnePlus 10 Pro': 54999, 'OnePlus 10T': 42999, 'OnePlus 9 Pro': 49999,
  },
  xiaomi: {
    'Xiaomi 14 Ultra': 99999, 'Xiaomi 14': 69999, 'Xiaomi 13 Pro': 79999, 'Xiaomi 13': 54999,
    'Redmi Note 13 Pro+': 31999, 'Redmi Note 13 Pro': 25999, 'Redmi Note 13': 17999,
    'Redmi 13C': 10999, 'Redmi 12': 10999,
    'POCO F6 Pro': 42999, 'POCO F6': 29999, 'POCO X6 Pro': 24999, 'POCO M6 Pro': 14999,
    'Xiaomi 12 Pro': 62999,
  },
  realme: {
    'Realme GT 5 Pro': 37999, 'Realme GT Neo 5': 29999,
    'Realme 12 Pro+': 29999, 'Realme 12 Pro': 23999, 'Realme 12': 17999,
    'Realme Narzo 70 Pro': 19999, 'Realme Narzo 60': 15999, 'Realme C67': 11999,
    'Realme 11 Pro+': 27999, 'Realme 11 Pro': 23999,
  },
  vivo: {
    'Vivo X100 Pro': 89999, 'Vivo X100': 63999, 'Vivo V30 Pro': 39999, 'Vivo V30': 29999,
    'Vivo T3 5G': 19999, 'Vivo T2 Pro': 24999, 'Vivo Y200': 24999, 'Vivo Y100': 19999,
    'iQOO 12': 52999, 'iQOO Neo 9 Pro': 36999, 'iQOO Z9': 19999,
  },
  oppo: {
    'Oppo Find X7 Ultra': 99999, 'Oppo Find X7': 64999,
    'Oppo Reno 11 Pro': 39999, 'Oppo Reno 11': 29999,
    'Oppo F25 Pro': 24999, 'Oppo A79': 19999, 'Oppo A59': 13999, 'Oppo K12': 21999,
  },
  nothing: {
    'Nothing Phone (2a)': 23999, 'Nothing Phone (2)': 44999, 'Nothing Phone (1)': 32999,
    'Nothing CMF Phone 1': 15999,
  },
  google: {
    'Pixel 9 Pro XL': 124999, 'Pixel 9 Pro': 109999, 'Pixel 9': 79999,
    'Pixel 8 Pro': 99999, 'Pixel 8': 75999, 'Pixel 8a': 52999,
    'Pixel 7 Pro': 74999, 'Pixel 7': 54999, 'Pixel 7a': 39999, 'Pixel 6a': 29999,
  },
  motorola: {
    'Motorola Edge 50 Pro': 35999, 'Motorola Edge 50 Fusion': 22999, 'Motorola Edge 40 Neo': 21999,
    'Moto G84': 19999, 'Moto G73': 16999, 'Moto G54': 14999, 'Moto G34': 10999,
    'Motorola Razr 40 Ultra': 89999, 'Motorola Razr 40': 44999,
  },
};

// Storage multipliers (relative to 128GB base)
const STORAGE_MULTIPLIERS = {
  '32': 0.75, '64': 0.88, '128': 1.0, '256': 1.12, '512': 1.28, '1024': 1.45,
};

// RAM multipliers (relative to 8GB base)
const RAM_MULTIPLIERS = {
  '2': 0.80, '4': 0.88, '6': 0.94, '8': 1.0, '12': 1.08, '16': 1.15,
};

// Condition discount tiers
const CONDITION_TIERS = {
  new:      { discount: 0,    label: 'Brand New',   severity: 0,   grade: 'A+' },
  like_new: { discount: 0.10, label: 'Like New',    severity: 1.2, grade: 'A'  },
  good:     { discount: 0.25, label: 'Good',        severity: 3.5, grade: 'B+' },
  fair:     { discount: 0.40, label: 'Fair',        severity: 6.0, grade: 'C+' },
  poor:     { discount: 0.55, label: 'Poor',        severity: 8.5, grade: 'D'  },
};

// Simulated damage detection classes
const DAMAGE_TYPES = {
  new:      [],
  like_new: [
    { type: 'scratch', label: 'Minor Scratch', confidence: 0.42, area: 0.8, severity: 'Low' },
  ],
  good: [
    { type: 'scratch', label: 'Surface Scratches', confidence: 0.87, area: 3.2, severity: 'Medium' },
    { type: 'stain', label: 'Light Stain', confidence: 0.65, area: 1.5, severity: 'Low' },
  ],
  fair: [
    { type: 'scratch', label: 'Deep Scratches', confidence: 0.93, area: 5.8, severity: 'High' },
    { type: 'crack', label: 'Hairline Crack', confidence: 0.78, area: 2.1, severity: 'High' },
    { type: 'stain', label: 'Discoloration', confidence: 0.71, area: 4.2, severity: 'Medium' },
  ],
  poor: [
    { type: 'crack', label: 'Screen Crack', confidence: 0.97, area: 12.4, severity: 'Critical' },
    { type: 'scratch', label: 'Heavy Scratches', confidence: 0.95, area: 8.7, severity: 'High' },
    { type: 'stain', label: 'Water Damage Stain', confidence: 0.88, area: 6.3, severity: 'High' },
    { type: 'crack', label: 'Body Crack', confidence: 0.82, area: 3.9, severity: 'High' },
  ],
};

/**
 * Generate a simulated analysis result based on user inputs.
 * In production, this would call the backend /analyze endpoint.
 */
export function generateAnalysis({ brand, model, condition, storage, ram, images }) {
  // 1. Get base price
  const brandPrices = BASE_PRICES[brand] || {};
  let basePrice = brandPrices[model] || 25000; // fallback for unknown models

  // 2. Adjust for storage and RAM
  const storageMultiplier = STORAGE_MULTIPLIERS[storage] || 1.0;
  const ramMultiplier = RAM_MULTIPLIERS[ram] || 1.0;
  const adjustedBase = Math.round(basePrice * storageMultiplier * ramMultiplier);

  // 3. Condition-based pricing
  const tier = CONDITION_TIERS[condition] || CONDITION_TIERS.good;
  const discountAmount = Math.round(adjustedBase * tier.discount);
  const predictedPrice = adjustedBase - discountAmount;

  // 4. Price range (±8%)
  const priceLow = Math.round(predictedPrice * 0.92);
  const priceHigh = Math.round(predictedPrice * 1.08);

  // 5. Simulated damage detections
  const detections = (DAMAGE_TYPES[condition] || []).map(d => ({
    ...d,
    confidence: Math.min(0.99, d.confidence + (Math.random() * 0.06 - 0.03)),
  }));

  // 6. Severity score
  const severityScore = tier.severity + (Math.random() * 0.6 - 0.3);
  const clampedSeverity = Math.max(0, Math.min(10, severityScore));

  // 7. Market comparison
  const marketAvg = Math.round(adjustedBase * (1 - tier.discount * 0.85));
  const marketDiff = predictedPrice - marketAvg;
  const marketDiffPercent = ((marketDiff / marketAvg) * 100).toFixed(1);

  // 8. Confidence score
  const baseConfidence = condition === 'new' ? 96 : condition === 'like_new' ? 93 : condition === 'good' ? 89 : condition === 'fair' ? 84 : 78;
  const confidenceScore = baseConfidence + Math.floor(Math.random() * 4);

  // 9. Generate recommendations
  const recommendations = generateRecommendations(condition, detections, predictedPrice);

  return {
    phoneInfo: { brand, model, condition: tier.label, storage: `${storage} GB`, ram: `${ram} GB` },
    pricing: {
      originalPrice: adjustedBase,
      predictedPrice,
      priceLow,
      priceHigh,
      discount: tier.discount,
      discountAmount,
      marketAvg,
      marketDiff,
      marketDiffPercent: parseFloat(marketDiffPercent),
    },
    analysis: {
      severityScore: parseFloat(clampedSeverity.toFixed(1)),
      grade: tier.grade,
      confidenceScore: Math.min(99, confidenceScore),
      detections,
      totalDamageArea: detections.reduce((sum, d) => sum + d.area, 0).toFixed(1),
      imagesAnalyzed: images.length,
    },
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

function generateRecommendations(condition, detections, price) {
  const recs = [];

  if (condition === 'new') {
    recs.push({ icon: '✅', text: 'Product is in pristine condition. You can list at full market price.' });
    recs.push({ icon: '📦', text: 'Keep original packaging for maximum resale value.' });
  } else if (condition === 'like_new') {
    recs.push({ icon: '✅', text: 'Excellent condition. Minor signs of use won\'t significantly impact value.' });
    recs.push({ icon: '🧹', text: 'A quick clean and polish could help you achieve the higher end of the range.' });
  } else if (condition === 'good') {
    recs.push({ icon: '⚠️', text: 'Cosmetic imperfections detected. Consider professional cleaning before listing.' });
    recs.push({ icon: '📸', text: 'Take clear photos of any scratches for transparent listing.' });
    recs.push({ icon: '💡', text: 'A screen protector can cover minor scratches and improve perceived condition.' });
  } else if (condition === 'fair') {
    recs.push({ icon: '🔧', text: 'Consider minor repairs — fixing hairline cracks can improve resale by 15-20%.' });
    recs.push({ icon: '⚠️', text: 'Be transparent about damage in your listing to avoid returns.' });
    recs.push({ icon: '💰', text: `Trade-in programs may offer better value than private sale at this condition.` });
  } else {
    recs.push({ icon: '🔧', text: 'Screen replacement is recommended before resale — it could double the value.' });
    recs.push({ icon: '♻️', text: 'Consider selling for parts if repair costs exceed 40% of device value.' });
    recs.push({ icon: '🏪', text: 'Certified refurbishment programs may accept this device for a fixed payout.' });
    recs.push({ icon: '⚠️', text: 'Water damage indicators may void warranty claims. Disclose all issues.' });
  }

  return recs;
}
