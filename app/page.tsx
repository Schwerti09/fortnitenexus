"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Menu, X, Eye, ArrowUp, Zap, Trophy, ShoppingBag, Star, Send, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useChat } from "@ai-sdk/react";

// ============ CONSTANTS ============

const ONLINE_BASE = 1_834_291;

const NAV_LINKS = [
  { label: "Live", href: "#live" },
  { label: "Shop", href: "#shop" },
  { label: "Leaks", href: "#leaks" },
  { label: "Stats", href: "#stats" },
  { label: "Events", href: "#events" },
];

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

const LEAKS = [
  { id: 1, source: "HYPEX", title: "New Collab Skins Found in v33.10 Files!", content: "Massive collab incoming — files spotted in the latest update. Could be the biggest one yet this season!", emoji: "🔥", tag: "SKIN LEAK", date: "Feb 28", hot: true },
  { id: 2, source: "ShiinaBR", title: "Upcoming Chapter 7 Map POI Revealed", content: "New named location spotted in map files. Looks like a massive futuristic city biome replacing the current POI.", emoji: "🗺️", tag: "MAP LEAK", date: "Feb 28", hot: true },
  { id: 3, source: "HYPEX", title: "New Mythic Weapon Stats Found", content: "A brand new Mythic item is coming with insane stats. Here's everything we know from the game files.", emoji: "⚔️", tag: "WEAPON LEAK", date: "Feb 27", hot: false },
  { id: 4, source: "FNLeaksAndInfo", title: "New LTM Details Extracted", content: "A new limited-time mode called 'Chaos Protocol' was found with full ruleset in v33.10 files.", emoji: "🎮", tag: "MODE LEAK", date: "Feb 27", hot: true },
  { id: 5, source: "ShiinaBR", title: "FNCS 2026 Finals Map Leaked", content: "The official FNCS 2026 World Cup Finals map has been found in the game files ahead of the official reveal.", emoji: "🏆", tag: "ESPORTS LEAK", date: "Feb 26", hot: false },
  { id: 6, source: "HYPEX", title: "New Emote Pack With Music", content: "A bundle of 5 new emotes with custom music tracks was found. One appears to be a collab with a major artist.", emoji: "🎵", tag: "COSMETIC LEAK", date: "Feb 26", hot: false },
  { id: 7, source: "iFireMonkey", title: "Augments Returning Next Season", content: "Reality Augments are making a comeback in Chapter 7 Season 2 based on string data found in the files.", emoji: "⚡", tag: "GAMEPLAY LEAK", date: "Feb 25", hot: true },
  { id: 8, source: "ShiinaBR", title: "New Vehicle Type Found in Files", content: "A new driveable vehicle was discovered — appears to be a futuristic hovercraft with a weapon mount.", emoji: "🚗", tag: "VEHICLE LEAK", date: "Feb 25", hot: false },
  { id: 9, source: "HYPEX", title: "Possible New Season Teaser Art", content: "Unannounced season teaser artwork was found embedded in UI assets. Chapter 7 Season 2 looks insane.", emoji: "🌄", tag: "SEASON LEAK", date: "Feb 24", hot: true },
  { id: 10, source: "FNLeaksAndInfo", title: "New NPC Quests & Dialogue", content: "Several new NPC characters with unique quests and storyline dialogue were found in the latest build.", emoji: "💬", tag: "STORY LEAK", date: "Feb 24", hot: false },
  { id: 11, source: "ShiinaBR", title: "Festival Season Pass Tracks", content: "10 new Festival tracks were found in the files, including one that's likely for an upcoming event.", emoji: "🎸", tag: "FESTIVAL LEAK", date: "Feb 23", hot: false },
  { id: 12, source: "HYPEX", title: "New UEFN Tools & Assets Drop", content: "Major UEFN update assets found — Creative mode is getting a massive toolset expansion soon.", emoji: "🛠️", tag: "CREATIVE LEAK", date: "Feb 23", hot: true },
];

const LEADERBOARD = [
  { rank: 1, name: "Bugha", wins: 1024, kd: 18.2, region: "NA", color: "from-yellow-500 to-orange-500" },
  { rank: 2, name: "Clix", wins: 987, kd: 16.8, region: "NA", color: "from-gray-400 to-gray-300" },
  { rank: 3, name: "renflexEU", wins: 892, kd: 15.4, region: "EU", color: "from-orange-600 to-yellow-700" },
  { rank: 4, name: "VortexPro", wins: 856, kd: 24.7, region: "EU", color: "from-blue-500 to-cyan-500" },
  { rank: 5, name: "Storm_ASIA1", wins: 801, kd: 14.1, region: "ASIA", color: "from-purple-500 to-violet-500" },
  { rank: 6, name: "NightFox99", wins: 756, kd: 13.9, region: "NA", color: "from-green-500 to-teal-500" },
  { rank: 7, name: "PrismBR", wins: 712, kd: 12.7, region: "EU", color: "from-pink-500 to-rose-500" },
  { rank: 8, name: "KaosX_OCE", wins: 689, kd: 19.3, region: "OCE", color: "from-red-500 to-orange-500" },
  { rank: 9, name: "TacticalEU", wins: 657, kd: 11.8, region: "EU", color: "from-indigo-500 to-blue-500" },
  { rank: 10, name: "SniperGod_NA", wins: 634, kd: 15.6, region: "NA", color: "from-teal-500 to-cyan-500" },
];

const PRO_PRODUCTS = [
  {
    id: "pro",
    name: "PRO MEMBERSHIP",
    price: "$9.99",
    period: "/month",
    description: "Full access to all FortNexus premium features",
    features: ["Ad-free experience", "Advanced stats & analytics", "Early leak access", "Discord VIP role", "Custom profile badge", "Priority AI Oracle access"],
    color: "from-purple-600 to-cyan-600",
    glow: "rgba(161,0,255,0.5)",
    popular: true,
    emoji: "👑",
  },
  {
    id: "coaching",
    name: "PRO COACHING",
    price: "$49.99",
    period: "/session",
    description: "1-on-1 session with a top Fortnite pro player",
    features: ["60-min coaching session", "VOD review included", "Custom improvement plan", "Private Discord access", "Follow-up Q&A", "Ranked push guarantee"],
    color: "from-yellow-500 to-orange-500",
    glow: "rgba(245,158,11,0.5)",
    popular: false,
    emoji: "🎯",
  },
  {
    id: "guide",
    name: "STRATEGY GUIDE",
    price: "$19.99",
    period: "/lifetime",
    description: "Ultimate Chapter 7 strategy guide PDF + video series",
    features: ["120+ page PDF guide", "10 strategy videos", "Map control secrets", "Meta weapon loadouts", "Building & editing drills", "Regular updates"],
    color: "from-green-500 to-teal-500",
    glow: "rgba(34,197,94,0.5)",
    popular: false,
    emoji: "📚",
  },
];

const EVENTS = [
  { name: "FNCS Finals 2026", date: "March 15, 2026", prize: "$3,000,000", icon: "🏆", color: "from-yellow-500/30 to-orange-500/30", border: "border-yellow-500/40", days: 14, hours: 6, mins: 22 },
  { name: "Reload Cup", date: "March 8, 2026", prize: "$500,000", icon: "⚡", color: "from-cyan-500/30 to-blue-500/30", border: "border-cyan-500/40", days: 7, hours: 2, mins: 45 },
  { name: "Festival Jam", date: "March 20, 2026", prize: "$100,000", icon: "🎵", color: "from-pink-500/30 to-purple-500/30", border: "border-pink-500/40", days: 19, hours: 14, mins: 10 },
  { name: "Creative Showdown", date: "March 25, 2026", prize: "$250,000", icon: "🎮", color: "from-green-500/30 to-teal-500/30", border: "border-green-500/40", days: 24, hours: 8, mins: 30 },
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
          <span className="text-2xl">⛏️</span>
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
            PRO
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

export default function Home() {
  const onlineCount = useLiveCounter(ONLINE_BASE);

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar onlineCount={onlineCount} />
    </main>
  );
}
