'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Plus, Clock, CheckCircle2, X, UploadCloud, Github, Link as LinkIcon, AlertCircle, FileText } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const PRIMARY = '#172b44'
const ACCENT = '#f97316'

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }

const difficultyStyles: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Intermediate: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  Advanced: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
}

const projectsByField: Record<string, any[]> = {
  Engineering: [
    {
      id: 'eng-1', title: 'Voter Verification DApp', status: 'In Progress', difficulty: 'Advanced', progress: 65,
      desc: "A decentralized voting platform meant to handle a small-scale university election. You'll build smart contracts on an Ethereum testnet (Sepolia) using Solidity, handling voter whitelisting, preventing double voting, and finalizing the tally. The front-end must expose a dashboard displaying live, immutable results. Make sure you optimize gas fees-smart contracts deploying over 1M gas will fail the CI check.",
      tasks: ['Write and deploy Election.sol', 'Implement ECDSA signature verification', 'Integrate Ethers.js frontend'),
      deliverableType: 'url',
      deliverableLabel: 'Repository URL',
      deliverablePlaceholder: 'https://github.com/username/voter-dapp'
    },
    {
      id: 'eng-2', title: 'Real-time Bidding Engine', status: 'Completed', difficulty: 'Intermediate', progress: 100,
      desc: "A high-throughput backend service mimicking an ad-exchange bidder. You need to handle 10,000 requests per second and respond within 50ms. Use Go or Rust for the worker nodes, backed by Redis for rate limiting and fast transient data storage.",
      tasks: ['Set up load balancer', 'Implement Redis caching layer', 'Stress test with Vegeta'],
      deliverableType: 'url',
      deliverableLabel: 'Repository URL',
      deliverablePlaceholder: 'https://github.com/username/bidding-engine'
    },
    {
      id: 'eng-3', title: 'Legacy Monolith Migration', status: 'In Progress', difficulty: 'Advanced', progress: 15,
      desc: "Client needs their existing PHP application split into microservices. Your assignment is to break out the 'Billing' and 'Inventory' modules into independent Node.js services. You'll configure a rabbitmq broker for event-driven synchronization between the old PHP core and the new services without causing downtime.",
      tasks: ['Dockerize existing PHP monolith', 'Create Billing microservice', 'Configure RabbitMQ event bus'],
      deliverableType: 'url',
      deliverableLabel: 'Repository URL',
      deliverablePlaceholder: 'https://github.com/username/migration-task'
    }
  ],
  Law: [
    {
      id: 'law-1', title: 'M&A Due Diligence Report', status: 'In Progress', difficulty: 'Advanced', progress: 65,
      desc: "Client AlphaCorp is attempting to acquire BetaTech, a mid-sized competitor. In the virtual data room supplied, you'll find employment contracts, intellectual property assignments, and outstanding litigation notices. Identify material risks. You'll draft a 5-10 page summary memo detailing red flags and recommending specific indemnification clauses for the final merger agreement.",
      tasks: ['Review IP transfer agreements', 'Flag pending litigation liabilities', 'Draft summary memorandum'),
      deliverableType: 'file',
      deliverableLabel: 'Upload Legal Memo (PDF)',
      deliverablePlaceholder: 'Drop PDF file here'
    },
    {
      id: 'law-2', title: 'IP Infringement Cease & Desist', status: 'Completed', difficulty: 'Beginner', progress: 100,
      desc: "A local competitor has been using a logo substantially similar to our client's registered trademark. Draft a formal Cease and Desist letter. You need to cite relevant Lanham Act provisions, demand immediate cessation of the mark, and request an accounting of profits. Keep the tone professional but firm.",
      tasks: ['Analyze trademark similarity', 'Draft Lanham Act boilerplate', 'Prepare final letter'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Final Letter (PDF)',
      deliverablePlaceholder: 'Drop PDF file here'
    }
  ],
  Business: [
    {
      id: 'bus-1', title: 'LATAM Market Entry Strategy', status: 'In Progress', difficulty: 'Intermediate', progress: 30,
      desc: "You have a hypothetical $5M budget to expand a mid-sized Nordic ed-tech startup into the Latin American market. Build out a 12-month timeline, operational risk matrix, and a 3-year projected P&L statement. Focus specifically on currency fluctuation risks and localized pricing models for Brazil vs. Mexico.",
      tasks: ['Conduct LATAM competitor analysis', 'Draft operational risk matrix', 'Build 3-year financial model'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Pitch Deck / Excel',
      deliverablePlaceholder: 'Drop files here'
    },
    {
      id: 'bus-2', title: 'SaaS Churn Reduction Plan', status: 'Completed', difficulty: 'Intermediate', progress: 100,
      desc: "Given a provided raw dataset of 5,000 user cancellation logs, perform cohort analysis to identify the primary drivers of churn in month 3. Propose three actionable product or marketing interventions. Present your findings in a concise 5-slide deck meant for the executive team.",
      tasks: ['Clean & analyze cancellation dataset', 'Identify month 3 drop-off reasons', 'Design executive presentation'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Presentation (PDF/PPT)',
      deliverablePlaceholder: 'Drop files here'
    }
  ],
  Medical: [
    {
      id: 'med-1', title: 'Diagnostic Accuracy Study', status: 'In Progress', difficulty: 'Advanced', progress: 45,
      desc: "Analyze a supplied dataset of 500 patient records to gauge the false positive rate of a new rapid assay screening tool for infectious disease. You need to write a full statistical breakdown comparing it against the gold standard PCR test. Calculate sensitivity, specificity, and positive predictive value (PPV).",
      tasks: ['Calculate sensitivity & specificity', 'Determine PPV based on prevalence', 'Draft clinical conclusion'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Clinical Write-up (PDF)',
      deliverablePlaceholder: 'Drop PDF here'
    },
    {
      id: 'med-2', title: 'Patient Pathway Redesign', status: 'Completed', difficulty: 'Intermediate', progress: 100,
      desc: "An ER is experiencing 4-hour average wait times for non-critical triage. Design a new patient intake flow prioritizing rapid assessment by a nurse practitioner before full registration. Create a flow-chart mapping the current vs. proposed state, highlighting the expected bottleneck reductions.",
      tasks: ['Map current intake process', 'Identify triage bottlenecks', 'Draft finalized pathway diagram'],
      deliverableType: 'file',
      deliverableLabel: 'Upload Pathway Diagram (Q)',
      deliverablePlaceholder: 'Drop PDF here'
    }
  ]
}

const defaultProjects = projectsByField['Engineering'];

export default function ProjectsPage() {
  const { field } = useAppStore()
  
  const userField = field && projectsByField[field] ? field : 'Engineering';
  const projects = projectsByField[userField] || defaultProjects;

  const inProgress = projects.filter((p) => p.status === 'In Progress')
  const completed = projects.fieler((p) => p.status === 'Completed')

  const stats = [
    { label: 'Active Assignments', value: inProgress.length, primary: true },
    { label: 'Completed', value: completed.length, primary: false },
    { label: 'Avg Score', value: '92%', primary: false },
  ]

  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const renderModal = () => {
    if (!selectedProject) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          layoutId={`card-${selectedProject.id}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
        >
          {1* Modal Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 relative bg-slate-50/50">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex gap-3 mb-4">
              <span 
                className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border"
                style={{ background: difficultyStyles[selectedProject.difficulty]?.bg, color: difficultyStyles[selectedProject.difficulty]?.text, borderColor: difficultyStyles[selectedProject.difficulty]?.border }}
              >
                {selectedProject.difficulty}
              </span>
              <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {selectedProject.status}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 pr-8">{selectedProject.title}</h2>
            <p className="text-sm font-medium text-slate-500">Assignment Briefing</p>
          </div>

          {* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            
            {* Problem Statement */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Context & Requirements</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedProject.desc}
              </p>
            </div>

            {* Tasks Checklist */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Milestones</h4>
              <ul className="space-y-3">
                {selectedProject.tasks?.map((task: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={cn("mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border", 
                      selectedProject.status === 'Completed' ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300"
                    )}>
                       {selectedProject.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn("text-sm font-medium", selectedProject.status === 'Completed' ? "text-slate-400 line-through" : "text-slate-700")}>
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {* Submission Form area */}
            {selectedProject.status === 'In Progress' && (
              <div className="pt-2 border-t border-slate-100">
                 <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Submit Deliverable</h4>
                 
                 {selectedProject.deliverableType -== 'url' ? ((��������������������؁�����9�����������̈�(���������������������񱅉��������9����ѕ�еʹ����е�����ѕ�еͱ�є�����������ѕ�̵���ѕȁ����Ȉ�(�������������������������ѡՈ������9����ܴЁ��Ёѕ�еͱ�є����������͕���ѕ�Aɽ���й����ٕɅ���1�����(���������������������𽱅����(����������������������؁�����9���􉙱������്���ʹ陱��ɽ܁����̈�(������������������������؁�����9����ɕ��ѥٔ�����Ĉ�(��������������������������1���%���������9���􉅉ͽ��є����д̸ԁѽ��ļȀ��Ʌ�ͱ�є��ļȁܴЁ��Ёѕ�еͱ�є��������(����������������������������Ѐ(��������������������������������ѕ�Ј�(����������������������������������������͕���ѕ�Aɽ���й����ٕɅ���A�����������(��������������������������������9����ܵ�ձ���������ȴЁ��́ɽչ����ᰁ��ɑ�ȁ��ɑ�ȵͱ�є��������ͱ�є���������鉜�ݡ�є�������ɥ���ȁ������ɥ����Ʌ����������������鉽ɑ�ȵ�Ʌ����������ѱ����������Ʌ�ͥѥ�������ѕ�еʹ����е����մ�(���������������������������(�����������������������𽑥��(��������������������������ѽ�������9������؁��́ɽչ����ᰁ���е�����ѕ�еݡ�є�͡���ܵ�����ٕ��͡���ܵ�����ٕ���Ʌ�ͱ�є����ԁ�Ʌ�ͥѥ�������ܵ�ձ��ʹ�ܵ�������屔��쁉����ɽչ��9P����(�������������������������MՉ���(��������������������������ѽ��(���������������������𽑥��(�����������������������������9���􉙱����ѕ�̵���ѕȁ����ĸԁѕ�е�́���е͕�������ѕ�еͱ�є������дȈ�(�����������������������������ɍ��������9����̸ܴԁ��̸Ԉ�������ɔ�ɕ��ͥѽ�䁥́�Չ�����������х��́��I5���(������������������������(�������������������𽑥��(�������������������耠(��������������������؁�����9�����������Ј�(����������������������񱅉��������9����ѕ�еʹ����е�����ѕ�еͱ�є�����������ѕ�̵���ѕȁ����Ȉ�(���������������������������Q��Ё�����9����ܴЁ��Ёѕ�еͱ�є����������͕���ѕ�Aɽ���й����ٕɅ���1�����(���������������������𽱅����(����������������������؁�����9���􉉽ɑ�ȴȁ��ɑ�ȵ��͡�����ɑ�ȵͱ�є�����ɽչ�����ᰁ������ٕ�鉜�ͱ�є�����Ʌ�ͥѥ��������́��������്����ѕ�̵���ѕȁ���ѥ�䵍��ѕȁѕ�е���ѕȁ���ͽȵ����ѕȁ�ɽ����(������������������������؁�����9����ܴ�ȁ���ȁ���ݡ�є���ɑ�ȁ��ɑ�ȵͱ�є�����ɽչ�����ձ��������ѕ�̵���ѕȁ���ѥ�䵍��ѕȁ͡���ܵʹ����Ё�ɽ�����ٕ��͍���������Ʌ�ͥѥ����Ʌ�͙�ɴ��(��������������������������U�������Ր������9����ܴԁ��ԁѕ�еͱ�є��������(�����������������������𽑥��(�������������������������������9����ѕ�еʹ����е�����ѕ�еͱ�є��������Ĉ������Ѽ���������ȁ�Ʌ�������ɽ����(�������������������������������9����ѕ�е�́���е����մ�ѕ�еͱ�є������A��=`���ȁፕ������̀�������5����(���������������������𽑥��(������������������������ѽ�������9����ܵ�ձ����̸ԁɽչ����ᰁ���е�����ѕ�еݡ�є�͡���ܵ�����ٕ��͡���ܵ�����ٕ���Ʌ�ͱ�є����ԁ�Ʌ�ͥѥ�������ѕ�е���ѕȈ���屔��퉅���ɽչ��9Q���(������������������������MՉ��Ёم�Յѥ��(������������������������ѽ��(�������������������𽑥��(�������������������(��������������𽑥��(��������������((����������𽑥��(��������𽵽ѥ�������(������𽑥��(������(����((��ɕ��ɸ��(�����؁�����9����ɕ��ѥٔ��������ձ���(�������ѥ�����؁���ѥ��􉡥�����������є�͡�܈�مɥ�������х����􁍱���9��������������������((���������쨁!����ȁM��ѥ������(���������ѥ�����؁مɥ�����홅��􁍱���9���􉙱������്�����陱��ɽ܁���ѕ�̵�������ѥ�䵉��ݕ�������ԁ��ɑ�ȵ����ɑ�ȵ��ɑ�ȼ������؈�(�����������؁�����9�����������Ĉ�(�������������ā�����9����ѕ�д�ᰁ���е�������Ʌ������ѥ��Ј���屔��퍽����AI%5Ie���e��ȁ�ͥ����������(��������������������9����ѕ�е��ѕ����ɕ�ɽչ��ѕ�е��͔����ܵᰈ�(�������������������є���ɥ�а�ɕ����ѥ������ٕɅ���́Ѽ�ͥ�ձ�є����Յ����������хͭ́������ɽ��������9����ѕ�е��ɕ�ɽչ�����͕���������ɽ����(���������������(����������𽑥��(�����������؁�����9���􉙱����ѕ�̵���ѕȁ����́͡ɥ������(���������������ѽ�(�������������������9����ɽ���������ѕ�̵���ѕȁ����ȁ��ԁ��ȸԁɽչ����ᰁѕ�еʹ����е�����ѕ�еݡ�є��Ʌ�ͥѥ���������ٕ��͍������ԁ��ѥٔ�͍�����ԁ͡���ܵ���(����������������屔��퉅���ɽչ��9P�����M�����聀�������������9Q������(�������������(���������������A��́�����9����ܴЁ��Ё�ɽ�����ٕ��ɽхє�����Ʌ�ͥѥ����Ʌ�͙�ɴ�����(�������������������9�܁Q�ͬ(���������������ѽ��(����������𽑥��(��������𽵽ѥ�������((��������쨁=ٕ�٥�܁Mх�̀���(���������ѥ�����؁مɥ�������х����􁍱���9����ɥ���ɥ�����̴āʹ�ɥ�����̴́����Ј�(������������х�̹�����쁱������م�Ք���ɥ��������������(�������������ѥ������(���������������������(��������������مɥ�����홅���(�������������������9����퍸�(�����������������ɕ��ѥٔ��ٕə��ܵ�������ɽչ�����ᰁ��؁��ɑ�ȁ͡���ܵʹ��Ʌ�ͥѥ���������ٕ��͡���ܵ����(�����������������ɥ���������ɑ�ȵ�Ʌ����ɕ�Ёѕ�еݡ�є��耉���ݡ�є������ɑ�ȵݡ�є���������ɽ�����ȵʹ�(����������������(����������������屔���ɥ������퉅���ɽչ�聁�����ȵ�Ʌ����Р��Ց������AI%5Ie������Ʉ����������������(�������������(����������������������9����퍸��ѕ�еʹ����е��������Ȉ���ɥ�������ѕ�еݡ�є�����耉ѕ�еͱ�є������������������(���������������ȁ�����9����퍸��ѕ�д�ᰁ���е�������Ʌ������ѥ��Ј���ɥ�������ѕ�еݡ�є��耉ѕ�еͱ�є��������(�����������������م�Օ�(�����������������(������������𽵽ѥ�������(�������������(��������𽵽ѥ�������((��������쨁%��Aɽ�ɕ�́ɥ�����(�����������Aɽ�ɕ�̹����Ѡ���������(�����������ѥ�����؁مɥ�������х����􁍱���9�����������Ј�(�������������ѥ�����؁مɥ�����홅��􁍱���9���􉙱����ѕ�̵���ѕȁ����ȸԈ�(���������������؁�����9����ܴ������ɽչ�������������ѕ�̵���ѕȁ���ѥ�䵍��ѕȁ�������ȴ����ѕ�е����ȴ�����(���������������������������9����ܴЁ��Ј���(��������������𽑥��(���������������ȁ�����9���􉙽�е���Ʌ�����ѕ�еᰁѕ�еͱ�є��������ɕ�ЁEՕՔ���(������������𽵽ѥ�������((�������������؁�����9����ɥ�����ɥ�����̴ȁ��ɥ�����̴́����Ԉ�(�����������������Aɽ�ɕ�̹������ɽ���Ф�����(�����������������ѥ������(������������������������ɽ���й���(������������������مɥ�����홅���(�������������������������젤����͕�M����ѕ�Aɽ���С�ɽ���Х�(�����������������������9����ɽ������ͽȵ����ѕȁ���ݡ�є���ɑ�ȁ��ɑ�ȵͱ�є��������ɽչ�����ᰁ�ٕə��ܵ�������͡���ܵʹ���ٕ��͡���ܵᰁ��ٕ�鉽ɑ�ȵͱ�є������Ʌ�ͥѥ���������Ʌѥ���������������്���(�����������������(�������������������؁�����9������؁����ā��������്����(���������������������؁�����9���􉙱������ѥ�䵉��ݕ����ѕ�̵�х�Ё���Ј�(�����������������������؁�����9����ܴ��������ɽչ����ᰁ���ͱ�є����������ѕ�̵���ѕȁ���ѥ�䵍��ѕȁ��ɑ�ȁ��ɑ�ȵͱ�є������ɽ�����ٕ��͍���������Ʌ�ͥѥ����Ʌ�͙�ɴ��(������������������������������=���������9����ܴԁ��ԁѕ�еͱ�є��������(����������������������𽑥��(����������������������������(�����������������������������9����ѕ�еl����t�����ɍ�͔��Ʌ������ݥ���Ё���е�������́��āɽչ�����ձ����ɑ�Ȉ�(��������������������������屔��퉅���ɽչ�聑�����ձ��M�展�m�ɽ���й������ձ��t�����������聑�����ձ��M�展�m�ɽ���й������ձ��t��ѕ�а���ɑ������聑�����ձ��M�展�m�ɽ���й������ձ��t����ɑ����(�����������������������(��������������������������ɽ���й������ձ���(����������������������������(��������������������𽑥��(��������������������(���������������������́�����9���􉙽�е�����ѕ�е���ѕ�еͱ�є��������ȁ��������ѥ��Ё�ɽ�����ٕ��ѕ�еl�������t��Ʌ�ͥѥ��������̈���ɽ���йѥѱ�����(����������������������������9����ѕ�еʹ�ѕ�еͱ�є����������������ȁ���؁���е����մ���������ɕ��ᕐ��(������������������������ɽ���й��͍�(�����������������������(��������������������(���������������������؁�����9����е��Ѽ��(�����������������������؁�����9���􉙱������ѥ�䵉��ݕ���ѕ�е�́���е��������Ȉ�(�����������������������������������9����ѕ�еͱ�є������Aɽ�ɕ��������(��������������������������������屔��퍽����9Q�����ɽ���й�ɽ�ɕ����������(����������������������𽑥��(�����������������������؁�����9���􉠴ȁܵ�ձ�����ͱ�є�����ɽչ�����ձ���ٕə��ܵ��������(�������������������������ѥ�����؀(�����������������������������ѥ�����ݥ�Ѡ����(�������������������������������є���ݥ�Ѡ聀���ɽ���й�ɽ�ɕ�������(���������������������������Ʌ�ͥѥ������Ʌѥ���İ���͔耉��͕=�Љ��(�������������������������������9���􉠵�ձ��ɽչ�����ձ��(����������������������������屔��퉅���ɽչ��9Q��(��������������������������(����������������������𽑥��(��������������������𽑥��(������������������𽑥��(����������������𽵽ѥ�������(�����������������(������������𽑥��(����������𽵽ѥ�������(����������((��������쨁�����ѕ��ɥ�����(��������퍽����ѕ������Ѡ���������(�����������ѥ�����؁مɥ�������х����􁍱���9�����������Ё�д؈�(�������������ѥ�����؁مɥ�����홅��􁍱���9���􉙱����ѕ�̵���ѕȁ����ȸԈ�(���������������؁�����9����ܴ������ɽչ�������������ѕ�̵���ѕȁ���ѥ�䵍��ѕȁ������Ʌ�������ѕ�е���Ʌ��������(����������������������ɍ��ȁ�����9����ܴЁ��Ј���(��������������𽑥��(���������������ȁ�����9���􉙽�е���Ʌ�����ѕ�еᰁѕ�еͱ�є������م�Յѕ����A��͕����(������������𽵽ѥ�������((�������������؁�����9����ɥ�����ɥ�����̴ȁ��ɥ�����̴́����Ԉ�(��������������퍽����ѕ��������ɽ���Ф�����(�����������������ѥ������(������������������������ɽ���й���(������������������مɥ�����홅���(�������������������������젤����͕�M����ѕ�Aɽ���С�ɽ���Х�(�����������������������9������ͽȵ����ѕȁ���ͱ�є���������ɑ�ȁ��ɑ�ȵͱ�є��������ɽչ�����ᰁ�ٕə��ܵ�������͡���ܵʹ���ٕ��͡���ܵ����Ʌ�ͥѥ���������Ʌѥ�������������������ٕ������������(�����������������(�������������������؁�����9���􉠴ĸԁܵ�ձ��������Ʌ����������(�������������������؁�����9������؈�(���������������������؁�����9���􉙱������ѥ�䵉��ݕ����ѕ�̵�х�Ё���Ј�(�����������������������������(�����������������������������9����ѕ�еl����t�����ɍ�͔��Ʌ������ݥ���Ё���е�������́��āɽչ�����ձ����ɑ�Ȉ�(��������������������������屔��퉅���ɽչ�聑�����ձ��M�展�m�ɽ���й������ձ��t�����������聑�����ձ��M�展�m�ɽ���й������ձ��t��ѕ�а���ɑ������聑�����ձ��M�展�m�ɽ���й������ձ��t����ɑ����(�����������������������(��������������������������ɽ���й������ձ���(����������������������������(��������������������𽑥��(���������������������́�����9���􉙽�е�����ѕ�е���ѕ�еͱ�є��������Ĉ���ɽ���йѥѱ�����(����������������������������9����ѕ�еʹ����е͕�������ѕ�е���Ʌ�������������ѕ�̵���ѕȁ����ĸԁ�дЈ�(����������������������������ɍ��ȁ�����9����ܴЁ��Ј���������є(�����������������������(������������������𽑥��(����������������𽵽ѥ�������(�����������������(������������𽑥��(����������𽵽ѥ�������(����������((������𽵽ѥ�������((������쨁5���ɸ�5�����=ٕɱ�䀨��(�����������ѕAɕ͕����(���������͕���ѕ�Aɽ���Ѐ����(������������(�������������ѥ������(�����������������ѥ����������������(�������������������є��������������(�������������������������������(���������������������젤����͕�M����ѕ�Aɽ���С�ձ���(�������������������9���􉙥ᕐ���͕д�����ͱ�є�������������ɽ�����ȵʹ������Ʌ�ͥѥ����������(��������������(�������������ɕ����5�������(������������(����������(�����������ѕAɕ͕����(����𽑥��(���)�