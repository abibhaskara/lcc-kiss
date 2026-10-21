"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedScore({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = Number(value);
    const duration = 600;

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value]);

  return (
    <motion.span
      key={displayValue}
      initial={{ scale: 1.25, filter: "brightness(1.5)" }}
      animate={{ scale: 1, filter: "brightness(1)" }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="inline-block"
    >
      {displayValue}
    </motion.span>
  );
}

export default function LiveScoreClient({ initialScores }) {
  const [scores, setScores] = useState(initialScores);


  const fetchScores = async () => {
    try {
      const res = await fetch(`/api/score?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setScores(data);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchScores();

    let broadcastChan;
    try {
      broadcastChan = new BroadcastChannel("score_channel");
      broadcastChan.onmessage = (event) => {
        if (event.data === "score_updated") {
          fetchScores();
        }
      };
    } catch (e) {}

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchScores();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    const timer = setInterval(fetchScores, 300);

    return () => {
      clearInterval(timer);
      if (broadcastChan) broadcastChan.close();
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, []);

  const data = scores || initialScores || {
    team1: { name: "TIM A", score: 0 },
    team2: { name: "TIM B", score: 0 },
    team3: { name: "TIM C", score: 0 }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white font-sans bg-transparent">
      {/* CONTENT */}
      <div className="relative z-10 w-full h-full flex flex-col justify-start pt-[12%] px-[5%]">
        {/* NAMA TIM ROW */}
        <div className="flex justify-between w-full h-[20%]">
          <div className="w-1/3 flex items-center justify-center text-[4vw] font-black tracking-wider text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] [text-shadow:_0_4px_12px_rgba(0,0,0,0.9)]">
            {data?.team1?.name || "TIM A"}
          </div>
          <div className="w-1/3 flex items-center justify-center text-[4vw] font-black tracking-wider text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] [text-shadow:_0_4px_12px_rgba(0,0,0,0.9)]">
            {data?.team2?.name || "TIM B"}
          </div>
          <div className="w-1/3 flex items-center justify-center text-[4vw] font-black tracking-wider text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] [text-shadow:_0_4px_12px_rgba(0,0,0,0.9)]">
            {data?.team3?.name || "TIM C"}
          </div>
        </div>

        {/* SCORE ROW WITH COUNT UP / DOWN ANIMATION */}
        <div className="flex justify-between w-full h-[45%] mt-[5%]">
          <div className="w-1/3 flex items-center justify-center text-[10vw] font-black tracking-tighter text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] [text-shadow:_0_8px_20px_rgba(0,0,0,0.95)]">
            <AnimatedScore value={data?.team1?.score ?? 0} />
          </div>
          <div className="w-1/3 flex items-center justify-center text-[10vw] font-black tracking-tighter text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] [text-shadow:_0_8px_20px_rgba(0,0,0,0.95)]">
            <AnimatedScore value={data?.team2?.score ?? 0} />
          </div>
          <div className="w-1/3 flex items-center justify-center text-[10vw] font-black tracking-tighter text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] [text-shadow:_0_8px_20px_rgba(0,0,0,0.95)]">
            <AnimatedScore value={data?.team3?.score ?? 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
