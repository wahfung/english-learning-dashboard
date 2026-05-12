import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// 响应拦截器
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.message);
        return Promise.reject(error);
    }
);

// 类型定义
export interface StudyDay {
    id: number;
    date: string | null;
    listening_target: number;
    listening_actual: number;
    listening_done: boolean;
    shadowing_target: number;
    shadowing_actual: number;
    shadowing_done: boolean;
    speaking_target: number;
    speaking_actual: number;
    speaking_done: boolean;
    vocab_target: number;
    vocab_actual: number;
    vocab_done: boolean;
    note: string;
}

export interface StudyDayUpdate {
    date?: string;
    listening_actual?: number;
    listening_done?: boolean;
    shadowing_actual?: number;
    shadowing_done?: boolean;
    speaking_actual?: number;
    speaking_done?: boolean;
    vocab_actual?: number;
    vocab_done?: boolean;
    note?: string;
}

export interface Summary {
    total_listening_minutes: number;
    total_shadowing_minutes: number;
    total_speaking_minutes: number;
    total_vocab_minutes: number;
    total_minutes: number;
    current_streak: number;
    total_days_completed: number;
    completion_percentage: number;
    average_daily_minutes: number;
}

// API 函数
export const fetchAllDays = async (): Promise<StudyDay[]> => {
    const response = await api.get("/days");
    return response.data;
};

export const fetchDayById = async (id: number): Promise<StudyDay> => {
    const response = await api.get(`/day/${id}`);
    return response.data;
};

export const updateDay = async (
    id: number,
    data: StudyDayUpdate
): Promise<StudyDay> => {
    const response = await api.post(`/day/${id}`, data);
    return response.data;
};

export const fetchSummary = async (): Promise<Summary> => {
    const response = await api.get("/summary");
    return response.data;
};

export const resetAllData = async (): Promise<{ message: string; success: boolean }> => {
    const response = await api.post("/reset");
    return response.data;
};

export default api;
