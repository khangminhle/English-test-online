//import { setEventListeners as setELReading } from './events/readingEvents.js';
import { setEventListeners as setELHomepage} from './events/homeEvents.js';
//import { initExam } from './events/examEvents.js';
//import { renderUI } from './render/readingRender.js';
//import { loadReadingExamData } from './api/readingAPI.js';
//import { setUtils } from './utils.js';
//import { setGeneralEventListeners } from './events/generalEvents.js';
import { setGeneralEventListeners } from './events/generalEvents.js';
import { ReadingExam } from './jsclass/readingExam.js'; // LOGIC DATA
import { settingExam } from './events/examEvents.js'; // LOGIC UI
import { ReadingExamRender } from './render/readingExamRender.js';
import { APPSTATE } from './constants.js';
//import { Exam } from './jsclass/exam.js';

async function main() { 
    const pageType = document.body.dataset.page;
    console.log(pageType);
    if(pageType === 'readingExam') {
        const exam = new ReadingExam(10, [APPSTATE.passages, APPSTATE.questions]);
        exam.loadData();
        settingExam(exam, ReadingExamRender);

    }

    if(pageType === 'homepage') {
        setELHomepage();
    }

    setGeneralEventListeners();
}

main();