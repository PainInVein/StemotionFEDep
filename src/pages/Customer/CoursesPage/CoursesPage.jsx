import React, { useState, useRef, useEffect } from "react";
import CourseCard from "../../../components/CourseCard/CourseCard";
import math from "../../../assets/math.png";

export default function CoursesPage() {
  const allCourses = [
    { title: "Vật lý chuyển động", image: math, category: "Khoa học" },
    { title: "Hóa học cơ bản", image: math, category: "Khoa học" },
    { title: "Sinh học ứng dụng", image: math, category: "Khoa học" },

    { title: "Lập trình trực quan cơ bản", image: math, category: "Công nghệ" },
    { title: "Lập trình văn bản", image: math, category: "Công nghệ" },
    { title: "Khoa học máy tính nền tảng", image: math, category: "Công nghệ" },

    { title: "Điện tử & mạch điện", image: math, category: "Kỹ thuật" },
    { title: "Robot học nhập môn", image: math, category: "Kỹ thuật" },
    { title: "Cơ khí & thiết kế kỹ thuật", image: math, category: "Kỹ thuật" },

    { title: "Nền tảng toán học", image: math, category: "Toán học" },
    { title: "Hình học & lượng giác", image: math, category: "Toán học" },
    { title: "Xác suất & thống kê", image: math, category: "Toán học" },
  ];

  const categories = [
    "Tất cả",
    "Khoa học",
    "Công nghệ",
    "Kỹ thuật",
    "Toán học",
  ];

  const [active, setActive] = useState("Tất cả");

  const tabsRef = useRef([]);
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const index = categories.indexOf(active);
    const el = tabsRef.current[index];
    if (el) {
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [active]);

  return (
    <div className="min-h-screen bg-gradient-hero overflow-x-hidden">
      {/* Header */}
      <section className="container mx-auto px-4 py-10 sm:py-14 md:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] bg-clip-text text-transparent">
            Khóa học STEM
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-semibold max-w-2xl mx-auto">
          Khám phá và học hỏi qua các khóa học tương tác
        </p>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4">
        <div className="flex justify-start sm:justify-center mb-8">
          <div
            ref={containerRef}
            className="relative flex gap-1 bg-gray-100 rounded-full p-1
                       overflow-x-auto scrollbar-hide w-full sm:w-auto"
          >
            <div
              className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300"
              style={{
                left: indicator.left,
                width: indicator.width,
              }}
            />

            {categories.map((c, i) => (
              <button
                key={c}
                ref={(el) => (tabsRef.current[i] = el)}
                onClick={() => setActive(c)}
                className={`relative z-10 whitespace-nowrap
                  px-4 sm:px-6 py-2 text-sm sm:text-base
                  rounded-full font-medium transition
                  ${
                    active === c
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-16">
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-5
            gap-4 sm:gap-6
            max-w-7xl
            mx-auto
          "
        >
          {allCourses
            .filter(
              (c) => active === "Tất cả" || c.category === active
            )
            .map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
        </div>
      </section>
    </div>
  );
}
