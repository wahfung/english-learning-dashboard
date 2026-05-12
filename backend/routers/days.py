# -*- coding: utf-8 -*-
"""API 路由端点"""

import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database import get_session
from schemas import StudyDayRead, StudyDayUpdate, SummaryResponse, MessageResponse
import crud

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["days"])


@router.get("/days", response_model=List[StudyDayRead])
def get_all_days(session: Session = Depends(get_session)):
    """获取所有学习日列表"""
    logger.info("Fetching all study days")
    days = crud.get_all_days(session)
    return days


@router.get("/day/{day_id}", response_model=StudyDayRead)
def get_day(day_id: int, session: Session = Depends(get_session)):
    """获取单个学习日详情"""
    if day_id < 1 or day_id > 30:
        raise HTTPException(status_code=400, detail="Day ID must be between 1 and 30")
    
    logger.info(f"Fetching day {day_id}")
    day = crud.get_day_by_id(session, day_id)
    if not day:
        raise HTTPException(status_code=404, detail=f"Day {day_id} not found")
    return day


@router.post("/day/{day_id}", response_model=StudyDayRead)
def update_day(day_id: int, data: StudyDayUpdate, session: Session = Depends(get_session)):
    """更新学习日数据"""
    if day_id < 1 or day_id > 30:
        raise HTTPException(status_code=400, detail="Day ID must be between 1 and 30")
    
    logger.info(f"Updating day {day_id} with data: {data.model_dump(exclude_unset=True)}")
    day = crud.update_day(session, day_id, data)
    if not day:
        raise HTTPException(status_code=404, detail=f"Day {day_id} not found")
    return day


@router.get("/summary", response_model=SummaryResponse)
def get_summary(session: Session = Depends(get_session)):
    """获取学习统计汇总"""
    logger.info("Calculating summary statistics")
    summary = crud.calculate_summary(session)
    return SummaryResponse(**summary)


@router.post("/reset", response_model=MessageResponse)
def reset_data(session: Session = Depends(get_session)):
    """重置所有学习数据"""
    logger.info("Resetting all study data")
    success = crud.reset_all_days(session)
    if success:
        return MessageResponse(message="All data has been reset successfully", success=True)
    return MessageResponse(message="Failed to reset data", success=False)
