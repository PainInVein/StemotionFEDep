import React, { useEffect, useState } from "react";
import {
  Layout,
  Select,
  Typography,
  Spin,
  Row,
  Col,
  Empty,
  message,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import {
  getParentStudentsApi,
  getStudentOverviewApi,
  getRecentActivitiesApi,
  getPerformanceInsightsApi,
  getStudyTimeStatisticsApi,
} from "../../services/api/studentProgress.service";
import { createStudentService } from "../../services/auth/auth.service";
import useAuth from "../../contexts/AuthContext";
import OverviewCards from "../../components/Parent/StudentProgress/OverviewCards";
import RecentActivityList from "../../components/Parent/StudentProgress/RecentActivityList";
import PerformanceChart from "../../components/Parent/StudentProgress/PerformanceChart";
import StudyTimeChart from "../../components/Parent/StudentProgress/StudyTimeChart";
import WeeklyStreak from "../../components/Parent/StudentProgress/WeeklyStreak";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const splitFullName = (fullName) => {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};

const ParentDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // main loading for dashboard data
  const [loading, setLoading] = useState(true);

  // Data states
  const [overview, setOverview] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [studyTime, setStudyTime] = useState(null);

  // ✅ Create student modal
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
      return;
    }
    if (user?.userId) {
      fetchStudents(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentData(selectedStudentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentId]);

  const fetchStudents = async (autoSelectFirst = false) => {
    try {
      setLoading(true);

      const res = await getParentStudentsApi(user.userId);
      const studentList = res?.data?.result || [];

      setStudents(studentList);

      if (studentList.length > 0) {
        if (autoSelectFirst || !selectedStudentId) {
          setSelectedStudentId(studentList[0].studentId);
        }
      } else {
        setSelectedStudentId(null);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async (studentId) => {
    try {
      setLoading(true);

      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // last 7 days

      const [overviewRes, activitiesRes, insightsRes, studyTimeRes] =
        await Promise.all([
          getStudentOverviewApi(studentId),
          getRecentActivitiesApi(studentId),
          getPerformanceInsightsApi(studentId),
          getStudyTimeStatisticsApi(studentId, startDate, endDate),
        ]);

      setOverview(overviewRes?.data?.result);
      setRecentActivities(activitiesRes?.data?.result || []);
      setPerformance(insightsRes?.data?.result);
      setStudyTime(studyTimeRes?.data?.result);
    } catch (error) {
      console.error("Error fetching student data:", error);
      message.error("Failed to load student progress.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (value) => {
    setSelectedStudentId(value);
  };

  const openCreateStudent = () => {
    form.resetFields();
    setCreateOpen(true);
  };

  const handleCreateStudent = async () => {
    try {
      const values = await form.validateFields();
      setCreating(true);

      const { firstName, lastName } = splitFullName(values.fullName);

      const payload = {
        parentId: user.userId, // ✅ BE requires GUID parentId
        firstName,
        lastName,
        username: values.username,
        password: values.password,
        gradeLevel: values.gradeLevel ?? 0,
      };

      const res = await createStudentService(payload);
      const created = res?.result;

      message.success("Tạo học sinh thành công!");
      setCreateOpen(false);

      // ✅ refetch list, prefer selecting created student if id exists
      await fetchStudents(false);
      if (created?.studentId) setSelectedStudentId(created.studentId);
      else await fetchStudents(true);
    } catch (err) {
      if (err?.errorFields) return; // antd validate fail
      console.error("Create student error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Tạo học sinh thất bại.";
      message.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleReloadCurrentStudent = () => {
    if (!selectedStudentId) return;
    fetchStudentData(selectedStudentId);
  };

  if ((loading || authLoading) && !selectedStudentId) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Content className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Chào mừng, {user?.lastName || "Phụ huynh"}! 👋
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Dưới đây là tình hình học tập của con bạn hôm nay.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {students.length > 0 && (
              <>
                <Select
                  value={selectedStudentId}
                  style={{ width: 260 }}
                  onChange={handleStudentChange}
                  placeholder="Chọn học sinh"
                  className="shadow-sm rounded-lg"
                >
                  {students.map((student) => (
                    <Option key={student.studentId} value={student.studentId}>
                      {student.studentName}
                    </Option>
                  ))}
                </Select>

                <button
                  onClick={handleReloadCurrentStudent}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm transition-all hover:shadow-md"
                  title="Tải lại"
                >
                  <i className={`fa-solid fa-rotate ${loading ? 'animate-spin' : ''}`}></i>
                </button>
              </>
            )}

            <button
              onClick={openCreateStudent}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap active:scale-95"
            >
              <i className="fa-solid fa-plus"></i> Tạo học sinh
            </button>
          </div>
        </div>

        {/* No students case */}
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto mt-10">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-110 duration-300">
              <i className="fa-solid fa-child-reaching text-5xl text-blue-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Chưa có học sinh nào</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              Bắt đầu hành trình bằng cách tạo tài khoản cho con bạn để theo dõi tiến độ học tập.
            </p>
            <button
              onClick={openCreateStudent}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 active:translate-y-0"
            >
              Tạo học sinh ngay
            </button>
          </div>
        ) : (
          <Spin spinning={loading}>
            <div className="space-y-8">
              {overview && <OverviewCards data={overview} />}

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <StudyTimeChart data={studyTime} />
                </Col>
                <Col xs={24} lg={8}>
                  <RecentActivityList activities={recentActivities} />
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <PerformanceChart data={performance} />
                </Col>
                <Col xs={24} lg={12}>
                  {/* Premium Feature Card */}
                  <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white flex flex-col justify-center items-center text-center shadow-xl relative overflow-hidden group h-full">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transform group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner transform rotate-3 group-hover:rotate-6 transition-transform">
                      <i className="fa-solid fa-wand-magic-sparkles text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold mb-3">AI Insights Sắp Ra Mắt</h3>
                    <p className="text-indigo-100 mb-8 max-w-sm text-lg leading-relaxed">
                      Sẵn sàng cho lộ trình học tập cá nhân hóa và các đề xuất thông minh từ AI cho con bạn.
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-all hover:-translate-y-1 active:translate-y-0">
                      Tham gia danh sách chờ
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </Spin>
        )}

        {/* Create student modal */}
        <Modal
          title="Tạo học sinh"
          open={createOpen}
          onCancel={() => setCreateOpen(false)}
          footer={null} // Use custom footer or form buttons if needed, but keeping default standard form structure is easier with AntD forms. User logic used onOk.
          // Wait, user logic used onOk in the Modal props.
          //   okText="Tạo"
          //   cancelText="Hủy"
          //   confirmLoading={creating}
          //   onOk={handleCreateStudent}
          // I should styling the Modal footer buttons too? 
          // User said "code xu ly de nguyen". I should probably keep the standard AntD modal footer for logic safety, 
          // OR I can override the footer to use my premium buttons calling the same logic.
          // Let's stick to the User Snippet for Modal strictly to avoid breaking form validation logic, as form submission is bound to Modal ok?
          // The user snippet has `onOk={handleCreateStudent}`.
          okText="Tạo"
          cancelText="Hủy"
          confirmLoading={creating}
          onOk={handleCreateStudent}
        >
          <Form form={form} layout="vertical" initialValues={{ gradeLevel: 0 }}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập username" },
                { min: 3, message: "Username tối thiểu 3 ký tự" },
              ]}
            >
              <Input placeholder="student123" autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="******" autoComplete="new-password" />
            </Form.Item>

            <Form.Item
              label="Khối/Lớp (gradeLevel)"
              name="gradeLevel"
              rules={[{ required: true, message: "Vui lòng nhập gradeLevel" }]}
            >
              <InputNumber min={0} max={12} className="w-full" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ParentDashboard;
