from flask_restful import Resource
from flask import send_from_directory, request, json, render_template, url_for
from app.models.readings import Readings
from app.models.site import Site
from sqlalchemy.orm import subqueryload

class DataController(Resource):
    def get(self):
        readingsList = Readings.query.options(subqueryload(Readings.site)).all()

        return [{
            'sitename' : reading.site.name,
            'date': json.loads(json.dumps(reading.date))[5:-13],
            'time': reading.time,
            'ph' : reading.ph,
            'temperature' : reading.tempcelsius,
            'dissolved oxygen' : reading.do,
            'conductivity' : reading.conductivity, 
            'phosphate' : reading.phosphate
        } for reading in readingsList]