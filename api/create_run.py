import flask
import flask.ext.sqlalchemy
import flask.ext.restless
from flask.ext.cors import CORS

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '192.168.0.6'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/pi/data1.db'
db = flask.ext.sqlalchemy.SQLAlchemy(app)
CORS(app)

class PowerSample(db.Model):
    __tablename__ = 'powersample'
    id = db.Column(db.Unicode, primary_key=True)
    timestamp = db.Column(db.Float)
    target_id = db.Column(db.String)
    energy = db.Column(db.Float)
    time = db.Column(db.Float)
    peak_power = db.Column(db.Float)
    peak_current = db.Column(db.Float)
    peak_voltage = db.Column(db.Float)
    n_samples = db.Column(db.Integer)
    avg_power = db.Column(db.Float)
    avg_current = db.Column(db.Float)
    avg_voltage = db.Column(db.Float)

class Config(db.Model):
    __tablename__ = 'config'
    id = db.Column(db.Unicode, primary_key=True)
    rate = db.Column(db.Float)

class Test(db.Model):
    __tablename__ = 'test'
    id = db.Column(db.Unicode, primary_key=True)
    garbage = db.Column(db.String)

# Create the database tables.
db.create_all()

# Create the Flask-Restless API manager.
manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

# Create API endpoints, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well.
blueprint = manager.create_api(PowerSample, methods=['GET', 'POST', 'DELETE'])
manager.create_api(Test, methods=['GET', 'POST', 'DELETE'])
manager.create_api(Config, methods=['GET', 'POST'])

#blueprint.after_request(add_cors_headers)

app.run(host = '0.0.0.0')
