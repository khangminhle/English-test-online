import { TimerCountDown } from './timer.js';
import { STORAGE_KEYS } from '../constants.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.data = data;
        this.duration = durationInSeconds;
        this.onTimeUpdateCallback = null;
        this.onTimeFinishCallback = null;
        if(STORAGE_KEYS.getData(STORAGE_KEYS.IS_FINISHED) === 'true') {
            this.timer = null;
        } else {
            this.timer = new TimerCountDown(durationInSeconds,
                (timeLeft) => {
                    if(this.onTimeUpdateCallback) {
                        this.onTimeUpdateCallback(timeLeft);
                        
                    }
                }, 
                () => {
                    if(this.onTimeFinishCallback) {
                        this.onTimeFinishCallback();
                    }
                }
            );
        }
    }

    onTimeUpdate(callback) {
        this.onTimeUpdateCallback = callback;
    }

    onTimeFinish(callback) {
        this.onTimeFinishCallback = callback;
    }

    resume(seconds) {

        if(this.timer) {
            this.stop();
        }

        this.timer = new TimerCountDown(seconds,
            (timeLeft) => {
                if (this.onTimeUpdateCallback) {
                    this.onTimeUpdateCallback(timeLeft);
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
            this.timer = null;
            STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'true');
        }
    }
}