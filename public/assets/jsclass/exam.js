import { TimerCountDown } from './timer.js';
import { STORAGE_KEYS } from '../constants.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.data = data;
        this.duration = durationInSeconds;
        this.onTimeUpdateCallback = null;
        this.onTimeFinishCallback = null;
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
                STORAGE_KEYS.saveData(STORAGE_KEYS.IS_FINISHED, 'true');
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
                    this.onTimeUpdateCallback(timeLeft);
                }
            }, 
            () => {
                if(this.onTimeFinishCallback) {
                    this.onTimeFinishCallback();
                }
                STORAGE_KEYS.saveData(STORAGE_KEYS.IS_FINISHED, 'true');
            }
        );
        this.start();
    }

    start() {
        // Bắt đầu bài thi
        if(STORAGE_KEYS.getData(STORAGE_KEYS.IS_FINISHED) === 'true') {return;}

        if(!this.timer) {return;}
        this.timer.start();
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'false');
    }

    stop() {
        // Dừng bài thi
        if(STORAGE_KEYS.getData(STORAGE_KEYS.IS_FINISHED) === 'true') {return;}

        if(this.timer) {
            this.timer.stop();
            STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'true');
        }
    }
}