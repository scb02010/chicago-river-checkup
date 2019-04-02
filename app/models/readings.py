from app.database import db

class JsonModel(object):
    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Readings(db.Model, JsonModel):
    reading_id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('site.site_id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False) 
    time = db.Column(nullable=False) # change type?
    tempcelsius = db.Column(db.Float)
    ph = db.Column(db.Float)
    do = db.Column(db.Float)
    phosphate = db.Column(db.Float)
    conductivity = db.Column(db.Float)

    def __repr__(self):
        return '<Readings for %r>' % self.site_id


    def __init__(self,reading_id, site_id, date, time, tempcelsius, ph, do, phosphate, conductivity):
       self.reading_id = reading_id
       self.site_id = site_id
       self.date = date
       self.time = time
       self.tempcelsius = tempcelsius
       self.ph = ph
       self.do = do
       self.phosphate = phosphate 
       self.conductivity = conductivity
