window.currentSong = new Audio();
let songs;
let currFolder;
let count = 0;
let timeout;

console.log("Hey there you know im working")

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/assets/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;


    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    //Load first song
    if (!undefined)
        playMusic(decodeURI(songs[0]).replace(".mp3", ""), true)


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="assets/images/music.svg" alt="">
        <div class="info">
            <div>${decodeURI(song.replace(".mp3", ""))}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="assets/images/play.svg" alt="" class="invert">
             </div>    
         </li>`;
    }


    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    });

    return songs;
}







const playMusic = (track, pause = false) => {
    // let audio = new Audio("/assets/songs/" + track + ".mp3")
    currentSong.src = `/assets/${currFolder}/` + track + ".mp3"
    if (!pause) {
        currentSong.play()
        play.src = "/assets/images/pause.svg"
    }

    // playorpause()
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replace(".mp3", ""))
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/assets/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-2)[0]
            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/assets/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <svg class="cardPlay" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                            </path>
                        </svg>
                        <img src="assets/songs/${folder}/cover.jpg" alt="cover image">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`

        }

        //load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(decodeURI(songs[0]).replace(".mp3", ""))
            })
        })


    }

}


async function main() {



    //Get the list of all songs
    await getSongs("songs/Hit%20Songs")

    //Display all the albums on the page
    displayAlbums()












    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    //Add an event listener for closing hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })





}

main()