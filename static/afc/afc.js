Views = {};

(function ($) {
    $.fn.shake = function (options) {
        // defaults
        var settings = {
            'shakes': 2,
            'distance': 10,
            'duration': 200
        };
        // merge options
        if (options) {
            $.extend(settings, options);
        }
        // make it so
        var pos;
        return this.each(function () {
            $this = $(this);
            // position if necessary
            pos = $this.css('position');
            if (!pos || pos === 'static') {
                $this.css('position', 'relative');
            }
            // shake it
            for (var x = 1; x <= settings.shakes; x++) {
                $this.animate({ left: settings.distance * -1 }, (settings.duration / settings.shakes) / 4)
                    .animate({ left: settings.distance }, (settings.duration / settings.shakes) / 2)
                    .animate({ left: 0 }, (settings.duration / settings.shakes) / 4);
            }
        });
    };
}(jQuery));

function changeView(section_name, view_name) {
	if(window.active_view == undefined) {
		$('section#' + section_name).removeClass('dnone');
		Views[section_name + view_name].show();
	} else {
		Views[window.active_view].hide();
		Views[section_name + view_name].show();
		if(Views[window.active_view].section != section_name) {
			$('section#' + Views[window.active_view].section).addClass('dnone');
			$('section#' + section_name).removeClass('dnone');
		}
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
		if($view.find('input[type=text]').val().trim() == '' || $view.find('input[type=password]').val().trim() == '') {
			if($view.find('input[type=text]').val().trim() == '') {
				$view.find('input[type=text]').parent().shake();
			}
			if($view.find('input[type=password]').val().trim() == '') {
				$view.find('input[type=password]').parent().shake();
			}
			return false;
		}
		changeView('main', 'main');
	});
	$view.find('button.signup').on('touchstart', function() {
		changeView('login', 'signup');
	});
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
	$view.find('div.x_btn').off('touchstart');
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
	$view.find('div.x_btn').off('touchstart');
	$view.find('button.facebook, button.kakao').off('touchstart');
	$view.find('button.phone').off('touchstart');
	$view.find('button.login').off('touchstart');
});

addView('login', 'signup_phone', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
	$view.find('div.x_btn').on('touchstart', function() {
		changeView('login', 'signup');
	});
	$view.find('button.signup').on('touchstart', function() {
		if($view.find('input[type=text]').val().trim() == '') {
			$view.find('input[type=text]').parent().shake();
			return false;
		}
		changeView('main', 'main');
	});
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
	$view.find('div.x_btn').off('touchstart');
	$view.find('button.signup').off('touchstart');
});

addView('main', 'main', function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.removeClass('dnone');
	/*$view.find('input[type=file]').on('change', function(event) {
		// qr code detect
	})*/
	$view.find('div.btnleft').on('touchstart', function() {
		var i, s;
		for(i = 1; i <= 6; i ++)
			if($view.find('article.image.selected').hasClass('image' + i))
				s = i;
		if(s == 1) return false;
		else s -= 1;
		$view.find('article.image.selected').removeClass('selected');
		$view.find('article.image' + s).addClass('selected');
		$view.find('ul.dots li.dot').removeClass('selected');
		$view.find('ul.dots li.dot' + s).addClass('selected');
	});
	$view.find('div.btnright').on('touchstart', function() {
		var i, s;
		for(i = 1; i <= 6; i ++)
			if($view.find('article.image.selected').hasClass('image' + i))
				s = i;
		if(s == 6) return false;
		else s += 1;
		$view.find('article.image.selected').removeClass('selected');
		$view.find('article.image' + s).addClass('selected');
		$view.find('ul.dots li.dot').removeClass('selected');
		$view.find('ul.dots li.dot' + s).addClass('selected');
	});
}, function() {
	$view = $('section#' + this.section + ' article.' + this.article);
	$view.addClass('dnone');
});

$(document).ready(function() {
	window.active_view = undefined;
	changeView('login', 'default');
});