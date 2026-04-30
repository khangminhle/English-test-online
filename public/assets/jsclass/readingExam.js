import { ExamRender } from "../render/examRender.js";
import { Exam } from "./exam.js";

export class ReadingExam extends Exam {
	newfunc() {
		console.log('Reading Exam ne:', this.examData);
	}

	renderContent() {
		ExamRender.displayReadingPassage('passage');
	}
}