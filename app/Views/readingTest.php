<?php require_once(realpath(BASE_PATH. '/app/Views/header.php')); ?>

<!-- Time Counter -->
<div id="time_area" class="position-fixed top-0 end-0 me-5 p-2 bg-dark text-white rounded shadow"></div>

<audio id="audio_end_exam" src="<?php echo BASE_URL;?>assets/audios/bell.mp3"></audio>


<div class="container-fluid">
    <div class="row vh-size">
        <!-- Cột trái: Reading Passage (chiếm 6/12 cột) -->
        <div class="col-md-6 border-end scrollable-column p-4">
            <div id='passage_view'></div>
        </div>

        <!-- Cột phải: Questions (chiếm 6/12 cột) -->
        <div class="col-md-6 scrollable-column p-4">
            <div id="question_view"></div>
        </div>
    </div>
</div>
<div id="btns_zone" class="container-fluid"></div>
<?php require_once(realpath(BASE_PATH. '/app/Views/footer.php')); ?>