"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { StudyDay, Summary } from "@/lib/api";

interface StatsChartsProps {
    days: StudyDay[];
    summary: Summary | null;
}

const COLORS = {
    listening: "#3B82F6",
    shadowing: "#10B981",
    speaking: "#F97316",
    vocab: "#8B5CF6",
};

export default function StatsCharts({ days, summary }: StatsChartsProps) {
    // 准备周数据
    const weeklyData = [];
    for (let week = 0; week < 5; week++) {
        const weekDays = days.slice(week * 7, (week + 1) * 7);
        if (weekDays.length === 0) continue;

        const weekTotal = {
            name: `第${week + 1}周`,
            listening: weekDays.reduce((sum, d) => sum + d.listening_actual, 0),
            shadowing: weekDays.reduce((sum, d) => sum + d.shadowing_actual, 0),
            speaking: weekDays.reduce((sum, d) => sum + d.speaking_actual, 0),
            vocab: weekDays.reduce((sum, d) => sum + d.vocab_actual, 0),
        };
        weeklyData.push(weekTotal);
    }

    // 准备类别总计数据
    const categoryData = summary
        ? [
            { name: "听力", value: summary.total_listening_minutes, color: COLORS.listening },
            { name: "跟读", value: summary.total_shadowing_minutes, color: COLORS.shadowing },
            { name: "口语", value: summary.total_speaking_minutes, color: COLORS.speaking },
            { name: "词汇", value: summary.total_vocab_minutes, color: COLORS.vocab },
        ]
        : [];

    // 每日趋势数据
    const dailyTrend = days.map((day) => ({
        name: `D${day.id}`,
        total:
            day.listening_actual +
            day.shadowing_actual +
            day.speaking_actual +
            day.vocab_actual,
    }));

    return (
        <div className="space-y-8">
            {/* 每周活动对比 */}
            <div className="card">
                <h3 className="font-semibold text-text-100 mb-4 flex items-center gap-2">
                    <span>📊</span>
                    每周活动对比
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" tick={{ fill: "#4b4848" }} />
                            <YAxis tick={{ fill: "#4b4848" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="listening" name="听力" fill={COLORS.listening} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="shadowing" name="跟读" fill={COLORS.shadowing} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="speaking" name="口语" fill={COLORS.speaking} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="vocab" name="词汇" fill={COLORS.vocab} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* 类别分布饼图 */}
                <div className="card">
                    <h3 className="font-semibold text-text-100 mb-4 flex items-center gap-2">
                        <span>🎯</span>
                        学习类别分布
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value} 分钟`, ""]}
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "8px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 统计汇总卡片 */}
                <div className="card">
                    <h3 className="font-semibold text-text-100 mb-4 flex items-center gap-2">
                        <span>📈</span>
                        统计概览
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-bg-100 rounded-xl">
                            <span className="text-text-200">总学习时间</span>
                            <span className="font-bold text-primary-100">
                                {summary ? Math.floor(summary.total_minutes / 60) : 0} 小时{" "}
                                {summary ? summary.total_minutes % 60 : 0} 分钟
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-bg-100 rounded-xl">
                            <span className="text-text-200">完成天数</span>
                            <span className="font-bold text-emerald-600">
                                {summary?.total_days_completed || 0} / 30 天
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-bg-100 rounded-xl">
                            <span className="text-text-200">当前连续天数</span>
                            <span className="font-bold text-orange-500">
                                {summary?.current_streak || 0} 天
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-bg-100 rounded-xl">
                            <span className="text-text-200">日均学习</span>
                            <span className="font-bold text-blue-500">
                                {summary?.average_daily_minutes.toFixed(1) || 0} 分钟
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 每日趋势 */}
            <div className="card">
                <h3 className="font-semibold text-text-100 mb-4 flex items-center gap-2">
                    <span>📉</span>
                    每日学习趋势
                </h3>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                            <XAxis dataKey="name" tick={{ fill: "#4b4848", fontSize: 10 }} />
                            <YAxis tick={{ fill: "#4b4848" }} />
                            <Tooltip
                                formatter={(value: number) => [`${value} 分钟`, "学习时间"]}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar
                                dataKey="total"
                                fill="#fd5732"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
