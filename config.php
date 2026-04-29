<?php
// Thư mục gốc dự án
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";

#$current_host = $_SERVER['HTTP_HOST'];
/*
if ($current_host == 'vs.localhost') {
    // Nếu dùng subdomain, đường dẫn gốc là /
    define('BASE_URL', "$protocol://" . $_SERVER['HTTP_HOST'] . '/'); 
} else {
    // Nếu dùng localhost truyền thống, đường dẫn gốc là /vs/public
    define('BASE_URL', "$protocol://" . $_SERVER['HTTP_HOST'] . '/vs/public/');
    #define('BASE_URL', '/vs/public');
}
*/

define('BASE_PATH', __DIR__);
define('BASE_URL', "$protocol://" . $_SERVER['HTTP_HOST'] . '/vsnew/public/');
#echo BASE_PATH;


?>