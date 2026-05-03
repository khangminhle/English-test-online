import { ELEMENTS, STORAGE_KEYS } from "../constants.js";
import { formatTime } from "../utils.js";

export class ExamRender {

	renderLayout() {
		this.displayTimeArea();
		this.displayContentArea();
	}

	disableUserChoice() {
	    document.querySelectorAll('input[type="radio"]').forEach(radio => {
	        radio.disabled = true;
	    });
	}

	showCorrectAnswers(correctAnswers, userCorrectAnswers) {
	    if(!correctAnswers) {return;}

	    if(!userCorrectAnswers) {userCorrectAnswers = [];}
	 
	    for(let i in correctAnswers) {
	        const id = `lb${i}${correctAnswers[i]}`;

	        const element = document.querySelector(`label[data-id="${id}"]`);

	        if (element) {
	            if(userCorrectAnswers.includes(id.replace('lb',''))) {
	                element.classList.add('text-success', 'fw-bold');
	            } else {
	                element.classList.add('text-success');
	            }
	        }
	    }
	}

    showIncorrectAnswers(incorrectAnswers) {
	    if(!incorrectAnswers) {return;}

	  
	    for(let i in incorrectAnswers) {
	        const id = 'lb' + incorrectAnswers[i];
	        const element = document.querySelector(`label[data-id="${id}"]`);
	        if (element) {
	            element.classList.add('text-danger', 'fw-bold');
	        }
	    } 
	}

	popupCorrectAnswers(totalCorrectQuestions, totalQuestions) {
		Swal.fire({
	        title: 'Hết thời gian !',
	        text: `Bạn đã làm đúng: ${totalCorrectQuestions}/${totalQuestions} câu`,
	        icon: 'success',
	        confirmButtonText: 'Tôi đã rõ !',
	        confirmButtonColor: '#3085d6',
	        backdrop: true, // Hiệu ứng làm mờ nền
	        showClass: {
	            popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
	        }
    	});
	}

	popupSuccessSubmit(totalCorrectQuestions, totalQuestions) {
		Swal.fire({
	        title: 'Nộp bài thành công !',
	        text: `Bạn đã làm đúng: ${totalCorrectQuestions}/${totalQuestions} câu`,
	        icon: 'success',
	        confirmButtonText: 'Tôi đã rõ !',
	        confirmButtonColor: '#3085d6',
	        backdrop: true, // Hiệu ứng làm mờ nền
	        showClass: {
	            popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
	        }
	    });
	}

	popupNotAnswers(html) {
		Swal.fire({
            title: 'Các câu bạn chưa làm:',
            html: popupHTML,
            icon: 'warning',
            confirmButtonText: 'Tôi đã rõ !',
            confirmButtonColor: '#3085d6',
            backdrop: true, // Hiệu ứng làm mờ nền
            showClass: {
                popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
            }
        });
	}

	popupNoAnswer() {
		Swal.fire({
            title: 'Bạn chưa làm câu hỏi nào !',
            icon: 'error',
            confirmButtonText: 'Tôi đã rõ !',
            confirmButtonColor: '#3085d6',
            backdrop: true, // Hiệu ứng làm mờ nền
            showClass: {
                popup: 'animate__animated animate__fadeInDown' // Hiệu ứng xuất hiện
            }
        });
	}

	updateTime(timeleft) {
		let element = document.getElementById('timer');

		if(!element) {return;}

		element.innerText = formatTime(timeleft);
	}

	displayTimeArea() {
		if(STORAGE_KEYS.getData(STORAGE_KEYS.IS_FINISHED) === 'true') {
			this.hideTimeArea();
			return;
		}

		const element = document.getElementById('time_area');
		if(!element) {return;}
		let html = `
			<div class="position-fixed top-0 end-0 me-5 p-2 bg-dark text-white rounded shadow">
				<div class="text-center">
		    		<small class="d-block text-uppercase fw-bold text-warning">Time left</small>
		    		<div id="timer" class="h4 mb-0 fw-bold" style="font-family: monospace;">-:-</div>
		    		<div id="num_answers" class="container-fluid" style="text-align: center"></div>
		  		</div>
		  		<div>
		  			<button id="btn_pause_time" class="btn btn-warning">Pause</button>
		  		</div>
	  		</div>
		`;
		element.innerHTML = html;
	}

	hideTimeArea() {
		let element = document.getElementById('time_area');
		if(!element) {return;}

		element.style.display = 'none';
	}

    hideBtnSubmit() {
    	let element = document.getElementById('btn_submit');
		if(!element) {return;}
		element.style.display = 'none';
    }

    displayBtnHomepage() {
    	let element = document.getElementById('btn_done');
		if(!element) {return;}
		element.style.display = 'inline-block';
    }

	displayContentArea() {
		let element = document.getElementById('exam_container');

		if(!element) {return;}

		let html = `
			<div class="row vh-size">
		        <!-- Cột trái: Reading Passage (chiếm 6/12 cột) -->
		        <div class="col-md-6 border-end scrollable-column p-4">
		            <div id='left_view'></div>
		        </div>

		        <!-- Cột phải: Questions (chiếm 6/12 cột) -->
		        <div class="col-md-6 scrollable-column p-4">
		            <div id="right_view"></div>
		        </div>
		    </div>
		`;

		element.innerHTML = html;
	}

	changeBtnPauseTimeContent(content, oldClass, newClass) {
		console.log(ELEMENTS.btn_pause_time);
		if(!ELEMENTS.btn_pause_time) {return;}

		ELEMENTS.btn_pause_time.innerText = content;
        ELEMENTS.btn_pause_time.classList.replace(oldClass, newClass);
	}

    displayLeftContent(html) {
    	ELEMENTS.left_view = document.getElementById('left_view');
    	if(!ELEMENTS.left_view) {return;}

    	ELEMENTS.left_view.innerHTML = html;
    }

    displayRightContent(html) {
    	ELEMENTS.right_view = document.getElementById('right_view');
    	if(!ELEMENTS.right_view) {return;}

    	ELEMENTS.right_view.innerHTML = html;
    }

    displayOldAnswers() {
	    let answered = STORAGE_KEYS.getData(STORAGE_KEYS.USER_ANSWERS); 
	    if(answered) {
	        for(let ans in answered) {
	            let id_ans = ans + answered[ans];
	            const element = document.querySelector(`input[data-id="${id_ans}"]`);
	            if (element) {
	                element.checked = true;
	            }
	        }
	    }
	}

	displayButtonsZone(html) {
		ELEMENTS.btns_zone = document.getElementById('btns_zone');
		if(!ELEMENTS.btns_zone) {return;}

	    ELEMENTS.btns_zone.innerHTML = html;
	}
}

