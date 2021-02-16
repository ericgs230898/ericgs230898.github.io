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




bTopArtists.onclick = function() {
	window.location.href = "topArtists.html";
}


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



