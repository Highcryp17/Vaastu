const API_URL = 'http://localhost:3001';

export const getProperties = async () => {
  const response = await fetch(`${API_URL}/properties`);
  return await response.json();
};


export const listProperty = async (propertyData) => {
  const response = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to list property');
  }
};

export const purchaseProperty = async (purchaseData) => {
  const response = await fetch(`${API_URL}/properties/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(purchaseData),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to purchase property');
  }
};


export const getUserProperties = async (owner) => {
  const response = await fetch(`${API_URL}/properties/owner/${owner}`);
  if (response.ok) {
    const data = await response.json();
    // Fetch general properties to include generalId
    const generalProperties = await getProperties();
    const propertiesWithGeneralId = data.map(property => {
      const generalProperty = generalProperties.find(gp => gp.tokenId === property.tokenId);
      return { ...property, generalId: generalProperty ? generalProperty._id : null };
    });
    return propertiesWithGeneralId;
  } else {
    throw new Error('Failed to fetch properties');
  }
};
