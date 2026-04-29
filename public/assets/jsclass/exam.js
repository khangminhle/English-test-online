import { TimerCountDown } from './timer.js';

export class Exam {
    constructor(durationInSeconds, data) {
        this.examData = data;
        this.duration = durationInSeconds;
        this.timer = new TimerCountDown(durationInSeconds,
            (timeLeft) => {
                console.log(timeLeft);//document.getElementById('timer').innerText = this.timer.formatTime(timeLeft);
            }, 
            () => {
                console.log('Hết giờ');
            }
        );
    }

    start() {
        // Bắt đầu bài thi
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
        throw new Error("Lớp con phải tự định nghĩa cách render nội dung!");
    }

}