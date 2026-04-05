import geminiPool from "../../config/gemini";

export interface RoadmapCourseNode {
  name: string;
  description: string;
  resourceUrl: string;
  resourceTitle: string;
  estimatedHours: number;
}

export interface RoadmapProjectIdea {
  name: string;
  description: string;
  difficulty: "easy" | "medium";
  estimatedHours: number;
  xpReward: number;
  bonusXp: number;
  evaluationCriteria: string;
}

export interface GeneratedRoadmap {
  courses: RoadmapCourseNode[];
  projects: RoadmapProjectIdea[];
}

const BANNED_RESOURCE_DOMAINS = [
  "coursera.org",
  "udemy.com",
  "edx.org",
  "skillshare.com",
  "linkedin.com/learning",
  "pluralsight.com",
  "datacamp.com",
  "codecademy.com",
  "brilliant.org",
  "masterclass.com",
  "domestika.org",
  "simplilearn.com",
  "greatlearning.in",
  "unacademy.com",
  "byjus.com",
  "vedantu.com",
  "pw.live",
];

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function normalizeDifficulty(value: unknown): "beginner" | "intermediate" | "advanced" {
  const v = String(value || "").toLowerCase();
  if (v === "intermediate" || v === "advanced") return v;
  return "beginner";
}

function normalizeProjectDifficulty(value: unknown): "easy" | "medium" {
  return String(value || "").toLowerCase() === "medium" ? "medium" : "easy";
}

function isUrlAllowed(url: string): boolean {
  if (!url || !url.startsWith("http")) return false;
  const lower = url.toLowerCase();
  return !BANNED_RESOURCE_DOMAINS.some((domain) => lower.includes(domain));
}

function sanitizeCourseNodes(nodes: unknown): RoadmapCourseNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes
    .slice(0, 5)
    .map((node, idx) => {
      const obj = node as Record<string, unknown>;
      const name = String(obj.name || "").trim();
      const description = String(obj.description || "").trim();
      const resourceUrl = String(obj.resourceUrl || "").trim();
      const resourceTitle = String(obj.resourceTitle || "").trim();
      const estimatedHours = clampInt(obj.estimatedHours, 3, 10, idx === 0 ? 3 : 4);

      if (!name || !description || !resourceTitle || !isUrlAllowed(resourceUrl)) return null;
      return { name, description, resourceUrl, resourceTitle, estimatedHours };
    })
    .filter((v): v is RoadmapCourseNode => Boolean(v));
}

function sanitizeProjects(projects: unknown): RoadmapProjectIdea[] {
  if (!Array.isArray(projects)) return [];
  return projects
    .slice(0, 2)
    .map((project, idx) => {
      const obj = project as Record<string, unknown>;
      const difficulty = idx === 0 ? "easy" : "medium";
      const name = String(obj.name || "").trim();
      const description = String(obj.description || "").trim();
      const evaluationCriteria = String(obj.evaluationCriteria || "").trim();
      const estimatedHours = clampInt(
        obj.estimatedHours,
        difficulty === "easy" ? 1 : 4,
        difficulty === "easy" ? 3 : 8,
        difficulty === "easy" ? 2 : 6
      );
      const xpReward = clampInt(
        obj.xpReward,
        difficulty === "easy" ? 50 : 100,
        difficulty === "easy" ? 100 : 200,
        difficulty === "easy" ? 75 : 150
      );
      const bonusXp = clampInt(obj.bonusXp, difficulty === "easy" ? 25 : 50, difficulty === "easy" ? 25 : 50, difficulty === "easy" ? 25 : 50);

      if (!name || !description || !evaluationCriteria) return null;
      return {
        name,
        description,
        difficulty,
        estimatedHours,
        xpReward,
        bonusXp,
        evaluationCriteria,
      };
    })
    .filter((v): v is RoadmapProjectIdea => Boolean(v));
}

function coursePrompt(field: string, type: string, interestName: string, matchedKeywords: string[]): string {
  return `You are an expert curriculum designer who builds structured, progressive learning roadmaps for college students. Every node links to a completely FREE resource.

STUDENT CONTEXT:
- Academic Field: ${field}
- Specialization/Branch: ${type}
- Topic they want to learn: ${interestName}
- Keywords from their recent searches: ${matchedKeywords.join(", ") || "none"}

STRICT REQUIREMENTS:
1. EXACTLY 5 NODES.
2. Progressive levels: foundation -> core skills -> intermediate -> advanced -> mastery.
3. estimatedHours must be between 3 and 10 per node; total 20-40.
4. ONLY free resources. Never use paid/subscription platforms.
5. Tailor deeply to ${field}/${type}.
6. "name" must be 3-6 words.
7. "description" must be 2-3 sentences.
8. "resourceTitle" should match actual source title.

Return ONLY raw JSON array:
[
  {
    "name": "Node Title",
    "description": "2-3 sentences.",
    "resourceUrl": "https://real-free-url",
    "resourceTitle": "Actual source title",
    "estimatedHours": 4
  }
]`;
}

function projectPrompt(
  field: string,
  type: string,
  interestName: string,
  courseNames: string[]
): string {
  return `You are a project mentor for college students. Design small, focused projects that test real understanding.

STUDENT CONTEXT:
- Academic Field: ${field}
- Specialization/Branch: ${type}
- Interest: ${interestName}
- Courses they will complete before this project: ${courseNames.join(" -> ") || "none"}

STRICT REQUIREMENTS:
1. EXACTLY 2 projects.
2. Project 1: difficulty "easy", around 2 hours, xpReward 50-100, bonusXp 25.
3. Project 2: difficulty "medium", around 6 hours, xpReward 100-200, bonusXp 50.
4. Projects must be concrete and scoped.
5. Projects must be tailored to ${field}/${type}.
6. Submission requires only GitHub link + written summary.
7. Solo-completable only, no paid tools/APIs.

Return ONLY raw JSON array:
[
  {
    "name": "Project title",
    "description": "3-4 sentences.",
    "difficulty": "easy",
    "estimatedHours": 2,
    "xpReward": 75,
    "bonusXp": 25,
    "evaluationCriteria": "2-3 sentences."
  },
  {
    "name": "Project title",
    "description": "3-4 sentences.",
    "difficulty": "medium",
    "estimatedHours": 6,
    "xpReward": 150,
    "bonusXp": 50,
    "evaluationCriteria": "2-3 sentences."
  }
]`;
}

export async function generateCourseRoadmap(
  interestName: string,
  field: string,
  type: string,
  matchedKeywords: string[]
): Promise<GeneratedRoadmap> {
  const rawNodes = await geminiPool.generateJSON<unknown>(
    coursePrompt(field, type, interestName, matchedKeywords),
    2200
  );

  const courses = sanitizeCourseNodes(rawNodes);
  if (courses.length !== 5) {
    throw new Error(`Gemini returned ${courses.length} valid course nodes. Expected exactly 5.`);
  }

  const rawProjects = await geminiPool.generateJSON<unknown>(
    projectPrompt(field, type, interestName, courses.map((c) => c.name)),
    1400
  );

  const projects = sanitizeProjects(rawProjects);
  if (projects.length !== 2) {
    throw new Error(`Gemini returned ${projects.length} valid projects. Expected exactly 2.`);
  }

  return { courses, projects };
}

export function toCourseRow(
  node: RoadmapCourseNode,
  index: number,
  userId: string,
  interestId: string
) {
  const levelByIndex = ["beginner", "beginner", "intermediate", "advanced", "advanced"] as const;
  return {
    interest_id: interestId,
    user_id: userId,
    name: node.name,
    description: node.description,
    resource_url: node.resourceUrl,
    node_order: index + 1,
    is_locked: index !== 0,
    is_completed: false,
    roadmap_data: {
      duration: `${node.estimatedHours}h`,
      difficulty: normalizeDifficulty(levelByIndex[index] ?? "beginner"),
      resourceTitle: node.resourceTitle,
      estimatedHours: node.estimatedHours,
    },
  };
}

export function toProjectRow(
  project: RoadmapProjectIdea,
  userId: string,
  interestId: string
) {
  return {
    interest_id: interestId,
    user_id: userId,
    name: project.name,
    description: project.description,
    difficulty: normalizeProjectDifficulty(project.difficulty),
    is_locked: true,
    is_completed: false,
    is_validated: false,
    submission_data: {
      estimatedHours: project.estimatedHours,
      xpReward: project.xpReward,
      bonusXp: project.bonusXp,
      evaluationCriteria: project.evaluationCriteria,
    },
  };
}
