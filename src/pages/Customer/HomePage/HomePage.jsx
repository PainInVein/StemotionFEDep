import Button from "../../../components/common/Button";
import CupIcon from "../../../components/common/CupIcon";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(135deg,rgba(178,165,255,0.22)_0%,rgba(255,159,178,0.14)_45%,rgba(255,208,155,0.20)_100%)]
          [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_60%,black_100%)]
        "
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/0" />

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 md:py-10">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
            {/* Left column */}
            <div className="space-y-5">
              {/* Streak Card */}
              <div className="relative">
                <div className="bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-1 rounded-[20px] shadow-md">
                  <div className="bg-[#F5F5F8] rounded-[18px] p-5 md:p-6">
                    {/* Large day number */}
                    <div className="mb-6">
                      <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 leading-none font-brilliant">
                        Tuần 1
                      </h1>
                    </div>

                    {/* Day circles */}
                    <div className="flex items-center gap-3 md:gap-4 mb-2">
                      {/* Day 1 - filled */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 md:w-[54px] md:h-[54px] rounded-full p-[2px] opacity-40 bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]">
                          <div className="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center">
                            <i className="fa-solid fa-bolt text-white text-base md:text-2xl" />
                          </div>
                        </div>
                        <span className="text-brand-light-blue font-bold text-base md:text-lg font-brilliant">
                          T2
                        </span>
                      </div>

                      {["T3", "T4", "T5", "T6", "T7"].map((day) => (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 md:w-[54px] md:h-[54px] rounded-full p-[2px] opacity-40 bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]">
                            <div className="w-full h-full rounded-full bg-white" />
                          </div>
                          <span className="text-brand-light-blue font-medium text-sm md:text-base font-brilliant">
                            {day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Card */}
              <div className="bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-1 rounded-[20px] shadow-md">
                <div className="bg-[#F5F5F8] rounded-[18px] p-5 md:p-6">
                  <div className="flex items-center justify-center mb-5 gap-2">
                    <CupIcon />
                    {/* <i className="fa-solid fa-trophy text-2xl text-amber-300 text-shadow-amber-600 text-shadow-2xs"></i> */}
                    <h2 className="text-xl md:text-2xl font-bold text-indigo-400 font-brilliant leading-tight">
                      Bảng xếp hạng
                    </h2>
                  </div>
                  <Button size='md' className="bg-[#7491FF] hover:bg-brand-blue/90">Xem ngay</Button>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="relative lg:mt-0 mt-5">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F8F8F8]/50 border-4 border-amber-200 rounded-[14px] transform translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 opacity-50" />
                <div className="absolute inset-0 bg-[#F8F8F8]/85 border-4 border-amber-300 rounded-[14px] transform translate-x-2 translate-y-2 md:translate-x-3 md:translate-y-3 opacity-85" />

                <div className="relative bg-[#F8F8F8] border-4 border-amber-500 rounded-[14px] p-5 md:p-6 min-h-[420px] md:min-h-[520px] flex flex-col">
                  <div className="flex justify-center mb-5 md:mb-6">
                    <div className="bg-indigo-400 text-white font-bold text-xs md:text-sm px-5 md:px-7 py-2 rounded-[22px] font-brilliant">
                      BÀI HỌC ĐỀ XUẤT
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center mb-5 md:mb-6">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/e9631af412644fa121b3d0f5e5b3fc3d390d916d?width=610"
                      alt="Learning illustration"
                      className="w-full max-w-[210px] md:max-w-[260px] h-auto object-contain"
                    />
                  </div>
                  <Button size='md' className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] hover:opacity-90">Bắt đầu</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
