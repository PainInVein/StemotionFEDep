import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { cancelPaymentService } from "../../../services/subscription/subscription.service";

export default function PaymentCancel() {
  const paymentInfo = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      code: params.get("code") || "N/A",
      paymentLinkId: params.get("id") || "N/A",
      cancel: params.get("cancel") || "N/A",
      status: params.get("status") || "N/A",
      orderCode: params.get("orderCode") || "N/A",
    };
  }, []);

  const [notifyStatus, setNotifyStatus] = useState("");

  useEffect(() => {
    if (!paymentInfo.orderCode || paymentInfo.orderCode === "N/A") {
      console.warn("No valid orderCode found in URL — skipping backend notify");
      return;
    }

    let cancelled = false;

    const notifyBackend = async () => {
      try {
        const payload = {
          Code: paymentInfo.code,
          PaymentLinkId: paymentInfo.paymentLinkId,
          Status: paymentInfo.status,
          OrderCode: paymentInfo.orderCode,
          Cancel: paymentInfo.cancel,
        };

        await cancelPaymentService(payload);

        if (cancelled) return;

        setNotifyStatus("Đã thông báo hủy thanh toán cho hệ thống.");
        toast.success("Đã cập nhật trạng thái hủy thanh toán");
      } catch (err) {
        console.error("Failed to notify backend about cancellation:", err);

        if (cancelled) return;

        setNotifyStatus(
          "Không thể cập nhật trạng thái hủy (lỗi mạng). Vui lòng liên hệ hỗ trợ nếu cần.",
        );
        toast.error(err?.message || "Không thể cập nhật trạng thái hủy");
      }
    };

    notifyBackend();

    return () => {
      cancelled = true;
    };
  }, [paymentInfo]);

  const isError = notifyStatus.toLowerCase().includes("không thể");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl">✖</span>
          </div>
          <h1 className="text-2xl font-semibold text-red-600">
            Thanh toán bị hủy
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Bạn đã hủy quá trình thanh toán. Không có khoản phí nào được trừ.
          </p>

          {notifyStatus && (
            <p
              className={[
                "mt-4 text-sm font-medium",
                isError ? "text-red-600" : "text-emerald-600",
              ].join(" ")}
            >
              {notifyStatus}
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-gray-50 p-5">
          <h3 className="mb-3 text-base font-semibold text-gray-900">
            Chi tiết
          </h3>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">Mã trạng thái</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {paymentInfo.code}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500">
                Payment Link ID
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 break-all">
                {paymentInfo.paymentLinkId}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500">Trạng thái</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {paymentInfo.status}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-500">Order Code</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {paymentInfo.orderCode}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-gray-500">Hủy</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {paymentInfo.cancel}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Quay về trang chủ
          </button>

          <button
            onClick={() =>
              (window.location.href = `/payment?orderCode=${paymentInfo.orderCode}`)
            }
            className="w-full rounded-xl bg-gray-700 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
          >
            Thử thanh toán lại
          </button>
        </div>
      </div>
    </div>
  );
}
