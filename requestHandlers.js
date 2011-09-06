var fs = require("fs");
var index = '';
var queryString = require("querystring");
var formidable = require("formidable");

function start(response) {
    console.log("Request handler 'start' was called.");

    fs.readFile('./index.html', function(err, data) {
        if (err) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data, 'utf-8');
            response.end();
        }
    });
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = formidable.IncomingForm();
    console.log("About to parse.");
    form.parse(request, function(error, fields, files) {
        console.log("Parsing done.");
        fs.renameSync(files.upload.path, "/tmp/test.png");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Received Image:<br />");
        response.write('<img src="/show" />');
        response.end();
    });
}

function show (response) {
    console.log("Request handler 'show' was called.");
    fs.readFile('/tmp/test.png', 'binary', function(error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, 'binary');
            response.end();
        }
    })
}

exports.start = start;
exports.show = show;
exports.upload = upload;
