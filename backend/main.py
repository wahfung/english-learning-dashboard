# -*- coding: utf-8 -*-
"""FastAPI 应用入口"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from database import create_db_and_tables, engine
from routers.days import router as days_router
from crud import seed_initial_data

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("Starting application...")
    
    # 创建数据库表
    create_db_and_tables()
    logger.info("Database tables created")
    
    # 播种初始数据
    with Session(engine) as session:
        seed_initial_data(session)
        logger.info("Initial data seeded")
    
    yield
    
    logger.info("Shutting down application...")


app = FastAPI(
    title="English Learning Dashboard API",
    description="30天英语学习仪表板后端API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(days_router)


@app.get("/")
async def root():
    """健康检查端点"""
    return {"status": "healthy", "service": "English Learning Dashboard API"}


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}
