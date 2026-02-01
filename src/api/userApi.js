
const baseURL = 'http://localhost:5002/api/user';

export const createUser = async (userData) => {
  try {
    const response = await fetch(baseURL, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },  
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await fetch(baseURL + '/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Sign-in failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export default {
  createUser,
  signIn
};  