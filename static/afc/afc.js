Views = {};

function changeView(section_name, view_name) {
	Views[window.active_view].hide();
	Views[section_name + view_name].show();
	if(Views[window.active_view].section != section_name) {
		$('section#' + Views[window.active_view].section).addClass('dnone');
		$('section#' + section_name).removeClass('dnone');
	}
	window.active_view = section_name + view_name;
}

function addView(section_name, view_name, show, hide) {
	Views[section_name + view_name] = {
		'section': section_name,
		'article': view_name,
		'show': show,
		'hide': hide
	}
}


/*
#add view default

addView('SECTION_NAME', 'VIEW_NAME', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
});

*/

addView('login', 'default', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
	$view.find('button').on('touchstart', function() {
		changeView('login', 'pop_login');
	});
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
	$view.find('button').off('touchstart');
});

addView('login', 'pop_login', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
	$view.find('div.x_btn').on('touchstart', function() {
		changeView('login', 'default');
	});
	$view.find('button.login').on('touchstart', function() {
		changeView('main', 'main');
	});
	$view.find('button.signup').on('touchstart', function() {
		changeView('login', 'signup');
	});
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
	$view.find('button.x_btn').off('touchstart');
	$view.find('button.login').off('touchstart');
	$view.find('button.signup').off('touchstart');
});

addView('login', 'signup', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
	$view.find('div.x_btn').on('touchstart', function() {
		changeView('login', 'pop_login');
	});
	$view.find('button.facebook, button.kakao').on('touchstart', function() {
		changeView('main', 'main');
	});
	$view.find('button.phone').on('touchstart', function() {
		changeView('login', 'signup_phone');
	});
	$view.find('button.login').on('touchstart', function() {
		changeView('login', 'pop_login');
	});
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
	$view.find('button.x_btn').off('touchstart');
	$view.find('button.facebook, button.kakao').off('touchstart');
	$view.find('button.phone').off('touchstart');
	$view.find('button.login').off('touchstart');
});

addView('login', 'signup_phone', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
});

addView('main', 'main', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
});

$(document).ready(function() {
	Views['logindefault'].show();
	window.active_view = 'logindefault';
});