import React, { useState, useEffect, useRef } from 'react';

export default function AchievementNotification({ achievement, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!achievement) return;
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3500);
    return () => clearTimeout(timerRef.current);
  }, [achievement?.id]);

  if (!achievement) return null;

  const handleClick = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`fixed top-20 right-4 z-[150] cursor-pointer transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
      onClick={handleClick}
    >
      <div className="bg-black/95 border border-amber-900/50 px-4 py-3 max-w-[190px] backdrop-blur-sm">
        <div className="text-[9px] text-amber-800 tracking-[0.3em] uppercase mb-2">
          Pencapaian
        </div>
        <div className="flex items-start gap-2.5">
          <span className="text-amber-600 text-base font-mono leading-none mt-0.5 shrink-0">
            {achievement.icon}
          </span>
          <div>
            <div className="text-amber-200 text-xs font-bold tracking-wide leading-tight">
              {achievement.title}
            </div>
            <div className="text-gray-600 text-[10px] mt-1 leading-relaxed">
              {achievement.desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
