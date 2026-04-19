'use client';

import { useState } from 'react';

export default function Page() {
  const [subscriptions, setSubscriptions] = useState('');
  const [budget, setBudget] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: {
        subscriptions,
        budget,
        alternatives,
          }
        }),
      });
      const data = await res.json();
      setOutput(data.result || 'No result returned.');
    } catch (err) {
      setError('Failed to generate. Check API key or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-sky-400">AI Subscription Audit</h1>
        <p className="text-gray-400 mb-8">AI Subscription Audit - Powered by DeepSeek AI</p>
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/50 rounded-xl p-6">
          <div>
            <label htmlFor="id-subscriptions" className="block text-sm font-medium text-gray-300 mb-1">Subscription List</label>
            <textarea
              id="id-subscriptions"
              name="subscriptions"
              value={subscriptions}
              onChange={e => setSubscriptions(e.target.value)}
              required
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
          <div>
            <label htmlFor="id-budget" className="block text-sm font-medium text-gray-300 mb-1">Monthly Budget ($)</label>
            <input
              id="id-budget"
              name="budget"
              type="number"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
          <div>
            <label htmlFor="id-alternatives" className="block text-sm font-medium text-gray-300 mb-1">Known Alternatives</label>
            <textarea
              id="id-alternatives"
              name="alternatives"
              value={alternatives}
              onChange={e => setAlternatives(e.target.value)}
              required
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-sky-600 hover:bg-sky-500 disabled:bg-gray-600/50 text-white font-medium py-2 rounded-lg transition cursor-pointer`}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>
          <div className="bg-gray-800/50 rounded-xl p-6">
            {loading && <div className="text-sky-400 animate-pulse">Generating...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && !error && (
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">
                {output || 'Output will appear here.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
