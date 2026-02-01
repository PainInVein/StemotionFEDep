import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getGradesService,
  getSubjectsService,
  getChaptersService,
} from "../../../services/education/education.service";

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
  const { subjectSlug } = useParams(); // ✅ có nghĩa là đang ở /courses/:subjectSlug
  const navigate = useNavigate();

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

  // ✅ resolve selected subject theo subjectSlug (để show chapter)
  const selectedSubject = useMemo(() => {
    if (!subjectSlug) return null;

    const id = extractUuidFromEnd(subjectSlug);
    if (id) {
      const found = subjects.find((s) => s.subjectId === id);
      if (found) return found;
    }

    // fallback theo slug name (kém ổn định hơn nếu trùng tên)
    const foundByName = subjects.find(
      (s) => slugify(s.subjectName) === subjectSlug
    );
    return foundByName || null;
  }, [subjectSlug, subjects]);

  // ✅ nếu đang ở subject route, grade hiển thị theo subject đó (đỡ lệch UI)
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

        // ✅ khóa theo gradeLevel để không lẫn chapter giữa các lớp
        const chapterGrade = Number(c.gradeLevel);
        if (!Number.isNaN(selectedGrade) && !Number.isNaN(chapterGrade)) {
          if (chapterGrade !== selectedGrade) return false;
        }

        // ✅ match subject: ưu tiên subjectId nếu BE có, fallback subjectName
        if (c.subjectId && selectedSubject.subjectId) {
          return c.subjectId === selectedSubject.subjectId;
        }

        // fallback: subjectName (đã khóa grade ở trên nên an toàn hơn nhiều)
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-[63px]">
        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-[24px] font-bold leading-[1.2] text-brilliant-black mb-1">
            Lộ trình học tập
          </h1>
          <p className="text-base lg:text-[16px] leading-[1.5] text-brilliant-gray-40">
            Từng bước chinh phục Toán học
          </p>
          <div className="mt-3 text-sm text-slate-500">
            {loading ? "Đang tải dữ liệu..." : err ? `Lỗi: ${err}` : null}
          </div>
        </div>

        {/* Grade Section */}
        <div className="mb-10 sm:mb-12 lg:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 lg:gap-10 p-6 sm:p-8 lg:p-6 rounded-xl">
            <div className="flex-shrink-0">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/725362ab4d4998174967e88c4d07dcb94ef059e0?width=192"
                alt="Foundation Math 1"
                className="w-20 h-auto sm:w-24 lg:w-24"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 lg:gap-8">
              <h2 className="text-xl sm:text-2xl lg:text-[20px] font-bold leading-[1.25] text-brilliant-black">
                {selectedGradeName}
              </h2>
              <p className="text-base lg:text-[16px] leading-[1.5] text-brilliant-gray-40 sm:pb-[1px]">
                Nắm vững các kỹ năng giải quyết vấn đề và nền tảng tư duy Toán.
              </p>
            </div>

            {!!grades.length && (
              <div className="sm:ml-auto">
                {/* ✅ chỉ cho đổi grade khi đang ở /courses (subject list) */}
                <select
                  disabled={!!subjectSlug}
                  value={selectedGradeLevel ?? ""}
                  onChange={(e) => setSelectedGradeLevel(Number(e.target.value))}
                  className={`border border-slate-200 rounded-lg px-3 py-2 text-sm ${subjectSlug ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {grades.map((g) => (
                    <option key={g.gradeId} value={g.gradeLevel}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Nếu đang xem chapter list: show back */}
        {subjectSlug && (
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              onClick={() => navigate("/courses")}
            >
              ← Quay về môn học
            </button>
            <div className="text-sm text-slate-600">
              Môn đã chọn: <b>{selectedSubject?.subjectName || "—"}</b>
            </div>
          </div>
        )}

        {/* Learning Cards Section */}
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
                    // ✅ /courses: click subject -> đi route protected /courses/:subjectSlug
                    if (!subjectSlug && card.kind === "subject") {
                      const to = `/courses/${slugify(card.title)}-${card.subjectId}`;
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

                    // ✅ /courses/:subjectSlug: click chapter -> /courses/:subjectSlug/chapter/:chapterSlug
                    const to = `/courses/${subjectSlug}/chapter/${slugify(card.title)}-${card.chapterId}`;
                    return (
                      <Link
                        key={card.id}
                        to={to}
                        state={{
                          subjectName: selectedSubject?.subjectName,
                          chapterName: card.chapterName,
                          chapterId: card.chapterId,
                        }}
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
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function CardUI({ title, image }) {
  return (
    <div className="flex flex-col items-center gap-6 group cursor-pointer">
      <div
        className="
          relative isolate w-44 h-44 rounded-[20px]
          before:content-[''] before:absolute before:inset-0
          before:rounded-[20px] before:bg-gray-200
          before:translate-x-0 before:translate-y-[8px]
          before:-z-10
          transition-transform duration-200 group-hover:scale-[1.02]
        "
      >
        <div className="relative z-10 w-full h-full rounded-[20px] border-2 border-gray-200 bg-white overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-100" />
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain m-4"
              draggable="false"
            />
          </div>
        </div>
      </div>

      <div className="text-center px-4">
        <p className="text-base leading-6 text-brilliant-black group-hover:underline">
          {title}
        </p>
      </div>
    </div>
  );
}
