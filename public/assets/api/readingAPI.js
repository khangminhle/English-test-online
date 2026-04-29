import { STORAGE_KEYS, APPSTATE, BASE_URL } from '../constants.js';

export async function loadReadingExamData() {
    try {

        let ls_passages = STORAGE_KEYS.getData(STORAGE_KEYS.PASSAGES);
        let ls_questions = STORAGE_KEYS.getData(STORAGE_KEYS.QUESTIONS);

        if(ls_passages === null || ls_questions === null) {
            console.log('Lấy dữ liệu');
            const response = await fetch(`${BASE_URL}/takeReadingExam`);
            if (!response.ok) throw new Error("Lỗi kết nối");
            
            const data = await response.json();
            
            //console.log(data);

            APPSTATE.passages = JSON.parse(data['passages']);
            APPSTATE.questions = JSON.parse(data['questions']);

            STORAGE_KEYS.saveData(STORAGE_KEYS.PASSAGES, APPSTATE.passages);
            STORAGE_KEYS.saveData(STORAGE_KEYS.QUESTIONS, APPSTATE.questions);
        } else {
            APPSTATE.passages = ls_passages;
            APPSTATE.questions = ls_questions;
        }
    } catch (error) {
        console.error("Không lấy được dữ liệu:", error);
    }
}