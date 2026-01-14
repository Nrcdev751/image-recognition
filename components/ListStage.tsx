import React from 'react';
import { PlusCircle, Trash2, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface Props {
  users: User[];
  onAddUser: () => void;
  onDeleteUser: (id: number) => void;
  onTest: () => void;
  onReset: () => void;
}

export const ListStage: React.FC<Props> = ({ users, onAddUser, onDeleteUser, onTest, onReset }) => {
  return (
    <div className="p-8 lg:p-12 flex flex-col flex-grow h-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">ทะเบียนฐานข้อมูล</h2>
          <p className="text-slate-500 text-xs">จำนวนบุคคลที่พร้อมเปรียบเทียบ: {users.length}</p>
        </div>
        <button
          onClick={onAddUser}
          className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-cyan-600/40 flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={14} /> เพิ่มบุคคล
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto max-h-[300px] p-2 pr-4 custom-scrollbar">
        {users.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-600 italic text-sm border-2 border-dashed border-slate-800 rounded-2xl">
            ยังไม่มีผู้ลงทะเบียน
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-white/5 border border-white/5 rounded-2xl p-3 relative group transition-all hover:bg-white/10">
              <img src={user.data} className="w-full aspect-square object-cover rounded-xl mb-2 grayscale brightness-75 group-hover:grayscale-0 transition-all" alt={user.name} />
              <p className="text-center text-xs font-bold text-slate-300 truncate">{user.name}</p>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="absolute top-1 right-1 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-8 flex gap-4">
        <button
          onClick={onTest}
          disabled={users.length === 0}
          className={`flex-grow py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${users.length > 0 ? 'bg-white text-slate-950 hover:bg-cyan-400 shadow-xl' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
        >
          เข้าสู่โหมดสแกน
        </button>
        <button onClick={onReset} className="px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/10">
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};