
import React from 'react';
import { Task, ProjectPhase } from '../types';

interface GanttChartProps {
  phases: ProjectPhase[];
}

const GanttChart: React.FC<GanttChartProps> = ({ phases }) => {
  const allTasks = phases.flatMap(p => p.tasks);
  
  // Calculate relative positions (simplified for demo)
  const getDayOffset = (dateStr: string) => {
    const start = new Date(allTasks[0]?.startDate || new Date().toISOString());
    const current = new Date(dateStr);
    const diffTime = Math.abs(current.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const dayWidth = 40;
  const maxDays = Math.max(...allTasks.map(t => getDayOffset(t.startDate) + t.durationDays)) + 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">Project Timeline (Gantt)</h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded"></span> Active</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Milestone</div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max relative" style={{ width: `${maxDays * dayWidth + 300}px` }}>
          {/* Header */}
          <div className="flex bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <div className="w-[300px] p-3 font-medium text-slate-500 border-r border-slate-200">Tasks</div>
            <div className="flex-1 flex">
              {Array.from({ length: maxDays }).map((_, i) => (
                <div key={i} className="w-[40px] p-2 text-center text-[10px] text-slate-400 border-r border-slate-100">
                  D{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="relative">
            {phases.map((phase, pIdx) => (
              <div key={pIdx}>
                <div className="flex bg-indigo-50/50 font-semibold text-xs text-indigo-700 p-2 uppercase tracking-wider border-b border-slate-100">
                  <div className="w-[300px]">{phase.name}</div>
                </div>
                {phase.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                    <div className="w-[300px] p-3 text-sm text-slate-700 border-r border-slate-200 flex items-center gap-2">
                      <div className="truncate">{task.title}</div>
                      <span className={`text-[10px] px-1.5 rounded ${
                        task.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex-1 relative h-12 gantt-grid">
                      <div 
                        className="absolute top-2 h-8 bg-indigo-500 rounded-md shadow-sm border border-indigo-600 flex items-center px-2 text-[10px] text-white font-medium overflow-hidden whitespace-nowrap"
                        style={{ 
                          left: `${getDayOffset(task.startDate) * dayWidth}px`, 
                          width: `${task.durationDays * dayWidth}px` 
                        }}
                      >
                        {task.durationDays > 1 && task.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
