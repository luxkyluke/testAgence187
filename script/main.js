const query = "https://maps.googleapis.com/maps/api/geocode/json?address="
const regexZipcode = new RegExp("[0-9]");


function checkZipcode(element, e){
	e.preventDefault ? e.preventDefault() : (e.returnValue = false);
	const zipcode =  element["zipcode"].value;

	//check lenght of the zipcode
	if((zipcode.length>0 && zipcode.length<5) || !regexZipcode.test(zipcode) ){
		addClass(document.querySelector("#zipcode_txt"), "error");
		return false;
	}

	//cleaning older results
	document.getElementById("results").innerHTML = "";
	
	//getting the resulting city and loading it
	getCity(zipcode, function(city){
		loadCity(city, function(){
			animMarker();
		});
	});
}

function animMarker(){
	setTimeout(function(){
		document.getElementById("location").className += "visible";
	}, 0);

	var results = document.getElementById("results");
	var location = document.getElementById("location");

	var resultsWidth 	= results.offsetWidth;	
	var resultsHeight	= results.offsetHeight;
	var locationWidth 	= location.offsetWidth;
	var locationHeight 	= location.offsetHeight;

	const padding = 10;

	var maxX = resultsWidth - locationWidth - padding;
	var minX = locationWidth + padding;

	var maxY = resultsHeight - (locationHeight*2) - padding;
	var minY = locationHeight + padding;

	var x = Math.floor((Math.random() * maxX) + minX);
	var y = Math.floor((Math.random() * maxY) + minY);

	location.setAttribute("style", "transform: translate("+-x+"px, "+y+"px);");
}

function getCity(zipcode, callback){
	var url = query+zipcode;
	getAjax(url, function(res){
		var result = JSON.parse(res);
		var city = result.results[0].address_components[1].long_name;
		callback(city);
	});		
}

function load(html, cities, _callback){
	var str = new String(html);
	var tmp = str.split("ResultCity");
	str = tmp[0]+cities[0]+tmp[1];
	var results = document.getElementById("results");
	results.innerHTML += str;
	_callback();
}

function loadCity(city, _callback){
	//loading city markers
	getAjax("marker.html", function(html){
		var str = new String(html);
		var tmp = str.split("ResultCity");
		str = tmp[0]+city+tmp[1];
		var results = document.getElementById("results");
		results.innerHTML += str;
		_callback();
	});

}

//Key event
function handleKeyPressed(e){
	const key = (e.which) ? e.which : e.keyCode;
	if (key != 46 && key > 31 
            && (key < 48 || key > 57)){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		return false;
	}

	//reset error status 
	if(hasClass(document.querySelector("#zipcode_txt"), "error"))
		removeClass(document.querySelector("#zipcode_txt"), "error");
}


/**********************************AJAX**********************************/

var getAjax = function(url, callback){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
			callback(xmlHttp.responseText);
		}		
	}
	xmlHttp.open('GET', url, true);
	xmlHttp.send(null);
}
