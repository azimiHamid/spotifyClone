let play = document.querySelector('#play');
let currentSong = new Audio();
// let songsName = "";

function secondsToMinutesSeconds(seconds) {
    // Ensure seconds is a non-negative integer
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format the result with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify%20Clone/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function playMusic(music, pause=false) {
    currentSong.src = `http://127.0.0.1:5500/Spotify%20Clone/songs/${music}`;
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.png";
    }
    document.querySelector(".song-info").innerHTML = decodeURI(music);
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
}

function pauseMusic(music) {
    currentSong.src = `http://127.0.0.1:5500/Spotify%20Clone/songs/${music}`;
    currentSong.pause();
    play.src = "images/play.png";
}

async function main() {

    // get the list of all the songs
    let songs = await getSongs();
    playMusic(songs[0], true);

    // show all the songs in the playlist
    let songUL = document.querySelectorAll(".song-list ul")[0];
    let singer = ["Hamid", "Halim", "Mars", "Marry", "Emma", "Marry", "Emma", "Halim", "Mars"];
    let randomSinger = Math.floor(Math.random() * singer.length);
    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <div class="wrapper">
                <img class="invert" src="music.svg" alt="i">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>${singer[randomSinger]}</div>
                </div>
            </div>
            <div class="play-now">
                <span>Play Now</span>
                <img class="invert" src="images/play-icon.png" alt="i">
            </div>          
        </li>`;
    }

    // Attach an event listener to each li element which consist of songs
    Array.from(document.querySelectorAll(".song-list li")).forEach(elem => {
        elem.addEventListener("click", e => {
            let songName = elem.querySelector(".info").firstElementChild.innerHTML;
            console.log(songName); //

            if (currentSong.paused) {
                playMusic(songName);
            } else {
                pauseMusic(songName);
            }
        })
    })

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.png";
        } else {
            currentSong.pause();
            play.src = "images/play.png";
        }
    })

    // Listen for time update event
    currentSong.addEventListener("timeupdate",() => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an EventListener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Toggle hamburger eventListener
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });

    window.addEventListener("click", (e) => {
        if (e.target !== document.querySelector(".left") && e.target !== document.querySelector(".hamburger")) {
            document.querySelector(".left").style.left = "-110%";
        }
    });

}

main();

