// src/pages/Customer/CourseDetailPage/CourseDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getChaptersService, getLessonsService } from "../../../services/education/education.service";
import { useSelector } from "react-redux";
import { useLessonProgressStore } from "../../../stores/lessonProgressStore";
import { getUserKey } from "../../../utils/getUserKey";

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractUuidFromSlug = (slug = "") => {
  const maybe = slug.slice(-36);
  return /^[0-9a-fA-F-]{36}$/.test(maybe) ? maybe : "";
};

// ====== ASSETS giữ nguyên ======
const ASSETS = {
  completeShadow: "https://api.builder.io/api/v1/image/assets/TEMP/265bdad652a24ce9a83545e7aeab19fa14fc5dd2?width=184",
  doingMascot: "https://api.builder.io/api/v1/image/assets/TEMP/65172b3050fa147bc742b9bbdc5ac846b7365557?width=177",
  doingShadow: "https://api.builder.io/api/v1/image/assets/TEMP/a3423205b11fe005386c5b83b0e5ff12fa7c53c2?width=204",
};

export default function CourseDetail() {
  const { subjectSlug = "", chapterSlug = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  // ✅ chapterKey ổn định
  const chapterIdFromSlug = useMemo(() => extractUuidFromSlug(chapterSlug), [chapterSlug]);
  const chapterKey = chapterIdFromSlug || chapterSlug;

  // ✅ userKey theo redux
  // const reduxUser = useSelector((s) => s.user.user);
  // const userKey = reduxUser?.userId || reduxUser?.id || reduxUser?.email || "guest";
  const userKey = useMemo(() => getUserKey(), []);

  // ✅ Zustand: subscribe "byUser" thôi để tránh infinite loop
  const byUser = useLessonProgressStore((s) => s.byUser);
  const setDoingLesson = useLessonProgressStore((s) => s.setDoingLesson);

  const chapterProgress = useMemo(() => {
    const c = byUser?.[userKey]?.[chapterKey];
    return c || { doingLessonId: null, completed: [] };
  }, [byUser, userKey, chapterKey]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [chapterName, setChapterName] = useState(state.chapterName || "");
  const [subjectName, setSubjectName] = useState(state.subjectName || "");
  const [chapterGradeLevel, setChapterGradeLevel] = useState(state.gradeLevel ?? null);

  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        let resolvedChapterName = state.chapterName || "";
        let resolvedSubjectName = state.subjectName || "";
        let resolvedGradeLevel = state.gradeLevel ?? null;

        if (!resolvedChapterName || resolvedGradeLevel == null) {
          const chapRes = await getChaptersService(1, 5000);
          const chapItems = chapRes?.items ?? [];

          let found = null;
          if (chapterIdFromSlug) found = chapItems.find((c) => c.chapterId === chapterIdFromSlug);

          if (!found) {
            const slugNoId = chapterSlug.replace(/-[0-9a-fA-F-]{36}$/, "");
            found = chapItems.find((c) => slugify(c.chapterName) === slugNoId);
          }

          resolvedChapterName = found?.chapterName || resolvedChapterName || "";
          resolvedSubjectName = found?.subjectName || resolvedSubjectName || "";
          resolvedGradeLevel = found?.gradeLevel ?? resolvedGradeLevel;
        }

        if (!resolvedSubjectName && subjectSlug) {
          resolvedSubjectName = subjectSlug
            .replace(/-[0-9a-fA-F-]{36}$/, "")
            .replace(/-/g, " ");
        }

        setChapterName(resolvedChapterName);
        setSubjectName(resolvedSubjectName);
        setChapterGradeLevel(resolvedGradeLevel);

        const lessonRes = await getLessonsService(1, 5000);
        const lessonItems = lessonRes?.items ?? [];

        const filtered = resolvedChapterName
          ? lessonItems.filter((l) => {
            const sameChapterName = l.chapterName === resolvedChapterName;
            const active = l.status !== "Inactive";
            const sameGrade = resolvedGradeLevel == null ? true : Number(l.gradeLevel) === Number(resolvedGradeLevel);
            return sameChapterName && sameGrade && active;
          })
          : [];

        setLessons(
          filtered.map((l) => ({
            id: l.lessonId,
            title: l.lessonName,
            raw: l,
          }))
        );
      } catch (e) {
        setErr(e?.message || "Load failed");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectSlug, chapterSlug, chapterIdFromSlug]);

  // ✅ Status đúng theo flow bạn muốn:
  // - complete: nằm trong completed
  // - doing: đúng doingLessonId
  // - notyet: còn lại
  const lessonsWithStatus = useMemo(() => {
    const doingId = chapterProgress?.doingLessonId || null;
    const completedSet = new Set(chapterProgress?.completed || []);

    return lessons.map((l) => ({
      ...l,
      // ✅ doing ưu tiên cao nhất
      status: doingId === l.id ? "doing" : completedSet.has(l.id) ? "complete" : "notyet",
    }));
  }, [lessons, chapterProgress]);

  const titleOnCard = chapterName || "Chapter";

  const openLesson = (lesson) => {
    // ✅ Quan trọng: chuyển lesson doing cũ -> complete, lesson mới -> doing
    setDoingLesson(userKey, chapterKey, lesson.id);

    const lessonSlug2 = `${slugify(lesson.title)}-${lesson.id}`;
    navigate(`/courses/${subjectSlug}/chapter/${chapterSlug}/lesson/${lessonSlug2}`, {
      state: {
        lessonId: lesson.id,
        lessonName: lesson.title,
        chapterName,
        subjectName,
        gradeLevel: chapterGradeLevel,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
          <div className="w-full lg:w-auto flex-shrink-0">
            <CourseCard title={titleOnCard} subtitle={subjectName} lessonCount={lessonsWithStatus.length} />
            <div className="mt-3 text-sm text-slate-500">
              {loading ? "Đang tải..." : err ? `Lỗi: ${err}` : `Lessons: ${lessonsWithStatus.length}`}
              {chapterGradeLevel != null ? ` • Grade: ${chapterGradeLevel}` : ""}
            </div>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0">
            <LessonsList chapterName={chapterName} lessons={lessonsWithStatus} onOpenLesson={openLesson} />
          </div>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          <Link to="/courses" className="text-sky-600 hover:underline">
            Khóa học
          </Link>
          {" / "}
          <Link to={`/courses/${subjectSlug}`} className="text-sky-600 hover:underline">
            {subjectName || "Môn học"}
          </Link>
          {" / "}
          <span className="font-medium text-slate-700">{titleOnCard}</span>
        </div>
      </div>
    </div>
  );
}

/* CourseCard/LessonsList/LessonItem giữ UI như bạn, chỉ lưu ý LessonItem KHÔNG lock */
function CourseCard({ title = "Chapter", subtitle = "", lessonCount = 0 }) {
  return (
    <div className="w-full max-w-[487px] min-w-[350px]">
      <div className="bg-white rounded-[20px] p-8 pb-10" style={{ boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.10) inset" }}>
        <div className="flex flex-col items-center gap-1.5 mb-6">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/3b9a7abc60182324ab01178c5effdf72fbfe474e?width=178"
            alt={title}
            className="w-[89px] h-[99px] object-contain"
          />
          <h1 className="text-[24px] font-bold text-black leading-[28.8px]">{title}</h1>
          {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
        </div>

        <p className="text-[16px] text-[#666] leading-[24px] mb-4">Danh sách bài học thuộc chapter này.</p>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          <div className="flex items-center gap-2">
            <EyeIcon />
            <span className="text-[14px] text-black leading-[21px]">{lessonCount} Bài học</span>
          </div>
          <div className="flex items-center gap-2">
            <SparkleIcon />
            <span className="text-[14px] text-black leading-[21px]">Bài tập</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonsList({ onOpenLesson, lessons, chapterName }) {
  return (
    <div className="w-full max-w-[488px]">
      <div className="flex flex-col">
        {/* header chapter giữ nguyên */}
        <div className="relative mb-8">
          <div
            className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.70) 50%, rgba(255, 255, 255, 0.00) 100%)",
            }}
          />
          <div className="h-[72px] bg-[#7491FF] rounded-[20px]">
            <div className="relative z-20 bg-white rounded-[18px] px-5 py-3 flex flex-col items-center justify-center gap-0.5 min-h-[64px] border-2 border-[#7491FF] shadow-md">
              <div className="text-[#294BC6] text-[12px] font-bold leading-[13.2px] tracking-[0.48px] uppercase text-center">
                Chapter
              </div>
              <div className="text-black text-[16px] font-medium leading-[22.4px] text-center">
                {chapterName || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[30px] pt-[45px]">
          {lessons.map((lesson, index) => {
            const isRight = index % 2 === 1;
            return (
              <div key={lesson.id} className={`w-full flex ${isRight ? "justify-end" : "justify-start"}`}>
                <div className={isRight ? "pr-0 sm:pr-20" : "pl-0 sm:pl-20"}>
                  <LessonItem lesson={lesson} index={index} onClick={() => onOpenLesson?.(lesson)} />
                </div>
              </div>
            );
          })}

          {!lessons.length && <div className="text-sm text-slate-500">Chưa có bài học trong chapter này.</div>}
        </div>
      </div>
    </div>
  );
}

function LessonItem({ lesson, index, onClick }) {
  const isDoing = lesson.status === "doing";
  const isComplete = lesson.status === "complete";
  const isFuture = lesson.status === "notyet";

  return (
    <div
      className="flex items-end gap-2 w-full max-w-[392px] transition cursor-pointer hover:opacity-95"
      onClick={() => onClick?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex-shrink-0 relative" style={{ width: "128px", height: "134px" }}>
        {isComplete && (
          <img src={ASSETS.completeShadow} alt="" className="absolute" style={{ left: "18px", bottom: "20px", width: "92px", height: "55px" }} />
        )}

        {isDoing && (
          <div className="relative w-full h-full">
            <img src={ASSETS.doingShadow} alt="" className="absolute" style={{ left: "10px", bottom: "8px", width: "102px", height: "62px" }} />
            <img src={ASSETS.doingMascot} alt="" className="absolute animate-bounce" style={{ left: "18px", top: "8px", width: "88px", height: "88px" }} />
          </div>
        )}

        {isFuture && (
          <div className="w-full h-full flex items-center justify-center">
            <ShapeIcon variant={index + 1} />
          </div>
        )}
      </div>

      <div className="flex-1 pb-7">
        <p className="text-[16px] leading-[24px] text-black">{lesson.title}</p>
      </div>
    </div>
  );
}

// EyeIcon, SparkleIcon, ShapeIcon: giữ nguyên như bạn

/* ===== Icons giữ nguyên (mình giữ phần bạn đang có) ===== */
function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7954 10.4265C11.5238 11.359 9.82479 11.9 7.99805 11.9C6.1713 11.9 4.47227 11.359 3.20071 10.4265C1.93614 9.49917 0.998047 8.09725 0.998047 6.4C0.998047 6.14793 1.01874 5.90238 1.05812 5.66392C0.74523 6.14347 0.488251 6.65679 0.305557 7.19115C-0.208199 8.69384 -0.135885 10.4099 1.0007 11.8447C2.33495 13.5289 4.52453 14.9 7.99997 14.9C11.4754 14.9 13.665 13.5289 14.9993 11.8446C16.1359 10.4099 16.2082 8.69384 15.6945 7.19115C15.5107 6.6538 15.2519 6.13772 14.9366 5.65587C14.9769 5.89685 14.998 6.14509 14.998 6.4C14.998 8.09725 14.06 9.49917 12.7954 10.4265ZM7.99805 10.8C11.3118 10.8 13.998 8.83005 13.998 6.4C13.998 3.96995 11.3118 2 7.99805 2C4.68434 2 1.99805 3.96995 1.99805 6.4C1.99805 8.83005 4.68434 10.8 7.99805 10.8ZM7.99805 8.9C10.2072 8.9 11.998 7.78071 11.998 6.4C11.998 5.01929 10.2072 3.9 7.99805 3.9C5.78891 3.9 3.99805 5.01929 3.99805 6.4C3.99805 7.78071 5.78891 8.9 7.99805 8.9Z"
        fill="black"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.78736 11.2034L11.6218 5.36895C12.0246 4.96617 12.0246 4.31313 11.6218 3.91035C11.219 3.50756 10.566 3.50756 10.1632 3.91035L4.32875 9.74476C3.92597 10.1475 3.92597 10.8006 4.32875 11.2034C4.73154 11.6061 5.38458 11.6061 5.78736 11.2034Z"
        fill="black"
      />
      <path
        d="M1.74455 7.28844C1.19322 7.83977 1.19322 8.73365 1.74455 9.28498L6.24794 13.7884C6.79927 14.3397 7.69315 14.3397 8.24447 13.7884L9.10136 12.9315C9.65268 12.3802 9.65268 11.4862 9.10135 10.9349L4.59797 6.43156C4.04664 5.88024 3.15276 5.88024 2.60143 6.43156L1.74455 7.28844Z"
        fill="black"
        stroke="white"
        strokeWidth="0.941176"
      />
      <path
        d="M14.2556 7.77377C14.8069 7.22244 14.8069 6.32856 14.2556 5.77723L9.75226 1.27385C9.20093 0.722519 8.30705 0.722521 7.75573 1.27385L6.89885 2.13073C6.34752 2.68205 6.34752 3.57594 6.89885 4.12727L11.4022 8.63065C11.9536 9.18198 12.8474 9.18198 13.3988 8.63065L14.2556 7.77377Z"
        fill="black"
        stroke="white"
        strokeWidth="0.941176"
      />
      <path
        d="M11.5207 2.54915L9.75518 4.31464C9.3524 4.71743 9.3524 5.37047 9.75518 5.77325C10.158 6.17603 10.811 6.17603 11.2138 5.77325L12.9793 4.00776C13.3821 3.60497 13.3821 2.95193 12.9793 2.54915C12.5765 2.14637 11.9235 2.14637 11.5207 2.54915Z"
        fill="black"
      />
      <path
        d="M4.47933 12.5094L6.24482 10.744C6.6476 10.3412 6.6476 9.68813 6.24482 9.28535C5.84204 8.88256 5.189 8.88256 4.78622 9.28535L3.02072 11.0508C2.61794 11.4536 2.61794 12.1067 3.02072 12.5094C3.42351 12.9122 4.07655 12.9122 4.47933 12.5094Z"
        fill="black"
      />
    </svg>
  );
}

function ShapeIcon({ variant }) {
  return (
    <svg width="128" height="134" viewBox="0 0 128 134" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[128px] flex-shrink-0">
      <path d="M90.1302 102.556C75.6589 111.249 52.1961 111.248 37.7248 102.556C23.2532 93.863 23.2532 79.7696 37.7248 71.0775C52.1961 62.385 75.6589 62.3849 90.1302 71.0775C104.602 79.7703 104.602 93.863 90.1302 102.556ZM96.5038 112.203C78.5128 122.871 49.3425 122.871 31.351 112.203C13.3596 101.535 13.3596 84.239 31.351 73.5713C49.3425 62.903 78.5128 62.903 96.5038 73.5713C114.496 84.239 114.496 101.535 96.5038 112.203Z" fill="black" />
      <path d="M96.5038 112.203C78.5128 122.871 49.3425 122.871 31.351 112.203C13.3596 101.536 13.3596 84.2393 31.351 73.5716C49.3425 62.9032 78.5128 62.9032 96.5038 73.5716C114.496 84.2393 114.496 101.536 96.5038 112.203Z" fill="#999999" />
      <path d="M37.7242 102.556C52.1956 111.249 75.6585 111.249 90.1298 102.556C104.601 93.8641 104.601 79.7708 90.1298 71.0786C75.6585 62.3858 52.1956 62.386 37.7242 71.0786C23.2527 79.7708 23.2527 93.8641 37.7242 102.556Z" fill="#999999" />
      <path d="M37.7242 102.556C52.1956 111.249 75.6585 111.249 90.1298 102.556C104.601 93.8641 104.601 79.7708 90.1298 71.0786C75.6585 62.3858 52.1956 62.386 37.7242 71.0786C23.2527 79.7708 23.2527 93.8641 37.7242 102.556Z" fill="white" fillOpacity="0.74902" />
      <path d="M96.5038 112.203C78.5128 122.871 49.3425 122.871 31.351 112.203C13.3596 101.536 13.3596 84.2393 31.351 73.5716C49.3425 62.9032 78.5128 62.9032 96.5038 73.5716C114.496 84.2393 114.496 101.536 96.5038 112.203Z" fill="#999999" />
      <mask id="mask0_unlocked" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="17" y="65" width="93" height="56">
        <path d="M96.5037 112.204C78.512 122.871 49.3424 122.871 31.351 112.204C13.3596 101.535 13.3596 84.2398 31.351 73.5713C49.3424 62.9033 78.512 62.9033 96.5037 73.5713C114.495 84.2398 114.495 101.535 96.5037 112.204Z" fill="white" />
      </mask>
      <g mask="url(#mask0_unlocked)">
        <path d="M63.9271 60.5112L112 125.263H15.854L63.9271 60.5112Z" fill="white" fillOpacity="0.2" />
      </g>
      <mask id="mask1_unlocked" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="26" y="64" width="75" height="46">
        <path d="M90.1301 102.556C75.6588 111.249 52.196 111.249 37.7247 102.556C23.2532 93.8632 23.2532 79.7705 37.7247 71.0777C52.196 62.3856 75.6588 62.3856 90.1301 71.0777C104.601 79.7705 104.601 93.8632 90.1301 102.556Z" fill="white" />
      </mask>
      <g mask="url(#mask1_unlocked)">
        <path d="M17.6729 64.2773H109.939V109.293H17.6729V64.2773Z" fill="#999999" />
        <path d="M17.6729 64.2773H109.939V109.293H17.6729V64.2773Z" fill="white" fillOpacity="0.74902" />
      </g>
      <path d="M42.6815 74.655C54.415 67.9386 73.4389 67.9386 85.1725 74.655C96.9061 81.3715 96.9061 92.262 85.1725 98.9791C73.4389 105.696 54.415 105.696 42.6815 98.9791C30.948 92.262 30.948 81.3715 42.6815 74.655Z" fill="white" />
      <mask id="mask2_unlocked" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="33" y="69" width="61" height="36">
        <path d="M42.682 74.6551C54.4155 67.9379 73.4393 67.9379 85.1729 74.6551C96.9065 81.3716 96.9065 92.262 85.1729 98.9785C73.4393 105.696 54.4155 105.696 42.682 98.9785C30.9485 92.262 30.9485 81.3716 42.682 74.6551Z" fill="white" />
      </mask>
      <g mask="url(#mask2_unlocked)">
        <path d="M31.7661 69.4536H61.8423V104.179H31.7661V69.4536Z" fill="#999999" />
        <path d="M31.7661 69.4536H61.8423V104.179H31.7661V69.4536Z" fill="white" fillOpacity="0.74902" />
        <path d="M61.7074 69.4536H94.2577V104.179H61.7074V69.4536ZM80.1973 96.1368C71.1444 101.273 56.4674 101.273 47.4149 96.1368C38.3624 91.0008 38.3624 82.6729 47.4149 77.5362C56.4674 72.4002 71.1444 72.4002 80.1973 77.5362C89.2495 82.6729 89.2495 91.0008 80.1973 96.1368Z" fill="#999999" />
        <path d="M61.7074 69.4536H94.2577V104.179H61.7074V69.4536ZM80.1973 96.1368C71.1444 101.273 56.4674 101.273 47.4149 96.1368C38.3624 91.0008 38.3624 82.6729 47.4149 77.5362C56.4674 72.4002 71.1444 72.4002 80.1973 77.5362C89.2495 82.6729 89.2495 91.0008 80.1973 96.1368Z" fill="white" fillOpacity="0.74902" />
        <path d="M61.7074 69.4536H94.2577V104.179H61.7074V69.4536ZM80.1973 96.1368C71.1444 101.273 56.4674 101.273 47.4149 96.1368C38.3624 91.0008 38.3624 82.6729 47.4149 77.5362C56.4674 72.4002 71.1444 72.4002 80.1973 77.5362C89.2495 82.6729 89.2495 91.0008 80.1973 96.1368Z" fill="#E5E5E5" />
      </g>
      <mask id="mask3_unlocked" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="33" y="69" width="61" height="36">
        <path d="M66.0053 104.021C71.4976 104.021 83.8022 101.79 90.1951 95.3322C95.2053 90.2705 95.2582 83.5189 90.1951 78.4049C84.5774 72.7295 73.3351 69.6929 65.9956 69.6929V73.7335C69.2952 73.7328 76.0955 75.1463 80.2805 77.5363C89.1808 82.6826 89.1808 91.0099 80.2805 96.1362C76.2928 98.4135 68.9509 99.9391 65.9956 99.9391L66.0053 104.021ZM61.8321 104.022C56.3399 104.022 44.0348 101.791 37.642 95.3329C32.632 90.2712 32.5794 83.5203 37.642 78.4063C43.2597 72.7309 54.5021 69.6942 61.8416 69.6942V73.7342C59.0849 73.7342 51.7418 75.1477 47.5567 77.537C38.5609 82.6737 38.5609 91.0009 47.5567 96.1376C51.5445 98.4149 58.6223 99.9405 61.8416 99.9405L61.8321 104.022Z" fill="white" />
      </mask>
      <g mask="url(#mask3_unlocked)">
        <path d="M42.6815 74.6943C54.415 67.9782 73.4389 67.9782 85.1725 74.6943C96.9061 81.4115 96.9061 92.3019 85.1725 99.0191C73.4389 105.736 54.415 105.736 42.6815 99.0191C30.948 92.3019 30.948 81.4115 42.6815 74.6943Z" fill="#999999" />
        <path d="M42.6815 74.6943C54.415 67.9782 73.4389 67.9782 85.1725 74.6943C96.9061 81.4115 96.9061 92.3019 85.1725 99.0191C73.4389 105.736 54.415 105.736 42.6815 99.0191C30.948 92.3019 30.948 81.4115 42.6815 74.6943Z" fill="white" fillOpacity="0.501961" />
      </g>
    </svg>
  );
}
