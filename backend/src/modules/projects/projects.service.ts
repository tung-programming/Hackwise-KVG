// Projects service
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import { validateProjectWithAI } from './project.validator';
import { calculateXP } from '../../utils/xp-calculator';

export const projectsService = {
  getUserProjects: async (userId: string) => {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  },

  getProject: async (userId: string, projectId: string) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  },

  createProject: async (userId: string, data: any) => {
    const project = await prisma.project.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        repoUrl: data.repoUrl,
        liveUrl: data.liveUrl,
        technologies: data.technologies,
        status: 'in_progress',
      },
    });

    return project;
  },

  updateProject: async (userId: string, projectId: string, data: any) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title,
        description: data.description,
        repoUrl: data.repoUrl,
        liveUrl: data.liveUrl,
        technologies: data.technologies,
        status: data.status,
      },
    });

    return updated;
  },

  validateProject: async (userId: string, projectId: string) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const validation = await validateProjectWithAI(project);

    if (validation.isValid && project.status !== 'completed') {
      const xpAwarded = calculateXP('project_complete');

      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'completed', validatedAt: new Date() },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpAwarded } },
      });

      return { ...validation, xpAwarded };
    }

    return validation;
  },

  deleteProject: async (userId: string, projectId: string) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });
  },
};
