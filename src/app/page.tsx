"use client";
import { useState } from "react";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!subscriptions) { setError("Please enter your subscriptions."); return; }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: { subscriptions, monthlyBudget, goals } }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch { setError("Failed to connect to the audit service."); }
    finally { setLoading(false); }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      <header className="border-b border-cyan-500/20 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold text-cyan-400">AI Subscription Audit</h1>
            <p className="text-xs text-gray-400">Find hidden savings powered by DeepSeek AI</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white">Stop paying for what you don't use 🔍</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mt-2">
            List your subscriptions — get a complete audit with cancellation and downgrade recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800/60 border border-cyan-500/20 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-cyan-400 text-sm uppercase tracking-wide">Your Subscriptions</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">📋 All Subscriptions *</label>
              <textarea value={subscriptions} onChange={(e) => setSubscriptions(e.target.value)}
                placeholder="e.g. Netflix $15.99/mo&#10;Spotify $9.99/mo&#10;Adobe CC $54.99/mo&#10;Gym $49.99/mo&#10;New York Times $4.99/mo&#10;LinkedIn Premium $29.99/mo"
                rows={6}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">💵 Monthly Entertainment Budget ($)</label>
              <input type="number" min="0" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="100"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">🎯 Savings Goals</label>
              <textarea value={goals} onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Cut $100/month, cancel unused services, find free alternatives..."
                rows={2}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
            </div>

            <button onClick={generate} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="animate-spin">⚙️</span> Auditing subscriptions...</> : <>🔍 Audit My Subscriptions</>}
            </button>
            {error && <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>}
          </div>

          <div>
            {result ? (
              <div className="bg-gray-800/60 border border-cyan-500/20 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">🔍 Audit Results</h3>
                  <button onClick={copyResult}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-base font-medium text-gray-400">No audit yet</p>
                <p className="text-xs text-gray-500 mt-1">Enter your subscriptions and click Audit</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-10 pb-4">AI Subscription Audit · {new Date().getFullYear()} · For educational purposes only</p>
      </div>
    </main>
  );
}
