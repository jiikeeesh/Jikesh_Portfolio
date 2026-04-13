"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingNo {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function LovePage() {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [floatingNos, setFloatingNos] = useState<FloatingNo[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [mounted, setMounted] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const nosRef = useRef<FloatingNo[]>([]);
  const heartIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (heartIntervalRef.current) clearInterval(heartIntervalRef.current);
    };
  }, []);

  // Animate floating NOs
  useEffect(() => {
    if (answer !== "no") return;

    const initialNos: FloatingNo[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: Math.random() * 40 + 20,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
    }));
    nosRef.current = initialNos;
    setFloatingNos([...initialNos]);

    const animate = () => {
      nosRef.current = nosRef.current.map((n) => {
        let nx = n.x + n.vx;
        let ny = n.y + n.vy;
        let nvx = n.vx;
        let nvy = n.vy;
        if (nx < 0 || nx > window.innerWidth - 60) nvx = -nvx;
        if (ny < 0 || ny > window.innerHeight - 60) nvy = -nvy;
        return {
          ...n,
          x: nx,
          y: ny,
          vx: nvx,
          vy: nvy,
          rotation: n.rotation + n.rotationSpeed,
        };
      });
      setFloatingNos([...nosRef.current]);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [answer]);

  // Floating hearts for YES
  useEffect(() => {
    if (answer !== "yes") return;

    let id = 0;
    const spawnHeart = () => {
      const newHeart: FloatingHeart = {
        id: id++,
        x: Math.random() * 90 + 5,
        y: 110,
        size: Math.random() * 30 + 16,
        opacity: 1,
        speed: Math.random() * 1.5 + 0.8,
      };
      setFloatingHearts((prev) => [...prev.slice(-30), newHeart]);
    };

    heartIntervalRef.current = setInterval(spawnHeart, 300);
    return () => {
      if (heartIntervalRef.current) clearInterval(heartIntervalRef.current);
    };
  }, [answer]);

  // Animate hearts rising
  useEffect(() => {
    if (answer !== "yes") return;
    const frame = () => {
      setFloatingHearts((prev) =>
        prev
          .map((h) => ({ ...h, y: h.y - h.speed, opacity: h.opacity - 0.008 }))
          .filter((h) => h.opacity > 0)
      );
      animFrameRef.current = requestAnimationFrame(frame);
    };
    animFrameRef.current = requestAnimationFrame(frame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [answer]);

  const handleNoHover = (e?: React.MouseEvent | React.TouchEvent) => {
    if (answer !== null) return;
    if (e && e.cancelable && e.type === "touchstart") e.preventDefault();
    
    const btn = noBtnRef.current;
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const margin = window.innerWidth < 600 ? 20 : 80;
    
    const maxX = Math.max(0, window.innerWidth - rect.width - margin * 2);
    const maxY = Math.max(0, window.innerHeight - rect.height - margin * 2);
    
    const targetX = Math.random() * maxX + margin;
    const targetY = Math.random() * maxY + margin;

    // Calculate translation from its original static position
    // originalX = currentRectX - currentTranslationX
    const originalX = rect.left - noBtnPos.x;
    const originalY = rect.top - noBtnPos.y;
    
    setNoBtnPos({ x: targetX - originalX, y: targetY - originalY });
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(-45deg, #ff9a9e, #ffccd5, #ffb199, #ff758c)",
      backgroundSize: "400% 400%",
      animation: "bgPan 12s ease infinite",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px #ff4d9d, 0 0 40px #ff4d9d44; }
          50% { box-shadow: 0 0 40px #ff4d9d, 0 0 80px #ff4d9daa; }
        }
        @keyframes bgPan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          from { transform: translateY(0) scale(1); opacity: 1; }
          to { transform: translateY(-80px) scale(1.3); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .yes-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 0 40px #ff4d9d, 0 0 80px #ff4d9d88;
        }
        .card {
          animation: fadeInDown 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .love-text {
          background: linear-gradient(90deg, #ff4d9d, #ff8c42, #ff4d9d);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.5s linear infinite;
        }
        .reply-text {
          animation: fadeInDown 0.6s ease both;
        }
        @media (max-width: 600px) {
          .card {
            padding: 32px 24px !important;
            border-radius: 24px !important;
          }
          .love-title {
            font-size: 28px !important;
          }
          .buttons-container {
            gap: 12px !important;
          }
          .yes-btn, .no-btn {
            padding: 12px 32px !important;
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* Floating NOs when "No" is chosen */}
      {answer === "no" && floatingNos.map((n) => (
        <span
          key={n.id}
          style={{
            position: "fixed",
            left: n.x,
            top: n.y,
            fontSize: n.size,
            fontWeight: 800,
            color: `hsl(${n.id * 25}, 90%, 65%)`,
            transform: `rotate(${n.rotation}deg)`,
            pointerEvents: "none",
            userSelect: "none",
            textShadow: "0 0 12px currentColor",
            zIndex: 10,
          }}
        >
          NO
        </span>
      ))}

      {/* Floating hearts when "Yes" is chosen */}
      {answer === "yes" && floatingHearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: "fixed",
            left: `${h.x}%`,
            top: `${h.y}%`,
            fontSize: h.size,
            opacity: h.opacity,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 10,
            filter: "drop-shadow(0 0 8px #ff4d9d)",
            transition: "none",
          }}
        >
          ❤️
        </span>
      ))}

      {/* Main Card */}
      <div className="card" style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        borderRadius: 32,
        padding: "56px 60px",
        textAlign: "center",
        maxWidth: 480,
        width: "90%",
        boxShadow: "0 8px 60px rgba(255,77,157,0.18)",
        position: "relative",
        zIndex: 20,
      }}>

        {answer === null && (
          <>
            {/* Heart icon */}
            <div style={{ fontSize: 64, marginBottom: 8, animation: "heartbeat 1.4s ease infinite" }}>❤️</div>

            <h1 className="love-text love-title" style={{
              fontSize: 36,
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: "-0.5px",
            }}>
              Do you love me?
            </h1>

            <p style={{ color: "#8a4b60", marginBottom: 40, fontSize: 16, fontWeight: 500 }}>
              Choose wisely 💅
            </p>

            <div className="buttons-container" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              {/* YES Button */}
              <button
                className="yes-btn"
                onClick={() => setAnswer("yes")}
                style={{
                  padding: "14px 44px",
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  background: "linear-gradient(135deg, #ff4d9d, #ff8c42)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 50,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  animation: "pulseGlow 2s ease infinite",
                  letterSpacing: 1,
                  boxShadow: "0 4px 24px #ff4d9d88",
                }}
              >
                Yes 💖
              </button>

              {/* NO Button — runs away on hover */}
              <button
                ref={noBtnRef}
                className="no-btn"
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={() => setAnswer("no")}
                style={{
                  padding: "14px 44px",
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  background: "rgba(255,255,255,0.9)",
                  color: "#d6336c",
                  border: "1.5px solid #ffccd5",
                  borderRadius: 50,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  position: "relative",
                  transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`,
                  zIndex: 30,
                  letterSpacing: 1,
                }}
              >
                No 🚫
              </button>
            </div>
          </>
        )}

        {answer === "yes" && (
          <div className="reply-text">
            <div style={{ fontSize: 80, marginBottom: 16, animation: "heartbeat 0.8s ease infinite" }}>❤️</div>
            <h2 style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#d81b60",
              marginBottom: 8,
              lineHeight: 1.3,
            }}>
              I love you <span className="love-text">a lot</span>!
            </h2>
            <p style={{ color: "#a55972", fontSize: 16, fontWeight: 500 }}>
              Thank you for loving me back 🥹
            </p>
          </div>
        )}

        {answer === "no" && (
          <div className="reply-text">
            <div style={{ fontSize: 64, marginBottom: 12 }}>😭</div>
            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#d81b60",
              marginBottom: 8,
            }}>
              That hurts...
            </h2>
            <p style={{ color: "#a55972", fontSize: 16, fontWeight: 500 }}>
              The &quot;NO&quot;s are running wild just like my feelings 💔
            </p>
            <button
              onClick={() => {
                setAnswer(null);
                setNoBtnPos({ x: 0, y: 0 });
                setFloatingNos([]);
                nosRef.current = [];
              }}
              style={{
                marginTop: 24,
                padding: "10px 28px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                background: "linear-gradient(135deg, #ff4d9d, #ff8c42)",
                color: "#fff",
                border: "none",
                borderRadius: 50,
                cursor: "pointer",
                boxShadow: "0 4px 20px #ff4d9d66",
              }}
            >
              Try again? 🥺
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
