   
    const canvas = document.querySelector("#game");
    const game = canvas.getContext("2d");
    const up = document.querySelector("#up");
    const down = document.querySelector("#down");
    const right = document.querySelector("#right");
    const left = document.querySelector("#left");
    const spanLives = document.querySelector("#lives");
    const spanTime = document.querySelector("#time");
    const pResult = document.querySelector("#result");
    const spanRecord = document.querySelector("#record");
    const reset = document.querySelector("#reset");
    
    const buttons = document.querySelector(".btns");
    const messages = document.querySelector(".messages");

    const volume = document.querySelector("#volume");
    const audio = document.querySelector("#audio");
    
    const titulo = document.querySelector("#titulo");
    const iniciar = document.querySelector("#iniciar");

   

    buttons.style.display = "none";
    messages.style.display = "none";
    canvas.style.display = "none";
    
    volume.addEventListener("click", () => {
        if(audio.muted == false){
            volume.innerHTML="🔈"
            audio.muted = true;
        } else if (audio.muted == true){
            audio.muted = false;
            volume.innerHTML="🔊"
        }
    })

    iniciar.addEventListener("click", iniciarJuego)

    function iniciarJuego () {
        buttons.style.display = "flex";
        messages.style.display = "flex";
        canvas.style.display = "flex";
        titulo.style.display = "none";
        if (!timeStart) {
            timeStart = Date.now();
            timeInterval = setInterval(showTime,100);
            showRecord ();
        }
    }
    
    
    reset.style.display = "none";
    
    let canvasSize;
    let elementsSize;
    let level = 0;
    let lives = 3;
    
    let timeStart;
    let timePlayer;
    let timeInterval;

    let bombasPosition = [];

    const playerPosition = {
        x: undefined,
        y: undefined,

    };


    const giftPosition = {
        x: undefined,
        y: undefined,
    };

    
    window.addEventListener("load", setCanvasSize);
    window.addEventListener("resize", setCanvasSize); 

    function setCanvasSize() { 

        

        if (window.innerHeight > window.innerWidth){
            canvasSize = window.innerWidth * 0.7;
        } else {
            canvasSize = window.innerHeight * 0.7;
        }

        canvas.setAttribute("width",  canvasSize);
         
        canvas.setAttribute("height",  canvasSize);


        
        
        elementsSize = (canvasSize / 10) - 1.20;
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();
    }

    function startGame () {
        
        
        game.font = elementsSize + "px Verdana";
        game.textAlign = "";
        
        bombasPosition = [];
        const map = maps[level];
        
        if (!map) {
            gameWin();
            return;
        }

      

        const mapRows =   map.trim().split("\n");
        const mapCollums = mapRows.map(row => row.trim().split(""));
        
        showLives ()
        
        game.clearRect(0,0,canvasSize,canvasSize);
        
        mapCollums.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                const emoji = emojis[col];
                const posX = (elementsSize * colI);
                const posY = elementsSize * (rowI + 1);

                if(col == "O") {
                    if (!playerPosition.x && !playerPosition.y) {
                        playerPosition.y = posY;
                        playerPosition.x = posX ;
                    }
                }  else if (col == "I") {
                    giftPosition.x = posX ;
                    giftPosition.y = posY;
                } else if (col == "X") {
                    bombasPosition.push({
                       x: posX ,
                       y: posY,
                    });
                    
                }


                game.fillText(emoji, posX, posY);
            });
        });
        
      
        movePlayer();

    }

    up.addEventListener("click", moveUp);
    down.addEventListener("click", moveDown);
    right.addEventListener("click", moveRight);
    left.addEventListener("click", moveLeft);
    reset.addEventListener("click", reiniciar);
    
    function moveUp () {
        
        if ((playerPosition.y - elementsSize) < elementsSize - 10){
            console.warn("error")
            
        } else {
            playerPosition.y -= elementsSize;
            startGame ()
            
        }
    }
    
    function moveDown () {
        if ((playerPosition.y + elementsSize) > canvasSize ){
            console.warn("error")
        } else { 
            playerPosition.y += elementsSize;
            startGame ();
    }
    }
    
    function moveRight () {
        if ((playerPosition.x + elementsSize) > canvasSize - 17){
            console.warn("error")
            
        } else { 
            playerPosition.x += elementsSize;
            startGame ();
            
    }
    }
    
    function moveLeft () {
        
        if ((playerPosition.x + elementsSize) <= elementsSize){
            console.warn("error")
        } else { 
            playerPosition.x -= elementsSize;
            startGame ();
    }
    }

    function movePlayer () {
        const giftColisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
        const giftColisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
        const giftColision = giftColisionX && giftColisionY;


        
        if (giftColision) {
            win ();
        } 
        
        
        const bombColision =  bombasPosition.find(element => {
            const bombColisionX = element.x.toFixed(3) == playerPosition.x.toFixed(3);
            const bombColisionY = element.y.toFixed(3) == playerPosition.y.toFixed(3);
          
          return bombColisionX && bombColisionY;
        });
        
        
        if (bombColision){
            
            colision ();
        };
        
        
        
        game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);

    
    }
    
    window.addEventListener("keydown",  (event) => {
        switch (event.key) {
            case "ArrowUp":
                moveUp ();
              break;
              case "ArrowDown":
                moveDown ();
              break;
              case "ArrowLeft":
                moveLeft ();
              break;
              case "ArrowRight":
                moveRight ();
              break;
            default:
              break;
          }
    })
    
    function win () {
        level++;
        startGame();
    }

    function gameWin () {
        clearInterval(timeInterval);
        
         const recordTime =localStorage.getItem("record_time");
         const playerTime = Date.now() - timeStart;
         
        if (recordTime) {
            if (recordTime >= playerTime) {
                localStorage.setItem("record_time", playerTime);
               pResult.innerHTML = "Felicidades, superaste el record 🏆";
            } else {
               pResult.innerHTML = "No superaste el record 💀";
            }
        } else {
            localStorage.setItem("record_time", playerTime);
            pResult.innerHTML = "superaste el record";
            
        }
        console.log({recordTime, playerTime});
        
        
        reset.style.display = "flex";
        buttons.style.display = "none";
        messages.style.display = "none";
        canvas.style.display = "none";
        
    }
    
    function colision () {
        
        --lives;
        
        if(lives <= 0) {
            level = 0;
            lives = 3;
            timeStart = undefined;
        } 
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();
        
    }
    
    function showLives () {
        
        const livesArray = Array (lives).fill(emojis["LIVES"]);
      
        spanLives.innerHTML= emojis["LIVES"].repeat(lives);
    }

    function showTime () {
        const msToSec = (Date.now() - timeStart) / 1000;
        const milliseconds = (String(msToSec - Math.floor(msToSec)).split('.')[1]).substring(0,2);
        
        const milliInterval = Date.now() - timeStart;
        let seconds = Math.floor(milliInterval / 1000);
        let minutes = Math.floor(seconds / 60);
    
        seconds = (seconds % 60) < 10 ? `0${seconds % 60}` : seconds % 60;
        minutes = (minutes % 60) < 10 ? `0${minutes % 60}` : minutes % 60;
    
    
        spanTime.innerHTML = `${minutes}:${seconds}:${milliseconds}`;
    }
    function showRecord () {
        
        spanRecord.innerHTML = localStorage.getItem("record_time");
        
    }

    function reiniciar () {
        location.reload();
    }