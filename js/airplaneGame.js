let score = 0;
let clock = 60;
let mouseX = 0;
let mouseY = 0;
let fireTimer = 0;
let highScore_plane = 0;
let color = 0

// 取出本地高分
if (localStorage.getItem("highScore_plane")) {
	highScore_plane = localStorage.getItem("highScore_plane");
	$(".highScore span").text(highScore_plane);
} else {
	$(".highScore").hide();
}

$("#chooseBtn").on("click", gameChoose);

$("#startBtn").on("click", gameStart);
async function gameChoose() {
	const inputOptions = new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				"url(../a.png)": "Red",
				"url(../b.png)": "Green",
			});
		}, 1000);
	});

	const { value: color } = await Swal.fire({
		title: "Select color",
		input: "radio",
		inputOptions: inputOptions,
		inputValidator: (value) => {
			if (!value) {
				return "You need to choose something!";
			}
		},
	});
	if (color) {
		console.log(color);
		Swal.fire({ html: `GOOD LUCK` });
	}
	$(".block").css('background-image',`${color}`);

	return color
}

// block移動動畫
function moveBlock(id) {
	$(`#block${id}`).animate(
		{
			left: rand($(".box").width() - 50) + "px",
			top: rand(300) + "px",
		},
		3000,
		function () {
			moveBlock(id);
		}
	);
}

// 取隨機數
function rand(num) {
	return Math.round(Math.random() * num);
}
//

// 子彈發射函數
function trigger() {
	$(
		`<div class="bullet" style="left: ${mouseX - 15}px; top: ${
			mouseY - 80
		}px"></div>`
	)
		.appendTo(".box")
		.animate(
			{
				top: "-=1000px",
			},
			1500,
			"linear"
		);
}

// 遊戲開始
async function gameStart() {
	$(".controller").hide();
	$(".highScore").hide();
	$(".planeArea").addClass("boundary");

	await gameChoose();

	// reset
	clock = 0;
	score = 0;
	$("#score").text(score);

	let blockId = 0;

	// block產生
	const blockTimer = setInterval(function () {
		if ($(".block").length < 10) {
			for (let i = 0; i < rand(5); i++) {
				$(
					`<div class='block' id="block${blockId}" style="left: ${rand(
						$(".box").width() - 50
					)}px; top: ${rand(250)}px"></div>`
				).appendTo(".box");
				moveBlock(blockId);
				blockId++;
			}
		}
	}, 600);

	// 滑鼠控制飛機砲彈
	$(".planeArea").on("mousemove", function (e) {
		mouseX = e.offsetX;
		mouseY = e.offsetY + 355;
	});

	if ($("#auto").is(":checked")) {
		$(".planeArea").on("mouseenter", function () {
			fireTimer = setInterval(trigger, 250);
		});
		$(".planeArea").on("mouseleave", function () {
			clearInterval(fireTimer);
		});
	} else {
		$(".planeArea").on("click", trigger);
	}

	// 判斷子彈是否打到block
	const deterTimer = setInterval(() => {
		if ($(".bullet") && $(".block")) {
			$(".bullet").each(function () {
				let bulletTop = $(this).offset().top;
				let bulletLeft = $(this).offset().left;
				let _bullet = $(this);

				$(".block").each(function () {
					let blockTop = $(this).offset().top;
					let blockLeft = $(this).offset().left;
					let _block = $(this);

					if (
						bulletTop < blockTop + _block.height() &&
						bulletLeft + _block.width() > blockLeft &&
						bulletLeft < blockLeft + _block.width() &&
						!_block.hasClass("boom")
					) {
						_block
							.addClass("boom")
							.css(
								"background",
								"url('./images/boom.png') no-repeat center / cover"
							)
							.stop()
							.animate(
								{
									opacity: 0,
								},
								300,
								function () {
									_block.remove();
								}
							);
						_bullet.remove();
						score++;
						$("#score").text(score);
					}
				});
				if (_bullet.offset().top < 0) {
					_bullet.remove();
				}
			});
		}
	}, 10);

	const timer = setInterval(function () {
		clock++;
		$(".countdown span").css(
			"right",
			`${($(".countdown").width() * clock) / 200}px`
		);

		if (clock > 200) {
			clearInterval(timer);
			clearInterval(deterTimer);
			clearInterval(blockTimer);
			clearInterval(fireTimer);

			$(".planeArea").removeClass("boundary");
			$(".planeArea").off();
			$(".block").remove();
			$(".highScore").show();
			$(".controller").show();

			if (score > highScore_plane) {
				highScore_plane = score;
				$(".highScore span").text(highScore_plane);
				localStorage.setItem("highScore_plane", highScore_plane);
			}
		}
	}, 100);
}
