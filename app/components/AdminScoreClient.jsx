"use client";
import { useEffect, useState } from "react";

export default function AdminScoreClient({ initialScores }) {
  const [scores, setScores] = useState(initialScores);

  const notifyBroadcastChannel = () => {
    try {
      const channel = new BroadcastChannel("score_channel");
      channel.postMessage("score_updated");
      channel.close();
    } catch (e) {}
  };

  const fetchScores = async () => {
    try {
      const res = await fetch(`/api/score?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setScores(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchScores();
    const timer = setInterval(fetchScores, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateScore = async (teamId, increment) => {
    setScores((prev) => {
      const current = prev || initialScores;
      if (!current || !current[teamId]) return current;
      return {
        ...current,
        [teamId]: {
          ...current[teamId],
          score: current[teamId].score + Number(increment)
        }
      };
    });

    notifyBroadcastChannel();

    try {
      const res = await fetch(`/api/score?t=${Date.now()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, increment }),
        cache: "no-store"
      });
      if (res.ok) {
        const updated = await res.json();
        setScores(updated);
        notifyBroadcastChannel();
      }
    } catch (e) {
      console.error("Update error:", e);
    }
  };

  const handleUpdateName = async (teamId, newName) => {
    if (!newName || !newName.trim()) return;

    setScores((prev) => {
      const current = prev || initialScores;
      if (!current || !current[teamId]) return current;
      return {
        ...current,
        [teamId]: {
          ...current[teamId],
          name: newName.trim()
        }
      };
    });

    notifyBroadcastChannel();

    try {
      const res = await fetch(`/api/score?t=${Date.now()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, name: newName.trim() }),
        cache: "no-store"
      });
      if (res.ok) {
        const updated = await res.json();
        setScores(updated);
        notifyBroadcastChannel();
      }
    } catch (e) {
      console.error("Name update error:", e);
    }
  };

  const data = scores || initialScores || {
    team1: { name: "TIM A", score: 0 },
    team2: { name: "TIM B", score: 0 },
    team3: { name: "TIM C", score: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-10 font-sans">
      <h1 className="text-4xl font-black mb-10 text-center text-blue-600 tracking-wider uppercase">Controller</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(data).map(([teamId, teamData]) => (
          <div key={teamId} className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
            {/* EDITABLE NAMA TIM */}
            <div className="w-full mb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 text-center">Nama Tim</label>
              <input
                type="text"
                key={`${teamId}-${teamData.name}`}
                defaultValue={teamData.name}
                onBlur={(e) => handleUpdateName(teamId, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateName(teamId, e.target.value);
                    e.target.blur();
                  }
                }}
                className="w-full text-2xl font-black text-center text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-xl py-2 px-3 outline-none transition"
                placeholder="Masukkan Nama Tim"
              />
            </div>

            {/* SKOR DISPLAY */}
            <div className="text-7xl font-black mb-8 text-gray-800">{teamData.score}</div>
            
            {/* KONTROL SKOR */}
            <div className="grid grid-cols-2 gap-4 w-full mb-4">
              <button 
                type="button"
                onClick={() => handleUpdateScore(teamId, 100)}
                className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-4 rounded-xl text-2xl transition cursor-pointer shadow-md"
              >
                +100
              </button>
              <button 
                type="button"
                onClick={() => handleUpdateScore(teamId, -100)}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-4 rounded-xl text-2xl transition cursor-pointer shadow-md"
              >
                -100
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <button 
                type="button"
                onClick={() => handleUpdateScore(teamId, 50)}
                className="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3 rounded-xl text-xl transition cursor-pointer shadow-sm"
              >
                +50
              </button>
              <button 
                type="button"
                onClick={() => handleUpdateScore(teamId, -50)}
                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3 rounded-xl text-xl transition cursor-pointer shadow-sm"
              >
                -50
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
