export const logger = {
  error: (message: string, error?: any, context?: any) => {
    console.error(`[ERROR] ${message}`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
    // In a production environment, this could forward to Sentry, LogRocket, etc.
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? data : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? data : '');
  }
};
