$inputpass = '';
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
function notify(str) {
	$('div.notif').text(str).animate({'top': 0}, 200, function() {
		setTimeout(function() {
			$('div.notif').animate({'top': '-10vw'}, 500, function() {
				$(this).text('');
				$('div.logtime').removeClass('tempdisabled');
			});
		}, 2000);
	});
}
function updateInputpass() {
	$('div.dots').addClass('lock');
	for(i = 1; i <= 4; i ++) {
		if(i <= $inputpass.length)
			$('div.dots div.dot' + i).addClass('filled');
		else
			$('div.dots div.dot' + i).removeClass('filled');
	}
	if($inputpass.length >= 4) {
		$('div.keypad').removeClass('free').addClass('lock');
		setTimeout(function() {
			if(parseInt($inputpass) == $pw) {
				$('div.password').animate({'top': '-70vh', 'opacity': '0'}, 500, function() {
					$(this).css({
						'top': '0',
						'opacity': '1',
						'display': 'none'
					});
					notify($name + '님 반갑습니다!');
				});
			}
			else {
				$inputpass = '';
				updateInputpass();
				$('div.password div.caption').text('다시 시도해 주세요').shake();
				$('div.dots').shake();
			}
			$('div.keypad').removeClass('lock').addClass('free');
		}, 500);
	}
}
$(document).ready(function() {
	$posStat = 'outrange';
	$posLat = 37.4822241;
	$posLon = 126.8942008;
	$comment = '';
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
    	showError('GPS disabled');
    }
	setInterval(function() {
		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition, showError);
	    } else {
	    	showError('GPS disabled');
	    }
	}, 10000);
	$ccnt = 0;
    function showPosition(position) {
    	mtlat = 37.4822241; // 마리오타워위치
    	mtlon = 126.8942008;
		//mtlat = 35.4822241; // 외근 테스트용
    	//mtlon = 125.8942008;
    	$posLat = position.coords.latitude;
    	$posLon = position.coords.longitude;
		var p = 0.017453292519943295;    // Math.PI / 180
		var c = Math.cos;
		var a = 0.5 - c((mtlat - position.coords.latitude) * p)/2 + 
		        c(position.coords.latitude * p) * c(mtlat * p) * 
		        (1 - c((mtlon - position.coords.longitude) * p))/2;
		if(12742 * Math.asin(Math.sqrt(a)) > 1) { // 1km 이상
			//if($('body').hasClass('in')) {
			//	updatelog('out');
			//}
			if($('body').hasClass('out')) {
				$('div.logtime').text('외근');
			} else {
				$('div.logtime').text('퇴근');
			}
			$posStat = 'outrange';
		} else {
			if($('body').hasClass('out')) {
				$('div.logtime').text('출근');
			} else {
				$('div.logtime').text('퇴근');
			}
			$posStat = 'inrange';
		}
		$('div.logtime').removeClass('disabled');
	}
	showPosition({ coords: { latitude: 37.4822241, longitude: 126.8942008 }});
	function showError(error) {
		alert(error.code + ' / ' + error.message);
		notify('GPS사용이 불가능합니다.');
		$('div.logtime').text('GPS를 켜주세요!');
		$('div.logtime').addClass('disabled');
	}
	function oigeunPop(message, callback) {
		$('div.oigeunPop div.message').text(message);
		$('div.oigeunPop input').val('');
		$('div.oigeunPop').removeClass('disp-none');
		$('div.oigeunPop div.okay').off('touchstart').on('touchstart', function() {
			if($('div.oigeunPop input').val().trim() == '') {
				$('div.oigeunPop div.message, div.oigeunPop input').shake();
			} else { 
				$('div.oigeunPop').addClass('disp-none');
				callback($('div.oigeunPop input').val());
			}
		});
	}
	function expensePop(message, callback) {
		$('div.expensePop div.message').text(message);
		$('div.expensePop input[type=number]').val('');
		$('div.expensePop').removeClass('disp-none');
		$('div.expensePop input[type=text]').val('').focus();
		$('div.expensePop div.okay').off('touchstart').on('touchstart', function() {
			if($('div.expensePop input[type=text]').val().trim() == '') {
				$('div.expensePop input[type=text]').shake();
			} else if($('div.expensePop input[type=number]').val() == 0) {
				$('div.expensePop input[type=number]').shake();
			} else { 
				$('div.expensePop').addClass('disp-none');
				callback($('div.expensePop input[type=text]').val(), $('div.expensePop input[type=number]').val());
			}
		});
	}
	$('div.oigeunPop div.cancel').on('touchstart', function() {
		$('div.oigeunPop').addClass('disp-none');
	});
	$('div.expensePop div.cancel').on('touchstart', function() {
		$('div.expensePop').addClass('disp-none');
	});
	function updatelog(status) {
		$('.logtime').addClass('tempdisabled');
		$.ajax({
			url: '/intranet/logtime/' + $uid + '/',
			contentType: 'application/json;chatset=UTF-8',
			method: 'POST',
			data: JSON.stringify({
				time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.fff000"),
				status: status,
				lat: $posLat,
				lon: $posLon,
				range: $posStat,
				comment: $comment == '' ? 'None' : $comment
			}),
			success: function(data, status, jqxhr) {
				data = JSON.parse(data);
				if(data.result == 'success') {
					if($('body').hasClass('out')) {
						$('body').removeClass('out').addClass('in');
						$('.logtime').text('퇴근');
						if($posStat == 'inrange') {
							notify($name + '님 오늘도 열심히 일해요!');
						} else {
							notify($name + '님 밖에서도 열심히 일해요!');
						}
					} else {
						$('body').removeClass('in').addClass('out');
						if($posStat == 'outrange') {
							$('.logtime').text('외근');
						} else {
							$('.logtime').text('출근');
						}
						notify('수고하셨습니다. 안녕히가세요!');
					}
					$totalsec = data.totalsec;
					$totalsecmonth = data.totalsecmonth;
					$last = new Date(data.last);
					updateTime($totalsec);
				}
				else {
					location.reload();
				}
				loggedIn = Date.now();
			}
		});
	}
	$('div.keypad .btn').on('touchstart', function() {
		if($('div.keypad').hasClass('lock')) return false;
		if($(this).hasClass('btn-num')) {
			$inputpass += $(this).attr('data-num');
		} else {
			$inputpass = $inputpass.slice(0, -1);
		}
		updateInputpass();
	});
	$('div.logtime').on('touchstart', function() {
		if($(this).hasClass('tempdisabled')) return false;
		if($(this).hasClass('disabled')) {
			notify('GPS를 켜고 잠시만 기다려주세요.')
			return false;
		}
		$comment = '';
		if($('body').hasClass('in')) {
			updatelog('out');
		}
		else {
			if($posStat == 'outrange') {
				oigeunPop('외근 사유를 적어주세요 :)', function(data) {
					$comment = data;
					updatelog('in');
				});
			} else updatelog('in');
		}
	});
	function inflateStatField(rank, name, time, salary, account, last, datatime, expense) {
		$row = $('<div class="row clearfix"></div>');
		$row.append($('<div class="rank"></div>').text(rank));
		$row.append($('<div class="name"></div>').text(name));
		$row.append($('<div class="time"></div>').text(time).attr('data-last', last).attr('data-time', datatime));
		$row.append($('<div class="salary"></div>').text(salary).attr('data-expense', expense));
		$('div.stat div.dataarea').append($row);
		if(account != '') {
			$row = $('<div class="row clearfix"></div>');
			$row.append($('<div class="account"></div>').text(account));
			$('div.stat div.dataarea').append($row);
		}
	}
	function updateStat(year, month) {
		if($('body').hasClass('updatingStat')) return false;
		$('body').addClass('updatingStat');
		$.ajax({
			url: '/intranet/getstat/' + year + '/' + month + '/',
			contentType: 'application/json;charset=UTF-8',
			method: 'POST',
			data: {
				requestfor: 'monthstatus'
			},
			success: (function(year, month) { return function(data, status, jqxhr) {
				var d = new Date();
				$('body').removeClass('updatingStat');
				data = JSON.parse(data);
				laststated = Date.now();
				$('div.stat').removeClass('disp-none');
				$('div.stat div.dataarea').html('');
				$('div.stat div.dataarea').append($('<div class="title clearfix"><div class="leftbtn">&#171;</div><div class="text"></div><div class="rightbtn">&#187;</div></div>'));
				$('div.stat div.dataarea div.leftbtn').on('touchstart', function() { 
					if($(this).hasClass('opacity0')) return false;
					var newm = month - 1;
					var newy = year;
					if(newm <= 0) newm = 12, newy -= 1;
					updateStat(newy, newm); 
				});
				$('div.stat div.dataarea div.rightbtn').on('touchstart', function() { 
					if($(this).hasClass('opacity0')) return false;
					var newm = month + 1;
					var newy = year;
					if(newm > 12) newm = 1, newy += 1;
					updateStat(newy, newm); 
				});
				if(2016 == year && 5 == month) { $('div.stat div.dataarea div.leftbtn').addClass('opacity0'); }
				if(d.getFullYear() == year && d.getMonth() + 1 == month) { 
					$('div.stat').addClass('updateTime');
					$('div.stat div.dataarea div.rightbtn').addClass('opacity0'); 
				} else {
					$('div.stat').removeClass('updateTime');
				}
				$('div.stat div.text').text(year + '년 ' + month + '월');
				inflateStatField('순위', '이름', '일한 시간', '월급', '', 0);
				$('div.stat div.row').addClass('bb');
				for(i = 0; i < data.length; i ++) {
					inflateStatField((i+1)+'등', 
									 data[i].name, 
									 toHHMMSS(data[i].totalsecmonth), 
									 '₩ ' + (data[i].expense + Math.floor(data[i].totalsecmonth / 100000 / 60 / 60 * $hwage * 12) * 10), 
									 data[i].account,
									 data[i].last,
									 data[i].totalsecmonth,
									 data[i].expense);
				}
				$('div.stat div.dataarea').css('top', 'calc(50vh ' + (13 + 7 * (data.length + 1)) + 'vw)')
			}; })(year, month)
		});
	}
	$('div.btnstat').on('touchstart', function() {
		var d = new Date();
		updateStat(d.getFullYear(), d.getMonth() + 1);
	});
	$('div.stat div.background').on('touchstart', function() {
		$('div.stat').addClass('disp-none');
	});
	$('div.btnreceipt').on('touchstart', function() {
		notify('리포트 기능 준비중입니다 ㅠㅠ');
	});
	$('div.btncoin').on('touchstart', function() {
		expensePop('비목과 금액을 적어주세요!', function(content, amount) {
			$.ajax({
				url: '/intranet/logexpense/' + $uid + '/',
				contentType: 'application/json;charset=UTF-8',
				method: 'POST',
				data: JSON.stringify({
					content: content,
					amount: amount,
					time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.fff000")
				}),
				success: function(data, status, jqxhr) { 
					$expense = parseInt(data);
				}
			});
		});
	});
	loggedIn = Date.now();
	laststated = Date.now();
	function updateTime(totalsec) {
		$('div.timer').text(toHHMMSS(totalsec));
		$('div.moneytoday .floatR').text('₩ ' + Math.floor(totalsec / 10000 / 60 / 60 * $hwage) * 10);
		$('div.moneymonth .floatR').text('₩ ' + ($expense + Math.floor((totalsec - $totalsec + $totalsecmonth) / 100000 / 60 / 60 * $hwage * 12) * 10));
	}
	updateTime($totalsec);
	$lastupdate = new Date().getDate();
	reloadFlag = false;
	setInterval(function() {
		if(!reloadFlag) {
			if($lastupdate != new Date().getDate() || Date.now() - loggedIn > 60 * 5 * 1000) {
				location.reload();
				reloadFlag = true;
			}
			if($('body').hasClass('in'))
				updateTime($totalsec + (Date.now() - loggedIn));
			if(!$('div.stat').hasClass('disp-none') && $('div.stat').hasClass('updateTime')) {
				$('div.stat div.time').each(function() {
					if($(this).attr('data-last') == 'in') {
						$(this).text(toHHMMSS(parseInt($(this).attr('data-time')) + (Date.now() - laststated)));
						$(this).parent().find('div.salary').text('₩ ' + (parseInt($(this).parent().find('div.salary').attr('data-expense')) + Math.floor((parseInt($(this).attr('data-time')) + (Date.now() - laststated)) / 100000 / 60 / 60 * $hwage * 12) * 10));
					}
				});
			}
			$lastupdate = new Date().getDate();
		}
	}, 47);
});