import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Target, Users, Lightbulb, Heart, ArrowRight, Mail, Globe, Award, Phone } from 'lucide-react'

const team = [
  {
    name: 'Anointed Agunloye',
    role: 'Senior Dev & Operations Engineer',
    alumniTag: 'Alumni — Peter Harvard INT\'L School',
    photo: '/assets/Developers/anointed.png',
    desc: 'Supabase, PostgreSQL, Database Integration, Edge Functions, DevOps & Deployment',
    email: 'anointedthedeveloper@gmail.com',
    phones: ['+2348101209470', '+2349016471351'],
    links: [
      { label: 'GitHub', href: 'https://github.com/anointedthedeveloper', icon: 'github' },
      { label: 'Dev.to', href: 'https://dev.to/anointedthedeveloper', icon: 'devto' },
      { label: 'anobyte.online', href: 'https://anobyte.online', icon: 'globe' },
      { label: 'Instagram', href: 'https://www.instagram.com/anointedddeveloper/', icon: 'instagram' },
      { label: 'WhatsApp', href: 'https://wa.me/2348101209470', icon: 'whatsapp' },
    ],
  },
  {
    name: 'Goodness Emmanuel',
    role: 'Frontend Developer',
    alumniTag: 'Alumni — Peter Harvard INT\'L School',
    photo: '/assets/Developers/goodness.png',
    desc: 'React, Tailwind CSS, Context API, React Router',
    email: 'emmanuelgoodnesscj@gmail.com',
    phones: ['+2347018621884'],
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
  if (type === 'instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
  if (type === 'whatsapp') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center gap-3">
          <Award size={28} className="text-primary-500" /> School Founder
        </h2>
        <div className="card p-6 md:p-10 max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-xl border-primary-100/50 dark:border-primary-900/20">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="shrink-0"
          >
            <img
              src="/assets/founders/DrPeter.png"
              alt="Dr. Peter Oyedotun Agunloye"
              className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover border-4 border-white dark:border-gray-800 shadow-2xl flex-shrink-0"
            />
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">Dr. Peter Oyedotun Agunloye</h3>
            <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-5">Founder, Peter Harvard INT'L School</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {['FCA', 'FCIT', 'ACS', 'DBA', 'Ph.D', 'M.Sc'].map(c => (
                <span key={c} className="px-3 py-1 rounded-lg text-xs font-black bg-primary-600 text-white shadow-sm">{c}</span>
              ))}
            </div>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              A distinguished economist, chartered accountant, stockbroker, and forensic expert, Dr. Peter Oyedotun Agunloye founded Peter Harvard INT'L School with a vision to raise a generation of excellence. He holds doctorate and master's level qualifications and has built an outstanding career spanning finance, capital markets, and forensic accounting.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="tel:08033570685" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-500/25">
                <Phone size={18} /> Call Directly
              </a>
              <a href="https://ng.linkedin.com/in/dr-peter-oyedotun-agunloye" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0077b5] text-white hover:opacity-90 transition-all font-bold shadow-lg shadow-blue-500/25">
                <SocialIcon type="linkedin" size={18} /> LinkedIn Profile
              </a>
            </div>
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
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{m.name}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{m.role}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                      <GraduationCap size={10} />{m.alumniTag}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{m.desc}</p>
                {/* Phone numbers */}
                <div className="flex flex-col gap-1 mb-3">
                  {m.phones.map(p => (
                    <a key={p} href={`tel:${p}`}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Phone size={11} className="text-primary-500" />{p}
                    </a>
                  ))}
                </div>
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
