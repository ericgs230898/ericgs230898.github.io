var listaRecientes = document.getElementById('listaRecientes');
var limitElement = document.getElementById("rs-bullet");
const miStorage = window.localStorage;



RecentlyPlayedOnClick();

function RecentlyPlayedOnClick () {
	while( listaRecientes.firstChild ){
  		listaRecientes.removeChild( listaRecientes.firstChild );
	}
	var limit = limitElement.innerHTML;
	if(limit > 50 ) limit = 50;
	else if ( limit == '' ) limit = 20;

	var json = JSON.parse(miStorage.getItem('recentlyPlayed'));
	console.log(json);
	var innerHTML = "";
	for ( var i=0; i<limit; i++ ) {
		var position = "";
		var artists = "";
		var popularity = json.items[i].track.popularity;
		var artistsLength = json.items[i].track.artists.length;
		var images = [];
		if ( artistsLength == 1 ) {
			artists = json.items[i].track.artists[0].name;
			var item = miStorage.getItem(artists); 
			if ( item != null && item != undefined ) {
				var link = item.slice(0, -1);			//+ '"" title="' + json.items[i].name +'"
				if ( item[item.length-1] == 'H') position = position + '<div class="image-cropper"><img src="' + link + '" title="' + artists + '" class="profile-pic"></div>';
				else position = position + '<div class="image-cropper"><img src="' + link  + '" title="' + artists + '" class="profile-pic"></div>';
			}
		}
		else if ( artistsLength > 1 ){
			for ( var j=0; j<artistsLength; j++ ) {
				var name = json.items[i].track.artists[j].name;
				var item = miStorage.getItem(name);
				if ( item != "null" &&  item != "undefined" && item != null & item != undefined) {
					console.log(item);
					var link = item.slice(0, -1);
					console.log(name + " - " + item);

					//console.log(link);
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
		li.innerHTML = '<p>' + json.items[i].track.name + ' - ' + artists + position + '<div class="artistsData2"><p> Popularity: ' + popularity + '</p></div>';
		listaRecientes.appendChild(li);
	}
}