<?php
namespace App\Models;

require_once(realpath(BASE_PATH. '/app/Core/Database.php'));

use App\Core\Database;

use \PDO;
use \Redis;

class User {
	private $db;

	public function __construct() {
		$this->db = Database::getInstance();
	}

	public function getUser() {
		$stmt = $this->db->prepare("SELECT * FROM readingpassage WHERE id LIKE 'rp1%'");
		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getPassages() {
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
		$redis = new Redis();
        $redis->connect('127.0.0.1', 6379);

		foreach($data as $row) {
			$id = $row['id'];
			$split_group = explode('_', $id);
			$redis->sAdd($split_group[0], $id);
			if(!isset($passages_content[$id])) {
				$passages_content[$id] = $row['r_content'];
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

		#echo 'Del';
		#$redis->del('allQuestions');
		#$redis->del('allPassagesContent');

		$results=[];

        if($redis->exists('allQuestions')) {
        	echo 'Questions Đã tồn tại';

        	$data = json_decode($redis->get('allQuestions'), true);

        	$results['questions'] = $data;
        	$results['rp1'] = $redis->sRandMember('rp1');
        	$results['rp2'] = $redis->sRandMember('rp2');
        	$results['rp3'] = $redis->sRandMember('rp3');
        	$results['rp4'] = $redis->sRandMember('rp4');
        } else {

        	$redis->set('allQuestions', json_encode($questions));

        	echo 'Đã khởi tạo questions';
        }

        if($redis->exists('allPassagesContent')) {
        	echo 'Passage Content Đã tồn tại';

        	$data = json_decode($redis->get('allPassagesContent'), true);

        	$results['passages'] = $data;
        } else {

        	$redis->set('allPassagesContent', json_encode($passages_content));

        	echo 'Đã khởi tạo Passage Content';
        }

        return $results;

		#return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>