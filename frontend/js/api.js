const BASE_URL = "http://127.0.0.1:5000/api";


// =====================================================
// HELPER
// =====================================================

async function requestApi(url, options = {}) {

    try {

        const response = await fetch(url, options);

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message || "Terjadi kesalahan pada server"
            );

        }

        return result;

    } catch (error) {

        console.error("API Error:", error);

        throw error;
    }
}


// =====================================================
// SONG
// =====================================================

async function fetchAllSongs() {

    try {

        const result =
            await requestApi(`${BASE_URL}/songs`);

        return result.data || [];

    } catch (error) {

        return [];
    }
}


async function searchSongsApi(keyword) {

    try {

        const result =
            await requestApi(
                `${BASE_URL}/lagu/cari?q=${encodeURIComponent(keyword)}`
            );

        return result.data || [];

    } catch (error) {

        return [];
    }
}


// =====================================================
// PLAYLIST
// =====================================================

async function fetchPlaylists(userId = null) {

    try {

        let url = `${BASE_URL}/playlists`;

        if (userId) {

            url += `?user_id=${userId}`;
        }

        const result =
            await requestApi(url);

        return result.data || [];

    } catch (error) {

        return [];
    }
}


async function createPlaylist(data) {

    return await requestApi(
        `${BASE_URL}/playlists`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        }
    );
}


async function fetchPlaylistSongs(playlistId) {

    try {

        const result =
            await requestApi(
                `${BASE_URL}/playlists/${playlistId}/songs`
            );

        return result.data || [];

    } catch (error) {

        return [];
    }
}


async function addSongToPlaylist(
    playlistId,
    songId,
    trackOrder = 1
) {

    return await requestApi(
        `${BASE_URL}/playlists/${playlistId}/songs`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                song_id: songId,

                track_order: trackOrder

            })
        }
    );
}