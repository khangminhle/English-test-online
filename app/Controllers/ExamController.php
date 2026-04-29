<?php
namespace App\Controllers;

require_once(realpath(BASE_PATH. '/app/Models/Exam.php'));

use App\Models\Exam;

class ExamController {
	public function takeReadingExam() {

		$readingExam = new Exam();

		header('Content-Type: application/json');
		echo $readingExam->getReadingData();
		//print_r($readingExam->getReadingData());
		exit;
	}
}
?>