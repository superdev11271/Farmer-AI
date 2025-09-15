// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9004';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    prompts: `${API_BASE_URL}/api/prompts`,
    auth: `${API_BASE_URL}/api/auth`,
    documents: `${API_BASE_URL}/api/document`,
    invoices: `${API_BASE_URL}/api/invoice`,
  },
  // Helper function to get invoice endpoint with category
  getInvoiceEndpoint: (categoryIdentifier) => `${API_BASE_URL}/api/invoice/${categoryIdentifier}`,
  // Helper function to get document URL
  getDocumentUrl: (path) => `${API_BASE_URL}/${path}`,
};

export default apiConfig;
