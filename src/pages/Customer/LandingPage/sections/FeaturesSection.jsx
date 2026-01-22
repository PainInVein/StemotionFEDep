// src/pages/LandingPage/sections/FeaturesSection.jsx
import { lazy, Suspense, memo, useMemo } from "react";
import MiniDragGame from "../../../Games/MiniDragGame";

// ✅ Lazy load Lesson
const Lesson = lazy(() => import("../../../../components/common/Lesson"));

// Memoize progress item
const ProgressLesson = memo(({ status, offset }) => (
  <div className={`flex-col justify-center items-center ${offset}`}>
    <div
      className={`w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] ${status === "done" || status === "doing"
          ? "bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44]"
          : "bg-[#C2C2C2]"
        } rounded-full flex justify-center items-center`}
    >
      <div className="w-[90px] h-[90px] sm:w-[140px] sm:h-[140px] bg-white rounded-full flex justify-center items-center">
        {/* Font Awesome icon */}
        <i
          className={[
            "fa-solid fa-bolt",
            "text-[40px] sm:text-[56px]", // <-- size icon (font-size)
            "leading-none",               // <-- tránh lệch do line-height
            status === "done" || status === "doing" ? "text-[#7E82E4]" : "text-[#E5E5E5]",
          ].join(" ")}
          aria-hidden="true"
        />
      </div>
    </div>

    <p
      className={`${status === "done" || status === "doing" ? "text-[#7E82E4]" : "text-[#C2C2C2]"
        } font-bold text-center mt-2`}
    >
      {status === "done" ? "T2" : status === "doing" ? "T3" : "T4"}
    </p>
  </div>
));
ProgressLesson.displayName = "ProgressLesson";

const FeaturesSection = memo(function FeaturesSection() {
  const progress = useMemo(
    () => ({
      lesson1: "done",
      lesson2: "doing",
      lesson3: "not_started",
    }),
    []
  );

  return (
    <>
      {/* ===== SECTION 1: Header + Học tương tác ===== */}
      <section className="relative overflow-hidden bg-gradient-hero ">
        <div className="max-w-6xl mx-auto w-full space-y-10">
          {/* Header */}
          <div className="text-center p-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
              Tại sao chọn STEMotion?
            </h2>
            <p className="text-white/80">Phương pháp học hiện đại và hiệu quả</p>
          </div>

          {/* Block 1 */}
          <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden bg-gradient-to-br from-white to-blue-100">
            <div className="flex-1 p-6 md:p-10 flex justify-center md:justify-start">
              <div className="w-full md:w-[500px]">
                <MiniDragGame height={240} className="w-full" />
              </div>
            </div>

            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-4 md:space-y-6 text-center md:text-left ">
              <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl">Học tương tác</h2>
              <p className="text-base sm:text-lg">
                Khám phá khoa học qua hình ảnh và hoạt động thực hành
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: Tiến bộ từng bước ===== */}
      <section className="relative overflow-hidden bg-gradient-hero ">
        <div className="max-w-6xl mx-auto w-full bg-gradient-to-br from-white to-blue-100">
          <div className="flex flex-col md:flex-row rounded-xl overflow-hidden">
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-4 md:space-y-6 text-center md:text-left">
              <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl">Tiến bộ từng bước</h2>
              <p className="text-base sm:text-lg">
                Nắm vững từng khái niệm trước khi chuyển sang bài tiếp theo
              </p>
            </div>

            <div className="flex-1 p-6 md:p-10 flex flex-col items-center md:items-start space-y-6">
              <Suspense fallback={<div className="text-gray-500">Đang tải lộ trình...</div>}>
                <div className="mr-48">
                  <Lesson status={progress.lesson1} to="#" />
                </div>
                <div className="ml-48 md:ml-60">
                  <Lesson status={progress.lesson2} to="#" />
                </div>
                <div className="mr-48">
                  <Lesson status={progress.lesson3} to="#" />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: Giữ vững động lực ===== */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="max-w-6xl mx-auto w-full bg-gradient-to-br from-white to-blue-100">
          <div className="flex flex-col md:flex-row rounded-xl overflow-hidden py-0 md:py-10">
            <div className="flex-1 px-6 py-16 md:px-10 md:py-40 flex justify-center md:justify-start">
              <div className="flex gap-4 sm:gap-6">
                <ProgressLesson status="done" offset="translate-y-10 md:translate-y-20" />
                <ProgressLesson status="doing" offset="translate-y-0" />
                <ProgressLesson status="not_started" offset="-translate-y-10 md:-translate-y-20" />
              </div>
            </div>

            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-4 md:space-y-6 text-center md:text-left">
              <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl">Giữ vững động lực</h2>
              <p className="text-base sm:text-lg">
                Kết thúc mỗi ngày thông minh hơn với những bài học thú vị, tính năng thi đua hấp dẫn và lời khích lệ mỗi ngày
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

FeaturesSection.displayName = "FeaturesSection";
export default FeaturesSection;
