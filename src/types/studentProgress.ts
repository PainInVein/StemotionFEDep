export interface ParentStudentListDTO {
    studentId: string; // User ID of the student
    studentName: string; // Changed from fullName to match backend DTO likely
    // fullName: string; // Check backend DTO 
    className?: string; // Backend might not send this?
    gradeLevel: number;
    avatarUrl?: string;
    overallProgress?: number;
    lastActivityDate?: Date;
}

export interface StudentProgressOverviewDTO {
    studentId: string;
    studentName: string;
    currentLevel: number;
    overallProgress: number; // 0-100
    learningStreak: number; // days
    totalTimeSpent: number; // minutes or hours
    points: number;
    subjects: SubjectProgressResponseDTO[]; // Updated to match backend
}

export interface SubjectProgressResponseDTO {
    subjectId: string;
    subjectName: string;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    status: 'Excellent' | 'Good' | 'Needs Improvement';
}

export interface RecentActivityDTO {
    id: string;
    activityName: string;
    type: 'Game' | 'Lesson' | 'Quiz';
    date: string; // ISO date
    duration: number; // minutes
    score: number; // or accuracy %
    status: 'Completed' | 'In Progress';
}

export interface PerformanceInsightDTO {
    strengths: string[];
    weaknesses: string[];
    suggestedFocus: string[];
}
