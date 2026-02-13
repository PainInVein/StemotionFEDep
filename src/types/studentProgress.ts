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
    totalTimeSpentMinutes: number; // Changed from totalTimeSpent to match backend
    totalPoints: number;
    lastActivityDate?: Date;
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
    activityId: string;
    activityName: string;
    activityType: 'Game' | 'Lesson' | 'Quiz';
    referenceId: string;
    activityDate: string; // ISO date
    durationMinutes: number; // minutes
    score: number; // or accuracy %
    status: 'Completed' | 'In Progress';
    correctAnswers?: number;
    totalQuestions?: number;
}

export interface PerformanceInsightDTO {
    strengths: string[];
    weaknesses: string[];
    suggestedFocus: string[];
    subjectPerformance?: Record<string, number>;
    totalGamesPlayed?: number;
    averageGameScore?: number;
    learningStreak?: number;
    performanceTrend?: string;
}
