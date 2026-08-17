export const APP_CONFIG = {
  // Flag to toggle mock data across the entire application
  // Set to true to use mock data when API fails, false to disable completely.
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false,
};
