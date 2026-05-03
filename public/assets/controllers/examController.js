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

	updateTimeEverySeconds() {
	    this.exam.onTimeUpdate((timeLeft) => {
	        this.renderer.updateTime(timeLeft);
	    });
	}

	setActionOnTimeFinish() {
	    this.exam.onTimeFinish(() => {
	        this.disableTestWhenTimeOut();
	        this.changeExamToFinish();
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

	isExamFinished() {
	    return STORAGE_KEYS.getData(STORAGE_KEYS.IS_FINISHED) === 'true';
	}

	changeExamToFinish() {
	    STORAGE_KEYS.saveData(STORAGE_KEYS.IS_FINISHED, 'true');
	}

	disableTestWhenTimeOut() {
		// Nếu user đã submit trước khi hết giờ
	    if(this.isExamFinished()) {return;}

	    const answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS);

	    if(!answered) {
	        // Popup khi người dùng chưa làm câu nào
	        this.renderer.popupNoAnswer();
	        this.changeExamToFinish();
	        this.disableTakingExam();
	        this.audio.play();
	        return;
	    }

	    const totalQuestions = Object.keys(getCorrectAnswers()).length;
	    const totalCorrectQuestions = Object.keys(getUserCorrectAnswers()).length;

	    this.changeExamToFinish();
	    this.disableTakingExam();
	    this.renderer.popupCorrectAnswers(totalCorrectQuestions, totalQuestions);
	    this.audio.play();
	}

	disableTakingExam() {
	    if(this.isExamFinished()) {
	        this.exam.stop();
	        this.renderer.disableUserChoice();
	        this.renderer.showIncorrectAnswers(this.exam.getUserIncorrectAnswers());
	        this.renderer.showCorrectAnswers(this.exam.getCorrectAnswers(), this.exam.getUserCorrectAnswers());
	        this.renderer.hideTimeArea();
	        this.renderer.hideBtnSubmit();
	        this.renderer.displayBtnHomepage();
	    }
	}

}