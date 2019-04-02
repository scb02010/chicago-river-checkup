from flask_restful import Resource
from flask import send_from_directory, request, json, render_template, url_for
from app.models.readings import Readings


class ReadingsController(Resource):
    def get(self, site_id):
        a = json.dumps([u.as_dict() for u in Readings.query.filter_by(site_id=site_id).order_by(Readings.date).all()])
        return json.loads(a)






