// Content Sections
export const CONTENT_SECTIONS = {
  PREVIEWS: 'Previews',
  TRENDING: 'Trending Now',
  POPULAR: 'Popular on Streamio',
  TOP_RATED: 'Top Rated',
  ACTION: 'Action-Packed Movies',
  COMEDY: 'Comedy Hits',
  DRAMA: 'Critically Acclaimed Dramas',
  HORROR: 'Horror & Thriller',
  ANIMATION: 'Animation & Family',
  SCIFI: 'Sci-Fi & Fantasy',
} as const;

// Content Types
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person',
} as const;

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

// Video Types
export const VIDEO_TYPES = {
  TRAILER: 'Trailer',
  TEASER: 'Teaser',
  CLIP: 'Clip',
  FEATURETTE: 'Featurette',
  BEHIND_THE_SCENES: 'Behind the Scenes',
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#E50914',
  SECONDARY: '#564D4D',
  BACKGROUND: '#000000',
  SURFACE: {
    DEFAULT: '#222222',
    LIGHT: '#333333',
    DARK: '#111111',
  },
  TEXT: {
    PRIMARY: '#FFFFFF',
    SECONDARY: '#999999',
    DISABLED: '#666666',
  },
  BORDER: {
    DEFAULT: '#333333',
    LIGHT: '#444444',
    DARK: '#222222',
  },
  STATUS: {
    SUCCESS: '#1DB954',
    ERROR: '#FF0000',
    WARNING: '#FFA500',
  },
  OVERLAY: {
    DARK: 'rgba(0, 0, 0, 0.7)',
    LIGHT: 'rgba(255, 255, 255, 0.1)',
  },
  DANGER: '#FF0000',
} as const; 

// Typography
export const TYPOGRAPHY = {
  FONT_WEIGHTS: {
    REGULAR: '400',
    MEDIUM: '500',
    SEMI_BOLD: '600',
    BOLD: '700',
  },
  FONT_SIZES: {
    TINY: 10,
    SMALL: 12,
    REGULAR: 14,
    MEDIUM: 16,
    LARGE: 18,
    XLARGE: 20,
    XXLARGE: 24,
    HUGE: 32,
  },
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    LOOSE: 1.8,
  },
  FONT_FAMILIES: {
    PRIMARY: undefined, // Default system font
    PRIMARY_BOLD: undefined, // Default system font bold
  },
  STYLES: {
    H1: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    },
    H2: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    H3: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    BODY_LARGE: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    BODY: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    BODY_SMALL: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    LABEL: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
    BUTTON: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
  },
} as const;