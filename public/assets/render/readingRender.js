import { STORAGE_KEYS, APPSTATE, ELEMENTS, BASE_URL } from '../constants.js';

import { TimerCountDown } from '../jsclass/timer.js';
export function renderUI() {

	displayBtnChoosePassage();
	displayReadingPassage();
	displayReadingQuestions();
    displayOldAnswers();
    startExamTime(10);
    disableTakingExam();
}

function startExamTime(seconds) {
    timeStart(seconds);
    const endTime = Date.now() + (seconds * 1000);
    STORAGE_KEYS.saveData(STORAGE_KEYS.EXAM_END_TIME, String(endTime))
    console.log('endtime:', STORAGE_KEYS.getData(STORAGE_KEYS.EXAM_END_TIME));
    STORAGE_KEYS.saveData(STORAGE_KEYS.IS_PAUSED, 'false');
}

function timeStart(seconds) {

    if(APPSTATE.currentTimer) {
        APPSTATE.currentTimer.stop();
    }

    APPSTATE.currentTimer = new TimerCountDown(seconds,
        (timeLeft) => {
            document.getElementById('timer').innerText = APPSTATE.currentTimer.formatTime(timeLeft);
        }, 
        () => {
            disableTestWhenTimeOut();
        }
    );
    
    APPSTATE.currentTimer.start();
}

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

function displayBtnChoosePassage() {
    if(!ELEMENTS.btns_zone) {return;}

    let html = `<div class="row d-flex justify-content-center">`;
    for(let rp_number in APPSTATE.passages) {
        html += `<div class="col-1 d-flex justify-content-center">`;
        html += `<button type="button" class="btn btn-primary btn-choose-passage" data-id="${rp_number}">Passage ${rp_number.replace('rp','')}</button>`;
        html += `</div>`;
    }
    html += `<div class="col-1 d-flex justify-content-center">`
    html += `<button type="button" class="btn btn-success" id="btn_submit">Submit</button>`;
    html += `</div>`;
    html += `<div class="col-1 d-flex justify-content-center">`
    html += `<button style="display:none" type="button" class="btn btn-danger" id="btn_done">Homepage</button>`;
    html += `</div>`;
    html += `</div>`;

    ELEMENTS.btns_zone.innerHTML = html;
}

export function displayReadingPassage(rp_number='rp1') {

    let current_passage_index = STORAGE_KEYS.getData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX);
    console.log('Passage:', current_passage_index);
    if(current_passage_index) {
        rp_number = current_passage_index;
    }

    if(!APPSTATE.passages) {return;}
    if(!ELEMENTS.passage_view) {return;}

    let filter_text = APPSTATE.passages[rp_number].replaceAll('<u>','<b>').replaceAll('</u>', '</b>');
    let rp1_paragraphs = filter_text.split('\n');

    let html = `<h4>${rp1_paragraphs[0]}</h4>`;
    for(let i = 1; i < rp1_paragraphs.length; i++) {
        html += `<p>${rp1_paragraphs[i]}</p>`;
    }

    ELEMENTS.passage_view.innerHTML = html;
}

export function displayReadingQuestions(rp_number='rp1') {

    let current_passage_index = STORAGE_KEYS.getData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX);
    console.log('reading passage:', current_passage_index);
    if(current_passage_index) {
        rp_number = current_passage_index;
    }
	if(!APPSTATE.questions) {return;}
	if(!ELEMENTS.question_view) {return;}


    let rp_questions = APPSTATE.questions[rp_number]['qna'];

    let html = `<h3>Questions</h3>`;
    html += `<div>`

    let index = Number(rp_number.replace('rp',''));
    let len = index * 10;

    console.log('index:', index);

    for(let i = 0; i < rp_questions.length; i++) {
        html += `<div class="mt-4">`;
        let content = rp_questions[i]['content'].replaceAll('<u>', '<b>').replaceAll('</u>', '</b>');
        //console.log(content);
        html += `<p>${content}</p>`;
        let ans = ['A', 'B', 'C', 'D'];
        for(let j = 0; j < ans.length; j++) {
            let q_content =  rp_questions[i][ans[j]];
            if(q_content.includes('<b>')) {
            	q_content = q_content.replace(/<b>|<\/b>/g, '');
            }
            html += `<div class="mt-2">`;
            html += `<input id="${((index-1)*10+i+1)+ans[j]}" class="choose-question" title="${'Chọn câu ' + ((index-1)*10+i+1)+ans[j]}" type="radio" name="q${(index-1)*10+i+1}" data-id="${((index-1)*10+i+1)+ans[j]}">`; //onchange="chooseAnswer(this)">`;
            html += `<label title="${'Chọn câu ' + ((index-1)*10+i+1)+ans[j]}" class="form-check-label" for="${((index-1)*10+i+1)+ans[j]}" data-id="${'lb'+((index-1)*10+i+1)+ans[j]}">${q_content}</label><br>`;
            html += `</div>`;
        }
        html += `</div>`;
    }
    html += `</div>`;

    ELEMENTS.question_view.innerHTML = html;

}

function resetStorageKeys() {
    const currentTheme = STORAGE_KEYS.getData(STORAGE_KEYS.THEME);
    localStorage.clear();
    if(currentTheme) {
        STORAGE_KEYS.saveData(STORAGE_KEYS.THEME, currentTheme);
    }
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

function disableUserInput() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = true;
    });
}

export function disableTakingExam() {
    // User bị vô hiệu hóa bài thi 
    if(STORAGE_KEYS.getData(STORAGE_KEYS.SUBMITTED) === 'true') {
        console.log('da vo hieu h oa!');
        disableUserInput();
        showIncorrectAnswers();
        showCorrectAnswers();
        APPSTATE.currentTimer.stop();
        document.getElementById('time_area').style.display = 'none';
        document.getElementById('btn_submit').style.display = 'none';
        document.getElementById('btn_done').style.display = 'inline';   
    }
}

export function displayOldAnswers() {
    let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 
    if(answered) {
        for(let ans in answered) {
            let id_ans = ans + answered[ans];
            const element = document.querySelector(`input[data-id="${id_ans}"]`);
            if (element) {
                element.checked = true;
            }
        }
    }
}


function getCorrectAnswers() {

    if(!APPSTATE.questions) {return;}

    let correctAnswers = [];
    for(let rp_id in APPSTATE.questions) {
        let rp_questions = APPSTATE.questions[rp_id]['qna'];
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


export function showIncorrectAnswers() {
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

export function showCorrectAnswers() {
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

export function chooseAnswer(user_ans) {

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

export function submitTest() {

    
    let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 
    console.log('ans', answered);
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
            disableTakingExam();
        
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

function disableTestWhenTimeOut() {
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
        disableTakingExam();
        playSoundEndExam();
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

    console.log('vo hieu hoa!');
    STORAGE_KEYS.saveData(STORAGE_KEYS.SUBMITTED, 'true');
    disableTakingExam();
    playSoundEndExam();
}

function displayBtnPauseTime() {
    let btnPauseTime = STORAGE_KEYS.getData(STORAGE_KEYS.BUTTON_TIME);

    if(!btnPauseTime) {return;}
    if(!ELEMENTS.btn_pause_time) {return;}

    if(btnPauseTime === 'Restart') {
        document.getElementById('btn_pause_time').innerText = 'Restart';
        ELEMENTS.btn_pause_time.classList.replace('btn-warning', 'btn-success');
    }
}

function timeCountDown(seconds) {

    if(STORAGE_KEYS.getData(STORAGE_KEYS.SUBMITTED) === 'true') {
        clearInterval(APPSTATE.intervalCountDown);
        console.log('Đã dừng làn nữa!');
        return;
    }

    let totalSeconds = STORAGE_KEYS.getData(STORAGE_KEYS.TIMELEFT);
    if(!totalSeconds) {
        totalSeconds = seconds;
    } else {
        totalSeconds = Number(totalSeconds);
    }

    const timerElement = document.getElementById("timer");
    if(!timerElement) {return;}

    if (APPSTATE.intervalCountDown) {
        clearInterval(APPSTATE.intervalCountDown);
    }

    APPSTATE.intervalCountDown = setInterval(function() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        if(ELEMENTS.btn_pause_time.innerText.trim() === 'Restart') {
            clearInterval(APPSTATE.intervalCountDown);
            STORAGE_KEYS.saveData(STORAGE_KEYS.TIMELEFT, String(totalSeconds));
        }

        timerElement.innerText = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (totalSeconds <= 0) {
            clearInterval(APPSTATE.intervalCountDown);
            STORAGE_KEYS.saveData(STORAGE_KEYS.TIMELEFT, '0');
            disableTestWhenTimeOut();
            playSoundEndExam();
            timerElement.classList.add('text-danger');
        } else {
            if(totalSeconds <= 10) {
                timerElement.classList.add('text-danger');
            }
            STORAGE_KEYS.saveData(STORAGE_KEYS.TIMELEFT, String(totalSeconds));
            totalSeconds--;
        }
    }, 1000);
}

export function pauseTimeCountDown() {
    if(!ELEMENTS.btn_pause_time) {return;}

    if(ELEMENTS.btn_pause_time.innerText.trim() === 'Pause') {
        ELEMENTS.btn_pause_time.innerText = 'Restart';
        STORAGE_KEYS.saveData(STORAGE_KEYS.BUTTON_TIME, 'Restart');
        ELEMENTS.btn_pause_time.classList.replace('btn-warning', 'btn-success');
    } else {
        ELEMENTS.btn_pause_time.innerText = 'Pause';
        ELEMENTS.btn_pause_time.classList.replace('btn-success', 'btn-warning');
        STORAGE_KEYS.saveData(STORAGE_KEYS.BUTTON_TIME, 'Pause');

        // Restart lại bộ đếm
        let secondsLeft = STORAGE_KEYS.getData(STORAGE_KEYS.TIMELEFT);
        if(secondsLeft > 0) {timeCountDown(Number(secondsLeft));}

    }
}

function playSoundEndExam() {
    let audio = document.getElementById('audio_end_exam');

    if(audio) {
        audio.play().catch(error => {
        console.error("Lỗi phát âm thanh:", error);
    });
    }
}