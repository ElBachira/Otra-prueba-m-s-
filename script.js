document.addEventListener('DOMContentLoaded', function() {

    // --- PARCHE PARA AUTOPLAY ---
    // ¡Eliminado! Ya no es necesario, el botón de play principal se encargará.
    const audio = document.getElementById('song-player'); 

    // --- PRE-LOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
    });

    // --- EFECTOS DE SONIDO ---
    const clickSound = new Audio('https://www.fesliyanstudios.com/play-mp3/387');
    const swooshSound = new Audio('https://www.fesliyanstudios.com/play-mp3/570');
    
    // CORRECCIÓN: Se eliminó '.play-button' del selector para evitar
    // el conflicto de audio. Los botones prev/next (con .player-ctrl-btn) 
    // SÍ mantendrán el sonido de clic.
    document.querySelectorAll('.tab-button, .close-btn, .links-grid a, .player-ctrl-btn').forEach(element => {
        element.addEventListener('click', () => {
            if (element.matches('.links-grid a')) {
                swooshSound.currentTime = 0;
                swooshSound.play().catch(e => console.log("Error al reproducir swoosh:", e));
            } else {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log("Error al reproducir click:", e));
            }
        });
    });

    // --- ANIMACIÓN DE TEXTO "MÁQUINA DE ESCRIBIR" ---
    document.querySelectorAll('.typewriter').forEach((element, index) => {
        const text = element.innerHTML;
        element.innerHTML = '';
        element.style.opacity = 1;
        let i = 0;
        setTimeout(() => {
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 25);
        }, 500 + index * 100); 
    });

    // --- EFECTO PARALLAX ---
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xOffset = (clientX / innerWidth - 0.5) * -2;
        const yOffset = (clientY / innerHeight - 0.5) * -2;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.style.backgroundPosition = `calc(50% + ${xOffset}%) calc(50% + ${yOffset}%)`;
        }
    });

    // --- LÓGICA DE PESTAÑAS ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const closeButtons = document.querySelectorAll('.close-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const paneId = button.dataset.tab;
            document.getElementById(paneId).classList.add('active');
            if (paneId === 'stats-tab') { animateStats(); }
        });
    });
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.overlay-pane').classList.remove('active');
        });
    });
    function animateStats(){document.querySelectorAll('.overlay-pane.active .fill').forEach(bar=>{bar.style.width='0%';const percentage=bar.getAttribute('data-p');setTimeout(()=>{bar.style.width=percentage+'%'},100)})}
    

    // --- LÓGICA DEL REPRODUCTOR DE MÚSICA Y LETRAS (COMPLETAMENTE NUEVO) ---

    // =================================================================
    // === ¡EDITA ESTA SECCIÓN CON TUS CANCIONES Y LETRAS! ===
    // =================================================================
    const songs = [
        {
            title: "Una lágrima Que Dar",
            artist: "Danny Elfman",
            src: "song.mp3",
            lyrics: [
                // 'time' es el segundo exacto en que quieres que aparezca la línea
                { time: 14, line: "Vivo en mi propio mundo de fantasía" },
{ time: 20, line: "Niños gritando en sus cunas, groserías" },
{ time: 26, line: "Veo el mundo tras pantallas tintadas, cubiertas de hielo" },
{ time: 32, line: "Malditos los que temen mis llantos y me ven llorar" },
{ time: 39, line: "Amo todo" },
{ time: 42, line: "Fuego esparciéndose por mi habitación" },
{ time: 45, line: "Mi mundo es tan brillante" },
{ time: 46, line: "Cuesta respirar, pero está bien (shh)" },
{ time: 114, line: "Pega mis ojos abiertos para forzar la realidad" },
{ time: 120, line: "¿Por qué no me dejas comer mi peso en alegría?" },
{ time: 126, line: "Vivo en mi propio mundo de fantasía" },
{ time: 132, line: "Niños gritando en sus cunas, groserías" },
{ time: 138, line: "Unos días me siento más delgado que todos los demás" },
{ time: 145, line: "Y otros días no sé si mi cuerpo me pertenece" },
{ time: 150, line: "Amo todo" },
                // ... Sigue añadiendo líneas ...
            ]
        },
        {
            title: "Tu Segunda Canción", // <-- CAMBIA ESTO
            artist: "Nombre del Artista", // <-- CAMBIA ESTO
            src: "song2.mp3",
            lyrics: [
                { time: 3, line: "Esta es la letra" },
                { time: 6, line: "de la segunda canción" },
                { time: 10, line: "Añade tantas líneas" },
                { time: 14, line: "como necesites." },
                { time: 18, line: "El tiempo es en segundos." },
                // ... Sigue añadiendo líneas ...
            ]
        }
    ];
    // =================================================================
    // === FIN DE LA SECCIÓN EDITABLE ===
    // =================================================================

    let currentSongIndex = 0;
    let currentLyricIndex = -1;

    // Elementos del DOM
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songTitleEl = document.getElementById('song-title');
    const songArtistEl = document.getElementById('song-artist');
    const spotifyIcon = document.querySelector('.spotify-icon');
    const lyricsContainer = document.getElementById('lyrics-container');
    
    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';

    // Cargar una canción
    function loadSong(songIndex) {
        const song = songs[songIndex];
        audio.src = song.src;
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        loadLyrics(song.lyrics);
        
        // Resetea el estado de reproducción
        audio.pause();
        playPauseBtn.innerHTML = playIcon;
        spotifyIcon.classList.remove('is-spinning');
    }

    // Cargar las letras de una canción
    function loadLyrics(lyrics) {
        lyricsContainer.innerHTML = ''; // Limpia letras anteriores
        currentLyricIndex = -1; // Resetea el índice

        if (!lyrics || lyrics.length === 0) {
            lyricsContainer.innerHTML = '<p class="lyric-line active">♪ No hay letra para esta canción ♪</p>';
            return;
        }

        lyrics.forEach((line, index) => {
            const p = document.createElement('p');
            p.textContent = line.line;
            p.classList.add('lyric-line');
            p.dataset.index = index; // Guardamos el índice para encontrarlo luego
            lyricsContainer.appendChild(p);
        });
        
        // Resetea el scroll
        lyricsContainer.style.transform = `translateY(0px)`;
    }

    // Botón de Play/Pausa
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            // Esta es la parte importante. El primer play() debe ser
            // directo de un clic del usuario.
            audio.play().catch(e => console.error("Error al intentar reproducir:", e));
            playPauseBtn.innerHTML = pauseIcon;
            spotifyIcon.classList.add('is-spinning');
        } else {
            audio.pause();
            playPauseBtn.innerHTML = playIcon;
            spotifyIcon.classList.remove('is-spinning');
        }
    });

    // Botón de Anterior
    prevBtn.addEventListener('click', () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1; // Vuelve al final
        }
        loadSong(currentSongIndex);
        audio.play().catch(e => console.error("Error al intentar reproducir:", e)); // Reproduce automáticamente la nueva canción
        playPauseBtn.innerHTML = pauseIcon;
        spotifyIcon.classList.add('is-spinning');
    });

    // Botón de Siguiente
    nextBtn.addEventListener('click', () => {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0; // Vuelve al inicio
        }
        loadSong(currentSongIndex);
        audio.play().catch(e => console.error("Error al intentar reproducir:", e)); // Reproduce automáticamente la nueva canción
        playPauseBtn.innerHTML = pauseIcon;
        spotifyIcon.classList.add('is-spinning');
    });

    // Cuando la canción termina, pasa a la siguiente
    audio.addEventListener('ended', () => {
        nextBtn.click(); // Simula un click en "siguiente"
    });

    // El corazón de las letras: se ejecuta cada vez que el tiempo de la canción avanza
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const lyrics = songs[currentSongIndex].lyrics;

        if (!lyrics || lyrics.length === 0) return; // No hacer nada si no hay letras

        // Encontrar el índice de la letra actual
        let newActiveIndex = -1;
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                newActiveIndex = i;
                break;
            }
        }

        // Si la línea activa no ha cambiado, no hacer nada (para optimizar)
        if (newActiveIndex === currentLyricIndex) {
            return;
        }

        currentLyricIndex = newActiveIndex;

        // Quitar 'active' de todas las líneas
        lyricsContainer.querySelectorAll('.lyric-line').forEach(lineEl => {
            lineEl.classList.remove('active');
        });

        if (currentLyricIndex !== -1) {
            // Añadir 'active' a la línea actual
            const activeLine = lyricsContainer.querySelector(`.lyric-line[data-index="${currentLyricIndex}"]`);
            if (activeLine) {
                activeLine.classList.add('active');

                // === Lógica de "scroll" ===
                // Altura de la caja de letras (100px) / 2 = 50px (para centrar)
                // Posición de la línea activa - 50px + la mitad de su propia altura
                const scrollOffset = activeLine.offsetTop - (100 / 2) + (activeLine.clientHeight / 2);
                
                // Usamos transform: translateY para un scroll suave (definido en el CSS)
                lyricsContainer.style.transform = `translateY(-${scrollOffset}px)`;
            }
        } else {
            // Si no hay línea activa (antes de la primera), resetea el scroll
            lyricsContainer.style.transform = `translateY(0px)`;
        }
    });

    // Cargar la primera canción al iniciar
    loadSong(currentSongIndex);
    
    // --- FIN DE LA LÓGICA DEL REPRODUCTOR ---


    // --- EASTER EGG Y BOTÓN DE COPIAR ---
    const fnafSticker=document.getElementById('fnaf-sticker');const honkSound=new Audio('https://www.myinstants.com/media/sounds/fnaf-nose-honk.mp3');fnafSticker.addEventListener('click',()=>{honkSound.currentTime=0;honkSound.play().catch(e => {})});
    const copyBtn = document.getElementById('copy-link-btn');
    const originalBtnText = copyBtn.innerHTML;
    copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            copyBtn.classList.add('copied');
            swooshSound.currentTime = 0;
            swooshSound.play().catch(err => {});
            setTimeout(() => {
                copyBtn.innerHTML = originalBtnText;
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });
});
