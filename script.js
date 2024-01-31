console.log("Arey Yaar")
currentsong = new Audio()
let songs = [];
let currfolder;
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    remainingSeconds = Math.floor(remainingSeconds);
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + remainingSeconds;
}
function blocking_NaN()
{
    var durr=formatTime(currentsong.duration).trim()
    if(durr=="NaN:NaN")
    {
        document.querySelector("")
    }
}

async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1]);
        }
    }
    let songsUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // console.log(songsUL)
    songsUL.innerHTML = "";
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li> 
        <img class="invert" src="svgs/music.svg" alt="">
        <div class="info">
            <div class="songname">${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
        </div>
        <img class="invert playnow" src="svgs/play.svg" alt="">
    </li>`;
    }


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        }

        )
    });
}
const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track + ".mp3";
    if (!pause) {
        currentsong.play()
        resume.src = "svgs/pause.svg"
    }
    document.querySelector(".currsongname").innerHTML = track.replace("%20", " ")
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function dispAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cardContainer")
    let anchors = div.getElementsByTagName("a")
    array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes('/songs/')) {
            let folder_name = e.href.split('/').slice(-1)[0]
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder_name}/info.json`);
            let response = await a.json();
            // console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder_name}" class="card">
                <div class="play">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="18" fill="#4CAF50" />
                        <path d="M12.75 9L24.375 18L12.75 27V9Z" fill="#000000" />
                    </svg>
                </div>
                <img src="/songs/${folder_name}/cover.png" alt="">
                <h3>${response.title}</h3>
                <p>
                    ${response.description}
                </p>
            </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}/`)
            console.log("Hii")
            let songsList = [];
            currentsong.pause()
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                songsList.push(e.querySelector(".info").firstElementChild.innerHTML.trim())
            }
            )
            playmusic(songsList[0].replace('.mp3', '').replaceAll("%20", " "))
            

        })
    })
}
async function main() {
    await getsongs('songs/English/');
    playmusic(songs[0].replace(".mp3", "").replace("%20", " "), true)
    //var song1=new Audio(songs[0])
    //song1.play()
    //displaying all the albums
    dispAlbums()
    resume.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            resume.src = "svgs/pause.svg"
        }
        else {
            currentsong.pause()
            resume.src = "svgs/play.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        // console.log(formatTime(currentsong.currentTime), formatTime(currentsong.duration))
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").classList.add('active');
        document.querySelector(".progressbar").classList.add('active');
        document.querySelector(".circle.active").style.left = (((currentsong.currentTime / currentsong.duration) * 100)-0.5) + "%";
        document.querySelector(".progressbar").style.width = (((currentsong.currentTime / currentsong.duration) * 100)) + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) - 0.005;
        document.querySelector(".circle").style.left = (percent * 100) + "%";
        document.querySelector(".progressbar").style.width = (percent + 0.5) * 100 + "%";
        currentsong.currentTime = currentsong.duration * percent;

    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -110 + "%"
    })
    previous.addEventListener("click", () => {
        let songsList = [];
        currentsong.pause()
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            songsList.push(e.querySelector(".info").firstElementChild.innerHTML.trim())
        }
        )
        let index = songsList.indexOf(currentsong.src.split('/').slice(-1)[0].replaceAll("%20", " ").replace(".mp3", "").trim())
        if (index - 1 >= 0) {
            playmusic(songsList[index - 1].replace('.mp3', '').replaceAll("%20", " "))
        }
        else {
            playmusic(songsList[songsList.length - 1].replace('.mp3', '').replaceAll('%20', ' '))
        }
    })
    next.addEventListener("click", () => {
        let songsList = [];
        currentsong.pause()
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            songsList.push(e.querySelector(".info").firstElementChild.innerHTML.trim())
        }
        )
        // console.log(songsList[0])
        let index = songsList.indexOf(currentsong.src.split('/').slice(-1)[0].replaceAll("%20", " ").replace(".mp3", "").trim())
        if (index + 1 < songsList.length) {
            playmusic(songsList[index + 1].replace(".mp3", "").replaceAll("%20", " "))
        }
        else {
            playmusic(songsList[0].replace(".mp3", "").replaceAll("%20", " "))
        }
        console.log(currentsong)

    })
    document.querySelector(".volume").addEventListener("mouseover", () => {
        document.querySelector(".range").style.display = "block";
    })
    // document.querySelector(".volume").addEventListener("mouseout",()=>
    // {
    //     document.querySelector(".range").style.display="none";
    // })
    document.querySelector("body").addEventListener("click", () => {
        document.querySelector(".range").style.display = "none";
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })
    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            if (!currentsong.paused) {
                currentsong.pause();
                resume.src = 'svgs/play.svg'

            } else {
                currentsong.play();
                resume.src = 'svgs/pause.svg'

            }
        }
    });
    // using left and right keys to forward and backward the song
    document.addEventListener("keydown",function(event)
    {
        if(event.key=='ArrowRight')
        {
            currentsong.currentTime=currentsong.currentTime+5;
        }
    })
    document.addEventListener("keydown",function(event)
    {
        if(event.key=='ArrowLeft')
        {
            if(currentsong.currentTime>=5)
            {
                currentsong.currentTime-=5;
            }
            else{
                let songsList = [];
                currentsong.pause()
                Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                    songsList.push(e.querySelector(".info").firstElementChild.innerHTML.trim())
                }
                )
                let index = songsList.indexOf(currentsong.src.split('/').slice(-1)[0].replaceAll("%20", " ").replace(".mp3", "").trim())
                if (index - 1 >= 0) {
                    playmusic(songsList[index - 1].replace('.mp3', '').replaceAll("%20", " "))
                }
                else {
                    playmusic(songsList[songsList.length - 1].replace('.mp3', '').replaceAll('%20', ' '))
                } 
            }
            
        }
    })



    //to play the next song when the song finishes

    currentsong.addEventListener("timeupdate", () => {
        if (currentsong.currentTime == currentsong.duration) {
            let songsList = []
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                songsList.push(e.querySelector(".info").firstElementChild.innerHTML.trim())
            }
            )
            let index = songsList.indexOf(currentsong.src.split('/').slice(-1)[0].replaceAll("%20", " ").replace(".mp3", "").trim())
            if (index + 1 < songsList.length) {
                playmusic(songsList[index + 1].replace(".mp3", "").replaceAll("%20", " "))
            }
            else {
                playmusic(songsList[0].replace(".mp3", "").replaceAll("%20", " "))
            }
        }
    })
    //press volume button to mute the song
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("svgs/volume.svg")) {
            e.target.src = e.target.src.replace("svgs/volume.svg", "svgs/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("svgs/mute.svg", "svgs/volume.svg")
            currentsong.volume = 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50
        }
    })
    
    
}
main()