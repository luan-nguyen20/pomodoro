let sessionMins = 25;
let breakMins = 5;

const mainTimeLabel = document.querySelector("#mainTimeLabel");
const mainSquareLabel = document.querySelector("#mainSquareLabel");

function countDown(sessionOrBreakStr){
    let now = new Date().getTime(); // Get today's date and time in millisecs
    let countDownMins = 0;

    if(sessionOrBreakStr.toUpperCase()==='SESSION'){ countDownMins = sessionMins; }
    else{ countDownMins = breakMins; }

    let sessionDeadline = now + countDownMins*60000; //now + countdown mins in millisecs

    // Update the count down every 1 second
    let x = setInterval(function() {
        var now = new Date().getTime();

        // Find the distance between now and the deadline (in millisecs)
        var distance = sessionDeadline-now;

        // Time calculations for hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in main time label
        mainTimeLabel.textContent = hours + ":" + minutes + ":" + seconds;

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            mainTimeLabel.textContent = "EXPIRED";
        }
    },1000)
}


