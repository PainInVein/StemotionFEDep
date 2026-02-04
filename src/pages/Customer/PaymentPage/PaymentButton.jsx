// src/components/PaymentButton.jsx
import { useEffect, useState } from "react";
import {
    getSubscriptionByIdService,
    createPaymentIntentService,
} from "../../../services/subscription/subscription.service";
import { toast } from "react-toastify";

const DEFAULT_SUBSCRIPTION_ID = "7e259b3e-b40f-4bbf-b770-a221ad8670f0";
const USER_ID = "60e7ba74-220e-4be5-af9b-97d8736a442f";

export default function PaymentButton({
    subscriptionId = DEFAULT_SUBSCRIPTION_ID,
}) {
    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const run = async () => {
            try {
                setFetchError(null);
                const sub = await getSubscriptionByIdService(subscriptionId);
                if (mounted) setSubscription(sub);
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
                const msg = err?.message || "Không thể tải thông tin gói";
                if (mounted) setFetchError(msg);
                toast.error("Không thể tải thông tin gói đăng ký");
            }
        };

        run();
        return () => {
            mounted = false;
        };
    }, [subscriptionId]);

    const handlePay = async () => {
        if (!subscription) {
            toast.error("Chưa có thông tin gói. Vui lòng thử lại.");
            return;
        }

        setLoading(true);
        try {
            const checkoutUrl = await createPaymentIntentService({
                userId: USER_ID,
                subscriptionInfo: {
                    subscriptionId: subscription.subscriptionId,
                    subscriptionName: subscription.subscriptionName,
                    subscriptionPrice: subscription.subscriptionPrice,
                    billingPeriod: subscription.billingPeriod,
                },
            });

            window.location.href = checkoutUrl;
        } catch (err) {
            console.error("Payment initiation failed:", err);
            toast.error(
                err?.message || "Lỗi khi khởi tạo thanh toán. Vui lòng thử lại.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetchError) {
        return (
            <div className="mx-auto w-full max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold">Đã xảy ra lỗi</p>
                        <p className="mt-1 text-sm">
                            Lỗi: <span className="font-medium">{fetchError}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="mx-auto w-full max-w-xl rounded-xl border bg-white p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-5 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-4/5 rounded bg-gray-200" />
                    <div className="h-8 w-2/3 rounded bg-gray-200" />
                    <div className="h-10 w-full rounded bg-gray-200" />
                </div>
                <p className="mt-4 text-sm text-gray-500">Đang tải thông tin gói...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm"> 

            <div className="mb-5">
                <h3 className="text-xl font-semibold text-gray-900">
                    {subscription.subscriptionName}
                </h3>

                {subscription.description ? (
                    <p className="mt-2 text-sm text-gray-600">{subscription.description}</p>
                ) : (
                    <p className="mt-2 text-sm text-gray-500">Gói đăng ký</p>
                )}

                <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-2xl font-bold text-emerald-600">
                        {subscription.subscriptionPrice.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <span className="text-sm text-gray-500">
                        / {subscription.billingPeriod.toLowerCase()}
                    </span>
                </div>
            </div>

            <button
                onClick={handlePay}
                disabled={loading}
                className={[
                    "w-full rounded-xl px-4 py-3 text-base font-semibold text-white shadow-sm transition",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    loading
                        ? "cursor-not-allowed bg-gray-300"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
                ].join(" ")}
            >
                {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                        Đang xử lý...
                    </span>
                ) : (
                    `Thanh toán ${subscription.subscriptionPrice.toLocaleString("vi-VN")} VNĐ`
                )}
            </button>

            <p className="mt-3 text-xs text-gray-500">
                Bằng việc thanh toán, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
            </p>
        </div>
    );
}
