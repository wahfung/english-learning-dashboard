# -*- coding: utf-8 -*-
"""SQLModel 数据模型定义"""

from typing import Optional
from sqlmodel import SQLModel, Field


class StudyDay(SQLModel, table=True):
    """学习日记录模型"""
    __tablename__ = "study_days"
    
    id: int = Field(primary_key=True, ge=1, le=30, description="第1-30天")
    date: Optional[str] = Field(default=None, description="ISO格式日期")
    
    # 听力
    listening_target: int = Field(default=30, description="听力目标(分钟)")
    listening_actual: int = Field(default=0, description="听力实际(分钟)")
    listening_done: bool = Field(default=False, description="听力是否完成")
    
    # 跟读
    shadowing_target: int = Field(default=30, description="跟读目标(分钟)")
    shadowing_actual: int = Field(default=0, description="跟读实际(分钟)")
    shadowing_done: bool = Field(default=False, description="跟读是否完成")
    
    # 口语
    speaking_target: int = Field(default=30, description="口语目标(分钟)")
    speaking_actual: int = Field(default=0, description="口语实际(分钟)")
    speaking_done: bool = Field(default=False, description="口语是否完成")
    
    # 词汇
    vocab_target: int = Field(default=30, description="词汇目标(分钟)")
    vocab_actual: int = Field(default=0, description="词汇实际(分钟)")
    vocab_done: bool = Field(default=False, description="词汇是否完成")
    
    # 笔记
    note: str = Field(default="", description="学习笔记")
