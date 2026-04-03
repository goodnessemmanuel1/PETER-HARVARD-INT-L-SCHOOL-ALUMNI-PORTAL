import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { alumniService, eventsService } from "../services/api";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import AlumniCard from "../components/AlumniCard";
import EventCard from "../components/EventCard";
import {
  GraduationCap,
  Users,
  CalendarDays,
  Star,
  ArrowRight,
  ClipboardList,
  CheckCircle,
  Search,
  Megaphone,
  LayoutDashboard,
  ChevronRight,
  MessageCircle,
  BookOpen,
  Images,
} from "lucide-react";

const WA_GROUP = "https://chat.whatsapp.com/BkEMJRD01MLCXzzGwCAgeJ";

function openWhatsApp(e) {
  e.preventDefault();
  const deep = WA_GROUP.replace("https://", "whatsapp://");
  const start = Date.now();
  window.location.href = deep;
  setTimeout(() => {
    if (Date.now() - start < 1500) window.open(WA_GROUP, "_blank");
  }, 800);
}

const features = [
  {
    icon: <ClipboardList size={22} />,
    title: "Alumni Registration",
    desc: "Sign up and create your alumni profile in minutes.",
  },
  {
    icon: <CheckCircle size={22} />,
    title: "Admin Approval",
    desc: "Admins review and approve registrations for a trusted community.",
  },
  {
    icon: <Search size={22} />,
    title: "Alumni Directory",
    desc: "Search graduates by name or graduation year.",
  },
  {
    icon: <Star size={22} />,
    title: "Featured Alumni",
    desc: "Showcase notable graduates and their achievements.",
  },
  {
    icon: <Megaphone size={22} />,
    title: "Events & Announcements",
    desc: "Stay updated with school news and upcoming events.",
  },
  {
    icon: <LayoutDashboard size={22} />,
    title: "Admin Dashboard",
    desc: "Central control panel for all admin operations.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    alumni: 0,
    years: 0,
    featured: 0,
    events: 0,
  });

  useEffect(() => {
    alumniService.getFeatured().then(({ data }) => setFeatured(data || []));
    eventsService
      .getAll()
      .then(({ data }) => setEvents((data || []).slice(0, 3)));
    async function loadStats() {
      const [alumniRes, featuredRes, eventsRes, yearsRes] = await Promise.all([
        supabase
          .from("alumni")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase
          .from("alumni")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved")
          .eq("featured", true),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase
          .from("alumni")
          .select("graduation_year")
          .eq("status", "approved"),
      ]);
      setStats({
        alumni: alumniRes.count || 0,
        featured: featuredRes.count || 0,
        events: eventsRes.count || 0,
        years: new Set((yearsRes.data || []).map((a) => a.graduation_year))
          .size,
      });
    }
    loadStats();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] flex items-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(255,255,255,0.07),transparent_65%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full flex justify-center">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Now Live
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.08] mb-6 tracking-tight"
            >
              Connect with your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-white">
                School Legacy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl"
            >
              The official Peter Harvard INT'L School Alumni Portal. Reconnect
              with old friends, stay updated on school news, and join a growing
              community of excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-50 font-bold px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl text-base"
              >
                <GraduationCap size={20} /> Join as Alumni
              </Link>
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-bold px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 text-base"
              >
                <Users size={20} /> Browse Directory
              </Link>
              <a
                href={WA_GROUP}
                onClick={openWhatsApp}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl text-base"
              >
                <MessageCircle size={20} /> WhatsApp Group
              </a>
            </motion.div>
          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 40C1200 38 1320 28 1380 23L1440 18V60H0Z"
              className="fill-white dark:fill-gray-950"
            />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Registered Alumni",
              value: stats.alumni,
              icon: <GraduationCap size={22} />,
              color: "text-primary-600 dark:text-primary-400",
              bg: "bg-primary-50 dark:bg-primary-900/20",
            },
            {
              label: "Grad Years",
              value: stats.years,
              icon: <CalendarDays size={22} />,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
              label: "Featured",
              value: stats.featured,
              icon: <Star size={22} />,
              color: "text-yellow-600 dark:text-yellow-400",
              bg: "bg-yellow-50 dark:bg-yellow-900/20",
            },
            {
              label: "Events",
              value: stats.events,
              icon: <Megaphone size={22} />,
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-50 dark:bg-green-900/20",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="card p-5 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}
              >
                {s.icon}
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Quick Links ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              to: "/directory",
              icon: <Users size={20} />,
              label: "Directory",
              color: "bg-primary-600",
            },
            {
              to: "/events",
              icon: <CalendarDays size={20} />,
              label: "Events",
              color: "bg-blue-600",
            },
            {
              to: "/gallery",
              icon: <Images size={20} />,
              label: "Gallery",
              color: "bg-purple-600",
            },
            {
              to: "/blog",
              icon: <BookOpen size={20} />,
              label: "Blog",
              color: "bg-green-600",
            },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`${l.color} text-white rounded-xl p-4 flex items-center gap-3 font-bold hover:opacity-90 hover:scale-105 transition-all shadow-md`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Alma Mater ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">
              Our Alma Mater
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
              Peter Harvard INT'L School —{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Responsibility and Excellence
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Founded by Dr. Peter Oyedotun Agunloye, Peter Harvard INT'L School
              has been a beacon of academic excellence and character development
              for over {new Date().getFullYear() - 2017} years. The school has
              produced graduates who have gone on to make significant
              contributions across various fields.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-primary-500 pl-4 mb-8">
              &ldquo;We are dedicated to raising confident and responsible
              students through quality education, strong moral values,
              creativity, and a global outlook that prepares them for the
              future.&rdquo;
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              This alumni portal is created to keep our school community
              connected. It provides a space for graduates to reconnect, share
              achievements, and continue contributing to the legacy of Peter
              Harvard INT'L School.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/about"
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <GraduationCap size={16} /> About the School
              </Link>
              <Link
                to="/register"
                className="btn-outline flex items-center gap-2 text-sm"
              >
                Join the Community
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              {
                label: "Years of Excellence",
                value: `${new Date().getFullYear() - 2017}+`,
                color: "bg-green-600",
              },
              {
                label: "Alumni Worldwide",
                value: `${stats.alumni}+`,
                color: "bg-blue-600",
              },
              {
                label: "Featured Graduates",
                value: `${stats.featured}+`,
                color: "bg-yellow-500",
              },
              {
                label: "School Events",
                value: `${stats.events}+`,
                color: "bg-primary-600",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.color} text-white rounded-2xl p-6 flex flex-col gap-2`}
              >
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-sm font-semibold opacity-80">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A full-featured platform built for the Peter Harvard INT'L School
              community.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Alumni ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Star size={26} className="text-yellow-500 fill-yellow-500" />{" "}
                Featured Alumni
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Spotlighting our notable graduates
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all"
              >
                Browse All <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.map((a) => (
              <motion.div key={a.id} variants={fadeUp}>
                <AlumniCard alumni={a} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Latest Events ── */}
      {events.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <CalendarDays size={26} className="text-primary-500" /> Latest
                  Events
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  What's happening in your school community
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all"
                >
                  View All <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((e) => (
                <motion.div key={e.id} variants={fadeUp}>
                  <EventCard event={e} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {!user && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                Ready to reconnect?
              </h2>
              <p className="text-lg text-white/75 mb-10 leading-relaxed">
                Join the growing network of Peter Harvard INT'L School alumni
                and keep the spirit of your alma mater alive.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-xl text-base"
                >
                  Register Now <ChevronRight size={18} />
                </Link>

                <a
                  href="https://chat.whatsapp.com/BkEMJRD01MLCXzzGwCAgeJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-xl text-base"
                >
                  <MessageCircle size={18} /> Join WhatsApp Group
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
