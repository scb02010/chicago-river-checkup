from flask_restful import Resource
from flask import send_from_directory, request, json, render_template, url_for

class ReadingsController(Resource):
    def get(self, site_id):
        readings = json.load(open('app/dist/readings.json'))
        result = []
        for site in readings:
            if (site['site_id'] == site_id):
                result.append(site)
        return(result)
