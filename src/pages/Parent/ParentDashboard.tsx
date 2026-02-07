import React, { useState, useEffect } from 'react';
import { Card, Select, Progress, List, Tag, Skeleton, Avatar, Row, Col, Statistic, Alert, Button, Modal, Input, message } from 'antd';
import {
    UserOutlined,
    TrophyOutlined,
    FireOutlined,
    ClockCircleOutlined,
    RocketOutlined,
    BookOutlined,
    ExperimentOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { studentProgressService } from '../../services/education/studentProgressService';
import {
    ParentStudentListDTO,
    StudentProgressOverviewDTO,
    SubjectProgressResponseDTO,
    RecentActivityDTO,
    PerformanceInsightDTO
} from '../../types/studentProgress';
import useAuth from '../../contexts/AuthContext';

const ParentDashboard: React.FC = () => {
    const { user } = useAuth() as any;
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState<ParentStudentListDTO[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>('');

    // Add Child Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentCode, setStudentCode] = useState('');
    const [adding, setAdding] = useState(false);

    // Data states
    const [overview, setOverview] = useState<StudentProgressOverviewDTO | null>(null);
    const [subjects, setSubjects] = useState<SubjectProgressResponseDTO[]>([]);
    const [activities, setActivities] = useState<RecentActivityDTO[]>([]);
    const [insights, setInsights] = useState<PerformanceInsightDTO | null>(null);

    // Initial load - get list of children
    useEffect(() => {
        const fetchChildren = async () => {
            if (!user?.userId) return; // Wait for user info

            try {
                const kids = await studentProgressService.getParentStudents(user.userId);
                setChildren(kids);
                if (kids.length > 0) {
                    setSelectedChildId(kids[0].studentId);
                }
            } catch (error) {
                console.error("Failed to load children", error);
            }
        };
        fetchChildren();
    }, [user]);

    // Load child specific data when selection changes
    useEffect(() => {
        if (!selectedChildId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [ovData, subData, actData, insData] = await Promise.all([
                    studentProgressService.getStudentOverview(selectedChildId),
                    studentProgressService.getSubjectProgress(selectedChildId),
                    studentProgressService.getRecentActivity(selectedChildId),
                    studentProgressService.getPerformanceInsights(selectedChildId)
                ]);

                setOverview(ovData);
                setSubjects(subData);
                setActivities(actData);
                setInsights(insData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedChildId]);

    // Handle Add Child
    const handleAddChild = async () => {
        if (!studentCode.trim() || !user?.userId) return;
        setAdding(true);
        try {
            const success = await studentProgressService.addStudent(user.userId, studentCode);
            if (success) {
                message.success('Thêm học sinh thành công!');
                // Refresh list
                const kids = await studentProgressService.getParentStudents(user.userId);
                setChildren(kids);
                // If first child, auto select
                if (children.length === 0 && kids.length > 0) {
                    setSelectedChildId(kids[0].studentId);
                }
                setIsModalOpen(false);
                setStudentCode('');
            }
        } catch (error) {
            message.error('Không tìm thấy học sinh hoặc đã được liên kết');
        } finally {
            setAdding(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Excellent': return 'success';
            case 'Good': return 'processing';
            case 'Needs Improvement': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            👋 Chào phụ huynh,
                        </h1>
                        <p className="text-slate-500">Theo dõi hành trình học tập của con bạn</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            size="large"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Thêm con
                        </Button>

                        <div className="flex items-center gap-3">
                            <span className="text-slate-600 font-medium hidden md:inline">Đang xem:</span>
                            <Select
                                value={selectedChildId}
                                onChange={(value) => setSelectedChildId(value)}
                                className="w-48"
                                size="large"
                            >
                                {children.map(child => (
                                    <Select.Option key={child.studentId} value={child.studentId}>
                                        <div className="flex items-center gap-2">
                                            <Avatar src={child.avatarUrl} size="small" icon={<UserOutlined />} />
                                            <span>{child.studentName}</span>
                                            {child.overallProgress !== undefined && (
                                                <Tag color="blue" className="ml-2">{child.overallProgress}%</Tag>
                                            )}
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                    <>
                        {/* 1. Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-shadow">
                                <Statistic
                                    title={<span className="text-slate-500 font-semibold">Cấp độ hiện tại</span>}
                                    value={overview?.currentLevel}
                                    prefix={<RocketOutlined className="text-blue-500 mr-2" />}
                                    suffix="Level"
                                    valueStyle={{ fontWeight: 'bold', color: '#3b82f6' }}
                                />
                            </Card>
                            <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-shadow">
                                <Statistic
                                    title={<span className="text-slate-500 font-semibold">Chuỗi học tập</span>}
                                    value={overview?.learningStreak}
                                    prefix={<FireOutlined className="text-orange-500 mr-2" />}
                                    suffix="Ngày"
                                    valueStyle={{ fontWeight: 'bold', color: '#f97316' }}
                                />
                            </Card>
                            <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-shadow">
                                <Statistic
                                    title={<span className="text-slate-500 font-semibold">Tổng thời gian</span>}
                                    value={Math.round((overview?.totalTimeSpent || 0) / 60)}
                                    prefix={<ClockCircleOutlined className="text-emerald-500 mr-2" />}
                                    suffix="Giờ"
                                    valueStyle={{ fontWeight: 'bold', color: '#10b981' }}
                                />
                            </Card>
                            <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-shadow">
                                <Statistic
                                    title={<span className="text-slate-500 font-semibold">Tổng điểm</span>}
                                    value={overview?.points}
                                    prefix={<TrophyOutlined className="text-yellow-500 mr-2" />}
                                    suffix="Điểm"
                                    valueStyle={{ fontWeight: 'bold', color: '#eab308' }}
                                />
                            </Card>
                        </div>

                        <Row gutter={[24, 24]}>
                            {/* 2. Left Column: Progress & Insights */}
                            <Col xs={24} lg={16}>
                                <div className="space-y-6">
                                    {/* Subject Progress */}
                                    <Card
                                        title={<span className="text-lg font-bold text-slate-800"><BookOutlined className="mr-2 text-blue-600" />Tiến độ môn học</span>}
                                        bordered={false}
                                        className="shadow-sm rounded-xl"
                                    >
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={subjects}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <div className="w-full">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="font-bold text-slate-700">{item.subjectName}</span>
                                                            <Tag color={getStatusColor(item.status)}>{item.status === 'Needs Improvement' ? 'Cần cố gắng' : item.status === 'Good' ? 'Làm tốt' : 'Xuất sắc'}</Tag>
                                                        </div>
                                                        <Progress
                                                            percent={item.progressPercentage}
                                                            strokeColor={item.status === 'Needs Improvement' ? '#f59e0b' : item.status === 'Excellent' ? '#10b981' : '#3b82f6'}
                                                            status="active"
                                                            format={percent => `${percent}% (${item.completedLessons}/${item.totalLessons} bài)`}
                                                        />
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>

                                    {/* Performance Insights */}
                                    <Card
                                        title={<span className="text-lg font-bold text-slate-800"><ExperimentOutlined className="mr-2 text-purple-600" />Góc phân tích & Lời khuyên</span>}
                                        bordered={false}
                                        className="shadow-sm rounded-xl bg-gradient-to-br from-indigo-50 to-white"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-emerald-600 mb-3 flex items-center">
                                                    <i className="fa-solid fa-check-circle mr-2"></i>Điểm mạnh
                                                </h4>
                                                <ul className="space-y-2">
                                                    {insights?.strengths.map((str, idx) => (
                                                        <li key={idx} className="flex items-start text-slate-700 bg-emerald-50 p-2 rounded-lg">
                                                            <span className="mr-2">•</span>{str}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-amber-600 mb-3 flex items-center">
                                                    <i className="fa-solid fa-exclamation-circle mr-2"></i>Cần cải thiện
                                                </h4>
                                                <ul className="space-y-2">
                                                    {insights?.weaknesses.map((wk, idx) => (
                                                        <li key={idx} className="flex items-start text-slate-700 bg-amber-50 p-2 rounded-lg">
                                                            <span className="mr-2">•</span>{wk}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-200">
                                            <Alert
                                                message="Gợi ý cho phụ huynh"
                                                description={
                                                    <ul className="list-disc pl-4 mt-2">
                                                        {insights?.suggestedFocus.map((sug, idx) => (
                                                            <li key={idx}>{sug}</li>
                                                        ))}
                                                    </ul>
                                                }
                                                type="info"
                                                showIcon
                                                className="bg-blue-50 border-blue-100"
                                            />
                                        </div>
                                    </Card>
                                </div>
                            </Col>

                            {/* 3. Right Column: Recent Activity */}
                            <Col xs={24} lg={8}>
                                <Card
                                    title={<span className="text-lg font-bold text-slate-800"><ClockCircleOutlined className="mr-2 text-orange-600" />Hoạt động gần đây</span>}
                                    bordered={false}
                                    className="shadow-sm rounded-xl h-full"
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={activities}
                                        renderItem={(item) => (
                                            <List.Item className="hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                                <List.Item.Meta
                                                    avatar={
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Game' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {item.type === 'Game' ? <i className="fa-solid fa-gamepad"></i> : <BookOutlined />}
                                                        </div>
                                                    }
                                                    title={<span className="font-semibold text-slate-700">{item.activityName}</span>}
                                                    description={
                                                        <div className="text-xs text-slate-500">
                                                            <div>{new Date(item.date).toLocaleDateString()} • {item.duration} phút</div>
                                                            <div className={`mt-1 font-bold ${item.score >= 80 ? 'text-green-600' : item.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                Điểm: {item.score}/100
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>

            <Modal
                title="Thêm con vào tài khoản"
                open={isModalOpen}
                onOk={handleAddChild}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={adding}
                okText="Thêm"
                cancelText="Hủy"
            >
                <p className="mb-4 text-slate-500">Nhập mã học sinh hoặc email của con bạn để liên kết tài khoản.</p>
                <Input
                    placeholder="Nhập mã học sinh / Email..."
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    size="large"
                    prefix={<UserOutlined className="text-slate-400" />}
                />
            </Modal>
        </div >
    );
};

export default ParentDashboard;
