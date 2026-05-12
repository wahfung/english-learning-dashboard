"use client";

import Link from "next/link";
import { StudyDay } from "@/lib/api";

interface CalendarGridProps {
    days: StudyDay[];
    loading?: boolean;
}

const getDayStatus = (day: StudyDay): "empty" | "progress" | "complete" => {
    const totalActual =
        day.listening_actual +
        day.shadowing_actual +
        day.speaking_actual +
        day.vocab_actual;

    if (totalActual === 0) return "empty";
    if (
        day.listening_done &&
        day.shadowing_done &&
        day.speaking_done &&
        day.vocab_done
    ) {
        return "complete";
    }
    return "progress";
};

const getStatusColor = (status: "empty" | "progress" | "complete"): string => {
    switch (status) {
        case "empty":
            return "bg-accent-200 hover:bg-bg-300";
        case "progress":
            return "bg-primary-300 hover:bg-primary-200";
        case "complete":
            return "bg-primary-100 hover:bg-primary-100/90";
    }
};

const getStatusText = (status: "empty" | "progress" | "complete"): string => {
    switch (status) {
        case "empty":
            return "未开始";
        case "progress":
            return "进行中";
        case "complete":
            return "已完成";
    }
};

export default function CalendarGrid({ days, loading }: CalendarGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-3">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square skeleton rounded-xl"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-3">
            {days.map((day) => {
                const status = getDayStatus(day);
                const colorClass = getStatusColor(status);
                const totalMinutes =
                    day.listening_actual +
                    day.shadowing_actual +
                    day.speaking_actual +
                    day.vocab_actual;

                return (
                    <Link
                        key={day.id}
                        href={`/day/${day.id}`}
                        className={`aspect-square ${colorClass} rounded-xl flex flex-col items-center justify-center 
                        transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                        ${status === "complete" ? "text-white" : "text-text-100"}`}
                    >
                        <span className="text-lg font-bold">D{day.id}</span>
                        <span className="text-xs mt-1 opacity-80">
                            {totalMinutes > 0 ? `${totalMinutes}分钟` : "—"}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}

export function CalendarLegend() {
    return (
        <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent-200" />
                <span className="text-sm text-text-200">未开始</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary-300" />
                <span className="text-sm text-text-200">进行中</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary-100" />
                <span className="text-sm text-text-200">已完成</span>
            </div>
        </div>
    );
}
