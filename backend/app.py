from flask import Flask, jsonify, request
from flask_cors import CORS
from control.control_lagu import ambil_semua_lagu, cari_lagu, tambah_lagu

app = Flask(__name__)
# Izinkan frontend mengakses API backend
CORS(app)

@app.route('/')
def home():
    return jsonify({"status": "online", "message": "API Music Playlist Server Siap!"})

# 1. Endpoint: Ambil Semua Lagu
@app.route('/api/songs', methods=['GET'])
def get_songs():
    try:
        data = ambil_semua_lagu()
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. Endpoint: Cari Lagu (Voice / Text Search)
@app.route('/api/songs/search', methods=['GET'])
def search_song():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"status": "fail", "message": "Query pencarian tidak boleh kosong"}), 400
    try:
        hasil = cari_lagu(query)
        return jsonify({"status": "success", "query": query, "data": hasil}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 3. Endpoint: Tambah Lagu
@app.route('/api/songs', methods=['POST'])
def create_song():
    try:
        body = request.get_json()
        title = body.get('title')
        duration = body.get('duration_seconds')
        year = body.get('release_year')
        genre = body.get('genre')
        artist_id = body.get('artist_id')

        if not title or not duration or not artist_id:
            return jsonify({"status": "fail", "message": "Title, duration, dan artist_id wajib diisi"}), 400

        song_id = tambah_lagu(title, duration, year, genre, artist_id)
        return jsonify({"status": "success", "message": "Lagu berhasil ditambahkan", "song_id": song_id}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)