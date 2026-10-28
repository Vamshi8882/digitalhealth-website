"""
Server-Authoritative Mini-Game Engines & Anti-Cheat Telemetry
1. Lab Rapid-Fire
2. Diagnose Dash
3. Memory Match
4. SQL Clause Sorter
5. Quiz Blitz
6. Life-Saver Sim
"""

import time
import random
from gamification import award_xp, unlock_badge

# Anti-cheat constants
HUMAN_LATENCY_FLOOR_MS = 180

def validate_submission_telemetry(latency_ms: int) -> bool:
    """Rejects instantaneous robotic / automation loop submissions."""
    if latency_ms < HUMAN_LATENCY_FLOOR_MS:
        return False
    return True

# 1. Lab Rapid-Fire Server Question Generator
def get_rapid_fire_question():
    markers = [
        {'name': 'Total Bilirubin', 'min': 0.2, 'max': 1.2, 'unit': 'mg/dL'},
        {'name': 'Direct Bilirubin', 'min': 0.0, 'max': 0.3, 'unit': 'mg/dL'},
        {'name': 'Alkaline Phosphatase', 'min': 44, 'max': 147, 'unit': 'IU/L'},
        {'name': 'ALT (SGPT)', 'min': 7, 'max': 56, 'unit': 'IU/L'},
        {'name': 'AST (SGOT)', 'min': 10, 'max': 40, 'unit': 'IU/L'},
        {'name': 'Albumin', 'min': 3.5, 'max': 5.0, 'unit': 'g/dL'}
    ]
    m = random.choice(markers)
    roll = random.random()

    if roll < 0.33:
        cat = 'Low'
        val = round(m['min'] * 0.4 + random.random() * (m['min'] * 0.4), 1)
    elif roll < 0.66:
        cat = 'Normal'
        val = round(m['min'] + random.random() * (m['max'] - m['min']), 1)
    else:
        cat = 'High'
        val = round(m['max'] * 1.4 + random.random() * (m['max'] * 1.5), 1)

    return {
        'marker': m['name'],
        'value': val,
        'unit': m['unit'],
        'correct_category': cat,
        'server_timestamp': int(time.time() * 1000)
    }

# 2. SQL Clause Sorter Validation
def validate_sql_order(clauses: list) -> bool:
    expected = ['SELECT', 'FROM', 'WHERE', 'ORDER BY']
    clean_clauses = [c.strip().split()[0].upper() for c in clauses]
    return clean_clauses == expected

# 3. Life-Saver Sim Branching Engine
SIMULATION_SCENARIOS = {
    1: {
        'scenario': '52yo cirrhotic with hematemesis and BP 88/50 mmHg.',
        'options': [
            {'text': 'IV crystalloid fluids & Call 112 / Endoscopy', 'next': 2, 'correct': True},
            {'text': 'Oral aspirin for pain relief', 'next': -1, 'correct': False}
        ]
    },
    2: {
        'scenario': 'Variceal bleeding localized. Patient confused, ammonia 145 umol/L.',
        'options': [
            {'text': 'Administer oral Lactulose', 'next': 99, 'correct': True},
            {'text': 'Sedatives to put patient to sleep', 'next': -1, 'correct': False}
        ]
    }
}

def evaluate_sim_step(step_id: int, choice_index: int) -> dict:
    step = SIMULATION_SCENARIOS.get(step_id)
    if not step or choice_index >= len(step['options']):
        return {'status': 'error', 'message': 'Invalid step or choice.'}

    choice = step['options'][choice_index]
    if not choice['correct']:
        return {'status': 'failed', 'message': 'Patient deteriorated due to contraindicated intervention.'}
    elif choice['next'] == 99:
        return {'status': 'stabilized', 'message': 'Patient successfully resuscitated and stabilized!'}
    else:
        return {'status': 'progress', 'next_step': choice['next']}
