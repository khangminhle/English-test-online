import { Exam } from "./exam.js";
import { loadReadingExamData } from "../api/readingAPI.js";
export class ReadingExam extends Exam {


	async loadData() {
		this.data = await loadReadingExamData();
	}

	checkValidData(data=this.data) {
        if(!data) {return false;}
        if(!data.hasOwnProperty('passages')) {return false;}
        if(!data.hasOwnProperty('questions')) {return false;}

        return true;
    }

    setNewData(data) {
    	if(this.checkValidData(data)) {
    		this.data = data;
    		console.log('Valid data');
    	} else {
    		console.log('Data không hợp lệ!');
    	}
    }
}