var listaTracks = document.getElementById("listaTracks");
var bTopTracks = document.getElementById("bTopTracks");

const miStorage = window.localStorage;

bTopTracks.onclick = function() {
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