import { STORAGE_KEYS, APPSTATE, ELEMENTS, BASE_URL } from '../constants.js';
import { 
    displayReadingPassage, 
    displayReadingQuestions,
    displayOldAnswers,
    chooseAnswer,
    showIncorrectAnswers,
    showCorrectAnswers,
    goToHomepage,
    submitTest,
    pauseTimeCountDown,
    disableTakingExam,
    timePauseRestart
} from '../render/readingRender.js';

export function setEventListeners() {
	
	// Những phần tử có nút bấm
	setBtnChoosePassage();
    setBtnTimeCountDown();
	setRadioChooseQuestion();

	// set View
	setPassageView();
	setQuestionView();
    console.log('ReadingEvents đã xong!');
}

// Button tạm dừng time countdown
function setBtnTimeCountDown() {
    ELEMENTS.btn_pause_time = document.getElementById('btn_pause_time');
    if(!ELEMENTS.btn_pause_time) {return;}
    console.log('Đã set time_pause_time!');

    ELEMENTS.btn_pause_time.addEventListener('click', () => {
        timePauseRestart();//pauseTimeCountDown();
    });
}


// Button chọn passage
function setBtnChoosePassage() {
    ELEMENTS.btns_zone = document.getElementById('btns_zone');

    if(!ELEMENTS.btns_zone) {return;}
    console.log('set EL cho btn choose passage!');
    ELEMENTS.btns_zone.addEventListener('click', (e) => {
    	const btn = e.target.closest('.btn-choose-passage');

    	if(btn) {
    		let rp_id = btn.dataset.id;
    		STORAGE_KEYS.saveData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX, rp_id);
    		displayReadingPassage(rp_id);
    		displayReadingQuestions(rp_id);
            displayOldAnswers();
            disableTakingExam();
    	}
    	/*
        if(e.target.classList.contains('btn-choose-passage')) {
            let rp_id = e.target.dataset.id;
            console.log(rp_id);
        }
        */
    });
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
}

function setRadioChooseQuestion() {
	console.log('setRadioChooseQuestion');
	ELEMENTS.question_view = document.getElementById('question_view');

    if(!ELEMENTS.question_view) {return;}
    console.log('set EL cho radio choose question!');
    ELEMENTS.question_view.addEventListener('click', (e) => {
    	const btn = e.target.closest('.choose-question');

    	if(btn) {
    		let q_id = btn.dataset.id;
    		chooseAnswer(q_id);
    	}
    });
}

function setPassageView() {
	ELEMENTS.passage_view = document.getElementById('passage_view');
	if(!ELEMENTS.passage_view) {return;}
	console.log('Đã set passage view!');
}

function setQuestionView() {
	ELEMENTS.question_view = document.getElementById('question_view');
	if(!ELEMENTS.question_view) {return;}
	console.log('Đã set question view!');
}