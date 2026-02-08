import axiosClient from '../../utils/axiosClient';
import {
    StudentProgressOverviewDTO,
    ParentStudentListDTO,
    SubjectProgressResponseDTO,
    RecentActivityDTO,
    PerformanceInsightDTO
} from '../../types/studentProgress';

// Mocks kept for missing endpoints
const MOCK_ACTIVITIES: RecentActivityDTO[] = [
    { id: 'act-1', activityName: 'Phép cộng trong phạm vi 100', type: 'Lesson', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), duration: 15, score: 100, status: 'Completed' },
    { id: 'act-2', activityName: 'Đua xe toán học', type: 'Game', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), duration: 10, score: 85, status: 'Completed' },
];

const MOCK_INSIGHTS: Record<string, PerformanceInsightDTO> = {
    'default': {
        strengths: ['Tư duy logic', 'Tính toán'],
        weaknesses: ['Cần kiên nhẫn hơn'],
        suggestedFocus: ['Luyện tập thêm bài tập hình học']
    }
};

export const studentProgressService = {
    getParentStudents: async (parentId: string): Promise<ParentStudentListDTO[]> => {
        const response = await axiosClient.get(`api/StudentProgress/parent/${parentId}/students`);
        return response.data.result;
    },

    getStudentOverview: async (studentId: string): Promise<StudentProgressOverviewDTO> => {
        const response = await axiosClient.get(`api/StudentProgress/student/${studentId}/overview`);
        return response.data.result;
    },

    getSubjectProgress: async (studentId: string): Promise<SubjectProgressResponseDTO[]> => {
        try {
            const overview = await studentProgressService.getStudentOverview(studentId);
            return overview.subjects || [];
        } catch (error) {
            console.error("Error fetching subject progress via overview", error);
            return [];
        }
    },

    getRecentActivity: async (studentId: string): Promise<RecentActivityDTO[]> => {
        // Mock implementation as endpoint missing
        return new Promise(resolve => setTimeout(() => resolve(MOCK_ACTIVITIES), 400));
    },

    getPerformanceInsights: async (studentId: string): Promise<PerformanceInsightDTO> => {
        // Mock implementation as endpoint missing
        return new Promise(resolve => setTimeout(() => resolve(MOCK_INSIGHTS['default']), 700));
    },

    addStudent: async (parentId: string, studentCode: string): Promise<boolean> => {
        const response = await axiosClient.post(`api/StudentProgress/parent/${parentId}/add-student`, {
            studentCode: studentCode
        });
        return response.data.result;
    }
};
