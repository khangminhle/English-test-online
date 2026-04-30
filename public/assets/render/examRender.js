import { ELEMENTS } from "../constants.js";
export class ExamRender {

	static renderLayout() {
		this.displayTimeArea();
		this.displayContent();
		console.log('render exam layout');
	}

	static updateTime(timeleft) {
		let element = document.getElementById('timer');

		if(!element) {return;}

		element.innerText = timeleft;
	}

	static displayTimeArea() {
		let element = document.getElementById('time_area');
		if(!element) {return;}
		let html = `
			<div class="text-center">
	    		<small class="d-block text-uppercase fw-bold text-warning">Time left</small>
	    		<div id="timer" class="h4 mb-0 fw-bold" style="font-family: monospace;">-:-</div>
	    		<div id="num_answers" class="container-fluid" style="text-align: center"></div>
	  		</div>
	  		<div>
	  			<button id="btn_pause_time" class="btn btn-warning">Pause</button>
	  		</div>
		`;
		element.innerHTML = html;
	}

	static displayContent() {
		let element = document.getElementById('exam_container');

		if(!element) {return;}

		let html = `
			<div class="row vh-size">
		        <!-- Cột trái: Reading Passage (chiếm 6/12 cột) -->
		        <div class="col-md-6 border-end scrollable-column p-4">
		            <div id='passage_view'></div>
		        </div>

		        <!-- Cột phải: Questions (chiếm 6/12 cột) -->
		        <div class="col-md-6 scrollable-column p-4">
		            <div id="question_view"></div>
		        </div>
		    </div>
		`;

		element.innerHTML = html;
	}

	static displayReadingPassage(data) {
		console.log(data);
	}

	static changeBtnPauseTimeContent(content, oldClass, newClass) {
		if(!ELEMENTS.btn_pause_time) {return;}

		ELEMENTS.btn_pause_time.innerText = content;
        ELEMENTS.btn_pause_time.classList.replace(oldClass, newClass);
	}
}

