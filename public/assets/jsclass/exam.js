import { TimerCountDown } from './timer.js';

export class Exam {
    constructor(durationInSeconds) {
        this.duration = durationInSeconds;
        this.timer = new TimerCountDown(durationInSeconds, ());

        APPSTATE.currentTimer = new TimerCountDown(seconds,
            (timeLeft) => {
                document.getElementById('timer').innerText = APPSTATE.currentTimer.formatTime(timeLeft);
            }, 
            () => {
                disableTestWhenTimeOut();
            }
        );
    }

    start() {
        // Bắt đầu bài thi
    }

    stop() {
        // Dừng bài thi
    }

    display() {
        // Hiển thị cấu trúc bài thi
    }

}