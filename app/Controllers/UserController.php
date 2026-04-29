<?php
namespace App\Controllers;

require_once(realpath(BASE_PATH. '/app/Models/User.php'));

use App\Models\User;
#use App\Models\Exam;

class UserController {
	public function go_to_homepage() {
		$page_name = 'Trang chủ nè';
		$data_page = 'homepage';
		include_once(realpath(BASE_PATH. '/app/Views/home.php'));
	}

	# Trang thi Reading
	public function join_reading_test() {
		$page_name = 'Reading Test';
		$data_page = 'readingExam';
		# Show dữ liệu
		#$user = new User();

		#$data = $user->getPassages();

		#$exam = new Exam();

		#$data = $exam->getPassages();
		
		include_once(realpath(BASE_PATH. '/app/Views/readingTest.php'));
	}

	# Trang thi Listening
	public function join_listening_test() {
		$page_name = 'Listening Test';
		$data_page = 'listeningExam';
		echo 'Đây là trang listeningTest';
	}

	# Trang thi Writing
	public function join_writing_test() {
		$page_name = 'Writing Test';
		$data_page = 'writingExam';
		echo 'Đây là trang writingTest';
	}

	# Trang thi Speaking
	public function join_speaking_test() {
		$page_name = 'Speaking Test';
		$data_page = 'speakingExam';
		echo 'Đây là trang speakingTest';
	}
}

?>