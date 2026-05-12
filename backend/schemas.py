# -*- coding: utf-8 -*-
"""Pydantic 请求/响应模式"""

from typing import Optional, List
from pydantic import BaseModel, Field


class StudyDayRead(BaseModel):
    """读取学习日响应"""
    id: int
    date: Optional[str] = None
    listening_target: int
    listening_actual: int
    listening_done: bool
    shadowing_target: int
    shadowing_actual: int
    shadowing_done: bool
    speaking_target: int
    speaking_actual: int
    speaking_done: bool
    vocab_target: int
    vocab_actual: int
    vocab_done: bool
    note: str

    class Config:
        from_attributes = True


class StudyDayUpdate(BaseModel):
    """更新学习日请求"""
    date: Optional[str] = None
    listening_actual: Optional[int] = Field(None, ge=0)
    listening_done: Optional[bool] = None
    shadowing_actual: Optional[int] = Field(None, ge=0)
    shadowing_done: Optional[bool] = None
    speaking_actual: Optional[int] = Field(None, ge=0)
    speaking_done: Optional[bool] = None
    vocab_actual: Optional[int] = Field(None, ge=0)
    vocab_done: Optional[bool] = None
    note: Optional[str] = None


class SummaryResponse(BaseModel):
    """汇总统计响应"""
    total_listening_minutes: int
    total_shadowing_minutes: int
    total_speaking_minutes: int
    total_vocab_minutes: int
    total_minutes: int
    current_streak: int
    total_days_completed: int
    completion_percentage: float
    average_daily_minutes: float


class MessageResponse(BaseModel):
    """通用消息响应"""
    message: str
    success: bool
