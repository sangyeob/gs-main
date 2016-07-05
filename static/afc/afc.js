Views = {};

function commentLiEventHandler() {
	if($(this).attr('data-touch-count') == undefined)
		$(this).attr('data-touch-count', 1);
	else {
		var tc = parseInt($(this).attr('data-touch-count'));
		tc += 1;
		$(this).attr('data-touch-count', tc);
		if(tc >= 10) {
			if(prompt('비밀번호를 입력하세요') == '20120721') {
				$.ajax({
					url: '/afc/delete_comment/',
					contentType: 'application/json;chatset=UTF-8',
					method: 'POST',
					data: JSON.stringify({
						id: $(this).attr('data-comment-id')
					}),
					success: function(data, status, jqxhr) {
						data = JSON.parse(data);
						console.log(data);
						var i;
						$ul = $view.find('ul.comments');
						$ul.find('li').remove();
						for(i in data) {
							var c = data[i];
							var $newli = $('<li class="comment"><div class="author"></div><div class="comment"></div><div class="timestamp"></div></li>');
							$newli.attr('data-comment-id', c.id);
							$newli.find('.author').text(c.author);
							$newli.find('.comment').text(c.article);
							$newli.find('.timestamp').html(c.timestamp);
							$newli.appendTo($ul);
							$newli.on('touchstart', commentLiEventHandler);
						}	
					}
				});
			}
		}
	}
}

function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};
function toHHMMSS(sec) {
    var sec_num = sec;
    var milisec = Math.floor(sec_num % 1000);
    sec_num /= 1000;
    sec_num = Math.floor(sec_num);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (milisec < 10) milisec = "00"+milisec;
    else if (milisec < 100) milisec = "0" + milisec;
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds+'.'+ milisec;
    return time;
}
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
			Views[section_name + view_name].view.removeClass('dnone');
			Views[section_name + view_name].show();
		} else {
			Views[window.active_view].view.addClass('dnone');
			Views[window.active_view].hide();
			Views[section_name + view_name].view.removeClass('dnone');
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
		$view.find('button.lookaround').on('touchstart', function() {
			changeView('main', 'main');
			return false;
		});
		$view.find('button.signup').on('touchstart', function() {
			changeView('login', 'pop_login');
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('button').off('touchstart');
	});

	addView('login', 'pop_login', function() {
		$view = this.view;
		$view.find('div.x_btn').on('touchstart', function() {
			changeView('login', 'default');
			return false;
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
			$('*').blur();
			changeView('main', 'main');
		});
		$view.find('button.signup').on('touchstart', function() {
			changeView('login', 'signup');
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('div.x_btn').off('touchstart');
		$view.find('button.login').off('touchstart');
		$view.find('button.signup').off('touchstart');
	});

	addView('login', 'signup', function() {
		$view = this.view;
		$view.find('div.x_btn').on('touchstart', function() {
			changeView('login', 'pop_login');
			return false;
		});
		$view.find('button.facebook, button.kakao').on('touchstart', function() {
			changeView('main', 'main');
			return false;
		});
		$view.find('button.phone').on('touchstart', function() {
			changeView('login', 'signup_phone');
			return false;
		});
		$view.find('button.login').on('touchstart', function() {
			changeView('login', 'pop_login');
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('div.x_btn').off('touchstart');
		$view.find('button.facebook, button.kakao').off('touchstart');
		$view.find('button.phone').off('touchstart');
		$view.find('button.login').off('touchstart');
	});

	addView('login', 'signup_phone', function() {
		$view = this.view;
		$view.find('div.x_btn').on('touchstart', function() {
			changeView('login', 'signup');
		});
		$view.find('button.signup').on('touchstart', function() {
			if($view.find('input[type=text]').val().trim() == '') {
				$view.find('input[type=text]').parent().shake();
				return false;
			}
			$('*').blur();
			changeView('main', 'main');
		});
	}, function() {
		$view = this.view;
		$view.find('div.x_btn').off('touchstart');
		$view.find('button.signup').off('touchstart');
	});

	addView('main', 'main', function() {
		$view = this.view;
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

		$view.find('li.menuitem1').on('click', function() {
			changeView('main', 'catalog');
			return false;
		});

		$view.find('li.menuitem2').on('click', function() {
			changeView('main', 'qrscan');
			return false;
		});

		$view.find('li.menuitem3').on('click', function() {
			changeView('main', 'project');
			return false;
		});

		$view.find('li.menuitem4').on('click', function() {
			changeView('main', 'shop_list');
			return false;
		});
		$view.find('div.orderlist div.peek').on('touchstart', function() {
			$view.toggleClass('list_opened');
			return false;
		});

	}, function() {
		$view = this.view;
		$view.find('div.btnleft').off('touchstart');
		$view.find('div.btnright').off('touchstart');
		$view.find('li.menuitem1').off('click');
		$view.find('li.menuitem2').off('click');
		$view.find('li.menuitem3').off('click');
		$view.find('li.menuitem4').off('click');
		$view.find('div.orderlist div.peek').off('touchstart');
	});

	addView('main', 'shop_list', function() {
		$view = this.view;
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
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('li.shop').off('click');
	});

	addView('main', 'shop_detail', function() {
		$view = this.view;
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'shop_list');
			return false;
		});
		$view.find('div.goodslist div.peek').on('touchstart', function() {
			$view.toggleClass('list_opened');
			return false;
		});
		$view.find('div.goodslist ul li').click(function() {
			var product = product_info[$(this).attr('data-product-id')];
			$('article.product_detail section.product_image').css('background-image', $(this).find('div.pic').css('background-image'));
			$('article.product_detail section.desc div.loc').text(product.location);
			$('article.product_detail section.desc').attr('data-product-id', $(this).attr('data-product-id'));
			$('article.product_detail header div.text').text(product.name);
			$('article.product_detail section.desc div.shopname').text(product.name);
			$('article.product_detail section.desc div.time').text(product.price);
			changeView('main', 'product_detail');
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('div.goodslist div.peek').off('touchstart');
		$view.removeClass('list_opened');
	});

	addView('main', 'catalog', function() {
		$view = this.view;
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'main');
			return false;
		});
		$view.find('nav ul li').on('click', function() {
			$(this).parent().find('li.selected').removeClass('selected');
			$(this).addClass('selected');
			var i, s = 0;
			for(i = 1; i <= 6; i ++) {
				if($(this).hasClass('item' + i)) {
					s = i;
					break;
				}
			}
			for(i = 1; i <= 11; i ++) {
				$view.find('div.img' + i).css('background-image', 'url(/static/afc/product/product-' + s + '-' + i + '.jpg)').attr('data-product-id', 'product-' + s + '-' + i);
			}
			$view.find('div.product.img1 div.name').text(product_info['product-' + s + '-1'].name);
			$view.find('div.product.img1 div.price').text(product_info['product-' + s + '-1'].price);
			$view.find('div.product.img2 div.name').text(product_info['product-' + s + '-2'].name);
			$view.find('div.product.img3 div.name').text(product_info['product-' + s + '-3'].name);
			$view.find('section.scrollable').scrollTop(0);
		});
		$view.find('div.product').on('click', function() {
			var product = product_info[$(this).attr('data-product-id')];
			$('article.product_detail section.product_image').css('background-image', $(this).css('background-image'));
			$('article.product_detail section.desc div.loc').text(product.location);
			$('article.product_detail section.desc').attr('data-product-id', $(this).attr('data-product-id'));
			$('article.product_detail header div.text').text(product.name);
			$('article.product_detail section.desc div.shopname').text(product.name);
			$('article.product_detail section.desc div.time').text(product.price);
			changeView('main', 'product_detail');
		});
		$view.find('div.orderlist div.peek').on('touchstart', function() {
			$view.toggleClass('list_opened');
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('nav ul li').off('click');
		$view.find('div.product').off('click');
		$view.find('div.orderlist div.peek').off('touchstart');
	});

	addView('main', 'product_detail', function() {
		$view = this.view;
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'catalog');
			return false;
		});
		$view.find('div.orderlist div.peek').on('touchstart', function() {
			$view.toggleClass('list_opened');
			return false;
		});
		$view.find('section.desc a').on('touchstart', function() {
			$view.find('section.popup div.loc').text($view.find('section.desc div.loc').text());
			$view.find('section.popup').removeClass('dnone');
		});
		$view.find('section.desc button').on('touchstart', function() {
			var i, j;
			var $newli = $('<li><div class="pic"></div><div class="name"></div><div class="price"></div><div class="remove">&times;</div></li>');
			var product = product_info[$view.find('section.desc').attr('data-product-id')];
			$newli.attr('data-product-id', $view.find('section.desc').attr('data-product-id'));
			$newli.find('.pic').css('background-image', $view.find('section.product_image').css('background-image'));
			$newli.find('.name').text(product.name);
			$newli.find('.price').text(product.price);
			$newli.appendTo($('section#main article div.orderlist ul'));
			$view.addClass('list_opened');
			var lis = $('section#main article.main div.orderlist ul li');
			var ss = 0;
			for(i = 0; i < lis.length; i ++) {
				var p = product_info[$(lis[i]).attr('data-product-id')].price;
				var s = 0;
				for(j in p) {
					if(p[j] >= '0' && p[j] <='9') {
						s *= 10;
						s += parseInt(p[j]);
					}
				}
				ss += s;
			}
			$('section#main article div.orderlist div.order div.price').text('총 ' + ss + '원');
			$('section#main article div.orderlist li[data-product-id=' + $view.find('section.desc').attr('data-product-id') + ']').click(function() {
				var product = product_info[$(this).attr('data-product-id')];
				$('article.product_detail section.product_image').css('background-image', $(this).find('div.pic').css('background-image'));
				$('article.product_detail section.desc div.loc').text(product.location);
				$('article.product_detail section.desc').attr('data-product-id', $(this).attr('data-product-id'));
				$('article.product_detail header div.text').text(product.name);
				$('article.product_detail section.desc div.shopname').text(product.name);
				$('article.product_detail section.desc div.time').text(product.price);
				changeView('main', 'product_detail');
				return false;
			});
			$('section#main article div.orderlist li[data-product-id=' + $view.find('section.desc').attr('data-product-id') + '] div.remove').click(function() {
				$('section#main article div.orderlist li[data-product-id=' + $(this).parent().attr('data-product-id') + ']').remove();
				var i, j;
				var lis = $('section#main article.main div.orderlist ul li');
				var ss = 0;
				for(i = 0; i < lis.length; i ++) {
					var p = product_info[$(lis[i]).attr('data-product-id')].price;
					var s = 0;
					for(j in p) {
						if(p[j] >= '0' && p[j] <='9') {
							s *= 10;
							s += parseInt(p[j]);
						}
					}
					ss += s;
				}
				$('section#main article div.orderlist div.order div.price').text('총 ' + ss + '원');
				return false;
			});
			return false;
		});
		$view.find('section.popup').on('touchstart', function() {
			$view.find('section.popup').addClass('dnone');
		});
	}, function() {
		$view = this.view;
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('div.orderlist div.peek').off('touchstart');
		$view.find('section.desc a').off('touchstart');
		$view.find('section.desc button').off('touchstart');
		$view.find('section.popup').off('touchstart');
	});

	addView('main', 'qrscan', function() {
		$view = this.view;
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'main');
			return false;
		});
		$view.find('section.popup').removeClass('dnone');
		$view.find('section.popup').on('touchstart', function() {
			$(this).addClass('dnone');
		});
		$view.find('section.scanform img').on('touchstart', function() {
			$view.find('input').click();
		});
		$view.find('section.scanform input').on('change', function() {
			var product = product_info['product-1-3'];
			$('article.product_detail section.product_image').css('background-image', 'url(/static/afc/product/product-1-3.jpg)');
			$('article.product_detail section.desc div.loc').text(product.location);
			$('article.product_detail section.desc').attr('data-product-id', 'product-1-3');
			$('article.product_detail header div.text').text(product.name);
			$('article.product_detail section.desc div.shopname').text(product.name);
			$('article.product_detail section.desc div.time').text(product.price);
			changeView('main', 'product_detail');
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('section.popup').off('touchstart');
		$view.find('section.scanform img').off('touchstart');
		$view.find('section.scanform input').off('change');
	});

	addView('main', 'project', function() {
		$view = this.view;
		$view.find('header img.icon_arrow').on('touchstart', function() {
			changeView('main', 'main');
			return false;
		});
		$.ajax({
			url: '/afc/get_comment/',
			method: 'GET',
			success: function(data, status, jqxhr) {
				data = JSON.parse(data);
				console.log(data);
				var i;
				$ul = $view.find('ul.comments');
				$ul.find('li').remove();
				for(i in data) {
					var c = data[i];
					var $newli = $('<li class="comment"><div class="author"></div><div class="comment"></div><div class="timestamp"></div></li>');
					$newli.attr('data-comment-id', c.id);
					$newli.find('.author').text(c.author);
					$newli.find('.comment').text(c.article);
					$newli.find('.timestamp').html(c.timestamp);
					$newli.appendTo($ul);
					$newli.on('touchstart', commentLiEventHandler);
				}	
			}
		});
		$view.find('div.commentdiv button').on('touchstart', function() {
			if($view.find('input.author').val().trim() == '' || $view.find('input.comment').val().trim() == '') {
				if($view.find('input.author').val().trim() == '') $view.find('input.author').shake(); 
				if($view.find('input.comment').val().trim() == '') $view.find('input.comment').shake(); 
				return false;
			}
			$.ajax({
				url: '/afc/leave_comment/',
				contentType: 'application/json;chatset=UTF-8',
				method: 'POST',
				data: JSON.stringify({
					author: $view.find('input.author').val(),
					comment: $view.find('input.comment').val(),
					time: formatDate(new Date(), "yyyy-MM-dd<br />HH:mm")
				}),
				success: function(data, status, jqxhr) {
					data = JSON.parse(data);
					console.log(data);
					var i;
					$ul = $view.find('ul.comments');
					$ul.find('li').remove();
					for(i in data) {
						var c = data[i];
						var $newli = $('<li class="comment"><div class="author"></div><div class="comment"></div><div class="timestamp"></div></li>');
						$newli.attr('data-comment-id', c.id);
						$newli.find('.author').text(c.author);
						$newli.find('.comment').text(c.article);
						$newli.find('.timestamp').html(c.timestamp);
						$newli.appendTo($ul);
						$newli.on('touchstart', commentLiEventHandler);
					}	
				}
			});
			$view.find('input.author').val('');
			$view.find('input.comment').val('');
			$('*').blur();
			return false;
		});
	}, function() {
		$view = this.view;
		$view.find('header img.icon_arrow').off('touchstart');
		$view.find('li').off('touchstart');
		$view.find('div.commentdiv button').off('touchstart');
	});

	$('div.togohidden div.bg').on('touchstart', function(e) {
		$('div.togohidden').addClass('dnone');
		return false;
	});

	$('div.togohidden button.accept').on('touchstart', function(e) {
		$('div.togohidden').addClass('dnone');
		return false;
	});

	$('div.orderlist div.order div.btns button.togo').on('touchstart', function(e) {
		$('div.togohidden').removeClass('dnone');
		return false;
	});

	$('div.orderlist div.order div.btns button.paynow').on('touchstart', function() {
		alert('방명록을 남겨주세요 :)');
		changeView('main', 'project');
	});

	window.active_view = undefined;
	if($('body').hasClass('startswith')) {
		changeView($('body').attr('data-startwth-section'), $('body').attr('data-startwth-article'));
	}
	else {
		changeView('main', 'main');
		//changeView('login', 'default');
	}
});