from flask import Flask, jsonify
from flask_cors import CORS
from routes.api import api_bp

app = Flask(__name__)
# Izinkan akses CORS untuk frontend
CORS(app)

# Daftarkan Blueprint dengan awalan URL '/api'
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "API Music Playlist Server Siap Berjalan!"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)