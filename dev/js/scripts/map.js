var map = L.map('mapid', {
	scrollWheelZoom: false
}).setView([44.053610, -123.091205], 12);

	
// Set up cards
var cards = "";
var cardswrap = document.getElementById("cards");

// See: https://carto.com/location-data-services/basemaps/
var carto = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
var osm = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var cartoc = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>';
var osmc = 'Map data &copy; <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>';

L.tileLayer(carto, {
	maxZoom: 18,
	attribution: cartoc
}).addTo(map);

// Grab data from CSV
omnivore.csv('data/olcc_lane_retailers_geocoded_2017_0707.csv')
.on('ready', function(layer) {
	
	this.eachLayer(function(marker) {
		
		// Set variables for each loop --- Not very efficient...
		var mID = marker.toGeoJSON().properties.id;
		var mMed = marker.toGeoJSON().properties.med;
		var mDelivery = marker.toGeoJSON().properties.delivery;
		var mName = marker.toGeoJSON().properties.name;
		var mStreet = marker.toGeoJSON().properties.street;
		var mCity = marker.toGeoJSON().properties.city;
		var mZip = marker.toGeoJSON().properties.zip;
		var mStatus;
		var mStatusLower;
		
		if (mMed == 'TRUE'){
			mStatusLower = 'med';
			mStatus = 'Medical grade';
		} else {
			mStatusLower = 'active';
			mStatus = 'Active';
		}
		
		
		// Adds a card to the cards empty string variable
		addCard(mID,mStatus,mStatusLower,mDelivery,mName,mStreet,mCity,mZip);
		
		if (mStatusLower === 'med') {
			marker.setIcon(
				L.icon({
					iconUrl: 'media/med.png',
					shadowUrl: 'media/shadow.png',
					
					iconSize:     [10,10], // size of the icon
					shadowSize:   [10,10], // size of the shadow
					iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
					shadowAnchor: [-2,-2],  // the same for the shadow
					popupAnchor:  [6,0] // point from which the popup should open relative to the iconAnchor
				}));
		} else {
			marker.setIcon(
				L.icon({
					iconUrl: 'media/approved.png',
					shadowUrl: 'media/shadow.png',
					
					iconSize:     [10,10], // size of the icon
					shadowSize:   [10,10], // size of the shadow
					iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
					shadowAnchor: [-2,-2],  // the same for the shadow
					popupAnchor:  [6,0] // point from which the popup should open relative to the iconAnchor
				}));
		}
		
		// Bind a popup to each icon based on the same properties
		//marker.bindTooltip(mName);
		
		// Go to proper card on click
		marker.on('click', function(){
			// Reset any other backgrounds
			$('.card').css("background","none");
			// Get destination ID
			var dest = "#" + mID;
			// Go there
			$('html, body').animate({
				scrollTop: $(dest).offset().top - 50
			}, 1500, function(){
				$(dest).css("background","rgba(136,136,136,.3)");
			});
		});
		
		// Bind a pop up on click
		//marker.bindPopup(mName + '<br>' + mAddress);
	});
	
	// Assign cards
	cardswrap.innerHTML = cards;
	
	// Insert the ads AFTER the cards have been applied
	placeAds();
	
})
.addTo(map);
