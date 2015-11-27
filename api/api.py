from flask import Flask
from flask_restful import Resource, Api
from flask.ext.sqlalchemy import SQLAlchemy
from model import PowerSample, Test
import flask.ext.restless
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////database.db'
db = SQLAlchemy(app)

engine = create_engine('sqlite:///database.db')
session = sessionmaker()
session.configure(bind=engine)
manager = flask.ext.restless.APIManager(app, session=session)

manager.create_api(PowerSample, methods=['GET', 'POST', 'DELETE'])
manager.create_api(Test)

if __name__ == '__main__':
    app.run(debug=True)
