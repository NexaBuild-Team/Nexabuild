import React from 'react';

interface ComingSoonMetricProps {
  children: React.ReactNode;
  title?: string;
  moduleOwner?: string;
}

export const ComingSoonMetric: React.FC<ComingSoonMetricProps> = ({
  children,
  title,
  moduleOwner,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Blurred background metric UI */}
      <div className="filter blur-[3px] opacity-60 pointer-events-none select-none">
        {children}
      </div>

      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10 border border-white/40 rounded-2xl shadow-inner">
        <div className="size-9 rounded-full bg-[#345b79]/10 text-[#345b79] flex items-center justify-center mb-2 font-bold text-sm">
          🔒
        </div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#345b79]">
          {title || 'Coming Soon'}
        </span>
        {moduleOwner && (
          <p className="text-[10px] text-gray-500 font-medium mt-1">
            Module: <span className="font-semibold text-gray-700">{moduleOwner}</span> (Schema Pending)
          </p>
        )}
      </div>
    </div>
  );
};
