import React from 'react';
import { BedDouble, Bath, Maximize, MapPin, Eye, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PropertyCard({ property, onSelect, onEdit, onDelete }) {
  const { user } = useAuth();
  const canManage = user && (user.role === 'admin' || property.owner_id === user.id);

 const {
  title, city, locality, price, type, property_type, bhk, bathrooms, area, image_filename, image_url,
} = property;



  const formatPrice = (priceVal, typeVal) => {
    const num = Number(priceVal);
    let displayPrice = '';
    if (num >= 10000000) displayPrice = `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
    else if (num >= 100000) displayPrice = `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    else displayPrice = `₹${num.toLocaleString('en-IN')}`;
    return typeVal === 'rent' ? `${displayPrice} / mo` : displayPrice;
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden glass-card-hover flex flex-col h-full border border-slate-100 shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 shrink-0">
        <img src={image_url || `/images/${image_filename}`} alt={title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"; }} />
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm text-white ${type === 'rent' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
            For {type === 'rent' ? 'Rent' : 'Sale'}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm text-slate-800 bg-white/90 backdrop-blur-xs">
            {property_type === 'flat' ? 'Flat' : 'House'}
          </span>
        </div>
        {canManage && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(property); }}
              className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-brand-600 shadow-sm transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(property.id); }}
              className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-sm transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-brand-600 transition-colors mb-1">{title}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{locality}, {city}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-3 px-2.5 bg-slate-50 rounded-xl mb-4 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5 justify-center">
            <BedDouble className="h-4 w-4 text-brand-500 shrink-0" /><span>{bhk} BHK</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-x border-slate-200">
            <Bath className="h-4 w-4 text-brand-500 shrink-0" /><span>{bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Maximize className="h-4 w-4 text-brand-500 shrink-0" /><span>{area} sqft</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              {type === 'rent' ? 'Rental Rate' : 'Property Value'}
            </span>
            <span className="text-base font-extrabold text-brand-600">{formatPrice(price, type)}</span>
          </div>
          <button onClick={() => onSelect(property)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 transition-all duration-200 shadow-sm shadow-slate-100">
            <Eye className="h-3.5 w-3.5" /> Details
          </button>
        </div>
      </div>
    </div>
  );
}