export const STORAGE_KEYS = {
    THEME: 'theme',
    USER_ANSWERS: 'answered',
    SUBMITTED: 'submitted',
    PASSAGES: 'passages',
    QUESTIONS: 'questions',
    TIMELEFT: 'timeleft',
    BUTTON_TIME: 'button_time',
    CURRENT_PASSAGE_INDEX: 'current_passage_index',
    IS_PAUSED: 'is_paused',
    EXAM_END_TIME: 'exam_end_time',
    REMAINING_TIME_PAUSED: 'remaining_time_paused',

    saveData(key, data) {
        const valueToStore = (typeof data === 'object' && data !== null) ? JSON.stringify(data) : data;
        localStorage.setItem(key, valueToStore);
    },
    getData(key) {
        const data = localStorage.getItem(key);
        if (!data) {return null};
        
        try {
            if(typeof JSON.parse(data) === 'object'){
                return JSON.parse(data);
            } else {
                return data;
            }
        } catch (e) {
            return data;
        }
    }
};

export const APPSTATE = {
    passages: null,
    questions: null,
    intervalCountDown: null,
    currentTimer: null
};

export const ELEMENTS = {
    btns_zone: null,
    passage_view: null,
    question_view: null,
    btnSwitch: null,
    startBtn: null,
    stopBtn: null,
    audioPlayback: null,
    btns_choose_exam: null,
    btn_pause_time: null
};

export const BASE_URL = window.location.origin + '/vsnew/public';
