import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const emptyForm = {
    title: '', city: 'Bangalore', locality: '', price: '', type: 'rent', property_type: 'flat',
    bhk: 1, bathrooms: 1, area: '', image_filename: 'cozy_flat_interior.png',
    description: '', amenities: '', agent_name: '', agent_phone: '', agent_email: '',
};

export default function PropertyFormModal({ property, onClose, onSaved }) {
    const { token } = useAuth();
    const isEdit = Boolean(property);
    const [form, setForm] = useState(() => (property ? { ...property } : { ...emptyForm }));
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                bhk: Number(form.bhk),
                bathrooms: Number(form.bathrooms),
                area: Number(form.area),
            };
            const url = isEdit ? `${API_BASE_URL}/properties/${property.id}` : `${API_BASE_URL}/properties`;
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || 'Failed to save property');
            }
            onSaved(await res.json());
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
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fade-in-up">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-sm font-extrabold text-slate-900">{isEdit ? 'Edit Property' : 'List a New Property'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Title</label>
                            <input name="title" value={form.title} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">City</label>
                            <select name="city" value={form.city} onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                                {['Bangalore', 'Mumbai', 'Chennai', 'Hyderabad'].map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Locality</label>
                            <input name="locality" value={form.locality} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Purpose</label>
                            <select name="type" value={form.type} onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                                <option value="rent">Rent</option>
                                <option value="buy">Buy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Property Type</label>
                            <select name="property_type" value={form.property_type} onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                                <option value="flat">Flat</option>
                                <option value="house">House</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Price (INR)</label>
                            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Area (sqft)</label>
                            <input type="number" name="area" value={form.area} onChange={handleChange} required min="0"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">BHK</label>
                            <input type="number" name="bhk" value={form.bhk} onChange={handleChange} required min="1" max="10"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Bathrooms</label>
                            <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} required min="1" max="10"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Image</label>
                            <select name="image_filename" value={form.image_filename} onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                                <option value="cozy_flat_interior.png">Cozy Flat</option>
                                <option value="modern_villa_bangalore.png">Modern Villa</option>
                                <option value="luxury_apartment_mumbai.png">Luxury Apartment</option>
                                <option value="luxury_penthouse.png">Luxury Penthouse</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Amenities (comma-separated)</label>
                            <input name="amenities" value={form.amenities} onChange={handleChange} required placeholder="Parking, Security, Gym"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Agent Name</label>
                            <input name="agent_name" value={form.agent_name} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Agent Phone</label>
                            <input name="agent_phone" value={form.agent_phone} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Agent Email</label>
                            <input type="email" name="agent_email" value={form.agent_email} onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400" />
                        </div>
                    </div>

                    {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
                            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'List Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}