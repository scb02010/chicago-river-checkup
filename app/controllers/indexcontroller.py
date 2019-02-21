from flask_restful import Resource
from flask import send_from_directory

class IndexController(Resource):
    def get(self):
        return send_from_directory('dist', 'index.html')