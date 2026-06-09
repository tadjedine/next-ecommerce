"use client";
import { Edit2, Trash2 } from "lucide-react";
import { ApiAddress } from "@/lib/api";

interface AddressCardProps {
  address: ApiAddress;
  onEdit: (address: ApiAddress) => void;
  onDelete: (id: number) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(address)} 
          className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => {
            if(window.confirm("Are you sure you want to delete this address?")) {
              onDelete(address.id);
            }
          }}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-bold text-navy text-base">{address.alias}</h4>
      </div>
      
      <div className="text-sm text-slate-600 space-y-1">
        <p className="font-medium text-slate-800">{address.firstname} {address.lastname}</p>
        {address.company && <p>{address.company}</p>}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.postcode} {address.city}</p>
        {(address.phone || address.phone_mobile) && (
          <p className="pt-2 text-slate-500">
            {address.phone_mobile || address.phone}
          </p>
        )}
      </div>
    </div>
  );
}
