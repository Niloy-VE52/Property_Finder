import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            if (mode === 'login') await login(form.email, form.password);
            else await register(form.name, form.email, form.password);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 p-6 animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500">
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-lg font-extrabold text-slate-900">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {mode === 'login' ? 'Log in to manage your listings' : 'Sign up to list and manage properties'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    {mode === 'register' && (
                        <div className="relative">
                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required minLength={6}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                    </div>

                    {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

                    <button type="submit" disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors disabled:opacity-60">
                        {mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                        {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-5">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-brand-600 font-bold hover:underline">
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
}