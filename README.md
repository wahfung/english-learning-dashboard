# 英语学习仪表板 (English Learning Dashboard)

30天英语学习追踪仪表板，帮助您记录听力、跟读、口语和词汇学习进度。

## 🛠 技术栈

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS + Recharts
- **Backend**: FastAPI + SQLModel + SQLite
- **数据库**: SQLite

## 🚀 启动指南 (How to Run)

### 本地开发

**后端:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**前端:**
```bash
cd frontend
npm install
npm run dev
```

### 单容器 Docker 运行

项目根目录外部提供独立 `Dockerfile`，从 `repo` 上一级目录构建并运行：

```bash
docker build -t english-learning-dashboard .
docker run -d --name english-learning-dashboard -p 3000:3000 english-learning-dashboard
```

## 🔗 服务地址 (Services)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api
- **API 文档 (Swagger)**: http://localhost:8000/docs（本地开发后端地址；容器内后端仅供前端代理访问）

## 📋 功能特性

### 仪表板 (/)
- 本月进度概览
- 每周活动统计
- 学习分类进度条

### 日历 (/calendar)
- 30天网格视图
- 颜色状态指示：灰色(未开始)、橙色(进行中)、红色(已完成)
- 点击进入日详情

### 日详情 (/day/[id])
- 编辑4个学习类别的实际时间
- 标记完成状态
- 添加学习笔记

### 统计 (/stats)
- 每周活动对比图
- 学习类别分布饼图
- 每日学习趋势
- 数据重置功能

## 📡 API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/days | 获取所有学习日 |
| GET | /api/day/{id} | 获取指定日期详情 |
| POST | /api/day/{id} | 更新指定日期数据 |
| GET | /api/summary | 获取统计汇总 |
| POST | /api/reset | 重置所有数据 |

## 📁 项目结构

```
english-learning-dashboard/
├── backend/
│   ├── main.py           # FastAPI 应用入口
│   ├── models.py         # SQLModel 数据模型
│   ├── database.py       # 数据库配置
│   ├── crud.py           # 数据库操作
│   ├── schemas.py        # Pydantic 模式
│   ├── routers/
│   │   └── days.py       # API 路由
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # 仪表板
│   │   ├── calendar/page.tsx     # 日历页
│   │   ├── stats/page.tsx        # 统计页
│   │   ├── day/[id]/page.tsx     # 日详情页
│   │   ├── layout.tsx            # 布局组件
│   │   └── globals.css           # 全局样式
│   ├── components/
│   │   ├── ProgressCard.tsx
│   │   ├── DayDetailForm.tsx
│   │   ├── CalendarGrid.tsx
│   │   └── StatsCharts.tsx
│   ├── lib/
│   │   └── api.ts                # API 客户端
│   ├── tailwind.config.ts
│   └── package.json
└── README.md
```

## 🎨 设计系统

调色板:
- Primary: #c21d03, #fd5732, #ffb787
- Accent: #393939, #bebebe
- Text: #232121, #4b4848
- Background: #fbfbfb, #f1f1f1, #c8c8c8

## 📝 开发说明

- 应用启动时自动创建数据库并播种30天初始数据
- 每个学习类别默认目标为30分钟
- 使用标准日志库输出结构化日志
- 前端使用 Error Boundary 和 Toast 提示处理错误
