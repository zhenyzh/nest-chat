export const TOKEN = {
  ACCESS: {
    STRING: '15m',
    MILLISECONDS: 15 * 60 * 1000,
  },
  REFRESH: {
    STRING: '30d',
    MILLISECONDS: 30 * 24 * 60 * 60 * 1000,
  },
  NAMESPACE: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
  },
} as const;
