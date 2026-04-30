import { STORAGE_KEYS, APPSTATE, ELEMENTS, BASE_URL } from '../constants.js';

/**
    * Hàm chính để vẽ toàn bộ giao diện bài thi
    * @param {Object} exam - Object của class ReadingExam hoặc bất kì class con của Exam
    * @param {Object} renderer - class ExamRender
*/

export function settingExam(exam, renderer) {
    // Khởi tạo giao diện thi
    renderer.renderLayout()
    //setBtnPauseTime(exam, renderer);
    // Khởi tạo thực thi hàm mỗi giây
    exam.onTimeUpdate((timeLeft) => {
        renderer.updateTime(timeLeft);
    });
    // Khởi tạo thực thi hàm khi kết thúc
    exam.onTimeFinish(() => {
        alert('Đã xong');
    });
    exam.start();
    // Lưu timestamp bắt đầu thi
    const endTime = Date.now() + (exam.duration * 1000);
    STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(endTime))

    // Khởi tạo những bắt sự kiện
    setEventListeners(exam, renderer);
}

function setEventListeners(exam, renderer) {
    setBtnPauseTime(exam, renderer);
}




function setBtnPauseTime(exam, renderer) {
    ELEMENTS.btn_pause_time = document.getElementById('btn_pause_time');

    if(!ELEMENTS.btn_pause_time) {return;}

    // Gắn sự kiện
    btn_pause_time.addEventListener('click', () => {

        const is_paused = STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED);

        if(is_paused === 'false') {
            
           
            const endTime = Number(STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME));
            const remaining = endTime - Date.now();
            STORAGE_KEYS.saveData(STORAGE_KEYS.REMAINING_TIME_PAUSED, String(remaining));
            // Dừng bài thi
            exam.stop();
            renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
        }
        if(is_paused === 'true') {
            // Lấy lại thời gian còn lại đã lưu khi Pause
            const remaining = Number(STORAGE_KEYS.getData(STORAGE_KEYS.REMAINING_TIME_PAUSED));
            // Tính hạn chót mới: Bây giờ + thời gian còn lại
            const newEndTime = Date.now() + remaining;
            // Lưu lại hạn chót mới vào Storage
            STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(newEndTime));
            // Bắt đầu lại bài thi sau dừng
            exam.resume(Math.floor(remaining / 1000));
            renderer.changeBtnPauseTimeContent('Pause', 'btn-success', 'btn-warning');
        }
    });
}