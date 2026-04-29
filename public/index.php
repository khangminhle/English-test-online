<?php

require_once(realpath(dirname(__DIR__). '/config.php'));

require_once(realpath(BASE_PATH. '/app/Core/Router.php'));

require_once(realpath(BASE_PATH. '/app/Controllers/UserController.php'));
require_once(realpath(BASE_PATH. '/app/Controllers/ExamController.php'));

use App\Core\Router;
use App\Controllers\UserController;
use App\Controllers\ExamController;

$router = new Router();

# Định nghĩa các Route
$router->get('/', UserController::class, 'go_to_homepage');
$router->get('/reading', UserController::class, 'join_reading_test');
$router->get('/listening', UserController::class, 'join_listening_test');
$router->get('/writing', UserController::class, 'join_writing_test');
$router->get('/speaking', UserController::class, 'join_speaking_test');
$router->get('/takeReadingExam', ExamController::class, 'takeReadingExam');


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$uri = str_replace($scriptName, '', $uri);
$router->dispatch($uri);
?>