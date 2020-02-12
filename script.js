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

let sessionMins = 0.2;
let breakMins = 0.1;
let remainHoursStr = '00';
let remainMinsStr = '00';
let remainSecsStr = '00';

const mainTimeLabel = document.querySelector("#mainTimeLabel");
const mainSquareLabel = document.querySelector("#mainSquareLabel");

let finished = false;
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
        console.log('mins: ' + countDownMins);
    }

    let deadline = now + countDownMins*60000; //now + countdown mins in millisecs

    // Update the count down every 1 second
    let x = setInterval(function() {
        if(finished===true){
            mainTimeLabel.textContent = '00:00:00';
            mainSquareLabel.textContent = 'SESSION/BREAK';
            clearInterval(x);
            return;
        }

        var now = new Date().getTime();

        // Find the distance between now and the deadline (in millisecs)
        var distance = deadline - now;

        // Time calculations for hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //if paused, store remaining hours, mins, secs and clear interval
        if(paused===true){
            remainHoursStr = mainTimeLabel.textContent.substring(0,2);
            remainMinsStr = mainTimeLabel.textContent.substring(3,5);
            remainSecsStr = mainTimeLabel.textContent.substring(6,8);
            console.log(remainHoursStr + ' ' + remainMinsStr + ' ' + remainSecsStr);
            clearInterval(x);
        }

        // Display the result in main time label
        mainTimeLabel.textContent = padded(hours) + ":" + padded(minutes) + ":" + padded(seconds);

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
    finished = true;
}

function pauseCountDown(){
    paused = true;
}

const startBtn = document.querySelector("#startBtn");
startBtn.addEventListener('click', function(){
    startCountDown();
});

const stopBtn = document.querySelector("#stopBtn");
stopBtn.addEventListener('click', function(){
    stopCountDown();
});

const pauseBtn = document.querySelector("#pauseBtn");
pauseBtn.addEventListener('click', function(){
    pauseCountDown();
});


