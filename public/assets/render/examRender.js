export class ExamRender {

	static renderLayout() {
		this.displayTimeArea();
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
}

