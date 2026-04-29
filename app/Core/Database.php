<?php

namespace App\Core;

use \PDO;

class Database {
	private static $instance = null;
	private $conn;

	// Các thông số cấu hình
    private $host = "localhost";
    private $db_name = "vs_database";
    private $username = "admin";
    private $password = "admin";

    // Constructor ở dạng private để ngăn chặn khởi tạo trực tiếp
    private function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Kết nối thất bại: " . $e->getMessage());
        }
    }

    // Phương thức lấy instance duy nhất
    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }
}

?>