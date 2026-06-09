"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ApiAddress, ApiCountry, getCountries } from "@/lib/api";

interface AddressFormProps {
  initialData?: ApiAddress;
  onSave: (data: Partial<ApiAddress>) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({ initialData, onSave, onCancel }: AddressFormProps) {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ApiAddress>>({
    alias: initialData?.alias || "Home",
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    company: initialData?.company || "",
    address1: initialData?.address1 || "",
    address2: initialData?.address2 || "",
    postcode: initialData?.postcode || "",
    city: initialData?.city || "",
    id_country: initialData?.id_country || 0,
    phone: initialData?.phone || "",
    phone_mobile: initialData?.phone_mobile || "",
  });

  useEffect(() => {
    getCountries().then((data) => {
      setCountries(data);
      if (!formData.id_country && data.length > 0) {
        setFormData(prev => ({ ...prev, id_country: data[0].id }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'id_country' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-navy text-lg">{initialData ? "Edit Address" : "New Address"}</h3>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Alias (e.g. Home, Work)</label>
            <input required type="text" name="alias" value={formData.alias} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">First Name</label>
              <input required type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Last Name</label>
              <input required type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Address Line 1</label>
            <input required type="text" name="address1" value={formData.address1} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Address Line 2 (Optional)</label>
            <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">City</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Postcode</label>
              <input type="text" name="postcode" value={formData.postcode || ""} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Country</label>
              <select required name="id_country" value={formData.id_country} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Mobile Phone</label>
              <input type="text" name="phone_mobile" value={formData.phone_mobile || ""} onChange={handleChange} className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
