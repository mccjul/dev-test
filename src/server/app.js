var fs = require('fs');
var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var config = require('./config');
var multer  = require('multer');
var upload = multer({ dest: 'src/server/tmp/' });

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

let jwtCheck = jwt({
  secret: config.secret,
  audience: config.audience
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
  var gridfs = require('mongoose-gridfs')({
    collection:'pdfs',
    model:'Pdf'
  });
  var Pdf = gridfs.model;
  app.use(jwtCheck)
  app.get('/pdfs', (req, res) => {
		Pdf.find(function(err, docs) {
      if(err) return console.error(err);
      docs[0].metadata = { permission: 'Admin' };
      for(var i = 1; i < docs.length; i++){
        docs[i].metadata = { permission: '' };
      }
      res.status(200).json(docs);
    });
	});

	app.post('/pdf/upload/', upload.single('upload'), (req, res) => {
		var pdf = new Pdf({
      filename: req.file.originalname,
  		contentType: 'application/pdf',
      metadata: { permission: '' }
		});
    
		pdf.write(
  		fs.createReadStream(req.file.path), 
			(err, done) => {
				if(err) res.send(500, { error: err });
        res.sendStatus(200);
			}
		);
	});

	app.get('/pdf/download/:id', (req, res) => {
    // I couldn't get gridfs to function
    var stream = Pdf.readById(req.params.id);
    res.writeHead(200, {
        'Content-Type': 'arraybuffer'
    });
    stream.pipe(res);
	});

  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/../../dist/index.html'));
  });

  app.listen(app.get('port'), function() {
    console.log('Server listening on port '+ app.get('port'));
  });
});

module.exports = app;