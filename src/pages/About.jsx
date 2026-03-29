import { Link } from 'react-router-dom'
import { GraduationCap, Target, Users, Lightbulb, Heart, ArrowRight, ExternalLink, Mail } from 'lucide-react'

const team = [
  {
    name: 'Goodness Emmanuel',
    role: 'Frontend Developer',
    desc: 'React, Tailwind CSS, Context API',
    linkedin: 'https://linkedin.com/in/emmanuelgoodness',
    email: 'emmanuelgoodnesscj@gmail.com',
  },
  {
    name: 'Anointed Agunloye',
    role: 'Backend Developer',
    desc: 'Supabase, Database Integration',
    email: 'anointedthedeveloper@gmail.com',
  },
]

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
              { title: 'Backend / Database', items: ['Supabase — Authentication & database', 'PostgreSQL — Relational database', 'Row Level Security — Data protection', 'Supabase Storage — File uploads'] },
              { title: 'Tooling', items: ['Vite — Fast build tool', 'Git & GitHub — Version control', 'Vercel — Deployment & hosting', 'PostCSS & Autoprefixer'] },
            ].map(s => (
              <div key={s.title} className="card p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-primary-600 dark:text-primary-400">{s.title}</h3>
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

      {/* Team */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {team.map(m => {
              const initials = m.name.split(' ').map(n => n[0]).join('')
              return (
                <div key={m.name} className="card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{m.name}</h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400">{m.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{m.desc}</p>
                  <div className="flex gap-3">
                    <a href={`mailto:${m.email}`} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Mail size={16} />
                    </a>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
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
