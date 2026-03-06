import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getGradesService,
  getSubjectsService,
  getChaptersService,
} from "../../../services/education/education.service";
import useAuth from "../../../contexts/AuthContext";
import { useAuthModalStore } from "../../../stores/authModalStore";
import { TRIAL_CHAPTER_ID } from "../../../constants/trialChapter";
import Button from "../../../components/common/Button";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractUuidFromEnd = (s = "") => {
  const maybe = s.slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

const SUBJECT_IMAGE_FALLBACK = [
  "https://api.builder.io/api/v1/image/assets/TEMP/3b9a7abc60182324ab01178c5effdf72fbfe474e?width=178",
  "https://api.builder.io/api/v1/image/assets/TEMP/a1d458f0ec840dbe7d73e3d7b15f32c8f5c05fbd?width=222",
  "https://api.builder.io/api/v1/image/assets/TEMP/89a1f6c7a0bc9d274b7a5f3e9a1b46c6a4d4f9a0?width=200",
  "https://api.builder.io/api/v1/image/assets/TEMP/d75ed6b5e473e1a216381e3e5b01fed878b93e53?width=184",
];

const CHAPTER_IMAGE_FALLBACK = [
  "https://api.builder.io/api/v1/image/assets/TEMP/ad2105732a6c97f7ffb0fe0c187c3078957dd713?width=184",
  "https://api.builder.io/api/v1/image/assets/TEMP/d75ed6b5e473e1a216381e3e5b01fed878b93e53?width=184",
  "https://api.builder.io/api/v1/image/assets/TEMP/3b9a7abc60182324ab01178c5effdf72fbfe474e?width=178",
  "https://api.builder.io/api/v1/image/assets/TEMP/a1d458f0ec840dbe7d73e3d7b15f32c8f5c05fbd?width=222",
];

export default function Courses() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();

  // ✅ Auth
  const { isAuthenticated, user } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);

  // ✅ Popup cảnh báo chapter bị khóa
  const [lockedPopup, setLockedPopup] = useState(null); // { chapterName }

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag refs
  const isDraggingRef = useRef(false);
  const draggedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(null);

  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const gradeDropdownRef = useRef(null);

  const getShortId = (id = "", len = 8) => String(id).slice(0, len);

  const extractShortIdFromEnd = (s = "") => {
    const parts = s.split("~");
    return parts[parts.length - 1] || "";
  };

  const { logout } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const [gradeRes, subjectRes, chapterRes] = await Promise.all([
          getGradesService(1, 200),
          getSubjectsService(1, 500),
          getChaptersService(1, 2000),
        ]);

        const gradeItems = gradeRes?.items ?? [];
        const subjectItems = subjectRes?.items ?? [];
        const chapterItems = chapterRes?.items ?? [];

        setGrades(gradeItems);
        setSubjects(subjectItems);
        setChapters(chapterItems);

        const firstGrade = gradeItems?.[0]?.gradeLevel ?? 1;
        setSelectedGradeLevel(firstGrade);
      } catch (e) {
        setErr(e?.message || "Load failed");
      } finally {
        setLoading(false);
        setTimeout(() => checkScrollButtons(), 0);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const selectedSubject = useMemo(() => {
    if (!subjectSlug) return null;

    const shortId = extractShortIdFromEnd(subjectSlug);
    if (shortId) {
      const found = subjects.find((s) =>
        String(s.subjectId).startsWith(shortId)
      );
      if (found) return found;
    }

    return (
      subjects.find((s) => slugify(s.subjectName) === subjectSlug) || null
    );
  }, [subjectSlug, subjects]);

  useEffect(() => {
    if (selectedSubject?.gradeLevel != null) {
      setSelectedGradeLevel(Number(selectedSubject.gradeLevel));
    }
  }, [selectedSubject]);

  const subjectCards = useMemo(() => {
    if (selectedGradeLevel == null) return [];
    return (subjects || [])
      .filter(
        (s) =>
          s?.status !== "Inactive" &&
          Number(s.gradeLevel) === Number(selectedGradeLevel)
      )
      .map((s, idx) => ({
        kind: "subject",
        id: s.subjectId,
        title: s.subjectName,
        image: SUBJECT_IMAGE_FALLBACK[idx % SUBJECT_IMAGE_FALLBACK.length],
        subjectId: s.subjectId,
        subjectName: s.subjectName,
        gradeLevel: s.gradeLevel,
      }));
  }, [subjects, selectedGradeLevel]);

  const chapterCards = useMemo(() => {
    if (!selectedSubject) return [];

    const selectedGrade = Number(selectedSubject.gradeLevel);

    return (chapters || [])
      .filter((c) => {
        if (!c || c?.status === "Inactive") return false;

        const chapterGrade = Number(c.gradeLevel);
        if (!Number.isNaN(selectedGrade) && !Number.isNaN(chapterGrade)) {
          if (chapterGrade !== selectedGrade) return false;
        }

        if (c.subjectId && selectedSubject.subjectId) {
          return c.subjectId === selectedSubject.subjectId;
        }

        return c.subjectName === selectedSubject.subjectName;
      })
      .map((c, idx) => ({
        kind: "chapter",
        id: c.chapterId,
        title: c.chapterName,
        image: CHAPTER_IMAGE_FALLBACK[idx % CHAPTER_IMAGE_FALLBACK.length],
        chapterId: c.chapterId,
        chapterName: c.chapterName,
      }));
  }, [chapters, selectedSubject]);

  const learningCards = subjectSlug ? chapterCards : subjectCards;

  const selectedGradeName = useMemo(() => {
    const g = grades.find((x) => Number(x.gradeLevel) === Number(selectedGradeLevel));
    return g?.name || `Lớp ${selectedGradeLevel ?? ""}`;
  }, [grades, selectedGradeLevel]);

  // ✅ Kiểm tra chapter có bị khóa không
  const isChapterLocked = (chapterId) => {
    const isTrial = chapterId === TRIAL_CHAPTER_ID;
    if (isTrial) return false; // chapter thử luôn mở

    if (!isAuthenticated) return true; // chưa login → khóa
    if (user?.role === "student" && !user?.parentPaid) return true; // student chưa paid → khóa
    return false;
  };

  const checkScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: "smooth" });
    setTimeout(checkScrollButtons, 300);
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
    setTimeout(checkScrollButtons, 300);
  };

  const onPointerDown = (e) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    draggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const onPointerMove = (e) => {
    const el = scrollContainerRef.current;
    if (!el || !isDraggingRef.current) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) draggedRef.current = true;

    el.scrollLeft = startScrollLeftRef.current - dx;
    checkScrollButtons();
  };

  const endDrag = () => {
    isDraggingRef.current = false;
  };

  // ✅ Handle click chapter bị khóa
  const handleLockedChapterClick = (card) => {
    if (!isAuthenticated) {
      // Chưa login → mở modal login
      openLogin(window.location.pathname);
    } else {
      // Đã login nhưng chưa paid → hiện popup nâng cấp
      setLockedPopup({ chapterName: card.title });
    }
  };

  const handleUpgradeClick = async () => {
    // 1) Logout tài khoản student hiện tại
    await logout();

    // 2) Mở modal login với role parent (giống HeroSection)
    openLogin(null, "parent");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        gradeDropdownRef.current &&
        !gradeDropdownRef.current.contains(event.target)
      ) {
        setIsGradeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-[63px]">
        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-10">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100 px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold">
                <i className="fa-solid fa-book-open" />
                Khám phá ngay
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-[1.2] text-slate-900">
                Lộ trình học tập
              </h1>

              <p className="text-base lg:text-[16px] leading-[1.6] text-slate-600">
                Từng bước chinh phục Toán học
              </p>

              <div className="mt-1 text-sm">
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-indigo-600 font-medium">
                    <i className="fa-solid fa-spinner animate-spin" />
                    Đang tải dữ liệu...
                  </span>
                ) : err ? (
                  <span className="inline-flex items-center gap-2 text-red-500 font-medium">
                    <i className="fa-solid fa-circle-exclamation" />
                    Lỗi: {err}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Grade Section */}
        <div className="mb-10 sm:mb-12 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 rounded-[28px] bg-gradient-to-r from-violet-100 via-fuchsia-50 to-cyan-50 border border-violet-200/70 shadow-sm px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-7">
            {/* Illustration */}
            <div className="flex-shrink-0 self-center lg:self-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/80 shadow-md flex items-center justify-center border border-white">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/725362ab4d4998174967e88c4d07dcb94ef059e0?width=192"
                  alt="Foundation Math 1"
                  className="w-16 sm:w-20 h-auto"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-violet-700 text-xs sm:text-sm font-semibold shadow-sm border border-violet-100">
                  <i className="fa-solid fa-graduation-cap" />
                  Khối học hiện tại
                </span>

                <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg">
                  <span className="text-lg sm:text-xl lg:text-[22px] font-extrabold tracking-wide">
                    {selectedGradeName}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base lg:text-[16px] leading-[1.6] text-slate-700 max-w-2xl">
                Chọn lớp phù hợp để khám phá lộ trình học tập và các chuyên đề Toán thú vị cho bé.
              </p>
            </div>

            {/* Select */}
            {!!grades.length && (
              <div className="w-full sm:w-auto lg:min-w-[240px]" ref={gradeDropdownRef}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Chọn lớp học
                </label>

                <div className="relative">
                  <button
                    type="button"
                    disabled={!!subjectSlug}
                    onClick={() => {
                      if (subjectSlug) return;
                      setIsGradeDropdownOpen((prev) => !prev);
                    }}
                    className={`
          w-full rounded-2xl border-2 bg-white
          px-4 py-3 text-sm sm:text-base font-semibold
          shadow-sm transition-all
          flex items-center justify-between gap-3
          focus:outline-none
          ${subjectSlug
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-violet-200 text-slate-800 hover:border-violet-300"
                      }
        `}
                  >
                    <span>{selectedGradeName}</span>
                    <i
                      className={`fa-solid fa-chevron-down text-sm transition-transform ${isGradeDropdownOpen ? "rotate-180 text-violet-600" : "text-violet-500"
                        }`}
                    />
                  </button>

                  {!subjectSlug && isGradeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-xl">
                      <div className="max-h-72 overflow-y-auto py-2">
                        {grades.map((g) => {
                          const isActive =
                            Number(selectedGradeLevel) === Number(g.gradeLevel);

                          return (
                            <button
                              key={g.gradeId}
                              type="button"
                              onClick={() => {
                                setSelectedGradeLevel(Number(g.gradeLevel));
                                setIsGradeDropdownOpen(false);
                              }}
                              className={`
                    w-full px-4 py-3 text-left text-sm sm:text-base transition-colors
                    flex items-center justify-between
                    ${isActive
                                  ? "bg-violet-50 text-violet-700 font-bold"
                                  : "text-slate-700 hover:bg-violet-50"
                                }
                  `}
                            >
                              <span>{g.name}</span>
                              {isActive && (
                                <i className="fa-solid fa-check text-violet-500 text-sm" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {subjectSlug && (
                  <p className="mt-2 text-xs text-slate-500">
                    Đang xem theo môn học nên không thể đổi lớp.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back button khi đang xem chapter */}
        {subjectSlug && (
          <div className="mb-4 flex items-center gap-3 h-auto justify-between">
            <div className="h-auto w-full md:w-[50%] flex-1">
              <Button onClick={() => navigate("/courses")} size="sm" className="h-auto md:h-10 px-10 py-auto">
                ← Quay về lựa chọn môn học
              </Button>
            </div>
            <div className="text-xl font-semibold text-slate-600 w-full text-center md:text-right flex-1">
              Môn học đã chọn: <b className="text-fuchsia-400 text-xl md:text-2xl">{selectedSubject?.subjectName || "—"}</b>
            </div>
          </div>
        )}

        {/* Learning Cards */}
        <div className="pt-3">
          <div className="relative">
            <div className="rounded-xl bg-purple-100 p-6 sm:p-8 lg:px-6 lg:py-9 overflow-hidden">
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  onScroll={checkScrollButtons}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onPointerLeave={endDrag}
                  className="flex gap-4 overflow-x-auto scrollbar-hide p-2 cursor-grab active:cursor-grabbing select-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {learningCards.map((card) => {
                    // ======== SUBJECT CARDS (trang /courses) ========
                    if (!subjectSlug && card.kind === "subject") {
                      const to = `/courses/${slugify(card.title)}~${getShortId(card.subjectId)}`;
                      return (
                        <Link
                          key={card.id}
                          to={to}
                          onClick={(e) => {
                            if (draggedRef.current) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          className="flex-shrink-0 w-44 sm:w-48 lg:w-44 block"
                        >
                          <CardUI title={card.title} image={card.image} />
                        </Link>
                      );
                    }

                    // ======== CHAPTER CARDS (trang /courses/:subjectSlug) ========
                    const isTrial = card.chapterId === TRIAL_CHAPTER_ID;
                    const locked = isChapterLocked(card.chapterId);

                    // Route: trial dùng /trial/..., bình thường dùng /courses/...
                    const to = isTrial
                      ? `/trial/courses/${subjectSlug}/chapter/${slugify(card.title)}~${getShortId(card.chapterId)}`
                      : `/courses/${subjectSlug}/chapter/${slugify(card.title)}~${getShortId(card.chapterId)}`;

                    const linkState = {
                      subjectName: selectedSubject?.subjectName,
                      chapterName: card.chapterName,
                      chapterId: card.chapterId,
                    };

                    return (
                      <div
                        key={card.id}
                        className="flex-shrink-0 w-44 sm:w-48 lg:w-44 relative"
                      >
                        {locked ? (
                          // ✅ LOCKED: click hiện cảnh báo, không navigate
                          <div
                            className="block cursor-pointer"
                            onClick={() => {
                              if (draggedRef.current) return;
                              handleLockedChapterClick(card);
                            }}
                          >
                            <CardUI
                              title={card.title}
                              image={card.image}
                              locked={true}
                            />
                          </div>
                        ) : (
                          // ✅ UNLOCKED: navigate bình thường
                          <Link
                            to={to}
                            state={linkState}
                            onClick={(e) => {
                              if (draggedRef.current) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                            className="block"
                          >
                            <CardUI
                              title={card.title}
                              image={card.image}
                              locked={false}
                              isTrial={isTrial}
                            />
                          </Link>
                        )}

                        {/* ✅ Badge "Miễn phí" cho trial chapter */}
                        {isTrial && (
                          <div className="absolute top-2 left-2 z-20 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            Miễn phí
                          </div>
                        )}

                        {/* ✅ Badge khoá cho locked chapter */}
                        {locked && (
                          <div className="absolute top-2 right-2 z-20 bg-gray-700/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <i className="fa-solid fa-lock text-[8px]" />
                            Premium
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {canScrollLeft && (
                  <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-2 pointer-events-auto">
                      <button
                        onClick={scrollLeft}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 transition-colors"
                        aria-label="Scroll left"
                      >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <path d="M23.3333 10L25.6833 12.35L18.05 20L25.6833 27.65L23.3333 30L13.3334 20L23.3333 10Z" fill="white" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {canScrollRight && (
                  <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 pointer-events-auto">
                      <button
                        onClick={scrollRight}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 transition-colors"
                        aria-label="Scroll right"
                      >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <path d="M16.6667 10L14.3167 12.35L21.95 20L14.3167 27.65L16.6667 30L26.6666 20L16.6667 10Z" fill="white" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 h-px bg-brilliant-gray-90" />
        </div>
      </div>

      {/* ✅ POPUP CẢNH BÁO CHAPTER BỊ KHÓA */}
      {lockedPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setLockedPopup(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <i className="fa-solid fa-crown text-yellow-500 text-2xl" />
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cần nâng cấp Premium
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Chương{" "}
                  <span className="font-semibold text-gray-800">
                    "{lockedPopup.chapterName}"
                  </span>{" "}
                  yêu cầu tài khoản Premium. Phụ huynh vui lòng nâng cấp để mở
                  khóa toàn bộ nội dung học.
                </p>
              </div>

              {/* Lợi ích Premium */}
              <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 text-left space-y-2">
                {[
                  "Truy cập toàn bộ bài học",
                  "Không giới hạn luyện tập",
                  "Nội dung cập nhật thường xuyên",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-indigo-500 text-xs" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleUpgradeClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
                >
                  <i className="fa-solid fa-crown mr-2" />
                  Nâng cấp Premium ngay
                </button>

                <button
                  onClick={() => setLockedPopup(null)}
                  className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ✅ CardUI — thêm prop locked và isTrial
function CardUI({ title, image, locked = false, isTrial = false }) {
  return (
    <div
      className={`flex flex-col items-center gap-6 group ${locked ? "cursor-pointer" : "cursor-pointer"}`}
    >
      <div
        className={`
          relative isolate w-44 h-44 rounded-[20px]
          before:content-[''] before:absolute before:inset-0
          before:rounded-[20px] before:translate-x-0 before:translate-y-[8px] before:-z-10
          transition-all duration-200
          ${locked
            ? "before:bg-gray-300 grayscale opacity-60"
            : isTrial
              ? "before:bg-green-200 group-hover:scale-[1.02]"
              : "before:bg-gray-200 group-hover:scale-[1.02]"
          }
        `}
      >
        <div
          className={`
            relative z-10 w-full h-full rounded-[20px] border-2 overflow-hidden
            ${locked
              ? "border-gray-300 bg-gray-100"
              : isTrial
                ? "border-green-200 bg-white"
                : "border-gray-200 bg-white"
            }
          `}
        >
          {/* Right line decoration */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-100" />

          {/* Image */}
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain m-4"
              draggable="false"
            />
          </div>

          {/* ✅ Lock overlay khi bị khóa */}
          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 rounded-[18px] gap-1">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-lock text-gray-500 text-base" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="text-center px-4">
        <p
          className={`text-base leading-6 ${locked
            ? "text-gray-400"
            : isTrial
              ? "text-green-700 font-medium group-hover:underline"
              : "text-brilliant-black group-hover:underline"
            }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}