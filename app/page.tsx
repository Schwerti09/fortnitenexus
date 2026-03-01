"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Menu, X, Eye, ArrowUp, Zap, Trophy, ShoppingBag, Star, Send, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useChat } from "@ai-sdk/react";

// ============ CONSTANTS ============

const ONLINE_BASE = 2_418_291;

const NAV_LINKS = [
  { label: "🔴 LIVE", href: "#live" },
  { label: "SHOP", href: "#shop" },
  { label: "LEADERBOARDS", href: "#leaderboards" },
  { label: "CREATIVE", href: "#creative" },
  { label: "COMMUNITY", href: "#community" },
];

const TICKER_TEXT =
  "🔴 HYPEX: Skull Raider March Crew LIVE • Overwatch Collab 19. März • Peterbot #1 EU • Clix 18k LIVE • New Grace Ashcroft OUT NOW";

const TWITCH_STREAMERS = [
  { name: "clix", display: "Clix", viewers: "47.2K", channel: "clix" },
  { name: "sypherpk", display: "SypherPK", viewers: "31.8K", channel: "sypherpk" },
  { name: "mongraal", display: "Mongraal", viewers: "18.9K", channel: "mongraal" },
  { name: "nickeh30", display: "NickEh30", viewers: "29.4K", channel: "nickeh30" },
  { name: "faxuty", display: "faxuty", viewers: "23.1K", channel: "faxuty" },
  { name: "mrsavage", display: "MrSavage", viewers: "15.7K", channel: "mrsavage" },
  { name: "ninja", display: "Ninja", viewers: "42.1K", channel: "ninja" },
  { name: "fortnitegame", display: "Fortnite", viewers: "88.3K", channel: "fortnitegame" },
];

const SHOP_ITEMS = [
  { id: 1, name: "Galactic Storm", vbucks: 2000, rarity: "Legendary", emoji: "🌌", color: "from-yellow-500 to-orange-500", glow: "rgba(251,191,36,0.6)" },
  { id: 2, name: "Neon Rider", vbucks: 1500, rarity: "Epic", emoji: "⚡", color: "from-purple-500 to-violet-500", glow: "rgba(168,85,247,0.6)" },
  { id: 3, name: "Ocean Surge", vbucks: 1200, rarity: "Rare", emoji: "🌊", color: "from-blue-500 to-cyan-500", glow: "rgba(59,130,246,0.6)" },
  { id: 4, name: "Acid Dreams", vbucks: 800, rarity: "Uncommon", emoji: "🧪", color: "from-green-500 to-emerald-500", glow: "rgba(34,197,94,0.6)" },
  { id: 5, name: "Phantom X", vbucks: 2000, rarity: "Legendary", emoji: "👻", color: "from-amber-500 to-yellow-500", glow: "rgba(245,158,11,0.6)" },
  { id: 6, name: "Cyber Punk", vbucks: 1500, rarity: "Epic", emoji: "🤖", color: "from-pink-500 to-rose-500", glow: "rgba(236,72,153,0.6)" },
  { id: 7, name: "Void Walker", vbucks: 1200, rarity: "Rare", emoji: "🕳️", color: "from-indigo-500 to-blue-500", glow: "rgba(99,102,241,0.6)" },
  { id: 8, name: "Solar Strike", vbucks: 500, rarity: "Common", emoji: "☀️", color: "from-gray-500 to-slate-500", glow: "rgba(107,114,128,0.6)" },
  { id: 9, name: "Storm Rider", vbucks: 2000, rarity: "Legendary", emoji: "⛈️", color: "from-yellow-500 to-amber-500", glow: "rgba(234,179,8,0.6)" },
  { id: 10, name: "Pixel Bash", vbucks: 1500, rarity: "Epic", emoji: "🎮", color: "from-cyan-500 to-teal-500", glow: "rgba(6,182,212,0.6)" },
  { id: 11, name: "Coral Knight", vbucks: 1200, rarity: "Rare", emoji: "🪸", color: "from-red-500 to-rose-500", glow: "rgba(239,68,68,0.6)" },
  { id: 12, name: "Ghost Rider", vbucks: 800, rarity: "Uncommon", emoji: "💀", color: "from-slate-500 to-zinc-500", glow: "rgba(100,116,139,0.6)" },
  { id: 13, name: "Dark Matter", vbucks: 2000, rarity: "Legendary", emoji: "🌑", color: "from-purple-600 to-black", glow: "rgba(147,51,234,0.6)" },
  { id: 14, name: "Frost Nova", vbucks: 1500, rarity: "Epic", emoji: "❄️", color: "from-sky-400 to-blue-600", glow: "rgba(56,189,248,0.6)" },
  { id: 15, name: "Blaze Runner", vbucks: 1200, rarity: "Rare", emoji: "🔥", color: "from-orange-500 to-red-600", glow: "rgba(249,115,22,0.6)" },
  { id: 16, name: "Neon Shadow", vbucks: 800, rarity: "Uncommon", emoji: "🌃", color: "from-violet-500 to-purple-700", glow: "rgba(139,92,246,0.6)" },
  { id: 17, name: "Crystal Core", vbucks: 2000, rarity: "Legendary", emoji: "💎", color: "from-teal-400 to-cyan-600", glow: "rgba(20,184,166,0.6)" },
  { id: 18, name: "Thunder Bolt", vbucks: 1500, rarity: "Epic", emoji: "⚡", color: "from-yellow-400 to-amber-600", glow: "rgba(250,204,21,0.6)" },
  { id: 19, name: "Star Chaser", vbucks: 1200, rarity: "Rare", emoji: "⭐", color: "from-fuchsia-500 to-pink-600", glow: "rgba(217,70,239,0.6)" },
  { id: 20, name: "Iron Titan", vbucks: 500, rarity: "Common", emoji: "🤖", color: "from-gray-400 to-zinc-600", glow: "rgba(156,163,175,0.6)" },
  { id: 21, name: "Lava King", vbucks: 2000, rarity: "Legendary", emoji: "🌋", color: "from-red-600 to-orange-700", glow: "rgba(220,38,38,0.6)" },
  { id: 22, name: "Shadow Ops", vbucks: 1500, rarity: "Epic", emoji: "🥷", color: "from-gray-700 to-slate-900", glow: "rgba(55,65,81,0.6)" },
  { id: 23, name: "Aqua Force", vbucks: 800, rarity: "Uncommon", emoji: "💧", color: "from-blue-400 to-teal-500", glow: "rgba(96,165,250,0.6)" },
  { id: 24, name: "Hyper Nova", vbucks: 2000, rarity: "Legendary", emoji: "💥", color: "from-fuchsia-500 to-violet-600", glow: "rgba(192,38,211,0.6)" },
  { id: 25, name: "Cryo Tech", vbucks: 1200, rarity: "Rare", emoji: "🧊", color: "from-sky-300 to-indigo-500", glow: "rgba(125,211,252,0.6)" },
  { id: 26, name: "Ember Strike", vbucks: 1500, rarity: "Epic", emoji: "🔥", color: "from-amber-400 to-red-500", glow: "rgba(251,191,36,0.6)" },
  { id: 27, name: "Midnight Ace", vbucks: 800, rarity: "Uncommon", emoji: "🌙", color: "from-blue-900 to-indigo-800", glow: "rgba(30,64,175,0.6)" },
  { id: 28, name: "Solar Flare", vbucks: 2000, rarity: "Legendary", emoji: "🌞", color: "from-yellow-500 to-red-500", glow: "rgba(234,179,8,0.6)" },
  { id: 29, name: "Venom Surge", vbucks: 1200, rarity: "Rare", emoji: "🐍", color: "from-green-600 to-lime-500", glow: "rgba(22,163,74,0.6)" },
  { id: 30, name: "Arc Reactor", vbucks: 1500, rarity: "Epic", emoji: "⚛️", color: "from-cyan-400 to-blue-500", glow: "rgba(34,211,238,0.6)" },
  { id: 31, name: "Chaos Nova", vbucks: 2000, rarity: "Legendary", emoji: "🌀", color: "from-indigo-600 to-purple-700", glow: "rgba(79,70,229,0.6)" },
  { id: 32, name: "Prism Light", vbucks: 500, rarity: "Common", emoji: "🔆", color: "from-white/20 to-gray-400", glow: "rgba(255,255,255,0.4)" },
  { id: 33, name: "Titan Rush", vbucks: 1200, rarity: "Rare", emoji: "🏃", color: "from-orange-400 to-yellow-500", glow: "rgba(251,146,60,0.6)" },
  { id: 34, name: "Phantom Ops", vbucks: 1500, rarity: "Epic", emoji: "👁️", color: "from-violet-700 to-purple-900", glow: "rgba(109,40,217,0.6)" },
  { id: 35, name: "Blizzard Fox", vbucks: 800, rarity: "Uncommon", emoji: "🦊", color: "from-orange-300 to-red-400", glow: "rgba(253,186,116,0.6)" },
  { id: 36, name: "Galaxy Burst", vbucks: 2000, rarity: "Legendary", emoji: "🌠", color: "from-blue-600 to-purple-700", glow: "rgba(37,99,235,0.6)" },
];

const PRO_PRODUCTS = [
  {
    id: "pro",
    name: "PRO MEMBERSHIP",
    price: "$4.99",
    period: "/month",
    description: "Full access to all FortNexus premium features",
    features: ["Early Leaks 24h vor allen", "Ad-Free + AI Oracle unlimited", "Private Discord + Coaching"],
    color: "from-purple-600 to-cyan-600",
    glow: "rgba(161,0,255,0.5)",
    popular: true,
    emoji: "👑",
  },
];

const EU_LEADERBOARD = [
  { rank: 1, name: "Peterbot", wins: "2.847", region: "EU" },
  { rank: 2, name: "Clix", wins: "2.134", region: "EU" },
  { rank: 3, name: "faxuty", wins: "1.987", region: "EU" },
];

const NA_LEADERBOARD = [
  { rank: 1, name: "SypherPK", kd: "14.8", region: "NA" },
  { rank: 2, name: "NickEh30", kd: "12.3", region: "NA" },
];

const CREATIVE_MAPS = [
  { name: "Realistic 1v1 / 4v4", code: "7950-6306-4857", emoji: "⚔️" },
  { name: "Sniper One Shot", code: "6078-7811-0032", emoji: "🎯" },
];

// ============ UTILS ============

function triggerConfetti() {
  if (typeof window === "undefined") return;
  import("canvas-confetti").then((module) => {
    const confetti = module.default;
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: object) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#A100FF", "#00F5FF", "#FF0099"] });
    fire(0.2, { spread: 60, colors: ["#FFD700", "#FF6B35", "#A100FF"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#00F5FF", "#FF0099", "#A100FF"] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#FFD700", "#00F5FF"] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ["#FF0099", "#A100FF", "#00F5FF"] });
  });
}

// ============ HOOKS ============

function useLiveCounter(base: number) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => Math.max(base, prev + Math.floor(Math.random() * 50) - 15));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

// ============ COMPONENTS ============

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, #A100FF, #00F5FF, #FF0099)" }}
    />
  );
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    const colors = ["#A100FF", "#00F5FF", "#FF0099", "#FFD700", "#39FF14"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.4 }} />;
}

function Navbar({ onlineCount }: { onlineCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProClick = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: "pro", productName: "FortNexus Pro Membership" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <nav
      className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl" : ""}`}
      style={{ background: scrolled ? "rgba(0,0,0,0.85)" : "transparent", borderBottom: scrolled ? "1px solid rgba(161,0,255,0.2)" : "none" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.a
          href="#home"
          className="flex items-center gap-2 font-black text-xl"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-2xl">🎡</span>
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #A100FF, #00F5FF)" }}>
            FortNexus
          </span>
        </motion.a>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400">{onlineCount.toLocaleString()} online</span>
          </div>

          <motion.button
            onClick={handleProClick}
            className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-full text-sm font-black text-black"
            style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(161,0,255,0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Star size={14} />
            PRO $4.99
          </motion.button>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
            style={{ background: "rgba(0,0,0,0.95)", borderColor: "rgba(161,0,255,0.2)" }}
          >
            <div className="flex flex-col p-4 gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 w-fit">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-green-400">{onlineCount.toLocaleString()} online</span>
              </div>
              <motion.button
                onClick={handleProClick}
                className="flex items-center justify-center gap-1 px-4 py-2 rounded-full text-sm font-black text-black w-full"
                style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Star size={14} />
                GO PRO
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============ NEWS TICKER ============

function NewsTicker() {
  return (
    <div className="relative w-full overflow-hidden bg-black/60 border-y border-white/10 py-2 z-40">
      <div className="flex gap-0 whitespace-nowrap" style={{ animation: "tickerScroll 30s linear infinite" }}>
        <span className="pr-16 text-sm font-semibold text-gray-300">{TICKER_TEXT}</span>
        <span className="pr-16 text-sm font-semibold text-gray-300">{TICKER_TEXT}</span>
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ============ HERO SECTION ============

function HeroSection() {
  const handleShopClick = useCallback(() => {
    triggerConfetti();
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4 pt-20"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(161,0,255,0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, rgba(0,245,255,0.10) 0%, transparent 60%)",
        }}
      />
      <motion.div
        className="text-8xl mb-6 z-10"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        🚌
      </motion.div>
      <motion.h1
        className="text-6xl md:text-8xl font-black tracking-tighter z-10 mb-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textShadow: "0 0 60px rgba(161,0,255,0.8), 0 0 120px rgba(0,245,255,0.4)" }}
      >
        <span
          className="text-transparent bg-clip-text"
          style={{ backgroundImage: "linear-gradient(135deg, #A100FF, #00F5FF, #FF0099)" }}
        >
          FORTNITE
        </span>
        <br />
        <span className="text-white/90 text-3xl md:text-5xl tracking-tight font-black">
          CARNIVAL 2026
        </span>
      </motion.h1>
      <motion.p
        className="text-gray-300 text-lg md:text-xl max-w-2xl z-10 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Chapter 7 • Pacific Break | The Ultimate Worldwide Fortnite Hub 2026
      </motion.p>
      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 z-10 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={handleShopClick}
          className="px-8 py-4 rounded-full text-lg font-black text-black"
          style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
          whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(161,0,255,0.7)" }}
          whileTap={{ scale: 0.96 }}
        >
          SHOP JETZT EXPLODIEREN 💥
        </motion.button>
        <motion.a
          href="#live"
          className="px-8 py-4 rounded-full text-lg font-black border-2 border-cyan-400 text-cyan-400"
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 30px rgba(0,245,255,0.5)",
            backgroundColor: "rgba(0,245,255,0.1)",
          }}
          whileTap={{ scale: 0.96 }}
        >
          🔴 LIVE STREAMS
        </motion.a>
      </motion.div>
      <motion.div
        className="flex flex-wrap justify-center gap-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {[
          { icon: "🏆", label: "FNCS Finals live" },
          { icon: "🕒", label: "Shop Reset in 2h 47m" },
          { icon: "🔥", label: "Neue Skins leaked" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10"
          >
            <span>{stat.icon}</span>
            <span className="text-sm font-semibold text-gray-300">{stat.label}</span>
          </div>
        ))}
      </motion.div>
      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ChevronRight size={28} className="text-cyan-400 rotate-90" />
      </motion.div>
    </section>
  );
}

// ============ LIVE STREAMS ============

function LiveStreamsSection() {
  return (
    <section id="live" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-black">
            LIVE AUF TWITCH &amp; KICK – CARNIVAL STAGE
          </h2>
        </motion.div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {TWITCH_STREAMERS.map((s, i) => (
            <motion.div
              key={s.name}
              className="flex-shrink-0 w-72 rounded-2xl overflow-hidden glass border border-white/10"
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,245,255,0.2)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center">
                <span className="text-5xl">🎮</span>
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
                <div className="absolute top-2 right-2 text-xs bg-black/70 text-gray-300 px-2 py-0.5 rounded">
                  <Eye size={12} className="inline mr-1" />
                  {s.viewers}
                </div>
              </div>
              <div className="p-4">
                <p className="font-black text-white text-lg">{s.display}</p>
                <p className="text-gray-400 text-sm mt-1">FNCS • Pacific Break</p>
                <a
                  href={`https://twitch.tv/${s.channel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center py-2 rounded-lg text-sm font-bold text-black"
                  style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
                >
                  Watch Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ ITEM SHOP ============

function ItemShopSection() {
  const [selectedItem, setSelectedItem] = useState<(typeof SHOP_ITEMS)[0] | null>(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(SHOP_ITEMS.length / itemsPerPage);
  const visible = SHOP_ITEMS.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const rarityBorder: Record<string, string> = {
    Legendary: "border-yellow-500/60",
    Epic: "border-purple-500/60",
    Rare: "border-blue-500/60",
    Uncommon: "border-green-500/60",
    Common: "border-gray-500/60",
  };

  return (
    <section id="shop" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-black">TODAY&apos;S CARNIVAL SHOP</h2>
            <p className="text-gray-400 text-sm mt-1">01.03.2026 • Daily Rotation</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-500/40">
            <span className="text-yellow-400 text-xl">⚡</span>
            <span className="font-black text-yellow-400">
              V-BUCKS: {SHOP_ITEMS.reduce((a, b) => a + b.vbucks, 0).toLocaleString()}
            </span>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 ${rarityBorder[item.rarity] ?? "border-white/10"} glass`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.07, boxShadow: `0 0 30px ${item.glow}` }}
              onClick={() => setSelectedItem(item)}
            >
              <div
                className={`aspect-square bg-gradient-to-br ${item.color} flex items-center justify-center`}
              >
                <span className="text-4xl">{item.emoji}</span>
              </div>
              <div className="p-2">
                <p className="font-bold text-xs text-white truncate">{item.name}</p>
                <p className="text-yellow-400 text-xs font-black">⚡ {item.vbucks.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{item.rarity}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-8">
          <motion.button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-full glass border border-white/10 disabled:opacity-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <span className="text-gray-400 text-sm">
            {page + 1} / {totalPages}
          </span>
          <motion.button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-full glass border border-white/10 disabled:opacity-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="relative rounded-3xl glass border border-white/10 p-8 max-w-sm w-full"
              style={{ boxShadow: `0 0 80px ${selectedItem.glow}` }}
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setSelectedItem(null)}
              >
                <X size={24} />
              </button>
              <div
                className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${selectedItem.color} flex items-center justify-center mb-6`}
              >
                <span className="text-8xl">{selectedItem.emoji}</span>
              </div>
              <h3 className="text-2xl font-black mb-1">{selectedItem.name}</h3>
              <p className="text-gray-400 mb-2">{selectedItem.rarity} Outfit</p>
              <div className="flex items-center gap-2 text-yellow-400 font-black text-xl mb-6">
                <span>⚡</span>
                <span>{selectedItem.vbucks.toLocaleString()} V-Bucks</span>
              </div>
              <motion.button
                className="w-full py-3 rounded-full font-black text-black"
                style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  triggerConfetti();
                  setSelectedItem(null);
                }}
              >
                BUY NOW 🛒
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============ LEAKS ============

function CommunitySection() {
  const clips = [
    { id: 1, title: "Insane Box Fight Clutch", author: "VortexPro", views: "2.3M", emoji: "🎬" },
    { id: 2, title: "200IQ Build Play", author: "StormRider", views: "1.8M", emoji: "🏗️" },
    { id: 3, title: "Snipe of the Year", author: "SniperGod_NA", views: "4.1M", emoji: "🎯" },
    { id: 4, title: "Last Circle 1v3 Win", author: "Bugha", views: "3.5M", emoji: "🏆" },
  ];

  return (
    <section id="community" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-black mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          COMMUNITY CLIPS – VIRAL MOMENTS
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {clips.map((clip, i) => (
            <motion.div
              key={clip.id}
              className="rounded-2xl glass border border-white/10 overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,245,255,0.2)" }}
            >
              <div className="aspect-video bg-gradient-to-br from-purple-900/60 to-cyan-900/60 flex items-center justify-center">
                <span className="text-5xl">{clip.emoji}</span>
              </div>
              <div className="p-4">
                <p className="font-black text-white text-sm mb-1">{clip.title}</p>
                <p className="text-gray-400 text-xs">by {clip.author}</p>
                <p className="text-cyan-400 text-xs font-bold mt-1">👁 {clip.views} views</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ LEADERBOARDS ============

function LeaderboardSection() {
  return (
    <section id="leaderboards" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-black mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          GLOBAL LEADERBOARDS 🔥
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="rounded-2xl glass border border-white/10 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                EU WINS THIS WEEK
              </h3>
            </div>
            <ul className="divide-y divide-white/5">
              {EU_LEADERBOARD.map((p) => (
                <li key={p.rank} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-black"
                      style={{
                        background: p.rank === 1
                          ? "linear-gradient(135deg,#FFD700,#FF8C00)"
                          : p.rank === 2
                          ? "linear-gradient(135deg,#C0C0C0,#A0A0A0)"
                          : "linear-gradient(135deg,#CD7F32,#A0522D)",
                      }}
                    >
                      {p.rank}
                    </span>
                    <span className="font-bold text-white">{p.name}</span>
                  </div>
                  <span className="font-black text-cyan-400">{p.wins} Wins</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="rounded-2xl glass border border-white/10 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Trophy size={20} className="text-purple-400" />
                NA K/D THIS SEASON
              </h3>
            </div>
            <ul className="divide-y divide-white/5">
              {NA_LEADERBOARD.map((p) => (
                <li key={p.rank} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-black"
                      style={{
                        background: p.rank === 1
                          ? "linear-gradient(135deg,#FFD700,#FF8C00)"
                          : "linear-gradient(135deg,#C0C0C0,#A0A0A0)",
                      }}
                    >
                      {p.rank}
                    </span>
                    <span className="font-bold text-white">{p.name}</span>
                  </div>
                  <span className="font-black text-purple-400">{p.kd} K/D</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ CREATIVE HUB ============

function CreativeSection() {
  return (
    <section id="creative" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-black mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          CREATIVE CARNIVAL HUB – BEST MAPS RIGHT NOW
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CREATIVE_MAPS.map((map, i) => (
            <motion.div
              key={map.code}
              className="rounded-2xl glass border border-white/10 p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(161,0,255,0.2)" }}
            >
              <div className="text-4xl mb-4">{map.emoji}</div>
              <h3 className="font-black text-xl text-white mb-2">{map.name}</h3>
              <p className="text-cyan-400 font-mono text-sm mb-4">{map.code}</p>
              <motion.button
                className="px-6 py-2 rounded-full font-black text-sm text-black"
                style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                PLAY NOW
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PRO SECTION ============

function ProSection() {
  const handlePurchase = useCallback(async (productId: string, productName: string) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: productId, productName }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <section id="pro" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">Werde FortNexus PRO</h2>
          <p className="text-gray-400 text-lg">Unlock the full FortNexus experience</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto gap-6">
          {PRO_PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              className="relative rounded-3xl glass border border-purple-500/50 p-8"
              style={{ boxShadow: `0 0 50px ${product.glow}` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-4xl mb-4">{product.emoji}</div>
              <h3 className="font-black text-xl mb-1">{product.name}</h3>
              <ul className="space-y-3 mb-8">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Zap size={14} className="text-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                className={`w-full py-3 rounded-full font-black text-sm text-black bg-gradient-to-r ${product.color}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handlePurchase(product.id, product.name)}
              >
                JETZT PRO $4.99/MO – 7 Tage gratis
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ AI ORACLE ============

function AIOracle() {
  const { messages, sendMessage, status } = useChat();
  const [oracleInput, setOracleInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOracleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oracleInput.trim() || isLoading) return;
    sendMessage({ text: oracleInput });
    setOracleInput("");
  };

  return (
    <section id="oracle" className="py-20 px-4 relative">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">FORTNEXUS AI ORACLE 🔮</h2>
          <p className="text-gray-400">Powered by Gemini • Ask anything about Fortnite</p>
        </motion.div>
        <motion.div
          className="rounded-3xl glass border border-purple-500/30 overflow-hidden"
          style={{ boxShadow: "0 0 60px rgba(161,0,255,0.15)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-80 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <span className="text-5xl">🔮</span>
                <p className="text-gray-400 text-sm">
                  Ask the Oracle about strategies, skins, loadouts, and more!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Best loadout rn?", "Which skin to buy?", "How to win FNCS?"].map((s) => (
                    <button
                      key={s}
                      className="px-3 py-1 rounded-full text-xs glass border border-purple-500/30 text-purple-300 hover:border-purple-400 transition-colors"
                      onClick={() => setOracleInput(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => {
              const textContent = msg.parts
                .filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("");
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-xl flex-shrink-0">🔮</span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "text-black font-semibold"
                        : "glass border border-white/10 text-gray-200"
                    }`}
                    style={
                      msg.role === "user"
                        ? { background: "linear-gradient(90deg, #A100FF, #00F5FF)" }
                        : {}
                    }
                  >
                    {textContent}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <span className="text-xl">🔮</span>
                <div className="glass border border-white/10 rounded-2xl px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-purple-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-white/10 p-4">
            <form onSubmit={handleOracleSubmit} className="flex gap-3">
              <input
                value={oracleInput}
                onChange={(e) => setOracleInput(e.target.value)}
                placeholder="Ask the Oracle... 🎮"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition-colors"
              />
              <motion.button
                type="submit"
                disabled={isLoading || !oracleInput.trim()}
                className="p-3 rounded-full text-black disabled:opacity-40"
                style={{ background: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ FOOTER ============

function Footer() {
  const cols = [
    {
      title: "Navigation",
      links: [
        { label: "🔴 LIVE", href: "#live" },
        { label: "SHOP", href: "#shop" },
        { label: "LEADERBOARDS", href: "#leaderboards" },
        { label: "CREATIVE", href: "#creative" },
        { label: "COMMUNITY", href: "#community" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Discord", href: "#" },
        { label: "Twitter / X", href: "#" },
        { label: "YouTube", href: "#" },
        { label: "TikTok", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Settings", href: "#" },
      ],
    },
  ];

  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 font-black text-lg mb-4">
              <span>🎡</span>
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #A100FF, #00F5FF)" }}
              >
                FortNexus
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              The Ultimate Worldwide Fortnite Hub 2026
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-black text-sm text-gray-400 mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-gray-500 hover:text-cyan-400 text-sm transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            Made with ❤️ for the Fortnite Community • Not affiliated with Epic Games
          </p>
          <p className="text-gray-600 text-xs">© 2026 FortNexus • All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

// ============ VICTORY ROYALE TOAST ============

function VictoryRoyaleToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-black"
          style={{
            background: "linear-gradient(90deg, #FFD700, #FF8C00)",
            boxShadow: "0 0 40px rgba(255,215,0,0.5)",
          }}
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Trophy size={24} />
          <span className="text-lg">VICTORY ROYALE!</span>
          <button
            onClick={() => setVisible(false)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ BACK TO TOP ============

function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-black flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #A100FF, #00F5FF)",
            boxShadow: "0 0 20px rgba(161,0,255,0.5)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.15, boxShadow: "0 0 30px rgba(161,0,255,0.8)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ============ HOME ============

export default function Home() {
  const onlineCount = useLiveCounter(ONLINE_BASE);

  return (
    <main className="bg-black min-h-screen text-white">
      <ScrollProgressBar />
      <ParticleBackground />
      <Navbar onlineCount={onlineCount} />
      <NewsTicker />
      <HeroSection />
      <LiveStreamsSection />
      <ItemShopSection />
      <LeaderboardSection />
      <CreativeSection />
      <CommunitySection />
      <ProSection />
      <AIOracle />
      <Footer />
      <VictoryRoyaleToast />
      <BackToTopButton />
    </main>
  );
}
