import { ELEMENTS, BASE_URL } from '../constants.js';

export function setEventListeners() {
    setBtnAudioCheck();
    setBtnChooseExam();
    console.log('HomeEvents đã xong!');
}
// Check Audio
function setBtnAudioCheck() {
	console.log('Đã thiết lập audio check!');
    let mediaRecorder;
    let audioChunks = [];

    ELEMENTS.startBtn = document.getElementById('startBtn');
    ELEMENTS.stopBtn = document.getElementById('stopBtn');
    ELEMENTS.audioPlayback = document.getElementById('audioPlayback');

    if(!ELEMENTS.startBtn) {return;}
    if(!ELEMENTS.stopBtn) {return;}
    if(!ELEMENTS.audioPlayback) {return;}

    ELEMENTS.startBtn.addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            ELEMENTS.audioPlayback.src = audioUrl;
        });

        mediaRecorder.start();
        ELEMENTS.startBtn.disabled = true;
        ELEMENTS.stopBtn.disabled = false;
    });

    ELEMENTS.stopBtn.addEventListener('click', () => {
        mediaRecorder.stop();
        ELEMENTS.startBtn.disabled = false;
        ELEMENTS.stopBtn.disabled = true;
    });

}
// Các nút chọn exam Reading, Listening,...
function setBtnChooseExam() {
	ELEMENTS.btns_choose_exam = document.getElementById('btns_choose_exam');

    if(!ELEMENTS.btns_choose_exam) {return;}
    console.log('set EL cho btn choose exam!');
    ELEMENTS.btns_choose_exam.addEventListener('click', (e) => {
    	const btn = e.target.closest('.btn-choose-exam');

    	if(btn) {
    		let go_to_url = `${BASE_URL}/${btn.dataset.id}`;
    		window.location.href = go_to_url;
    	}
    	/*
        if(e.target.classList.contains('btn-chooose-exam')) {
            let exam = e.target.dataset.id;
            console.log(exam);
        }
        */
    });
}