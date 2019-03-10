from flask import Flask
from flask_restful import Api

from app.controllers.indexcontroller import IndexController
from app.controllers.filecontroller import FileController
from app.controllers.readingscontroller import ReadingsController

def create_app():
    app = Flask(__name__)
    api = Api(app)

    api.add_resource(IndexController, '/')
    api.add_resource(FileController, '/<string:filename>')
    api.add_resource(ReadingsController, '/readings/<int:site_id>')

    return app

