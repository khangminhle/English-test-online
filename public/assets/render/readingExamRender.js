import { ELEMENTS, STORAGE_KEYS } from "../constants.js";
import { ExamRender } from "./examRender.js";

export class ReadingExamRender extends ExamRender {

	constructor(readingData) {
		super();
		this.passages = readingData['passages'];
		this.questions = readingData['questions'];
	}

	getHTMLReadingPassages(rp_number='rp1') {

		const readingPassages = this.passages;
		if(!readingPassages) {return '';}

		const current_passage_index = STORAGE_KEYS.getData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX);
	    if(current_passage_index) {
	        rp_number = current_passage_index;
	    }

	    const filter_text = readingPassages[rp_number].replaceAll('<u>','<b>').replaceAll('</u>', '</b>');
	    const rp1_paragraphs = filter_text.split('\n');

	    let html = `<h4>${rp1_paragraphs[0]}</h4>`;
	    for(let i = 1; i < rp1_paragraphs.length; i++) {
	        html += `<p>${rp1_paragraphs[i]}</p>`;
	    }

		return html;
	}
	getHTMLQuestions(rp_number='rp1') {
		const readingQuestions = this.questions;//STORAGE_KEYS.getData(STORAGE_KEYS.QUESTIONS);

		if(!readingQuestions) {return '';}

		const current_passage_index = STORAGE_KEYS.getData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX);
	    if(current_passage_index) {
	        rp_number = current_passage_index;
	    }

	    const rp_questions = readingQuestions[rp_number]['qna'];

	    let html = `<h3>Questions</h3>`;
	    html += `<div>`

	    const index = Number(rp_number.replace('rp',''));

	    for(let i = 0; i < rp_questions.length; i++) {
	        html += `<div class="mt-4">`;
	        const content = rp_questions[i]['content'].replaceAll('<u>', '<b>').replaceAll('</u>', '</b>');
	        //console.log(content);
	        html += `<p>${content}</p>`;
	        const ans = ['A', 'B', 'C', 'D'];
	        for(let j = 0; j < ans.length; j++) {
	            let q_content =  rp_questions[i][ans[j]];
	            if(q_content.includes('<b>')) {
	            	q_content = q_content.replace(/<b>|<\/b>/g, '');
	            }
	            html += `<div class="mt-2">`;
	            html += `<input id="${((index-1)*10+i+1)+ans[j]}" class="choose-question" title="${'Chọn câu ' + ((index-1)*10+i+1)+ans[j]}" type="radio" name="q${(index-1)*10+i+1}" data-id="${((index-1)*10+i+1)+ans[j]}">`; //onchange="chooseAnswer(this)">`;
	            html += `<label title="${'Chọn câu ' + ((index-1)*10+i+1)+ans[j]}" class="form-check-label" for="${((index-1)*10+i+1)+ans[j]}" data-id="${'lb'+((index-1)*10+i+1)+ans[j]}">${q_content}</label><br>`;
	            html += `</div>`;
	        }
	        html += `</div>`;
	    }
	    html += `</div>`;

	    return html;
	}
	getHTMLBtnChoosePassages() {
		const readingPassages = this.passages;
		if(!readingPassages) {return '';}

		let html = `<div class="d-flex justify-content-center">`;
	    for(let rp_number in readingPassages) {
	        html += `<button type="button" class="btn btn-primary ms-2" data-action="choose-passage" data-id="${rp_number}">Passage ${rp_number.replace('rp','')}</button>`;
	    }
	    html += `<button type="button" class="btn btn-success ms-4" data-action="submit" id="btn_submit">Submit</button>`;
	    html += `<button style="display:none" type="button" class="btn btn-danger ms-4" data-action="go-to-home-page" id="btn_done">Homepage</button>`;
	    html += `</div>`;

	    return html;
	}
}

