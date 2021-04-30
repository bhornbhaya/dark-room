let timerText;
class timerSetup {

    displayTimer(score){
        timerText = document.createElement('div');
        timerText.style.position = 'absolute';
        timerText.style.width = '100px';
        timerText.style.height = '45px';
        timerText.style.fontSize = '26px';
        timerText.style.color = 'white';
        timerText.style.backgroundColor = 'black';
        timerText.innerHTML = score;
        timerText.style.textAlign = 'right';
        timerText.style.align = 'right';
        timerText.style.top = 20 + 'px';
        timerText.style.left = 25 + 'px';
        document.body.appendChild(timerText);
    }

    convertToMinutes(score) {
        // Hours, minutes and seconds
        var mins = ~~(score / 6000);
        var secs = ~~((score % 6000) / 100);
        var ms = ~~score % 100;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";
        if (mins > 0) {
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        }
        ret += "" + secs + ":" + (ms < 10 ? "0" : "");
        ret += "" + ms;
        return ret;
    }

    calcBestScore(score, bestScore){
        //INITIALIZING HIGHSCORE ON FIRST RUN
        if (bestScore === -1){
            bestScore = score;
        }
        else if (score < bestScore){
            bestScore = score;
        }
        return bestScore;
    }

    getBestScore(highScore){
        console.log(highScore);
    }

}

export {timerSetup};