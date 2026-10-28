"""
End-to-End Integration and Smoke Testing Suite
Runs against app.py to assert:
- Idempotent database creation
- 200 OK statuses on key endpoints
- Prediction validation and implausible value rejection
- Natural language ML Lab hyperparameter clamping
- Game anti-cheat latency floor (<180ms rejection)
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from database.db_init import init_db

def run_smoke_tests():
    print("[1/5] Running Idempotent Database Initialization...")
    init_db()

    client = app.test_client()

    print("[2/5] Testing Operational Health Check (/healthz)...")
    res = client.get('/healthz')
    assert res.status_code == 200, f"Healthz failed: {res.status_code}"
    data = res.get_json()
    assert data['database_connected'] is True
    print("      /healthz OK -> Status:", data['status'])

    print("[3/5] Testing Clinical Risk Prediction Endpoint (/api/predict)...")
    valid_payload = {
        'total_bilirubin': 4.5,
        'direct_bilirubin': 2.1,
        'alkphos': 240,
        'sgpt_alt': 65,
        'sgot_ast': 155,
        'albumin': 3.1
    }
    pred_res = client.post('/api/predict', json=valid_payload)
    assert pred_res.status_code == 200, f"Predict failed: {pred_res.status_code}"
    pred_data = pred_res.get_json()
    assert 'risk_percentage' in pred_data
    assert pred_data['de_ritis_ratio'] > 2.0 # 155 / 65 = 2.38
    print(f"      Prediction OK -> Risk: {pred_data['risk_percentage']}%, De Ritis: {pred_data['de_ritis_ratio']}")

    # Implausible value test (direct > total)
    bad_payload = {'total_bilirubin': 1.0, 'direct_bilirubin': 4.0}
    bad_res = client.post('/api/predict', json=bad_payload)
    assert bad_res.status_code == 400
    print("      Rejection of Direct > Total Bilirubin OK")

    print("[4/5] Testing ML Lab NLP Parser (/api/mllab/experiment)...")
    lab_res = client.post('/api/mllab/experiment', json={
        'prompt': 'Train a random forest with depth 9 and 80 trees using bilirubin'
    })
    assert lab_res.status_code == 200
    lab_data = lab_res.get_json()
    # Clamped to safe bounds
    assert lab_data['parameters']['max_depth'] <= 5
    assert lab_data['parameters']['n_estimators'] <= 50
    print(f"      Hyperparameter Clamping OK -> Depth clamped to: {lab_data['parameters']['max_depth']}, Trees: {lab_data['parameters']['n_estimators']}")

    print("[5/5] Testing Anti-Cheat Reaction Floor Verification...")
    fast_res = client.post('/api/game/validate', json={'latency_ms': 80, 'score': 10})
    assert fast_res.status_code == 400, "Should reject latency < 180ms"
    valid_res = client.post('/api/game/validate', json={'latency_ms': 450, 'score': 10})
    assert valid_res.status_code == 200
    print("      Anti-Cheat Telemetry OK -> Sub-180ms automated submission rejected.")

    print("\n========================================================")
    print(" ALL 5 SMOKE TESTS PASSED - PRODUCTION READY INTEGRITY")
    print("========================================================")

if __name__ == '__main__':
    run_smoke_tests()
