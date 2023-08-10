/*
https://developer.spotify.com/console
https://spotify-profile.herokuapp.com/recent
https://rdrr.io/cran/spotifyr/man/get_my_recently_played.html
https://developer.spotify.com/dashboard/applications/8650cd51b1d94e2cb9670c448b88fd46

FUNCIONALITIES I WANNA HAVE
-> SHOW 1->50 TOP ARTISTS
-> SHOW 1->50 TOP TRACKS -> QUESTION - DO YOY WANT A PLAYLIST WITH THIS SONGS? -> CREATE THAT PLAYLIST
-> SHOW 1->50 RECENTLY TRACKS PLAYED

8650cd51b1d94e2cb9670c448b88fd46

AVERAGE TIME TO CHARGE ALL THE DATA --> 166 ms ~= 0,2 sec 
*/
var token;

const miStorage = window.localStorage;

const LONG_TERM = 'long_term';
const MEDIUM_TERM = 'medium_term';
const SHORT_TERM = 'short_term';

var buttonSave = document.getElementById("buttonSave");
var buttonLogOut = document.getElementById("buttonLogOut");

window.onload = function() {
	console.log(miStorage.getItem('token'));
	if (miStorage.getItem('token') == null) {
		let urlString = window.location.href;
		let indexOf = urlString.indexOf("access_token");
		if ( indexOf != -1 ) {
			buttonSave.style.visibility="none";
			buttonLogOut.style.display="block";
			let indexOfEnd = urlString.indexOf("&", indexOf);
			let token = urlString.substring(indexOf+13,indexOfEnd);
			miStorage.setItem('token', token);
			cargarData();
		} else {
			buttonSave.style.visibility="block";
			buttonLogOut.style.display="none";
		}
	} else {
	    buttonLogOut.style.visibility="block";
		buttonSave.style.display="none";
		cargarData();
	}
}

buttonSave.onclick = function() {
	authorize();
    buttonSave.style.display="none";
    buttonLogOut.style.visibility="block";
}

buttonLogOut.onclick = function() {
	console.log("ENTRO LOG OUT");
	miStorage.clear();
	buttonSave.style.visibility="block";
	buttonLogOut.style.display="none";
}

function authorize() {
  const client_id = '8650cd51b1d94e2cb9670c448b88fd46';
  const redirect_uri = 'https://ericgs230898.github.io/';
  const scopes = 'user-top-read playlist-modify-public playlist-modify-private user-read-recently-played';

// Store the date
const d = new Date();
let date = [d.getMonth() +  1, d.getDate(), d.getFullYear()];
date = date.join('/');

  // Create a Token, and finalize it
  // final result will lead to a humongous URL Link
  // with the necessary stuff
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scopes);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  // Paste the final URL format
  window.location = url;
}

function cargarData (){
	var tokenAuth = 'Bearer ' + miStorage.getItem('token');
	console.log("tokeeen  " + tokenAuth);
	var imagesURLS = [];

	//if ( miStorage.getItem("firstTime") ) document.getElementById("classLoader").remove();

	function loadDataFromSpotifyDB(url, callback) {
		const request = new XMLHttpRequest();
		request.open('get', url, true);
		request.setRequestHeader('Accept', 'application/json');
		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('Authorization', tokenAuth);
		request.onload = function () {
			callback(request);
		}
		request.send();
	} 

	function getImagesFromArtists(json, recently){
		var arrayIdsArtists = [];
		for ( var i = 0; i<json.items.length; i++ ) {
			if ( recently ) {
				for ( var j = 0; j<json.items[i].track.artists.length; j++ ) {
					arrayIdsArtists.push(json.items[i].track.artists[j].id);
				}
			}	
			else {
				for ( var j = 0; j<json.items[i].artists.length; j++ ) {
					arrayIdsArtists.push(json.items[i].artists[j].id);
				}
			}
		}
		for (var i = 0; i < arrayIdsArtists.length; i++) {
			loadDataFromSpotifyDB('https://api.spotify.com/v1/artists/'+ arrayIdsArtists[i], function(request) {
				var json = JSON.parse(request.responseText);
				var name = json.name;
				if ( name == "AMMUNATION" ) console.log(json);
				if ( json.images.length > 0 ){
					var image = json.images[0];
					var height, width;
					if ( image != undefined ) {
						url = image.url;
						height = image.height;
						width = image.width;
						if ( width < height ) url = url + 'H'; // MORE Height
						else url = url + 'N'; // NORMAL
						miStorage.setItem(name,url);
					}
				}
				else miStorage.setItem(name, null);
				
			});
		}
	}

	function getTopTracksFromUser(){
		loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/tracks?time_range='+LONG_TERM+`&limit=${50}`, function(request) {
			miStorage.setItem('topTracksLongTerm', request.responseText);
			getImagesFromArtists(JSON.parse(request.responseText), false);
			//targetProxy.countInfoSaved++;
		} );
		loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/tracks?time_range='+MEDIUM_TERM+`&limit=${50}`, function(request) {
			miStorage.setItem('topTracksMediumTerm', request.responseText);
			getImagesFromArtists(JSON.parse(request.responseText), false);
			//targetProxy.countInfoSaved++;
		} );
		loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/tracks?time_range='+SHORT_TERM+`&limit=${50}`, function(request) {
			miStorage.setItem('topTracksShortTerm', request.responseText);
			getImagesFromArtists(JSON.parse(request.responseText), false);
		} );

	}

	function getTopArtistsFromUser(){
		loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/artists?time_range='+LONG_TERM+`&limit=${50}`, function(request) {
			miStorage.setItem('topArtistsLongTerm', request.responseText);
		} );
		loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/artists?time_range='+MEDIUM_TERM+`&limit=${50}`, function(request) {
			miStorage.setItem('topArtistsMediumTerm', request.responseText);
		} );
		loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/artists?time_range='+SHORT_TERM+`&limit=${20}`, function(request) {
			miStorage.setItem('topArtistsShortTerm', request.responseText);
		} );
	}

	function getRecentlyPlayedTracksFromUser(){
		loadDataFromSpotifyDB(`https://api.spotify.com/v1/me/player/recently-played?limit=${50}`, function(request) {
			miStorage.setItem('recentlyPlayed', request.responseText);
			getImagesFromArtists(JSON.parse(request.responseText), true);
		});	
	}

	getTopArtistsFromUser();
	getTopTracksFromUser();
	getRecentlyPlayedTracksFromUser();

}