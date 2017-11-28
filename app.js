const express =   require("express");
const multer  =   require('multer');
const ejs = require('ejs');
const path = require('path');

//Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +
    path.extname(file.originalname));
  }
});

//Init upload
const upload = multer({
  storage : storage,
  limits:{filesize: 1000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

//Init app
const app = express();

//check File Type
function checkFileType(file, cb) {
  //Allowed ext
  const filetypes = /jpg|jpeg|png|gif/;
  //check ext
  const extname = filetypes.test(path.extname
    (file.originalname).toLowerCase());
  //Check mimetype
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}
// EJS
app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  //res.send('test')
   upload(req, res, (err) => {
        if(err) {
            res.render('index', {
              msg: err
            });
          } else {
            if (req.file == undefined){
              res.render('index', {
                msg: 'Error: No File selected!'
              });
            } else {
              res.render('index',{
                msg:'File Uploaded!',
                file: `uploads/${req.file.filename}`
              });
            }
          }
     });
  });

app.listen(3000,function(){
    console.log("Working on port 3000");
});
