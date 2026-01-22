
import React from 'react';
import { Task, TaskStatus, Priority } from '../types';

interface TaskBoardProps {
  tasks: Task[];
}

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-slate-100 border-slate-200 text-slate-600',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 border-blue-200 text-blue-600',
  [TaskStatus.REVIEW]: 'bg-amber-50 border-amber-200 text-amber-600',
  [TaskStatus.DONE]: 'bg-emerald-50 border-emerald-200 text-emerald-600',
};

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  const columns: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((status) => (
        <div key={status} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h4 className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${statusColors[status]}`}>
              {status.replace('_', ' ')}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              {tasks.filter(t => t.status === status).length}
            </span>
          </div>
          
          <div className="flex flex-col gap-3 min-h-[500px] bg-slate-100/50 p-3 rounded-2xl border border-slate-200/50">
            {tasks.filter(t => t.status === status).map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    task.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' :
                    task.priority === 'HIGH' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600">
                    AI
                  </div>
                </div>
                <h5 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{task.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {task.durationDays}d
                  </div>
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full border border-white bg-indigo-100 flex items-center justify-center text-[8px] text-indigo-600">
                      {task.id.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === status).length === 0 && (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-300 text-xs py-8">
                Drop items here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
