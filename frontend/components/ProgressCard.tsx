"use client";

interface ProgressCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: string;
    progress?: number;
    color?: "primary" | "orange" | "green" | "blue";
}

const colorMap = {
    primary: {
        bg: "bg-gradient-to-br from-primary-100 to-primary-200",
        light: "bg-primary-300",
        text: "text-white",
    },
    orange: {
        bg: "bg-gradient-to-br from-orange-500 to-orange-400",
        light: "bg-orange-200",
        text: "text-white",
    },
    green: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-400",
        light: "bg-emerald-200",
        text: "text-white",
    },
    blue: {
        bg: "bg-gradient-to-br from-blue-500 to-blue-400",
        light: "bg-blue-200",
        text: "text-white",
    },
};

export default function ProgressCard({
    title,
    value,
    subtitle,
    icon,
    progress,
    color = "primary",
}: ProgressCardProps) {
    const colors = colorMap[color];

    return (
        <div className={`card ${colors.bg} ${colors.text}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                    {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
            </div>
            {typeof progress === "number" && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1 opacity-90">
                        <span>进度</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar bg-white/30">
                        <div
                            className="progress-fill bg-white"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
