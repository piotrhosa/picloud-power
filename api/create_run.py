import flask
import flask.ext.sqlalchemy
import flask.ext.restless

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////shared/picloud-power/api/data.db'
db = flask.ext.sqlalchemy.SQLAlchemy(app)

class PowerSample(db.Model):
    __tablename__ = 'powersample'
    id = db.Column(db.Unicode, primary_key=True)
    target_id = db.Column(db.String)
    energy = db.Column(db.Float)
    time = db.Column(db.BigInteger)
    power = db.Column(db.Float)
    peak_power = db.Column(db.Float)
    peak_current = db.Column(db.Float)
    peak_voltage = db.Column(db.Float)

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
manager.create_api(PowerSample, methods=['GET', 'POST', 'DELETE'])
manager.create_api(Test, methods=['GET', 'POST', 'DELETE'])

app.run()