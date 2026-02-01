// Backend is running with PORT from .env (5002 in your setup)
const baseURL = 'http://localhost:5002/api/cropInput';

export const createCropInput = async (cropInputData) => {
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cropInputData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating crop input:', error);
    throw error;
  }
};
