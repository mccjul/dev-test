var fs = require('fs');
var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var config = require('./config');
var multer  = require('multer')
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
  
  app.get('/pdfs', jwtCheck, (req, res) => {
		Pdf.find(function(err, docs) {
      if(err) return console.error(err);
      for(var i = 0, tmps = [], tmp = {}; i < docs.length; i++){
        tmp._id = docs[i]._id.toString();
        tmp.filename = docs[i].filename;
        tmp.metadata = docs[i].metadata;
        tmps.push(tmp);
      }
      res.json(tmps);
    });
	});

	app.post('/pdf/upload/', upload.single('upload'), (req, res) => {
		var pdf = new Pdf({
      filename: req.file.originalname,
  		contentType: 'application/pdf',
      metadata:  { path: req.file.filename }
		});
    
		pdf.write(
  		fs.createReadStream(req.file.path), 
			(err, done) => {
				if(err) res.send(500, { error: err });
        res.sendStatus(200);
			}
		);
	});

	app.get('/pdf/download/:id', jwtCheck, (req, res) => {
    // I couldn't get gridfs to function
		// Pdf.readById(req.params.id, (err, data) => {
    //   if(err) return res.status(500).send({ error: err });
    //   res.status(200).send(data);
    // });
    Pdf.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function(err, doc) {
      if(err) return console.error(err);
      res.status(200).sendFile(__dirname + '/tmp/' + doc.metadata.path);
    });
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