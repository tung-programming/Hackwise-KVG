'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  Github,
  Link as LinkIcon,
  UploadCloud,
  X,
  Lock,
} from 'lucide-react'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { mockCourses } from '@/lib/mock-data'

type DeliverableType = 'url' | 'file'
type ProjectStatus = 'In Progress' | 'Completed'

type Project = {
  id: string
  title: string
  status: ProjectStatus
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  progress: number
  desc: string
  tasks: string[]
  deliverableType: DeliverableType
  deliverableLabel: string
  deliverablePlaceholder: string
}

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const difficultyStyles: Record<Project['difficulty'], { bg: string; text: string; border: string }> = {
  Beginner: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Intermediate: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  Advanced: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
}

const projectsByField: Record<string, Project[]> = {
  Engineering: [
    {
      id: 'eng-1',
      title: 'Voter Verification DApp',
      status: 'In Progress',
      difficulty: 'Advanced',
      progress: 65,
      desc: "A decentralized voting platform for a university election. Build Solidity contracts on Sepolia, enforce voter whitelisting, block duplicate votes, and publish immutable live counts in a dashboard.",
      tasks: [
        'Write and deploy Election.sol',
        'Implement ECDSA signature verification',
        'Integrate Ethers.js frontend',
      ],
      deliverableType: 'url',
      deliverableLabel: 'Repository URL',
      deliverablePlaceholder: 'https://github.com/username/voter-dapp',
    },
    {
      id: 'eng-2',
      title: 'Legacy Monolith Migration',
      status: 'In Progress',
      difficulty: 'Advanced',
      progress: 15,
      desc: "Split a PHP monolith into microservices by extracting Billing and Inventory into Node.js services. Keep systems synchronized via RabbitMQ with no downtime.",
      tasks: ['Dockerize existing PHP monolith', 'Create Billing microservice', 'Configure RabbitMQ event bus'],
      deliverableType: 'url',
      deliverableLabel: 'Repository URL',
      deliverablePlaceholder: 'https://github.com/username/migration-task',
    },
    {
      id: 'eng-3',
      title: 'Real-time Bidding Engine',
      status: 'Completed',
      difficulty: 'Intermediate',
      progress: 100,
      desc: 'Build a high-throughput backend bidder handling 10,000 RPS with p95 latency under 50ms using Go/Rust workers and Redis-backed throttling.',
      tasks: ['Set up load balancer', 'Implement Redis caching layer', 'Stress test with Vegeta'],
      deliverableType: 'url',
      deliverableLabel: 'Repository URL',
      deliverablePlaceholder: 'https://github.com/username/bidding-engine',
    },
  ],
  Law: [
    {
      id: 'law-1',
      title: 'M&A Due Diligence Report',
      status: 'In Progress',
      difficulty: 'Advanced',
      progress: 65,
      desc: 'Review target-company data room documents, identify legal red flags, and draft indemnification recommendations for the merger agreement.',
      tasks: ['Review IP transfer agreements', 'Flag pending litigation liabilities', 'Draft summary memorandum'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Legal Memo (PDF)',
      deliverablePlaceholder: 'Drop PDF file here',
    },
    {
      id: 'law-2',
      title: 'IP Infringement Cease & Desist',
      status: 'Completed',
      difficulty: 'Beginner',
      progress: 100,
      desc: 'Draft a formal cease and desist citing Lanham Act provisions with clear remedies and response deadlines.',
      tasks: ['Analyze trademark similarity', 'Draft Lanham Act boilerplate', 'Prepare final letter'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Final Letter (PDF)',
      deliverablePlaceholder: 'Drop PDF file here',
    },
  ],
  Business: [
    {
      id: 'bus-1',
      title: 'LATAM Market Entry Strategy',
      status: 'In Progress',
      difficulty: 'Intermediate',
      progress: 30,
      desc: 'Design a 12-month go-to-market plan, risk matrix, and 3-year P&L for expansion into Brazil and Mexico.',
      tasks: ['Conduct LATAM competitor analysis', 'Draft operational risk matrix', 'Build 3-year financial model'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Pitch Deck / Excel',
      deliverablePlaceholder: 'Drop files here',
    },
    {
      id: 'bus-2',
      title: 'SaaS Churn Reduction Plan',
      status: 'Completed',
      difficulty: 'Intermediate',
      progress: 100,
      desc: 'Analyze cancellation cohorts, identify month-3 churn drivers, and propose three prioritized interventions.',
      tasks: ['Clean and analyze cancellation dataset', 'Identify month 3 drop-off reasons', 'Design executive presentation'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Presentation (PDF/PPT)',
      deliverablePlaceholder: 'Drop files here',
    },
  ],
  Medical: [
    {
      id: 'med-1',
      title: 'Diagnostic Accuracy Study',
      status: 'In Progress',
      difficulty: 'Advanced',
      progress: 45,
      desc: 'Evaluate a rapid assay using 500 patient records and report sensitivity, specificity, and PPV versus PCR baseline.',
      tasks: ['Calculate sensitivity and specificity', 'Determine PPV from prevalence', 'Draft clinical conclusion'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Clinical Write-up (PDF)',
      deliverablePlaceholder: 'Drop PDF here',
    },
    {
      id: 'med-2',
      title: 'Patient Pathway Redesign',
      status: 'Completed',
      difficulty: 'Intermediate',
      progress: 100,
      desc: 'Redesign non-critical ER intake to reduce wait times, with a current-vs-proposed process map and bottleneck analysis.',
      tasks: ['Map current intake process', 'Identify triage bottlenecks', 'Draft finalized pathway diagram'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Pathway Diagram (PDF)',
      deliverablePlaceholder: 'Drop PDF here',
    },
  ],
}

const fallbackField = 'Engineering'

export default function ProjectsPage() {
  const { field } = useAppStore()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const userField = field && projectsByField[field] ? field : fallbackField
  const projects = projectsByField[userField] ?? projectsByField[fallbackField]

  const inProgress = projects.filter((p) => p.status === 'In Progress')
  const completed = projects.filter((p) => p.status === 'Completed')
  
  // Logic: Check if all courses are 100% complete
  const allCoursesCompleted = mockCourses.length > 0 && mockCourses.every((c) => c.progress === 100)

  const stats = [
    { label: 'Active Assignments', value: inProgress.length, primary: true },
    { label: 'Completed', value: completed.length, primary: false },
    { label: 'Avg Score', value: '92%', primary: false },
  ]

  if (!allCoursesCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger} className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-xl rounded-3xl p-10 max-w-lg flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]" />
          
          <motion.div variants={fade} className="w-20 h-20 bg-slate-100/80 rounded-full flex items-center justify-center border border-slate-200 mb-6 relative">
            <div className="absolute inset-0 bg-[#f97316]/10 rounded-full animate-pulse" />
            <Lock className="w-8 h-8 text-[#172b44]" />
          </motion.div>
          
          <motion.h2 variants={fade} className="text-3xl font-black text-[#172b44] mb-3">
            Projects Locked
          </motion.h2>
          
          <motion.p variants={fade} className="text-slate-500 font-medium mb-8 leading-relaxed">
            You must complete all courses associated with your current interest path before you can attempt practical assignments and real-world projects.
          </motion.p>
          
          <motion.div variants={fade} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>Overall Course Progress</span>
              <span className="text-[#f97316]">{Math.round(mockCourses.reduce((acc, c) => acc + c.progress, 0) / mockCourses.length)}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(mockCourses.reduce((acc, c) => acc + c.progress, 0) / mockCourses.length)}%` }}
                className="h-full rounded-full bg-[#f97316]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-full">
      <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-8 pb-20">
        <motion.div variants={fade} className="flex flex-col gap-5 border-b border-border/40 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight" style={{ color: PRIMARY }}>
              Your Assignments
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">
              Complete realistic deliverables to simulate actual industry tasks in <strong className="text-foreground">{userField}</strong>.
            </p>
          </div>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              variants={fade}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md',
                item.primary ? 'border-transparent text-white' : 'border-white/60 bg-white/80 backdrop-blur-sm'
              )}
              style={item.primary ? { background: `linear-gradient(135deg, ${PRIMARY} 0%, #2a4158 100%)` } : {}}
            >
              <p className={cn('mb-2 text-sm font-bold', item.primary ? 'text-white/80' : 'text-slate-500')}>{item.label}</p>
              <h2 className={cn('text-4xl font-black tracking-tight', item.primary ? 'text-white' : 'text-slate-900')}>{item.value}</h2>
            </motion.div>
          ))}
        </motion.div>

        {inProgress.length > 0 && (
          <motion.div variants={stagger} className="space-y-4">
            <motion.div variants={fade} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">Current Queue</h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {inProgress.map((project) => (
                <motion.button
                  key={project.id}
                  variants={fade}
                  onClick={() => setSelectedProject(project)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white text-left shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
                >
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-transform group-hover:scale-110">
                        <FolderOpen className="h-5 w-5 text-slate-600" />
                      </div>
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          background: difficultyStyles[project.difficulty].bg,
                          color: difficultyStyles[project.difficulty].text,
                          borderColor: difficultyStyles[project.difficulty].border,
                        }}
                      >
                        {project.difficulty}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#f97316]">
                      {project.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">{project.desc}</p>

                    <div className="mt-auto">
                      <div className="mb-2 flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Progress</span>
                        <span style={{ color: ACCENT }}>{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: ACCENT }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {completed.length > 0 && (
          <motion.div variants={stagger} className="space-y-4 pt-6">
            <motion.div variants={fade} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">Evaluated and Passed</h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {completed.map((project) => (
                <motion.button
                  key={project.id}
                  variants={fade}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200/50 bg-slate-50/80 text-left opacity-80 shadow-sm transition-all duration-300 hover:opacity-100 hover:shadow-md"
                >
                  <div className="h-1.5 w-full bg-emerald-500" />
                  <div className="p-6">
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        background: difficultyStyles[project.difficulty].bg,
                        color: difficultyStyles[project.difficulty].text,
                        borderColor: difficultyStyles[project.difficulty].border,
                      }}
                    >
                      {project.difficulty}
                    </span>
                    <h3 className="mb-1 mt-4 text-lg font-bold text-slate-700">{project.title}</h3>
                    <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            />

            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              >
                <div className="relative border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute right-6 top-6 rounded-full bg-slate-200/50 p-2 text-slate-500 transition-colors hover:bg-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="mb-4 flex gap-3">
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase"
                      style={{
                        background: difficultyStyles[selectedProject.difficulty].bg,
                        color: difficultyStyles[selectedProject.difficulty].text,
                        borderColor: difficultyStyles[selectedProject.difficulty].border,
                      }}
                    >
                      {selectedProject.difficulty}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase text-slate-600">
                      {selectedProject.status}
                    </span>
                  </div>

                  <h2 className="pr-8 text-2xl font-black text-slate-900 sm:text-3xl">{selectedProject.title}</h2>
                  <p className="mt-2 text-sm font-medium text-slate-500">Assignment Briefing</p>
                </div>

                <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6 sm:p-8">
                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Context and Requirements</h4>
                    <p className="font-medium leading-relaxed text-slate-700">{selectedProject.desc}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Milestones</h4>
                    <ul className="space-y-3">
                      {selectedProject.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div
                            className={cn(
                              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                              selectedProject.status === 'Completed'
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-slate-300 bg-white'
                            )}
                          >
                            {selectedProject.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </div>
                          <span
                            className={cn(
                              'text-sm font-medium',
                              selectedProject.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-700'
                            )}
                          >
                            {task}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedProject.status === 'In Progress' && (
                    <div className="border-t border-slate-100 pt-2">
                      <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Submit Deliverable</h4>

                      {selectedProject.deliverableType === 'url' ? (
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Github className="h-4 w-4 text-slate-400" />
                            {selectedProject.deliverableLabel}
                          </label>
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                              <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                placeholder={selectedProject.deliverablePlaceholder}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                              />
                            </div>
                            <button
                              className="w-full rounded-xl px-6 py-3 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-max"
                              style={{ background: ACCENT }}
                            >
                              Submit
                            </button>
                          </div>
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Ensure repository is public and contains a README.md
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <FileText className="h-4 w-4 text-slate-400" />
                            {selectedProject.deliverableLabel}
                          </label>
                          <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:bg-slate-50">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-transform group-hover:scale-110">
                              <UploadCloud className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="mb-1 text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-xs font-medium text-slate-400">PDF, DOCX, or Excel (max 10MB)</p>
                          </div>
                          <button
                            className="w-full rounded-xl py-3.5 text-center font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            style={{ background: ACCENT }}
                          >
                            Submit Evaluation
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
