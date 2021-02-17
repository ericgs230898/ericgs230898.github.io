const tokenAuth = 'Bearer BQB6N8dzNMcZcRLT-8EDCWz1q2KIE5Mievty6rqxFlfaEOfBpJ9Qn0zLQ48Hpo6apS6TTBucJrHQZTuQ5emgmfkKnDKLNVuMzYlM7fEzV1bQ7zQf2F9fHfwGxZWT2Z7v9-3Y8yE3wR9_-5HpbaD4jZKtAQCHXFbP-ztMYrn6iXb-r81sfvNLfvbJKyr9dIMjfKMDI0FK8vL8R4cDIOp4Iw-nXOKsXlvhxcOz07Qs6t7LnJ9-9rqxHYpqFleiRjr-UHk02Av7h56wnQ';
const LONG_TERM = 'long_term';
const MEDIUM_TERM = 'medium_term';
const SHORT_TERM = 'short_term';

const miStorage = window.localStorage;

var imagesURLS = [];

if ( miStorage.getItem("firstTime") ) document.getElementById("classLoader").remove();

var targetObj = {};
var targetProxy = new Proxy(targetObj, {
  set: function (target, key, value) {
      	
      if ( targetProxy.countInfoSaved == 6 ) {
      	setTimeout(() => { document.getElementById("classLoader").remove();
      						miStorage.setItem("firstTime", true)}, 1000)};
      target[key] = value;
      return true;
  }
});
targetProxy.countInfoSaved = 0;


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
		targetProxy.countInfoSaved++;
	} );
	loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/tracks?time_range='+MEDIUM_TERM+`&limit=${50}`, function(request) {
		miStorage.setItem('topTracksMediumTerm', request.responseText);
		getImagesFromArtists(JSON.parse(request.responseText), false);
		targetProxy.countInfoSaved++;
	} );
	loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/tracks?time_range='+SHORT_TERM+`&limit=${50}`, function(request) {
		miStorage.setItem('topTracksShortTerm', request.responseText);
		getImagesFromArtists(JSON.parse(request.responseText), false);
		targetProxy.countInfoSaved++;
	} );

}

function getTopArtistsFromUser(){
	loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/artists?time_range='+LONG_TERM+`&limit=${50}`, function(request) {
		miStorage.setItem('topArtistsLongTerm', request.responseText);
		targetProxy.countInfoSaved++;
	} );
	loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/artists?time_range='+MEDIUM_TERM+`&limit=${50}`, function(request) {
		miStorage.setItem('topArtistsMediumTerm', request.responseText);
		targetProxy.countInfoSaved++;
	} );
	loadDataFromSpotifyDB('https://api.spotify.com/v1/me/top/artists?time_range='+SHORT_TERM+`&limit=${20}`, function(request) {
		miStorage.setItem('topArtistsShortTerm', request.responseText);
		targetProxy.countInfoSaved++;
	} );
}

function getRecentlyPlayedTracksFromUser(){
	loadDataFromSpotifyDB(`https://api.spotify.com/v1/me/player/recently-played?limit=${50}`, function(request) {
		miStorage.setItem('recentlyPlayed', request.responseText);
		getImagesFromArtists(JSON.parse(request.responseText), true);
		targetProxy.countInfoSaved++;
	});	
}

getTopArtistsFromUser();
getTopTracksFromUser();
getRecentlyPlayedTracksFromUser();
