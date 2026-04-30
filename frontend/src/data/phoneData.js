export const BRANDS = [
  { value: 'samsung', label: 'Samsung', icon: '📱' },
  { value: 'apple', label: 'Apple', icon: '🍎' },
  { value: 'oneplus', label: 'OnePlus', icon: '⚡' },
  { value: 'xiaomi', label: 'Xiaomi', icon: '🔶' },
  { value: 'realme', label: 'Realme', icon: '🟡' },
  { value: 'vivo', label: 'Vivo', icon: '🔵' },
  { value: 'oppo', label: 'Oppo', icon: '🟢' },
  { value: 'nothing', label: 'Nothing', icon: '⚪' },
  { value: 'google', label: 'Google', icon: '🔴' },
  { value: 'motorola', label: 'Motorola', icon: '🟣' },
  { value: 'other', label: 'Other', icon: '📲' },
];

export const MODEL_SUGGESTIONS = {
  samsung: [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54', 'Galaxy A34', 'Galaxy A14',
    'Galaxy M34', 'Galaxy M54', 'Galaxy F15', 'Galaxy S22 Ultra', 'Galaxy S21 FE',
  ],
  apple: [
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13',
    'iPhone SE (3rd Gen)', 'iPhone 12', 'iPhone 11',
  ],
  oneplus: [
    'OnePlus 12', 'OnePlus 12R', 'OnePlus Open', 'OnePlus 11', 'OnePlus 11R',
    'OnePlus Nord CE 4', 'OnePlus Nord 3', 'OnePlus Nord CE 3 Lite',
    'OnePlus 10 Pro', 'OnePlus 10T', 'OnePlus 9 Pro',
  ],
  xiaomi: [
    'Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13 Pro', 'Xiaomi 13',
    'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13',
    'Redmi 13C', 'Redmi 12', 'POCO F6 Pro', 'POCO F6', 'POCO X6 Pro',
    'POCO M6 Pro', 'Xiaomi 12 Pro',
  ],
  realme: [
    'Realme GT 5 Pro', 'Realme GT Neo 5', 'Realme 12 Pro+', 'Realme 12 Pro',
    'Realme 12', 'Realme Narzo 70 Pro', 'Realme Narzo 60', 'Realme C67',
    'Realme 11 Pro+', 'Realme 11 Pro',
  ],
  vivo: [
    'Vivo X100 Pro', 'Vivo X100', 'Vivo V30 Pro', 'Vivo V30',
    'Vivo T3 5G', 'Vivo T2 Pro', 'Vivo Y200', 'Vivo Y100',
    'iQOO 12', 'iQOO Neo 9 Pro', 'iQOO Z9',
  ],
  oppo: [
    'Oppo Find X7 Ultra', 'Oppo Find X7', 'Oppo Reno 11 Pro', 'Oppo Reno 11',
    'Oppo F25 Pro', 'Oppo A79', 'Oppo A59', 'Oppo K12',
  ],
  nothing: [
    'Nothing Phone (2a)', 'Nothing Phone (2)', 'Nothing Phone (1)',
    'Nothing CMF Phone 1',
  ],
  google: [
    'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro', 'Pixel 8',
    'Pixel 8a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6a',
  ],
  motorola: [
    'Motorola Edge 50 Pro', 'Motorola Edge 50 Fusion', 'Motorola Edge 40 Neo',
    'Moto G84', 'Moto G73', 'Moto G54', 'Moto G34',
    'Motorola Razr 40 Ultra', 'Motorola Razr 40',
  ],
  other: [],
};

export const STORAGE_OPTIONS = [
  { value: '32', label: '32 GB' },
  { value: '64', label: '64 GB' },
  { value: '128', label: '128 GB' },
  { value: '256', label: '256 GB' },
  { value: '512', label: '512 GB' },
  { value: '1024', label: '1 TB' },
];

export const RAM_OPTIONS = [
  { value: '2', label: '2 GB' },
  { value: '4', label: '4 GB' },
  { value: '6', label: '6 GB' },
  { value: '8', label: '8 GB' },
  { value: '12', label: '12 GB' },
  { value: '16', label: '16 GB' },
];

export const CONDITION_OPTIONS = [
  { value: 'new', label: 'New', description: 'Sealed box, untouched', color: '#00d4ff' },
  { value: 'like_new', label: 'Like New', description: 'Barely used, no marks', color: '#00e68a' },
  { value: 'good', label: 'Good', description: 'Minor signs of use', color: '#ffd000' },
  { value: 'fair', label: 'Fair', description: 'Visible wear & tear', color: '#ff8c00' },
  { value: 'poor', label: 'Poor', description: 'Heavy damage or defects', color: '#ff4060' },
];
