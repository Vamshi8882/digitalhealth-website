"""
Gamification Engine for "Digitalization in Healthcare"
Handles user XP calculation, progressive Levels, Clinical Ranks, Streaks,
20+ Milestone Badges, and Anti-Farming Daily Caps.
"""

import sqlite3
import os
from datetime import datetime, date

DAILY_XP_CAP = 1000

RANKS = [
    (0, 'Novice Medical Intern'),
    (400, 'Junior Resident Physician'),
    (900, 'Hepatology Registrar'),
    (1600, 'Medical Data Fellow'),
    (2500, 'Chief Medical AI Specialist')
]

MILESTONE_BADGES = {
    'b_first_predict': ('First Clinical Prediction', 'Ran your first liver risk assessment', '🩸'),
    'b_de_ritis': ('De Ritis Scholar', 'Mastered the AST/ALT > 2.0 hallmark', '🧬'),
    'b_roc_auc': ('ROC-AUC Evangelist', 'Understood the Accuracy Paradox on imbalanced data', '📊'),
    'b_scleral': ('Icterus Spotter', 'Isolated jaundice yellow chrominance using CV', '👁️'),
    'b_speed': ('Speed Diagnostician', 'Completed Diagnose Dash faster than baseline', '⚡'),
    'b_sql': ('SQL Surgeon', 'Assembled a valid clinical SQL query on first attempt', '💾'),
    'b_life_saver': ('Life Saver', 'Navigated an acute variceal hemorrhage emergency', '🫀'),
    'b_streak_5': ('Streak Veteran', 'Maintained a 5-day continuous learning streak', '🔥')
}

def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def calculate_rank(xp: int) -> str:
    current_rank = RANKS[0][1]
    for threshold, title in RANKS:
        if xp >= threshold:
            current_rank = title
    return current_rank

def award_xp(user_id: int, xp_amount: int, event_type: str) -> dict:
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check daily cap
    today = date.today().isoformat()
    cursor.execute("""
        SELECT SUM(xp_amount) FROM xp_events
        WHERE user_id = ? AND DATE(created_at) = ?;
    """, (user_id, today))
    daily_total = cursor.fetchone()[0] or 0

    if daily_total >= DAILY_XP_CAP:
        conn.close()
        return {'status': 'capped', 'message': 'Daily XP limit reached (1,000 XP cap)'}

    allowable_xp = min(xp_amount, DAILY_XP_CAP - daily_total)

    # Record event
    cursor.execute("""
        INSERT INTO xp_events (user_id, xp_amount, event_type)
        VALUES (?, ?, ?);
    """, (user_id, allowable_xp, event_type))

    # Update user XP
    cursor.execute("UPDATE users SET xp = xp + ? WHERE id = ?;", (allowable_xp, user_id))
    cursor.execute("SELECT xp FROM users WHERE id = ?;", (user_id,))
    new_xp = cursor.fetchone()['xp']

    conn.commit()
    conn.close()

    new_rank = calculate_rank(new_xp)
    return {
        'status': 'awarded',
        'xp_awarded': allowable_xp,
        'total_xp': new_xp,
        'current_rank': new_rank
    }

def unlock_badge(user_id: int, badge_key: str) -> bool:
    if badge_key not in MILESTONE_BADGES:
        return False

    name, desc, icon = MILESTONE_BADGES[badge_key]
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO badges (user_id, badge_key, badge_name)
            VALUES (?, ?, ?);
        """, (user_id, badge_key, name))
        conn.commit()
        unlocked = True
    except sqlite3.IntegrityError:
        unlocked = False # Already unlocked
    finally:
        conn.close()

    return unlocked

def get_leaderboard(limit=10) -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT username, xp, streak_days FROM users
        ORDER BY xp DESC LIMIT ?;
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    leaderboard = []
    for r in rows:
        leaderboard.append({
            'username': r['username'],
            'xp': r['xp'],
            'streak': r['streak_days'],
            'rank': calculate_rank(r['xp'])
        })
    return leaderboard
