"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressCard from "@/components/ProgressCard";
import { fetchAllDays, fetchSummary, StudyDay, Summary } from "@/lib/api";

export default function DashboardPage() {
    const [days, setDays] = useState<StudyDay[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [daysData, summaryData] = await Promise.all([
                    fetchAllDays(),
                    fetchSummary(),
                ]);
                setDays(daysData);
                setSummary(summaryData);
            } catch (err) {
                setError("加载数据失败，请检查后端服务是否正常运行");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 准备周活动数据
    const weeklyActivity = [];
    for (let week = 0; week < 4; week++) {
        const weekDays = days.slice(week * 7, (week + 1) * 7);
        const total = weekDays.reduce(
            (sum, d) =>
                sum +
                d.listening_actual +
                d.shadowing_actual +
                d.speaking_actual +
                d.vocab_actual,
            0
        );
        weeklyActivity.push({ week: week + 1, total });
    }

    const maxWeekly = Math.max(...weeklyActivity.map((w) => w.total), 1);

    // 今日学习（假设当前为最近有数据的那天）
    const todayData = days.find(
        (d) =>
            d.listening_actual > 0 ||
            d.shadowing_actual > 0 ||
            d.speaking_actual > 0 ||
            d.vocab_actual > 0
    );
    const todayMinutes = todayData
        ? todayData.listening_actual +
        todayData.shadowing_actual +
        todayData.speaking_actual +
        todayData.vocab_actual
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4" />
                    <p className="text-text-200">加载中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="card text-center max-w-md">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="text-xl font-bold mt-4 text-text-100">加载失败</h2>
                    <p className="text-text-200 mt-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary mt-4"
                    >
                        重新加载
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 页面标题 */}
            <div>
                <h1 className="text-2xl font-bold text-text-100">学习仪表板</h1>
                <p className="text-text-200 mt-1">追踪你的30天英语学习旅程</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ProgressCard
                    title="本月进度"
                    value={`${summary?.completion_percentage.toFixed(0) || 0}%`}
                    subtitle={`${summary?.total_days_completed || 0}/30 天已完成`}
                    icon="🎯"
                    progress={summary?.completion_percentage || 0}
                    color="primary"
                />
                <ProgressCard
                    title="连续学习"
                    value={`${summary?.current_streak || 0} 天`}
                    subtitle="保持势头！"
                    icon="🔥"
                    color="orange"
                />
                <ProgressCard
                    title="总学习时长"
                    value={`${Math.floor((summary?.total_minutes || 0) / 60)}h`}
                    subtitle={`${(summary?.total_minutes || 0) % 60} 分钟`}
                    icon="⏱️"
                    color="green"
                />
                <ProgressCard
                    title="日均学习"
                    value={`${summary?.average_daily_minutes.toFixed(0) || 0}`}
                    subtitle="分钟/天"
                    icon="📊"
                    color="blue"
                />
            </div>

            {/* 每周活动 */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-text-100 flex items-center gap-2">
                        <span>📅</span>
                        每周活动概览
                    </h2>
                    <Link href="/calendar" className="text-primary-200 text-sm hover:underline">
                        查看日历 →
                    </Link>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {weeklyActivity.map((week) => (
                        <div key={week.week} className="text-center">
                            <div className="relative h-32 bg-bg-100 rounded-xl overflow-hidden mb-2">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-200 to-primary-300 transition-all duration-500"
                                    style={{ height: `${(week.total / maxWeekly) * 100}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-bold text-text-100">{week.total}分钟</span>
                                </div>
                            </div>
                            <p className="text-sm text-text-200">第{week.week}周</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 学习分类进度 */}
            <div className="card">
                <h2 className="text-lg font-semibold text-text-100 mb-6 flex items-center gap-2">
                    <span>📚</span>
                    学习分类进度
                </h2>
                <div className="space-y-4">
                    {[
                        { label: "听力练习", icon: "🎧", value: summary?.total_listening_minutes || 0, color: "bg-blue-500" },
                        { label: "跟读练习", icon: "🗣️", value: summary?.total_shadowing_minutes || 0, color: "bg-emerald-500" },
                        { label: "口语练习", icon: "💬", value: summary?.total_speaking_minutes || 0, color: "bg-orange-500" },
                        { label: "词汇学习", icon: "📖", value: summary?.total_vocab_minutes || 0, color: "bg-purple-500" },
                    ].map((cat, idx) => {
                        const maxCategoryMinutes = Math.max(
                            summary?.total_listening_minutes || 0,
                            summary?.total_shadowing_minutes || 0,
                            summary?.total_speaking_minutes || 0,
                            summary?.total_vocab_minutes || 0,
                            1
                        );
                        const percentage = (cat.value / maxCategoryMinutes) * 100;

                        return (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-2xl w-10">{cat.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-text-100">{cat.label}</span>
                                        <span className="text-sm text-text-200">{cat.value} 分钟</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className={`progress-fill ${cat.color}`} style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 快捷操作 */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Link
                    href="/calendar"
                    className="card hover:shadow-lg transition-all group flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-primary-300 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        📅
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-100">日历视图</h3>
                        <p className="text-sm text-text-200">查看30天学习日历</p>
                    </div>
                </Link>
                <Link
                    href="/stats"
                    className="card hover:shadow-lg transition-all group flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-emerald-200 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        📈
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-100">统计分析</h3>
                        <p className="text-sm text-text-200">查看详细学习数据</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
