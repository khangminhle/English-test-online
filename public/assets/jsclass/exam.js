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
        const correctAnswers = this.getCorrectAnswers();
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
        const correctAnswers = this.getCorrectAnswers();
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

    getNotAnsweredQuestions() {
        const userAnsweredQuestions = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);

        if(!userAnsweredQuestions) {return;}

        const correctAnswers = this.getCorrectAnswers();
        const notAnswerList = Object.keys(correctAnswers).filter(key => !userAnsweredQuestions.hasOwnProperty(key));

        return notAnswerList;
    }

    saveRemainingTime() {
        const endTime = STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME);
        if(!endTime) {return;}
        const remaining = Number(endTime) - Date.now();
        STORAGE_KEYS.saveData(STORAGE_KEYS.REMAINING_TIME_PAUSED, String(remaining));
    }

    getRemainingTime() {
        const remaining = STORAGE_KEYS.getData(STORAGE_KEYS.REMAINING_TIME_PAUSED);
        if(!remaining) {return;}

        const decimal = (Number(remaining)/1000) % 1
        if(decimal >= 0.5) {
            return Math.round(Number(remaining)/1000);
        }
        return Math.floor(Number(remaining)/1000); // seconds
    }

    saveEndTime(durationInSeconds) {
        // Lấy lại thời gian còn lại đã lưu khi Pause
        const remaining = STORAGE_KEYS.getData(STORAGE_KEYS.REMAINING_TIME_PAUSED);
        if(!remaining) {
            const endTime = Date.now() + (durationInSeconds * 1000);
            STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(endTime))
            return;
        }
        // Tính hạn chót mới: Bây giờ + thời gian còn lại
        const newEndTime = Date.now() + Number(remaining);
        // Lưu lại hạn chót mới vào Storage
        STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(newEndTime));
    }

    saveUserAsnwers(user_ans) {
        const result = user_ans.match(/(\d+)([a-zA-Z]+)/);

        // Tách câu trả lời thành số thứ tự câu hỏi và câu trả lời A, B, C, D
        // Ví dụ: 12A
        const q_id = result[1]; // 12 
        const ans = result[2]; // A

        let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);
        if(!answered) {
            answered = {};
        }

        answered[q_id] = ans;
        STORAGE_KEYS.saveData(STORAGE_KEYS.USER_ANSWERS, answered);
    }

    isRunning() {
        return STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED) === 'false';
    }

    doesEndTimeExist() {
        return Boolean(STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME));
    }

    isFinished() {
        return STORAGE_KEYS.getData(STORAGE_KEYS.IS_FINISHED) === 'true';
    }

    changeToFinish() {
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_FINISHED, 'true');
    }
}