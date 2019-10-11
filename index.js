let fs = require("fs"),
	convertFactory = require('electron-html-to');
const axios = require("axios");
const inquirer = require("inquirer");
//const HTML5ToPDF = require("../lib")
const path = require("path")
let output ={ 
	};
const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};
const questions = [
  "Enter your GitHub username",
  "What color do you want your resume to be?"
];

function writeToFile(fileName, data) {
	let json = JSON.stringify(data);
	fs.writeFile(fileName,json,'utf8', function (err) {
  		if (err) throw err;
  		console.log('saved!');
  	});
  	let value = output.color;
  	console.log(colors[value].wrapperBackground);
  	let conversion = convertFactory({
	  converterPath: convertFactory.converters.PDF
	});
	 
	conversion({ html: generateHTML(output) }, function(err, result) {
	  if (err) {
	    return console.error(err);
	  }
	 
	  console.log(result.numberOfPages);
	  console.log(result.logs);
	  result.stream.pipe(fs.createWriteStream('./Developer_Profile.pdf'));
	  conversion.kill(); 
	});
}

function init() {
	inquirer
	  	.prompt([{
	  		name: 'username',
	    	message: questions[0],
	  	},{
	  		name: 'colors',
	  		type: 'list',
	    	message: questions[1],
	    	choices: [
	    		'green',
	    		'blue',
	    		'pink',
	    		'red'
	    	],
	  	}])
	  	.then((answers) => {
		  	let repoName = [];
		  	let starCount = 0;
		  	console.log(`The chosen color is ${answers.colors}!`);
		    const queryUrl0 = `https://api.github.com/users/${answers.username}/repos?per_page=100`;
		    const queryUrl1 = `https://api.github.com/users/${answers.username}`;
		    output.color = answers.colors;
		    axios
		    	.get(queryUrl0)
		    	.then(function(res){
		    		for (var i = 0; i < res.data.length; i++) {
		    			starCount += res.data[i].stargazers_count;
		    		}
	    		});
	    		output.star =  starCount;
	    	axios
	    		.get(queryUrl1)
		    	.then(function(res){
		    		output.repos =  res.data.public_repos;
		    		output.followers = res.data.followers;
		    		output.following =  res.data.following; 
		    		output.name =  res.data.name; 
		    		output.avatar =  res.data.avatar_url;
		    		output.profile =  res.data.url; 
		    		output.blog =  res.data.blog; 
		    		output.bio =  res.data.bio; 
		    		output.company = res.data.company;
		    		output.location = res.data.location;
		    		writeToFile('output.html',output);
		    	});
	  	});
}
function generateHTML(data) {
	console.log(data);
	let value = data.color;
  return `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Document</title>
      <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors[value].wrapperBackground};
         padding-top: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors[value].headerBackground};
         color: ${colors[value].headerColor};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors[value].photoBorderColor};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }

         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }

         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors[value].headerBackground};
           color: ${colors[value].headerColor};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }

         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }

         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
      <body>
        <div class="wrapper">
            <div class="photo-header"> 
                <img src="${data.avatar}">
                <h1>Hi!</h1><h2>My name is ${data.name}</h2>
                <div class="workExp-date" style="text-align: center;"><h3>Currently @ ${data.company}</h3></div>
                <div class="links-nav">
                    <div class="nav-link"><a href="https://www.google.com/maps/place/${data.location}"><i class="fas fa-location-arrow"></i> ${data.location}</a></div>
                    <div class="nav-link"><a href="${data.profile}"><i class="fab fa-github-alt"></i> Github</a></div>
                    <div class="nav-link"><a href="${data.blog}"><i class="fas fa-rss"></i> Blog</a></div>
                </div>
            </div>
            <main>
                <div class="container">
                    
                    <h3 style="text-align: center;">${data.bio}</h3>
                    <div class="row">
                        <div class="col">
                            <div class="card"><h3>Public Repositories</h3><h4>${data.repos}</h4></div>
                        </div>
                        <div class="col">
                            <div class="card"><h3>Followers</h3><h4>${data.followers}</h4></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="card"><h3>GitHub Stars</h3><h4>${data.star}</h4></div>
                        </div>
                        <div class="col">
                            <div class="card"><h3>Following</h3><h4>${data.following}</h4></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
      </body>`
}


init();