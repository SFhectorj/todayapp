import json
import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).parent / "today.db"
DEMO_USER_ID = 1


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT,
                last_name TEXT,
                username TEXT,
                email TEXT,
                university TEXT,
                major TEXT,
                school_level TEXT,
                graduation_year INTEGER,
                current_job TEXT,
                location TEXT,
                extracurricular_activities TEXT
            )
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                vibe TEXT,
                schedule_date TEXT,
                schedule_json TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        connection.execute(
            """
            INSERT OR IGNORE INTO users (
                id,
                first_name,
                username,
                email
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                DEMO_USER_ID,
                "Demo",
                "demo_student",
                "demo@today.app",
            ),
        )


def get_user(user_id=DEMO_USER_ID):
    with get_connection() as connection:
        user = connection.execute(
            """
            SELECT * FROM users
            WHERE id = ?
            """,
            (user_id,),
        ).fetchone()

    return dict(user) if user else None


def update_user(profile, user_id=DEMO_USER_ID):
    current_user = get_user(user_id)

    if not current_user:
        return None

    with get_connection() as connection:
        connection.execute(
            """
            UPDATE users
            SET
                first_name = ?,
                last_name = ?,
                username = ?,
                email = ?,
                university = ?,
                major = ?,
                school_level = ?,
                graduation_year = ?,
                current_job = ?,
                location = ?,
                extracurricular_activities = ?
            WHERE id = ?
            """,
            (
                profile.get(
                    "first_name",
                    current_user["first_name"],
                ),
                profile.get(
                    "last_name",
                    current_user["last_name"],
                ),
                profile.get(
                    "username",
                    current_user["username"],
                ),
                profile.get(
                    "email",
                    current_user["email"],
                ),
                profile.get(
                    "university",
                    current_user["university"],
                ),
                profile.get(
                    "major",
                    current_user["major"],
                ),
                profile.get(
                    "school_level",
                    current_user["school_level"],
                ),
                profile.get(
                    "graduation_year",
                    current_user["graduation_year"],
                ),
                profile.get(
                    "current_job",
                    current_user["current_job"],
                ),
                profile.get(
                    "location",
                    current_user["location"],
                ),
                profile.get(
                    "extracurricular_activities",
                    current_user["extracurricular_activities"],
                ),
                user_id,
            ),
        )

    return get_user(user_id)


def save_schedule(
    user_id,
    vibe,
    schedule_date,
    schedule,
):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO schedules (
                user_id,
                vibe,
                schedule_date,
                schedule_json
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                user_id,
                vibe,
                schedule_date,
                json.dumps(schedule),
            ),
        )

    return cursor.lastrowid


def get_schedules(user_id=DEMO_USER_ID):
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT * FROM schedules
            WHERE user_id = ?
            ORDER BY id DESC
            """,
            (user_id,),
        ).fetchall()

    schedules = []

    for row in rows:
        schedule = dict(row)
        schedule["schedule_json"] = json.loads(
            schedule["schedule_json"]
        )
        schedules.append(schedule)

    return schedules


def get_latest_schedule(user_id=DEMO_USER_ID):
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT * FROM schedules
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
            """,
            (user_id,),
        ).fetchone()

    if not row:
        return None

    schedule = dict(row)
    schedule["schedule_json"] = json.loads(
        schedule["schedule_json"]
    )

    return schedule


if __name__ == "__main__":
    init_db()
    print(get_user())