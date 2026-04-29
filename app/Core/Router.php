<?php
	namespace App\Core;

	class Router {
		protected $routes = [];
		// Thêm route vào danh sách
	    public function get($path, $controller, $action) {
	        $this->routes[$path] = ['controller' => $controller, 'action' => $action];
	    }

	    // Xử lý request
	    public function dispatch($url) {
	        // Loại bỏ phần query string (ví dụ ?id=1)
	        $url = parse_url($url, PHP_URL_PATH);
	        if (array_key_exists($url, $this->routes)) {
	            $route = $this->routes[$url];
	            $controllerName = $route['controller'];
	            $actionName = $route['action'];

	            // Gọi Controller và Action
	            #var_dump($controllerName); // Xem PHP đang cố tìm class tên gì
				#exit();
	            $controller = new $controllerName();
	            $controller->$actionName();
	        } else {
	            echo "404 - Trang không tồn tại";
	        }
	    }
	}
?>

