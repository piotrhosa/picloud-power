import flask
import flask.ext.sqlalchemy
import flask.ext.restless
import json
import mailsender
import waitcapture
from flask.ext.cors import CORS
from threading import Thread

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '192.168.0.6'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

def create_run(database):
    # Create the Flask application and the Flask-SQLAlchemy object.
    app = flask.Flask(__name__)
    app.config['DEBUG'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/pi/' + database + '.db'
    db = flask.ext.sqlalchemy.SQLAlchemy(app)
    CORS(app)


    # Define classes for Flask-Restless
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

    class CpuSample(db.Model):
        __tablename__ = 'cpusample'
        id = db.Column(db.Unicode, primary_key=True)
        timestamp = db.Column(db.Float)
        target_id = db.Column(db.String)
        cpu_load = db.Column(db.Float)
        temperature = db.Column(db.Float)

    # Define another endpoint in Flask to handle CSV file generation
    @app.route('/api/csv/<jsons>', methods=['GET', 'POST'])
    def handle_thread(json_data):
        print 'here'
        #thread = Thread(target = create_csv, args = (json_data))
        #thread.start()
        #thread.join()

    def create_csv(json_data):
        ob = json.loads(json_data)
        start = ob['start']
        finish = ob['finish']
        email = ob['email']
        mode = ob['mode']
        subject = ob['subject']
        message = ob['message']
        target = ob['target']
        print '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^' 
        #file_name = waitcapture.wait_capture(start, finish, email, mode, target)
        #print '-----------------------------------------------', file_name
        #mailsender.send_mail(email, subject, message, file_name)

    # Create the database tables.
    db.create_all()

    # Create the Flask-Restless API manager.
    manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

    # Create API endpoints, which will be available at /api/<tablename>
    manager.create_api(PowerSample, methods=['GET', 'POST', 'DELETE'])
    manager.create_api(CpuSample, methods=['GET', 'POST'])

    app.run(host = '0.0.0.0', threaded=True)

create_run('cluster_data')
