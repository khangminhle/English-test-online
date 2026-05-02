import { Exam } from "./exam.js";
import { loadReadingExamData } from "../api/readingAPI.js";
export class ReadingExam extends Exam {
	async loadData() {
		await loadReadingExamData();
		console.log('đã lấy data');
	}
}