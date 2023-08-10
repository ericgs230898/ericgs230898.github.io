var listaTracks = document.getElementById("listaTracks");
var bTopTracks = document.getElementById("bTopTracks");

const miStorage = window.localStorage;

var allTime, last6Months, lastMonth;
allTime = document.getElementById("bAllTime");
last6Months = document.getElementById("b6Months");
lastMonth = document.getElementById("bLastMonth");

var limitElement = document.getElementById("rs-bullet");

allTime.className = "active";
TopTracksOnClick();

allTime.onclick = function() {
	allTime.className = "active";
	lastMonth.className = "";
	last6Months.className = "";
	TopTracksOnClick();
}

last6Months.onclick = function() {
	allTime.className = "";
	lastMonth.className = "";
	last6Months.className = "active";
	TopTracksOnClick();
}

lastMonth.onclick = function() {
	allTime.className = "";
	lastMonth.className = "active";
	last6Months.className = "";
	TopTracksOnClick();
}

var buttonCreatePlaylist = document.getElementById("createPlaylist");
buttonCreatePlaylist.onclick = function() {
	var tokenAuth = 'Bearer ' + miStorage.getItem('token');
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
	loadDataFromSpotifyDB('https://api.spotify.com/v1/users/'+ localStorage.getItem('id') +'/playlists?name=TopTracks', function(request) {
			console.log('https://api.spotify.com/v1/users/'+ localStorage.getItem('id') +'/playlists?name=TopTracks');
			//miStorage.setItem('topTracksLongTerm', request.responseText);
			//getImagesFromArtists(JSON.parse(request.responseText), false);
			//targetProxy.countInfoSaved++;
		} ); //https://api.spotify.com/v1/users/me/playlists?name=%22%22&description=%22%22&public=%22false%22
}

function TopTracksOnClick () {
	while( listaTracks.firstChild ){
  		listaTracks.removeChild( listaTracks.firstChild );
	}
	var limit = limitElement.innerHTML;
	var term = "";
	if ( lastMonth.className == "active") term = "short_term";
	else if ( last6Months.className == "active") term = "medium_term";
	else term = "long_term";

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
			if ( item != null && item != undefined  && item != "null" && item != "undefined") {
				var link = item.slice(0, -1);			//+ '"" title="' + json.items[i].name +'"
				if ( item[item.length-1] == 'H') position = position + '<div class="image-cropper"><img src="' + link + '" title="' + artists + '" class="profile-pic"></div>';
				else position = position + '<div class="image-cropper"><img src="' + link  + '" title="' + artists + '" class="profile-pic"></div>';
			}
		}
		else if ( artistsLength > 1 ){
			for ( var j=0; j<artistsLength; j++ ) {
				var name = json.items[i].artists[j].name;
				var item = miStorage.getItem(name);
				if ( item != null && item != undefined  && item != "null" && item != "undefined") {
					var link = item.slice(0, -1);
					if ( item[item.length-1] == 'H') position = position + '<div class="image-cropper"><img src="' + link  + '" title="' + name + '" class="profile-pic2"></div>';
					else position = position + '<div class="image-cropper"><img src="' + link + '" title="' + name + '" class="profile-pic"></div>';
 //innerHTML = '<p class="artistsName"> ' + json.items[i].name + '</p>' + '<div class="image-cropper"><img src=" '+ image.url + '"class="profile-pic"></div><div class="artistData"><p> Popularity: ' + popularity + '</p>';

				}
				if ( (artistsLength-1) == j ) artists = artists + name;
				else artists = artists + name + ", ";
			}
		}
		var li = document.createElement("li");
		li.className = 'item';
		li.innerHTML = '<p>' + json.items[i].name + ' - ' + artists + position + '<div class="artistsData2"><p> Popularity: ' + popularity + '</p></div>';
		listaTracks.appendChild(li);
	}



}
