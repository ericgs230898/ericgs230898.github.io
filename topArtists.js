const miStorage = window.localStorage;
var bTopArtists = document.getElementById("bTopArtists");

var listaArtistas = document.getElementById("listaArtistas");

bTopArtists.onclick = function() {
	while( listaArtistas.firstChild ){
  		listaArtistas.removeChild( listaArtistas.firstChild );
	}
	var limit = inputLimitValue.value;
	var term = inputTermValue.value;
	var json;

	if(limit > 50 ) limit = 50;
	else if ( limit == '' ) limit = 20;

	if(term == 'long_term' || term == '' ) {
		json = JSON.parse(miStorage.getItem('topArtistsLongTerm'));
	}
	else if ( term == 'medium_term') {
		json = JSON.parse(miStorage.getItem('topArtistsMediumTerm'));
	}
	else if ( term == 'short_term') {
		json = JSON.parse(miStorage.getItem('topArtistsShortTerm'));
		if ( limit > 20 ) limit = 20;
	}
	var innerHTML = "";
	for ( var i=0; i<limit; i++ ) {
		var popularity = json.items[i].popularity;
		var image = json.items[i].images[0];
		var width, heigth;
		width = image.width;
		height = image.height;
		console.log( width + " + " + height);
		if ( width > height || json.items[i].name == 'El Alfa' ) innerHTML = '<p>' + json.items[i].name + ' Popularity: ' + popularity + '</p>' + '<div class="image-cropper"><img src=" '+ image.url + '" class="profile-pic2"></div>';
		else innerHTML = '<p>' + json.items[i].name + ' Popularity: ' + popularity + '</p>' + '<div class="image-cropper"><img src=" '+ image.url + '" class="profile-pic"></div>';
		var li = document.createElement("li");
		li.className = 'item';
		li.innerHTML = innerHTML;
		listaArtistas.appendChild(li);
	}
}

