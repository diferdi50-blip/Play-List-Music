from config.database import get_db_connection

def ambil_semua_lagu():
    """Mengambil seluruh daftar lagu beserta nama artisnya."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    s.song_id,
                    s.title,
                    s.duration_seconds,
                    s.release_year,
                    s.genre,
                    a.name AS artist_name
                FROM songs s
                JOIN artists a ON s.artist_id = a.artist_id
                ORDER BY s.song_id DESC;
            """
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        conn.close()

def cari_lagu(keyword):
    """Mencari lagu berdasarkan judul atau nama artis (dipakai untuk Voice Search)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    s.song_id,
                    s.title,
                    s.duration_seconds,
                    s.release_year,
                    s.genre,
                    a.name AS artist_name
                FROM songs s
                JOIN artists a ON s.artist_id = a.artist_id
                WHERE s.title LIKE %s OR a.name LIKE %s
                ORDER BY s.song_id DESC;
            """
            pola = f"%{keyword}%"
            cursor.execute(sql, (pola, pola))
            return cursor.fetchall()
    finally:
        conn.close()

def tambah_lagu(title, duration_seconds, release_year, genre, artist_id):
    """Menambahkan lagu baru ke database."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO songs (title, duration_seconds, release_year, genre, artist_id)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (title, duration_seconds, release_year, genre, artist_id))
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()