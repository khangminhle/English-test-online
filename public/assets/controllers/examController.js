import { STORAGE_KEYS, ELEMENTS, BASE_URL } from '../constants.js';
import { AudioManager } from './audioController.js';

export class ExamController {
	/**
	    * Hàm chính để vẽ toàn bộ giao diện bài thi
	    * @param {Object} exam - Object của class ReadingExam hoặc bất kì class con của Exam
	    * @param {Object} renderer - class ExamRender
	*/
	constructor(exam, renderer) {
		this.exam = exam;
		this.renderer = renderer;
		this.audio = new AudioManager(`${BASE_URL}/assets/audios/bell.mp3`);
		console.log('Am thanh:', this.audio);
	}

	settingExam() {
	    // Khởi tạo giao diện thi
	    this.renderer.renderLayout()
	    // Khởi tạo thực thi hàm mỗi giây
	    this.updateTimeEverySeconds();
	    // Khởi tạo thực thi hàm khi kết thúc
	    this.setActionOnTimeFinish();
	    // Khởi tạo những bắt sự kiện
	    this.setEventListeners();

	    // Bắt đầu bài thi
	    this.startExam();

	    this.renderInitialView();
	}

	startExam() {

	    const endTime = this.exam.doesEndTimeExist();

	    if(!endTime) {
	        this.exam.saveEndTime(this.exam.duration);
	        this.exam.start();
	    } else {

	        if(this.exam.isRunning()) {
	            this.exam.saveRemainingTime();
	            this.exam.saveEndTime();
	            this.exam.resume(this.exam.getRemainingTime());
	        } else {
	            this.renderer.updateTime(this.exam.getRemainingTime());
	            this.renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
	        }
	    }
	}


	updateTimeEverySeconds() {
	    this.exam.onTimeUpdate((timeLeft) => {
	        this.renderer.updateTime(timeLeft);
	    });
	}

	setActionOnTimeFinish() {
	    this.exam.onTimeFinish(() => {
	        this.disableTestWhenTimeOut();
	        this.exam.changeToFinish();
	        this.audio.play();
	    });
	}

	renderInitialView() {
	    // Hiển thị nút chọn bài đọc
	    this.renderer.displayButtonsZone(this.renderer.getHTMLBtnChoosePassages());
	    // Hiển thị bài đọc
	    this.renderer.displayLeftContent(this.renderer.getHTMLReadingPassages());
	    // Hiển thị câu hỏi
	    this.renderer.displayRightContent(this.renderer.getHTMLQuestions());
	    // Hiển thị những câu hỏi đã trả lời (nếu có)
	    this.renderer.displayOldAnswers();
	    // Vô hiệu hóa bài thi nếu đã submit hay hết giờ
	    this.disableTakingExam();
	}

	setEventListeners() {
	    this.setBtnPauseTime();
	    this.setBtnChoosePassage();
	    this.setRadioChooseQuestion()
	}

	disableTestWhenTimeOut() {
		// Nếu user đã submit trước khi hết giờ
	    if(this.exam.isFinished()) {return;}

	    const answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);

	    if(!answered) {
	        // Popup khi người dùng chưa làm câu nào
	        this.renderer.popupNoAnswer();
	        this.exam.changeToFinish();
	        this.disableTakingExam();
	        this.audio.play();
	        return;
	    }

	    const totalQuestions = Object.keys(this.exam.getCorrectAnswers()).length;
	    const totalCorrectQuestions = Object.keys(this.exam.getUserCorrectAnswers()).length;

	    this.exam.changeToFinish();
	    this.disableTakingExam();
	    this.renderer.popupCorrectAnswers(totalCorrectQuestions, totalQuestions);
	    this.audio.play();
	}

	disableTakingExam() {
	    if(this.exam.isFinished()) {
	        this.exam.stop();
	        this.renderer.disableUserChoice();
	        this.renderer.showIncorrectAnswers(this.exam.getUserIncorrectAnswers());
	        this.renderer.showCorrectAnswers(this.exam.getCorrectAnswers(), this.exam.getUserCorrectAnswers());
	        this.renderer.hideTimeArea();
	        this.renderer.hideBtnSubmit();
	        this.renderer.displayBtnHomepage();
	    }
	}

	setBtnPauseTime() {
	    ELEMENTS.btn_pause_time = document.getElementById('btn_pause_time');

	    if(!ELEMENTS.btn_pause_time) {return;}

	    // Gắn sự kiện
	    ELEMENTS.btn_pause_time.addEventListener('click', () => {

	        const is_paused = STORAGE_KEYS.getData(STORAGE_KEYS.IS_PAUSED);

	        if(is_paused === 'false') {
	            this.exam.saveRemainingTime();
	            // Dừng bài thi
	            this.exam.stop();
	            this.renderer.changeBtnPauseTimeContent('Restart', 'btn-warning', 'btn-success');
	        }
	        if(is_paused === 'true') {
	            // Bắt đầu lại bài thi sau dừng
	            this.exam.saveEndTime();
	            this.exam.resume(getRemainingTime());
	            this.renderer.changeBtnPauseTimeContent('Pause', 'btn-success', 'btn-warning');
	        }
	    });
	}

	setRadioChooseQuestion() {

	    ELEMENTS.right_view = document.getElementById('right_view');
	    if(!ELEMENTS.right_view) {return;}

	    ELEMENTS.right_view.addEventListener('click', (e) => {
	        const btn = e.target.closest('.choose-question');
	        if(btn) {
	            let q_id = btn.dataset.id;
	            this.exam.saveUserAsnwers(q_id);
	        }
	    });
	}

	setBtnChoosePassage() {
	    ELEMENTS.btns_zone = document.getElementById('btns_zone');

	    if(!ELEMENTS.btns_zone) {return;}

	    ELEMENTS.btns_zone.addEventListener('click', (e) => {
	        //const btn = e.target.closest('.btn-choose-passage, #btn_submit, #btn_done');
	        const btn = e.target.closest('[data-action]');
	    
	        if(!btn) {return};

	    // Lấy hành động cần thực hiện
	        const action = btn.dataset.action;
	        switch (action) { // Nếu là nút chọn bài thì ta đặt ID ảo hoặc check class
	            case 'submit':
	                this.submitTest();
	                break;

	            case 'go-to-home-page':
	                this.goToHomepage();
	                break;

	            case 'choose-passage':
	                const rp_id = btn.dataset.id;
	                STORAGE_KEYS.saveData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX, rp_id);
	                this.renderViewChoosePassage(rp_id);
	                break;
	            default:
	                console.log('');
	        }
	    });
	}

	renderViewChoosePassage(rp_id) {
	    // Hiển thị bài đọc
	    this.renderer.displayLeftContent(this.renderer.getHTMLReadingPassages(rp_id));
	    // Hiển thị câu hỏi
	    this.renderer.displayRightContent(this.renderer.getHTMLQuestions(rp_id));
	    this.renderer.displayOldAnswers();
	    this.disableTakingExam();
	}

	goToHomepage() {
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
	            this.resetStorageKeys();
	            window.location.href = BASE_URL;
	        }
	    });
	}

	resetStorageKeys() {
	    const currentTheme = STORAGE_KEYS.getData(STORAGE_KEYS.THEME);
	    localStorage.clear();
	    if(currentTheme) {
	        STORAGE_KEYS.saveData(STORAGE_KEYS.THEME, currentTheme);
	    }
	}

	popupWhenUserNotAnswerAnyQuestion() {
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
                this.resetStorageKeys();
                window.location.href = BASE_URL;
            }
        });
	}

	popupWhenUserNotANswerFullQuestions(num_answers, totalQuestions, totalCorrectQuestions) {

    	let warningNotification = '';
	    if(num_answers < 40) {
	        warningNotification = `Bạn đã làm ${num_answers} / ${totalQuestions}`;
	    } else {
	        warningNotification = 'Bạn có chắc chắn muốn nộp bài ?';
	    }

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
	            this.exam.changeToFinish();
	            this.disableTakingExam();
	        
	            this.renderer.popupSuccessSubmit(totalCorrectQuestions, totalQuestions);
	        } else {
	            if(num_answers < 40) {

	                // 1. Định nghĩa cấu trúc (Bạn có thể để cái này ở file config riêng)
					const passageConfig = [
					    { name: 'Passage 1', start: 1, end: 10 },
					    { name: 'Passage 2', start: 11, end: 20 },
					    { name: 'Passage 3', start: 21, end: 30 },
					    { name: 'Passage 4', start: 31, end: 40 }
					];

					// 2. Khởi tạo object kết quả tự động
					const sortedByPassage = {};
					passageConfig.forEach(p => sortedByPassage[p.name] = []);

					// 3. Xử lý chính (Sử dụng for...of thay vì for...in cho mảng)
					const notAnswerList = this.exam.getNotAnsweredQuestions();

					for (const id of notAnswerList) {
					    const question_id = Number(id);
					    
					    // Tìm passage phù hợp
					    const found = passageConfig.find(p => question_id >= p.start && question_id <= p.end);
					    
					    if (found) {
					        sortedByPassage[found.name].push(question_id);
					    }
					}
	               

	                let popupHTML = `<div>`;

	                for(let i in sortedByPassage) {
	                    if(sortedByPassage[i].length > 0) {
	                        popupHTML += `<p>${i}: ${sortedByPassage[i].join(', ')}</p>`;
	                    }
	                }

	                popupHTML += '</div>';

	                this.renderer.popupNotAnswers(popupHTML);
	            }
	        }
    	});
	}

	submitTest() {
		const answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);

		if(!answered) {
			this.popupWhenUserNotAnswerAnyQuestion();
			return;
		}

		const num_answers = Object.keys(answered).length;
	    const totalQuestions = Object.keys(this.exam.getCorrectAnswers()).length;
	    const totalCorrectQuestions = Object.keys(this.exam.getUserCorrectAnswers()).length;

		this.popupWhenUserNotANswerFullQuestions(num_answers, totalQuestions, totalCorrectQuestions);
	}
}
