import React, { useState } from "react";
import { Card } from "antd"; // Ant Design chỉ có Card, không có CardContent
import { Link } from "react-router-dom";
import { FaRobot, FaCode, FaRocket, FaLightbulb, FaRegHeart, FaUsers, FaRegUserCircle } from "react-icons/fa";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";
import Backround_01 from '../../../assets/bg-01.png'
import Backround_02 from '../../../assets/bg-02.png'
import LoginModal from "../LoginPage/LoginPage";
import { FaCheck } from "react-icons/fa";
import { HiOutlineBolt, HiBolt } from "react-icons/hi2";
import Lesson from '../../../components/common/Lesson.jsx';

const LandingPage = () => {
  const features = [
    {
      icon: FaLightbulb,
      title: "Học tương tác",
      description: "Khám phá khoa học qua hình ảnh và hoạt động thực hành",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: FaCode,
      title: "Lập trình trực quan",
      description: "Học lập trình qua giao diện đơn giản, dễ hiểu",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaRocket,
      title: "Tiến bộ từng bước",
      description: "Nắm vững từng khái niệm trước khi chuyển sang bài tiếp theo",
      gradient: "from-orange-500 to-yellow-500",
    },
  ];

  const progress = {
    lesson1: "done",
    lesson2: "doing",
    lesson3: "not_started"
  };

  const [modalConfig, setModalConfig] = useState({ isOpen: false, role: 'student' });

  const openLogin = (role) => setModalConfig({ isOpen: true, role });
  const closeLogin = () => setModalConfig({ ...modalConfig, isOpen: false });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-semibold text-foreground leading-tight">
                Học, chơi và chinh phục STEM cùng STEMotion!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Bài học khoa học và toán học tương tác qua việc học dựa trên sự tò mò.
              </p>

              <div className="space-y-4 pt-4">
                <p className="text-sm font-medium text-muted-foreground">Chọn lộ trình của bạn:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* <Link to="/student-login" className="flex-1"> */}
                  <div onClick={() => openLogin('student')}>
                    {/* Ant Design Card: Dùng bodyStyle hoặc class Tailwind trực tiếp */}
                    <Card className="border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transition-all cursor-pointer group rounded-xl">
                      <div className="p-2 text-center h-auto md:h-[150px]">
                        <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <FaRegUserCircle className="text-2xl text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Đăng nhập học sinh</h3>
                        <p className="text-sm text-gray-500">Truy cập lộ trình học tập của bạn</p>
                      </div>
                    </Card>
                  </div>
                  {/* </Link> */}
                  {/* <Link to="/parent-login" className="flex-1"> */}
                  <div onClick={() => openLogin('parent')}>
                    <Card className="border-2 border-pink-100 hover:border-pink-500 hover:bg-pink-50 hover:shadow-lg transition-all cursor-pointer group rounded-xl">
                      <div className="p-2 text-center h-auto md:h-[150px]">
                        <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <FaRegHeart className="text-2xl text-pink-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Đăng nhập phụ huynh</h3>
                        <p className="text-sm text-gray-500">Theo dõi tiến độ của con</p>
                      </div>
                    </Card>
                  </div>
                  {/* </Link> */}

                  <LoginModal
                    isOpen={modalConfig.isOpen}
                    onClose={closeLogin}
                    role={modalConfig.role}
                  />
                </div>
              </div>
            </div>


            {/* Hero Illustration */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="relative bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-3xl p-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
                      <FaRobot className="text-5xl text-indigo-600 mb-2" />
                      <div className="h-2 bg-gray-100 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="bg-orange-400 rounded-2xl p-4 flex items-center justify-center shadow-md">
                      <FaLightbulb className="text-4xl text-white" />
                    </div>
                    <div className="bg-indigo-500 rounded-2xl p-4 flex items-center justify-center shadow-md">
                      <FaCode className="text-4xl text-white" />
                    </div>
                    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
                      <FaRocket className="text-5xl text-pink-500 mb-2" />
                      <div className="h-2 bg-gray-100 rounded w-2/3 mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
                    <HiOutlineSparkles className="text-2xl text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-indigo-600 rounded-full p-3 shadow-lg animate-pulse">
                    <HiOutlineLightningBolt className="text-2xl text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 p-10" style={{ backgroundImage: `url(${Backround_01})` }}>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-white" >
              Tại sao chọn STEMotion?
            </h2>
            <p className="text-gray-500">Phương pháp học hiện đại và hiệu quả</p>
          </div>
          <div className="flex flex-row bg-white">
            <div className="flex-1 p-10">
              <img src="src/assets/math.png" alt="math" />
            </div>
            <div className="flex-1 p-10 flex flex-col justify-center items-start space-y-6">
              <h2 className="font-semibold text-4xl md:text-6xl">
                Học tương tác
              </h2>
              <div>
                <p className="text-lg">Khám phá khoa học qua hình ảnh và hoạt động thực hành</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row bg-gradient-to-br from-white to-blue-100">
            <div className="flex-1 p-10 flex flex-col justify-center items-start space-y-6">
              <h2 className="font-semibold text-4xl md:text-6xl">
                Tiến bộ từng bước
              </h2>
              <div>
                <p className="text-lg">Nắm vững từng khái niệm trước khi chuyển sang bài tiếp theo</p>
              </div>
            </div>
            <div className="flex-1 p-10">
              <div className="">
                <Lesson status={progress.lesson1} to="#" />
              </div>
              <div className="ml-60">
                <Lesson status={progress.lesson2} to="#" />
              </div>
              <div className="">
                <Lesson status={progress.lesson3} to="#" />
              </div>
            </div>
          </div>

          <div className="flex flex-row bg-gray-100">
            <div className="flex-1 px-10 py-40">
              <div className="flex gap-6">
                <div className="flex-col justify-center items-center translate-y-20">
                  <div className="w-[150px] h-[150px] bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-[100%] flex justify-center items-center ">
                    <div className="w-[140px] h-[140px] bg-white rounded-[100%] flex justify-center items-center">
                      <HiOutlineBolt className="w-[70px] h-[70px] text-[#7E82E4]" />
                    </div>
                  </div>
                  <p className="text-[#7E82E4] font-bold text-center mt-2">
                    T2
                  </p>
                </div>
                <div className="flex-col justify-center items-center translate-y-0">
                  <div className="w-[150px] h-[150px] bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-[100%] flex justify-center items-center ">
                    <div className="w-[140px] h-[140px] bg-white rounded-[100%] flex justify-center items-center">
                      <HiOutlineBolt className="w-[70px] h-[70px] text-[#7E82E4]" />
                    </div>
                  </div>
                  <p className="text-[#7E82E4] font-bold text-center mt-2">
                    T3
                  </p>
                </div>
                <div className="flex-col justify-center items-center -translate-y-20">
                  <div className="w-[150px] h-[150px] bg-[#C2C2C2] rounded-[100%] flex justify-center items-center ">
                    <div className="w-[140px] h-[140px] bg-white rounded-[100%] flex justify-center items-center">
                      <HiBolt className="w-[70px] h-[70px] text-[#E5E5E5]" />
                    </div>
                  </div>
                  <p className="text-[#C2C2C2] font-bold text-center mt-2">
                    T4
                  </p>
                </div>
              </div>

            </div>
            <div className="flex-1 p-10 flex flex-col justify-center items-start space-y-6">
              <h2 className="font-semibold text-4xl md:text-6xl">
                Giữ vững động lực
              </h2>
              <div>
                <p className="text-lg">Kết thúc mỗi ngày thông minh hơn với những bài học thú vị, tính năng thi đua hấp dẫn và lời khích lệ mỗi ngày</p>
              </div>
            </div>
          </div>




          <div className="grid md:grid-cols-3 gap-8 mt-5">
            {features.map((feature, index) => (
              <Card
                key={index}
                bordered={false}
                className="overflow-hidden group hover:shadow-2xl transition-all p-0"
                bodyStyle={{ padding: 0 }} // Xóa padding mặc định của Ant Card để gradient tràn viền
              >
                <div className={`bg-gradient-to-br ${feature.gradient} p-12 flex items-center justify-center`}>
                  <feature.icon className="text-7xl text-white group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* CTA Section */}
      <section section className="py-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white" >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            Bắt đầu hành trình STEM của bạn ngay hôm nay
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            Tham gia cùng hàng nghìn học sinh tò mò khám phá khoa học qua trò chơi
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Link to="/student-login">
              <button className="flex items-center text-lg px-8 py-3 bg-white text-indigo-600 hover:bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] border-2 border-white hover:text-white rounded-full font-bold transition-all shadow-lg active:scale-95">
                <FaUsers className="mr-2 text-xl" />
                Đăng ký học sinh
              </button>
            </Link>

            <Link to="/parent-login">
              {/* Sử dụng bg-white/10 khi hover để tạo hiệu ứng mờ mờ trên nền gradient */}
              <button className="flex items-center text-lg px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-full font-bold transition-all shadow-lg active:scale-95">
                <FaRegHeart className="mr-2 text-xl" />
                Đăng ký phụ huynh
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div >
  );
};

export default LandingPage;