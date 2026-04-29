import { STORAGE_KEYS, APPSTATE, ELEMENTS, BASE_URL } from '../constants.js';
import { Exam } from '../jsclass/exam.js';


export function timePauseRestart() {
	console.log('hi logic');
}

export function startExam(exam) {
    let readingExam = null;

    if(exam === 'reading') {
        let readingExam = new Exam(10, '');
        readingExam.start();
        console.log('Start thi reading!');
    }
}