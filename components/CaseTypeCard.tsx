"use client";

interface CaseTypeCardProps {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
}

export default function CaseTypeCard({
  title,
  description,
  isSelected,
  onClick,
  icon,
}: CaseTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
        isSelected
          ? "border-medical-blue bg-medical-blue-light shadow-sm"
          : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`mt-1 text-2xl transition-transform duration-200 group-hover:scale-110`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h4
            className={`font-bold transition-colors ${
              isSelected ? "text-medical-blue" : "text-slate-800"
            }`}
          >
            {title}
          </h4>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="mt-1">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "border-medical-blue bg-medical-blue"
                : "border-slate-200 bg-white"
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
