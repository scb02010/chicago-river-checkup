from flask_restful import Resource

class PuppyController(Resource):
    def get(self):
        return "bark!"