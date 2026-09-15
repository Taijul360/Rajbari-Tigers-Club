export const analytics = {
  trackPageView: (path: string) => {
    // A lightweight client-side logger for page views
    console.info(`[Analytics] Page View: ${path} at ${new Date().toISOString()}`);
    // Future integration: gtag('config', 'G-XXXXXX', { page_path: path });
  },
  trackEvent: (category: string, action: string, label?: string, value?: number) => {
    console.info(`[Analytics] Event: [${category}] ${action}`, label ? `Label: ${label}` : '', value !== undefined ? `Value: ${value}` : '');
    // Future integration: gtag('event', action, { event_category: category, event_label: label, value: value });
  }
};
