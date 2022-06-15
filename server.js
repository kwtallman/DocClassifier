import {redactFile} from './src/js/textOperations.js';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
app.use("/images", express.static('./images'));
app.use("/css", express.static('./src/css'));
app.use("/js", express.static('./src/js'));
app.use("/js/components", express.static('./src/js/components'));

const host = '127.0.0.1';
const port = 3000;

//initialize storage to temporarily save uploaded files
const storage = multer.memoryStorage();

//to confirm that the input files are text
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'text/plain') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    fileFilter,
    storage
});

//render and send index page and it's components to the browser
app.get('/', function (req, res) {
   console.log('request ', req.url);

   let filePath = '.' + req.url;
   if (filePath == './') {
       filePath = './src/html/index.html';
   }

   //set content types
   let extname = String(path.extname(filePath)).toLowerCase();
   let mimeTypes = {
       '.html': 'text/html',
       '.js': 'text/javascript',
       '.css': 'text/css'
   };

   let contentType = mimeTypes[extname] || 'application/octet-stream';

   //read filepath and send if there are no errors
   fs.readFile(filePath, function(error, content) {
       if (error) {
           if(error.code == 'ENOENT') {
               fs.readFile('./404.html', function(error, content) {
                  res.writeHead(404, { 'Content-Type': 'text/html' });
                  res.end(content, 'utf-8');
               });
           }
           else {
            res.writeHead(500);
            res.end('Error: ' + error.code);
           }
       }
       else {
         res.writeHead(200, { 'Content-Type': contentType });
         res.end(content, 'utf-8');
       }
   });
})

//endpoint to send classified docs and words to get processed and returned as a txt file
app.post("/classify", upload.fields([{name: "secretWords"}, {name: "secretDoc"}]), (req, res, next) => {
    let files = req.files;
  
    //confirm files exist
    if (!files) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    } 

    let textToRemove = "";
    let wordsToRemove = "";
    
    //set input based on what the user uploaded for classified words
    if (!files["secretDoc"]) {
        const error = new Error("Secret Doc needed!");
        error.httpStatusCode = 400;
        return next(error);
    } else if (!files["secretWords"] && req.body.secretText) {
        textToRemove = req.body.secretText;
        wordsToRemove = "";
    } else if (files["secretWords"] && !req.body.secretText) {
        wordsToRemove = Buffer.from(files["secretWords"][0].buffer).toString("utf-8");
        textToRemove = "";
    } else {
        wordsToRemove = Buffer.from(files["secretWords"][0].buffer).toString("utf-8");
        textToRemove = req.body.secretText;
    }

    //save the original doc name to set the returned file name
    let savedName = files["secretDoc"][0].originalname;
    let classifiedDoc = Buffer.from(files["secretDoc"][0].buffer).toString("utf-8");

    //set ignorecase variable for the regex process
    let ignoreCase = false;
    if (req.body.ignoreCase === 'true') {
        ignoreCase = true;
    }
    
    //trigger the classifying process
    let result = redactFile(classifiedDoc, wordsToRemove, textToRemove, ignoreCase);
  
    //set details and result for txt file, will be returned as a downloadable txt file
    res.attachment(savedName)
    res.type('txt')
    res.send(result);
});

const server = app.listen(port, function () {
    console.log(`Listening at http://${host}:${port}`);
 })