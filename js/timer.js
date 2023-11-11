'use strict'


function restartTimer() {
    document.querySelector('.timer').textContent = 0
    stopStopwatch()
    gFirstClick = true
}

function updateTimer() {
    const currentTime = new Date().getTime()
    const elapsedTime = (currentTime - gStartTime) / 1000
    document.querySelector('.timer').textContent = elapsedTime.toFixed(3)
}

function startStopwatch() {
    gStartTime = new Date().getTime()
    gInterval = setInterval(updateTimer, 15)
}

function stopStopwatch() {
    clearInterval(gInterval)
}
