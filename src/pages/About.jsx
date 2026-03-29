import { Link } from 'react-router-dom'
import { GraduationCap, Target, Users, Lightbulb, Heart, ArrowRight, Mail, Globe, Award } from 'lucide-react'

const team = [
  {
    name: 'Anointed Agunloye',
    role: 'Senior Dev & Operations Engineer',
    photo: '/assets/Developers/anointed.png',
    desc: 'Supabase, PostgreSQL, Database Integration, Edge Functions, DevOps & Deployment',
    email: 'anointedthedeveloper@gmail.com',
    links: [
      { label: 'GitHub', href: 'https://github.com/anointedthedeveloper', icon: 'github' },
      { label: 'Dev.to', href: 'https://dev.to/anointedthedeveloper', icon: 'devto' },
      { label: 'anobyte.online', href: 'https://anobyte.online', icon: 'globe' },
    ],
  },
  {
    name: 'Goodness Emmanuel',
    role: 'Frontend Developer',
    photo: '/assets/Developers/goodness.png',
    desc: 'React, Tailwind CSS, Context API, React Router',
    email: 'emmanuelgoodnesscj@gmail.com',
    links: [
      { label: 'GitHub', href: 'https://github.com/goodnessemmanuel1', icon: 'github' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/emmanuelgoodness', icon: 'linkedin' },
    ],
  },
]

function SocialIcon({ type, size = 14 }) {
  if (type === 'github') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
  if (type === 'devto') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
    </svg>
  )
  if (type === 'linkedin') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
  return <Globe size={size} />
}

const objectives = [
  { icon: <Target size={20} />, title: 'Structured Database', desc: 'Create a searchable, organized alumni database.' },
  { icon: <Users size={20} />, title: 'Community Building', desc: 'Strengthen long-term relationships between alumni and the school.' },
  { icon: <Lightbulb size={20} />, title: 'Highlight Achievements', desc: 'Showcase successful alumni and their accomplishments.' },
  { icon: <Heart size={20} />, title: 'Easy Communication', desc: 'Enable seamless announcements and event updates.' },
]

const roadmap = [
  { step: 1, title: 'Project Architecture & Folder Structure', done: true },
  { step: 2, title: 'Authentication System', done: true },
  { step: 3, title: 'Alumni Registration Form', done: true },
  { step: 4, title: 'Admin Approval Workflow', done: true },
  { step: 5, title: 'Alumni Directory & Search', done: true },
  { step: 6, title: 'Featured Alumni Section', done: true },
  { step: 7, title: 'Events Management', done: true },
  { step: 8, title: 'UI Polish & Responsiveness', done: false },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <span className="text-white/70 font-medium">About the Platform</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4">Peter Harvard INT'L School Alumni Portal</h1>
            <p className="text-white/75 text-lg leading-relaxed">
              A web application designed to connect graduates with their alma mater through a centralized digital community. Our goal is to strengthen long-term relationships while delivering a modern, user-friendly experience.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Project Objectives</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {objectives.map(o => (
            <div key={o.title} className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                {o.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{o.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Tech Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { title: 'Frontend', items: ['React — Component-based UI', 'Tailwind CSS — Utility-first styling', 'Context API — Global state management', 'React Router — Client-side routing', 'Lucide React — Icon library'] },
              { title: 'Backend / Database', items: ['Supabase — Authentication & database', 'PostgreSQL — Relational database', 'Row Level Security — Data protection', 'Edge Functions — Serverless backend'] },
              { title: 'Tooling', items: ['Vite — Fast build tool', 'Git & GitHub — Version control', 'Vercel — Deployment & hosting', 'PostCSS & Autoprefixer'] },
            ].map(s => (
              <div key={s.title} className="card p-6">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-4">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map(i => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Development Roadmap</h2>
        <div className="space-y-3 max-w-xl">
          {roadmap.map(r => (
            <div key={r.step} className="flex items-center gap-4">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                r.done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {r.done ? '✓' : r.step}
              </div>
              <span className={`text-sm ${r.done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                {r.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <Award size={22} className="text-primary-500" /> School Founder
        </h2>
        <div className="card p-8 max-w-2xl flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src="/assets/founders/DrPeter.png"
            alt="Dr. Peter Oyedotun Agunloye"
            className="w-36 h-36 rounded-2xl object-cover border-4 border-primary-200 dark:border-primary-800 shadow-xl flex-shrink-0"
          />
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Dr. Peter Oyedotun Agunloye</h3>
            <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">Founder, Peter Harvard INT'L School</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['FCA', 'FCIT', 'ACS', 'FMNES', 'DBA', 'Ph.D'].map(c => (
                <span key={c} className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              A distinguished academic and professional, Dr. Peter Oyedotun Agunloye founded Peter Harvard INT'L School with a vision to provide world-class education and raise a generation of excellence. His credentials span accounting, information technology, computer science, environmental sciences, and doctoral-level research.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {team.map(m => (
              <div key={m.name} className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{m.name}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{m.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{m.desc}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                  >
                    <Mail size={11} />Email
                  </a>
                  {m.links.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                    >
                      <SocialIcon type={l.icon} size={11} />{l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Be part of the community</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Register today and connect with fellow Peter Harvard INT'L School graduates.</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          Get Started<ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
