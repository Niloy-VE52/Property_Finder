import React, { useMemo, useState } from 'react';
import { Bot, Search, RotateCcw, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

function formatINR(num) {
  if (num === null || num === undefined || num === '') return '';
  const n = Number(num);
  if (Number.isNaN(n)) return String(num);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AssistantPanel({ activeCity }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [result, setResult] = useState(null);

  const placeholder = useMemo(
    () =>
      `Try: “Find a 2BHK under 50k rent with pool in ${activeCity}”`,
    [activeCity]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const resp = await fetch(`${API_BASE_URL}/assistant/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(text || 'Assistant search failed');
      }

      const data = await resp.json();
      setResult(data);

// Do not modify the main listings state; AI results stay inside this section.
    } catch (err) {
      console.error(err);
      setError('Could not get assistant results. Check backend + OPENAI_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setQuery('');
    setResult(null);
    setError('');
  };

  return (
    <section className="mt-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-100/80 bg-white/95 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">AI Assistant Search</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ask in plain English—get matching properties + additional details.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-brand-300 transition-colors bg-white/70"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="glass-search-box rounded-2xl px-3 py-3 flex items-center gap-3 border border-white/20">
            <Search className="h-4.5 w-4.5 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-brand-600 transition-all shadow-sm shadow-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Matched Properties</h4>
                <div className="text-[11px] text-slate-500 font-semibold">{result.matches?.length || 0} results</div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(result.matches || []).slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
onClick={() => {}}
                    className="text-left rounded-2xl border border-slate-100/90 bg-white/80 hover:bg-white hover:border-brand-200 transition-colors p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                          {p.type === 'rent' ? 'Rent' : 'Sale'} • {p.property_type === 'flat' ? 'Flat' : 'House'}
                        </div>
                        <div className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-2">{p.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{p.locality}, {p.city}</div>
                      </div>
                      <div className="text-sm font-extrabold text-brand-700 whitespace-nowrap">
                        {formatINR(p.price)}
                        {p.type === 'rent' ? ' / mo' : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-100/90 bg-slate-50/60 p-4">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Additional Details</h4>
                <div className="mt-2 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {result.additional_details}
                </div>

                {result?.filters && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">AI Parsed Filters</div>
                    <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                      {result.filters.city && <div><span className="font-bold">City:</span> {result.filters.city}</div>}
                      {result.filters.type && <div><span className="font-bold">Purpose:</span> {result.filters.type}</div>}
                      {result.filters.property_type && <div><span className="font-bold">Type:</span> {result.filters.property_type}</div>}
                      {result.filters.bhk && <div><span className="font-bold">BHK:</span> {result.filters.bhk}</div>}
                      {(result.filters.min_price || result.filters.max_price) && (
                        <div>
                          <span className="font-bold">Budget:</span>{' '}
                          {result.filters.min_price ? formatINR(result.filters.min_price) : 'Any'} -{' '}
                          {result.filters.max_price ? formatINR(result.filters.max_price) : 'Any'}
                        </div>
                      )}
                      {result.filters.search && <div><span className="font-bold">Keywords:</span> {result.filters.search}</div>}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

