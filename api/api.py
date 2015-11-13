from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
#app.run(debug=True, host='0.0.0.0')
api = Api(app)

data = {'power': 0}
interval = {'interval': 1}

class PowerDataFeed(Resource):
    def get(self):
        return data

class SetInterval(Resource):
	def get(self, inter):
		return interval;

	def put(self, inter):
		interval['interval'] = request.form[inter]
		return interval

api.add_resource(PowerDataFeed, '/feed/')
api.add_resource(SetInterval, '/interval/<int:inter>')

if __name__ == '__main__':
    app.run(debug=True)