"use client";

import { useEffect, useState } from "react";
import CalendarGrid, { CalendarLegend } from "@/components/CalendarGrid";
import { fetchAllDays, StudyDay } from "@/lib/api";

export default function CalendarPage() {
    const [days, setDays] = useState<StudyDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchAllDays();
                setDays(data);
            } catch (err) {
                setError("加载数据失败");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 计算统计
    const completedDays = days.filter(
        (d) => d.listening_done && d.shadowing_done && d.speaking_done && d.vocab_done
    ).length;
    const inProgressDays = days.filter((d) => {
        const total = d.listening_actual + d.shadowing_actual + d.speaking_actual + d.vocab_actual;
        const allDone = d.listening_done && d.shadowing_done && d.speaking_done && d.vocab_done;
        return total > 0 && !allDone;
    }).length;
    const notStartedDays = 30 - completedDays - inProgressDays;

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
                <h1 className="text-2xl font-bold text-text-100">30天学习日历</h1>
                <p className="text-text-200 mt-1">点击任意日期查看详情并记录学习进度</p>
            </div>

            {/* 统计概览 */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="card bg-gradient-to-br from-primary-100 to-primary-200 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">已完成</p>
                            <p className="text-3xl font-bold">{completedDays} 天</p>
                        </div>
                        <span className="text-4xl">✅</span>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-primary-300 to-orange-300 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">进行中</p>
                            <p className="text-3xl font-bold">{inProgressDays} 天</p>
                        </div>
                        <span className="text-4xl">🔄</span>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-accent-200 to-bg-300 text-text-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-200">未开始</p>
                            <p className="text-3xl font-bold">{notStartedDays} 天</p>
                        </div>
                        <span className="text-4xl">⏳</span>
                    </div>
                </div>
            </div>

            {/* 日历网格 */}
            <div className="card">
                <h2 className="text-lg font-semibold text-text-100 mb-6 flex items-center gap-2">
                    <span>📅</span>
                    学习日历
                </h2>
                <CalendarGrid days={days} loading={loading} />
                <CalendarLegend />
            </div>

            {/* 使用提示 */}
            <div className="card bg-bg-100 border border-bg-300">
                <h3 className="font-semibold text-text-100 mb-2 flex items-center gap-2">
                    <span>💡</span>
                    使用提示
                </h3>
                <ul className="text-sm text-text-200 space-y-1">
                    <li>• 点击任意日期方块进入详情页面</li>
                    <li>• 在详情页面记录每个学习类别的实际学习时间</li>
                    <li>• 完成所有类别目标后，该天将显示为红色</li>
                    <li>• 建议每天固定时间进行学习，养成习惯</li>
                </ul>
            </div>
        </div>
    );
}
