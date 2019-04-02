import pandas as pd

from flask import Flask, cli
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import click
from datetime import datetime

from app.controllers.indexcontroller import IndexController
from app.controllers.filecontroller import FileController
from app.controllers.readingscontroller import ReadingsController
from app.database import db
from app.models.site import Site
from app.models.readings import Readings


def create_app():
    app = Flask(__name__)
    
    api = Api(app)
    api.add_resource(IndexController, '/')
    api.add_resource(FileController, '/<string:filename>')
    api.add_resource(ReadingsController, '/readings/<int:site_id>')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mapping.db'
    db.init_app(app)

    app.cli.add_command(create_db)
    app.cli.add_command(create_sites)
    app.cli.add_command(create_readings)

    return app

@click.command('create_db')
@cli.with_appcontext
def create_db():
    db.create_all()

@click.command('create_sites')
@click.argument('sitepath')
@cli.with_appcontext
def create_sites(sitepath):
    sites = pd.read_csv(sitepath)
    for i,row in sites.iterrows():
        toadd = Site(int(sites.loc[i]['site_id']), sites.loc[i]['name'], sites.loc[i]['waterbody'])
        db.session.add(toadd)
        db.session.commit()

@click.command('create_readings')
@click.argument('readingspath')
@cli.with_appcontext
def create_readings(readingspath):
    readings = pd.read_csv(readingspath)
    readings['date'] = pd.to_datetime(readings.date)
    readings.sort_values('date',inplace=True)
    for i,row in readings.iterrows():
        toadd = Readings(int(readings.loc[i]['reading_id']),
            int(readings.loc[i]['site_id']),
            readings.loc[i]['date'],
            readings.loc[i]['time'],
            readings.loc[i]['tempcelsius'],
            readings.loc[i]['ph'],
            readings.loc[i]['do'],
            readings.loc[i]['phosphate'],
            readings.loc[i]['conductivity'])
        db.session.add(toadd)
    db.session.commit()



# '/Users/sarahbuchhorn/Desktop/chipy/mapping/app/dist/data/sites.csv'
# '/Users/sarahbuchhorn/Desktop/chipy/mapping/app/dist/data/readings.csv

