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
    var time    = hours+':'+minutes+':'+seconds+':'+ milisec;
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
			if($inputpass == $('div.dots').attr('data-password')) {
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
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert('GPS를 켜주세요!');
        location.reload();
    }
    function showPosition(position) {
    	
    	mtlat = 37.4822241; // 마리오타워위치
    	mtlon = 126.8942008;
		/*
		mtlat = 35.4822241; // 마리오타워위치
    	mtlon = 125.8942008;
    	*/
		var p = 0.017453292519943295;    // Math.PI / 180
		var c = Math.cos;
		var a = 0.5 - c((mtlat - position.coords.latitude) * p)/2 + 
		        c(position.coords.latitude * p) * c(mtlat * p) * 
		        (1 - c((mtlon - position.coords.longitude) * p))/2;
		if(12742 * Math.asin(Math.sqrt(a)) > 1) { // 1km 이상
			$('.logtime').addClass('disabled');
			if($('body').hasClass('in')) {
				updatelog('out');
			}
		} 
	}
	function showError(error) {
		alert('GPS를 켜주세요!');
        location.reload();
	}
	function updatelog(status) {
		$('.logtime').addClass('tempdisabled');
		$.ajax({
			url: '/intranet/logtime/' + $uid + '/',
			contentType: 'application/json;chatset=UTF-8',
			method: 'POST',
			data: JSON.stringify({
				time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.fff000"),
				status: status
			}),
			success: function(data, status, jqxhr) {
				data = JSON.parse(data);
				console.log(data);
				if(data.result == 'success') {
					if($('body').hasClass('out')) {
						$('body').removeClass('out').addClass('in');
						$('.logtime').text('퇴근');
						notify($name + '님 오늘도 열심히 일해요!');
					} else {
						$('body').removeClass('in').addClass('out');
						$('.logtime').text('출근');
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
			}
		});
	}
	if($initstatus == 'out') {
		$('div.logtime').text('출근');
	} else {
		$('div.logtime').text('퇴근');
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
			notify('회사에서 너무 멀리 있어요 ㅠㅠ');
			return false;
		}
		if($('body').hasClass('in'))
			updatelog('out');
		else
			updatelog('in');
	});
	loggedIn = Date.now();
	function updateTime(totalsec) {
		$('div.timer').text(toHHMMSS(totalsec));
		$('div.moneytoday .floatR').text('₩ ' + Math.floor(totalsec / 10000 / 60 / 60 * $hwage) * 10);
		$('div.moneymonth .floatR').text('₩ ' + Math.floor((totalsec - $totalsec + $totalsecmonth) / 100000 / 60 / 60 * $hwage * 12) * 10);
	}
	updateTime($totalsec);
	$lastupdate = new Date().getDate();
	setInterval(function() {
		if($lastupdate != new Date().getDate() || Date.now() - loggedIn > 60 * 5 * 1000) location.reload();
		if($('body').hasClass('in'))
			updateTime($totalsec + (Date.now() - $last));
		$lastupdate = new Date().getDate();
	}, 47);
});