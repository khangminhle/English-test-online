import { ELEMENTS, STORAGE_KEYS } from "../constants.js";
import { ExamRender } from "./examRender.js";

export class ReadingExamRender extends ExamRender {

	static displayPassage(rp_number='rp1') {

		const readingPassages = STORAGE_KEYS.getData(STORAGE_KEYS.PASSAGES);
		ELEMENTS.left_view = document.getElementById('left_view');

		if(!readingPassages) {return;}
		if(!ELEMENTS.left_view) {return;}

		let current_passage_index = STORAGE_KEYS.getData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX);
	    console.log('Passage:', current_passage_index);
	    if(current_passage_index) {
	        rp_number = current_passage_index;
	    }

	    let filter_text = readingPassages[rp_number].replaceAll('<u>','<b>').replaceAll('</u>', '</b>');
	    let rp1_paragraphs = filter_text.split('\n');

	    let html = `<h4>${rp1_paragraphs[0]}</h4>`;
	    for(let i = 1; i < rp1_paragraphs.length; i++) {
	        html += `<p>${rp1_paragraphs[i]}</p>`;
	    }

	    ELEMENTS.left_view.innerHTML = html;
	}

	static displayBtnChoosePassage() {
		const readingPassages = STORAGE_KEYS.getData(STORAGE_KEYS.PASSAGES);
		if(!readingPassages) {return;}
		ELEMENTS.btns_zone = document.getElementById('btns_zone');
		if(!ELEMENTS.btns_zone) {return;}

	    let html = `<div class="d-flex justify-content-center">`;
	    for(let rp_number in readingPassages) {
	        //html += `<div class="col-1 d-flex justify-content-center">`;
	        html += `<button type="button" class="btn btn-primary ms-2 btn-choose-passage" data-id="${rp_number}">Passage ${rp_number.replace('rp','')}</button>`;
	        //html += `</div>`;
	    }
	    //html += `<div class="col-1 d-flex justify-content-center">`
	    html += `<button type="button" class="btn btn-success ms-4" id="btn_submit">Submit</button>`;
	    //html += `</div>`;
	    //html += `<div class="col-1 d-flex justify-content-center">`
	    html += `<button style="display:none" type="button" class="btn btn-danger ms-4" id="btn_done">Homepage</button>`;
	    //html += `</div>`;
	    html += `</div>`;

	    ELEMENTS.btns_zone.innerHTML = html;
	}

	static displayQuestions(rp_number='rp1') {
		const readingQuestions = STORAGE_KEYS.getData(STORAGE_KEYS.QUESTIONS);
		ELEMENTS.right_view = document.getElementById('right_view');

		if(!readingQuestions) {return;}
		if(!ELEMENTS.right_view) {return;}

		let current_passage_index = STORAGE_KEYS.getData(STORAGE_KEYS.CURRENT_PASSAGE_INDEX);
	    if(current_passage_index) {
	        rp_number = current_passage_index;
	    }


	    let rp_questions = readingQuestions[rp_number]['qna'];

	    let html = `<h3>Questions</h3>`;
	    html += `<div>`

	    let index = Number(rp_number.replace('rp',''));
	    let len = index * 10;

	    console.log('index:', index);

	    for(let i = 0; i < rp_questions.length; i++) {
	        html += `<div class="mt-4">`;
	        let content = rp_questions[i]['content'].replaceAll('<u>', '<b>').replaceAll('</u>', '</b>');
	        //console.log(content);
	        html += `<p>${content}</p>`;
	        let ans = ['A', 'B', 'C', 'D'];
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

	    ELEMENTS.right_view.innerHTML = html;
		}
}

