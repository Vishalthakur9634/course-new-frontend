import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const SkillRadar = ({ courses, enrollments }) => {
    // Aggregate skills from course categories
    const processData = () => {
        if (!enrollments || enrollments.length === 0) {
            return [
                { subject: 'Frontend', A: 20, fullMark: 100 },
                { subject: 'Backend', A: 10, fullMark: 100 },
                { subject: 'Design', A: 40, fullMark: 100 },
                { subject: 'DevOps', A: 5, fullMark: 100 },
                { subject: 'AI/ML', A: 15, fullMark: 100 },
                { subject: 'Skills', A: 30, fullMark: 100 },
            ];
        }

        const categoryMap = {};
        enrollments.forEach(en => {
            if (!en.courseId) return;
            const category = en.courseId.category || 'General';
            if (!categoryMap[category]) {
                categoryMap[category] = { total: 0, count: 0 };
            }
            categoryMap[category].total += en.progress || 0;
            categoryMap[category].count += 1;
        });

        const data = Object.keys(categoryMap).map(cat => ({
            subject: cat,
            A: Math.round(categoryMap[cat].total / categoryMap[cat].count),
            fullMark: 100
        }));

        // Add defaults if data points are too few for a radar chart aesthetic
        if (data.length < 4) {
            const placeholders = ['Strategy', 'Architecture', 'Deployment', 'UX'];
            placeholders.forEach(p => {
                if (!categoryMap[p] && data.length < 6) {
                    data.push({ subject: p, A: 0, fullMark: 100 });
                }
            });
        }

        return data;
    };

    const data = processData();

    return (
        <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] border-white/5 space-y-3 md:space-y-4 h-[300px] md:h-[350px] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-32 bg-brand-primary/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="flex justify-between items-center relative z-10">
                <h3 className="text-[10px] md:text-xs font-black text-dark-muted uppercase tracking-widest">Skills Matrix</h3>
                <span className="text-[8px] md:text-[10px] font-bold text-brand-primary uppercase">Live Calibration</span>
            </div>

            <div className="w-full flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                        <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#ffa116"
                            strokeWidth={2}
                            fill="#ffa116"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SkillRadar;
