import { getSubscriptionByIdApi, createPaymentIntentApi, cancelPaymentApi } from "../api/subscription.api";

export const getSubscriptionByIdService = async (subscriptionId) => {
  const res = await getSubscriptionByIdApi(subscriptionId);
  const data = res.data;

  if (!data?.isSuccess) {
    throw new Error(data?.message || "Không tìm thấy gói");
  }

  if (!data?.result) {
    throw new Error("Không có dữ liệu gói");
  }

  return data.result;
};

export const createPaymentIntentService = async ({
  userId,
  subscriptionInfo,
}) => {
  const res = await createPaymentIntentApi({ userId, subscriptionInfo });
  const data = res.data;

  if (!data?.isSuccess) {
    throw new Error(data?.message || "Tạo link thanh toán thất bại");
  }

  const checkoutUrl = data?.result?.checkoutUrl;
  if (!checkoutUrl) throw new Error("Không nhận được link thanh toán từ server");
  if (typeof checkoutUrl !== "string" || !checkoutUrl.startsWith("http")) {
    throw new Error("Link thanh toán không hợp lệ");
  }

  return checkoutUrl;
};

export const cancelPaymentService = async (payload) => {
  const res = await cancelPaymentApi(payload);
  const data = res.data;

  // tùy BE trả shape gì, bạn chỉnh lại:
  if (data?.isSuccess === false) {
    throw new Error(data?.message || "Cập nhật hủy thanh toán thất bại");
  }

  return data;
};