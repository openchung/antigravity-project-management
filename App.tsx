
import React, { useState, useEffect } from 'react';
import { ProjectPlan, Task, Issue, Resource } from './types';
import { generateProjectPlan } from './services/geminiService';
import GanttChart from './components/GanttChart';
import TaskBoard from './components/TaskBoard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gantt' | 'tasks' | 'team'>('overview');
  const [requirement, setRequirement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const plan = await generateProjectPlan(requirement);
      setProjectPlan(plan);
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.message || 'Failed to generate project plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const allTasks = projectPlan?.phases.flatMap(p => p.tasks) || [];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">M</div>
            Maestro AI
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: 'M4 6h16M4 12h16M4 18h16' },
            { id: 'gantt', label: 'Timeline', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'tasks', label: 'Tasks & Board', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'team', label: 'Team Members', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/20">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Pro Plan</h4>
            <p className="text-[10px] text-indigo-200/70 mb-3">Unlock advanced AI analysis and unlimited seats.</p>
            <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition-colors">Upgrade</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="font-bold text-slate-800">
            {projectPlan ? projectPlan.projectName : 'AI Project Management'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative group">
               <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/32/32?u=admin" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Initial Input Section */}
          {!projectPlan && !isGenerating && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">What are you building today?</h1>
              <p className="text-slate-500 mb-8 text-lg">Describe your project requirements, and I'll generate a complete execution plan including tasks, roles, and a timeline.</p>
              
              <form onSubmit={handleGenerate} className="relative group">
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="e.g., Build a React-based e-commerce mobile app with Stripe integration and user authentication..."
                  className="w-full h-40 p-6 rounded-2xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 resize-none shadow-sm group-hover:shadow-md"
                />
                <button
                  type="submit"
                  disabled={!requirement.trim()}
                  className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  Analyze & Plan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="max-w-md mx-auto py-32 text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                   <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Architecting your project...</h3>
              <p className="text-slate-500 animate-pulse">Our AI is breaking down tasks and estimating resources.</p>
            </div>
          )}

          {/* Project View */}
          {projectPlan && !isGenerating && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Tasks', value: allTasks.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'indigo' },
                      { label: 'Estimated Days', value: Math.ceil(allTasks.reduce((acc, t) => acc + t.durationDays, 0) / 2.5), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
                      { label: 'Team Size', value: projectPlan.suggestedTeam.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'emerald' },
                      { label: 'Risk Level', value: 'Low', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'rose' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</h4>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Project Description */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Project Strategy
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{projectPlan.description}</p>
                      </div>

                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                         <h3 className="text-xl font-bold text-slate-900 mb-6">Phase Breakdown</h3>
                         <div className="space-y-4">
                           {projectPlan.phases.map((phase, i) => (
                             <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                               <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">{i+1}</div>
                               <div>
                                 <h4 className="font-bold text-slate-800">{phase.name}</h4>
                                 <p className="text-sm text-slate-500">{phase.tasks.length} specific tasks defined</p>
                               </div>
                             </div>
                           ))}
                         </div>
                      </div>
                    </div>

                    {/* Team Suggestion */}
                    <div className="space-y-6">
                      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          Team Recommendation
                        </h3>
                        <div className="space-y-6">
                          {projectPlan.suggestedTeam.map((member, i) => (
                            <div key={i} className="flex gap-4">
                              <img src={`https://picsum.photos/40/40?u=${member.id}`} className="w-10 h-10 rounded-xl object-cover bg-slate-800" alt={member.name} />
                              <div>
                                <h4 className="text-sm font-bold text-slate-100">{member.name}</h4>
                                <p className="text-xs text-slate-400 mb-2">{member.role}</p>
                                <div className="flex flex-wrap gap-1">
                                  {member.skills.slice(0, 3).map((skill, j) => (
                                    <span key={j} className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all">
                          Hire Suggested Team
                        </button>
                      </div>

                      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">SMART PLANNER</span>
                        </div>
                        <h4 className="font-bold mb-2">AI Optimization Available</h4>
                        <p className="text-xs text-indigo-100/80 mb-4 leading-relaxed">Let AI automatically redistribute workload based on team availability and task difficulty.</p>
                        <button className="w-full py-2 bg-white text-indigo-600 font-bold text-xs rounded-lg shadow-sm">Enable Auto-Pilot</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gantt' && <GanttChart phases={projectPlan.phases} />}
              
              {activeTab === 'tasks' && <TaskBoard tasks={allTasks} />}
              
              {activeTab === 'team' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                   {projectPlan.suggestedTeam.map((member, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                       <div className="flex items-center gap-4 mb-6">
                         <img src={`https://picsum.photos/64/64?u=${member.id}`} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={member.name} />
                         <div>
                           <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
                           <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
                         </div>
                       </div>
                       <div className="space-y-4">
                         <div>
                           <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Expertise</p>
                           <div className="flex flex-wrap gap-2">
                             {member.skills.map((skill, j) => (
                               <span key={j} className="px-3 py-1 bg-slate-50 border border-slate-100 text-xs text-slate-600 rounded-lg">
                                 {skill}
                               </span>
                             ))}
                           </div>
                         </div>
                         <div className="pt-4 border-t border-slate-50 flex gap-2">
                           <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">View Portfolio</button>
                           <button className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-lg transition-colors">Assign Tasks</button>
                         </div>
                       </div>
                     </div>
                   ))}
                   <button className="h-[240px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all bg-white/50">
                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                     </div>
                     <span className="font-bold">Add Team Member</span>
                   </button>
                 </div>
              )}
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h4 className="font-bold">Generation Failed</h4>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Helper */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-lg text-slate-700 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Ask Maestro AI
          </div>
        </button>
      </div>
    </div>
  );
};

export default App;
