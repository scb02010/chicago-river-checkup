from flask import Flask
from flask_restful import Api

from app.controllers.puppycontroller import PuppyController
from app.controllers.indexcontroller import IndexController
from app.controllers.filecontroller import FileController

def create_app():
    app = Flask(__name__)
    api = Api(app)

    api.add_resource(PuppyController, '/puppy')
    api.add_resource(IndexController, '/')
    api.add_resource(FileController, '/<string:filename>')

    return app