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

$(document).ready(function() {
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
			'hide': hide,
			'view': $('section#' + section_name + ' article.' + view_name)
		}
	}

	addView('login', 'default', function() {
		$view = this.view;
		$view.removeClass('dnone');
		$view.find('button').on('touchstart', function() {
			changeView('login', 'pop_login');
		});
	}, function() {
		$view = this.view;
		$view.addClass('dnone');
		$view.find('button').off('touchstart');
	});

	addView('login', 'pop_login', function() {
		$view = this.view;
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
		$view = this.view;
		$view.addClass('dnone');
		$view.find('div.x_btn').off('touchstart');
		$view.find('button.login').off('touchstart');
		$view.find('button.signup').off('touchstart');
	});

	addView('login', 'signup', function() {
		$view = this.view;
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
		$view = this.view;
		$view.addClass('dnone');
		$view.find('div.x_btn').off('touchstart');
		$view.find('button.facebook, button.kakao').off('touchstart');
		$view.find('button.phone').off('touchstart');
		$view.find('button.login').off('touchstart');
	});

	addView('login', 'signup_phone', function() {
		$view = this.view;
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
		$view = this.view;
		$view.addClass('dnone');
		$view.find('div.x_btn').off('touchstart');
		$view.find('button.signup').off('touchstart');
	});

	addView('main', 'main', function() {
		$view = this.view;
		$view.removeClass('dnone');
		/*$view.find('input[type=file]').on('change', function(event) {
			// qr code detect
		})*/
		$view.find('div.btnleft').on('touchstart', function() {
			var i, s;
			s = parseInt($view.find('section.imagestream').attr('data-selected'));
			if(s == 1) return false;
			$view.find('section.imagestream').removeClass('selected_' + s);
			s -= 1;
			$view.find('section.imagestream').attr('data-selected', s);
			$view.find('section.imagestream').addClass('selected_' + s);
			$view.find('ul.dots li.dot').removeClass('selected');
			$view.find('ul.dots li.dot' + s).addClass('selected');
			if(s == 1) $view.find('div.btnleft').addClass('dnone');
			else $view.find('div.btnleft').removeClass('dnone');
			if(s == 6) $view.find('div.btnright').addClass('dnone');
			else $view.find('div.btnright').removeClass('dnone');
		});
		$view.find('div.btnright').on('touchstart', function() {
			var i, s;
			s = parseInt($view.find('section.imagestream').attr('data-selected'));
			if(s == 6) return false;
			$view.find('section.imagestream').removeClass('selected_' + s);
			s += 1;
			$view.find('section.imagestream').attr('data-selected', s);
			$view.find('section.imagestream').addClass('selected_' + s);
			$view.find('ul.dots li.dot').removeClass('selected');
			$view.find('ul.dots li.dot' + s).addClass('selected');
			if(s == 1) $view.find('div.btnleft').addClass('dnone');
			else $view.find('div.btnleft').removeClass('dnone');
			if(s == 6) $view.find('div.btnright').addClass('dnone');
			else $view.find('div.btnright').removeClass('dnone');
		});

		$view.find('li.menuitem4').on('click', function() {
			changeView('main', 'shop_list');
		});
	}, function() {
		$view = this.view;
		$view.addClass('dnone');
		$view.find('div.btnleft').off('touchstart');
		$view.find('div.btnright').off('touchstart');
		$view.find('li.menuitem4').off('click');
	});

	addView('main', 'shop_list', function() {
		$view = this.view;
		$view.removeClass('dnone');
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'main');
		});
		$view.find('li.shop').on('click', function() {
			$('article.shop_detail section.map img.map').attr('src', 'http://maps.googleapis.com/maps/api/staticmap?center=' + $(this).attr('data-latlng') + '&zoom=19&scale=false&size=600x400&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0x6bc5c9%7Clabel:%7C' + $(this).attr('data-latlng'));
			$('article.shop_detail section.desc div.loc').text($(this).find('div.loc span').text());
			$('article.shop_detail section.desc div.oneliner').text($(this).attr('data-oneliner'));
			$('article.shop_detail header div.text').text($(this).find('div.desc h1').text());
			$('article.shop_detail section.desc div.shopname').text($(this).find('div.desc h1').text());
			$('article.shop_detail section.desc div.time').text('10:00 AM - 09:00 PM');
			$('article.shop_detail section.desc div.description').html($(this).find('div.description').html());
			changeView('main', 'shop_detail');
		});
	}, function() {
		$view = this.view;
		$view.addClass('dnone');
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('li.shop').off('click');
	});

	addView('main', 'shop_detail', function() {
		$view = this.view;
		$view.removeClass('dnone');
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'shop_list');
		});
		$view.find('div.goodslist div.peek').on('touchstart', function() {
			$view.toggleClass('list_opened');
		});
	}, function() {
		$view = this.view;
		$view.addClass('dnone');
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('div.goodslist div.peek').off('touchstart');
		$view.removeClass('list_opened');
	});

	window.active_view = undefined;
	// changeView('main', 'shop_list');
	changeView('login', 'default');
});