import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gửi tin nhắn thành công");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const faqs = [
    {
      question: "STEMotion phù hợp với độ tuổi nào?",
      answer:
        "STEMotion được thiết kế cho học sinh từ 9–16 tuổi với nhiều cấp độ khác nhau.",
    },
    {
      question: "Có cần kinh nghiệm lập trình trước không?",
      answer:
        "Không. Các khóa học bắt đầu từ lập trình trực quan và nâng cao dần.",
    },
    {
      question: "Có thể dùng thử STEMotion trước khi mua không?",
      answer: "Có. Bản dùng thử miễn phí cung cấp các nội dung nhập môn.",
    },
    {
      question: "Có ưu đãi cho trường học hoặc nhóm không?",
      answer:
        "Có. STEMotion có chính sách giá riêng cho các tổ chức giáo dục.",
    },
    {
      question: "Hỗ trợ những thiết bị nào?",
      answer:
        "Máy tính để bàn, laptop và máy tính bảng (Chrome, Safari, Firefox).",
    },
    {
      question: "Các trận đấu robot hoạt động như thế nào?",
      answer:
        "Học sinh lập trình robot và thi đấu trong môi trường mô phỏng thời gian thực.",
    },
  ];

  // dùng cho icon trong vòng tròn màu indigo
  const circleIcon =
    "fa-solid text-white text-[18px] leading-none";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Liên hệ <span className="text-indigo-500">với chúng tôi</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Có câu hỏi? Hãy gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi sớm
          nhất.
        </p>
      </section>

      {/* Contact */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-8 items-stretch">
        {/* Info */}
        <div className="space-y-6 h-full flex flex-col">
          <div className="bg-white p-6 rounded-xl shadow flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 mb-4">
              {/* Email icon */}
              <i className={`fa-regular fa-envelope ${circleIcon}`} aria-hidden="true" />
            </div>
            <h3 className="font-bold">Email</h3>
            <p className="text-gray-600">hello@stemotion.com</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 mb-4">
              {/* Phone icon */}
              <i className={`fa-solid fa-phone ${circleIcon}`} aria-hidden="true" />
            </div>
            <h3 className="font-bold">Điện thoại</h3>
            <p className="text-gray-600">(555) 123-4567</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 mb-4">
              {/* Location icon */}
              <i className={`fa-solid fa-location-dot ${circleIcon}`} aria-hidden="true" />
            </div>
            <h3 className="font-bold">Địa chỉ</h3>
            <p className="text-gray-600">
              123 Education Street
              <br />
              Tech City
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow hover:shadow-lg transition-shadow h-full flex">
          <div className="p-8 w-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              {/* Message icon */}
              <i
                className="fa-regular fa-message h-6 w-6 text-indigo-500"
                aria-hidden="true"
              />
              <h2 className="text-2xl font-bold">Gửi tin nhắn cho chúng tôi</h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 flex-1 flex flex-col"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-md font-semibold mb-2"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    placeholder="Nguyễn Văn A"
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-md font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="nguyenvana@gmail.com"
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-md font-semibold mb-2"
                >
                  Chủ đề
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  placeholder="Chủ đề tin nhắn"
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="message"
                  className="block text-md font-semibold mb-2"
                >
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  placeholder="Nhập nội dung tin nhắn..."
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 flex-1 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-3 rounded-lg mt-auto"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-2">
            Câu hỏi thường gặp
          </h2>
          <p className="text-center text-gray-600 mb-12 text-xl">
            Giải đáp nhanh các thắc mắc phổ biến
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
