# -*- coding: utf-8 -*-
"""数据库 CRUD 操作"""

from typing import List, Optional
from sqlmodel import Session, select
from models import StudyDay
from schemas import StudyDayUpdate


def get_all_days(session: Session) -> List[StudyDay]:
    """获取所有学习日"""
    statement = select(StudyDay).order_by(StudyDay.id)
    return session.exec(statement).all()


def get_day_by_id(session: Session, day_id: int) -> Optional[StudyDay]:
    """根据ID获取学习日"""
    return session.get(StudyDay, day_id)


def update_day(session: Session, day_id: int, data: StudyDayUpdate) -> Optional[StudyDay]:
    """更新学习日数据"""
    day = session.get(StudyDay, day_id)
    if not day:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(day, key, value)
    
    session.add(day)
    session.commit()
    session.refresh(day)
    return day


def reset_all_days(session: Session) -> bool:
    """重置所有学习日的实际值为0"""
    days = get_all_days(session)
    for day in days:
        day.listening_actual = 0
        day.listening_done = False
        day.shadowing_actual = 0
        day.shadowing_done = False
        day.speaking_actual = 0
        day.speaking_done = False
        day.vocab_actual = 0
        day.vocab_done = False
        day.note = ""
        session.add(day)
    session.commit()
    return True


def seed_initial_data(session: Session) -> None:
    """初始化30天学习数据"""
    existing = session.exec(select(StudyDay)).first()
    if existing:
        return
    
    for i in range(1, 31):
        day = StudyDay(
            id=i,
            listening_target=30,
            listening_actual=0,
            listening_done=False,
            shadowing_target=30,
            shadowing_actual=0,
            shadowing_done=False,
            speaking_target=30,
            speaking_actual=0,
            speaking_done=False,
            vocab_target=30,
            vocab_actual=0,
            vocab_done=False,
            note=""
        )
        session.add(day)
    session.commit()


def calculate_summary(session: Session) -> dict:
    """计算汇总统计"""
    days = get_all_days(session)
    
    total_listening = sum(d.listening_actual for d in days)
    total_shadowing = sum(d.shadowing_actual for d in days)
    total_speaking = sum(d.speaking_actual for d in days)
    total_vocab = sum(d.vocab_actual for d in days)
    total_minutes = total_listening + total_shadowing + total_speaking + total_vocab
    
    # 计算完成的天数（一天所有任务都完成才算完成）
    completed_days = sum(
        1 for d in days 
        if d.listening_done and d.shadowing_done and d.speaking_done and d.vocab_done
    )
    
    # 计算连续天数
    streak = 0
    for d in days:
        if d.listening_done and d.shadowing_done and d.speaking_done and d.vocab_done:
            streak += 1
        else:
            break
    
    # 计算完成百分比
    completion_percentage = (completed_days / 30) * 100 if days else 0
    
    # 计算每天平均分钟数
    days_with_activity = sum(
        1 for d in days 
        if (d.listening_actual + d.shadowing_actual + d.speaking_actual + d.vocab_actual) > 0
    )
    average_daily = total_minutes / days_with_activity if days_with_activity > 0 else 0
    
    return {
        "total_listening_minutes": total_listening,
        "total_shadowing_minutes": total_shadowing,
        "total_speaking_minutes": total_speaking,
        "total_vocab_minutes": total_vocab,
        "total_minutes": total_minutes,
        "current_streak": streak,
        "total_days_completed": completed_days,
        "completion_percentage": round(completion_percentage, 2),
        "average_daily_minutes": round(average_daily, 2)
    }
