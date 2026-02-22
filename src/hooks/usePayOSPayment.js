// src/hooks/usePayOSPayment.js
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../contexts/AuthContext";
import {
  getSubscriptionByIdService,
  createPaymentIntentService,
} from "../services/subscription/subscription.service";

const DEFAULT_SUBSCRIPTION_ID = "62a98145-abbe-47b1-9389-91e8cd9423dc";

export default function usePayOSPayment(
  subscriptionId = DEFAULT_SUBSCRIPTION_ID,
) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setFetchError(null);
        const sub = await getSubscriptionByIdService(subscriptionId);
        if (mounted) setSubscription(sub);
      } catch (err) {
        const msg = err?.message || "Không thể tải thông tin gói";
        if (mounted) setFetchError(msg);
        toast.error("Không thể tải thông tin gói đăng ký");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [subscriptionId]);

  const pay = async () => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      toast.error("Bạn cần đăng nhập trước khi thanh toán.");
      return;
    }

    const userId = user?.userId;
    if (!userId) {
      toast.error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      return;
    }

    if (!subscription) {
      toast.error("Chưa có thông tin gói. Vui lòng thử lại.");
      return;
    }

    setLoading(true);
    try {
      const checkoutUrl = await createPaymentIntentService({
        userId,
        subscriptionInfo: {
          subscriptionId: subscription.subscriptionId,
          subscriptionName: subscription.subscriptionName,
          subscriptionPrice: subscription.subscriptionPrice,
          billingPeriod: subscription.billingPeriod,
        },
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(
        err?.message || "Lỗi khi khởi tạo thanh toán. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    fetchError,
    pay,
    loadingPay: loading,
    authLoading,
    isAuthenticated,
  };
}
