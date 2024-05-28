const API_URL = 'http://localhost:3001';

export const getProperties = async () => {
  const response = await fetch(`${API_URL}/properties`);
  return await response.json();
};

export const getUserProperties = async (owner) => {
  const response = await fetch(`${API_URL}/properties/owner/${owner}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch properties');
  }
};
