var extraInfo = function(stationId){
  let stationnement2 = dbl.getSchema().table('stationnement2');

  return dbl.select().
    from(stationnement2).
    where(
        stationnement2.stationId.eq(stationId)
        )
    .exec()
    .then(
        function(rows){
          return rows;
        });
};

var setPointGetProx = function(latlng){
  map.panTo(new L.LatLng(latlng.center[1], latlng.center[0]), {animate: true, duration: 1.2});
  drawTheSearchedMarker(latlng.center);
  drawProximity(latlng.center);
};

let rsultRech;
var sourceRechAvancee = L.mapbox.geocoder('mapbox.places');
var rsultRechAvancee = function(err, data){
  let data2 = data.results.features;
  rsultRech=data2;
  if(data2.length === 1) {
    setPointGetProx(data2[0]);
    $.fancybox.close()
  } 
  else {
    let str='<div class="message">';
    for(let i=0;i<data2.length;i++){
      str+='<a href="javascript:setPointGetProx(rsultRech['+i+']);$.fancybox.close();$.fancybox.close();">'+data2[i].place_name + '</a><br/>';
    }
    str+='</div>'
    $.fancybox.open(str);
  }
};

function rechercheAvancee(recherche, type){
  sourceRechAvancee.query(recherche, rsultRechAvancee);
}
var setupPopupRechercheAvancee = function() {
  $("#myBtn").click(function() {
    rechercheAvancee($("#search").val(), $("#filter").val());
  });
  $('#myCartNow33').draggable();
};

