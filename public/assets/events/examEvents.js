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
    // Khởi tạo những bắt sự kiện
    setEventListeners(exam, renderer);
    //exam.start();
    // Lưu timestamp bắt đầu thi
    //const endTime = Date.now() + (exam.duration * 1000);
    //STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(endTime))
    //console.log(localStorage);
    //saveEndTime(exam.duration);
    //console.log(localStorage);
    startExam(exam, renderer);
}

function setEventListeners(exam, renderer) {
    setBtnPauseTime(exam, renderer);
}

function isExamRunning() {
    if(STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED) === 'false') {
        return true;
    } else {return false;}
}

function startExam(exam, renderer) {
    const remaining = getRemainingTime();
    if(remaining) {
        if(isExamRunning()) {
            saveEndTime();
            exam.resume(remaining);
        } else {
            console.log('stop');
            renderer.updateTime(remaining);
            renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
        }
    } else {
        saveEndTime(exam.duration);
        exam.start();
    }
}



function saveRemainingTime() {
    const endTime = STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME);
    if(!endTime) {return;}
    const remaining = Number(endTime) - Date.now();
    STORAGE_KEYS.saveData(STORAGE_KEYS.REMAINING_TIME_PAUSED, String(remaining));
}

function getRemainingTime() {
    const remaining = STORAGE_KEYS.getData(STORAGE_KEYS.REMAINING_TIME_PAUSED);
    if(!remaining) {return;}
    return Math.floor(Number(remaining)/1000); // seconds
}

function saveEndTime(durationInSeconds) {
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

function setBtnPauseTime(exam, renderer) {
    ELEMENTS.btn_pause_time = document.getElementById('btn_pause_time');

    if(!ELEMENTS.btn_pause_time) {return;}

    // Gắn sự kiện
    btn_pause_time.addEventListener('click', () => {

        const is_paused = STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED);

        if(is_paused === 'false') {

            saveRemainingTime();
            // Dừng bài thi
            exam.stop();
            renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
        }
        if(is_paused === 'true') {
            // Bắt đầu lại bài thi sau dừng
            saveEndTime();
            exam.resume(getRemainingTime());
            renderer.changeBtnPauseTimeContent('Pause', 'btn-success', 'btn-warning');
        }
    });
}