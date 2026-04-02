import { useState, useEffect, useRef } from "react";
import music from "./assets/music.mp3";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
function useStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Great+Vibes&family=Cinzel:wght@400;500;600;700;900&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
      html { scroll-behavior:smooth; }
      body { background:#FDFAF7; color:#6B4A10; overflow-x:hidden; font-family:'Cormorant',serif; }
      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-thumb { background:linear-gradient(#C8960C,#B8A89A); border-radius:2px; }

      @keyframes fadeUp     { from{opacity:0;transform:translateY(48px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
      @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes floatX     { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
      @keyframes scaleIn    { from{opacity:0;transform:scale(.78)} to{opacity:1;transform:scale(1)} }
      @keyframes drawLine   { from{stroke-dashoffset:400} to{stroke-dashoffset:0} }
      @keyframes petalSpin  { 0%{transform:translateY(-8vh) rotate(0deg) scale(1);opacity:.85}
                              100%{transform:translateY(108vh) rotate(540deg) scale(.3);opacity:0} }
      @keyframes shimmer    { 0%,100%{opacity:.7} 50%{opacity:1} }
      @keyframes mapBounce  { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-12px)} 65%{transform:translateY(-5px)} }
      @keyframes rippleOut  { from{transform:scale(.5);opacity:.7} to{transform:scale(3);opacity:0} }
      @keyframes borderGlow { 0%,100%{box-shadow:0 0 18px #C8960C20} 50%{box-shadow:0 0 38px #C8960C45,0 8px 40px #C8960C18} }
      @keyframes omGlow     { 0%,100%{filter:drop-shadow(0 0 6px #C8960C50)} 50%{filter:drop-shadow(0 0 22px #C8960C)} }
      @keyframes musicPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      @keyframes waveBar    { 0%,100%{transform:scaleY(.3)} 50%{transform:scaleY(1)} }
      @keyframes rotateNote { 0%{transform:rotate(-5deg)} 100%{transform:rotate(5deg)} }

      .reveal     { opacity:0; transform:translateY(50px); transition:opacity .9s ease, transform .9s ease; }
      .reveal.in  { opacity:1; transform:translateY(0); }
      .revL       { opacity:0; transform:translateX(-52px); transition:opacity .85s ease, transform .85s ease; }
      .revL.in    { opacity:1; transform:translateX(0); }
      .revR       { opacity:0; transform:translateX(52px);  transition:opacity .85s ease, transform .85s ease; }
      .revR.in    { opacity:1; transform:translateX(0); }

      .italic-bold { font-style:italic; font-weight:700; }
      .script-name { font-family:'Great Vibes',cursive; }
      .serif-title { font-family:'Playfair Display',serif; }
      .fell-italic { font-family:'IM Fell English',serif; font-style:italic; }

      @media(max-width:768px){
        .desktop-only{ display:none!important; }
        .venue-grid { grid-template-columns:1fr!important; }
        .date-row   { flex-direction:column!important; gap:20px!important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────────── */
function useReveal(ref) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal,.revL,.revR");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.14 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─────────────────────────────────────────────
   WATERCOLOR FLOWER SVG
───────────────────────────────────────────── */
function FlowerCluster({ x = 0, y = 0, scale = 1, flip = false, rotate = 0 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale}) rotate(${rotate})`}>
      <g opacity=".82">
        <ellipse cx="38" cy="55" rx="28" ry="22" fill="#C9A7C2" opacity=".35" transform="rotate(-20,38,55)"/>
        <ellipse cx="22" cy="40" rx="22" ry="16" fill="#D4B5CE" opacity=".45" transform="rotate(15,22,40)"/>
        <ellipse cx="52" cy="38" rx="20" ry="15" fill="#C2A0BA" opacity=".4"  transform="rotate(-35,52,38)"/>
        <ellipse cx="38" cy="25" rx="18" ry="14" fill="#D8BDD3" opacity=".42" transform="rotate(25,38,25)"/>
        <ellipse cx="15" cy="58" rx="16" ry="13" fill="#C5A8BF" opacity=".38" transform="rotate(-10,15,58)"/>
        <circle cx="38" cy="42" r="10" fill="#6B3A4A" opacity=".5"/>
        <circle cx="38" cy="42" r="6"  fill="#4A2030" opacity=".55"/>
        <circle cx="38" cy="42" r="3"  fill="#8B5060" opacity=".6"/>
        <ellipse cx="90" cy="30" rx="25" ry="18" fill="#E8B4B8" opacity=".4"  transform="rotate(20,90,30)"/>
        <ellipse cx="78" cy="18" rx="20" ry="14" fill="#F0C4C8" opacity=".42" transform="rotate(-15,78,18)"/>
        <ellipse cx="105" cy="18" rx="19" ry="13" fill="#E4B0B4" opacity=".38" transform="rotate(40,105,18)"/>
        <ellipse cx="90" cy="10" rx="17" ry="12" fill="#F4C8CC" opacity=".4"  transform="rotate(-25,90,10)"/>
        <circle cx="90" cy="25" r="9"  fill="#7A3840" opacity=".48"/>
        <circle cx="90" cy="25" r="5"  fill="#5A2830" opacity=".55"/>
        <circle cx="90" cy="25" r="2.5" fill="#9A5060" opacity=".6"/>
        <ellipse cx="130" cy="62" rx="23" ry="17" fill="#B8B0D8" opacity=".38" transform="rotate(-30,130,62)"/>
        <ellipse cx="118" cy="50" rx="18" ry="13" fill="#C4BCE0" opacity=".42" transform="rotate(20,118,50)"/>
        <ellipse cx="142" cy="50" rx="17" ry="12" fill="#B4ACC4" opacity=".4"  transform="rotate(-15,142,50)"/>
        <ellipse cx="130" cy="42" rx="16" ry="11" fill="#C8C0D8" opacity=".38" transform="rotate(10,130,42)"/>
        <circle cx="130" cy="57" r="8"  fill="#5A4870" opacity=".48"/>
        <circle cx="130" cy="57" r="4.5" fill="#3A2850" opacity=".52"/>
        <circle cx="130" cy="57" r="2"  fill="#8A78A0" opacity=".58"/>
        <ellipse cx="62" cy="14" rx="11" ry="16" fill="#D4B8D0" opacity=".52" transform="rotate(-5,62,14)"/>
        <ellipse cx="66" cy="12" rx="7"  ry="10" fill="#B89AB4" opacity=".48" transform="rotate(5,66,12)"/>
        <ellipse cx="162" cy="38" rx="9" ry="13" fill="#C8C0D0" opacity=".48"/>
        <ellipse cx="165" cy="36" rx="5.5" ry="8" fill="#A090B0" opacity=".45"/>
        <path d="M 38 68 Q 30 88 18 110 Q 10 130 8 160" stroke="#8BA870" strokeWidth="2.5" fill="none" opacity=".55"/>
        <path d="M 90 40 Q 85 62 80 85 Q 75 110 72 140"  stroke="#8BA870" strokeWidth="2"   fill="none" opacity=".5"/>
        <path d="M 130 72 Q 125 92 120 115 Q 115 138 112 165" stroke="#8BA870" strokeWidth="2.2" fill="none" opacity=".52"/>
        <ellipse cx="28" cy="95"  rx="14" ry="8" fill="#7AAA68" opacity=".42" transform="rotate(-35,28,95)"/>
        <ellipse cx="76" cy="72"  rx="12" ry="7" fill="#8AB878" opacity=".4"  transform="rotate(25,76,72)"/>
        <ellipse cx="116" cy="95" rx="13" ry="7.5" fill="#7AAA68" opacity=".38" transform="rotate(-20,116,95)"/>
      </g>
      <ellipse cx="55"  cy="85"  rx="28" ry="18" fill="#E8C4D0" opacity=".12" transform="rotate(-15)"/>
      <ellipse cx="95"  cy="65"  rx="22" ry="14" fill="#C8B8D8" opacity=".1"/>
      {[[35,130],[55,145],[75,125],[95,150],[115,135]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r={2+(i%3)} fill="#8BA870" opacity=".28"/>
      ))}
    </g>
  );
}

/* ─────────────────────────────────────────────
   MUSIC PLAYER
───────────────────────────────────────────── */
function MusicPlayer() {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play()
      .then(() => {
        setPlaying(true);
        setStarted(true);
      })
      .catch(err => console.log(err));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={music} loop />

      {/* 🔥 ENTRY SCREEN */}
      {!started && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "#000000cc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999
        }}>
          <button onClick={startMusic} style={{
            padding: "16px 28px",
            fontSize: 18,
            background: "#C8960C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}>
            Megala Weds Mani
          </button>
        </div>
      )}

      {/* 🔥 CONTROL BUTTON */}
      {started && (
      <button
  onClick={toggle}
  title={playing ? "Pause Music" : "Play Music"}
  style={{
    position: "fixed",
    bottom: 28,
    right: 28,
    zIndex: 9999,
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "1.5px solid #C8960C60",
    background: "rgba(253,250,247,0.92)",
    backdropFilter: "blur(12px)",
    boxShadow: playing
      ? "0 0 0 6px #C8960C18, 0 8px 32px #C8960C40"
      : "0 4px 24px #C8960C25",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  }}
>
  {playing ? (
    <div style={{ display: "flex", gap: 3, height: 22 }}>
      {[1,2,3,4,5].map((_, i) => (
        <div key={i} style={{
          width: 3,
          height: 18,
          borderRadius: 2,
          background: "linear-gradient(to top, #8B6000, #C8960C)",
          transformOrigin: "bottom",
          animation: `waveBar ${0.6 + i * 0.12}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  ) : (
    <div style={{
      fontSize: 22,
      color: "#8B6000",
      transform: "translateX(2px)"
    }}>
      ▶
    </div>
  )}
</button>
      )}
    </>
  );
}
/* ─────────────────────────────────────────────
   OM SYMBOL
───────────────────────────────────────────── */
function OmSymbol({ size = 52 }) {
  return (
    <div style={{
      textAlign: "center",
      fontSize: size,
      color: "#8B6000",
      fontFamily: "serif",
      lineHeight: 1,
      animation: "omGlow 3s ease-in-out infinite",
      filter: "drop-shadow(0 2px 8px #C8960C30)",
    }}>ॐ</div>
  );
}

/* ─────────────────────────────────────────────
   GOLD DIVIDER
───────────────────────────────────────────── */
function GoldDivider({ width = "100%", style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, ...style }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,#C8960C60)" }} />
      <svg width="22" height="22" viewBox="0 0 22 22">
        <path d="M 11 1 L 13.5 8.5 L 21 11 L 13.5 13.5 L 11 21 L 8.5 13.5 L 1 11 L 8.5 8.5 Z"
          fill="#C8960C" opacity=".8"/>
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,#C8960C60)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FALLING PETALS
───────────────────────────────────────────── */
function FallingPetals() {
  const petals = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    left: `${(i * 1619 + 80) % 100}%`,
    delay: `${(i * .7) % 10}s`,
    dur: `${7 + (i % 5) * .9}s`,
    size: 8 + (i % 4) * 4,
    color: ["#E8B4C0","#D4B5CE","#C9A7C2","#F0C4C8","#B8B0D8","#E8C4D0"][i % 6],
    rot: i * 43,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {petals.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: p.left, top: "-20px",
          width: p.size, height: p.size * .65,
          borderRadius: "50% 0 50% 50%",
          background: p.color, opacity: .65,
          transform: `rotate(${p.rot}deg)`,
          animation: `petalSpin ${p.dur} linear ${p.delay} infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection({ scrollY }) {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const parallaxBg  = scrollY * .35;
  const parallaxFl  = scrollY * .18;
  const parallaxTxt = scrollY * .22;
  const opacity     = Math.max(0, 1 - scrollY / (vh * .85));

  return (
    <section style={{
      height: "100vh", minHeight: 700,
      position: "relative", overflow: "hidden",
      background: "linear-gradient(170deg,#FDFAF7 0%,#FAF5F0 40%,#F8F0F0 70%,#F5F0F8 100%)",
    }}>
      {/* Background watercolor wash */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        transform: `translateY(${parallaxBg}px)`,
      }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="120" cy="280" rx="220" ry="160" fill="#F0D0D8" opacity=".18" transform="rotate(-15,120,280)"/>
          <ellipse cx="880" cy="350" rx="200" ry="140" fill="#D8CCE8" opacity=".16" transform="rotate(20,880,350)"/>
          <ellipse cx="500" cy="600" rx="350" ry="120" fill="#F0D8C8" opacity=".14"/>
          <ellipse cx="200" cy="600" rx="160" ry="80"  fill="#E8D0D8" opacity=".12"/>
          <ellipse cx="800" cy="120" rx="180" ry="90"  fill="#D8D0E8" opacity=".12"/>
        </svg>
      </div>

      {/* Flower clusters */}
      <div style={{ position: "absolute", top: -30, left: -30, transform: `translateY(${parallaxFl * 1.1}px)`, pointerEvents: "none" }}>
        <svg width="340" height="320" viewBox="0 0 200 200"><FlowerCluster x={-10} y={-20} scale={1.35}/></svg>
      </div>
      <div style={{ position: "absolute", top: -30, right: -30, transform: `translateY(${parallaxFl * .9}px)`, pointerEvents: "none" }}>
        <svg width="320" height="300" viewBox="0 0 200 200"><FlowerCluster x={220} y={-20} scale={1.3} flip/></svg>
      </div>
      <div style={{ position: "absolute", bottom: -20, right: -20, transform: `translateY(${-parallaxFl * .6}px)`, pointerEvents: "none" }}>
        <svg width="260" height="240" viewBox="0 0 200 200"><FlowerCluster x={220} y={30} scale={1.15} flip rotate={10}/></svg>
      </div>

      {/* Center content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 20px",
        transform: `translateY(${parallaxTxt}px)`,
        opacity, zIndex: 2,
      }}>
        <div style={{ marginBottom: 18, animation: "fadeUp .9s ease .1s both" }}>
          <OmSymbol size={58} />
        </div>

        {/* Invite text — IM Fell italic for elegance */}
        <p style={{
          fontFamily: "'IM Fell English',serif",
          fontStyle: "italic",
          fontSize: "clamp(15px,2.2vw,21px)",
          color: "#7A5200",
          lineHeight: 1.8,
          marginBottom: 28,
          animation: "fadeUp .9s ease .22s both",
          letterSpacing: ".02em",
        }}>
          <em>JK Family invites you to join and celebrate</em><br/>
          <strong style={{ fontStyle: "italic", fontWeight: 700 }}>the Sacred Marriage of</strong>
        </p>

        <GoldDivider style={{ width: "min(340px,82vw)", marginBottom: 26, animation: "fadeIn 1.1s ease .3s both" }} />

        {/* Bride Name — Playfair Display bold italic */}
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(40px,8.5vw,96px)",
          fontWeight: 900,
          fontStyle: "italic",
          color: "#7A4F00",
          letterSpacing: "0.02em",
          lineHeight: .95,
          marginBottom: 8,
          textShadow: "0 2px 28px #C8960C28, 2px 4px 0 #C8960C15",
          animation: "fadeUp .9s ease .38s both",
        }}>MEGALA J</h1>

        <p style={{
          fontFamily: "'Cormorant',serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(16px,2.6vw,24px)",
          color: "#8B6000",
          marginBottom: 24,
          animation: "fadeUp .9s ease .46s both",
        }}>
          <em>Lovely Daughter of </em>
          <strong style={{ fontStyle: "italic", color: "#6B4A10" }}>S. Jayakumar &amp; J. Chandrakala</strong>
        </p>

        {/* "with" — Great Vibes script */}
        <p style={{
          fontFamily: "'Great Vibes',cursive",
          fontSize: "clamp(28px,4.5vw,48px)",
          color: "#C8960C",
          marginBottom: 20,
          animation: "fadeUp .9s ease .52s both",
          filter: "drop-shadow(0 1px 6px #C8960C30)",
        }}>with</p>

        {/* Groom Name */}
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(40px,8.5vw,96px)",
          fontWeight: 900,
          fontStyle: "italic",
          color: "#7A4F00",
          letterSpacing: "0.02em",
          lineHeight: .95,
          marginBottom: 8,
          textShadow: "0 2px 28px #C8960C28, 2px 4px 0 #C8960C15",
          animation: "fadeUp .9s ease .6s both",
        }}>MANI S</h1>

        <p style={{
          fontFamily: "'Cormorant',serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(16px,2.6vw,24px)",
          color: "#8B6000",
          marginBottom: 30,
          animation: "fadeUp .9s ease .68s both",
        }}>
          <em>Dear Son of </em>
          <strong style={{ fontStyle: "italic", color: "#6B4A10" }}>S. Jayashankar &amp; S. Chamundeshwari</strong>
        </p>

        <GoldDivider style={{ width: "min(340px,82vw)", marginBottom: 22, animation: "fadeIn 1.1s ease .72s both" }} />

        {/* Scroll hint */}
        <div style={{ marginTop: 12, animation: "fadeIn 1.2s ease 1.2s both" }}>
          <p style={{
            fontFamily: "'Cormorant',serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "#C8960C90",
            letterSpacing: 3,
            marginBottom: 8,
          }}>scroll to celebrate</p>
          <svg width="18" height="28" viewBox="0 0 18 28" style={{ animation: "floatY 2s ease-in-out infinite" }}>
            <path d="M 9 0 L 9 20 M 3 14 L 9 20 L 15 14"
              stroke="#C8960C" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   DATE & TIME SECTION
───────────────────────────────────────────── */
function DateSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{
      background: "linear-gradient(180deg,#FDFAF7 0%,#FAF5F2 100%)",
      padding: "80px 24px 70px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", bottom: -40, left: -40, pointerEvents: "none", opacity: .65 }}>
        <svg width="240" height="220" viewBox="0 0 200 200"><FlowerCluster x={-20} y={20} scale={1.05} rotate={15}/></svg>
      </div>
      <div style={{ position: "absolute", top: -30, right: -30, pointerEvents: "none", opacity: .6 }}>
        <svg width="200" height="180" viewBox="0 0 200 200"><FlowerCluster x={210} y={-10} scale={1} flip rotate={-10}/></svg>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Section tag */}
        <p className="reveal" style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11, letterSpacing: 7,
          color: "#C8960C", textTransform: "uppercase", marginBottom: 10,
        }}>The Auspicious Day</p>

        {/* "on" in Playfair italic */}
        <h2 className="reveal" style={{
          fontFamily: "'Playfair Display',serif",
          fontStyle: "italic",
          fontSize: "clamp(26px,5vw,50px)",
          color: "#7A4F00", marginBottom: 8, fontWeight: 700,
        }}>on</h2>

        {/* Date row */}
        <div className="date-row reveal" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "clamp(20px,5vw,64px)", margin: "28px 0 36px",
        }}>
          {/* APRIL */}
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "min(160px,38vw)", height: 1, background: "#C8960C", marginBottom: 12 }}/>
            <p style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "clamp(18px,3.5vw,28px)",
              fontWeight: 700, color: "#7A4F00", letterSpacing: 5,
            }}>APRIL</p>
            <div style={{ width: "min(160px,38vw)", height: 1, background: "#C8960C", marginTop: 12 }}/>
            <p style={{
              fontFamily: "'Great Vibes',cursive",
              fontSize: "clamp(18px,2.8vw,24px)",
              color: "#8B6000", marginTop: 14,
            }}>Muhurtham</p>
            <p style={{
              fontFamily: "'Cormorant',serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(18px,2.8vw,23px)",
              color: "#5A3800", marginTop: 4,
            }}>9:00 AM</p>
          </div>

          {/* Big date */}
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(72px,15vw,136px)",
              fontWeight: 900, fontStyle: "italic",
              color: "#7A4F00", lineHeight: .9,
              textShadow: "0 4px 32px #C8960C28",
              animation: "shimmer 3s ease-in-out infinite",
            }}>23</p>
            <p style={{
              fontFamily: "'Cinzel',serif",
              fontWeight: 700,
              fontSize: "clamp(18px,3vw,26px)",
              color: "#C8960C", letterSpacing: 4, marginTop: 10,
            }}>2026</p>
          </div>

          {/* THURSDAY */}
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "min(160px,38vw)", height: 1, background: "#C8960C", marginBottom: 12 }}/>
            <p style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "clamp(12px,2.5vw,20px)",
              fontWeight: 700, color: "#7A4F00", letterSpacing: 3,
            }}>THURSDAY</p>
            <div style={{ width: "min(160px,38vw)", height: 1, background: "#C8960C", marginTop: 12 }}/>
            <p style={{
              fontFamily: "'Great Vibes',cursive",
              fontSize: "clamp(18px,2.8vw,24px)",
              color: "#8B6000", marginTop: 14,
            }}>Reception</p>
            <p style={{
              fontFamily: "'Cormorant',serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(18px,2.8vw,23px)",
              color: "#5A3800", marginTop: 4,
            }}>12:30 PM</p>
          </div>
        </div>

        <GoldDivider className="reveal" style={{ marginBottom: 36 }} />
        <CountdownTimer targetDate="2026-04-23T09:00:00"/>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COUNTDOWN TIMER
───────────────────────────────────────────── */
function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setTime({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items = [
    { label: "Days",    value: time.days  },
    { label: "Hours",   value: time.hours },
    { label: "Minutes", value: time.mins  },
    { label: "Seconds", value: time.secs  },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px,3vw,36px)", flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <div key={i} style={{
          textAlign: "center",
          background: "#FFFFFF",
          border: "1px solid #C8960C30",
          padding: "clamp(14px,3vw,22px) clamp(18px,4vw,34px)",
          animation: "borderGlow 3s ease-in-out infinite",
          animationDelay: `${i * .4}s`,
          minWidth: 78,
        }}>
          <p style={{
            fontFamily: "'Playfair Display',serif",
            fontWeight: 900,
            fontSize: "clamp(28px,5.5vw,50px)",
            color: "#7A4F00", lineHeight: 1,
          }}>{String(item.value).padStart(2, "0")}</p>
          <p style={{
            fontFamily: "'Cinzel',serif",
            fontWeight: 600,
            fontSize: "clamp(9px,1.4vw,12px)",
            letterSpacing: 3, color: "#C8960C",
            textTransform: "uppercase", marginTop: 7,
          }}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COUPLE SECTION
───────────────────────────────────────────── */
function CoupleSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section ref={ref} style={{
      background: "linear-gradient(170deg,#FAF5F2 0%,#F8F0F0 50%,#F5F0F8 100%)",
      padding: "80px 24px 80px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "20%", right: -20, pointerEvents: "none", opacity: .5 }}>
        <svg width="180" height="200" viewBox="0 0 200 200"><FlowerCluster x={210} y={10} scale={.9} flip/></svg>
      </div>
      <div style={{ position: "absolute", bottom: "5%", left: -20, pointerEvents: "none", opacity: .5 }}>
        <svg width="180" height="200" viewBox="0 0 200 200"><FlowerCluster x={-15} y={10} scale={.9}/></svg>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p className="reveal" style={{
          fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: 6,
          color: "#C8960C", textTransform: "uppercase", marginBottom: 14,
        }}>The Blessed Union</p>
        <h2 className="reveal" style={{
          fontFamily: "'Playfair Display',serif",
          fontStyle: "italic",
          fontSize: "clamp(26px,5vw,46px)",
          color: "#7A4F00", marginBottom: 40, fontWeight: 800,
        }}>The Families</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "clamp(20px,4vw,56px)", alignItems: "start" }}>
          {/* Bride */}
          <div className="revL" style={{ textAlign: "center" }}>
            <div style={{
              width: 82, height: 82, borderRadius: "50%",
              background: "linear-gradient(135deg,#F0D8E0,#E8C4D0)",
              border: "2px solid #C8960C30",
              margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
            }}>🌸</div>
            <h3 style={{
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontSize: "clamp(22px,4vw,38px)",
              color: "#7A4F00", marginBottom: 10, fontWeight: 800,
            }}>Megala J</h3>
            <p style={{
              fontFamily: "'Cormorant',serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(16px,2.4vw,21px)",
              color: "#5A3800", lineHeight: 1.8,
            }}>
              <em>Lovely Daughter of</em><br/>
              <strong style={{ fontStyle: "italic", color: "#7A4F00" }}>S. Jayakumar</strong><br/>
              <em>&amp;</em> <strong style={{ fontStyle: "italic", color: "#7A4F00" }}>J. Chandrakala</strong>
            </p>
          </div>

          {/* Center heart */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 20 }}>
            <div style={{ width: 1, height: 50, background: "#C8960C40" }} />
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "1.5px solid #C8960C50",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cormorant',serif",
              fontStyle: "italic", fontSize: 22, color: "#C8960C",
            }}>♥</div>
            <div style={{ width: 1, height: 50, background: "#C8960C40" }} />
          </div>

          {/* Groom */}
          <div className="revR" style={{ textAlign: "center" }}>
            <div style={{
              width: 82, height: 82, borderRadius: "50%",
              background: "linear-gradient(135deg,#D8D0E8,#C8C0D8)",
              border: "2px solid #C8960C30",
              margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
            }}>🪷</div>
            <h3 style={{
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontSize: "clamp(22px,4vw,38px)",
              color: "#7A4F00", marginBottom: 10, fontWeight: 800,
            }}>Mani S</h3>
            <p style={{
              fontFamily: "'Cormorant',serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(16px,2.4vw,21px)",
              color: "#5A3800", lineHeight: 1.8,
            }}>
              <em>Dear Son of</em><br/>
              <strong style={{ fontStyle: "italic", color: "#7A4F00" }}>S. Jayashankar</strong><br/>
              <em>&amp;</em> <strong style={{ fontStyle: "italic", color: "#7A4F00" }}>S. Chamundeshwari</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   VENUE SECTION
───────────────────────────────────────────── */
function VenueSection() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useReveal(ref);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setReady(true); }, { threshold: .25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      background: "linear-gradient(180deg,#F5F0F8 0%,#FAF5F2 100%)",
      padding: "80px 24px 80px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", opacity: .45 }}>
        <svg width="600" height="120" viewBox="0 0 600 120">
          {[0,120,240,360,480].map((x,i) => (
            <g key={i} transform={`translate(${x},0) scale(${i%2?-1:1},1) scale(.48)`}>
              <FlowerCluster x={60} y={-60} scale={.85}/>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p className="reveal" style={{
            fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: 6,
            color: "#C8960C", textTransform: "uppercase", marginBottom: 14,
          }}>Venue</p>
          <h2 className="reveal" style={{
            fontFamily: "'Playfair Display',serif",
            fontStyle: "italic",
            fontSize: "clamp(26px,5vw,46px)",
            color: "#7A4F00", marginBottom: 10, fontWeight: 800,
          }}>The Celebration</h2>
          <GoldDivider className="reveal" style={{ maxWidth: 320, margin: "0 auto" }} />
        </div>

        <div className="venue-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(28px,5vw,60px)", alignItems: "start",
        }}>
          {/* Details */}
          <div className="revL">
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #C8960C28",
              borderLeft: "3px solid #C8960C",
              padding: "clamp(20px,3vw,30px) clamp(22px,3.5vw,34px)",
              marginBottom: 22,
              animation: "borderGlow 4s ease-in-out infinite",
            }}>
              <p style={{
                fontFamily: "'Cinzel',serif", fontSize: 10,
                letterSpacing: 4, color: "#C8960C",
                textTransform: "uppercase", marginBottom: 12,
              }}>📍 Venue</p>
              <h3 style={{
                fontFamily: "'Playfair Display',serif",
                fontStyle: "italic",
                fontSize: "clamp(18px,2.8vw,26px)",
                color: "#7A4F00", fontWeight: 800, lineHeight: 1.3,
              }}>
                Sasthapuri Hotels<br/>&amp; Resorts
              </h3>
              <p style={{
                fontFamily: "'Cormorant',serif",
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(17px,2.5vw,21px)",
                color: "#8B6000", marginTop: 6,
              }}>Gudalur, Tamil Nadu</p>
            </div>

            <div style={{
              background: "#FFFFFF",
              border: "1px solid #C8960C28",
              borderLeft: "3px solid #8B9A70",
              padding: "clamp(18px,2.5vw,26px) clamp(22px,3.5vw,34px)",
              marginBottom: 22,
            }}>
              <p style={{
                fontFamily: "'Cinzel',serif", fontSize: 10,
                letterSpacing: 4, color: "#8B9A70",
                textTransform: "uppercase", marginBottom: 8,
              }}>🕯️ Muhurtham</p>
              <p style={{
                fontFamily: "'Cormorant',serif",
                fontSize: "clamp(19px,3vw,26px)",
                fontWeight: 600,
                color: "#6B4A10", lineHeight: 1.5,
              }}>
                <strong>Thursday · 23 April 2026</strong><br/>
                <span style={{ fontStyle: "italic", color: "#8B6000", fontWeight: 500 }}>9:00 AM</span>
              </p>
            </div>

            <div style={{
              background: "#FFFFFF",
              border: "1px solid #C8960C28",
              borderLeft: "3px solid #B8A0B8",
              padding: "clamp(18px,2.5vw,26px) clamp(22px,3.5vw,34px)",
              marginBottom: 28,
            }}>
              <p style={{
                fontFamily: "'Cinzel',serif", fontSize: 10,
                letterSpacing: 4, color: "#B8A0B8",
                textTransform: "uppercase", marginBottom: 8,
              }}>🌹 Reception</p>
              <p style={{
                fontFamily: "'Cormorant',serif",
                fontSize: "clamp(19px,3vw,26px)",
                fontWeight: 600,
                color: "#6B4A10", lineHeight: 1.5,
              }}>
                <strong>Same Day</strong><br/>
                <span style={{ fontStyle: "italic", color: "#8B6000", fontWeight: 500 }}>12:30 PM onwards</span>
              </p>
            </div>

            <button
              onClick={() => window.open("https://maps.google.com/?q=Sasthapuri+Hotels+Resorts+Gudalur", "_blank")}
              style={{
                display: "block", width: "100%",
                fontFamily: "'Cinzel',serif",
                fontSize: "clamp(11px,1.6vw,13px)",
                fontWeight: 700,
                letterSpacing: 4, textTransform: "uppercase",
                color: "#FDFAF7",
                background: "linear-gradient(135deg,#8B6000,#C8960C,#8B6000)",
                border: "none", padding: "clamp(13px,2vw,16px) 36px",
                cursor: "pointer", transition: "transform .25s, box-shadow .25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 28px #C8960C45"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            >Get Directions →</button>
          </div>

          {/* Map */}
          <div className="revR" style={{
            border: "1px solid #C8960C28",
            background: "#FFFFFF",
            overflow: "hidden",
            boxShadow: "0 8px 40px #C8960C12",
          }}>
            <MapSVG ready={ready} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSVG({ ready }) {
  return (
    <svg viewBox="0 0 440 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
      <defs>
        <filter id="pinGlow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>
          <feFlood floodColor="#C8960C" floodOpacity=".7" result="c"/>
          <feComposite in="c" in2="b" operator="in" result="g"/>
          <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="440" height="340" fill="#F8F4EE"/>
      {[0,55,110,165,220,275,330,385,440].map(x=>(<line key={x} x1={x} y1="0" x2={x} y2="340" stroke="#C8960C" strokeWidth=".8" opacity=".08"/>))}
      {[0,55,110,165,220,275,330].map(y=>(<line key={y} x1="0" y1={y} x2="440" y2={y} stroke="#C8960C" strokeWidth=".8" opacity=".08"/>))}
      <rect x="0"   y="150" width="440" height="18" fill="#E8DDD0" rx="1" opacity=".9"/>
      <rect x="0"   y="218" width="440" height="12" fill="#E8DDD0" rx="1" opacity=".75"/>
      <rect x="0"   y="88"  width="440" height="10" fill="#E8DDD0" rx="1" opacity=".65"/>
      <rect x="195" y="0"   width="18"  height="340" fill="#E8DDD0" rx="1" opacity=".9"/>
      <rect x="105" y="0"   width="10"  height="340" fill="#E8DDD0" rx="1" opacity=".65"/>
      <rect x="305" y="0"   width="10"  height="340" fill="#E8DDD0" rx="1" opacity=".65"/>
      <text x="220" y="145" fontSize="7.5" fill="#8B6000" opacity=".6" fontFamily="monospace" letterSpacing=".5">GUDALUR MAIN ROAD</text>
      <path d="M 60 295 L 60 159 L 204 159"
        fill="none" stroke="#C8960C" strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray="800" strokeDashoffset={ready?"0":"800"}
        style={ready?{transition:"stroke-dashoffset 2.2s ease .5s"}:{}}/>
      {ready&&(<><circle cx="60" cy="295" r="7" fill="#C8960C" opacity=".65"/><text x="72" y="299" fontSize="7.5" fill="#8B6000" fontFamily="monospace">You</text></>)}
      {[[234,163,72,50],[125,98,62,42],[310,226,68,44],[42,98,58,42],[320,98,56,38]].map(([x,y,w,h],i)=>(<rect key={i} x={x} y={y} width={w} height={h} fill="#EDE8E0" stroke="#C8960C15" strokeWidth="1" rx="1"/>))}
      <g transform="translate(204,155)" style={{animation:ready?"mapBounce 2s ease-in-out infinite":""}} filter="url(#pinGlow)">
        <path d="M 0 -38 C -17 -38 -17 -14 0 -14 C 17 -14 17 -38 0 -38 Z" fill="#C8960C"/>
        <line x1="0" y1="-14" x2="0" y2="2" stroke="#C8960C" strokeWidth="3.5"/>
        <circle cx="0" cy="-27" r="9" fill="#FDFAF7"/>
        <text x="0" y="-23" textAnchor="middle" fontSize="10" fill="#7A4F00" fontFamily="serif">ॐ</text>
        {[0,1].map(j=>(<circle key={j} cx="0" cy="2" r="10" fill="none" stroke="#C8960C" strokeWidth="2" opacity=".65" style={{animation:`rippleOut 2.2s ease-out ${j*1.1}s infinite`,transformOrigin:"0 2px"}}/>))}
      </g>
      <rect x="140" y="162" width="150" height="32" rx="2" fill="#FDFAF7" stroke="#C8960C" strokeWidth="1.2"/>
      <text x="215" y="175" textAnchor="middle" fontSize="7.5" fill="#7A4F00" fontFamily="monospace" letterSpacing=".5">SASTHAPURI HOTELS</text>
      <text x="215" y="186" textAnchor="middle" fontSize="7.5" fill="#C8960C" fontFamily="monospace">&amp; RESORTS, GUDALUR</text>
      <g transform="translate(412,28)">
        <circle cx="0" cy="0" r="20" fill="#FDFAF7" stroke="#C8960C30" strokeWidth="1.2"/>
        <path d="M 0 -15 L 5 5 L 0 1 L -5 5 Z" fill="#C8960C"/>
        <path d="M 0  15 L 5 -5 L 0 -1 L -5 -5 Z" fill="#C8960C" opacity=".25"/>
        <text x="0" y="-17" textAnchor="middle" fontSize="7.5" fill="#C8960C" fontFamily="monospace">N</text>
      </g>
      <g transform="translate(18,325)">
        <line x1="0" y1="0" x2="50" y2="0" stroke="#C8960C55" strokeWidth="1.2"/>
        <line x1="0" y1="-4" x2="0"  y2="4" stroke="#C8960C55" strokeWidth="1.2"/>
        <line x1="50" y1="-4" x2="50" y2="4" stroke="#C8960C55" strokeWidth="1.2"/>
        <text x="25" y="-6" textAnchor="middle" fontSize="6.5" fill="#C8960C55" fontFamily="monospace">1 km</text>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   BLESSINGS SECTION
───────────────────────────────────────────── */
function BlessingsSection() {
  const ref = useRef(null);
  useReveal(ref);

  const items = [
    {
      icon: "🙏",
      title: "In Loving Memory",
      content: "Late S. Jayakumar",
      sub: "His blessings guide this sacred union",
      detail: "remembered with Love",
      accent: "#C8960C",
    },
    {
      icon: "🌸",
      title: "Greetings",
      content: "Greetings from Ezil",
      sub: "With heartfelt warmth and joy",
      detail: "",
      accent: "#B8A0B8",
    },
    {
      icon: "🏡",
      title: "Warmest Welcome",
      content: "Warmest Welcome from Chandrakala",
      sub: "TNEB Gudalur",
      detail: "",
      accent: "#8BA870",
    },
  ];

  return (
    <section ref={ref} style={{
      background: "linear-gradient(180deg,#FAF5F2 0%,#F8F0F0 50%,#FAF5F2 100%)",
      padding: "80px 24px 70px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="200" cy="380" rx="280" ry="130" fill="#E8D0D8" opacity=".1" transform="rotate(-15,200,380)"/>
          <ellipse cx="820" cy="150" rx="240" ry="110" fill="#D0C8E0" opacity=".1"/>
        </svg>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <p className="reveal" style={{
          fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: 6,
          color: "#C8960C", textTransform: "uppercase", marginBottom: 14,
        }}>Blessings &amp; Greetings</p>
        <h2 className="reveal" style={{
          fontFamily: "'Playfair Display',serif",
          fontStyle: "italic",
          fontSize: "clamp(26px,5vw,46px)",
          color: "#7A4F00", marginBottom: 44, fontWeight: 800,
        }}>With Love &amp; Warmth</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 28 }}>
          {items.map((item, i) => (
            <div key={i} className="reveal" style={{
              transitionDelay: `${i * .16}s`,
              background: "#FFFFFF",
              border: "1px solid #C8960C18",
              padding: "clamp(24px,3.5vw,36px) clamp(22px,3vw,30px)",
              textAlign: "center",
              position: "relative",
              animation: "borderGlow 4s ease-in-out infinite",
              animationDelay: `${i * .6}s`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 28,
                borderTop: `2px solid ${item.accent}50`, borderLeft: `2px solid ${item.accent}50` }}/>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28,
                borderBottom: `2px solid ${item.accent}50`, borderRight: `2px solid ${item.accent}50` }}/>

              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <p style={{
                fontFamily: "'Cinzel',serif", fontSize: 10,
                letterSpacing: 3, color: item.accent,
                textTransform: "uppercase", marginBottom: 12,
              }}>{item.title}</p>
              <p style={{
                fontFamily: "'Playfair Display',serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(18px,2.5vw,22px)",
                color: "#5A3800", lineHeight: 1.5,
              }}>{item.content}</p>
              {item.detail && (
                <p style={{
                  fontFamily: "'Cormorant',serif",
                  fontStyle: "italic",
                  fontSize: "clamp(14px,2vw,17px)",
                  color: "#8B6000", marginTop: 4,
                }}>{item.detail}</p>
              )}
              <p style={{
                fontFamily: "'Great Vibes',cursive",
                fontSize: "clamp(16px,2.2vw,20px)",
                color: "#8B6000", marginTop: 10, opacity: .85,
              }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg,#FAF5F2 0%,#F5EDE8 100%)",
      borderTop: "1px solid #C8960C28",
      padding: "70px 24px 44px",
      textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", bottom: -20, left: -20, pointerEvents: "none", opacity: .5 }}>
        <svg width="220" height="200" viewBox="0 0 200 200"><FlowerCluster x={-10} y={20} scale={.95} rotate={5}/></svg>
      </div>
      <div style={{ position: "absolute", bottom: -20, right: -20, pointerEvents: "none", opacity: .5 }}>
        <svg width="220" height="200" viewBox="0 0 200 200"><FlowerCluster x={210} y={20} scale={.95} flip rotate={-5}/></svg>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 28 }}><OmSymbol size={48}/></div>
        <GoldDivider style={{ marginBottom: 32 }}/>

        {/* Script names */}
        <div style={{ marginBottom: 6 }}>
          <h2 style={{
            fontFamily: "'Great Vibes',cursive",
            fontSize: "clamp(48px,9vw,88px)",
            color: "#7A4F00",
            textShadow: "0 2px 20px #C8960C22",
            animation: "shimmer 4s ease-in-out infinite",
          }}>Megala &amp; Mani</h2>
        </div>

        {/* Date in Playfair italic bold */}
        <p style={{
          fontFamily: "'Playfair Display',serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "clamp(14px,2.2vw,19px)",
          letterSpacing: 4, color: "#C8960C",
          marginBottom: 32,
        }}>23 · April · 2026</p>

        <GoldDivider style={{ marginBottom: 32 }}/>

        {/* Saptapadi verse — IM Fell italic for authentic old-print feel */}
        <p style={{
          fontFamily: "'IM Fell English',serif",
          fontStyle: "italic",
          fontSize: "clamp(17px,2.8vw,23px)",
          color: "#5A3800", lineHeight: 2.1, opacity: .9, marginBottom: 32,
        }}>
          "With every step we walk together,<br/>
          with every breath we grow together,<br/>
          with every heartbeat we belong to each other."
        </p>

        {/* Contact */}
        <div style={{
          display: "inline-block",
          border: "1px solid #C8960C30",
          padding: "20px 40px", marginBottom: 36,
        }}>
          <p style={{
            fontFamily: "'Cinzel',serif", fontSize: 10,
            letterSpacing: 4, color: "#C8960C",
            textTransform: "uppercase", marginBottom: 10,
          }}>RSVP &amp; Enquiries</p>
          <p style={{
            fontFamily: "'Playfair Display',serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(18px,3vw,24px)",
            color: "#5A3800",
          }}>+91 8608037086</p>
        </div>

        <div style={{ borderTop: "1px solid #C8960C18", paddingTop: 24 }}>
          <p style={{
            fontFamily: "'Cormorant',serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(14px,2vw,17px)",
            color: "#8B6000", opacity: .82, lineHeight: 2,
          }}>
            <em>With the blessings of the Divine &amp; JK Family</em><br/>
            <strong style={{ fontStyle: "italic" }}>Sasthapuri Hotels &amp; Resorts, Gudalur · 2026</strong>
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                width: i === 3 ? 8 : 5, height: i === 3 ? 8 : 5,
                borderRadius: "50%",
                background: "#C8960C",
                opacity: .2 + (i % 4) * .15,
              }}/>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   NAV BAR
───────────────────────────────────────────── */
function NavBar({ scrollY }) {
  const show = scrollY > 80;
  const sections = ["Home","Date","Families","Venue","Blessings"];
  const anchors  = ["#home","#date","#families","#venue","#blessings"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: show ? "rgba(253,250,247,.95)" : "transparent",
      borderBottom: show ? "1px solid #C8960C20" : "none",
      backdropFilter: show ? "blur(12px)" : "none",
      padding: "14px clamp(16px,4vw,48px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background .4s ease, border .4s ease",
    }}>
      <div style={{
        fontFamily: "'Great Vibes',cursive",
        fontSize: "clamp(20px,2.5vw,26px)",
        color: "#7A4F00",
      }}>Megala &amp; Mani</div>
      <div style={{ display: "flex", gap: "clamp(14px,2.5vw,30px)" }}>
        {sections.map((s, i) => (
          <a key={i} href={anchors[i]} style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "clamp(9px,1.2vw,11px)",
            fontWeight: 600,
            letterSpacing: 2, color: "#8B6000",
            textTransform: "uppercase",
            textDecoration: "none",
            opacity: show ? 1 : 0,
            transition: "opacity .4s, color .2s",
          }}
          className="desktop-only"
          onMouseEnter={e => e.target.style.color = "#C8960C"}
          onMouseLeave={e => e.target.style.color = "#8B6000"}
          >{s}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  useStyles();

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: "#FDFAF7", minHeight: "100vh" }}>
      <FallingPetals/>
      <MusicPlayer/>
      <NavBar scrollY={scrollY}/>
      <div id="home">      <HeroSection  scrollY={scrollY}/> </div>
      <div id="date">      <DateSection/> </div>
      <div id="families">  <CoupleSection/> </div>
      <div id="venue">     <VenueSection/> </div>
      <div id="blessings"> <BlessingsSection/> </div>
      <Footer/>
    </div>
  );
}