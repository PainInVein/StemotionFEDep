export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-brand-blue via-brand-rose to-brand-yellow relative">
      {/* Gradient overlay to create the softer look */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/0"></div>
      
      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-7xl mx-auto">
          {/* Layout: responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            
            {/* Left column */}
            <div className="space-y-6">
              {/* Streak Card */}
              <div className="relative">
                <div className="bg-[#F1F1F1]/50 backdrop-blur-sm border-4 border-brand-purple rounded-[22px] p-6 md:p-8">
                  {/* Large day number */}
                  <div className="mb-8">
                    <h1 className="text-6xl md:text-[64px] font-bold text-brand-light-blue leading-none font-brilliant">
                      1
                    </h1>
                  </div>
                  
                  {/* Day circles */}
                  <div className="flex items-center gap-4 md:gap-6 mb-6">
                    {/* Day 1 - filled */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-12 h-12 md:w-[63px] md:h-[63px]">
                        <div className="absolute inset-0 rounded-full bg-brand-light-blue flex items-center justify-center">
                          <svg className="w-6 h-6 md:w-10 md:h-10 text-white" viewBox="0 0 41 41" fill="none">
                            <path d="M15.8 19.9L11.7 15.8L10 17.5L15.8 23.3L31.8 7.3L30.1 5.6L15.8 19.9Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                      <span className="text-brand-light-blue font-bold text-lg md:text-[22px] font-brilliant">T2</span>
                    </div>
                    
                    {/* Day 2 - progress ring */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-12 h-12 md:w-[63px] md:h-[63px]">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 63 63">
                          <circle
                            cx="31.5"
                            cy="31.5"
                            r="29.5"
                            fill="none"
                            stroke="#7E82E4"
                            strokeWidth="2"
                            opacity="0.2"
                          />
                          <circle
                            cx="31.5"
                            cy="31.5"
                            r="29.5"
                            fill="none"
                            stroke="url(#gradient1)"
                            strokeWidth="2"
                            strokeDasharray="185.35"
                            strokeDashoffset="46.34"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#7E82E4" />
                              <stop offset="30%" stopColor="#FE99BF" />
                              <stop offset="60%" stopColor="#FBA889" />
                              <stop offset="95%" stopColor="#F8BB44" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <span className="text-brand-light-blue font-medium text-base md:text-[20px] font-brilliant">T3</span>
                    </div>
                    
                    {/* Days 3-5 - empty rings */}
                    {['T4', 'T5', 'T6'].map((day, idx) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 md:w-[63px] md:h-[63px] rounded-full border-2 border-brand-purple opacity-30"></div>
                        <span className="text-brand-light-blue font-medium text-base md:text-[20px] font-brilliant">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* TODAY label */}
                <div className="absolute -bottom-3 left-8 md:left-10">
                  <span className="text-white font-bold text-sm md:text-base font-brilliant bg-brand-purple/60 px-3 py-1 rounded-full backdrop-blur-sm">
                    TODAY
                  </span>
                </div>
              </div>
              
              {/* Leaderboard Card */}
              <div className="bg-[#F1F1F1]/50 backdrop-blur-sm border-4 border-brand-purple rounded-[22px] p-6 md:p-8">
                <div className="flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 md:w-[51px] md:h-[51px] mr-3" viewBox="0 0 51 51" fill="none">
                    <path d="M10.6104 4.75192L39.4246 4.18875L39.7525 21.2146L25.5019 29.3536L10.9452 21.7762L10.6104 4.75192Z" fill="#F7C325"/>
                    <path d="M24.0434 21.521L26.6617 21.4701L26.9165 34.5661L24.2983 34.617L24.0434 21.521Z" fill="#F7C325"/>
                    <path d="M13.8186 34.8222L37.3895 34.3622L37.5714 43.5291L14.0006 43.989L13.8186 34.8222Z" fill="#383838"/>
                    <path d="M26.037 8.07167C26.4371 7.56791 27.2512 7.92098 27.1523 8.55841L26.4746 12.9693L29.5125 12.9351C30.305 12.9267 30.7542 13.8434 30.2635 14.4643L25.3283 20.6693C24.9283 21.1738 24.1139 20.82 24.2129 20.1833L24.8906 15.7724L21.8527 15.8059C21.0601 15.8143 20.6112 14.8983 21.1019 14.2774L26.037 8.07167Z" fill="#D7A613"/>
                  </svg>
                  <h2 className="text-2xl md:text-[32px] font-bold text-brand-blue font-brilliant leading-tight">
                    Bảng xếp hạng
                  </h2>
                </div>
                
                <button className="w-full bg-[#7491FF] hover:bg-brand-blue/90 transition-all text-white font-bold text-2xl md:text-[32px] py-4 md:py-5 px-8 rounded-[54px] shadow-[inset_0_-4px_0_0_rgba(20,37,99,0.3)] font-brilliant relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <span className="relative">Xem ngay</span>
                </button>
              </div>
            </div>
            
            {/* Right column - Main Card with stacked effect */}
            <div className="relative lg:mt-0 mt-6">
              <div className="relative">
                {/* Stack effect - back cards */}
                <div className="absolute inset-0 bg-[#F8F8F8]/50 border-4 border-brand-purple rounded-[15px] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 opacity-50"></div>
                <div className="absolute inset-0 bg-[#F8F8F8]/85 border-4 border-brand-purple rounded-[15px] transform translate-x-2 translate-y-2 md:translate-x-3 md:translate-y-3 opacity-85"></div>
                
                {/* Main card */}
                <div className="relative bg-[#F8F8F8] border-4 border-brand-purple rounded-[15px] p-6 md:p-8 min-h-[500px] md:min-h-[651px] flex flex-col">
                  {/* Badge */}
                  <div className="flex justify-center mb-6 md:mb-8">
                    <div className="bg-brand-blue/50 backdrop-blur-sm text-white font-bold text-sm md:text-base px-6 md:px-8 py-2 rounded-[22px] font-brilliant">
                      BÀI HỌC ĐỀ XUẤT
                    </div>
                  </div>
                  
                  {/* Illustration */}
                  <div className="flex-1 flex items-center justify-center mb-6 md:mb-8">
                    <img 
                      src="https://api.builder.io/api/v1/image/assets/TEMP/e9631af412644fa121b3d0f5e5b3fc3d390d916d?width=610" 
                      alt="Learning illustration"
                      className="w-full max-w-[250px] md:max-w-[305px] h-auto object-contain"
                    />
                  </div>
                  
                  {/* Start Button */}
                  <button className="w-full bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] hover:opacity-90 transition-all text-white font-bold text-2xl md:text-[32px] py-4 md:py-5 px-8 rounded-[54px] shadow-[inset_0_-4px_0_0_rgba(20,37,99,0.3)] font-brilliant relative overflow-hidden group">
                    <div className="absolute left-0 top-0 h-full w-32 md:w-40 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity rounded-l-[54px]"></div>
                    <span className="relative">Bắt đầu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
