import { STORAGE_KEYS, ELEMENTS, BASE_URL } from '../constants.js';

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
        disableTestWhenTimeOut();
    });
    // Khởi tạo những bắt sự kiện
    setEventListeners(exam, renderer);
    // Bắt đầu bài thi
    startExam(exam, renderer);

    // Hiển thị nút chọn bài đọc
    renderer.displayBtnChoosePassage();
    // Hiển thị bài đọc
    renderer.displayPassage();
    // Hiển thị câu hỏi
    renderer.displayQuestions();
    // Hiển thị những câu hỏi đã trả lời (nếu có)
    renderer.displayOldAnswers();
    // Vô hiệu hóa bài thi nếu đã submit hay hết giờ
    disableTakingExam(exam, renderer);
    //console.log(getCorrectAnswers());
}

function setEventListeners(exam, renderer) {
    setBtnPauseTime(exam, renderer);
    setBtnChoosePassage(exam, renderer);
    setRadioChooseQuestion()
}



function disableUserChoice() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = true;
    });
}

function disableTestWhenTimeOut(exam, renderer) {
    let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);

    if(!answered) {
        // Popup khi người dùng chưa làm câu nào
        Swal.fire({
            title: 'Bạn chưa làm câu hỏi nào !',
            icon: 'error',
            confirmButtonText: 'Tôi đã rõ !',
            confirmButtonColor: '#3085d6',
            backdrop: true, // Hiệu ứng làm mờ nền
            showClass: {
                popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
            }
        });

        STORAGE_KEYS.saveData(STORAGE_KEYS.SUBMITTED, 'true');
        disableTakingExam(exam, renderer);
        renderer.playSoundEndExam();
        return;
    }


    let num_answers = Object.keys(answered).length;
    let totalQuestions = Object.keys(getCorrectAnswers()).length;
    let totalCorrectQuestions = Object.keys(getUserCorrectAnswers()).length;

    Swal.fire({
        title: 'Hết thời gian !',
        text: `Bạn đã làm đúng: ${totalCorrectQuestions}/${totalQuestions} câu`,
        icon: 'success',
        confirmButtonText: 'Tôi đã rõ !',
        confirmButtonColor: '#3085d6',
        backdrop: true, // Hiệu ứng làm mờ nền
        showClass: {
            popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
        }
    });

    STORAGE_KEYS.saveData(STORAGE_KEYS.SUBMITTED, 'true');
    disableTakingExam(exam, renderer);
    renderer.playSoundEndExam();
}

function disableTakingExam(exam, renderer) {
    if(STORAGE_KEYS.getData(STORAGE_KEYS.SUBMITTED) === 'true') {
        exam.stop();
        STORAGE_KEYS.saveData(STORAGE_KEYS.IS_FINISHED, 'true');
        disableUserChoice();
        showIncorrectAnswers();
        showCorrectAnswers();
        renderer.hideTimeArea();
        renderer.hideBtnSubmit();
        renderer.displayBtnHomepage();//document.getElementById('btn_submit').style.display = 'none';
        //document.getElementById('btn_done').style.display = 'inline';   
    }
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

function setRadioChooseQuestion() {

    ELEMENTS.right_view = document.getElementById('right_view');
    if(!ELEMENTS.right_view) {return;}

    ELEMENTS.right_view.addEventListener('click', (e) => {
        const btn = e.target.closest('.choose-question');

        if(btn) {
            let q_id = btn.dataset.id;
            chooseAnswer(q_id);
        }
    });
}

function chooseAnswer(user_ans) {
    let result = user_ans.match(/(\d+)([a-zA-Z]+)/);

    // Tách câu trả lời thành số thứ tự câu hỏi và câu trả lời A, B, C, D
    // Ví dụ: 12A
    let q_id = result[1]; // 12 
    let ans = result[2]; // A

    let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);
    if(!answered) {
        answered = {};
    }

    answered[q_id] = ans;
    STORAGE_KEYS.saveData(STORAGE_KEYS.USER_ANSWERS, answered);

    console.log(answered);
}

function getCorrectAnswers() {

    const readingQuestions = STORAGE_KEYS.getData(STORAGE_KEYS.QUESTIONS);
    if(!readingQuestions) {return;}

    let correctAnswers = [];
    for(let rp_id in readingQuestions) {
        let rp_questions = readingQuestions[rp_id]['qna'];
        for(let i in rp_questions) {
            correctAnswers.push(rp_questions[i]['answer']);
        }
    }

    // 1. Tạo bản đồ chuyển đổi
    const mapping = {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'D'
    };

    
    let mappedCorrectAnswers = correctAnswers.map(item => mapping[item] || item);
    const result = Object.fromEntries(
        mappedCorrectAnswers.map((val, index) => [(index + 1).toString(), val])
    );
    return result;
    
}

function getUserIncorrectAnswers() {
    let correctAnswers = getCorrectAnswers();
    let userAnswers = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 

    if(!correctAnswers) {return;}
    if(!userAnswers) {return;}
    

    let userIncorrectAnswers = [];

    for(let i in userAnswers) {
        if(userAnswers[i] !== correctAnswers[i]) {
            userIncorrectAnswers.push(i+userAnswers[i]);
        }
    }

    return userIncorrectAnswers;
}

function getUserCorrectAnswers() {
    let correctAnswers = getCorrectAnswers();
    let userAnswers = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 

    if(!correctAnswers) {return;}
    if(!userAnswers) {return;}

    let userCorrectAnswers = [];

    for(let i in userAnswers) {
        if(userAnswers[i] === correctAnswers[i]) {
            userCorrectAnswers.push(i+userAnswers[i]);
        }
    }

    return userCorrectAnswers;
}

function showIncorrectAnswers() {
    let incorrectAnswers = getUserIncorrectAnswers(); // Lấy những đáp án sai

    if(!incorrectAnswers) {return;}
 
    for(let i in incorrectAnswers) {
        let id = 'lb' + incorrectAnswers[i];
        //console.log(id);

        const element = document.querySelector(`label[data-id="${id}"]`);

        if (element) {
            element.classList.add('text-danger', 'fw-bold');
        }
    }
    
}

function showCorrectAnswers() {
    let correctAnswers = getCorrectAnswers(); // Lấy những đáp án đúng
    let userCorrectAnswers = getUserCorrectAnswers() // Lấy đáp án đúng của user
    if(!correctAnswers) {return;}
    if(!userCorrectAnswers) {return;}
 
    for(let i in correctAnswers) {
        let id = `lb${i}${correctAnswers[i]}`;

        const element = document.querySelector(`label[data-id="${id}"]`);

        if (element) {
            if(userCorrectAnswers.includes(id.replace('lb',''))) {
                element.classList.add('text-success', 'fw-bold');
            } else {
                element.classList.add('text-success');
            }
        }

    }
}

function getNotAnsweredQuestions() {
    let userAnsweredQuestions = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);

    if(!userAnsweredQuestions) {return;}

    let correctAnswers = getCorrectAnswers();

    const notAnswerList = Object.keys(correctAnswers).filter(key => !userAnsweredQuestions.hasOwnProperty(key));

    return notAnswerList;
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
            renderer.displayOldAnswers();
            disableTakingExam(exam, renderer);
        }
    });
    

    ELEMENTS.btns_zone.addEventListener('click', (e) => {
        const btn = e.target.closest('#btn_submit');
        if(btn) {
            submitTest(exam, renderer);
        }
    });

    ELEMENTS.btns_zone.addEventListener('click', (e) => {
        const btn = e.target.closest('#btn_done');

        if(btn) {
          
            goToHomepage();
        }
    });
    
}

export function goToHomepage() {
    Swal.fire({
        title: 'Bạn có chắc chắn muốn về trang chủ',
        text: "Bạn sẽ không thể xem lại kết quả bài thi !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Về trang chủ',
        cancelButtonText: 'Ở lại'
    }).then((result) => {
        if (result.isConfirmed) {
            // Giữ lại theme hiện tại
            resetStorageKeys();
            window.location.href = BASE_URL;
        }
    });
}

function resetStorageKeys() {
    const currentTheme = STORAGE_KEYS.getData(STORAGE_KEYS.THEME);
    localStorage.clear();
    if(currentTheme) {
        STORAGE_KEYS.saveData(STORAGE_KEYS.THEME, currentTheme);
    }
}

function submitTest(exam, renderer) {
    let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 
    if(!answered) {
        Swal.fire({
            title: 'Bạn chưa làm câu nào !',
            text: "Bạn có chắc chắn kết thúc bài thi ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Kết thúc',
            cancelButtonText: 'Tiếp tục'
        }).then((result) => {
            if (result.isConfirmed) {
                resetStorageKeys();
                window.location.href = BASE_URL;
            }
        });

        return;
    }

    let num_answers = Object.keys(answered).length;
    let totalQuestions = Object.keys(getCorrectAnswers()).length;
    let totalCorrectQuestions = Object.keys(getUserCorrectAnswers()).length;


    let warningNotification = '';
    if(num_answers < 40) {
        warningNotification = `Bạn đã làm ${num_answers} / ${totalQuestions}`;
    } else {
        warningNotification = 'Bạn có chắc chắn muốn nộp bài ?';
    }
    
    // Sau khi người dùng Submit
    Swal.fire({
        title: warningNotification,
        text: "Bạn sẽ không thể thay đổi đáp án sau khi đã nộp !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi muốn nộp !',
        cancelButtonText: 'Kiểm tra lại'
    }).then((result) => {
        if (result.isConfirmed) {
            // User bị vô hiệu hóa bài thi
            STORAGE_KEYS.saveData(STORAGE_KEYS.SUBMITTED, 'true');
            disableTakingExam(exam, renderer);
        
            Swal.fire({
                title: 'Nộp bài thành công !',
                text: `Bạn đã làm đúng: ${totalCorrectQuestions}/${totalQuestions} câu`,
                icon: 'success',
                confirmButtonText: 'Tôi đã rõ !',
                confirmButtonColor: '#3085d6',
                backdrop: true, // Hiệu ứng làm mờ nền
                showClass: {
                    popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
                }
            });
        } else {
            if(num_answers < 40) {
                let notAnswerList = getNotAnsweredQuestions();

                let sortedByPassage = {};
                sortedByPassage['Passage 1'] = [];
                sortedByPassage['Passage 2'] = [];
                sortedByPassage['Passage 3'] = [];
                sortedByPassage['Passage 4'] = [];

                for(let i in notAnswerList) {
                    let question_id = Number(notAnswerList[i]);
                    if(question_id < 11 && question_id > 0) {
                        sortedByPassage['Passage 1'].push(question_id);
                    }

                    if(question_id < 21 && question_id > 10) {
                        sortedByPassage['Passage 2'].push(question_id);
                    }

                    if(question_id < 31  && question_id > 20) {
                        sortedByPassage['Passage 3'].push(question_id);
                    }

                    if(question_id < 41 && question_id > 30) {
                        sortedByPassage['Passage 4'].push(question_id);
                    }
                }

                let popupHTML = `<div>`;

                for(let i in sortedByPassage) {
                    if(sortedByPassage[i].length > 0) {
                        popupHTML += `<p>${i}: ${sortedByPassage[i].join(', ')}</p>`;
                    }
                }

                popupHTML += '</div>';
                

                Swal.fire({
                    title: 'Các câu bạn chưa làm:',
                    html: popupHTML,
                    icon: 'warning',
                    confirmButtonText: 'Tôi đã rõ !',
                    confirmButtonColor: '#3085d6',
                    backdrop: true, // Hiệu ứng làm mờ nền
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
                    }
                });
            }
        }
    });
}
