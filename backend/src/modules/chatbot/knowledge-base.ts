export interface KnowledgeBaseEntry {
  id: string;
  topic: string;
  question: string;
  answer: string;
  keywords: string[];
}

const topicTemplates = [
  {
    topic: "Authentication",
    keywords: ["auth", "login", "token", "oauth", "jwt", "session"],
    questions: [
      "How do I log in to CourseHive?",
      "Why is my login session expiring?",
      "How does token refresh work in CourseHive?",
      "How do Google and GitHub OAuth differ here?",
      "What should I do if I get Unauthorized on dashboard APIs?",
      "Where is the authentication flow handled in this project?",
      "How do I securely call protected endpoints from the frontend?",
      "What headers are required for authenticated API requests?",
      "How can I troubleshoot token-related errors quickly?",
      "How does CourseHive keep users signed in?",
    ],
    answer:
      "CourseHive uses JWT-based authentication with access tokens on API calls and refresh flow for session continuity. Use `authFetch` on the frontend, ensure `Authorization: Bearer <token>`, and re-authenticate when refresh fails.",
  },
  {
    topic: "Onboarding",
    keywords: ["onboarding", "field", "type", "preferences", "setup"],
    questions: [
      "What happens during onboarding in CourseHive?",
      "How do field and type selections affect recommendations?",
      "Can I update my onboarding choices later?",
      "Where are onboarding selections stored?",
      "Why do recommendations look generic before onboarding?",
      "How can onboarding improve learning personalization?",
      "What if onboarding is incomplete?",
      "How does onboarding data connect to interests?",
      "Which API manages onboarding updates?",
      "How should onboarding validation errors be handled?",
    ],
    answer:
      "Onboarding captures learner field/type context and drives downstream recommendations. Completing it improves interest suggestions and roadmap quality. Keep the data consistent and validated before generating interests.",
  },
  {
    topic: "Interests",
    keywords: ["interests", "recommendation", "accept", "reject", "progress"],
    questions: [
      "How are interests generated for users?",
      "What happens when I accept an interest?",
      "What happens when I reject an interest?",
      "How is interest progress calculated?",
      "How do interests connect to courses and projects?",
      "Why is an interest marked incomplete?",
      "Can an accepted interest be changed later?",
      "How do I fetch all interests for a user?",
      "Which endpoint gives interest-level progress?",
      "How does AI influence interest suggestions?",
    ],
    answer:
      "Interests are personalized recommendations. Accepting an interest typically triggers roadmap/course generation; rejecting removes it from active flow. Progress reflects completed roadmap nodes and linked course outcomes.",
  },
  {
    topic: "Courses & Roadmaps",
    keywords: ["course", "roadmap", "module", "learning", "complete", "node"],
    questions: [
      "How are course roadmaps generated?",
      "What does course completion unlock?",
      "Why is a course locked in the roadmap?",
      "How do I mark a course as completed?",
      "How is roadmap ordering determined?",
      "Where do course descriptions come from?",
      "How are beginner/intermediate/advanced levels used?",
      "Can users revisit completed courses?",
      "How do I fetch a single course by id?",
      "Which API returns courses by interest?",
    ],
    answer:
      "Roadmaps are generated per interest and level. Courses are ordered nodes; completing one can unlock the next node and update progress. APIs support listing by interest, getting details, and completion updates.",
  },
  {
    topic: "Projects",
    keywords: ["project", "submission", "validation", "assessment", "portfolio"],
    questions: [
      "How are project tasks tied to interests?",
      "When do projects unlock in CourseHive?",
      "How do I submit a project link?",
      "What data is validated during submission?",
      "How are project submissions assessed?",
      "Can I resubmit a project after feedback?",
      "How does project completion affect XP?",
      "What formats are supported for submission metadata?",
      "Which endpoint handles project submission?",
      "How are project records stored for users?",
    ],
    answer:
      "Projects are linked to interests and generally unlock after required learning milestones. Submission APIs validate URLs/metadata, then evaluate or store results. Completion can contribute to progression and engagement metrics.",
  },
  {
    topic: "Resume Analysis",
    keywords: ["resume", "ats", "ocr", "upload", "analysis", "feedback"],
    questions: [
      "How does resume upload and analysis work?",
      "Which resume file types are supported?",
      "What is the ATS score in CourseHive?",
      "How are strengths and improvements generated?",
      "How does OCR extraction fit into resume analysis?",
      "Why did resume analysis fail for my file?",
      "How can I improve a low ATS score?",
      "Can I reanalyze an updated resume?",
      "What endpoint uploads a resume for analysis?",
      "How is resume history shown in dashboard UI?",
    ],
    answer:
      "Resume analysis combines upload validation, text extraction (OCR when needed), and ATS-style feedback. It returns score, strengths, improvement areas, and actionable suggestions for better job-readiness.",
  },
  {
    topic: "Leaderboard & Gamification",
    keywords: ["leaderboard", "xp", "streak", "rank", "gamification", "points"],
    questions: [
      "How is XP awarded in CourseHive?",
      "What actions increase my leaderboard rank?",
      "How do streaks get updated?",
      "Why did my rank drop?",
      "How often is leaderboard data refreshed?",
      "Which events contribute to gamification points?",
      "How are tie-breakers handled in ranking?",
      "How do completed courses affect XP?",
      "How does project completion impact rank?",
      "Which endpoint provides leaderboard data?",
    ],
    answer:
      "Gamification uses XP, streaks, and activity events. Completing learning milestones increases XP and can improve ranking. Leaderboards reflect cumulative engagement and performance across supported activities.",
  },
  {
    topic: "Dashboard UX",
    keywords: ["dashboard", "layout", "widget", "component", "ui", "pages"],
    questions: [
      "How is dashboard layout shared across pages?",
      "Where should global widgets be mounted?",
      "How do I add features to all dashboard pages at once?",
      "Why use a floating component for helper tools?",
      "How can I keep dashboard components reusable?",
      "What are best practices for dashboard loading states?",
      "How do I avoid UI overlap with sidebars and topbar?",
      "How can a chatbot stay accessible across routes?",
      "How should dark mode support be handled for widgets?",
      "How can dashboard features remain responsive on mobile?",
    ],
    answer:
      "Shared dashboard layout is the right integration point for global tools. Mount reusable components once in layout to cover all child pages while keeping UX consistent, responsive, and easier to maintain.",
  },
  {
    topic: "Backend Architecture",
    keywords: ["backend", "express", "routes", "controller", "service", "middleware"],
    questions: [
      "What backend pattern does CourseHive use?",
      "Why separate routes, controllers, and services?",
      "How are middleware layers organized?",
      "Where should feature-specific business logic live?",
      "How is global error handling implemented?",
      "How should new modules be registered in app.ts?",
      "How do protected routes enforce authentication?",
      "How can I keep API responses consistent?",
      "Where should request validation happen?",
      "How should new endpoints be documented in API root?",
    ],
    answer:
      "CourseHive backend follows modular Express architecture: routes map endpoints, controllers handle request/response flow, services contain business logic, and middleware applies cross-cutting concerns like auth and errors.",
  },
  {
    topic: "Frontend Architecture",
    keywords: ["frontend", "nextjs", "client", "state", "component", "fetch"],
    questions: [
      "How is frontend API communication structured?",
      "Why use authFetch instead of fetch directly?",
      "How should dashboard state be managed?",
      "How do Next.js client components fit this app?",
      "Where should shared UI utilities live?",
      "How are API failures surfaced to users?",
      "How can we avoid repeated endpoint logic?",
      "How do we keep type-safe response parsing?",
      "What is a good pattern for loading and error states?",
      "How should reusable assistant widgets be built?",
    ],
    answer:
      "Frontend integrates through reusable utility layers (`authFetch`, shared components, store hooks). Keep network calls centralized, handle loading/errors explicitly, and mount cross-page features at layout boundaries.",
  },
  {
    topic: "Data & Supabase",
    keywords: ["supabase", "database", "table", "query", "storage", "rpc"],
    questions: [
      "How does CourseHive use Supabase?",
      "Which tables are critical for learning flow?",
      "How are user activities persisted?",
      "What Supabase RPCs are used for XP/streak logic?",
      "How should query errors be handled safely?",
      "How do we keep user data scoped per request?",
      "How are uploaded files stored and referenced?",
      "What causes common Supabase permission issues?",
      "How can I debug failed Supabase updates?",
      "How should timestamps be managed consistently?",
    ],
    answer:
      "Supabase backs CourseHive data, storage, and key workflow updates. Queries should always be user-scoped, error-checked, and aligned with table contracts for reliable progression and analytics behavior.",
  },
  {
    topic: "Deployment & Environment",
    keywords: ["env", "deployment", "keys", "production", "config", "security"],
    questions: [
      "Which environment variables are required to run CourseHive?",
      "How do frontend and backend base URLs interact?",
      "How should API keys be rotated safely?",
      "What should never be exposed to the frontend?",
      "How do I configure CORS for dashboard access?",
      "How can I verify env loading in local setup?",
      "What causes startup failures in backend config?",
      "How should production secrets be managed?",
      "How do I test deployment readiness before release?",
      "What are safe defaults for local development?",
    ],
    answer:
      "Environment config powers integrations and security boundaries. Keep service keys server-only, validate env at startup, align URLs/CORS, and rotate keys safely to ensure stable and secure deployments.",
  },
];

function buildKnowledgeBase(): KnowledgeBaseEntry[] {
  const entries: KnowledgeBaseEntry[] = [];
  let index = 1;

  for (const template of topicTemplates) {
    for (const question of template.questions) {
      const id = `kb-${String(index).padStart(3, "0")}`;
      const extendedAnswer = `${template.answer} This guidance applies to the "${template.topic}" area in your CourseHive project.`;
      entries.push({
        id,
        topic: template.topic,
        question,
        answer: extendedAnswer,
        keywords: template.keywords,
      });
      index += 1;
    }
  }

  const targetCount = 240;
  const seed = [...entries];
  let variantIndex = 1;

  while (entries.length < targetCount) {
    const base = seed[(variantIndex - 1) % seed.length];
    const id = `kb-${String(index).padStart(3, "0")}`;
    entries.push({
      id,
      topic: base.topic,
      question: `${base.question.replace(/\?$/, "")} (Project FAQ Variant ${variantIndex})?`,
      answer: `${base.answer} Variant note ${variantIndex}: apply this with current module contracts and authenticated API flow.`,
      keywords: base.keywords,
    });
    index += 1;
    variantIndex += 1;
  }

  return entries;
}

export const courseHiveKnowledgeBase = buildKnowledgeBase();

