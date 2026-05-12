"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const navItems = [
    { href: "/", label: "仪表板", icon: "📊" },
    { href: "/calendar", label: "日历", icon: "📅" },
    { href: "/stats", label: "统计", icon: "📈" },
];

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <html lang="zh-CN">
            <head>
                <title>英语学习仪表板 - 30天挑战</title>
                <meta name="description" content="30天英语学习追踪仪表板，帮助您记录听力、跟读、口语和词汇学习进度" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="min-h-screen bg-bg-100">
                <div className="flex min-h-screen">
                    {/* 侧边栏 */}
                    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-bg-200">
                        <div className="p-6 border-b border-bg-200">
                            <h1 className="text-xl font-bold text-primary-100 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                英语学习追踪
                            </h1>
                            <p className="text-sm text-text-200 mt-1">30天学习挑战</p>
                        </div>
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                                                    ? "bg-primary-200 text-white shadow-md"
                                                    : "text-text-100 hover:bg-bg-200"
                                                }`}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 border-t border-bg-200">
                            <div className="bg-gradient-to-br from-primary-300 to-primary-200 rounded-xl p-4 text-white">
                                <p className="text-sm font-medium">💪 坚持就是胜利！</p>
                                <p className="text-xs mt-1 opacity-90">每天进步一点点</p>
                            </div>
                        </div>
                    </aside>

                    {/* 移动端头部 */}
                    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-bg-200">
                        <div className="flex items-center justify-between p-4">
                            <h1 className="text-lg font-bold text-primary-100 flex items-center gap-2">
                                <span>📚</span>
                                英语学习追踪
                            </h1>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-bg-200 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                        {/* 移动端菜单 */}
                        {isMobileMenuOpen && (
                            <nav className="p-4 bg-white border-t border-bg-200">
                                <ul className="space-y-2">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                                                        ? "bg-primary-200 text-white"
                                                        : "text-text-100 hover:bg-bg-200"
                                                    }`}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>

                    {/* 主内容区 */}
                    <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
