import React from 'react';
import { X, Phone, Mail, User } from 'lucide-react';

export default function AgentsModal({ properties, city, onClose }) {
    const agentsMap = new Map();
    properties.forEach((p) => {
        if (!agentsMap.has(p.agent_email)) {
            agentsMap.set(p.agent_email, { name: p.agent_name, phone: p.agent_phone, email: p.agent_email, count: 1 });
        } else {
            agentsMap.get(p.agent_email).count += 1;
        }
    });
    const agents = Array.from(agentsMap.values());

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col animate-fade-in-up">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-extrabold text-slate-900">Agents in {city}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 space-y-3">
                    {agents.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-6">No agents found for the current filters.</p>
                    )}
                    {agents.map((a) => (
                        <div key={a.email} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">{a.name}</p>
                                    <p className="text-[10px] text-slate-400">{a.count} listing{a.count > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={`tel:${a.phone}`} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 text-slate-600 transition-colors">
                                    <Phone className="h-3.5 w-3.5" />
                                </a>
                                <a href={`mailto:${a.email}`} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 text-slate-600 transition-colors">
                                    <Mail className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}