$('a').click(function(e) {
	e.preventDefault();
});

$('.widget-attivi').click(function(e) {
	e.preventDefault();
});

$('.menu-f1').click(function() {
	$('#blocco-menu-f1').fadeIn(500, function() {
		$('#blocco-menu-f1').addClass('espanso');
	});
});

$(document).click(function() {
	if ($('#blocco-menu-f1').hasClass("espanso")) {
		$('#blocco-menu-f1').fadeOut(500, function() {
			$('#blocco-menu-f1').removeClass('espanso');
		});
	};
});

$('.actmenu').click(function() {
	$('#menudx').toggleClass('opened');
	$(this).toggleClass('close');
	$('.imgopen').toggleClass('nascondi');
	$('.imgclose').toggleClass('nascondi');
});
$('.actmenu-top').click(function() {
	$('#menutop').toggleClass('opened');
	$(this).toggleClass('close');
	$('.imgopen-top').toggleClass('nascondi');
	$('.imgclose-top').toggleClass('nascondi');
});

/* $('.block').click(function() {
 var bclass = $(this).attr('rel');
 $('#logo_r').attr('class', bclass);
 }); */

function get_browser_info() {
	var ua = navigator.userAgent,
	    tem,
	    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return {
			name : 'IE',
			version : (tem[1] || '')
		};
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/);
		if (tem != null) {
			return {
				name : 'Opera',
				version : tem[1]
			};
		}
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if (( tem = ua.match(/version\/(\d+)/i)) != null) {
		M.splice(1, 1, tem[1]);
	}
	return {
		name : M[0],
		version : M[1]
	};
};

var browser = get_browser_info();
// browser.name = 'Chrome'
// browser.version = '40'

var vh = window.innerHeight;
var vw = window.innerWidth;

if (browser.name == "Safari" && browser.version < 9 && vw > 800) {
	var b1w = (vw - 50) * 0.618181818181818;

	var b2h = vh * 0.617647058823529;

	var b3w = vw * 0.236363636363636;

	var b4h = vh * 0.235294117647059;

	var b5w = vw * 0.090909090909091;

	$('.blocco-2').css({
		"height" : b2h
	});
	$('.blocco-1').css({
		"width" : b1w
	});
	$('.blocco-3').css({
		"width" : b3w
	});
	$('.blocco-4').css({
		"height" : b4h
	});
	$('.blocco-5').css({
		"width" : b5w
	});
};

$(window).on('resize', function() {
	var vh = window.innerHeight;
	var vw = window.innerWidth;

	if (browser.name == "Safari" && browser.version < 9 && vw >= 800) {

		var b1w = (vw - 50) * 0.618181818181818;

		var b2h = vh * 0.617647058823529;

		var b3w = vw * 0.236363636363636;

		var b4h = vh * 0.235294117647059;

		var b5w = vw * 0.090909090909091;

		$('.blocco-2').css({
			"height" : b2h
		});
		$('.blocco-1').css({
			"width" : b1w
		});
		$('.blocco-3').css({
			"width" : b3w
		});
		$('.blocco-4').css({
			"height" : b4h
		});
		$('.blocco-5').css({
			"width" : b5w
		});
	} else if (browser.name == "Safari" && browser.version < 9 && vw < 800) {
		$('.blocco-1').css({
			"width" : "100%"
		});
		$('.blocco-3').css({
			"width" : "100%"
		});
		$('.blocco-5').css({
			"width" : "100%"
		});
	}
});
