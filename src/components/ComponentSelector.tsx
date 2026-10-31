import React from 'react';
import {
  Cpu,
  Lightbulb,
  SlidersHorizontal,
  Radar,
  Radio,
  RotateCw,
  Bell,
  Grid,
  GitBranch,
  HelpCircle,
  Check,
} from 'lucide-react';

export const SUPPORTED_COMPONENTS = [
  { id: 'Arduino Uno', label: 'Arduino Uno', icon: Cpu, category: 'Microcontroller' },
  { id: 'LED', label: 'LED', icon: Lightbulb, category: 'Output' },
  { id: 'Resistor', label: 'Resistor', icon: SlidersHorizontal, category: 'Passive' },
  { id: 'Ultrasonic sensor', label: 'Ultrasonic sensor (HC-SR04)', icon: Radio, category: 'Sensor' },
  { id: 'PIR motion sensor', label: 'PIR motion sensor', icon: Radar, category: 'Sensor' },
  { id: 'Servo motor', label: 'Servo motor (SG90)', icon: RotateCw, category: 'Actuator' },
  { id: 'Buzzer', label: 'Buzzer (Piezo)', icon: Bell, category: 'Output' },
  { id: 'Breadboard', label: 'Breadboard', icon: Grid, category: 'Prototyping' },
  { id: 'Jumper wires', label: 'Jumper wires', icon: GitBranch, category: 'Prototyping' },
  { id: 'Other / unknown component', label: 'Other / unknown component', icon: HelpCircle, category: 'Other' },
] as const;

interface ComponentSelectorProps {
  selectedComponents: string[];
  onChange: (components: string[]) => void;
  disabled?: boolean;
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  selectedComponents,
  onChange,
  disabled = false,
}) => {
  const toggleComponent = (id: string) => {
    if (disabled) return;
    if (selectedComponents.includes(id)) {
      onChange(selectedComponents.filter((c) => c !== id));
    } else {
      onChange([...selectedComponents, id]);
    }
  };

  const handleSelectDefaults = () => {
    if (disabled) return;
    onChange(['Arduino Uno', 'LED', 'Resistor', 'Breadboard', 'Jumper wires']);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Component Manifest</span>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
            {selectedComponents.length} selected
          </span>
        </label>
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={handleSelectDefaults}
            disabled={disabled}
            className="text-cyan-600 dark:text-cyan-400 hover:underline transition-colors disabled:opacity-40 cursor-pointer font-medium"
          >
            Basic LED Setup
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {SUPPORTED_COMPONENTS.map((comp) => {
          const isSelected = selectedComponents.includes(comp.id);
          const Icon = comp.icon;

          return (
            <button
              key={comp.id}
              type="button"
              onClick={() => toggleComponent(comp.id)}
              disabled={disabled}
              className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-600 dark:border-cyan-500/80 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-100 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-tight truncate">{comp.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">{comp.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
