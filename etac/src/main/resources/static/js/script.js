/* Optimized script.js */
$(function () {
	// Stellar parallax configuration
	$(window).stellar({
		horizontalScrolling: false
	});

	// Smooth scrolling for navigation links
	$('.main-nav a:not(.dropdown-toggle)').on('click', function(event) {
		event.preventDefault();
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
	});

	// Fun Fact counter animation
	$('.st-ff-count').appear();
	$(document.body).on('appear', '.st-ff-count', function(e, $affected) {
		$affected.each(function() {
			if (parseInt($(this).data('runit'))) {
				$(this).countTo({
					speed: 3000,
					refreshInterval: 50
				});
				$(this).data('runit', "0");
			}
		});
	});

	// Initialize tooltips
	$('[data-toggle="tooltip"]').tooltip();

	// Dynamic home height calculation
	function home_height() {
		var element = $('.st-home-unit'),
			elemHeight = element.height(),
			winHeight = $(window).height(),
			padding = (winHeight - elemHeight - 200) / 2;

		padding = Math.max(0, padding);
		element.css('padding', padding + 'px 0');
	}

	// Call once on load and on resize
	home_height();
	$(window).on('resize', home_height);

	// Scroll effects for opacity and navbar
	var fadeStart = $(window).height() / 3,
		fadeUntil = $(window).height(),
		fading = $('.st-home-unit');

	$(window).on('scroll', function() {
		var offset = $(document).scrollTop(),
			opacity = 0;

		if (offset <= fadeStart) {
			opacity = 1;
		} else if (offset <= fadeUntil) {
			opacity = 1 - offset / fadeUntil;
		}

		fading.css('opacity', opacity);

		// Navbar mini class toggle
		$('.st-navbar')[offset >= 120 ? 'addClass' : 'removeClass']("st-navbar-mini");
	});

	// Testimonials carousel
	$(".testimonials-carousel ul").owlCarousel({
		items: 1,
		navigation: false,
		pagination: true,
		singleItem: true,
		autoPlay: true,
		navigationText: ['<i class="ct-etp etp-arrow-left7"></i>', '<i class="ct-etp etp-arrow-right8"></i>'],
		transitionStyle: "backSlide"
	});

	// Clients carousel
	$(".clients-carousel").owlCarousel({
		items: 5,
		pagination: false,
		navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		autoPlay: true,
		navigation: true
	});

	// Portfolio filters
	$('#filter').on('click', 'label', function() {
		var $this = $(this);
		if ($this.find('input').val() === 'all') {
			$('.grid .portfolio-item').removeClass('hide');
		} else {
			$('.grid .portfolio-item').each(function() {
				var groups = $(this).data('groups');
				if (groups.indexOf($this.find('input').val()) === -1) {
					$(this).addClass('hide');
				} else {
					$(this).removeClass('hide');
				}
			});
		}
	});

	// Initialize Nice Scroll with performance options
	$("html").niceScroll({
		cursorwidth: 8,
		cursorborder: "0px solid #fff",
		cursorborderradius: '0',
		scrollspeed: 100,
		mousescrollstep: 60,
		hwacceleration: true,
		bouncescroll: false
	});

	// Lazy load images
	[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
		if ('IntersectionObserver' in window) {
			var observer = new IntersectionObserver(function(entries) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						img.src = img.getAttribute('data-src');
						observer.unobserve(img);
					}
				});
			});
			observer.observe(img);
		} else {
			// Fallback for older browsers
			img.src = img.getAttribute('data-src');
		}
	});

	// Xử lý hiển thị loading cho nút submit form
	$('.contact-form').on('submit', function() {
		var $sendBtn = $('#send');
		$sendBtn.button('loading');
		// Cho phép form submit bình thường (không gọi e.preventDefault())
		console.log('Form đang được submit...');
		return true; // Đảm bảo form sẽ được submit
	});

	// Subscribe form
	$('.subscribe-form').on('submit', function(e) {
		e.preventDefault();
		var $form = $(this);
		var $email = $('#mc-email');
		var $result = $('.subscribe-result');

		$.ajax({
			type: 'POST',
			url: $form.attr('action'),
			data: $form.serialize(),
			dataType: 'json',
			success: function(data) {
				$result.html('<p class="alert alert-success">' + data.message + '</p>');
				$email.val('');
			},
			error: function() {
				$result.html('<p class="alert alert-danger">Có lỗi xảy ra, vui lòng thử lại sau.</p>');
			}
		});
	});
});