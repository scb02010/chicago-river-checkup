from flask_restful import Resource
from flask import send_from_directory

class InfoController(Resource):
    def get(self):
        return send_from_directory('dist', 'info.html')