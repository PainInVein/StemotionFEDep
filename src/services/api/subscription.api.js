import axiosClient from "../../utils/axiosClient";

export const getSubscriptionByIdApi = (subscriptionId) => {
  return axiosClient.get(`/api/Subscription`, {
    params: { subscriptionId },
  });
};

export const createPaymentIntentApi = (payload) => {
  return axiosClient.post(`/api/payment/create-payment-intent`, payload);
};

export const cancelPaymentApi = (params) => {
  // params là object: { Code, PaymentLinkId, Status, OrderCode, Cancel }
  return axiosClient.get("/api/SubscriptionPayment/cancel-payment", { params });
};