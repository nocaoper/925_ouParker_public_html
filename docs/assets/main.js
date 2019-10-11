
var mobileMapHeight = function(){
  var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
  if(isMobile) {
    newradius = 30;
    $('.sliderRayon').hide();
  } else {
    document.getElementById("map").style.height = "500px";
  };
};

var hideMapWhileLoading = function(){
  document.getElementById('map').style.display='none';
  $(".sliderRayon").hide();
  $("#subscribe").hide();
  $("#connect").hide();
};

function signOut() {
  firebase.auth().signOut();
}

function showFavoris(){
	$(".FavList").empty();
	showFavorisBIXI();
	showFavorisParking();
	showFavorisArceau();
}
	
function showFavorisParking(){
	var tab;
	
		ref = db.ref('favoritesParking/' + firebase.auth().currentUser.uid);
		ref.once('value').then(function(snap){ 
			tab = snap.val(); 
			console.log("OK4");
			var query = firebase.database().ref('favoritesParking/' + firebase.auth().currentUser.uid).orderByKey();
			query.on("value", function(snapshot) {
				console.log("OK3");
				$(".FavListParking").empty();
			  snapshot.forEach(function(childSnapshot) {
				  console.log("OK2");
				//doQuery(childSnapshot.val().ID).then(
					//function(tab){
					var key = childSnapshot.key;
					var childData = childSnapshot.val();
					//console.log("OK");
					console.log(childSnapshot.val());
					$(".FavListParking").append($("<p>ID Stationnement: " + childSnapshot.val().ID + "</p>"
				  + "<p>nom de rue: " + childSnapshot.val().description + "</p>").click(
				  //+ "<p>Heures de disponibilit&eacute;:" + affHeures(tab)+ "</p>"
				 // + "<p>Disponible: " + dispo(tab) + "</p>").click(
					  function() {
						removeFavoriteParking(firebase.auth().currentUser.uid, childSnapshot.val().deletion_key);
					  }));
				//});
			  });
			}, function(error) {
			  console.error(error);
			});
		});
}
	
function showFavorisBIXI(){
	var tab;
	
		ref = db.ref('favoritesBIXI/' + firebase.auth().currentUser.uid);
		ref.once('value').then(function(snap){ 
			tab = snap.val(); 
			var query = firebase.database().ref('favoritesBIXI/' + firebase.auth().currentUser.uid).orderByKey();
			query.on("value", function(snapshot) {
				$(".FavListBIXI").empty();
			  snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				console.log(childSnapshot.val());
				$(".FavListBIXI").append($("<p>" + childSnapshot.val().description + " " + childSnapshot.val().available + "/" + (parseInt(childSnapshot.val().available) + parseInt(childSnapshot.val().occupied)) + "</p></br>").click(
				  function() {
					removeFavoriteBIXI(firebase.auth().currentUser.uid, childSnapshot.val().deletion_key);
				  }));
			  });
			}, function(error) {
			  console.error(error);
			});
		});
}

function showFavorisArceau(){
	var tab;
	
		ref = db.ref('favoritesArceau/' + firebase.auth().currentUser.uid);
		ref.once('value').then(function(snap){ 
			tab = snap.val(); 
			var query = firebase.database().ref('favoritesArceau/' + firebase.auth().currentUser.uid).orderByKey();
			query.on("value", function(snapshot) {
				$(".FavListArceau").empty();
			  snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				console.log(childSnapshot.val());
				$(".FavListArceau").append($("<p>" + "ArceauID: " + childSnapshot.val().ID + "</p></br>").click(
				  function() {
					removeFavoriteArceau(firebase.auth().currentUser.uid, childSnapshot.val().deletion_key);
				  }));
			  });
			}, function(error) {
			  console.error(error);
			});
		});
}

function removeFavoriteBIXI(user, favID){
	var deleteRef = db.ref('favoritesBIXI/' + user + '/' + favID);
	deleteRef.remove();
}

function removeFavoriteParking(user, favID){
	var deleteRef = db.ref('favoritesParking/' + user + '/' + favID);
	deleteRef.remove();
}

function removeFavoriteArceau(user, favID){
	var deleteRef = db.ref('favoritesArceau/' + user + '/' + favID);
	deleteRef.remove();
}

var guillaume = function () {
  var db = firebase.database();
  $(".1").hide();
  $(".2").hide();
  $("#errorLogIn").hide();
  $("#connect").click(function(){
    $(".1").slideDown("slow");
    $(".2").slideUp("fast");
  });
  $("#subscribe").click(function(){
    $(".2").slideDown("slow");
    $(".1").slideUp("fast");
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //alert("OK");
      //$("#errorLogIn").hide();
      errorLog = false;
      $(".log").hide();
      $(".logInNew").hide();
      $(".slider").hide();
      $("#panelButton").hide();
      $(".favoris").show();
      $(".1").hide();
      $(".2").hide();
      $("#errorLogIn").hide();
      $(".FavListBIXI").show();
      $(".FavListParking").show();
      $(".FavListArceau").show();
      $("#loadFavoris").show();
      showFavoris();
      setTimeout(()=>{
      	favoritesShow();
      },8000);
    } else {
      $(".log").show()
      $(".logInNew").show();
      $(".slider").show();
      $("#panelButton").show();
      $(".favoris").hide();
	  $(".FavListBIXI").hide();
	  $(".FavListParking").hide();
	   $(".FavListArceau").hide();
	  $("#loadFavoris").hide();
    }
  });
  $(".login").submit(event => {
    firebase.auth().signInWithEmailAndPassword(

      $('.login-email').val(),
      $('.login-password').val()
    ).catch(error => {
          const errorCode = error.code;
          const errorMsg = error.message;
	  alert(error.message);
          errorLog = true;
    });
    return false;
  });

  $(".signUp").submit(event => {
    $("#errorLogIn").show();
    email = $('.signUp-email').val();
    password = $('.signUp-password').val();
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        errorLog = true;
      })
      .catch(
        error => {
          const errorCode = error.code;
          const errorMsg = error.message;
          alert(error.message);
          errorLog = true;

        });
    return false;
  });
};

var fixLocationGetterLogoNotCentered = function(){
  $('span.fa-map-marker').css({'margin':'5.3px 0 0 6px'});
};

$(function() {
  initMarkersLayers();
  initGetAllMarkers();
  // arnaud();
  mobileMapHeight();
  hideMapWhileLoading();
  cacheActions();
  guillaume();
  setupPopupRechercheAvancee();
  fixLocationGetterLogoNotCentered();
});
