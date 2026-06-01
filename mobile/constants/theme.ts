export const colors = {
  // Backgrounds
  bg:         '#0D0D1A',
  bgCard:     '#1A1A2E',
  bgCardHigh: '#1E1E35',

  // Primary
  primary:    '#7C3AED',
  primaryLight:'#9F6FF0',

  // Accent
  teal:       '#2DD4BF',
  tealDark:   '#14B8A6',

  // Text
  text:       '#FFFFFF',
  textMuted:  'rgba(255,255,255,0.55)',
  textSub:    'rgba(255,255,255,0.35)',

  // Semantic
  success:    '#2DD4BF',
  warning:    '#F59E0B',
  danger:     '#EF4444',

  // Border
  border:     'rgba(255,255,255,0.08)',
  borderStrong:'rgba(255,255,255,0.15)',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
};

export const typography = {
  h1:    { fontSize: 32, fontWeight: '800' as const },
  h2:    { fontSize: 24, fontWeight: '700' as const },
  h3:    { fontSize: 18, fontWeight: '700' as const },
  h4:   { fontSize: 16, fontWeight: '700' as const },
  body:  { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  small: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2 },
};