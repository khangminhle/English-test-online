<?php require_once(realpath(BASE_PATH. '/app/Views/header.php')); ?>

<!-- Main Content -->
<div class="container mt-3">
	<div class="row text-center">
		<h2 class="h2">Cấu trúc đề thi</h2>
	</div>
	<div id="btns_choose_exam" class="row mt-5 d-flex justify-content-center">
		<div class="col-2 text-center">
			<h4 class="h4">Reading <i class="bi bi-book"></i></h4>
			<button data-id="reading" class="btn btn-primary btn-choose-exam">Vào thi <i class="bi bi-arrow-right-circle-fill"></i></button>
			<p class="mt-3"><i class="bi bi-alarm"></i> 60 phút - 4 phần</p>
			
		</div>
		<div class="col-2 text-center">
			<h4 class="h4">Listening <i class="bi bi-headphones"></i></h4>
			<button data-id="listening" class="btn btn-danger btn-choose-exam">Vào thi <i class="bi bi-arrow-right-circle-fill"></i></button>
			<p class="mt-3"><i class="bi bi-alarm"></i> 47 phút - 3 phần</p>
		</div>
		<div class="col-2 text-center">
			<h4 class="h4">Writing <i class="bi bi-pencil-square"></i></h4>
			<button data-id="writing" class="btn btn-success btn-choose-exam">Vào thi <i class="bi bi-arrow-right-circle-fill"></i></button>
			<p class="mt-3"><i class="bi bi-alarm"></i> 60 phút - 2 phần</p>
		</div>
		<div class="col-2 text-center">
			<h4 class="h4">Speaking <i class="bi bi-mic"></i></h4>
			<button data-id="speaking" class="btn btn-warning btn-choose-exam">Vào thi <i class="bi bi-arrow-right-circle-fill"></i></button>
			<p class="mt-3"><i class="bi bi-alarm"></i> 12 phút - 3 phần</p>
		</div>
	</div>
	<div class="row mt-5">
		<div class="col-6 text-center">
			<div> 
				<h4 class="h4">Kiểm tra tai nghe</h4>
				<audio controls>
					<source src="<?php echo BASE_URL;?>assets/audios/barney-song.mp3" type="audio/mpeg">
			  	Your browser does not support the audio element.
				</audio>
			</div>
			<div class="mt-5">
				<h4 class="h4">Kiểm tra micro</h4>
			    <button id="startBtn">Bắt đầu thu</button>
			    <button id="stopBtn" disabled>Dừng thu</button>
			    <br><br>
			    <audio id="audioPlayback" controls></audio>
			</div>
		</div>
		<div class="col-6 text-center">
			<h4 class="h4">Lưu ý:</h4>
			<div class="mt-3">
				<p>Sau thời gian quy định, bài thi sẽ tự động chấm điểm và kết thúc.</p>
				<p>Thí sinh xem kết quả và đáp án trước khi bấm 'Kết thúc' bài thi</p>
			</div>
		</div>
	</div>
</div>
<?php require_once(realpath(BASE_PATH. '/app/Views/footer.php')); ?>