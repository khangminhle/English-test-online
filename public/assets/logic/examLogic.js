import { STORAGE_KEYS, APPSTATE, ELEMENTS, BASE_URL } from '../constants.js';
import { Exam } from '../jsclass/exam.js';


export function timePauseRestart() {
	if(!APPSTATE.currentTimer) {return;}
    let is_paused = STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED);
    if(!is_paused) {return;}

    if(is_paused === 'false') {

        console.log('đã dừng đồng hồ!');
        // Tính thời gian còn lại tại thời điểm nhấn nút
        const endTime = Number(STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME));
        const remaining = endTime - Date.now();
         console.log('timeleft dừng', Math.floor(remaining / 1000));
        // Lưu thời gian còn lại vào Storage để dùng khi Resume
        STORAGE_KEYS.saveData('REMAINING_TIME_PAUSED', String(remaining));
        APPSTATE.currentTimer.stop();
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'true');
        ELEMENTS.btn_pause_time.innerText = 'Restart';
        ELEMENTS.btn_pause_time.classList.replace('btn-warning', 'btn-success');
    }

    if(is_paused === 'true') {
        console.log('restart đồng hồ!');

        // Lấy lại thời gian còn lại đã lưu khi Pause
        const remaining = Number(STORAGE_KEYS.getData(STORAGE_KEYS.REMAINING_TIME_PAUSED));
        
        // Tính hạn chót mới: Bây giờ + thời gian còn lại
        const newEndTime = Date.now() + remaining;

        // Lưu lại hạn chót mới vào Storage
        STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(newEndTime));

     
        timeStart(Math.floor(remaining / 1000));
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'false');
        ELEMENTS.btn_pause_time.innerText = 'Pause';
        ELEMENTS.btn_pause_time.classList.replace('btn-success', 'btn-warning');
    }
}

export function startExam(exam) {
    let readingExam = null;

    if(exam === 'reading') {
        let readingExam = new Exam(10, '');
        readingExam.start();
        const endTime = Date.now() + (readingExam.timer.duration * 1000);
        // Tạo timestamp endtime
        STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(endTime))
        console.log('endtime:', STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME));
        // Trạng thái tạm dừng thi hay đang thi
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'false');
    }
}