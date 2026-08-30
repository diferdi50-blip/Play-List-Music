const BASE_URL = 'http://127.0.0.1:5000/api';

// 1. Mengambil seluruh katalog lagu dari Flask Backend
async function fetchAllSongs() {
    try {
        const response = await fetch(`${BASE_URL}/songs`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

// 2. Mencari lagu berdasarkan judul / artis (Teks & Voice Search)
async function searchSongsApi(keyword) {
    try {
        const response = await fetch(`${BASE_URL}/lagu/cari?q=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('Search request failed');
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error searching songs:', error);
        return [];
    }
}