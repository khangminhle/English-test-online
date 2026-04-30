<?php require_once(realpath(BASE_PATH. '/app/Views/header.php')); ?>

<!-- Time Counter -->
<div id="time_area" class="position-fixed top-0 end-0 me-5 p-2 bg-dark text-white rounded shadow"></div>

<audio id="audio_end_exam" src="<?php echo BASE_URL;?>assets/audios/bell.mp3"></audio>


<div id="exam_container" class="container-fluid"></div>
<div id="btns_zone" class="container-fluid"></div>
<?php require_once(realpath(BASE_PATH. '/app/Views/footer.php')); ?>