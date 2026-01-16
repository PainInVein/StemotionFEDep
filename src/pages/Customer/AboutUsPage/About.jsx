import React from "react";
import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaAward,
} from "react-icons/fa";
import ChaosNumber from "../../../components/common/ChaosNumber";

const About = () => {
  const values = [
    {
      icon: FaBullseye,
      title: "Sứ mệnh",
      description:
        "Mang giáo dục STEM đến gần hơn với mọi học sinh thông qua mô phỏng robot tương tác và học tập theo hướng trò chơi hóa.",
    },
    {
      icon: FaEye,
      title: "Tầm nhìn",
      description:
        "Trao quyền cho thế hệ kỹ sư, nhà khoa học và nhà đổi mới tương lai bằng cách thay đổi cách học và tiếp cận STEM.",
    },
    {
      icon: FaHeart,
      title: "Giá trị cốt lõi",
      description:
        "Đổi mới, khả năng tiếp cận, sự hứng thú và chất lượng là nền tảng cho mọi hoạt động.",
    },
    {
      icon: FaAward,
      title: "Tác động",
      description:
        "Hơn 10.000 học sinh tại 500+ trường học trên toàn thế giới đang học STEMotion.",
    },
  ];

  const team = [
    {
      name: "Ms. Nguyễn Thị Thủy Linh",
      role: "CEO & BA",
      background: "",
    },
    {
      name: "Mr. Lê Sĩ Bình",
      role: "Trưởng nhóm Phát triển Backend",
      background: "",
    },
    {
      name: "Ms. Trần Mỹ Anh",
      role: "Nhà thiết kế UX/UI",
      background: "",
    },
    {
      name: "Mr. Đặng Huỳnh Thiên",
      role: "BA",
      background: "",
    },
    {
      name: "Mr. Nguyễn Ngọc Minh",
      role: "Trưởng nhóm phát triển Frontend",
      background: "",
    },
    {
      name: "Mr. Đoàn Trung Thành",
      role: "Nhà phát triển Frontend & Backend",
      background: "",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Giới thiệu <span className="text-indigo-500">STEM</span><span className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] bg-clip-text text-transparent">otion</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Trải nghiệm học STEM thông qua mô phỏng robot, lập trình trực quan và
          trò chơi hóa.
        </p>
      </section>

      {/* Sứ mệnh - Tầm nhìn */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8">
        {values.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full  bg-[linear-gradient(135deg,_#7E82E4_0%,_#FE99BF_30%,_#FBA889_62%,_#F8BB44_81%)] mb-6">
                <Icon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </section>

      {/* Câu chuyện */}
      <section className="bg-gradient-to-br from-white to-indigo-100 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Câu chuyện của chúng tôi
          </h2>
          <div className="space-y-6 text-gray-600 text-lg">
            <p>
              STEMotion được xây dựng dựa trên quan sát rằng học sinh học hiệu
              quả hơn khi được tương tác và thử thách.
            </p>
            <p>
              Năm 2020, nền tảng được phát triển với sự hợp tác của giáo viên và
              chuyên gia giáo dục STEM.
            </p>
            <p>
              Hiện nay, STEMotion đang được sử dụng bởi hàng nghìn học sinh trên
              toàn thế giới.
            </p>
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="w-full mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Đội ngũ STEMotion
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow hover:shadow-lg transition"
            >
              <div className="w-24 h-24 rounded-full bg-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
              <p className="text-sm text-gray-600">{member.background}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Thống kê */}
      <section className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] text-white py-20">

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold">
              <ChaosNumber target={10000} />+
            </div>
            <div>Học sinh</div>
          </div>

          <div>
            <div className="text-5xl font-bold">
              <ChaosNumber target={500} />+
            </div>
            <div>Trường học</div>
          </div>

          <div>
            <div className="text-5xl font-bold">
              <ChaosNumber target={50} />+
            </div>
            <div>Khóa học</div>
          </div>

          <div>
            <div className="text-5xl font-bold">
              <ChaosNumber target={4.9} />★
            </div>
            <div>Đánh giá</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
