// Courses service
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import { generateCourseRoadmap } from './roadmap.generator';
import { calculateXP } from '../../utils/xp-calculator';

export const coursesService = {
  getUserCourses: async (userId: string) => {
    const courses = await prisma.course.findMany({
      where: { userId },
      include: {
        modules: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((course) => ({
      ...course,
      progress: calculateCourseProgress(course.modules),
    }));
  },

  getCourse: async (userId: string, courseId: string) => {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return {
      ...course,
      progress: calculateCourseProgress(course.modules),
    };
  },

  generateRoadmap: async (userId: string, topic: string, level: string) => {
    const roadmap = await generateCourseRoadmap(topic, level);

    const course = await prisma.course.create({
      data: {
        userId,
        title: roadmap.title,
        description: roadmap.description,
        topic,
        level,
        modules: {
          create: roadmap.modules.map((mod: any, index: number) => ({
            title: mod.title,
            description: mod.description,
            resources: mod.resources,
            order: index,
            completed: false,
          })),
        },
      },
      include: {
        modules: true,
      },
    });

    return course;
  },

  updateProgress: async (
    userId: string,
    courseId: string,
    moduleId: string,
    completed: boolean
  ) => {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const module = await prisma.module.update({
      where: { id: moduleId },
      data: { completed },
    });

    let xpAwarded = 0;
    if (completed) {
      xpAwarded = calculateXP('module_complete');
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpAwarded } },
      });
    }

    return {
      module,
      xpAwarded,
    };
  },

  deleteCourse: async (userId: string, courseId: string) => {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    await prisma.course.delete({
      where: { id: courseId },
    });
  },
};

function calculateCourseProgress(modules: any[]) {
  if (modules.length === 0) return 0;
  const completed = modules.filter((m) => m.completed).length;
  return Math.round((completed / modules.length) * 100);
}
