"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DayDetailForm from "@/components/DayDetailForm";
import { fetchDayById, updateDay, StudyDay, StudyDayUpdate } from "@/lib/api";

export default function DayDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dayId = parseInt(params.id as string, 10);

    const [day, setDay] = useState<StudyDay | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadDay = async () => {
            if (isNaN(dayId) || dayId < 1 || dayId > 30) {
                setError("无效的日期ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchDayById(dayId);
                setDay(data);
            } catch (err) {
                setError("加载数据失败");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDay();
    }, [dayId]);

    const handleSave = async (data: StudyDayUpdate) => {
        try {
            setSaving(true);
            setSuccess(false);
            const updated = await updateDay(dayId, data);
            setDay(updated);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("保存失败，请重试");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const totalTarget = day
        ? day.listening_target + day.shadowing_target + day.speaking_target + day.vocab_target
        : 0;
    const totalActual = day
        ? day.listening_actual + day.shadowing_actual + day.speaking_actual + day.vocab_actual
        : 0;
    const progressPercent = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

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

    if (error && !day) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="card text-center max-w-md">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="text-xl font-bold mt-4 text-text-100">加载失败</h2>
                    <p className="text-text-200 mt-2">{error}</p>
                    <Link href="/calendar" className="btn-primary mt-4 inline-block">
                        返回日历
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 面包屑导航 */}
            <div className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-text-200 hover:text-primary-200">
                    仪表板
                </Link>
                <span className="text-text-200">/</span>
                <Link href="/calendar" className="text-text-200 hover:text-primary-200">
                    日历
                </Link>
                <span className="text-text-200">/</span>
                <span className="text-text-100 font-medium">第 {dayId} 天</span>
            </div>

            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-100 flex items-center gap-3">
                        <span className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center text-white font-bold">
                            D{dayId}
                        </span>
                        第 {dayId} 天
                    </h1>
                    <p className="text-text-200 mt-1">记录今天的学习进度</p>
                </div>
                <div className="flex gap-2">
                    {dayId > 1 && (
                        <Link
                            href={`/day/${dayId - 1}`}
                            className="btn-secondary text-sm"
                        >
                            ← 前一天
                        </Link>
                    )}
                    {dayId < 30 && (
                        <Link
                            href={`/day/${dayId + 1}`}
                            className="btn-secondary text-sm"
                        >
                            后一天 →
                        </Link>
                    )}
                </div>
            </div>

            {/* 进度概览 */}
            <div className="card bg-gradient-to-r from-primary-100 to-primary-200 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90">今日总进度</p>
                        <p className="text-3xl font-bold mt-1">{totalActual} / {totalTarget} 分钟</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold">{progressPercent.toFixed(0)}%</p>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="progress-bar bg-white/30">
                        <div
                            className="progress-fill bg-white"
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 成功提示 */}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>✅</span>
                    <span>保存成功！</span>
                </div>
            )}

            {/* 错误提示 */}
            {error && day && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>❌</span>
                    <span>{error}</span>
                </div>
            )}

            {/* 表单 */}
            {day && (
                <DayDetailForm day={day} onSave={handleSave} loading={saving} />
            )}

            {/* 返回按钮 */}
            <div className="flex justify-center pt-4">
                <Link href="/calendar" className="btn-secondary">
                    ← 返回日历
                </Link>
            </div>
        </div>
    );
}
