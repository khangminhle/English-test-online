import { TimerCountDown } from './timer.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.examData = data;
        this.duration = durationInSeconds;
        this.onTimeUpdateCallback = null;
        this.timer = new TimerCountDown(durationInSeconds,
            (timeLeft) => {
                if (this.onTimeUpdateCallback) {
                    this.onTimeUpdateCallback(TimerCountDown.formatTime(timeLeft));
                }
            }, 
            () => {
                console.log('het gio!');
            }
        );
    }

    onTimeUpdate(callback) {
        this.onTimeUpdateCallback = callback;
    }

    resume(seconds) {
        this.timer = new TimerCountDown(seconds,
            (timeLeft) => {
                if (this.onTimeUpdateCallback) {
                    this.onTimeUpdateCallback(timeLeft);
                }
            }, 
            () => {
                console.log('het gio!');
            }
        );
        this.start();
    }

    start() {
        // Bắt đầu bài thi
        if(!this.timer) {return;}
        this.timer.start();
    }

    stop() {
        // Dừng bài thi
        if(this.timer) {this.timer.stop()};
    }
}