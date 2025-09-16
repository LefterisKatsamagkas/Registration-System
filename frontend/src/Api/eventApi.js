// eventApi.js
import axios from 'axios';


export async function createEvent(name, description, creator, startDate, endDate, event_amount, event_currency, banner) {
  try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('creator', creator);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('event_amount', event_amount);
      formData.append('event_currency', event_currency);
      formData.append('banner', banner); // Add the banner file to the FormData

      const response = await axios.post('/api/events/', formData, {
          headers: {
              'Content-Type': 'multipart/form-data', // Set content type to allow file upload
          },
      });

      return response.data;
  } catch (error) {
      throw(error);
  }
}

export async function getAllEvents(creatorId) {
  try {
    const response = await axios.get('/api/events/', {
      params: {
        creatorId: creatorId
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteEvent(eventId) {
  try {
    const response = await axios.delete(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateEvent(eventId, name, description, startDate, endDate, event_amount, event_currency, banner) {
  try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('event_amount', event_amount);
      formData.append('event_currency', event_currency);
      formData.append('banner', banner); // Add the banner file to the FormData

      const response = await axios.put(`/api/events/${eventId}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data', // Set content type to allow file upload
          },
      });
      return response.data;
  } catch (error) {
      throw(error);
  }
}

export const subscribeToEvent = async (eventId, data) => {
  try {
    const response = await axios.post(`/api/events/${eventId}/subscribe`, data);
    return response.data;
  } catch (error) {
    console.error('Error subscribing to event:', error);
    throw error;
  }
};

export async function getEventById(eventId) {
  try {
    const response = await axios.get(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createStripePayment(data) {
  try {
    const response = await axios.post(`/api/events/create-checkout-session`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getEventPrice(eventId) {
  try {
    const response = await axios.get(`/api/events/${eventId}/price`);
    return response.data;
  } catch (error) {
    throw error;
  }
} 
