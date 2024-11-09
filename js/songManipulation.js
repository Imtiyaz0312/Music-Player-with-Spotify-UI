let lastvol;

function SecondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Adding leading zeros if necessary
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }

    return minutes + ':' + remainingSeconds;
}

function playorpause() {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "/assets/images/pause.svg"

    } else {

        currentSong.pause()
        play.src = "/assets/images/play.svg"

    }
}

function nextSong() {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length)
        playMusic(songs[index + 1].replace(".mp3", ""))
}


function prevSong() {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0)
        playMusic(songs[index - 1].replace(".mp3", ""))
}



//Adding key board functions to change music functions
document.addEventListener('keydown', (e) => {
    console.log(e.key)
    switch (e.key) {
        case ' ':
            playorpause();
            break;
        case 'ArrowDown':
            {
                e.preventDefault()
                let vol = parseFloat(currentSong.volume.toFixed(1))
                if (0.1 <= vol) {
                    vol = vol - 0.1
                    currentSong.volume = parseFloat(vol.toFixed(1))
                }
            }
            break;
        case 'ArrowUp':
            {
                e.preventDefault()
                let vol = parseFloat(currentSong.volume.toFixed(1))
                if (vol <= 0.9) {
                    vol = vol + 0.1
                    currentSong.volume = parseFloat(vol.toFixed(1))
                }
            }
            break;
        case 'm':
            {
                e.preventDefault()
                if (currentSong.volume != 0) {
                    lastvol = currentSong.volume
                    currentSong.volume = 0
                } else {
                    currentSong.volume = lastvol
                }
                console.log(currentSong.volume)
            }
            break;
        case 'P':
            prevSong();
            break;
        case 'N':
            nextSong();
            break;
    }
});



// Add an event to volume (input value to volume)
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100
        // console.log(currentSong.volume)
})

//Add an event to volume (volume to input value)
currentSong.addEventListener("volumechange", (e) => {
    document.querySelector(".range").getElementsByTagName("input")[0].value = currentSong.volume * 100
    if (currentSong.volume == 0)
        vol.src = "/assets/images/mute.svg"
    else
        vol.src = "/assets/images/volume.svg"
})




document.querySelector(".volume").addEventListener("click", () => {
    if (count == 0) {

        count = count + 1
        document.querySelector(".range").style.zIndex = "10";

    } else {
        count = count - 1
        document.querySelector(".range").style.zIndex = "-1";
    }
})


// Attach an event listener to play , next, previous
play.addEventListener("click", () => {
    playorpause()
})

//Listen for time update event
currentSong.addEventListener("timeupdate", () => {

    if (isNaN(currentSong.duration))
        return
    document.querySelector(".songtime").innerHTML = `${SecondsToMinutes(currentSong.currentTime)} / ${SecondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

})



//Add an event to play previous song
previous.addEventListener("click", prevSong)

//Add an event to play previous song
next.addEventListener("click", nextSong)




//Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent - 1 + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100
})