///Definir variables
var tabArceau;
var tabArceauProx;
var tabBixi;
var tabBixiProx;
var tabStationnement;
var tabStationnementProx;
var coordAfterDrag;
var tabFavorisBixi;
var tabFavorisParking;
var tabFavorisArceau;

//enable control of the markers layers
var markersBixi;
var markersBixiAutour;
var markersArceau;
var markersArceauAutour;
var markersStationnement;
var markersStationnementAutour;
var markersRecherche;
var locateCoord;
var markersFavorisBixi;
var markersFavorisBixiAutour;

//token access
L.mapbox.accessToken = 'pk.eyJ1IjoiY2VkYnVybnMiLCJhIjoiY2lva2w4ejZpMDAxbnVxbTFlNGZ6MTBsNiJ9.9dHf5wHXqEIWwOq4LjiOkg';



///ajouter la carte
var map = L.map('map'
    //activer commentaire ici pour scroller la map avec deux doigts
    // permet de faciliter la lecture de la page web mais rend la 
    // manipulation de la map difficile
    // ,{
    //   gestureHandling: true
    // }
    )
  .setView([45.508, -73.587], 13);
L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png32?access_token={accessToken}',
    {
      maxZoom: 21,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoibm9jYW9wZXIiLCJhIjoiY2pvczBhYm12MGxqbTN2cnY5MnE5NTN4OSJ9.udC8-Uq7DnbKQnXfUFid6g'
    })
.addTo(map);

L.control.locate().addTo(map);


//arnaud addings
var marker;
var circle;
var arnaud = function() {
  map.locate({ watch: true }) /* This will return map so you can do chaining */
    .on('locationfound', function(e){
      if(marker){
        map.removeLayer(marker);
        map.removeLayer(circle);
      }
      locateCoord = [e.longitude, e.latitude];
      marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
      circle = L.circle([e.latitude, e.longitude], 50, {
        weight: 1,
        color: 'blue',
        fillColor: '#cacaca',
        fillOpacity: 0.2
      });
      map.addLayer(marker);
      map.addLayer(circle);
    })
    .on('locationerror', function(e){
      console.log(e);
      alert("Location access denied.");
    });
};

var el, newPoint, newPlace, offset;
$('#slider').on("input", function() {
    $('.output').val(this.value);
    el = $(this);
 
    // Measure width of range input
    width = el.width();
 
    // Figure out placement percentage between left and right of input
    newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
    
    offset = -1;

    // Prevent bubble from going beyond left or right (unsupported browsers)
    if (newPoint < 0) { newPlace = 0; }
    else if (newPoint > 1) { newPlace = width; }
    else { newPlace = width * newPoint + offset; offset -= newPoint; }
 
    // Move bubble
    el
    .next("output")
    .css({
     left: newPlace,
     marginLeft: offset + "%"
    })
     .text(el.val());
    
    }).trigger("change");

///ajouter boutons sur carte
L.control.fullscreen().addTo(map);
var myMapBoxGeo = L.mapbox.geocoderControl('mapbox.places',
    {
      
    }).addTo(map);
L.control.ruler().addTo(map);

var cercle;
var coord;
var newradius;
var rayonchoose = function(coord){
        if(cercle){
            map.removeLayer(cercle);
        }
    
        cercle = new L.circle([coord[1], coord[0]], { 
                radius: newradius, 
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2 });
    
        map.addLayer(cercle);
}

$('#slider').on("input", function() {
    if(cercle){
            map.removeLayer(cercle);
    }
    newradius = this.value;
    if(markersRecherche._map){
        if(coordAfterDrag){
            cercle = new L.circle([coordAfterDrag[1], coordAfterDrag[0]], { 
                radius: this.value, 
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2 });
            drawProximity(coordAfterDrag);
            map.addLayer(cercle);
        }else if(coord){
            cercle = new L.circle([coord[1], coord[0]], { 
                radius: this.value, 
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2 });
            drawProximity(coord);
            map.addLayer(cercle);
        }
    }
    
    if(circle){
        map.removeLayer(circle);
    }
    
    if(locateCoord){
        circle = new L.circle([locateCoord[1], locateCoord[0]], {
            radius: this.value,
            weight: 1,
            color: 'blue',
            fillColor: '#cacaca',
            fillOpacity: 0.2 });
        if(coordAfterDrag){
            if(markersRecherche._map){
                drawProximityBothCoord(locateCoord,coordAfterDrag);  
            }else{
                drawProximity(locateCoord);
            }
        }else{
            drawProximity(locateCoord);
        }
        map.addLayer(circle);
    }
});

var drawTheSearchedMarker = function(coord) {
  markersRecherche.clearLayers();
  map.removeLayer(markersRecherche);
  if(cercle){
    map.removeLayer(cercle);
  }
  map.addLayer(markersRecherche);

  var htmlSingle = '<div class="markerRech"></div>';
  var myIconCustum = L.divIcon({
    html: htmlSingle,
    className: 'pointRecherche',
    iconSize: L.point(52, 86),
    iconAnchor: [22, 77],
    popupAnchor: [0, -79]
  });
    
  newradius = 50;
  cercle = L.circle([coord[1], coord[0]], newradius, {
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2
            });
  map.addLayer(cercle);

  var aLayer = L.marker([coord[1], coord[0]], {
    clickable: true,
    icon: myIconCustum,
    draggable: true,
  })
  .bindPopup(
      "<p>Je suis ici</p>"
      );
  aLayer._myId = 6;
  coordAfterDrag = [coord[0], coord[1]];
  aLayer.on('drag', function(e) {
    let marker = e.target;
    let position = marker.getLatLng();
  });
  aLayer.on('dragend', function(e) {
    let marker = e.target;
    let position = marker.getLatLng();
    map.panTo(new L.LatLng(position.lat, position.lng), {animate: true, duration: 1.2});
    map.removeLayer(markersBixiAutour);
    coordAfterDrag = [position.lng, position.lat];
    drawProximity(coordAfterDrag);
    rayonchoose(coordAfterDrag);
  });
  markersRecherche.addLayer(aLayer);
};

var drawProximityBixi=function(coord){
    tabBixiProx = [];
   markersBixiAutour.clearLayers();
   map.removeLayer(markersBixiAutour);
   map.addLayer(markersBixiAutour);
    
   const pointRech = new LatLon(coord.lat,coord.long);     
    
    tabSchema = dbl.getSchema().table('bixi');
      dbl.select().from(tabSchema)
        .exec().then(
          function(rows) {
            let it;
            for(let i=0;i<rows.length;++i){
              let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
              let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
              if (dist <= 500) {
                tabBixiProx.push(rows[i]);
              }
            }
            updateBixi(tabBixiProx, markersBixiAutour);
          });
};

var ac;
var drawProximity=function(coord){
  //tabArceauProx = [];
  //tabBixiProx = [];
  tabStationnementProx = [];
  
  /*markersArceauAutour.clearLayers();
  map.removeLayer(markersArceauAutour);
  map.addLayer(markersArceauAutour);

  markersBixiAutour.clearLayers();
  map.removeLayer(markersBixiAutour);
  map.addLayer(markersBixiAutour);*/
    
  markersStationnementAutour.clearLayers();
  map.removeLayer(markersStationnementAutour);
  map.addLayer(markersStationnementAutour);

  const pointRech = new LatLon(coord[1],coord[0]);

  /*let tabSchema = dbl.getSchema().table('arceau');
  dbl.select().from(tabSchema)
    .exec().then(
      function(rows) {
        let it;
        for(let i=0;i<rows.length;++i){
          let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
          let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
           if (dist <= newradius) {
            tabArceauProx.push(rows[i]);
          }
        }
        updateArceau(tabArceauProx, markersArceauAutour);
      });

  tabSchema = dbl.getSchema().table('bixi');
  dbl.select().from(tabSchema)
    .exec().then(
      function(rows) {
        let it;
        for(let i=0;i<rows.length;++i){
          let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
          let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
          if (dist <= newradius) {
            tabBixiProx.push(rows[i]);
          }
        }
        updateBixi(tabBixiProx, markersBixiAutour);
      });*/

  let tabStat = dbl.getSchema().table('stationnement');
  let tabStat2 = dbl.getSchema().table('stationnement2');
  dbl.select().from(tabStat, tabStat2)
    .where(tabStat.stationId.eq(tabStat2.stationId))
    .exec().then(
      function(rows) {
	let it;
        for(let i=0;i<rows.length;++i){
	  ac = rows[i];
          let point = new LatLon(Dms.parseDMS(rows[i].stationnement.lat), Dms.parseDMS(rows[i].stationnement.long));
          let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
          if (dist <= newradius/3) {
            tabStationnementProx.push(rows[i]);
          }
        }
        updateStationnementProximite(tabStationnementProx, markersStationnementAutour);
      });
	
//   dbl.select().from(tabSchema)
//     .exec().then(
//       function(rows) {
//         let it;
//         for(let i=0;i<rows.length;++i){
//           let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
//           let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
//           if (dist <= newradius/3) {
//             tabStationnementProx.push(rows[i]);
//           }
//         }
//         updateStationnementProximite(tabStationnementProx, markersStationnementAutour);
//       });

};

var drawProximityBothCoord=function(coord, otherCoord){
  tabArceauProx = [];
  tabBixiProx = [];
  tabStationnementProx = [];
  
  markersArceauAutour.clearLayers();
  map.removeLayer(markersArceauAutour);
  map.addLayer(markersArceauAutour);

  markersBixiAutour.clearLayers();
  map.removeLayer(markersBixiAutour);
  map.addLayer(markersBixiAutour);
    
  markersStationnementAutour.clearLayers();
  map.removeLayer(markersStationnementAutour);
  map.addLayer(markersStationnementAutour);

  const pointRech = new LatLon(coord[1],coord[0]);
  const autrePoint = new LatLon(otherCoord[1],otherCoord[0]);
    console.log(tabArceau);
    console.log(tabBixi);
    console.log(tabStationnement);

  let tabSchema = dbl.getSchema().table('arceau');
  dbl.select().from(tabSchema)
    .exec().then(
      function(rows) {
        let it;
        for(let i=0;i<rows.length;++i){
            let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
            let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
            let otherDist = parseFloat(autrePoint.distanceTo(point).toPrecision(4));
            if (dist <= newradius || otherDist <= newradius) {
                tabArceauProx.push(rows[i]);
            }
        }
        updateArceau(tabArceauProx, markersArceauAutour);  
      });
  

  tabSchema = dbl.getSchema().table('bixi');
  dbl.select().from(tabSchema)
    .exec().then(
      function(rows) {
        let it;
        for(let i=0;i<rows.length;++i){
            let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
            let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
            let otherDist = parseFloat(autrePoint.distanceTo(point).toPrecision(4));
            if (dist <= newradius || otherDist <= newradius) {
                tabBixiProx.push(rows[i]);
            }
        }
        updateBixi(tabBixiProx, markersBixiAutour);
      });
  
    
  tabSchema = dbl.getSchema().table('stationnement');
  dbl.select().from(tabSchema)
    .exec().then(
      function(rows) {
        let it;
        for(let i=0;i<rows.length;++i){
          let point = new LatLon(Dms.parseDMS(rows[i].lat), Dms.parseDMS(rows[i].long));
          let dist = parseFloat(pointRech.distanceTo(point).toPrecision(4));
          let otherDist = parseFloat(autrePoint.distanceTo(point).toPrecision(4));
          if (dist <= newradius/3 || otherDist <= newradius/3) {
              tabStationnementProx.push(rows[i]);
          }
        }
        updateStationnement(tabStationnementProx, markersStationnementAutour);
      });  
};

myMapBoxGeo.on('select', function(object){
  coord = object.feature.geometry.coordinates;
  drawTheSearchedMarker(coord);
  drawProximity(coord);
});

myMapBoxGeo.on('autoselect', function(object){
  coord = object.feature.geometry.coordinates;
  drawTheSearchedMarker(coord);
  drawProximity(coord);
});



///fullscreen function
window.screen.orientation.onchange = function (){
  if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
    if(screen.orientation.type == 'portrait-primary'){
      if (map.isFullscreen()) {
      } else {
        map.toggleFullscreen();
      }
    } else {
      if (map.isFullscreen()) {
        map.toggleFullscreen();
      }
    }
  } else {
    // alert(screen.orientation.type);
    if(screen.orientation.type == 'landscape-primary'){
      if (map.isFullscreen()) {
        //do nothing, we want fullscreen and its true
      } else {
        map.toggleFullscreen();
      }
    } else {
      if (map.isFullscreen()) {
        //we want to close fullscreen if its in portrait
        map.toggleFullscreen();
      }
    }
  }
};



///init markers
function initMarkersLayers() {
	
	markersFavorisBixi = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleFavorisBixi">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });
	
  markersBixi = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleBixi">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });

  markersBixiAutour = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleBixi">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });

  markersArceau = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleArceau">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });

  markersArceauAutour = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleArceau">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });
    
  markersStationnement= new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleStationnement">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });

  markersStationnementAutour = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleStationnement">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });

  markersRecherche = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circleRech">' + markers.length + '</div>';
      return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(52, 86)});
    },
    spiderfyOnMaxZoom: true, showCoverageOnHover: true, zoomToBoundsOnClick: true
  });

  var overlay = {
	"Favoris": markersFavorisBixi,
    "Bixis": markersBixi,
    "Bixis Autour": markersBixiAutour,
    "Arceaux": markersArceau,
    //"Arceaux (Autour 900m)": markersArceauAutour,
    "Stationnements": markersStationnement,
    "Stationnement Autour": markersStationnementAutour,
    "R&eacute;sultat de Recherche": markersRecherche
  }
  L.control.layers(null, overlay).addTo(map);
};
