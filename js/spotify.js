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






