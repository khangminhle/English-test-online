<?php
namespace App\Models;

require_once(realpath(BASE_PATH. '/app/Core/Database.php'));

use App\Core\Database;

use \PDO;
use \Redis;

class Exam {
	private $db;

	public function __construct() {
		$this->db = Database::getInstance();
	}

	public function getReadingPassages() {
		try {
			$sql = "
				SELECT * FROM readingpassage
			";

			$stmt = $this->db->prepare($sql);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return $data;
		    
		} catch (Exception $e) {
		    echo "Lỗi: " . $e->getMessage();
		    return false;
		}
	}

	public function getReadingQuestions() {
		try {
			$sql = "
				SELECT * FROM question
			";

			$stmt = $this->db->prepare($sql);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return $data;
		    
		} catch (Exception $e) {
		    echo "Lỗi: " . $e->getMessage();
		    return false;
		}
	}


	public function getReadingData() {
		$redis = new Redis();

		$redis->connect('127.0.0.1', 6379);

		# ---- XÓA TẠO MỚI ---- #
		//$redis->del('allPassagesContent');
		//$redis->del('allQuestions');
		#die();

		// Khi Data chưa được cache
		if(!$redis->exists('allPassagesContent')) {
			$readingPassages = $this->getReadingPassages();

			$passages_content=[];

			foreach($readingPassages as $rp) {
				$id = $rp['id'];
				$split_group = explode('_', $id);
				$redis->sAdd($split_group[0], $id);
				$passages_content[$id] = json_decode($rp['content'], true);
			}

			// Cache Reading Passages 
			$redis->set('allPassagesContent', json_encode($passages_content));
		}

		if(!$redis->exists('allQuestions')) {

			$questionsPassages = $this->getReadingQuestions();

			$questions = [];;

			foreach($questionsPassages as $q) {
				$id = $q['rp_id'];
				if(!isset($questions[$id])) {
					$questions[$id] = [
						'qna' => []
					];
				}
				$questions[$id]['qna'][] = [
					'content' => $q['content'], 
					'A' => $q['option1'], 
					'B' => $q['option2'], 
					'C' => $q['option3'], 
					'D' => $q['option4'], 
					'answer' => $q['answer']
				];
			}
			$redis->set('allQuestions', json_encode($questions));

		}
		
		/*
		if(!$redis->exists('allPassagesContent')) {

			$sql = "
				SELECT rp.id, rp.content AS r_content,
				q.content AS q_content,
				q.option1,
				q.option2,
				q.option3,
				q.option4,
				q.answer
				FROM readingpassage rp
				LEFT JOIN question q
				ON rp.id = q.rp_id
			";

			$stmt = $this->db->prepare($sql);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

			$questions=[];
			$passages_content=[];

			foreach($data as $row) {
				$id = $row['id'];
				$split_group = explode('_', $id);
				$redis->sAdd($split_group[0], $id);
				if(!isset($passages_content[$id])) {
					$passages_content[$id] = json_decode($row['r_content'], true);
				}
				if(!isset($questions[$id])) {
					$questions[$id] = [
						'qna' => []
					];
				}
				$questions[$id]['qna'][] = [
					'content' => $row['q_content'], 
					'A' => $row['option1'], 
					'B' => $row['option2'], 
					'C' => $row['option3'], 
					'D' => $row['option4'], 
					'answer' => $row['answer']
				];
			}

			$redis->set('allQuestions', json_encode($questions));
			$redis->set('allPassagesContent', json_encode($passages_content));
		} 
		*/

		if($redis->exists('allPassagesContent') and $redis->exists('allQuestions')) {
			$randomPassages = [
				'rp1' => $redis->sRandMember('rp1'),
				'rp2' => $redis->sRandMember('rp2'),
				'rp3' => $redis->sRandMember('rp3'),
				'rp4' => $redis->sRandMember('rp4'),
			];

			$passages = json_decode($redis->get('allPassagesContent'), true);

			$questions = json_decode($redis->get('allQuestions'), true);

			$selectedPassages = [];
			$selectedPassages['rp1'] = $passages[$randomPassages['rp1']];
			$selectedPassages['rp2'] = $passages[$randomPassages['rp2']];
			$selectedPassages['rp3'] = $passages[$randomPassages['rp3']];
			$selectedPassages['rp4'] = $passages[$randomPassages['rp4']];

			$selectedQuestions = [];
			$selectedQuestions['rp1'] = $questions[$randomPassages['rp1']];
			$selectedQuestions['rp2'] = $questions[$randomPassages['rp2']];
			$selectedQuestions['rp3'] = $questions[$randomPassages['rp3']];
			$selectedQuestions['rp4'] = $questions[$randomPassages['rp4']];

			return json_encode([
				'passages' => json_encode($selectedPassages),
				'questions' => json_encode($selectedQuestions)
			]);
			
		} else {
			echo 'Không có tải được Passages và Questions';
			return false;
		}
	}
}
?>