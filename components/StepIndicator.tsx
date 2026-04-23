"use client";

interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-medical-blue -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                  isCompleted 
                    ? "bg-medical-blue text-white" 
                    : isActive 
                      ? "bg-white border-4 border-medical-blue text-medical-blue shadow-lg shadow-blue-100" 
                      : "bg-white border-2 border-slate-100 text-slate-300"
                }`}
              >
                {isCompleted ? "✓" : step.id}
              </div>
              <span 
                className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                  isActive ? "text-medical-blue" : "text-slate-400"
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
