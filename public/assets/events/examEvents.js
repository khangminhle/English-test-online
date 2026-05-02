import { STORAGE_KEYS, ELEMENTS } from '../constants.js';

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
        disableTakingExam(renderer);
    });
    // Khởi tạo những bắt sự kiện
    setEventListeners(exam, renderer);
    //startExam(exam, renderer);

    // Hiển thị nút chọn bài đọc
    renderer.displayBtnChoosePassage();
    // Hiển thị bài đọc
    renderer.displayPassage();
    // Hiển thị câu hỏi
    renderer.displayQuestions();
}

function setEventListeners(exam, renderer) {
    setBtnPauseTime(exam, renderer);
    setBtnChoosePassage(exam, renderer);
}

function disableTakingExam(renderer) {
    renderer.hideTimeArea();
}

function isExamRunning() {
    if(STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED) === 'false') {
        return true;
    } else {return false;}
}

function doesEndTimeExist() {
    if(STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME)) {return true;}
    return false;
}

function startExam(exam, renderer) {

    const endTime = doesEndTimeExist();

    if(!endTime) {
        console.log('Khởi tạo ban đầu endTime');
        saveEndTime(exam.duration);
        exam.start();
    } else {
        let remaining = getRemainingTime();

        if(isExamRunning()) {
            console.log('Nút pause - tiếp tục chạy resume');
            saveRemainingTime();
            saveEndTime();
            exam.resume(getRemainingTime());
        } else {
            console.log('Nút restart - dừng và updateTime')
            renderer.updateTime(remaining);
            renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
        }
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

    const decimal = (Number(remaining)/1000) % 1
    if(decimal >= 0.5) {
        return Math.round(Number(remaining)/1000);
    }
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

function setBtnChoosePassage(exam, renderer) {
    ELEMENTS.btns_zone = document.getElementById('btns_zone');

    if(!ELEMENTS.btns_zone) {return;}

    ELEMENTS.btns_zone.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-choose-passage');

        if(btn) {
            let rp_id = btn.dataset.id;
            STORAGE_KEYS.saveData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX, rp_id);
            // Hiển thị bài đọc
            renderer.displayPassage(rp_id);
            // Hiển thị câu hỏi
            renderer.displayQuestions(rp_id);
            //displayOldAnswers();
            //disableTakingExam();
        }
        /*
        if(e.target.classList.contains('btn-choose-passage')) {
            let rp_id = e.target.dataset.id;
            console.log(rp_id);
        }
        */
    });
    /*
    ELEMENTS.btns_zone.addEventListener('click', (e) => {
        const btn = e.target.closest('#btn_submit');
        if(btn) {
            submitTest();
        }
    });
    ELEMENTS.btns_zone.addEventListener('click', (e) => {
        const btn = e.target.closest('#btn_done');

        if(btn) {
          
            goToHomepage();
        }
    });
    */
}