import { setEventListeners as setELHomepage} from './events/homeEvents.js';
import { setGeneralEventListeners } from './events/generalEvents.js';
import { ReadingExam } from './jsclass/readingExam.js'; // LOGIC DATA
import { ReadingExamRender } from './render/readingExamRender.js'; // RENDER
import { settingExam } from './events/examEvents.js'; // LOGIC UI

async function main() { 
    const pageType = document.body.dataset.page;
    console.log(pageType);
    if(pageType === 'readingExam') {
        const exam = new ReadingExam(10);
        await exam.loadData();
        if(exam.checkValidData()) {
            console.log('Data hợp lệ!');
            settingExam(exam, new ReadingExamRender(exam.data));
        } else {
            console.log('Data không hợp lệ!');
        }
    }

    if(pageType === 'homepage') {
        setELHomepage();
    }

    setGeneralEventListeners();
}

main();