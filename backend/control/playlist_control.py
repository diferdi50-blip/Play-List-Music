from config.database import get_db_connection

def ambil_semua_playlist(user_id=None):
    """Mengambil daftar playlist. Jika user_id diberikan, ambil milik user tersebut."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            if user_id:
                sql = """
                    SELECT 
                        p.playlist_id,
                        p.title,
                        p.description,
                        p.is_public,
                        p.created_at,
                        u.username AS pemilik,
                        COUNT(ps.song_id) AS total_lagu
                    FROM playlists p
                    JOIN users u ON p.user_id = u.user_id
                    LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
                    WHERE p.user_id = %s
                    GROUP BY p.playlist_id
                    ORDER BY p.created_at DESC;
                """
                cursor.execute(sql, (user_id,))
            else:
                sql = """
                    SELECT 
                        p.playlist_id,
                        p.title,
                        p.description,
                        p.is_public,
                        p.created_at,
                        u.username AS pemilik,
                        COUNT(ps.song_id) AS total_lagu
                    FROM playlists p
                    JOIN users u ON p.user_id = u.user_id
                    LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
                    WHERE p.is_public = TRUE
                    GROUP BY p.playlist_id
                    ORDER BY p.created_at DESC;
                """
                cursor.execute(sql)
            return cursor.fetchall()
    finally:
        connection.close()

def buat_playlist(user_id, title, description="", is_public=True):
    """Membuat playlist baru untuk user."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO playlists (user_id, title, description, is_public)
                VALUES (%s, %s, %s, %s);
            """
            cursor.execute(sql, (user_id, title, description, is_public))
            connection.commit()
            return cursor.lastrowid
    finally:
        connection.close()

def ambil_lagu_dalam_playlist(playlist_id):
    """Mengambil seluruh daftar lagu yang ada di dalam satu playlist tertentu."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT 
                    ps.playlist_song_id,
                    ps.track_order,
                    ps.added_at,
                    s.song_id,
                    s.title,
                    s.duration_seconds,
                    s.genre,
                    a.name AS artist_name
                FROM playlist_songs ps
                JOIN songs s ON ps.song_id = s.song_id
                JOIN artists a ON s.artist_id = a.artist_id
                WHERE ps.playlist_id = %s
                ORDER BY ps.track_order ASC;
            """
            cursor.execute(sql, (playlist_id,))
            return cursor.fetchall()
    finally:
        connection.close()

def tambah_lagu_ke_playlist(playlist_id, song_id, track_order=1):
    """Memasukkan lagu ke dalam playlist (tabel junction playlist_songs)."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO playlist_songs (playlist_id, song_id, track_order)
                VALUES (%s, %s, %s);
            """
            cursor.execute(sql, (playlist_id, song_id, track_order))
            connection.commit()
            return cursor.lastrowid
    finally:
        connection.close()