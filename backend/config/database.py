import os
import pymysql
from dotenv import load_dotenv

# Membaca variabel dari file .env di folder root
load_dotenv()

def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'music_playlist_db'),
        port=int(os.getenv('DB_PORT', 3306)),
        cursorclass=pymysql.cursors.DictCursor
    )

# Tes koneksi sederhana
if __name__ == '__main__':
    try:
        conn = get_db_connection()
        print("Koneksi database MySQL berhasil!")
        conn.close()
    except Exception as e:
        print("Gagal terhubung ke database:", e)