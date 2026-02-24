import { getSubscriptionByIdApi, createPaymentIntentApi, cancelPaymentApi, getPaymentApi } from "../api/subscription.api";

// ✅ BẬT/TẮT mock tại đây
const USE_MOCK_PAYMENT = true; // true = test chưa paid | false = dùng BE thật

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

export const getPaymentService = async (userId) => {
  const res = await getPaymentApi(userId);
  const data = res.data;

  if (!data?.isSuccess) {
    throw new Error(data?.message || "Không kiểm tra được trạng thái thanh toán");
  }

  // BE đang trả result: true/false (đã mua gói hay chưa)
  if (typeof data?.result !== "boolean") {
    throw new Error("Dữ liệu trả về không hợp lệ");
  }

  return data.result; // true/false
};

// export const getPaymentService = async (userId) => {
//   // ✅ MOCK: giả lập chưa trả tiền để test UI
//   if (USE_MOCK_PAYMENT) {
//     console.warn(
//       `[MOCK] getPaymentService(userId=${userId}) → trả về FALSE (chưa paid). Tắt USE_MOCK_PAYMENT khi dùng thật.`
//     );
//     // Giả lập delay network cho thực tế hơn
//     await new Promise((r) => setTimeout(r, 300));
//     return false; // ← đổi thành true để test flow đã paid
//   }

//   // ✅ REAL: gọi BE thật
//   const res = await getPaymentApi(userId);
//   const data = res.data;

//   if (!data?.isSuccess) {
//     throw new Error(data?.message || "Không kiểm tra được trạng thái thanh toán");
//   }

//   if (typeof data?.result !== "boolean") {
//     throw new Error("Dữ liệu trả về không hợp lệ");
//   }

//   return data.result;
// };