"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Eye, Search, ArrowUp } from "lucide-react";

// ============ DATA ============

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Live", href: "#live" },
  { label: "Shop", href: "#shop" },
  { label: "Streamers", href: "#streamers" },
  { label: "News", href: "#news" },
  { label: "Stats", href: "#stats" },
  { label: "Events", href: "#events" },
  { label: "Community", href: "#community" },
];

const STREAMERS = [
  { name: "Clix", viewers: "47.2K", mode: "Arena Duos", color: "from-purple-600 to-blue-600", emoji: "\ud83c\udfaf" },
  { name: "Faxuty", viewers: "23.1K", mode: "Ranked Solo", color: "from-cyan-600 to-teal-600", emoji: "\u26a1" },
  { name: "SypherPK", viewers: "31.8K", mode: "Battle Royale", color: "from-orange-600 to-red-600", emoji: "\ud83d\udd25" },
  { name: "Mongraal", viewers: "18.9K", mode: "FNCS Practice", color: "from-green-600 to-emerald-600", emoji: "\ud83c\udfc6" },
  { name: "NickEh30", viewers: "29.4K", mode: "Zero Build", color: "from-pink-600 to-rose-600", emoji: "\u2b50" },
  { name: "AsianJeff", viewers: "12.7K", mode: "Creative 2.0", color: "from-violet-600 to-purple-600", emoji: "\ud83c\udfae" },
];

const SHOP_ITEMS = [
  { name: "Galactic Storm", vbucks: 2000, rarity: "Legendary", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/40" },
  { name: "Neon Rider", vbucks: 1500, rarity: "Epic", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/40" },
  { name: "Ocean Surge", vbucks: 1200, rarity: "Rare", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/40" },
  { name: "Acid Dreams", vbucks: 800, rarity: "Uncommon", color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/40" },
  { name: "Phantom X", vbucks: 2000, rarity: "Legendary", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/40" },
  { name: "Cyber Punk", vbucks: 1500, rarity: "Epic", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/40" },
  { name: "Void Walker", vbucks: 1200, rarity: "Rare", color: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/40" },
  { name: "Solar Strike", vbucks: 500, rarity: "Common", color: "from-gray-500/20 to-slate-500/20", border: "border-gray-500/40" },
  { name: "Storm Rider", vbucks: 2000, rarity: "Legendary", color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/40" },
  { name: "Pixel Bash", vbucks: 1500, rarity: "Epic", color: "from-cyan-500/20 to-teal-500/20", border: "border-cyan-500/40" },
  { name: "Coral Knight", vbucks: 1200, rarity: "Rare", color: "from-red-500/20 to-rose-500/20", border: "border-red-500/40" },
  { name: "Ghost Rider", vbucks: 800, rarity: "Uncommon", color: "from-slate-500/20 to-zinc-500/20", border: "border-slate-500/40" },
];

const SHOP_EMOJIS = ["\ud83d\udc57", "\ud83c\udfae", "\ud83d\udde1\ufe0f", "\ud83d\udee1\ufe0f", "\u26a1", "\ud83d\udd25", "\ud83d\udcb8", "\ud83c\udf1f", "\ud83c\udfaf", "\ud83d\udc7e", "\ud83c\udfc6", "\ud83c\udf00"];

const NEWS_ITEMS = [
  { tag: "EPIC NEWS", title: "Chapter 7 Season 1: Pacific Break is HERE!", source: "Epic Games", date: "Mar 1", color: "bg-blue-500", leaked: false },
  { tag: "LEAKED", title: "New Collab Skins Found in v33.10 Files!", source: "HYPEX", date: "Mar 1", color: "bg-red-500", leaked: true },
  { tag: "UPDATE", title: "v33.10 Patch Notes - Performance Improvements", source: "Epic Games", date: "Feb 28", color: "bg-green-500", leaked: false },
  { tag: "LEAKED", title: "Leaked: New FNCS Finals Map Discovered", source: "ShiinaBR", date: "Feb 28", color: "bg-red-500", leaked: true },
  { tag: "COMMUNITY", title: "FortNite World Cup 2026 Registration Opens", source: "Epic Games", date: "Feb 27", color: "bg-purple-500", leaked: false },
  { tag: "LEAKED", title: "Upcoming Mythic Weapon Stats Revealed", source: "FNLeaksAndInfo", date: "Feb 27", color: "bg-red-500", leaked: true },
  { tag: "EPIC NEWS", title: "New Limited-Time Mode: Island Wars Announced", source: "Epic Games", date: "Feb 26", color: "bg-blue-500", leaked: false },
  { tag: "LEAKED", title: "New POI Spotted in Chapter 7 Map Files", source: "HYPEX", date: "Feb 26", color: "bg-red-500", leaked: true },
];

const EVENTS = [
  { name: "FNCS Finals", date: "March 15, 2026", prize: "$3,000,000", icon: "\ud83c\udfc6", color: "from-yellow-500/20 to-orange-500/20", days: 14, hours: 6, mins: 22 },
  { name: "Reload Cup", date: "March 8, 2026", prize: "$500,000", icon: "\u26a1", color: "from-cyan-500/20 to-blue-500/20", days: 7, hours: 2, mins: 45 },
  { name: "Festival Jam", date: "March 20, 2026", prize: "$100,000", icon: "\ud83c\udfb5", color: "from-pink-500/20 to-purple-500/20", days: 19, hours: 14, mins: 10 },
  { name: "Creative Showdown", date: "March 25, 2026", prize: "$250,000", icon: "\ud83c\udfae", color: "from-green-500/20 to-teal-500/20", days: 24, hours: 8, mins: 30 },
];

const TOP_STREAMERS = [
  { name: "Ninja", followers: "19.2M", status: "offline", region: "NA", platform: "Twitch" },
  { name: "Clix", followers: "3.1M", status: "online", region: "NA", platform: "Twitch" },
  { name: "Mongraal", followers: "2.8M", status: "online", region: "EU", platform: "Twitch" },
  { name: "SypherPK", followers: "5.4M", status: "online", region: "NA", platform: "Twitch" },
  { name: "Benjyfishy", followers: "2.1M", status: "offline", region: "EU", platform: "Twitch" },
  { name: "Bugha", followers: "4.7M", status: "online", region: "NA", platform: "Twitch" },
  { name: "Faxuty", followers: "1.2M", status: "online", region: "EU", platform: "Kick" },
  { name: "NickEh30", followers: "6.8M", status: "online", region: "NA", platform: "Twitch" },
];

const LEADERBOARD = [
  { rank: 1, name: "Bugha", wins: 1024, kd: 18.2, region: "NA" },
  { rank: 2, name: "Clix", wins: 987, kd: 16.8, region: "NA" },
  { rank: 3, name: "renflexEU", wins: 892, kd: 15.4, region: "EU" },
  { rank: 4, name: "VortexPro", wins: 856, kd: 24.7, region: "EU" },
  { rank: 5, name: "Storm_ASIA1", wins: 801, kd: 14.1, region: "ASIA" },
];

const STATS_CARDS = [
  { label: "Top EU Player", value: "renflexEU", stat: "892 Wins", icon: "\ud83c\udfc6", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30" },
  { label: "Top NA Player", value: "Bugha", stat: "1,024 Wins", icon: "\u2b50", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30" },
  { label: "Highest K/D", value: "VortexPro", stat: "K/D: 24.7", icon: "\ud83c\udfaf", color: "from-red-500/20 to-pink-500/20", border: "border-red-500/30" },
  { label: "Most Kills Game", value: "StormKing99", stat: "42 Kills", icon: "\u26a1", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30" },
  { label: "Top Creator", value: "NOVA-X Gaming", stat: "2.1B Plays", icon: "\ud83c\udfae", color: "from-green-500/20 to-teal-500/20", border: "border-green-500/30" },
  { label: "Global Players", value: "1.83M+", stat: "Right Now", icon: "\ud83c\udf0d", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30" },
];

const COMMUNITY_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  type: (["clip", "screenshot", "meme"] as const)[i % 3],
  emoji: ["\ud83c\udfae", "\ud83c\udfc6", "\ud83d\udd25", "\u26a1", "\ud83d\udca5", "\ud83c\udfaf", "\ud83c\udf1f", "\ud83d\udc7e", "\ud83d\udee1\ufe0f", "\ud83d\udde1\ufe0f", "\ud83d\udcb8", "\ud83c\udf00"][i],
  author: `Player${(i + 1) * 1337 % 9999}`,
  likes: (i + 1) * 317 % 5000 + 100,
}));

// ============ COMPONENTS ============

function ParticleBackground() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: ((i * 7) % 3) + 1,
    left: ((i * 13 + 7) % 100),
    top: ((i * 17 + 3) % 100),
    baseOpacity: ((i * 11) % 30) / 100 + 0.05,
    duration: ((i * 9) % 8) + 4,
    delay: ((i * 5) % 4),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, opacity: p.baseOpacity }}
          animate={{ y: [0, -30, 0], opacity: [p.baseOpacity, Math.min(p.baseOpacity * 3, 0.4), p.baseOpacity] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, #A100FF, #00F5FF, #39FF14)" }}
    />
  );
}

function Navbar({ onlineCount }: { onlineCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-4 rounded-2xl backdrop-blur-xl bg-black/70 border border-white/10 px-6">
        <div className="flex items-center justify-between h-14">
          <a href="#home" className="flex items-center gap-2">
            <span className="text-2xl">\u26cf\ufe0f</span>
            <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
              style={{ filter: "drop-shadow(0 0 8px rgba(161,0,255,0.5))" }}>
              FortNexus
            </span>
          </a>
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 font-medium">
                {link.label}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
              <motion.span className="w-2 h-2 rounded-full bg-green-400 inline-block"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              {onlineCount.toLocaleString()}
            </div>
            <a href="#" className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-sm font-semibold hover:bg-purple-600/50 transition-all">
              Discord
            </a>
            <a href="#" className="px-4 py-2 rounded-xl font-semibold text-sm text-black transition-all"
              style={{ background: "linear-gradient(135deg, #39FF14, #00FFB3)" }}>
              Play Fortnite
            </a>
          </div>
          <button className="lg:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mx-4 mt-2 rounded-2xl backdrop-blur-xl bg-black/90 border border-white/10 p-6">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                  onClick={() => setMenuOpen(false)}>{link.label}</a>
              ))}
              <div className="flex gap-3 mt-2">
                <a href="#" className="flex-1 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-sm font-semibold text-center">Discord</a>
                <a href="#" className="flex-1 py-2 rounded-xl text-sm font-semibold text-black text-center"
                  style={{ background: "linear-gradient(135deg, #39FF14, #00FFB3)" }}>Play</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection({ onlineCount }: { onlineCount: number }) {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-black" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(161,0,255,0.15) 0%, transparent 60%)" }} />
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-sm font-bold tracking-[0.3em] text-cyan-400 mb-4 uppercase">
            Chapter 7 \u2022 Season 1 \u2013 Pacific Break
          </div>
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none mb-4 text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #A100FF 0%, #00F5FF 50%, #39FF14 100%)", filter: "drop-shadow(0 0 40px rgba(161,0,255,0.6))" }}>
            FORT<br className="sm:hidden" />NEXUS
          </h1>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[0.2em] text-white/80 mb-6">
            WORLDWIDE FORTNITE HUB 2026
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-10">
            <motion.span className="w-2 h-2 rounded-full bg-green-400 inline-block"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span>{onlineCount.toLocaleString()} Players Online Right Now</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.a href="#shop" className="px-8 py-4 rounded-2xl font-black text-lg tracking-wider text-white"
              style={{ background: "linear-gradient(135deg, #A100FF, #00F5FF)" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(161,0,255,0.5)" }} whileTap={{ scale: 0.98 }}>
              VIEW ITEM SHOP
            </motion.a>
            <motion.a href="#live" className="px-8 py-4 rounded-2xl font-black text-lg tracking-wider border-2 border-cyan-400/50 text-cyan-400"
              whileHover={{ scale: 1.05, borderColor: "#00F5FF", boxShadow: "0 0 20px rgba(0,245,255,0.3)" }} whileTap={{ scale: 0.98 }}>
              WATCH LIVE STREAMS
            </motion.a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3">
          {[
            { icon: "\ud83c\udfc6", text: "FNCS Finals LIVE", color: "text-yellow-400" },
            { icon: "\u23f0", text: "Shop Reset in 2h 47m", color: "text-cyan-400" },
            { icon: "\ud83d\udd25", text: "New Skins Leaked", color: "text-red-400" },
          ].map((stat, i) => (
            <motion.div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10"
              animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
              <span>{stat.icon}</span>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
          <motion.div className="w-1.5 h-3 bg-cyan-400 rounded-full"
            animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}

function SectionHeader({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-3">{children}</h2>
      {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
    </motion.div>
  );
}

function LiveStreamsSection() {
  return (
    <section id="live" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.div className="w-4 h-4 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">LIVE ON TWITCH & KICK</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STREAMERS.map((streamer, i) => (
            <motion.div key={streamer.name}
              className="group rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,245,255,0.15)" }}>
              <div className={`relative h-48 bg-gradient-to-br ${streamer.color} flex items-center justify-center`}>
                <span className="text-7xl">{streamer.emoji}</span>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded-full">
                  <motion.div className="w-1.5 h-1.5 bg-white rounded-full"
                    animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full">
                  <Eye size={12} className="text-red-400" />
                  <span className="text-white text-xs font-bold">{streamer.viewers}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-white">{streamer.name}</h3>
                  <span className="text-xs text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-1 rounded-full">Twitch</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{streamer.mode}</p>
                <motion.a href="#" className="block w-full py-2 text-center rounded-xl font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #A100FF, #00F5FF)" }}
                  whileHover={{ boxShadow: "0 0 20px rgba(161,0,255,0.4)" }}>
                  Watch Stream
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ShopItem = typeof SHOP_ITEMS[number];

function ItemShopSection() {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [vbucks, setVbucks] = useState(0);

  useEffect(() => {
    const target = 13500;
    const step = target / 60;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setVbucks(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const rarityColors: Record<string, string> = {
    Legendary: "text-yellow-400",
    Epic: "text-purple-400",
    Rare: "text-blue-400",
    Uncommon: "text-green-400",
    Common: "text-gray-400",
  };

  return (
    <section id="shop" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
          <motion.div className="text-center sm:text-left" initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-1">
              TODAY&apos;S ITEM SHOP
            </h2>
          </motion.div>
          <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-xl">
            <span className="text-2xl">\ud83d\udd35</span>
            <span className="text-xl font-black text-white">{vbucks.toLocaleString()}</span>
            <span className="text-sm text-blue-400 font-bold">V-BUCKS</span>
          </div>
        </div>
        <p className="text-center text-gray-500 mb-8">March 1, 2026</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {SHOP_ITEMS.map((item, i) => (
            <motion.div key={item.name}
              className={`group rounded-2xl border cursor-pointer overflow-hidden bg-gradient-to-b ${item.color} ${item.border} p-4 flex flex-col gap-3 backdrop-blur-xl`}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(161,0,255,0.3)" }}
              onClick={() => setSelectedItem(item)}>
              <div className="h-20 flex items-center justify-center text-4xl">
                {SHOP_EMOJIS[i % SHOP_EMOJIS.length]}
              </div>
              <div>
                <p className="text-sm font-black text-white truncate">{item.name}</p>
                <p className={`text-xs font-bold ${rarityColors[item.rarity]}`}>{item.rarity}</p>
                <p className="text-sm font-bold text-blue-300 mt-1">\ud83d\udd35 {item.vbucks.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedItem && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div className="relative z-10 rounded-3xl backdrop-blur-xl bg-gray-900/90 border border-white/20 p-8 max-w-md w-full"
              initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setSelectedItem(null)}>
                <X size={24} />
              </button>
              <div className={`h-48 rounded-2xl bg-gradient-to-br ${selectedItem.color} flex items-center justify-center text-8xl mb-6`}>
                \ud83d\udcb8
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{selectedItem.name}</h3>
              <p className={`font-bold mb-4 ${rarityColors[selectedItem.rarity]}`}>{selectedItem.rarity}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-blue-300">\ud83d\udd35 {selectedItem.vbucks.toLocaleString()}</span>
                <motion.button className="px-6 py-3 rounded-xl font-black text-white"
                  style={{ background: "linear-gradient(135deg, #A100FF, #00F5FF)" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(161,0,255,0.5)" }}>
                  Purchase
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StreamersSection() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("ALL");
  const filtered = TOP_STREAMERS.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) && (region === "ALL" || s.region === region)
  );

  return (
    <section id="streamers" className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader subtitle="Find and follow the best Fortnite content creators">TOP STREAMERS</SectionHeader>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search streamers..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50" />
          </div>
          <select value={region} onChange={(e) => setRegion(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50">
            <option value="ALL" className="bg-gray-900">All Regions</option>
            <option value="NA" className="bg-gray-900">NA</option>
            <option value="EU" className="bg-gray-900">EU</option>
            <option value="ASIA" className="bg-gray-900">ASIA</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((streamer, i) => (
            <motion.div key={streamer.name}
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/40 p-6 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(161,0,255,0.15)" }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-2xl font-black text-white">
                    {streamer.name[0]}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${streamer.status === "online" ? "bg-green-400" : "bg-gray-500"}`} />
                </div>
                <div>
                  <h3 className="font-black text-white">{streamer.name}</h3>
                  <p className="text-sm text-gray-400">{streamer.followers} followers</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${streamer.status === "online" ? "bg-green-400/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                  {streamer.status === "online" ? "\ud83d\udfe2 LIVE" : "\u26ab Offline"}
                </span>
                <span className="text-xs text-gray-500 font-semibold">{streamer.region} \u2022 {streamer.platform}</span>
              </div>
              <motion.a href="#" className="block w-full py-2 text-center rounded-xl text-sm font-bold border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 transition-all"
                whileHover={{ boxShadow: "0 0 15px rgba(161,0,255,0.3)" }}>
                Watch Now
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  const [activeTab, setActiveTab] = useState<"latest" | "leaked">("latest");
  const filtered = NEWS_ITEMS.filter((n) => (activeTab === "latest" ? !n.leaked : n.leaked));

  return (
    <section id="news" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader subtitle="Stay updated with the latest Fortnite news and leaks">NEWS & LEAKS</SectionHeader>
        <div className="flex justify-center gap-2 mb-10">
          {(["latest", "leaked"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${activeTab === tab ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"}`}>
              {tab === "latest" ? "\ud83d\udcf0 Latest" : "\ud83d\udd13 Leaked"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <motion.div key={item.title}
              className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 overflow-hidden transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02 }}>
              <div className={`h-2 ${item.color}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${item.color} text-white`}>{item.tag}</span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <h3 className="font-black text-white mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-500">via {item.source}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="stats" className="py-24 px-4 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader subtitle="Top players and global statistics">GLOBAL STATS & LEADERBOARDS</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {STATS_CARDS.map((stat, i) => (
            <motion.div key={stat.label}
              className={`rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} backdrop-blur-xl p-6`}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,245,255,0.1)" }}>
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-cyan-400 font-bold">{stat.stat}</p>
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-black text-white">\ud83c\udfc6 Global Leaderboard \u2013 Top 5</h3>
          </div>
          <div className="divide-y divide-white/5">
            {LEADERBOARD.map((player) => (
              <div key={player.rank} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-black ${player.rank === 1 ? "text-yellow-400" : player.rank === 2 ? "text-gray-300" : player.rank === 3 ? "text-amber-600" : "text-gray-500"}`}>
                    #{player.rank}
                  </span>
                  <span className="font-bold text-white">{player.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-cyan-400 font-bold">{player.wins} wins</span>
                  <span className="text-purple-400 font-bold">{player.kd} K/D</span>
                  <span className="text-gray-500">{player.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  const [counts, setCounts] = useState(EVENTS.map((e) => ({ days: e.days, hours: e.hours, mins: e.mins, secs: 0 })));

  useEffect(() => {
    const timer = setInterval(() => {
      setCounts((prev) =>
        prev.map((c) => {
          let { days, hours, mins, secs } = c;
          if (days === 0 && hours === 0 && mins === 0 && secs === 0) return c;
          secs--;
          if (secs < 0) { secs = 59; mins--; }
          if (mins < 0) { mins = 59; hours--; }
          if (hours < 0) { hours = 23; days--; }
          return { days, hours, mins, secs };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="events" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader subtitle="Don\u2019t miss upcoming tournaments and in-game events">UPCOMING EVENTS</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {EVENTS.map((event, i) => (
            <motion.div key={event.name}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${event.color} backdrop-blur-xl p-6`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02 }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl">{event.icon}</span>
                  <h3 className="text-2xl font-black text-white mt-2">{event.name}</h3>
                  <p className="text-gray-400 text-sm">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
                  <p className="text-xl font-black text-yellow-400">{event.prize}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {(["days", "hours", "mins", "secs"] as const).map((unit) => (
                  <div key={unit} className="flex-1 bg-black/30 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-white">{String(counts[i][unit]).padStart(2, "0")}</div>
                    <div className="text-xs text-gray-500 capitalize">{unit}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section id="community" className="py-24 px-4 bg-gradient-to-b from-transparent via-green-950/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader subtitle="Epic moments from the FortNexus community">COMMUNITY GALLERY</SectionHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {COMMUNITY_ITEMS.map((item, i) => (
            <motion.div key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-green-400/40 aspect-video flex items-center justify-center cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(57,255,20,0.15)" }}>
              <span className="text-5xl">{item.emoji}</span>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <p className="text-white text-sm font-bold">@{item.author}</p>
                <p className="text-gray-300 text-xs">\u2764\ufe0f {item.likes.toLocaleString()}</p>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white capitalize">{item.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <motion.button className="px-8 py-3 rounded-2xl font-black text-green-400 border border-green-400/40"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(57,255,20,0.3)", backgroundColor: "rgba(57,255,20,0.1)" }}
            whileTap={{ scale: 0.98 }}>
            Load More
          </motion.button>
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLS = [
  { title: "Navigate", links: ["Home", "Live", "Shop", "Streamers"] },
  { title: "Explore", links: ["News", "Stats", "Events", "Community"] },
  { title: "Follow Us", links: ["Discord", "Twitter/X", "YouTube", "Instagram"] },
];

function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">\u26cf\ufe0f</span>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">FortNexus</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">The Ultimate Worldwide Fortnite Hub 2026. Made with \u2764\ufe0f for the Fortnite Community.</p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-black text-white mb-4 text-sm tracking-wider uppercase">{col.title}</h4>
              <div className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <a key={link} href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">\u00a9 2026 FortNexus. Not affiliated with Epic Games, Inc. Fortnite is a trademark of Epic Games, Inc.</p>
          <p className="text-xs text-gray-600">Built with Next.js 15 \u2022 Powered by the community</p>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN PAGE ============

export default function Home() {
  const [onlineCount, setOnlineCount] = useState(1834291);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 50) - 15);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-black min-h-screen text-white">
      <ScrollProgressBar />
      <ParticleBackground />
      <Navbar onlineCount={onlineCount} />
      <HeroSection onlineCount={onlineCount} />
      <LiveStreamsSection />
      <ItemShopSection />
      <StreamersSection />
      <NewsSection />
      <StatsSection />
      <EventsSection />
      <CommunitySection />
      <Footer />
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #A100FF, #00F5FF)", boxShadow: "0 0 20px rgba(161,0,255,0.5)" }}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(161,0,255,0.7)" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top">
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
