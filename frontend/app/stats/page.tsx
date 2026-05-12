"use client";

import { useEffect, useState } from "react";
import StatsCharts from "@/components/StatsCharts";
import { fetchAllDays, fetchSummary, resetAllData, StudyDay, Summary } from "@/lib/api";

export default function StatsPage() {
    const [days, setDays] = useState<StudyDay[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

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
            setError("加载数据失败");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleReset = async () => {
        try {
            setResetting(true);
            await resetAllData();
            setShowResetConfirm(false);
            await loadData();
        } catch (err) {
            setError("重置失败");
            console.error(err);
        } finally {
            setResetting(false);
        }
    };

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-100">学习统计</h1>
                    <p className="text-text-200 mt-1">详细分析你的30天学习数据</p>
                </div>
                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="btn-secondary text-red-500 border-red-200 hover:bg-red-50"
                >
                    🔄 重置数据
                </button>
            </div>

            {/* 重置确认弹窗 */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="card max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-text-100 flex items-center gap-2">
                            <span>⚠️</span>
                            确认重置
                        </h3>
                        <p className="text-text-200 mt-2">
                            此操作将清除所有学习记录，将所有实际值重置为0。此操作不可撤销。
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="btn-secondary"
                                disabled={resetting}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleReset}
                                className="btn-primary bg-red-500 hover:bg-red-600"
                                disabled={resetting}
                            >
                                {resetting ? "重置中..." : "确认重置"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 概要统计卡片 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                            🎧
                        </div>
                        <div>
                            <p className="text-sm text-text-200">听力总时长</p>
                            <p className="text-xl font-bold text-text-100">
                                {summary?.total_listening_minutes || 0} 分钟
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                            🗣️
                        </div>
                        <div>
                            <p className="text-sm text-text-200">跟读总时长</p>
                            <p className="text-xl font-bold text-text-100">
                                {summary?.total_shadowing_minutes || 0} 分钟
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                            💬
                        </div>
                        <div>
                            <p className="text-sm text-text-200">口语总时长</p>
                            <p className="text-xl font-bold text-text-100">
                                {summary?.total_speaking_minutes || 0} 分钟
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                            📖
                        </div>
                        <div>
                            <p className="text-sm text-text-200">词汇总时长</p>
                            <p className="text-xl font-bold text-text-100">
                                {summary?.total_vocab_minutes || 0} 分钟
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 图表区域 */}
            <StatsCharts days={days} summary={summary} />
        </div>
    );
}
