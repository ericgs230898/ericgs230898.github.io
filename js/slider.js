var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);
rangeSlider.onchange = function() {
	if ( document.title == "Top Tracks") TopTracksOnClick();
	else if ( document.title == "Top Artists" ) TopArtistasOnClick();
	else RecentlyPlayedOnClick();
}

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  rangeBullet.style.left = (bulletPosition * 96) + "px";
}
