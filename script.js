function padded(num){
    let paddedNumStr = '';
    if(num<10){
        paddedNumStr = '0' + String(num);
    }
    else{
        paddedNumStr = String(num);
    }

    return paddedNumStr;
}

const mainTimeLabel = document.querySelector("#mainTimeLabel");
const mainSquareLabel = document.querySelector("#mainSquareLabel");

//take time in millisecs and return timeArr[hours, mins, secs]
function calcTimeFromMilliSecs(millisecs){
    let hours = Math.floor((millisecs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((millisecs % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((millisecs % (1000 * 60)) / 1000);
    let timeArr = [hours,minutes,seconds];
    return timeArr;
}

//take an arr[hours,mins,secs] and display it in mainTimeLabel
function displayTime(timeArr){
    mainTimeLabel.textContent = padded(timeArr[0]) + ':' + padded(timeArr[1]) + ':' + padded(timeArr[2]);
}

let sessionMins = 0.17; // 10 secs
let breakMins = 0.09; // 5 secs
let remainHoursStr = '00';
let remainMinsStr = '00';
let remainSecsStr = '00';

const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const pauseBtn = document.querySelector("#pauseBtn");

function disableStartBtn(){ startBtn.disabled = true;}
function disablePauseBtn(){ pauseBtn.disabled = true;}
function disableStopBtn(){ stopBtn.disabled = true;}

function enableStartBtn(){ startBtn.disabled = false;}
function enablePauseBtn(){ pauseBtn.disabled = false;}
function enableStopBtn(){ stopBtn.disabled = false;}

disablePauseBtn();
disableStopBtn();

let playing = false;
let finished = true;
let paused = false;

function countDown(sessionOrBreakStr){
    let now = new Date().getTime(); // Get today's date and time in millisecs
    let countDownMins = 0;

    if(sessionOrBreakStr.toUpperCase()==='SESSION'){ 
        countDownMins = sessionMins; 
        mainSquareLabel.textContent = 'SESSION';
    }
    else if(sessionOrBreakStr.toUpperCase()==='BREAK') { 
        mainSquareLabel.textContent = 'BREAK';
        countDownMins = breakMins; 
    }
    else if(sessionOrBreakStr.toUpperCase()==='REMAIN'){
        countDownMins = parseInt(remainMinsStr) + parseInt(remainHoursStr)*60 + parseInt(remainSecsStr)/60;
    }

    let deadline = now + countDownMins*60000; //now + countdown mins in millisecs

    // Update the count down every 1 second
    let x = setInterval(function() {
        if(playing===true){
            disableStartBtn();
            enablePauseBtn();
            enableStopBtn();
        }

        if(finished===true){
            clearInterval(x);
            mainTimeLabel.textContent = '00:00:00';
            mainSquareLabel.textContent = 'SESSION/BREAK';
            disablePauseBtn();
            disableStopBtn();
            enableStartBtn();
            return;
        }

        //if paused, store remaining hours, mins, secs and clear interval
        if(paused===true){
            clearInterval(x);
            remainHoursStr = mainTimeLabel.textContent.substring(0,2);
            remainMinsStr = mainTimeLabel.textContent.substring(3,5);
            remainSecsStr = mainTimeLabel.textContent.substring(6,8);
            disablePauseBtn();
            enableStartBtn();
            enableStopBtn();
        }

        let now = new Date().getTime();

        // Find the distance between now and the deadline (in millisecs)
        let distance = deadline - now;

        // Time calculations for hours, minutes and seconds
        let timeArr = calcTimeFromMilliSecs(distance);

        // Display the result in main time label
        displayTime(timeArr);

        // If session/break count down is finished, switch to break/session countdown
        if (distance < 0) {
            clearInterval(x);
            if(mainSquareLabel.textContent==='SESSION'){
                mainTimeLabel.textContent = '00:00:00';
                countDown('break');
            }
            else if(mainSquareLabel.textContent==='BREAK'){
                mainTimeLabel.textContent = '00:00:00';
                countDown('session');
            }
        }
    },1000)
}

//if paused, count down with remainMins, else countdown with sessionMins
function startCountDown(){
    playing = true;
    finished = false;
    if(paused===true){
        paused = false;
        countDown('remain');
    }
    else{
        countDown('session');
    }
}

function stopCountDown(){
    startCountDown();
    playing = false;
    paused = false;
    finished = true;
}

function pauseCountDown(){
    paused = true;
    playing = false;
    finished = false;
}

startBtn.addEventListener('click', function(){
    startCountDown();
});

stopBtn.addEventListener('click', function(){
    stopCountDown();
});

pauseBtn.addEventListener('click', function(){
    pauseCountDown();
});


