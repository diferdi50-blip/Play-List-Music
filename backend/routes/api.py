from flask import Blueprint, jsonify, request
from control.control_lagu import ambil_semua_lagu, cari_lagu, tambah_lagu
from control.playlist_control import (
    ambil_semua_playlist,
    buat_playlist,
    ambil_lagu_dalam_playlist,
    tambah_lagu_ke_playlist
)

# Buat Blueprint API
api_bp = Blueprint('api', __name__)

# ==================== ENDPOINT LAGU ====================

@api_bp.route('/songs', methods=['GET'])
def get_songs():
    """Mengambil semua daftar lagu"""
    try:
        data = ambil_semua_lagu()
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@api_bp.route('/lagu/cari', methods=['GET'])
def search_songs():
    """Mencari lagu via teks atau suara"""
    keyword = request.args.get('q', '')
    try:
        data = cari_lagu(keyword)
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@api_bp.route('/songs', methods=['POST'])
def add_song():
    """Menambah lagu baru"""
    body = request.get_json() or {}
    try:
        song_id = tambah_lagu(
            title=body.get('title'),
            duration_seconds=body.get('duration_seconds'),
            release_year=body.get('release_year'),
            genre=body.get('genre'),
            artist_id=body.get('artist_id')
        )
        return jsonify({"status": "success", "message": "Lagu berhasil ditambahkan", "song_id": song_id}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ==================== ENDPOINT PLAYLIST ====================

@api_bp.route('/playlists', methods=['GET'])
def get_playlists():
    """Mengambil semua playlist"""
    user_id = request.args.get('user_id')
    try:
        data = ambil_semua_playlist(user_id)
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@api_bp.route('/playlists', methods=['POST'])
def create_new_playlist():
    """Membuat playlist baru"""
    body = request.get_json() or {}
    try:
        playlist_id = buat_playlist(
            user_id=body.get('user_id', 1),
            title=body.get('title'),
            description=body.get('description', ''),
            is_public=body.get('is_public', True)
        )
        return jsonify({"status": "success", "message": "Playlist berhasil dibuat", "playlist_id": playlist_id}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@api_bp.route('/playlists/<int:playlist_id>/songs', methods=['GET'])
def get_playlist_songs(playlist_id):
    """Mengambil semua lagu dalam satu playlist"""
    try:
        data = ambil_lagu_dalam_playlist(playlist_id)
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@api_bp.route('/playlists/<int:playlist_id>/songs', methods=['POST'])
def add_song_to_playlist_route(playlist_id):
    """Memasukkan lagu ke dalam playlist"""
    body = request.get_json() or {}
    try:
        ps_id = tambah_lagu_ke_playlist(
            playlist_id=playlist_id,
            song_id=body.get('song_id'),
            track_order=body.get('track_order', 1)
        )
        return jsonify({"status": "success", "message": "Lagu dimasukkan ke playlist", "playlist_song_id": ps_id}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500