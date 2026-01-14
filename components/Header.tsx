import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Face Vault v3.0</span>
      </div>
      <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500 uppercase tracking-tighter">
        ห้องปฏิบัติการ AI
      </h1>
    </div>
  );
};