import React, { useEffect, useState } from "react";
import { Layout, Select, Typography, Spin, Row, Col, Empty, message } from "antd";
import {
    getParentStudentsApi,
    getStudentOverviewApi,
    getRecentActivitiesApi,
    getPerformanceInsightsApi,
    getStudyTimeStatisticsApi,
} from "../../services/api/studentProgress.service";
import useAuth from "../../contexts/AuthContext";
import OverviewCards from "../../components/Parent/StudentProgress/OverviewCards";
import RecentActivityList from "../../components/Parent/StudentProgress/RecentActivityList";
import PerformanceChart from "../../components/Parent/StudentProgress/PerformanceChart";
import StudyTimeChart from "../../components/Parent/StudentProgress/StudyTimeChart";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ParentDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data states
    const [overview, setOverview] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [studyTime, setStudyTime] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            setLoading(false);
            return;
        }
        if (user?.userId) {
            fetchStudents();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (selectedStudentId) {
            fetchStudentData(selectedStudentId);
        }
    }, [selectedStudentId]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await getParentStudentsApi(user.userId);
            const studentList = res?.data?.result || [];
            setStudents(studentList);
            if (studentList.length > 0) {
                setSelectedStudentId(studentList[0].studentId);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            message.error("Failed to load students.");
            setLoading(false);
        }
    };

    const fetchStudentData = async (studentId) => {
        try {
            setLoading(true);
            const endDate = new Date().toISOString();
            const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Last 7 days

            const [overviewRes, activitiesRes, insightsRes, studyTimeRes] = await Promise.all([
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
                <div className="flex justify-between items-center mb-6">
                    <Title level={2} style={{ margin: 0 }}>Parent Dashboard</Title>
                    {students.length > 0 && (
                        <Select
                            value={selectedStudentId}
                            style={{ width: 250 }}
                            onChange={handleStudentChange}
                            placeholder="Select a child"
                        >
                            {students.map((student) => (
                                <Option key={student.studentId} value={student.studentId}>
                                    {student.studentName}
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>

                {students.length === 0 ? (
                    <Empty description="No students linked to this account." />
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
                                    {/* Placeholder for Subject Breakdown or Recommendations if needed */}
                                </Col>
                            </Row>
                        </div>
                    </Spin>
                )}
            </Content>
        </Layout>
    );
};

export default ParentDashboard;
