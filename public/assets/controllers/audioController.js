export class AudioManager {
    constructor(url) {
        this.audio = new Audio();
        this.audio.onended = () => console.log("Audio finished");
        this.url = url;
    }

    play() {
        this.audio.src = this.url;
        this.audio.play().catch(err => console.error("Play failed:", err));
    }

    pause() {
        this.audio.pause();
    }
    
}
