# 🎵 Full-Stack Music Playlist Web App

Aplikasi pemutar musik dan manajemen playlist interaktif yang dibangun menggunakan arsitektur modular **Client-Server**. Proyek ini mengintegrasikan frontend web modern dengan backend RESTful API Python dan basis data relasional MySQL, dilengkapi dengan fitur **Voice Search**.

---

## 🚀 Fitur Utama

- **Katalog Lagu Terpusat:** Menampilkan daftar lagu dinamis dari database MySQL.
- **Pencarian Cerdas (Teks & Suara):** Mendukung pencarian instan via teks dan perintah suara (*Web Speech API*).
- **Manajemen Playlist:** Menangani pembuatan playlist, relasi lagu (Junction Table), dan koleksi pengguna.
- **Arsitektur Modular:** Pemisahan tegas antara logika data (*Controllers*), perutean (*Routes/Blueprint*), dan antarmuka (*Frontend*).

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Modern Dark Theme), JavaScript (Fetch API, Web Speech API)
- **Backend:** Python, Flask (Blueprint, RESTful API), Flask-CORS
- **Database:** MySQL (Relational Schema & Foreign Keys, PyMySQL)
- **Environment Management:** Python-Dotenv

---

## 📁 Struktur Proyek

```text
Music Projek/
├── backend/
│   ├── config/
│   │   └── database.py        # Konfigurasi koneksi MySQL terpusat
│   ├── control/
│   │   ├── control_lagu.py    # Logika kueri lagu & pencarian
│   │   └── playlist_control.py# Logika kueri playlist & junction table
│   ├── routes/
│   │   └── api.py             # Pusat endpoint REST API (Blueprint)
│   └── app.py                 # Entry point server Flask
├── frontend/
│   ├── aset/
│   │   ├── gambar/            # Aset gambar & icon
│   │   └── lagu/              # File audio MP3 lokal
│   ├── css/
│   │   └── style.css          # Styling UI bertema gelap
│   ├── html/
│   │   └── index.html         # Struktur tampilan web
│   └── js/
│       ├── api.js             # HTTP request ke backend API
│       └── player.js          # Kontrol pemutar audio & Voice Search
├── .env.example               # Template variabel environment
├── .gitignore                 # Filter file rahasia & cache
├── requirements.txt           # Dependensi pustaka Python
└── README.md                  # Dokumentasi proyek