import { TimerCountDown } from './timer.js';
import { STORAGE_KEYS } from '../constants.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.examData = data;
        this.duration = durationInSeconds;
        this.onTimeUpdateCallback = null;
        this.onTimeFinishCallback = null;
        this.timer = new TimerCountDown(durationInSeconds,
            (timeLeft) => {
                if(this.onTimeUpdateCallback) {
                    this.onTimeUpdateCallback(TimerCountDown.formatTime(timeLeft));
                    console.log(timeLeft, this.timer.timerId);
                }
            }, 
            () => {
                if(this.onTimeFinishCallback) {
                    this.onTimeFinishCallback();
                    console.log(this.timer.timerId);
                }
            }
        );
    }

    onTimeUpdate(callback) {
        this.onTimeUpdateCallback = callback;
    }

    onTimeFinish(callback) {
        this.onTimeFinishCallback = callback;
    }

    resume(seconds) {
        if(this.timer) {
            this.timer.stop();
        }
        this.timer = new TimerCountDown(seconds,
            (timeLeft) => {
                if (this.onTimeUpdateCallback) {
                    this.onTimeUpdateCallback(TimerCountDown.formatTime(timeLeft));
                }
            }, 
            () => {
                if(this.onTimeFinishCallback) {
                    this.onTimeFinishCallback();
                }
            }
        );
        this.start();
    }

    start() {
        // Bắt đầu bài thi
        if(!this.timer) {return;}
        this.timer.start();
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'false');
    }

    stop() {
        // Dừng bài thi
        if(this.timer) {
            this.timer.stop();
            STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'true');
            console.log('Đã dừng thi timerid:', this.timer.timerId);
        }
    }
}