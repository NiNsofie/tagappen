var http = require("http");
var fs = require('fs')

//skapar en server
http.createServer(function (request, response) {
	const {headers, method, url} = request;
	//console.log(headers);
	//console.log(method);
	//console.log(url);
	
	//Servern kan ta två olika requests.
	//Den första är om man lägger till ändelsen tagtider i adressfältet. Då hämtar servern data från skånetrafikens API
	//och bygger ihop alla chunks av data den får tag på tills den inte hittar mer data. Det är härifrån som html-sidan hämtar
	//sin information.
	//Den andra är om man bara går in på servern så läser den och visar en html-sida.

	if (url=="/tagtider"){
		http.get('http://www.labs.skanetrafiken.se/v2.2/stationresults.asp?selPointFrKey=85000', (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				response.writeHead(200, {'Content-Type': 'text/xml'});
				response.end(data);
			});
		});
	} 
	else if (url=="/stylish.css"){
		fs.readFile('stylish.css', 'utf8', function(err, contents){
			response.writeHead(200, {'Content-Type': 'text/css'});
			response.end(contents);
		});
	}
	else {
		fs.readFile('htmlsida.html', 'utf8', function(err, contents){
			response.writeHead(200, {'Content-Type': 'text/html'});
   			response.end(contents);
		});
	}
}).listen(8081);

// Skriv ut detta för att lätt se att servern är uppe:
console.log('Server running at http://192.168.1.197:8081');


