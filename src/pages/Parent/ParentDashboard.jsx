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
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-6">
        {/* Header row */}
        <div className="flex justify-between items-center mb-6">
          <Title level={2} style={{ margin: 0 }}>
            Parent Dashboard
          </Title>

          <div className="flex items-center gap-3">
            {students.length > 0 && (
              <>
                <Select
                  value={selectedStudentId}
                  style={{ width: 260 }}
                  onChange={handleStudentChange}
                  placeholder="Select a child"
                >
                  {students.map((student) => (
                    <Option key={student.studentId} value={student.studentId}>
                      {student.studentName}
                    </Option>
                  ))}
                </Select>

                <Button onClick={handleReloadCurrentStudent}>
                  Tải lại
                </Button>
              </>
            )}

            <Button type="primary" onClick={openCreateStudent}>
              Tạo học sinh
            </Button>
          </div>
        </div>

        {/* No students case */}
        {students.length === 0 ? (
          <div className="bg-white rounded-xl p-6">
            <Empty description="No students linked to this account." />
            <div className="mt-4 flex justify-center">
              <Button type="primary" onClick={openCreateStudent}>
                Tạo học sinh ngay
              </Button>
            </div>
          </div>
        ) : (
          <Spin spinning={loading}>
            <div className="space-y-6">
              {overview && <OverviewCards data={overview} />}

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <StudyTimeChart data={studyTime} />
                </Col>
                <Col xs={24} lg={8}>
                  <RecentActivityList activities={recentActivities} />
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <PerformanceChart data={performance} />
                </Col>
                <Col xs={24} lg={12}>
                  {/* Placeholder for future widgets */}
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
