from flask_restful import Resource
from flask import send_from_directory, request, json, render_template, url_for

import sqlite3

import click
from flask import app, g
from flask.cli import with_appcontext

from app.models.readings import Readings
from flask import jsonify


class ReadingsController(Resource):
    def get(self, site_id):
        a = json.dumps([u.as_dict() for u in Readings.query.filter_by(site_id=site_id).order_by(Readings.date).all()])
        return json.loads(a)






