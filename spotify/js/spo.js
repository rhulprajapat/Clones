let currentSong = new Audio();

let songs;

let currFolder;

//Convert minutes and seconds into a two-digit format
function formatTime(seconds) {

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
 
    minutes = minutes.toString().padStart(2, '0');
    remainingSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
}

//selet to searchbar
const searchInput = document.querySelector(".bar-1");
const resultsList = document.querySelector(".results-list");

//data for example
const data = ["Arijit Singh", "Honey Singh", "Divine", "Bohemia", "Diljit", "No copyright song", "No copyright song"];

searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    resultsList.innerHTML = ""; 

    if (query) {
        const filteredResults = data.filter(item => item.toLowerCase().includes(query));
        resultsList.style.display = filteredResults.length > 0 ? "block" : "none";

        filteredResults.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            resultsList.appendChild(li);

            li.addEventListener("click", () => {
                searchInput.value = item;
                resultsList.style.display = "none"; // hide list
            });
        });
    } else {
        resultsList.style.display = "none"; // Hide list when input is empty
    }
});


async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    //show all songs in the playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                                                    <img class="invert" src="svg/list.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                            </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="svg/play.svg" alt="">
                            </div>
                    </li>`;
    }
    //play audio
    //audio = new Audio(songs[0]);
    //audio.play();

    //audio.addEventListener("loadeddata", () => {
    // console.log(audio.duration, audio.currentSrc, audio.currentTime)
    // The duration variable now holds the duration (in seconds) of the audio clip
    //});

    //event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            //console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    //let audio = new Audio("/songs/" + track)
    //audio.play()
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".song-du").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    //console.log(e.href)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs/")) {
            //console.log(e.href.split("/").slice(-1)[0])
            let folder = e.href.split("/").slice(-1)[0]
            //let folder = e.href.split("/").slice(-2,-1)[0]; // Get the second-to-last segment
            //metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            //console.log("Fetching folder:", folder);
            //console.log(folder)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                fill="none">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round"
                                    transform="scale(0.8) translate(2, 2)" />
                            </svg>
                        </div>
                        <img
                            src="/songs/${folder}/images.jpg">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    //playlist = card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        //console.log(e)
        e.addEventListener("click", async item => {
            //console.log(item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

//console.log(anchors)


async function main() {
    await getSongs("songs/ss")
    //console.log(songs)
    playMusic(songs[0], true)

    //albums
    displayAlbums()

    //play, next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svg/play.svg"
        }
    })
    //time update event
    //currentSong.addEventListener("timeupdate", () => {
    //  console.log(currentSong.currentTime, currentSong.duration)
    //document.querySelector(".song-du").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    //})
    currentSong.addEventListener("timeupdate", () => {
        const currentTimeFormatted = formatTime(Math.floor(currentSong.currentTime));
        const durationFormatted = formatTime(Math.floor(currentSong.duration) || 0); // NaN को संभालने के लिए || 0
        document.querySelector(".song-du").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    });

    //seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //previous
    previous.addEventListener("click", () => {
        //console.log("previous clicked")
        //console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //console.log(songs, index)
        if ((index - 1) >= length) {
            playMusic(songs[index - 1])
        }
    })

    //next
    next.addEventListener("click", () => {
        //console.log("next clicked")
        //console.log(currentSong.src.split("/").slice(-1)[0])
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //console.log(songs, index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })




}

main()