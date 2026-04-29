//import { setEventListeners as setELReading } from './events/readingEvents.js';
import { setEventListeners as setELHomepage} from './events/homeEvents.js';
import { initExam } from './events/examEvents.js';
//import { renderUI } from './render/readingRender.js';
import { loadReadingExamData } from './api/readingAPI.js';
import { setUtils } from './utils.js';

async function main() { 
    const pageType = document.body.dataset.page;
    console.log(pageType);
    if(pageType === 'readingExam') {
        await loadReadingExamData();

        initExam('reading');
        //setELReading();
        //renderUI();
    }

    if(pageType === 'homepage') {
        setELHomepage();
    }

    setUtils();
}

main();
