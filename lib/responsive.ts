export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const containerMax = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1320px'
} as const;

export const fluid = {
  h1: 'clamp(28px, 2.2vw + 18px, 48px)',
  h2: 'clamp(22px, 1.8vw + 14px, 36px)',
  body: 'clamp(14px, 0.6vw + 12px, 18px)',
  lead: 'clamp(16px, 0.8vw + 12px, 20px)'
};
