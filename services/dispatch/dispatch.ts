import api from "../axios";


export const DispatchService = {
  // Fetch Task Details
  getTask: async (trackingId: string) => {
    const response = await api.get(`/dispatch/task/${trackingId}`);
    return response.data.data;
  },

  // Rider Claims the Order
  assignRider: async (payload: { trackingId: string; name: string; phone: string }) => {
    const response = await api.post('/dispatch/assign-rider', payload);
    return response.data;
  },

  // Rider Picks Up Order
  pickupOrder: async (trackingId: string) => {
    const response = await api.post('/dispatch/task/pickup', { trackingId });
    return response.data;
  },

  // Rider Completes Order
  completeOrder: async (payload: { trackingId: string; otp: string }) => {
    const response = await api.post('/dispatch/task/complete', payload);
    return response.data;
  }
};