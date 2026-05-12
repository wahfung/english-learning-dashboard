# -*- coding: utf-8 -*-
"""数据库配置与会话管理"""

from sqlmodel import create_engine, Session, SQLModel

DATABASE_URL = "sqlite:///./learning.db"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}
)


def create_db_and_tables():
    """创建数据库表"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """获取数据库会话"""
    with Session(engine) as session:
        yield session
