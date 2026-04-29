// Timer.js
export class TimerCountDown {
    constructor(durationInSeconds, onTick, onComplete) {
        this.duration = durationInSeconds;
        this.remaining = durationInSeconds;
        this.onTick = onTick; // Callback để cập nhật UI
        this.onComplete = onComplete; // Callback khi hết giờ
        this.timerId = null;
    }

    start() {
        this.timerId = setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);
            if (this.remaining <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timerId);
    }
}