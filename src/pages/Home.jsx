import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { alumniService, eventsService } from '../services/api'
import { supabase } from '../services/supabase'
import AlumniCard from '../components/AlumniCard'
import EventCard from '../components/EventCard'
import {
  GraduationCap, Users, CalendarDays, Star, ArrowRight,
  ClipboardList, CheckCircle, Search, Megaphone, LayoutDashboard, ChevronRight
} from 'lucide-react'

const features = [
  { icon: <ClipboardList size={22} />, title: 'Alumni Registration', desc: 'Sign up and create your alumni profile in minutes.' },
  { icon: <CheckCircle size={22} />, title: 'Admin Approval', desc: 'Admins review and approve registrations for a trusted community.' },
  { icon: <Search size={22} />, title: 'Alumni Directory', desc: 'Search graduates by name or graduation year.' },
  { icon: <Star size={22} />, title: 'Featured Alumni', desc: 'Showcase notable graduates and their achievements.' },
  { icon: <Megaphone size={22} />, title: 'Events & Announcements', desc: 'Stay updated with school news and upcoming events.' },
  { icon: <LayoutDashboard size={22} />, title: 'Admin Dashboard', desc: 'Central control panel for all admin operations.' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({ alumni: 0, years: 0, featured: 0, events: 0 })

  useEffect(() => {
    alumniService.getFeatured().then(({ data }) => setFeatured(data || []))
    eventsService.getAll().then(({ data }) => setEvents((data || []).slice(0, 3)))

    // Fetch real stats from DB
    async function loadStats() {
      const [alumniRes, featuredRes, eventsRes, yearsRes] = await Promise.all([
        supabase.from('alumni').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('alumni').select('id', { count: 'exact', head: true }).eq('status', 'approved').eq('featured', true),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('alumni').select('graduation_year').eq('status', 'approved'),
      ])
      const uniqueYears = new Set((yearsRes.data || []).map(a => a.graduation_year)).size
      setStats({
        alumni: alumniRes.count || 0,
        featured: featuredRes.count || 0,
        events: eventsRes.count || 0,
        years: uniqueYears,
      })
    }
    loadStats()
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" 
        />
        
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" 
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Version 1.0 MVP — In Development
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight"
            >
              Connect with your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-100">
                School Legacy
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl"
            >
              The official Peter Harvard INT'L School Alumni Portal. Reconnect with old friends, stay updated on school news, and join a growing community of excellence.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/register" className="group inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                <GraduationCap size={20} className="group-hover:rotate-12 transition-transform" />
                Join as Alumni
              </Link>
              <Link to="/directory" className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95">
                <Users size={20} />
                Browse Directory
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { label: 'Registered Alumni', value: stats.alumni, icon: <GraduationCap size={24} className="text-primary-500" /> },
            { label: 'Graduation Years', value: stats.years, icon: <CalendarDays size={24} className="text-primary-500" /> },
            { label: 'Featured Alumni', value: stats.featured, icon: <Star size={24} className="text-primary-500" /> },
            { label: 'Events Posted', value: stats.events, icon: <Megaphone size={24} className="text-primary-500" /> },
          ].map((s, idx) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-1">
                {s.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A full-featured platform built specifically for the Peter Harvard INT'L School community to foster lifelong connections.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((f, idx) => (
            <motion.div 
              key={f.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Alumni */}
      {featured.length > 0 && (
        <section className="bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Star size={28} className="text-yellow-500 fill-yellow-500" />
                  Featured Alumni
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Spotlighting our notable graduates and their journeys</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link to="/directory" className="group inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:gap-3 transition-all">
                  Browse All Alumni <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featured.map(a => (
                <motion.div key={a.id} variants={itemVariants}>
                  <AlumniCard alumni={a} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <CalendarDays size={28} className="text-primary-500" />
                Latest Events
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">What's happening in your school community</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/events" className="group inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:gap-3 transition-all">
                View Calendar <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map(e => (
              <motion.div key={e.id} variants={itemVariants}>
                <EventCard event={e} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-primary-600 dark:bg-primary-800" />
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-[100%] h-[150%] bg-white/5 blur-3xl rounded-full" 
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to reconnect?</h2>
            <p className="text-xl text-white/80 mb-10">
              Join the growing network of Peter Harvard INT'L School alumni and keep the spirit of your alma mater alive.
            </p>
            <Link to="/register" className="inline-flex items-center gap-3 bg-white text-primary-700 hover:bg-gray-100 font-bold px-10 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl text-lg">
              Register Now <ChevronRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
