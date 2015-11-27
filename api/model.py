'''
from sqlalchemy import Column, Unicode, String, Float, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import json
import requests
'''
import flask
import flask.ext.sqlalchemy
import flask.ext.restless

app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////database.db'
db = flask.ext.sqlalchemy.SQLAlchemy(app)

class PowerSample(db.Model):
    __tablename__ = 'powersample'
    id = db.Column(db.Unicode, primary_key=True)
    target_id = db.Column(db.String)
    energy = db.Column(db.Float)
    time = db.Column(db.Float)
    power = db.Column(db.Float)
    peak_power = db.Column(db.Float)
    peak_current = db.Column(db.Float)
    peak_voltage = db.Column(db.Float)

class Test(db.Model):
    __tablename__ = 'test'
    id = db.Column(db.Unicode, primary_key=True)
    garbage = db.Column(db.String)


db.create_all()

'''
Base = declarative_base()

class PowerSample(Base):
    __tablename__ = 'powersample'
    id = Column(Unicode, primary_key=True)
    target_id = Column(String)
    energy = Column(Float)
    time = Column(Float)
    power = Column(Float)
    peak_power = Column(Float)
    peak_current = Column(Float)
    peak_voltage = Column(Float)

class Test(Base):
    __tablename__ = 'test'
    id = Column(Unicode, primary_key=True)
    garbage = Column(String)

if __name__ == '__main__':
    engine = create_engine('sqlite:///database.db')
    session = sessionmaker()
    session.configure(bind=engine)
    Base.metadata.create_all(engine)
    new_garbage = {'garbage': 'something'}
    r = requests.put('http://localhost:5000/api/test', data=json.dumps(new_garbage), headers={'content-type': 'application/json'})
    print r
    r = requests.get('http://localhost:5000/api/test/1', headers={'content-type': 'application/json'})
    print r
'''