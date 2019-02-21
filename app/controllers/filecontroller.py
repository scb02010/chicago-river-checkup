from flask_restful import Resource
from flask import send_from_directory

class FileController(Resource):
    def get(self, filename):
        return send_from_directory('dist', filename)