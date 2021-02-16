/*
https://developer.spotify.com/console
https://spotify-profile.herokuapp.com/recent
https://rdrr.io/cran/spotifyr/man/get_my_recently_played.html
https://developer.spotify.com/dashboard/applications/8650cd51b1d94e2cb9670c448b88fd46

FUNCIONALITIES I WANNA HAVE
-> SHOW 1->50 TOP ARTISTS
-> SHOW 1->50 TOP TRACKS -> QUESTION - DO YOY WANT A PLAYLIST WITH THIS SONGS? -> CREATE THAT PLAYLIST
-> SHOW 1->50 RECENTLY TRACKS PLAYED


AVERAGE TIME TO CHARGE ALL THE DATA --> 166 ms ~= 0,2 sec 
*/
var topArtistsLongTerm, topArtistsMediumTerm, topArtistsShortTerm;
var topTracksLongTerm, topTracksMediumTerm, topTracksShortTerm;
var recentlyPlayed;

//const miStorage = window.localStorage;

var bTopTracks, bRecentlyPlayed, inputLimitValue, inputTermValue, p;
bTopTracks = document.getElementById("bTopTracks");
var bTopArtists = document.getElementById("bTopArtists");


bRecentlyPlayed = document.getElementById("bRecentlyPlayed");
inputLimitValue = document.getElementById("inputLimitValue");
inputTermValue = document.getElementById("inputTermValue");
p = document.getElementById("resultado");

var listaTracks = document.getElementById("listaTracks");
var myImagesURLS =JSON.parse(miStorage.getItem('imagesURLS'));

/*function getItemPosition(artistName){
	for ( var i=0; i<myImagesURLS.length; i++ ) {
		if(artistName == myImagesURLS[i]) return i;
	}
	return false;
}*/



bTopTracks.onclick = function() {
	window.location.href = "topTracks.html";
	while( listaTracks.firstChild ){
  		listaTracks.removeChild( listaTracks.firstChild );
	}
	var limit = inputLimitValue.value;
	var term = inputTermValue.value;

	if(limit > 50 ) limit = 50;
	else if ( limit == '' ) limit = 20;

	if(term == 'long_term' || term == '' ) {
		json = JSON.parse(miStorage.getItem('topTracksLongTerm'));
	}
	else if ( term == 'medium_term') {
		json = JSON.parse(miStorage.getItem('topTracksMediumTerm'));
	}
	else if ( term == 'short_term') {
		json = JSON.parse(miStorage.getItem('topTracksShortTerm'));
	}
	for ( var i=0; i<limit; i++ ) {
		var position = "";
		var artists = "";
		var popularity = json.items[i].popularity;
		var artistsLength = json.items[i].artists.length;
		var images = [];
		if ( artistsLength == 1 ) {
			artists = json.items[i].artists[0].name;
			var item = miStorage.getItem(artists); 
			if ( item != null ) {
				var link = item.slice(0, -1);
				if ( item[item.length-1] == 'H') position = position + '<div class="image-cropper"><img src="' + link + '" class="profile-pic"></div>';
				else position = position + '<div class="image-cropper"><img src="' + link + '" class="profile-pic"></div>';
			}
		}
		else {
			for ( var j=0; j<artistsLength; j++ ) {
				var name = json.items[i].artists[j].name;
				var item = miStorage.getItem(name); 
				if ( item != null ) {
					var link = item.slice(0, -1);
					console.log(link);
					if ( item[item.length-1] == 'H') position = position + '<div class="image-cropper"><img src="' + link + '" class="profile-pic2"></div>';
					else position = position + '<div class="image-cropper"><img src="' + link + '" class="profile-pic"></div>';
				}
				if ( (artistsLength-1) == j ) artists = artists + name;
				else artists = artists + name + ", ";
			}
		}
		var li = document.createElement("li");
		li.className = 'item';
		li.innerHTML = '<p>' + json.items[i].name + ' - ' + artists + " - Popularity:" + popularity + position;
		listaTracks.appendChild(li);
	}
}

var listaArtistas = document.getElementById("listaArtistas");

bTopArtists.onclick = function() {
	window.location.href = "topArtists.html";
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

var listaRecientes = document.getElementById('listaRecientes');

bRecentlyPlayed.onclick = function() {
	while( listaRecientes.firstChild ){
  		listaRecientes.removeChild( listaRecientes.firstChild );
	}
	var limit = inputLimitValue.value;
	if(limit > 50 ) limit = 50;
	else if ( limit == '' ) limit = 20;

	var json = JSON.parse(miStorage.getItem('recentlyPlayed'));
	var innerHTML = "";
	for ( var i=0; i<limit; i++ ) {
		var artists = "";
		var artistsLength = json.items[i].track.artists.length;
		var popularity = json.items[i].track.popularity;
		if ( artistsLength == 1 ) artists = json.items[i].track.artists[0].name;
		else {
			for ( var j=0; j<artistsLength; j++ ) {
				if ( (artistsLength-1) == j ) artists = artists + json.items[i].track.artists[j].name;
				else artists = artists + json.items[i].track.artists[j].name + ", ";
			}
		}
		var li = document.createElement("li");
		li.className = 'item';
		li.innerHTML = json.items[i].track.name + " - " + artists + " Popularity: " + popularity;
		listaRecientes.appendChild(li);
	}
}



