import { STORAGE_KEYS, APPSTATE, ELEMENTS, BASE_URL } from '../constants.js';

/**
    * Hàm chính để vẽ toàn bộ giao diện bài thi
    * @param {Object} exam - Object của class ReadingExam hoặc bất kì class con của Exam
    * @param {Object} renderer - class ExamRender
*/

export function setExamEvents(exam, renderer) {
    setBtnPauseTime(exam, renderer);
}


function setBtnPauseTime(exam, renderer) {
    ELEMENTS.btn_pause_time = document.getElementById('btn_pause_time');
    console.log(btn_pause_time);
    if(!btn_pause_time) {return;}

    // Gắn sự kiện
    btn_pause_time.addEventListener('click', () => {
        // Logic
        console.log(exam.examData);
        // UI
        renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
    });
    /*
    if(!ELEMENTS.btn_pause_time) {return;}
    if(!exam.timer) {return;}
    if(!renderer) {return;}

    let is_paused = STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED);
    if(!is_paused) {return;}

    console.log('Đã setBtnPauseTime');

    if(is_paused === 'false') {

        console.log('đã dừng đồng hồ!');
        // Tính thời gian còn lại tại thời điểm nhấn nút
        const endTime = Number(STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME));
        const remaining = endTime - Date.now();
        console.log('timeleft dừng', Math.floor(remaining / 1000));
        // Lưu thời gian còn lại vào Storage để dùng khi Resume
        STORAGE_KEYS.saveData('REMAINING_TIME_PAUSED', String(remaining));
        exam.stop();
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'true');
        renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
        //ELEMENTS.btn_pause_time.innerText = 'Restart';
        //ELEMENTS.btn_pause_time.classList.replace('btn-warning', 'btn-success');
    }

    if(is_paused === 'true') {
        console.log('restart đồng hồ!');

        // Lấy lại thời gian còn lại đã lưu khi Pause
        const remaining = Number(STORAGE_KEYS.getData(STORAGE_KEYS.REMAINING_TIME_PAUSED));
        
        // Tính hạn chót mới: Bây giờ + thời gian còn lại
        const newEndTime = Date.now() + remaining;

        // Lưu lại hạn chót mới vào Storage
        STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(newEndTime));

     
        exam.restart(Math.floor(remaining / 1000));
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'false');
        renderer.changeBtnPauseTimeContent('Pause', 'btn-success', 'btn-warning');
        //ELEMENTS.btn_pause_time.innerText = 'Pause';
        //ELEMENTS.btn_pause_time.classList.replace('btn-success', 'btn-warning');
    }
    */
}