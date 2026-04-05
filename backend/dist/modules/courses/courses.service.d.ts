export declare const coursesService: {
    getCoursesByInterest: (userId: string, interestId: string) => Promise<any[]>;
    getCourse: (userId: string, courseId: string) => Promise<any>;
    completeCourse: (userId: string, courseId: string) => Promise<{
        course: any;
        message: string;
        xp_awarded: number;
        all_courses_completed?: undefined;
    } | {
        course: any;
        xp_awarded: number;
        all_courses_completed: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=courses.service.d.ts.map