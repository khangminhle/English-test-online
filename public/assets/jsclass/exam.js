import { TimerCountDown } from './timer.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.examData = data;
        this.duration = durationInSeconds;
        this.timer = null;
    }

    start() {
        // Bắt đầu bài thi
        if(!this.timer) {return;}
        this.timer.start();
        console.log('Start:', this.timer.timerId);
    }

    stop() {
        // Dừng bài thi
        console.log('Before:', this.timer.timerId);
        this.timer.stop();
        console.log('Stop:', this.timer.timerId);
    }

    display() {
        // Hiển thị cấu trúc bài thi
        if(document.getElementById('timer')) {
            document.getElementById('timer').innerText = this.timer.formatTime()
        }
        //throw new Error("Lớp con phải tự định nghĩa cách render nội dung!");
    }

}