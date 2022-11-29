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
	$(".highScore span").text('0');
}



$("#startBtn").on("click", gameStart);




async function gameStart() {
	
		$('#audio')[0].play();
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
	function rand(num) {
		return Math.round(Math.random() * num);
	}
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
	const inputOptions = new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				"./a.png": "Ko",
				"./b.png": "Han",
				"./c.png": "Chen",
				'./d.jpg': "Tsai",
			});
		}, 4500);
	});
	
	const { value: color } = await Swal.fire({
		title: "Select Avatar",
		input: "radio",
		inputOptions: inputOptions,
		inputValidator: (value) => {
			if (!value) {
				return "請選擇!";
			}
		},
	});
	if (color === "./a.png") {
		$(".block").attr('src',`${color}`)
		Swal.fire({ html: `垃圾不分藍綠!` });
	}else if(color==="./b.png") {
		$(".block").attr('src',`${color}`)
		Swal.fire({ html: `可憐哪!` });
	}else if (color ==='./c.png') {
		$(".block").attr('src',`${color}`)
		Swal.fire({ html: `我負責!` });
	}else{
		$(".block").attr('src',`${color}`)
		Swal.fire({ html: `去跟你老闆說阿!` });
	}

	let blockId = 0;
	const blockTimer = setInterval(function () {
		if ($(".block").length < 15) {
			for (let i = 0; i < rand(5); i++) {
				$(`<img class='block' id="block${blockId}" style="left: ${rand(
						$(".box").width() - 50
					)}px; top: ${rand(250)}px" src=${color}>`
				).appendTo(".box");
				moveBlock(blockId);
				blockId++;
			}
		}
	}, 100);

	$('.title').hide();
	$(".controller").hide();
	$(".planeArea").addClass("boundary");
	

	// reset
	clock = 0;
	score = 0;
	
	$("#score").text(score);
	

	
	$(".planeArea").on("mousemove", function (e) {
		mouseX = e.offsetX;
		mouseY = e.offsetY + 400;
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
							.addClass("boom").css(
								"background",
								"url('./boom.png') no-repeat center/80% "
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
			`${($(".countdown").width() * clock) / 300}px`
		);


		if (clock > 300) {
			clearInterval(blockTimer)
			clearInterval(timer);
			clearInterval(deterTimer);
			clearInterval(fireTimer);
			$(".planeArea").removeClass("boundary");
			$(".planeArea").off();
			$(".block").remove();
			
			$(".highScore").show();
			$(".controller").show();
			$(".block").show();
			$(".title").show();


			if (score > highScore_plane) {
				highScore_plane = score;
				$(".highScore span").text(highScore_plane);
				localStorage.setItem("highScore_plane", highScore_plane);
				$(".block").remove()
				Swal.fire(
					'新高分!',
					'你超ㄅㄧㄤˋ的啦!',
					'success',
				)
			}
		}
	}, 100);
}

