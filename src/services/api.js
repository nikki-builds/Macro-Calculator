// this file handles all API calls to the backend

const API_URL = 'http://localhost:5000/api/calculations';

// create a function that takes calculation data as input
export const saveCalculation = async (calculationData) => {
  try {
    // send an HTTP request to the API and wait for the response
    const response = await fetch(API_URL, { // response: variable to store the result
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calculationData),
    });

    if (!response.ok) { //"if response is NOT ok"
      throw new Error ('Failed to save calculation');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving calculation', error);
    throw error;
  }
};

// Get all calculations
export const getAllCalculations = async () => {
  try {
    const response = await fetch(API_URL);

    if(!response.ok) {
      throw new Error('Failed to fetch calculations'); // new Error = create my own error with a custom message
    } 
    return await response.json();
  } catch (error) {
    console.error('Error fetching calculations:', error);
    throw error;
  }
};


// Delete a calculation
export const deleteCalculation = async(id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if(!response.ok) {
      throw new Error('Failed to delete calculation');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw error;
  }
};