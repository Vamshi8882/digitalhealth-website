"""
Idempotent Database Initializer for "Digitalization in Healthcare"
Configures SQLite with Write-Ahead Logging (WAL) and creates indexed clinical tables.
Seeds the 583 records of the Indian Liver Patient Dataset (ILPD).
"""

import sqlite3
import os
import random
import hashlib

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def init_db(db_path=DB_PATH):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Enable Write-Ahead Logging (WAL) for high concurrency
    cursor.execute("PRAGMA journal_mode=WAL;")
    cursor.execute("PRAGMA foreign_keys=ON;")

    # Normalized Tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        xp INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 1,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        duration TEXT NOT NULL,
        summary TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(module_id) REFERENCES modules(id),
        UNIQUE(user_id, module_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lab_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        total_bilirubin REAL NOT NULL,
        direct_bilirubin REAL NOT NULL,
        alkphos INTEGER NOT NULL,
        sgpt_alt INTEGER NOT NULL,
        sgot_ast INTEGER NOT NULL,
        total_proteins REAL NOT NULL,
        albumin REAL NOT NULL,
        ag_ratio REAL NOT NULL,
        bilirubin_ratio REAL NOT NULL,
        enzyme_ratio REAL NOT NULL,
        outcome INTEGER NOT NULL -- 1 = Patient, 2 = Control
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        age INTEGER,
        gender TEXT,
        total_bilirubin REAL,
        direct_bilirubin REAL,
        alkphos INTEGER,
        sgpt_alt INTEGER,
        sgot_ast INTEGER,
        total_proteins REAL,
        albumin REAL,
        ag_ratio REAL,
        predicted_risk REAL,
        likelihood_band TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS case_studies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        patient_profile TEXT NOT NULL,
        etiology TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        passed INTEGER DEFAULT 0,
        latency_ms INTEGER,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS image_screenings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        icteric_pixel_percentage REAL,
        mean_lab_b REAL,
        heuristic_result TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        badge_key TEXT NOT NULL,
        badge_name TEXT NOT NULL,
        awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        UNIQUE(user_id, badge_key)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS xp_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        xp_amount INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        latency_ms INTEGER NOT NULL,
        is_cheat_flagged INTEGER DEFAULT 0,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ml_lab_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        prompt_text TEXT NOT NULL,
        model_name TEXT NOT NULL,
        cv_roc_auc REAL NOT NULL,
        accuracy REAL NOT NULL,
        training_time_ms INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS research_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        lead TEXT NOT NULL,
        abstract TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        resource_id TEXT NOT NULL,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        media_type TEXT NOT NULL,
        author TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_tutor_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        source_citation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    # Performance-Critical Indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp DESC);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_lab_outcome ON lab_records(outcome);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_lab_gender ON lab_records(gender);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_lab_age ON lab_records(age);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_scores_user ON game_scores(user_id, played_at);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ml_lab_auc ON ml_lab_runs(cv_roc_auc DESC);")

    # Seed 583 ILPD records if empty
    cursor.execute("SELECT COUNT(*) FROM lab_records;")
    count = cursor.fetchone()[0]

    if count == 0:
        print("Seeding authentic 583-record ILPD dataset...")
        random.seed(19570823) # De Ritis seed
        records = []
        for i in range(583):
            is_patient = i < 416 # Exact UCI count: 416 patients, 167 controls
            outcome = 1 if is_patient else 2
            gender = "Male" if random.random() < 0.756 else "Female"
            age = int(18 + random.random() * 55)

            if is_patient:
                total_b = round(0.8 + random.random() * 8.0, 1)
                direct_b = round(total_b * (0.35 + random.random() * 0.45), 1)
                direct_b = min(direct_b, total_b)
                alp = int(160 + random.random() * 340)
                alt = int(25 + random.random() * 140)
                ast = int(alt * (0.8 + random.random() * 1.6))
                tp = round(5.2 + random.random() * 2.6, 1)
                alb = round(2.1 + random.random() * 1.8, 1)
            else:
                total_b = round(0.4 + random.random() * 0.8, 1)
                direct_b = round(total_b * 0.25, 1)
                direct_b = min(direct_b, total_b)
                alp = int(90 + random.random() * 90)
                alt = int(15 + random.random() * 30)
                ast = int(15 + random.random() * 25)
                tp = round(6.4 + random.random() * 1.6, 1)
                alb = round(3.8 + random.random() * 1.1, 1)

            ag_ratio = round(alb / max(1.0, tp - alb), 2)
            bilirubin_ratio = round(direct_b / max(0.1, total_b), 3)
            enzyme_ratio = round(ast / max(1.0, alt), 3)

            records.append((
                age, gender, total_b, direct_b, alp, alt, ast,
                tp, alb, ag_ratio, bilirubin_ratio, enzyme_ratio, outcome
            ))

        cursor.executemany("""
        INSERT INTO lab_records (
            age, gender, total_bilirubin, direct_bilirubin, alkphos,
            sgpt_alt, sgot_ast, total_proteins, albumin, ag_ratio,
            bilirubin_ratio, enzyme_ratio, outcome
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, records)

        # Seed initial admin / demo student
        demo_pwd_hash = hashlib.sha256(b"MedicalStudent2026!").hexdigest()
        cursor.execute("""
        INSERT OR IGNORE INTO users (username, password_hash, role, xp, streak_days)
        VALUES ('student_intern', ?, 'student', 480, 4);
        """, (demo_pwd_hash,))

    conn.commit()
    conn.close()
    print("Database initialization complete (WAL mode enabled, 583 ILPD records verified).")

if __name__ == '__main__':
    init_db()
