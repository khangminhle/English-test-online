import { TimerCountDown } from './timer.js';
import { STORAGE_KEYS } from '../constants.js';

export class Exam {
    constructor(durationInSeconds) {
        this.data = null;
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

    getCorrectAnswers() {

        const readingQuestions = this.data['questions'];
        if(!readingQuestions) {return;}

        const correctAnswers = [];
        for(let rp_id in readingQuestions) {
            const rp_questions = readingQuestions[rp_id]['qna'];
            for(let i in rp_questions) {
                correctAnswers.push(rp_questions[i]['answer']);
            }
        }

        // 1. Tạo bản đồ chuyển đổi
        const mapping = {
            '1': 'A',
            '2': 'B',
            '3': 'C',
            '4': 'D'
        };

        
        let mappedCorrectAnswers = correctAnswers.map(item => mapping[item] || item);
        const result = Object.fromEntries(
            mappedCorrectAnswers.map((val, index) => [(index + 1).toString(), val])
        );
        return result;
    }

    getUserIncorrectAnswers() {
        const correctAnswers = getCorrectAnswers();
        const userAnswers = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 

        if(!correctAnswers) {return;}
        if(!userAnswers) {return;}
        

        const userIncorrectAnswers = [];

        for(let i in userAnswers) {
            if(userAnswers[i] !== correctAnswers[i]) {
                userIncorrectAnswers.push(i+userAnswers[i]);
            }
        }

        return userIncorrectAnswers;
    }

    getUserCorrectAnswers() {
        const correctAnswers = getCorrectAnswers();
        const userAnswers = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 

        if(!correctAnswers) {return;}
        if(!userAnswers) {return;}

        const userCorrectAnswers = [];

        for(let i in userAnswers) {
            if(userAnswers[i] === correctAnswers[i]) {
                userCorrectAnswers.push(i+userAnswers[i]);
            }
        }

        return userCorrectAnswers;
    }

}