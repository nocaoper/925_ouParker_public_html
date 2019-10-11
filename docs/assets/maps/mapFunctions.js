var baseURL = new URL(window.location.origin);

function favoritesShow(){
	let refFavorisBixi = db.ref('favoritesBIXI/' + firebase.auth().currentUser.uid);
	refFavorisBixi.once('value').then(function(snap) {
		tabFavorisBixi = snap.val();
		console.log(tabFavorisBixi);
		updateFavorisBixi(tabFavorisBixi, markersFavorisBixi);
	});
	
	let refFavorisParking = db.ref('favoritesParking/' + firebase.auth().currentUser.uid);
	refFavorisParking.once('value').then(function(snap) {
		tabFavorisParking = snap.val();
		console.log(tabFavorisParking);
		updateStationnement(tabFavorisParking, markersFavorisBixi);
	});
	
	let refFavorisArceau = db.ref('favoritesArceau/' + firebase.auth().currentUser.uid);
	refFavorisArceau.once('value').then(function(snap) {
		tabFavorisArceau = snap.val();
		console.log(tabFavorisArceau);
		updateUnArceauFavoris(tabFavorisArceau, markersFavorisBixi);
	});
}

function isUniqueBIXI(theDescription, callback){
		var tab;
		var unique = true;
		var count = 0;
		var ctr = 0;
		ref = db.ref('favoritesBIXI/' + firebase.auth().currentUser.uid);
		ref.once('value').then(function(snap){ 
		
			tab = snap.val(); 
			console.log(snap.numChildren());
			if(snap.numChildren() == 0){
				callback(unique);
			}
			var query = firebase.database().ref('favoritesBIXI/' + firebase.auth().currentUser.uid).orderByKey();
			query.once("value", function(snapshot) { //once instead of on
			  snapshot.forEach(function(childSnapshot, index, array) {
				  count++;
				if(childSnapshot.val().description == theDescription){
					unique = false;
				}
				if(snap.numChildren() == count){
					if(unique == false){
						console.log("FALSE");
						callback(unique);
						//return false;
					}else{
						console.log("TRUE2");
						callback(unique);
						//return true;
					}
				}
			  });
			}, function(error) {
			  console.error(error);
			});
		});
}

function isUniqueParking(theStationId, callback){
		var tab;
		var unique = true;
		var count = 0;
		var ctr = 0;
		ref = db.ref('favoritesParking/' + firebase.auth().currentUser.uid);
		ref.once('value').then(function(snap){ 
			tab = snap.val(); 
			console.log(snap.numChildren());
			if(snap.numChildren() == 0){
				callback(unique);
			}
			var query = firebase.database().ref('favoritesParking/' + firebase.auth().currentUser.uid).orderByKey();
			query.once("value", function(snapshot) { //once instead of on
			  snapshot.forEach(function(childSnapshot, index, array) {
				  count++;
				if(childSnapshot.val().ID == theStationId){
					unique = false;
				}
				if(snap.numChildren() == count){
					callback(unique);
					if(unique == false){
						console.log("FALSEP");
					}else{
						console.log("TRUEP");
					}
				}
			  });
			}, function(error) {
			  console.error(error);
			});
		});
}

function isUniqueArceau(theStationId, callback){
		var tab;
		var unique = true;
		var count = 0;
		var ctr = 0;
		ref = db.ref('favoritesArceau/' + firebase.auth().currentUser.uid);
		ref.once('value').then(function(snap){ 
			tab = snap.val(); 
			console.log(snap.numChildren());
			if(snap.numChildren() == 0){
				callback(unique);
			}
			var query = firebase.database().ref('favoritesArceau/' + firebase.auth().currentUser.uid).orderByKey();
			query.once("value", function(snapshot) { //once instead of on
			  snapshot.forEach(function(childSnapshot, index, array) {
				  count++;
				if(childSnapshot.val().ID == theStationId){
					unique = false;
				}
				if(snap.numChildren() == count){
					callback(unique);
				}
			  });
			}, function(error) {
			  console.error(error);
			});
		});
}

function addFavorite(feat) {
    return function(ev) {
	
	
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
				// User is signed in.
			alert(feat.rue);
			
			var db = firebase.database();
			var ref = db.ref('favoritesBIXI/' + firebase.auth().currentUser.uid);
			isUniqueBIXI(feat.rue, function(unique) {
			
		//if(isUniqueParking(feat.stationId)){
			if(unique){
		//console.log(isUniqueBIXI(feat.rue));
		//if(isUniqueBIXI(feat.rue)){
			
			object = {id: firebase.auth().currentUser.uid, description: feat.rue, ID: feat.stationId, available: feat.dispo , occupied: feat.total, time: feat.time, lat: feat.lat, long: feat.long};
			console.log(object);
				var newCharmRef = ref.push(object, err => {
					if (err) {
						console.error("error saving to firebase", err);
					}
				})
				var hopperRef = db.ref('favoritesBIXI/' + firebase.auth().currentUser.uid + '/' + newCharmRef.key);
				hopperRef.update({
				  "deletion_key": newCharmRef.key
				});
			}else{
				alert("Already in favorite");
			}
		});
		}else {
				alert("Not logged in");
		}
		});
	} 
}

function addFavoriteParking(feat) {
    return function(ev) {
	
	
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
				// User is signed in.
			alert(feat.stationId);
			
			var db = firebase.database();
			var ref = db.ref('favoritesParking/' + firebase.auth().currentUser.uid);
		//console.log(isUniqueParking(feat.stationId));
		isUniqueParking(feat.stationId, function(unique) {
			
		//if(isUniqueParking(feat.stationId)){
			if(unique){
				console.log("IN");
				object = {id: firebase.auth().currentUser.uid, description: feat.rue, ID: feat.stationId, lat: feat.lat, long: feat.long};
				console.log(object);
					var newCharmRef = ref.push(object, err => {
						console.log("PUSHED");
						if (err) {
							console.error("error saving to firebase", err);
						}
					})
					var hopperRef = db.ref('favoritesParking/' + firebase.auth().currentUser.uid + '/' + newCharmRef.key);
					hopperRef.update({
					  "deletion_key": newCharmRef.key
					});
				}else{
					alert("Already in favorite");
				}
		});
		}else {
				alert("Not logged in");
		}
		});
	} 
}

function addFavoriteArceau(feat) {
    return function(ev) {
	
	
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
				// User is signed in.
			alert(feat.stationId);
			
			var db = firebase.database();
			var ref = db.ref('favoritesArceau/' + firebase.auth().currentUser.uid);
		//console.log(isUniqueParking(feat.stationId));
		isUniqueArceau(feat.stationId, function(unique) {
			
		//if(isUniqueParking(feat.stationId)){
			if(unique){
				//console.log("IN");
				object = {id: firebase.auth().currentUser.uid, ID: feat.stationId, lat: feat.lat, long: feat.long};
				console.log(object);
					var newCharmRef = ref.push(object, err => {
						//console.log("PUSHED");
						if (err) {
							console.error("error saving to firebase", err);
						}
					})
					var hopperRef = db.ref('favoritesArceau/' + firebase.auth().currentUser.uid + '/' + newCharmRef.key);
					hopperRef.update({
					  "deletion_key": newCharmRef.key
					});
				}else{
					alert("Already in favorite");
				}
		});
		}else {
				alert("Not logged in");
		}
		});
	} 
}

var updateBixi = function(data, layer) {
  layer.clearLayers();
  map.removeLayer(layer);
  map.addLayer(layer);
  $.each(data, function (index, element) {
    var htmlSingle = '<div class="circleBixiSingle">' + '<progress id="health" value="' + element.dispo + '" max="' + (element.dispo+element.total) + '"></progress>' + '</div>';
    var myIconCustum = L.divIcon({
      html: htmlSingle,
      className: 'unBixi',
      iconSize: L.point(52, 86),
      iconAnchor: [22, 77],
      popupAnchor: [0, -79]
    });
    var dateUpdate = new Date(element.time);
    var tempsBixiDernierAcces = dateUpdate.format("hh:mm:ss tt");
    var aLayer = L.marker([element.lat, element.long], {
      clickable: true,
      icon: myIconCustum
    })
    .bindPopup("<button id='some'>Favorite</button>"
	    + "<p>" + element.rue + "</p>"
        + "<p>Station de velo: " + element.stationId + "</p>"
        + "<p>Velos disponibles: " + element.dispo + " / " + (element.dispo+element.total) + "</p>"
        + "<p>Dernier mise &agrave; jour: " + tempsBixiDernierAcces + "</p>"
        )
      ;
	  	aLayer.on('popupopen', function(){
		L.DomEvent.on( 
			 document.getElementById('some'), 
			 'click',
			 addFavorite(element)
		);
	}); 
    aLayer._myId = 12;
    layer.addLayer(aLayer);
  });
};

var updateFavorisBixi = function(data, layer) {
  layer.clearLayers();
  map.removeLayer(layer);
  map.addLayer(layer);
  $.each(data, function (index, element) {
    var htmlSingle = '<div class="circleFavoriSingle">' + '<progress id="health" value="' + element.available + '" max="' + (element.occupied + element.available) + '"></progress>' + '</div>';
    var myIconCustum = L.divIcon({
      html: htmlSingle,
      className: 'unBixi',
      iconSize: L.point(52, 86),
      iconAnchor: [22, 77],
      popupAnchor: [0, -79]
    });
    var dateUpdate = new Date(Number(element.time));
    var tempsBixiDernierAcces = dateUpdate.format("hh:mm:ss tt");
    var aLayer = L.marker([element.lat, element.long], {
      clickable: true,
      icon: myIconCustum
    })
	
    .bindPopup("<p>" + element.description + "</p>"
		+ "<p>Station de velo: " + element.ID + "</p>"
        + "<p>Velos disponibles: " + element.available + " / " + (element.occupied + element.available) + "</p>"
		+ "<p>Dernier mise &agrave; jour: " + tempsBixiDernierAcces + "</p>"
        )
      ;
	  
	  
    aLayer._myId = 8;
    layer.addLayer(aLayer);
  });
};

var updateArceau = function(data, layer){
  layer.clearLayers();
  map.removeLayer(layer);
  map.addLayer(layer);
  $.each(data, function (index, element) {
    updateUnArceau(element, layer);
  });
};

var updateUnArceau = function(data, layer) {
  var htmlSingle = '<div class="circleArceauSingle"></div>';
  var myIconCustum = L.divIcon({
    html: htmlSingle,
    className: 'unArceau',
    iconSize: L.point(52, 86),
    iconAnchor: [22, 77],
    popupAnchor: [0, -79]
  });
  var aLayer = L.marker([data.lat, data.long], {
    clickable: true,
    icon: myIconCustum
  })
    .bindPopup("<button id='some3'>Favorite</button>" +
      "<p>ID arceau: " + data.stationId + "</p>"
    );
		aLayer.on('popupopen', function(){
			L.DomEvent.on( 
				 document.getElementById('some3'), 
				 'click',
				 addFavoriteArceau(data)
			);
		}); 
  aLayer._myId = 7;
  layer.addLayer(aLayer);
};

var updateUnArceauFavoris = function(data, layer) {
	
	map.addLayer(layer);
    $.each(data, function (index,element) {
        var htmlSingle = '<div class="circleFavoriSingle"></div>';
        var myIconCustum = L.divIcon({
            html: htmlSingle,
            className: 'unStationnement',
            iconSize: L.point(52, 86),
            iconAnchor: [22, 77],
            popupAnchor: [0, -79]
        });
        var aLayer = L.marker([element.lat, element.long], {
            clickable: true,
            icon: myIconCustum
        })
        .bindPopup("<p>ID arceau: " + element.ID + "</p>"
            )
          ;
        aLayer._myId = 7;
        layer.addLayer(aLayer);
    });     
};
/*
var updateUnArceauFavoris = function(data, layer) {
  var htmlSingle = '<div class="circleArceauSingle"></div>';
  var myIconCustum = L.divIcon({
    html: htmlSingle,
    className: 'unArceau',
    iconSize: L.point(52, 86),
    iconAnchor: [22, 77],
    popupAnchor: [0, -79]
  });
  var aLayer = L.marker([data.lat, data.long], {
    clickable: true,
    icon: myIconCustum
  })
    .bindPopup("<p>ID arceau: " + data.stationId + "</p>"
    );
  aLayer._myId = 7;
  layer.addLayer(aLayer);
};
*/
var updateStationnementProximiteFavoris = function(data, layer) {
    layer.clearLayers();
    map.removeLayer(layer);
    map.addLayer(layer);
    $.each(data, function (index,element) {
      doQuery(element.stationId).then(
        function(tab){
          let stringDispo = 'Non';
          let styleDispo = '<div class="circleStationnementNotAvailable"></div>';
          if(dispo(tab)){
            stringDispo='Oui'
            styleDispo = '<div class="circleFavoriSingle"></div>';
          }
          var htmlSingle = styleDispo;
          var myIconCustum = L.divIcon({
            html: htmlSingle,
            className: 'unStationnement',
            iconSize: L.point(52, 86),
            iconAnchor: [22, 77],
            popupAnchor: [0, -79]
          });
          var aLayer = L.marker([element.lat, element.long], {
            clickable: true,
            icon: myIconCustum
          })
		  /*
            .bindPopup("<button id='some'>Favorite</button>"
			  + "<p>ID Stationnement: " + element.stationId + "</p>"
              + "<p>nom de rue: " + element.rue + "</p>"
              + "<p>Heures de disponibilit&eacute;:" + affHeures(tab)+ "</p>"
              + "<p>Disponible: " + stringDispo + "</p>"
            )
          ;
		aLayer.on('popupopen', function(){
			L.DomEvent.on( 
				 document.getElementById('some'), 
				 'click',
				 addFavoriteParking(element)
			);
		}); 
		*/
		.bindPopup("<p>ID Stationnement: " + element.ID + "</p>"
              + "<p>nom de rue: " + element.description + "</p>"
              + "<p>Heures de disponibilit&eacute;:" + affHeures(tab)+ "</p>"
              + "<p>Disponible: " + stringDispo + "</p>"
            )
          ;
          aLayer._myId = 19;
          layer.addLayer(aLayer);

        }
      );
    });    
};

var updateStationnementProximite = function(data, layer) {
    layer.clearLayers();
    map.removeLayer(layer);
    map.addLayer(layer);
    $.each(data, function (index,element) {
      doQuery(element.stationnement.stationId).then(
        function(tab){
          let stringDispo = 'Non';
          let styleDispo = '<div class="circleStationnementNotAvailable"></div>';
          if(dispo(tab)){
            stringDispo='Oui'
            styleDispo = '<div class="circleStationnementSingle"></div>';
          }
          let heuresStr = affHeures(tab);
          if(!heuresStr){
            heuresStr = "Pas d'heures aujourd'hui.";
          }
          var htmlSingle = styleDispo;
          var myIconCustum = L.divIcon({
            html: htmlSingle,
            className: 'unStationnement',
            iconSize: L.point(52, 86),
            iconAnchor: [22, 77],
            popupAnchor: [0, -79]
          });
          var aLayer = L.marker([element.stationnement.lat, element.stationnement.long], {
            clickable: true,
            icon: myIconCustum
          })
            .bindPopup("<button id='some2'>Favorite</button>" + "<button id='bixiAround' style='visibility: hidden;'>montrer Bixi Autour</button>"
			  + "<p>ID Stationnement: " + element.stationnement.stationId + "</p>"
              + "<p>nom de rue: " + element.stationnement.rue + "</p>"
              + "<p>Heures de disponibilit&eacute;:" + heuresStr + "</p>"
              + "<p>Disponible: " + stringDispo + "</p>"
	      + "<p>Cout: " + element.stationnement2.nTarifHoraire + "</p>"
            )
          ;
		  	aLayer.on('popupopen', function(){
			L.DomEvent.on( 
				 document.getElementById('some2'), 
				 'click',
				 addFavoriteParking(element.stationnement)
			);
			L.DomEvent.on( 
				 document.getElementById('bixiAround'), 
				 'click',
				 drawProximityBixi(element.stationnement)
			);
		}); 
          aLayer._myId = 10;
          layer.addLayer(aLayer);

        }
      );
    });    
};

var updateStationnement = function(data, layer) {
	
	    map.addLayer(layer);
    $.each(data, function (index,element) {
		doQuery(element.ID).then(
        function(tab){
			let stringDispo = 'Non';
          let styleDispo = '<div class="circleStationnementNotAvailable"></div>';
          if(dispo(tab)){
            stringDispo='Oui'
            styleDispo = '<div class="circleFavoriSingle"></div>';
          }
        var htmlSingle = '<div class="circleFavoriSingle"></div>';
        var myIconCustum = L.divIcon({
            html: htmlSingle,
            className: 'unStationnement',
            iconSize: L.point(52, 86),
            iconAnchor: [22, 77],
            popupAnchor: [0, -79]
        });
        var aLayer = L.marker([element.lat, element.long], {
            clickable: true,
            icon: myIconCustum
        })
        .bindPopup("<p>ID Stationnement: " + element.ID + "</p>"
            + "<p>nom de rue: " + element.description + "</p>"
			+ "<p>Heures de disponibilit&eacute;:" + affHeures(tab)+ "</p>"
            + "<p>Disponible: " + stringDispo + "</p>"
            )
          ;
        aLayer._myId = 10;
        layer.addLayer(aLayer);
		}
      );
    });   
	/*
    layer.clearLayers();
    map.removeLayer(layer);
    map.addLayer(layer);
    $.each(data, function (index,element) {
        var htmlSingle = '<div class="circleStationnementSingle"></div>';
        var myIconCustum = L.divIcon({
            html: htmlSingle,
            className: 'unStationnement',
            iconSize: L.point(52, 86),
            iconAnchor: [22, 77],
            popupAnchor: [0, -79]
        });
        var aLayer = L.marker([element.lat, element.long], {
            clickable: true,
            icon: myIconCustum
        })
        .bindPopup("<p>ID Stationnement: " + element.stationId + "</p>"
            + "<p>nom de rue: " + element.rue + "</p>"
            )
          ;
        aLayer._myId = 10;
        layer.addLayer(aLayer);
    });
*/    
};

let bixiShown=false;
let bixiFirstTime=true;
var getAllBixi = function(){
  let btnBixi = $('#loadBixis');
  if(!bixiShown){
    if(bixiFirstTime){
      let tabSchema = dbl.getSchema().table('bixi');
      dbl.select().from(tabSchema)
        .exec().then(
            function(rows) {
              updateBixi(rows, markersBixi);
            });
      bixiFirstTime=false;
    } else {
      $('span:contains(" Bixis"):not(:contains("200"))').prev().click();
    }
    btnBixi.html('<i class="far fa-eraser"> Cacher Bixis <i class="fal fa-bicycle"></i>');
    bixiShown=true;
  } else {
    $('span:contains(" Bixis"):not(:contains("200"))').prev().click();
    bixiShown=false;
    btnBixi.html('<i class="fal fa-bicycle"></i>Afficher Bixis');
  }
};

let arceauShown=false;
let arceauFirstTime=true;
var getAllArceau = function(){
  let btnArceau=$('#loadArceau');
  if(!arceauShown) {
    if(arceauFirstTime){
      let tabSchema = dbl.getSchema().table('arceau');
      dbl.select().from(tabSchema)
        .exec().then(
            function(rows) {
              updateArceau(rows, markersArceau);
            });
      arceauFirstTime=false;
    } else {
      $('span:contains("Arceaux"):not(:contains("900"))').prev().click();
    }
    btnArceau.html('<i class="far fa-eraser"> Cacher Arceaux <i class="far fa-tally"></i>');
    arceauShown=true;
  } else {
    $('span:contains("Arceaux"):not(:contains("900"))').prev().click();
    arceauShown=false;
    btnArceau.html('<i class="far fa-tally"></i>Afficher Arceaux');
  }
};

let stationnementShown=false;
let stationnementFirstTime=true;
var getAllStationnement = function(){
  let btnStationnement=$('#loadStationnement');
  if(!stationnementShown){
    if(stationnementFirstTime){
      let tabSchema = dbl.getSchema().table('stationnement');
      dbl.select().from(tabSchema)
        .exec().then(
            function(rows) {
              updateStationnement(rows, markersStationnement);
            });
      stationnementFirstTime=false;
    } else {
      $('span:contains(" Stationnements")').prev().click();
    }
    btnStationnement.html('<i class="far fa-eraser"> Cacher Stationnements <i class="far fa-parking-circle"></i>');
    stationnementShown=true;
  } else {
    $('span:contains(" Stationnements")').prev().click();
    stationnementShown=false;
    btnStationnement.html('<i class="far fa-parking-circle"></i>Afficher Stationnements');
  }
};


function initGetAllMarkers() {
  var btnBixi = document.getElementById("loadBixis");
  btnBixi.addEventListener("click", function (e) {
    getAllBixi();
  });

  var btnArceau = document.getElementById("loadArceau");
  btnArceau.addEventListener("click", function (e) {
    getAllArceau();
  });

  var btnStationnement = document.getElementById("loadStationnement");
  btnStationnement.addEventListener("click", function (e) {
    getAllStationnement();
  });
  
    var btnFavoris = document.getElementById("loadFavoris");
  btnFavoris.addEventListener("click", function (e) {
	let refFavorisBixi = db.ref('favoritesBIXI/' + firebase.auth().currentUser.uid);
	refFavorisBixi.once('value').then(function(snap) {
		tabFavorisBixi = snap.val();
		console.log(tabFavorisBixi);
		updateFavorisBixi(tabFavorisBixi, markersFavorisBixi);
	});
	
	let refFavorisParking = db.ref('favoritesParking/' + firebase.auth().currentUser.uid);
	refFavorisParking.once('value').then(function(snap) {
		tabFavorisParking = snap.val();
		console.log(tabFavorisParking);
		updateStationnement(tabFavorisParking, markersFavorisBixi);
	});
	
	let refFavorisArceau = db.ref('favoritesArceau/' + firebase.auth().currentUser.uid);
	refFavorisArceau.once('value').then(function(snap) {
		tabFavorisArceau = snap.val();
		console.log(tabFavorisArceau);
		updateUnArceauFavoris(tabFavorisArceau, markersFavorisBixi);
	});
	
  });
};

var doQuery = function(stationId){
  let stationnement = dbl.getSchema().table('stationnement');
  let EmplacementReglementation = dbl.getSchema().table('EmplacementReglementation');
  let Reglementation = dbl.getSchema().table('Reglementation');
  let ReglementationPeriode = dbl.getSchema().table('ReglementationPeriode');
  let Periodes = dbl.getSchema().table('Periodes');

  return dbl.select(
    Periodes.dtHeureDebut, 
    Periodes.dtHeureFin, 
    Periodes.bAppliqueLundi, 
    Periodes.bAppliqueMardi, 
    Periodes.bAppliqueMercredi, 
    Periodes.bAppliqueJeudi, 
    Periodes.bAppliqueVendredi, 
    Periodes.bAppliqueSamedi, 
    Periodes.bAppliqueDimanche, 
  ).
    from(stationnement, EmplacementReglementation, 
      Reglementation, ReglementationPeriode, Periodes).
    where(lf.op.and(
      stationnement.stationId.eq(stationId),
      EmplacementReglementation.sNoPlace.eq(stationnement.stationId),
      Reglementation.sTypeReglementation.eq('U'),
      Reglementation.sCodeReglementation.eq(EmplacementReglementation.sCodeReglementation),
      ReglementationPeriode.sCodeReglementation.eq(Reglementation.sCodeReglementation),
      Periodes.nID.eq(ReglementationPeriode.nIDPeriode),
    )
    ).
    exec().then(
      function(rows) {
        return rows;
      }
    );
};
