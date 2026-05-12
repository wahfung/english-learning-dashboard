"use client";

import { useState } from "react";
import { StudyDay, StudyDayUpdate } from "@/lib/api";

interface DayDetailFormProps {
    day: StudyDay;
    onSave: (data: StudyDayUpdate) => Promise<void>;
    loading?: boolean;
}

interface CategoryInputProps {
    label: string;
    icon: string;
    target: number;
    actual: number;
    done: boolean;
    onActualChange: (value: number) => void;
    onDoneChange: (value: boolean) => void;
    color: string;
}

function CategoryInput({
    label,
    icon,
    target,
    actual,
    done,
    onActualChange,
    onDoneChange,
    color,
}: CategoryInputProps) {
    const progress = target > 0 ? Math.min((actual / target) * 100, 100) : 0;

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <h3 className="font-semibold text-text-100">{label}</h3>
                        <p className="text-sm text-text-200">目标: {target} 分钟</p>
                    </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={done}
                        onChange={(e) => onDoneChange(e.target.checked)}
                        className="w-5 h-5 rounded border-bg-300 text-primary-200 focus:ring-primary-200"
                    />
                    <span className="text-sm text-text-200">完成</span>
                </label>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-text-200 w-16">实际:</span>
                    <input
                        type="number"
                        min="0"
                        max="999"
                        value={actual}
                        onChange={(e) => onActualChange(Math.max(0, parseInt(e.target.value) || 0))}
                        className="input-field flex-1"
                    />
                    <span className="text-sm text-text-200">分钟</span>
                </div>

                <div>
                    <div className="flex justify-between text-xs text-text-200 mb-1">
                        <span>完成进度</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-fill ${color}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DayDetailForm({
    day,
    onSave,
    loading,
}: DayDetailFormProps) {
    const [formData, setFormData] = useState({
        listening_actual: day.listening_actual,
        listening_done: day.listening_done,
        shadowing_actual: day.shadowing_actual,
        shadowing_done: day.shadowing_done,
        speaking_actual: day.speaking_actual,
        speaking_done: day.speaking_done,
        vocab_actual: day.vocab_actual,
        vocab_done: day.vocab_done,
        note: day.note,
    });

    const handleSave = async () => {
        await onSave(formData);
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <CategoryInput
                    label="听力练习"
                    icon="🎧"
                    target={day.listening_target}
                    actual={formData.listening_actual}
                    done={formData.listening_done}
                    onActualChange={(v) => setFormData({ ...formData, listening_actual: v })}
                    onDoneChange={(v) => setFormData({ ...formData, listening_done: v })}
                    color="bg-blue-500"
                />

                <CategoryInput
                    label="跟读练习"
                    icon="🗣️"
                    target={day.shadowing_target}
                    actual={formData.shadowing_actual}
                    done={formData.shadowing_done}
                    onActualChange={(v) => setFormData({ ...formData, shadowing_actual: v })}
                    onDoneChange={(v) => setFormData({ ...formData, shadowing_done: v })}
                    color="bg-emerald-500"
                />

                <CategoryInput
                    label="口语练习"
                    icon="💬"
                    target={day.speaking_target}
                    actual={formData.speaking_actual}
                    done={formData.speaking_done}
                    onActualChange={(v) => setFormData({ ...formData, speaking_actual: v })}
                    onDoneChange={(v) => setFormData({ ...formData, speaking_done: v })}
                    color="bg-orange-500"
                />

                <CategoryInput
                    label="词汇学习"
                    icon="📖"
                    target={day.vocab_target}
                    actual={formData.vocab_actual}
                    done={formData.vocab_done}
                    onActualChange={(v) => setFormData({ ...formData, vocab_actual: v })}
                    onDoneChange={(v) => setFormData({ ...formData, vocab_done: v })}
                    color="bg-purple-500"
                />
            </div>

            <div className="card">
                <h3 className="font-semibold text-text-100 mb-3 flex items-center gap-2">
                    <span>📝</span>
                    学习笔记
                </h3>
                <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="记录今天的学习心得、遇到的问题、需要复习的内容..."
                    className="input-field min-h-[120px] resize-y"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            保存中...
                        </>
                    ) : (
                        <>
                            <span>💾</span>
                            保存更改
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
