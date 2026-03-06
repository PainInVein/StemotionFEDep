import React, { useMemo, useState } from "react";
import useAuth from "../../../contexts/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        gradeLevel: user?.gradeLevel || "",
    });

    const fullName = useMemo(() => {
        return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Người dùng";
    }, [user]);

    const initials = useMemo(() => {
        return fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    }, [fullName]);

    const isParent = user?.role === "parent";
    const isStudent = user?.role === "student";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log("Saved profile:", formData);
        setIsEdit(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <div
                className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(135deg,rgba(178,165,255,0.22)_0%,rgba(255,159,178,0.14)_45%,rgba(255,208,155,0.20)_100%)]
          [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_18%,black_45%,black_100%)]
        "
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-10">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-1 rounded-[24px] shadow-md">
                        <div className="bg-[#F5F5F8] rounded-[22px] p-5 md:p-7">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] shadow-md">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl md:text-3xl font-bold text-indigo-500">
                                            {initials}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${isParent
                                                        ? "bg-indigo-100 text-indigo-600"
                                                        : "bg-amber-100 text-amber-600"
                                                    }`}
                                            >
                                                {isParent ? "PHỤ HUYNH" : "HỌC SINH"}
                                            </span>

                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                                                {user?.status || "Active"}
                                            </span>
                                        </div>

                                        <h1 className="text-2xl md:text-4xl font-bold text-indigo-500 font-brilliant">
                                            {fullName}
                                        </h1>

                                        <p className="text-sm md:text-base text-slate-500 mt-1">
                                            {isParent
                                                ? "Cùng con theo dõi hành trình học tập mỗi ngày!"
                                                : "Sẵn sàng chinh phục những bài học thật vui nào!"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setIsEdit((prev) => !prev)}
                                        className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        <i className="fa-solid fa-pen-to-square mr-2" />
                                        {isEdit ? "Huỷ chỉnh sửa" : "Chỉnh sửa"}
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        className="px-5 py-2.5 rounded-full bg-[#7491FF] text-white font-semibold hover:bg-brand-blue/90 transition-colors"
                                    >
                                        <i className="fa-solid fa-floppy-disk mr-2" />
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
                    {/* Left column */}
                    <div className="space-y-5">
                        {/* Info card */}
                        <div className="bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-1 rounded-[20px] shadow-md">
                            <div className="bg-[#F5F5F8] rounded-[18px] p-5 md:p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <i className="fa-solid fa-user text-indigo-400 text-xl" />
                                    <h2 className="text-xl md:text-2xl font-bold text-indigo-400 font-brilliant">
                                        Thông tin cá nhân
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <ProfileField
                                        icon="fa-user"
                                        label="Họ"
                                        name="firstName"
                                        value={formData.firstName}
                                        isEdit={isEdit}
                                        onChange={handleChange}
                                    />

                                    <ProfileField
                                        icon="fa-signature"
                                        label="Tên"
                                        name="lastName"
                                        value={formData.lastName}
                                        isEdit={isEdit}
                                        onChange={handleChange}
                                    />
                                    {isParent && (
                                        <>
                                            <ProfileField
                                                icon="fa-envelope"
                                                label="Email"
                                                name="email"
                                                value={formData.email}
                                                isEdit={isEdit}
                                                onChange={handleChange}
                                            />

                                            <ProfileField
                                                icon="fa-phone"
                                                label="Số điện thoại"
                                                name="phone"
                                                value={formData.phone}
                                                isEdit={isEdit}
                                                onChange={handleChange}
                                            />
                                        </>
                                    )}

                                    {isStudent && (
                                        <ProfileField
                                            icon="fa-graduation-cap"
                                            label="Khối lớp"
                                            name="gradeLevel"
                                            value={formData.gradeLevel}
                                            isEdit={isEdit}
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Funny stats */}
                        {isStudent ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard
                                    icon="fa-fire"
                                    title="8"
                                    subtitle="Ngày học liên tiếp"
                                    bg="from-orange-200 to-amber-100"
                                    iconBg="bg-orange-400"
                                />
                                <StatCard
                                    icon="fa-book-open"
                                    title="24"
                                    subtitle="Bài học hoàn thành"
                                    bg="from-sky-200 to-cyan-100"
                                    iconBg="bg-sky-400"
                                />
                                <StatCard
                                    icon="fa-star"
                                    title="128"
                                    subtitle="Điểm thưởng"
                                    bg="from-pink-200 to-rose-100"
                                    iconBg="bg-pink-400"
                                />
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-blue-300 to-indigo-300 p-1 rounded-[20px] shadow-md">
                                <div className="bg-white rounded-[18px] p-5 md:p-6">
                                    <div className="flex items-center gap-2 mb-5">
                                        <i className="fa-solid fa-children text-indigo-500 text-xl" />
                                        <h2 className="text-xl md:text-2xl font-bold text-indigo-500 font-brilliant">
                                            Gợi ý cho phụ huynh
                                        </h2>
                                    </div>

                                    <div className="space-y-3">
                                        <TipBox
                                            icon="fa-heart"
                                            text="Khen con sau mỗi buổi học để tăng động lực."
                                            bg="bg-rose-50"
                                            color="text-rose-500"
                                        />
                                        <TipBox
                                            icon="fa-clock"
                                            text="Dành 10 phút mỗi tối để xem lại bài cùng con."
                                            bg="bg-sky-50"
                                            color="text-sky-500"
                                        />
                                        <TipBox
                                            icon="fa-bullseye"
                                            text="Đặt mục tiêu nhỏ theo tuần để con dễ chinh phục hơn."
                                            bg="bg-amber-50"
                                            color="text-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">
                        {/* Role card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#F8F8F8]/50 border-4 border-amber-200 rounded-[14px] transform translate-x-3 translate-y-3 opacity-50" />
                            <div className="absolute inset-0 bg-[#F8F8F8]/85 border-4 border-amber-300 rounded-[14px] transform translate-x-2 translate-y-2 opacity-85" />

                            <div className="relative bg-[#F8F8F8] border-4 border-amber-500 rounded-[14px] p-5 md:p-6 min-h-[420px] flex flex-col">
                                <div className="flex justify-center mb-5">
                                    <div className="bg-indigo-400 text-white font-bold text-xs md:text-sm px-5 py-2 rounded-[22px] font-brilliant">
                                        {isParent ? "HỒ SƠ PHỤ HUYNH" : "HỒ SƠ HỌC SINH"}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-[3px] mb-5">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <i
                                                className={`fa-solid ${isParent ? "fa-crown text-indigo-500" : "fa-graduation-cap text-amber-500"
                                                    } text-4xl`}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-center text-2xl font-bold text-slate-700 mb-2">
                                        {isParent ? "Người đồng hành tuyệt vời" : "Nhà thám hiểm tri thức"}
                                    </h3>

                                    <p className="text-center text-slate-500 text-sm md:text-base max-w-md mx-auto mb-6">
                                        {isParent
                                            ? "Bạn có thể theo dõi tiến trình học tập của con và hỗ trợ con tốt hơn mỗi ngày."
                                            : "Mỗi bài học là một bước tiến mới. Hãy tiếp tục cố gắng nhé!"}
                                    </p>

                                    <div className="space-y-3">
                                        <InfoMiniCard
                                            icon={isParent ? "fa-envelope" : "fa-book"}
                                            label={isParent ? "Email liên hệ" : "Môn học yêu thích"}
                                            value={isParent ? user?.email : "Toán học"}
                                        />

                                        <InfoMiniCard
                                            icon={isParent ? "fa-user-group" : "fa-medal"}
                                            label={isParent ? "Vai trò" : "Thành tích"}
                                            value={isParent ? "Phụ huynh" : "Học sinh chăm chỉ"}
                                        />

                                        <InfoMiniCard
                                            icon={isParent ? "fa-shield-heart" : "fa-school"}
                                            label={isParent ? "Trạng thái tài khoản" : "Khối lớp"}
                                            value={isParent ? user?.status || "Active" : `Lớp ${user?.gradeLevel || "-"}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action card */}
                        <div className="bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-1 rounded-[20px] shadow-md">
                            <div className="bg-[#F5F5F8] rounded-[18px] p-5 md:p-6">
                                <div className="flex items-center justify-center mb-5 gap-2">
                                    <i className="fa-solid fa-wand-magic-sparkles text-amber-400 text-xl" />
                                    <h2 className="text-xl md:text-2xl font-bold text-indigo-400 font-brilliant leading-tight">
                                        Tính năng sắp tới
                                    </h2>
                                </div>

                                <div className="space-y-3 mb-5">
                                    <FeatureItem text="Đổi ảnh đại diện" />
                                    <FeatureItem text="Cập nhật thông tin cá nhân bằng API" />
                                    <FeatureItem text="Huy hiệu học tập và thành tích" />
                                    <FeatureItem text="Liên kết nhanh sang dashboard học tập" />
                                </div>

                                <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] to-[#F8BB44] text-white font-bold hover:opacity-90 transition-opacity">
                                    Khám phá thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({ icon, label, name, value, isEdit, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
                <i className={`fa-solid ${icon} mr-2 text-indigo-400`} />
                {label}
            </label>

            <input
                type="text"
                name={name}
                value={value || ""}
                disabled={!isEdit}
                onChange={onChange}
                className={`w-full px-4 py-3 rounded-2xl border transition-all outline-none ${isEdit
                        ? "bg-white border-slate-200 focus:ring-2 focus:ring-indigo-100"
                        : "bg-slate-50 border-slate-100 text-slate-500"
                    }`}
            />
        </div>
    );
}

function StatCard({ icon, title, subtitle, bg, iconBg }) {
    return (
        <div className={`bg-gradient-to-br ${bg} rounded-[20px] p-4 shadow-md`}>
            <div className={`w-11 h-11 ${iconBg} rounded-full flex items-center justify-center mb-3`}>
                <i className={`fa-solid ${icon} text-white`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-700">{title}</h3>
            <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
    );
}

function TipBox({ icon, text, bg, color }) {
    return (
        <div className={`${bg} rounded-2xl p-4 flex items-start gap-3`}>
            <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${color}`}>
                <i className={`fa-solid ${icon}`} />
            </div>
            <p className="text-slate-600 font-medium">{text}</p>
        </div>
    );
}

function InfoMiniCard({ icon, label, value }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400">
                <i className={`fa-solid ${icon}`} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-semibold">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value || "Chưa cập nhật"}</p>
            </div>
        </div>
    );
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                <i className="fa-solid fa-check" />
            </div>
            <span className="text-slate-600 font-medium">{text}</span>
        </div>
    );
}