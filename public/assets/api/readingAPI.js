import { STORAGE_KEYS, BASE_URL } from '../constants.js';

export async function loadReadingExamData() {
    try {

        const ls_passages = STORAGE_KEYS.getData(STORAGE_KEYS.PASSAGES);
        const ls_questions = STORAGE_KEYS.getData(STORAGE_KEYS.QUESTIONS);

        if(ls_passages === null || ls_questions === null) {
            console.log('Lấy dữ liệu');
            const response = await fetch(`${BASE_URL}/takeReadingExam`);
            if (!response.ok) throw new Error("Lỗi kết nối");
            
            const data = await response.json();
            
            STORAGE_KEYS.saveData(STORAGE_KEYS.PASSAGES, JSON.parse(data['passages']));
            STORAGE_KEYS.saveData(STORAGE_KEYS.QUESTIONS, JSON.parse(data['questions']));

            return {
                'passages': JSON.parse(data['passages']),
                'questions': JSON.parse(data['questions'])
            };
        }

        return {
            'passages': ls_passages,
            'questions': ls_questions
        };
    } catch (error) {
        console.error("Không lấy được dữ liệu:", error);
    }
}