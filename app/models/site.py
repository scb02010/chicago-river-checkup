from app.database import db

class Site(db.Model):
    site_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    waterbody = db.Column(db.String(200), unique=False, nullable=False)
    readings = db.relationship('Readings',backref='site',lazy=True)

    def __repr__(self):
        return '<Site %r>' % self.name

    def __init__(self, site_id, name, waterbody):
        self.site_id = site_id
        self.name = name
        self.waterbody = waterbody