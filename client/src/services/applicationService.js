import axios from "axios";

const API_URL = "http://localhost:5001/api/applications/";

// Helper to get auth header
const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo && userInfo.token) {
    return {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
  }
  return {};
};

// Create new application
export const createApplication = async (applicationData) => {
  const response = await axios.post(API_URL, applicationData, getAuthHeaders());
  return response.data;
};

// Get user applications
export const getApplications = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Update an application
export const updateApplication = async (applicationId, applicationData) => {
  const response = await axios.put(
    API_URL + applicationId,
    applicationData,
    getAuthHeaders()
  );
  return response.data;
};

// Delete an application
export const deleteApplication = async (applicationId) => {
  const response = await axios.delete(API_URL + applicationId, getAuthHeaders());
  return response.data;
};

// Reorder applications
export const reorderApplications = async (updates) => {
  const response = await axios.put(API_URL + "reorder", { updates }, getAuthHeaders());
  return response.data;
};
