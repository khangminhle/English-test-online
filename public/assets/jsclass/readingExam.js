import { Exam } from "./exam.js";
import { loadReadingExamData } from "../api/readingAPI.js";
export class ReadingExam extends Exam {

	async loadData() {
		this.data = await loadReadingExamData();
	}
}