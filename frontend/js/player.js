const songListEl = document.getElementById('songList');
const songCountEl = document.getElementById('songCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const voiceBtn = document.getElementById('voiceBtn');
const voiceStatus = document.getElementById('voiceStatus');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const playPauseBtn = document.getElementById('playPauseBtn');

let isPlaying = false;

// 1. Render data lagu ke UI
function renderSongs(songs) {
    songCountEl.textContent = `${songs.length} Lagu`;

    if (songs.length === 0) {
        songListEl.innerHTML = '<p class="loading">Tidak ada lagu yang cocok.</p>';
        return;
    }

    songListEl.innerHTML = songs.map(song => `
        <div class="song-card" onclick="selectSong('${song.title.replace(/'/g, "\\'")}', '${song.artist_name.replace(/'/g, "\\'")}')">
            <div class="info">
                <h4>${song.title}</h4>
                <p>${song.artist_name} • ${song.genre || 'Pop'} (${song.release_year || '-'})</p>
            </div>
            <div class="play-icon">
                <i class="fa-solid fa-circle-play"></i>
            </div>
        </div>
    `).join('');
}

// 2. Memilih lagu yang akan diputar
function selectSong(title, artist) {
    currentTitle.textContent = title;
    currentArtist.textContent = artist;
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// 3. Tombol Play / Pause
playPauseBtn.addEventListener('click', () => {
    if (currentTitle.textContent === 'Pilih lagu untuk memutar') return;
    
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
});

// 4. Pencarian Teks
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        const all = await fetchAllSongs();
        renderSongs(all);
        return;
    }
    const results = await searchSongsApi(query);
    renderSongs(results);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// 5. Fitur Voice Search (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognizer = new SpeechRecognition();
    recognizer.lang = 'id-ID'; // Mengenali Bahasa Indonesia / judul umum

    voiceBtn.addEventListener('click', () => {
        try {
            recognizer.start();
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = '🎙️ Mendengarkan... Sebutkan judul lagu atau artis!';
        } catch (err) {
            console.warn('Speech recognition sudah aktif.');
        }
    });

    recognizer.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = `Hasil suara: "${transcript}"`;
        searchInput.value = transcript;

        // Cari otomatis berdasarkan hasil suara
        const results = await searchSongsApi(transcript);
        renderSongs(results);
    };

    recognizer.onerror = () => {
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = 'Suara tidak terdeteksi jelas, silakan coba lagi.';
    };

    recognizer.onend = () => {
        voiceBtn.classList.remove('listening');
    };
} else {
    // Sembunyikan mic jika browser tidak mendukung
    voiceBtn.style.display = 'none';
}

// 6. Muat data lagu saat halaman pertama dibuka
document.addEventListener('DOMContentLoaded', async () => {
    const songs = await fetchAllSongs();
    renderSongs(songs);
});