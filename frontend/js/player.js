// =====================================================
// ELEMENT
// =====================================================

const songListEl =
    document.getElementById("songList");

const songCountEl =
    document.getElementById("songCount");

const heroSongCount =
    document.getElementById("heroSongCount");

const heroDuration =
    document.getElementById("heroDuration");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const currentTitle =
    document.getElementById("currentTitle");

const currentArtist =
    document.getElementById("currentArtist");

const currentCover =
    document.getElementById("currentCover");

const heroCover =
    document.getElementById("heroCover");

const playPauseBtn =
    document.getElementById("playPauseBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const progressBar =
    document.getElementById("progressBar");

const currentTimeEl =
    document.getElementById("currentTime");

const durationEl =
    document.getElementById("duration");

const volumeBar =
    document.getElementById("volumeBar");

const audio =
    document.getElementById("audioPlayer");

const voiceStatus =
    document.getElementById("voiceStatus");

const emptyState =
    document.getElementById("emptyState");


// =====================================================
// DATA
// =====================================================

let songs = [];

let filteredSongs = [];

let currentIndex = -1;

let isShuffle = false;

let isRepeat = false;

let currentSong = null;


// =====================================================
// ASSET MAPPING
// =====================================================

const songAssets = {

    "joyride": {
        image: "Cortis.png",
        audio: "CORTIS- JoyRide.mp3",
        album: "Horizon Solitude Vol. 1"
    },

    "redred": {
        image: "RedRed.png",
        audio: "CORTIS-REDRED.mp3",
        album: "Crimson Horizon"
    },

    "pinky up": {
        image: "Pinky UP.png",
        audio: "KATSEYE-PINKY UP.mp3",
        album: "Pink Horizon"
    },

    "touch": {
        image: "Touch.png",
        audio: "KATSEYE-Touch.mp3",
        album: "Oceanic Touch"
    }

};


function normalize(text = "") {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}


function getAsset(song) {

    const title = normalize(song.title);

    for (const key of Object.keys(songAssets)) {

        if (
            title.includes(normalize(key)) ||
            normalize(key).includes(title)
        ) {

            return songAssets[key];
        }
    }

    return {
        image: "Cortis.png",
        audio: "",
        album: song.genre || "Music Collection"
    };
}


// =====================================================
// FORMAT
// =====================================================

function formatTime(seconds) {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const min =
        Math.floor(seconds / 60);

    const sec =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${min}:${sec}`;
}


function formatDuration(seconds) {

    const minutes =
        Math.floor((seconds || 0) / 60);

    return `${minutes} Menit`;
}


function escapeHtml(value = "") {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// FAVORITE
// =====================================================

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem("musicFavorites")
        ) || [];

    } catch {

        return [];
    }
}


function saveFavorites(data) {

    localStorage.setItem(
        "musicFavorites",
        JSON.stringify(data)
    );
}


function isFavorite(songId) {

    return getFavorites()
        .includes(Number(songId));
}


function toggleFavorite(songId) {

    const id = Number(songId);

    let favorites = getFavorites();

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(item => item !== id);

    } else {

        favorites.push(id);
    }

    saveFavorites(favorites);

    renderSongs(filteredSongs);

    updatePlayerFavorite();
}


// =====================================================
// RENDER SONGS
// =====================================================

function renderSongs(data) {

    filteredSongs = [...data];

    songCountEl.textContent =
        data.length;

    heroSongCount.textContent =
        `${data.length} Lagu`;

    if (!data.length) {

        songListEl.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");


    const totalDuration =
        data.reduce(
            (total, song) =>
                total + Number(song.duration_seconds || 0),
            0
        );

    heroDuration.textContent =
        formatDuration(totalDuration);


    songListEl.innerHTML =
        data.map((song, index) => {

            const asset =
                getAsset(song);

            const favorite =
                isFavorite(song.song_id);

            const playing =
                currentSong &&
                Number(currentSong.song_id) ===
                Number(song.song_id);

            return `

                <div
                    class="song-row ${playing ? "playing" : ""}"
                    data-id="${song.song_id}"
                >

                    <div class="track-number">

                        ${playing
                    ? `<i class="fa-solid fa-volume-high"></i>`
                    : index + 1
                }

                    </div>


                    <div class="song-main">

                        <div class="song-cover">

                            <img
                                src="frontend/aset/gambar/${asset.image}"
                                alt="${escapeHtml(song.title)}"
                            >

                        </div>


                        <div class="song-text">

                            <div class="song-title">

                                ${escapeHtml(song.title)}

                                ${playing
                    ? `
                                        <span class="playing-badge">
                                            SEDANG DIPUTAR
                                        </span>
                                    `
                    : ""
                }

                            </div>

                            <div class="song-artist">

                                ${escapeHtml(song.artist_name || "Unknown Artist")}

                            </div>

                        </div>

                    </div>


                    <div class="album-name">

                        ${escapeHtml(asset.album)}

                    </div>


                    <div class="added-date">

                        ${getAddedDate(index)}

                    </div>


                    <div class="song-duration">

                        <div class="row-actions">

                            <button
                                class="row-btn add-playlist-btn"
                                data-id="${song.song_id}"
                                title="Tambah ke playlist"
                            >
                                <i class="fa-solid fa-list-plus"></i>
                            </button>

                            <button
                                class="favorite-btn"
                                data-favorite="${song.song_id}"
                            >
                                <i class="fa-${favorite
                    ? "solid"
                    : "regular"
                } fa-heart"></i>
                            </button>

                        </div>

                        ${formatTime(song.duration_seconds)}

                    </div>

                </div>

            `;

        }).join("");


    attachSongEvents();
}


function getAddedDate(index) {

    if (index === 0) {
        return "Hari ini";
    }

    if (index === 1) {
        return "2 hari lalu";
    }

    if (index < 4) {
        return "1 minggu lalu";
    }

    return "2 minggu lalu";
}


// =====================================================
// SONG EVENTS
// =====================================================

function attachSongEvents() {

    document
        .querySelectorAll(".song-row")
        .forEach(row => {

            row.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".favorite-btn"
                        ) ||

                        event.target.closest(
                            ".add-playlist-btn"
                        )
                    ) {
                        return;
                    }

                    const id =
                        Number(row.dataset.id);

                    const index =
                        filteredSongs.findIndex(
                            song =>
                                Number(song.song_id) === id
                        );

                    if (index !== -1) {

                        currentIndex = index;

                        playSong(
                            filteredSongs[index]
                        );
                    }

                }
            );

        });


    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFavorite(
                        button.dataset.favorite
                    );
                }
            );

        });


    document
        .querySelectorAll(".add-playlist-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const song =
                        songs.find(
                            item =>
                                Number(item.song_id) ===
                                Number(button.dataset.id)
                        );

                    if (song) {

                        openAddPlaylistModal(song);
                    }

                }
            );

        });
}


// =====================================================
// PLAY SONG
// =====================================================

async function playSong(song) {

    if (!song) return;

    currentSong = song;

    const asset =
        getAsset(song);


    currentTitle.textContent =
        song.title;

    currentArtist.textContent =
        song.artist_name || "Unknown Artist";


    currentCover.src =
        `frontend/aset/gambar/${asset.image}`;

    heroCover.src =
        `frontend/aset/gambar/${asset.image}`;


    if (!asset.audio) {

        voiceStatus.textContent =
            "Audio file untuk lagu ini belum tersedia.";

        return;
    }


    const audioPath =
        `frontend/aset/lagu/${asset.audio}`;


    if (
        audio.src &&
        decodeURI(audio.src).includes(asset.audio)
    ) {

        audio.currentTime = 0;

    } else {

        audio.src = audioPath;

    }


    try {

        await audio.play();

        updatePlayButton();

    } catch (error) {

        console.error(error);

        voiceStatus.textContent =
            "Klik tombol play untuk mulai memutar.";
    }


    renderSongs(filteredSongs);

    updatePlayerFavorite();
}


// =====================================================
// PLAY / PAUSE
// =====================================================

function togglePlay() {

    if (!currentSong) {

        if (songs.length) {

            currentIndex = 0;

            playSong(songs[0]);
        }

        return;
    }


    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();
    }
}


function updatePlayButton() {

    playPauseBtn.innerHTML =
        audio.paused

            ? `<i class="fa-solid fa-play"></i>`

            : `<i class="fa-solid fa-pause"></i>`;
}


playPauseBtn.addEventListener(
    "click",
    togglePlay
);


// =====================================================
// NEXT
// =====================================================

function nextSong() {

    if (!filteredSongs.length) return;


    if (isShuffle) {

        currentIndex =
            Math.floor(
                Math.random() *
                filteredSongs.length
            );

    } else {

        currentIndex++;

        if (
            currentIndex >=
            filteredSongs.length
        ) {

            currentIndex = 0;
        }
    }


    playSong(
        filteredSongs[currentIndex]
    );
}


function previousSong() {

    if (!filteredSongs.length) return;


    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;
    }


    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            filteredSongs.length - 1;
    }


    playSong(
        filteredSongs[currentIndex]
    );
}


nextBtn.addEventListener(
    "click",
    nextSong
);


previousBtn.addEventListener(
    "click",
    previousSong
);


// =====================================================
// AUDIO EVENTS
// =====================================================

audio.addEventListener(
    "play",
    updatePlayButton
);

audio.addEventListener(
    "pause",
    updatePlayButton
);


audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) return;

        const progress =
            (audio.currentTime /
                audio.duration) *
            100;

        progressBar.value =
            progress;

        updateRangeBackground(
            progressBar,
            progress
        );

        currentTimeEl.textContent =
            formatTime(audio.currentTime);

    }
);


audio.addEventListener(
    "loadedmetadata",
    () => {

        durationEl.textContent =
            formatTime(audio.duration);

    }
);


audio.addEventListener(
    "ended",
    () => {

        if (isRepeat) {

            audio.currentTime = 0;

            audio.play();

            return;
        }

        nextSong();
    }
);


// =====================================================
// PROGRESS
// =====================================================

progressBar.addEventListener(
    "input",
    () => {

        if (!audio.duration) return;

        audio.currentTime =
            (progressBar.value / 100) *
            audio.duration;

    }
);


// =====================================================
// VOLUME
// =====================================================

audio.volume =
    Number(volumeBar.value);


volumeBar.addEventListener(
    "input",
    () => {

        audio.volume =
            Number(volumeBar.value);

        updateRangeBackground(
            volumeBar,
            Number(volumeBar.value) * 100
        );
    }
);


function updateRangeBackground(
    element,
    percentage
) {

    element.style.background =
        `
        linear-gradient(
            to right,
            #079bb5 ${percentage}%,
            #d8edf1 ${percentage}%
        )
        `;
}


// =====================================================
// SHUFFLE / REPEAT
// =====================================================

const shuffleControl =
    document.getElementById(
        "shuffleControl"
    );

const shuffleBtn =
    document.getElementById(
        "shuffleBtn"
    );

const repeatBtn =
    document.getElementById(
        "repeatBtn"
    );


function toggleShuffle() {

    isShuffle =
        !isShuffle;

    shuffleControl.classList.toggle(
        "active",
        isShuffle
    );

    shuffleBtn.classList.toggle(
        "active",
        isShuffle
    );
}


function toggleRepeat() {

    isRepeat =
        !isRepeat;

    repeatBtn.classList.toggle(
        "active",
        isRepeat
    );
}


shuffleControl.addEventListener(
    "click",
    toggleShuffle
);

shuffleBtn.addEventListener(
    "click",
    toggleShuffle
);

repeatBtn.addEventListener(
    "click",
    toggleRepeat
);


// =====================================================
// SEARCH
// =====================================================

let searchTimeout;


searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(searchTimeout);

        const query =
            searchInput.value.trim();

        clearSearch.style.display =
            query
                ? "block"
                : "none";


        searchTimeout =
            setTimeout(
                async () => {

                    if (!query) {

                        renderSongs(songs);

                        return;
                    }


                    const result =
                        await searchSongsApi(query);

                    renderSongs(result);

                },
                350
            );

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        clearSearch.style.display =
            "none";

        renderSongs(songs);

    }
);


// =====================================================
// VOICE SEARCH
// =====================================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognizer =
        new SpeechRecognition();

    recognizer.lang =
        "id-ID";

    recognizer.interimResults =
        false;

    recognizer.maxAlternatives =
        1;


    window.startVoiceSearch =
        () => {

            try {

                recognizer.start();

                voiceStatus.textContent =
                    "🎙️ Mendengarkan... sebutkan judul lagu atau nama artis.";

                voiceStatus.classList.add(
                    "voice-listening"
                );

            } catch (error) {

                console.log(
                    "Voice recognition sudah aktif."
                );
            }
        };


    recognizer.onresult =
        async event => {

            const transcript =
                event.results[0][0]
                    .transcript;

            searchInput.value =
                transcript;

            clearSearch.style.display =
                "block";

            voiceStatus.textContent =
                `Hasil suara: "${transcript}"`;

            voiceStatus.classList.remove(
                "voice-listening"
            );


            const result =
                await searchSongsApi(
                    transcript
                );

            renderSongs(result);

        };


    recognizer.onerror =
        () => {

            voiceStatus.textContent =
                "Suara tidak terdeteksi. Silakan coba lagi.";

            voiceStatus.classList.remove(
                "voice-listening"
            );

        };


    recognizer.onend =
        () => {

            voiceStatus.classList.remove(
                "voice-listening"
            );

        };

} else {

    voiceStatus.textContent =
        "Voice Search tidak didukung browser ini.";

}


// =====================================================
// FAVORITE PLAYER
// =====================================================

const playerFavorite =
    document.getElementById(
        "playerFavorite"
    );

const heroFavorite =
    document.getElementById(
        "heroFavorite"
    );


function updatePlayerFavorite() {

    if (!currentSong) return;

    const favorite =
        isFavorite(
            currentSong.song_id
        );

    playerFavorite.innerHTML =
        `<i class="fa-${favorite
            ? "solid"
            : "regular"
        } fa-heart"></i>`;

    heroFavorite.innerHTML =
        `<i class="fa-${favorite
            ? "solid"
            : "regular"
        } fa-heart"></i>`;
}


playerFavorite.addEventListener(
    "click",
    () => {

        if (currentSong) {

            toggleFavorite(
                currentSong.song_id
            );
        }
    }
);


heroFavorite.addEventListener(
    "click",
    () => {

        if (currentSong) {

            toggleFavorite(
                currentSong.song_id
            );
        }
    }
);


// =====================================================
// PLAY ALL
// =====================================================

document
    .getElementById("playAllBtn")
    .addEventListener(
        "click",
        () => {

            if (!filteredSongs.length) return;

            currentIndex = 0;

            playSong(
                filteredSongs[0]
            );

        }
    );


// =====================================================
// RADIO
// =====================================================

document
    .getElementById("radioBtn")
    .addEventListener(
        "click",
        () => {

            if (!songs.length) return;

            isShuffle = true;

            currentIndex =
                Math.floor(
                    Math.random() *
                    songs.length
                );

            playSong(
                songs[currentIndex]
            );

            voiceStatus.textContent =
                "📻 Radio Mode aktif — lagu akan diputar secara acak.";

        }
    );


// =====================================================
// SORT
// =====================================================

const sortBtn =
    document.getElementById(
        "sortBtn"
    );

const sortMenu =
    document.getElementById(
        "sortMenu"
    );

const sortLabel =
    document.getElementById(
        "sortLabel"
    );


sortBtn.addEventListener(
    "click",
    () => {

        sortMenu.classList.toggle(
            "show"
        );

    }
);


document
    .querySelectorAll(
        ".sort-menu button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.sort;

                let result =
                    [...filteredSongs];


                if (type === "title") {

                    result.sort(
                        (a, b) =>
                            a.title.localeCompare(
                                b.title
                            )
                    );

                    sortLabel.textContent =
                        "Judul A-Z";
                }


                if (type === "artist") {

                    result.sort(
                        (a, b) =>
                            a.artist_name.localeCompare(
                                b.artist_name
                            )
                    );

                    sortLabel.textContent =
                        "Artis A-Z";
                }


                if (type === "duration") {

                    result.sort(
                        (a, b) =>
                            Number(
                                a.duration_seconds
                            ) -
                            Number(
                                b.duration_seconds
                            )
                    );

                    sortLabel.textContent =
                        "Durasi";
                }


                if (type === "newest") {

                    result.sort(
                        (a, b) =>
                            Number(b.song_id) -
                            Number(a.song_id)
                    );

                    sortLabel.textContent =
                        "Terbaru";
                }


                sortMenu.classList.remove(
                    "show"
                );

                renderSongs(result);

            }
        );

    });


// =====================================================
// PLAYLIST MODAL
// =====================================================

const playlistModal =
    document.getElementById(
        "playlistModal"
    );

const addPlaylistModal =
    document.getElementById(
        "addPlaylistModal"
    );


function openModal(modal) {

    modal.classList.remove(
        "hidden"
    );
}


function closeModal(modal) {

    modal.classList.add(
        "hidden"
    );
}


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        () => closeModal(playlistModal)
    );


document
    .getElementById("closeAddPlaylist")
    .addEventListener(
        "click",
        () => closeModal(addPlaylistModal)
    );


// =====================================================
// CREATE PLAYLIST
// =====================================================

document
    .getElementById(
        "createPlaylistBtn"
    )
    .addEventListener(
        "click",
        async () => {

            const name =
                document
                    .getElementById(
                        "playlistName"
                    )
                    .value
                    .trim();

            const description =
                document
                    .getElementById(
                        "playlistDescription"
                    )
                    .value
                    .trim();

            const isPublic =
                document
                    .getElementById(
                        "playlistPublic"
                    )
                    .checked;

            const message =
                document
                    .getElementById(
                        "playlistMessage"
                    );


            if (!name) {

                message.textContent =
                    "Nama playlist wajib diisi.";

                return;
            }


            try {

                await createPlaylist({

                    user_id: 1,

                    title: name,

                    description,

                    is_public: isPublic

                });


                message.textContent =
                    "Playlist berhasil dibuat!";

                document
                    .getElementById(
                        "playlistName"
                    )
                    .value = "";

                document
                    .getElementById(
                        "playlistDescription"
                    )
                    .value = "";

            } catch (error) {

                message.textContent =
                    "Gagal membuat playlist.";

            }

        }
    );


// =====================================================
// ADD SONG TO PLAYLIST
// =====================================================

let selectedSongForPlaylist =
    null;


async function openAddPlaylistModal(song) {

    selectedSongForPlaylist =
        song;

    document
        .getElementById(
            "addPlaylistSongName"
        )
        .textContent =
        `Tambahkan "${song.title}" ke playlist.`;

    const container =
        document.getElementById(
            "playlistOptions"
        );

    container.innerHTML =
        `<p style="font-size:10px;color:#789;">Memuat playlist...</p>`;

    openModal(
        addPlaylistModal
    );


    const playlists =
        await fetchPlaylists(1);


    if (!playlists.length) {

        container.innerHTML =
            `
                <p style="
                    font-size:10px;
                    color:#789;
                    padding:10px;
                ">
                    Belum ada playlist.
                    Silakan buat playlist baru.
                </p>
            `;

        return;
    }


    container.innerHTML =
        playlists
            .map(
                playlist => `

                    <button
                        class="playlist-option"
                        data-playlist="${playlist.playlist_id}"
                    >

                        <span>
                            <strong>
                                ${escapeHtml(
                    playlist.title
                )}
                            </strong>

                            <br>

                            ${playlist.total_lagu || 0} lagu
                        </span>

                        <i class="fa-solid fa-plus"></i>

                    </button>

                `
            )
            .join("");


    document
        .querySelectorAll(
            ".playlist-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    try {

                        await addSongToPlaylist(

                            button.dataset.playlist,

                            selectedSongForPlaylist.song_id,

                            1

                        );


                        button.innerHTML =
                            `
                                <span>
                                    Berhasil ditambahkan
                                </span>

                                <i class="fa-solid fa-check"></i>
                            `;

                    } catch (error) {

                        alert(
                            "Gagal menambahkan lagu ke playlist."
                        );

                    }

                }
            );

        });
}


// =====================================================
// NEW PLAYLIST FROM ADD MODAL
// =====================================================

document
    .getElementById(
        "newPlaylistFromModal"
    )
    .addEventListener(
        "click",
        () => {

            closeModal(
                addPlaylistModal
            );

            openModal(
                playlistModal
            );

        }
    );


// =====================================================
// NAVIGATION
// =====================================================

document
    .querySelectorAll(
        "[data-section]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.dataset.section;


                document
                    .querySelectorAll(
                        ".menu-item"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                if (
                    button.classList.contains(
                        "menu-item"
                    )
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                if (
                    section === "home"
                ) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }


                if (
                    section === "explore"
                ) {

                    document
                        .getElementById(
                            "exploreSection"
                        )
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }


                if (
                    section === "favorites"
                ) {

                    const favoriteSongs =
                        songs.filter(
                            song =>
                                isFavorite(
                                    song.song_id
                                )
                        );

                    renderSongs(
                        favoriteSongs
                    );

                    document
                        .getElementById(
                            "exploreSection"
                        )
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }


                if (
                    section === "playlist"
                ) {

                    openModal(
                        playlistModal
                    );

                }

            }
        );

    });


// =====================================================
// MOBILE PLAY
// =====================================================

document
    .getElementById(
        "mobilePlay"
    )
    .addEventListener(
        "click",
        togglePlay
    );


// =====================================================
// SHOW ALL
// =====================================================

document
    .getElementById(
        "showAllBtn"
    )
    .addEventListener(
        "click",
        () => {

            searchInput.value = "";

            clearSearch.style.display =
                "none";

            renderSongs(songs);

        }
    );


// =====================================================
// INITIAL LOAD
// =====================================================

async function initializeApp() {

    songs =
        await fetchAllSongs();


    if (!songs.length) {

        songListEl.innerHTML =
            `
                <div class="loading-state">

                    <i
                        class="fa-solid fa-triangle-exclamation"
                        style="
                            font-size:25px;
                            color:#e3a42b;
                        "
                    ></i>

                    <p>
                        Data lagu tidak dapat dimuat.
                    </p>

                    <small>
                        Pastikan Flask dan MySQL sedang berjalan.
                    </small>

                </div>
            `;

        return;
    }


    filteredSongs =
        [...songs];


    renderSongs(
        songs
    );


    updateRangeBackground(
        volumeBar,
        Number(volumeBar.value) * 100
    );

}


document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);