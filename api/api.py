from flask import Flask
from flask import make_response
from flask import jsonify
from flask_restful import Resource, Api

app = Flask(__name__)
#app.run(debug=True, host='0.0.0.0')
api = Api(app)

data = {'power': 0}
interval = {'interval': 1}

@app.errorhandler(301)
def moved_permanently(error):
    return make_response(jsonify({'error': 'Moved permanently. See docs for the changed url.'}), 301)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(500)
def internal_server(error):
    return make_response(jsonify({'error': 'Internal server error'}), 500)

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': "tasks"})

@app.route('/feed', methods=['GET'])
def get_feed():
    return jsonify({'data': data})

@app.route('/interval', methods=['GET'])
def get_interval():
    return jsonify({'interval': interval})

@app.route('/interval/<int:new_inter>', methods=['POST'])
def put(new_inter):
    interval['interval'] = new_inter
    return jsonify({'interval': interval})

if __name__ == '__main__':
    app.run(debug=True)
