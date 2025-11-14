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
            title: "Cradles",
            artist: "Sub Urban",
            src: "song.mp3",
            lyrics: [
                // 'time' es el segundo exacto en que quieres que aparezca la línea
                { time: 14, line: "Vivo en mi propio mundo de fantasía" },
{ time: 20, line: "Niños gritando groserías desde sus cunas" },
{ time: 26, line: "Veo el mundo con ojos cubiertos de tinta y cloro" },
{ time: 32, line: "Tacho a quienes oyeron mis gritos y me vieron llorar" },
{ time: 38, line: "Amo todo esto" },
{ time: 41, line: "El fuego se expande por mi habitación" },
{ time: 45, line: "Mi mundo es tan brillante" },
{ time: 46, line: "Cuesta respirar, pero está bien" },
{ time: 48, line: "Shh" },
{ time: 61, line: "Shh" },
{ time: 74, line: "Pego mis párpados para forzar la realidad (oh, no no)" },
{ time: 80, line: "¿Por qué no me dejas atiborrarme de felicidad?" },
{ time: 86, line: "Vivo en mi propio mundo de fantasía" },
{ time: 92, line: "Niños gritando groserías desde sus cunas" },
{ time: 98, line: "Hay días que me siento más flaco que nunca" },
{ time: 104, line: "A veces no sé si este cuerpo me pertenece" },
{ time: 110, line: "Amo todo esto" },
{ time: 113, line: "El fuego se expande por mi habitación" },
{ time: 117, line: "Mi mundo es tan brillante" },
{ time: 118, line: "Cuesta respirar, pero está bien" },
{ time: 120, line: "Shh" },
{ time: 133, line: "Shh" },
{ time: 146, line: "Quiero probar tu satisfacción" },
{ time: 149, line: "Aguanta el aliento y siente la tensión" },
{ time: 152, line: "Los demonios se esconden tras la redención" },
{ time: 154, line: "La honestidad es un boleto solo de ida al infierno" },
{ time: 158, line: "Quiero saborear el consumo" },
{ time: 160, line: "Respira rápido y gasta el oxígeno" },
{ time: 163, line: "Escucha a los niños cantar fuerte" },
{ time: 166, line: "Es música hasta que la mecha se consuma" },
{ time: 169, line: "Shh" },
{ time: 182, line: "Últimamente solo quiero despreocuparme, sí" },
{ time: 186, line: "Solo pateando margaritas" },
{ time: 190, line: "Tengo demasiadas monedas en los bolsillos" },
{ time: 193, line: "Las cuento, como tréboles de cuatro hojas en mi medallón" },
{ time: 196, line: "Agujetas sueltas, sí" },
{ time: 200, line: "Tropezando con mis fantasías" },
{ time: 202, line: "Escuchando sucias nanas en repetición" },
{ time: 206, line: "Bien podría pudrirme en la guardería y contar ovejas" }
                // ... Sigue añadiendo líneas ...
            ]
        },
        {
            title: "Heathens", // <-- CAMBIA ESTO
            artist: "Twenty One Pilots", // <-- CAMBIA ESTO
            src: "song2.mp3",
            lyrics: [
                { time: 6, line: "Todos mis amigos son desalmados, ten calma" }
{ time: 11, line: "Espera a que pregunten de quién vienes" }
{ time: 16, line: "Por favor, no hagas movimientos bruscos" }
{ time: 21, line: "No sabes ni la mitad del horror" }
{ time: 27, line: "Todos mis amigos son desalmados, ten calma" }
{ time: 32, line: "Espera a que pregunten de quién vienes" }
{ time: 37, line: "Por favor, no hagas movimientos bruscos" }
{ time: 43, line: "No sabes ni la mitad del horror" }
{ time: 49, line: "Bienvenido al cuarto de gente... que tiene cuartos llenos de gente" }
{ time: 50, line: "Que un día amaron y ahora están guardados" }
{ time: 55, line: "Solo porque dejamos las armas en la puerta" }
{ time: 56, line: "No significa que la mente deje de ser explosiva" }
{ time: 60, line: "Nunca sabrás si hay un psicópata sentado a tu lado" }
{ time: 63, line: "Nunca sabrás si hay un asesino sentado a tu lado" }
{ time: 66, line: "Pensarás: '¿Cómo llegué aquí, sentado a tu lado?'" }
{ time: 69, line: "Pero después de todo, por favor no lo olvides" }
{ time: 73, line: "Todos mis amigos son desalmados, ten calma" }
{ time: 78, line: "Espera a que pregunten de quién vienes" }
{ time: 84, line: "Por favor, no hagas movimientos bruscos" }
{ time: 89, line: "No sabes ni la mitad del horror" }
{ time: 95, line: "No tratamos muy bien a los extraños" }
{ time: 97, line: "Dicen que los nuevos tienen un olor peculiar" }
{ time: 100, line: "Desconfías, por no decir algo más" }
{ time: 103, line: "Dicen que pueden oler tus intenciones" }
{ time: 105, line: "Nunca sabrás si hay un fenómeno sentado a tu lado" }
{ time: 108, line: "Tendrás gente muy rara sentada a tu lado" }
{ time: 111, line: "Pensarás: '¿Cómo llegué aquí, sentado a tu lado?'" }
{ time: 114, line: "Pero después de todo, por favor no lo olvides (cuidado)" }
{ time: 123, line: "(Cuidado)" }
{ time: 129, line: "Todos mis amigos son desalmados, ten calma" }
{ time: 134, line: "Espera a que pregunten de quién vienes" }
{ time: 139, line: "Por favor, no hagas movimientos bruscos" }
{ time: 145, line: "No sabes ni la mitad del horror" }
{ time: 150, line: "Todos mis amigos son desalmados, ten calma (cuidado)" }
{ time: 156, line: "Espera a que pregunten de quién vienes (cuidado)" }
{ time: 160, line: "Por favor, mis amigos son desalmados, ten calma (cuidado)" }
{ time: 166, line: "Espera a que pregunten de quién vienes" }
{ time: 171, line: "¿Por qué viniste? Sabías que debías quedarte" }
{ time: 177, line: "Traté de advertirte que te alejaras" }
{ time: 182, line: "Y ahora están afuera, listos para entrar" }
{ time: 188, line: "Parece que podrías ser... uno de nosotros" }
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
