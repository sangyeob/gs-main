import os
import sys
from flask import Flask, request, render_template, redirect, flash, url_for, g, session, abort, make_response, current_app
from flask.ext.mysqldb import MySQL
import datetime
import json
import sqlite3
import hashlib
import threading
import time
import os

DEBUG = True

application = Flask(__name__, instance_relative_config=True)

application.config['MYSQL_USER'] = os.environ['RDS_USERNAME']
application.config['MYSQL_PASSWORD'] = os.environ['RDS_PASSWORD']
application.config['MYSQL_DB'] = os.environ['RDS_DB_NAME']
application.config['MYSQL_HOST'] = os.environ['RDS_HOSTNAME']

application.config.from_object(__name__)

mysql = MySQL(application)

def query_db(query, args=(), one=False, format=True, noresult=False):
    cur = mysql.connection.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    if noresult:
    	cur.close()
    	return None
    else:
	    if not format:
	        cur.close()
	        return (rv[0] if rv else None) if one else rv
	    else:
	        ret = (format_row(cur, rv[0]) if rv else None) if one else [format_row(cur, r) for r in rv]
	        cur.close()
	        return ret

def format_row(cur, row):
    if row != None:
        return dict((cur.description[idx][0], value) for idx, value in enumerate(row))
    else:
        return None

'''
@application.before_request
def before_request():
    g.db = connect_db() 

@application.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()
'''

def get_total_sec_today(uid):
	logs = query_db('select * from log where uid = %s order by timestamp desc limit 50', (uid,))
	if logs == []:
		return 0
	init = False
	last = ''
	s = 0
	for i in xrange(len(logs) - 1, -1, -1):
		last = logs[i]['status']
		if logs[i]['status'] == 'out':
			if not init:
				continue
			s += (datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f") - t).total_seconds()
		else:
			t = datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f")
			if t.day != datetime.datetime.today().day:
				continue
			init = True
	if last == 'in':
		s += (datetime.datetime.now() - datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f")).total_seconds()
	return s * 1000

def get_total_sec_month(year, month, uid):
	logs = query_db('select * from log where uid = %s order by timestamp asc', (uid,))
	if logs == []:
		return {
			'time': 0,
			'last': 'out',
		}
	init = False
	last = ''
	s = 0
	for i in xrange(len(logs)):
		last = logs[i]['status']
		t = datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f")
		if t.month != month or t.year != year:
				continue
		if logs[i]['status'] == 'out':
			if not init:
				continue
			s += (datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f") - lt).total_seconds()
		else:
			lt = datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f")
			init = True
	if year == datetime.datetime.today().year and month == datetime.datetime.today().month:
		if last == 'in':
			s += (datetime.datetime.now() - datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f")).total_seconds()
	return {
		'time': s * 1000,
		'last': last,
		}

def get_total_expense_month(year, month, uid):
	logs = query_db('select * from expense where uid = %s order by timestamp desc', (uid,))
	if logs == []:
		return 0
	s = 0
	for i in xrange(len(logs) - 1, -1, -1):
		t = datetime.datetime.strptime(logs[i]['timestamp'], "%Y-%m-%d %H:%M:%S.%f")
		if t.month != month or t.year != year:
			continue
		s += logs[i]['amount']
	return s

@application.route('/intranet/<uid>/')
def intranet(uid):
	user = query_db('select * from user where uid = %s', (uid,), one=True)
	if user == None:
		return 'select * from user where uid = %s' % (uid,)
	log = query_db('select * from log where uid = %s order by timestamp desc', (uid,), one=True)
	cur = mysql.connection.cursor()
	if log != None:
		status = log['status']
		t = datetime.datetime.strptime(log['timestamp'], "%Y-%m-%d %H:%M:%S.%f")
		if status == 'in' and t.day != datetime.datetime.now().day:
			query_db('insert into log (uid, timestamp, status, `range`, lat, lon, comment) values (%s, %s, %s, %s, %s, %s, %s)', (uid, t.strftime("%Y-%m-%d") + ' 23:59:59.000000', 'out', 'auto', '0', '0', 'autologout'), noresult = True)
			query_db('insert into log (uid, timestamp, status, `range`, lat, lon, comment) values (%s, %s, %s, %s, %s, %s, %s)', (uid, datetime.datetime.now().strftime("%Y-%m-%d") + ' 00:00:00.000000', 'in', 'auto', '0', '0', 'autologin'), noresult = True)
			mysql.connection.commit()
		last = (datetime.datetime.strptime(log['timestamp'], "%Y-%m-%d %H:%M:%S.%f") - datetime.datetime(1970, 1, 1)).total_seconds() * 1000
	else:
		status = 'out'
		last = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)).total_seconds() * 1000
	last -= 9 * 60 * 60 * 1000

	return render_template('intranet/intranet.html', context = {'uid': uid,
																'name': user['name'],
																'pw': user['password'],
																'hwage': 6030,
																'status': status,
																'totalsec': get_total_sec_today(uid),
																'totalsecmonth': get_total_sec_month(datetime.datetime.today().year, datetime.datetime.today().month, uid)['time'],
																'expense': get_total_expense_month(datetime.datetime.today().year, datetime.datetime.today().month, uid),
																'lastlog': last
																})

@application.route('/intranet/logtime/<uid>/', methods=["POST"])
def logtime(uid):
	status = 'in' if request.json['status'] == 'in' else 'out'
	log = query_db('select * from log where uid = %s order by timestamp desc', (uid,), one=True)
	cur = mysql.connection.cursor()
	if log != None:
		if log['status'] == 'in' and status == 'in':
			return json.dumps({ 'result': 'failed', 'message': '2' }) # checked in twice
		if log['status'] == 'out' and status == 'out':
			return json.dumps({ 'result': 'failed', 'message': '3' }) # checked out twice
	query_db('insert into log (uid, timestamp, status, `range`, lat, lon, comment) values (%s, %s, %s, %s, %s, %s, %s)', (uid, request.json['time'], status, request.json['range'], request.json['lat'], request.json['lon'], request.json['comment']), noresult = True)
	cur.close()
	mysql.connection.commit()
	return json.dumps({ 'result': 'success',
						'message': '1',
						'totalsec': get_total_sec_today(uid),
						'totalsecmonth': get_total_sec_month(datetime.datetime.today().year, datetime.datetime.today().month, uid)['time'],
						'last': (datetime.datetime.now() - datetime.datetime(1970, 1, 1)).total_seconds() * 1000 - 9 * 60 * 60 * 1000
						})

@application.route('/intranet/logexpense/<uid>/', methods=["POST"])
def logexpense(uid):
	print request.json
	cur = mysql.connection.cursor()
	query_db('insert into expense (uid, content, amount, timestamp) values (%s, %s, %s, %s)', (uid, request.json['content'], request.json['amount'], request.json['time']))
	cur.close()
	mysql.connection.commit()
	return str(get_total_expense_month(datetime.datetime.today().year, datetime.datetime.today().month, uid))

@application.route('/intranet/getstat/<year>/<month>/', methods=["POST"])
def getstat(year, month):
	users = query_db('select * from user')
	res = []
	for user in users:
		gt = get_total_sec_month(int(year), int(month), user['uid'])
		res.append({
				'uid': user['uid'],
				'name': user['name'],
				'totalsecmonth': gt['time'],
				'expense': get_total_expense_month(int(year), int(month), user['uid']),
				'last': gt['last'],
				'account': user['account']
			});
	res.sort(key=lambda x: -x['totalsecmonth'])
	return json.dumps(res)

if __name__ == "__main__":
    reload(sys)
    sys.setdefaultencoding('utf-8')
    application.debug = True
    application.run(host='0.0.0.0', port=5000)