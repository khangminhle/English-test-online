import { TimerCountDown } from './timer.js';
import { ExamRender } from '../render/examRender.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.examData = data;
        this.duration = durationInSeconds;
        this.timer = new TimerCountDown(durationInSeconds,
            (timeLeft) => {
                ExamRender.updateTime(TimerCountDown.formatTime(timeLeft));
            }, 
            () => {
                console.log('het gio!');
            }
        );
    }

    restart(seconds) {
        this.timer = new TimerCountDown(seconds,
            (timeLeft) => {
                ExamRender.updateTime(TimerCountDown.formatTime(timeLeft));
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

    render() {
        ExamRender.renderLayout();
    }
}