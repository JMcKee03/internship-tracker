const API_URL = "http://localhost:5000/api/auth/";

export const registerUser = async (userData) => {
  const response = await fetch(API_URL + "register", {
    method: "POST", // VERY IMPORTANT
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};