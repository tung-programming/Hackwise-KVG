// Resume service
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import { analyzeResumeATS } from './ats.analyzer';

export const resumeService = {
  uploadResume: async (userId: string, file: Express.Multer.File) => {
    const content = file.buffer.toString('utf-8');

    const resume = await prisma.resume.upsert({
      where: { userId },
      create: {
        userId,
        filename: file.originalname,
        content,
        mimeType: file.mimetype,
      },
      update: {
        filename: file.originalname,
        content,
        mimeType: file.mimetype,
        updatedAt: new Date(),
      },
    });

    return {
      id: resume.id,
      filename: resume.filename,
      uploadedAt: resume.updatedAt,
    };
  },

  getResume: async (userId: string) => {
    const resume = await prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      throw new NotFoundError('No resume found');
    }

    return {
      id: resume.id,
      filename: resume.filename,
      uploadedAt: resume.updatedAt,
    };
  },

  analyzeResume: async (userId: string, jobDescription?: string) => {
    const resume = await prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      throw new NotFoundError('No resume found');
    }

    const analysis = await analyzeResumeATS(resume.content, jobDescription);
    return analysis;
  },

  getATSScore: async (userId: string, jobDescription: string) => {
    const resume = await prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      throw new NotFoundError('No resume found');
    }

    const analysis = await analyzeResumeATS(resume.content, jobDescription);
    return {
      score: analysis.atsScore,
      keywordMatch: analysis.keywordMatch,
      suggestions: analysis.suggestions,
    };
  },

  deleteResume: async (userId: string) => {
    await prisma.resume.delete({
      where: { userId },
    });
  },
};
