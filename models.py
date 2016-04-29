#-*- coding: utf-8 -*-

from sqlalchemy import Table, Column, Integer, String
from dbcontroller import metadata, db_session, Base

class User(Base):
	__tablename__ = 'users'

	id = Column(Integer, primary_key=True)
	name = Column(String(50))
	uid = Column(String(120), unique=True)
	password = Column(String(120))
	account = Column(String(120))

	def __init__(self, name, uid, password, account):
		self.name = name
		self.uid = uid
		self.password = password
		self.account = account

	def __repr__(self):
		return '<User %r>' % (self.name)

class Log(Base):
	__tablename__ = 'logs'

	id = Column(Integer, primary_key=True)
	uid = Column(String(100), unique=True)
	timestamp = Column(String(100))
	status = Column(String(100))
	ranges = Column(String(100))
	lat = Column(String(100))
	lon = Column(String(100))
	comment = Column(String(100))

	def __init__(self, uid, timestamp, status, ranges, lat, lon, comment):
		self.uid = uid
		self.timestamp = timestamp
		self.status = status
		self.ranges = ranges
		self.lat = lat
		self.lon = lon
		self.comment = comment

	def __repr__(self):
		return '<Log @%r>' % (self.timestamp)
