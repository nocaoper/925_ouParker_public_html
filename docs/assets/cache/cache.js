let refBixiTime = db.ref('ville/bixiTime');
let refArceauTime = db.ref('ville/arceauTime');
let refStationnementTime = db.ref('ville/stationnementTime');

var loadTabBixi = async function(){
  let refBixi = db.ref('/ville/bixi');
  return refBixi.once('value').then(function(snap) {
    tabBixi = snap.val();
    return insertBixiSql();
  });
};

var insertBixiSql = function(){
  let tabSchema = dbl.getSchema().table('bixi');
  let tabInsert = [];
  tabBixi.forEach(function(obj){
    let row = tabSchema.createRow({
      'stationId': parseInt(obj[5]),
      'time': obj[1],
      'lat': obj[2],
      'long': obj[3],
      'dispo': obj[0],
      'total': obj[6],
      'rue': obj[4]
    });
    tabInsert.push(row);
  });
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var insertBixiLastUpdated= async function(time){
  let tabSchema = dbl.getSchema().table('time');
  let tabInsert = [];
  let row = tabSchema.createRow({
    'type': 'bixi',
    'time': time
  });
  tabInsert.push(row);
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var syncTimeBixi = function(time){
  let tabSchema = dbl.getSchema().table('time');
  return dbl.select().from(tabSchema)
    .where(tabSchema.type.eq('bixi'))
    .exec().then(
      function(rows) {
        if(rows.length === 0){
          return true;
        }
        return (rows[0]['time'] < time);
      }
    );
};

var loadTabEmplacementReglementation = function(){
  updateProgBar(1/9);
  statusMsg('---Partie 2: Emplacement Reglementation<br>');
  let refEmplacementReglementation = db.ref('ville/statdemtl/EmplacementReglementation');
  return refEmplacementReglementation.once('value').then(function(snap) {
    return insertEmplRegl(snap.val());
  });
};

var insertEmplRegl = function(snap){
  let tabSchema = dbl.getSchema().table('EmplacementReglementation');
  let tabInsert = [];
  let i = 0;
  snap.forEach(function(obj){
    let row = tabSchema.createRow({
      'id': i,
      'sNoPlace': obj[0],
      'sCodeReglementation': obj[1]
    });
    tabInsert.push(row);
    ++i;
  });
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var loadTabReglementation = function(){
    updateProgBar(1/9);
  statusMsg('---Partie 3: Reglementation<br>');
  let refReglementation = db.ref('ville/statdemtl/Reglementations');
  return refReglementation.once('value').then(function(snap) {
    return insertRegl(snap.val());
  });
};

var insertRegl = function(snap){
  let tabSchema = dbl.getSchema().table('Reglementation');
  let tabInsert = [];
  snap.forEach(function(obj){
    let row = tabSchema.createRow({
      'sCodeReglementation': obj[0],
      'sTypeReglementation': obj[1],
      'JourDebut': parseInt(obj[2].substring(0,2)),
      'MoisDebut': parseInt(obj[2].substring(2,4)),
      'JourFin': parseInt(obj[3].substring(0,2)),
      'MoisFin': parseInt(obj[3].substring(2,4)),
      'DureeMax': parseInt(obj[4])
    });
    tabInsert.push(row);
  });
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var loadTabReglementationPeriode = function(){
  updateProgBar(1/9);
  statusMsg('---Partie 4: Reglementation Periode<br>');
  let refReglementationPeriode = db.ref('ville/statdemtl/ReglementationPeriode');
  return refReglementationPeriode.once('value').then(function(snap) {
    return insertReglPeriode(snap.val());
  });
};

var insertReglPeriode = function(snap){
  let tabSchema = dbl.getSchema().table('ReglementationPeriode');
  let tabInsert = [];
  let i = 0;
  snap.forEach(function(obj){
    let row = tabSchema.createRow({
      'id': i,
      'sCodeReglementation': obj[0],
      'nIDPeriode': parseInt(obj[1])
    });
    tabInsert.push(row);
    ++i;
  });
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var loadTabPeriode = function(){
  updateProgBar(1/9);
  statusMsg('---Partie 6: Periode<br>');
  let refPeriode = db.ref('ville/statdemtl/Periodes');
  return refPeriode.once('value').then(function(snap) {
    return insertPeriode(snap.val());
  }).then(
    function(){
      updateProgBar(1/9);
      statusMsg('R&eacute;ussie.<br/>');
      $('#chargement').fadeOut(1200);
      setTimeout(()=>{$('#map').show(); $(".sliderRayon").show();$("#subscribe").show();$("#connect").show();}, 1300);}
  );
};

var insertPeriode = function(snap){
  let tabSchema = dbl.getSchema().table('Periodes');
  let tabInsert = [];
  let i = 0;
  snap.forEach(function(obj){
    let row = tabSchema.createRow({
      'nID': parseInt(obj[0]),
      'dtHeureDebut': obj[1],
      'dtHeureFin': obj[2],
      'bAppliqueLundi': parseInt(obj[3]),
      'bAppliqueMardi': parseInt(obj[4]),
      'bAppliqueMercredi': parseInt(obj[5]),
      'bAppliqueJeudi': parseInt(obj[6]),
      'bAppliqueVendredi': parseInt(obj[7]),
      'bAppliqueSamedi': parseInt(obj[8]),
      'bAppliqueDimanche': parseInt(obj[9])
    });
    tabInsert.push(row);
    ++i;
  });
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var loadTabStationnement2 = function(){
  updateProgBar(1/9);
  statusMsg('---Partie 5: Stationnement Details<br>');
  let refStationnement2 = db.ref('/ville/stationnement2');
  return refStationnement2.once('value').then(function(snap) {
    tabStationnement = snap.val();
    return insertStationnement2Sql();
  });
};

var insertStationnement2Sql = function(){
  let tabSchema = dbl.getSchema().table('stationnement2');
  let tabInsert = [];
  for (let i=0; i<tabStationnement.length; ++i){
    let obj=tabStationnement[i];
    let nTarifMax = -1;
    if (parseInt(obj[5])) { nTarifMax = parseInt(obj[5]); };
    let row = tabSchema.createRow({
      'stationId': obj[0],
      'sGenre': obj[1],
      'sType': obj[2],
      'nSupVelo': parseInt(obj[3]),
      'nTarifHoraire': parseInt(obj[4]),
      'nTarifMax': nTarifMax
    });
    tabInsert.push(row);
  }
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var loadTabStationnement = function(){
  let refStationnement = db.ref('/ville/stationnement');
  return refStationnement.once('value').then(function(snap) {
    tabStationnement = snap.val();
    return insertStationnementSql();
  });
};

var insertStationnementSql = function(){
  let tabSchema = dbl.getSchema().table('stationnement');
  let tabInsert = [];
  for (let i=0; i<tabStationnement.length; ++i){
    let obj=tabStationnement[i];
    let row = tabSchema.createRow({
      'stationId': obj[0],
      'lat': obj[2],
      'long': obj[1],
      'rue': obj[3]
    });
    tabInsert.push(row);
  }
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var insertStationnementLastUpdated= function(time){
  statusMsg('---Partie 1: Stationnements <br>');
  let tabSchema = dbl.getSchema().table('time');
  let tabInsert = [];
  let row = tabSchema.createRow({
    'type': 'stationnement',
    'time': time
  });
  tabInsert.push(row);
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var syncTimeStationnement = function(time){
  let tabSchema = dbl.getSchema().table('time');
  return dbl.select().from(tabSchema)
    .where(tabSchema.type.eq('stationnement'))
    .exec().then(
      function(rows) {
        if(rows.length === 0){
          return true;
        }
        return (rows[0]['time'] < time);
      }
    );
};

var loadTabArceau = async function(){
  let refArceau = db.ref('/ville/arceau');
  refArceau.once('value').then(function(snap) {
    tabArceau = snap.val();
    return insertArceauSql();
  });
};

var insertArceauSql = async function(){
  let tabSchema = dbl.getSchema().table('arceau');
  let tabInsert = [];
  tabArceau.forEach(function(obj){
    let row = tabSchema.createRow({
      'stationId': parseInt(obj[0]),
      'lat': obj[2],
      'long': obj[1]
    });
    tabInsert.push(row);
  });
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var insertArceauLastUpdated = async function(time){
  let tabSchema = dbl.getSchema().table('time');
  let tabInsert = [];
  let row = tabSchema.createRow({
    'type': 'arceau',
    'time': time
  });
  tabInsert.push(row);
  return dbl.insertOrReplace().into(tabSchema).values(tabInsert).exec();
};

var syncTimeArceau = function(time){
  let tabSchema = dbl.getSchema().table('time');
  return dbl.select().from(tabSchema)
    .where(tabSchema.type.eq('arceau'))
    .exec().then(
      function(rows) {
        if(rows.length === 0){
          return true;
        }
        return (rows[0]['time'] < time);
      }
    );
};

var startTime = Date.now();
var dbl = null;

var chargerTablesStationnements = function(time){
  return insertStationnementLastUpdated(time).then(function(){
    return loadTabStationnement().then(function(){
      return loadTabEmplacementReglementation().then(function(){
        return loadTabReglementation().then(function(){
          return loadTabReglementationPeriode().then(function(){
            return loadTabStationnement2().then(function(){
              return loadTabPeriode();
            });
          });
        });
      });
    });
  });

};

var firstLoad = function(dbl) {
  var bixiPromise = refBixiTime.once('value', snap => {
    let time = snap[Object.keys(snap)[0]].value_;
    statusMsg('Chargement de la base de donn&eacute;e bixi <br>');
    syncTimeBixi(time).then(
      function(hasToSync){
        if(hasToSync){
          return insertBixiLastUpdated(time).then(
            function(){
              return loadTabBixi();
            });
        } else {
          return 1;
        }
      });});

  bixiPromise.then(
    function(){
      statusMsg('R&eacute;ussie.<br/>');
      updateProgBar(1/9);
      statusMsg('Chargement de la base de donn&eacute;e arceau <br>');
      refArceauTime.once('value', snap => {
        let time = snap[Object.keys(snap)[0]].value_;
        syncTimeArceau(time).then(
          function(hasToSync){
            if(hasToSync){
              return insertArceauLastUpdated(time).then(
                function(){
                  return loadTabArceau();
                }
              );
            } else {
              return 1;
            }
          });}).then(
            function(){
              statusMsg('R&eacute;ussie.<br/>');
              updateProgBar(1/9);
              statusMsg('Chargement de la base de donn&eacute;e stationnement <br>');
              refStationnementTime.once('value', snap => {
                let time = snap[Object.keys(snap)[0]].value_;
                return syncTimeStationnement(time).then(
                  function(hasToSync){
                    if (hasToSync){
                      return chargerTablesStationnements(time);
                    } else {
                      updateProgBar(5/9);
                      statusMsg('R&eacute;ussie.<br/>');
                      $('#chargement').fadeOut(1200);
                      setTimeout(()=>{
                        $('#map').show();
                        //if this code is not used then there are blank artefacts during loading
                        // using setTimeout to give time for map to reload then refresh size after
                        // successful loading
                        setTimeout(()=>{
                          map.invalidateSize();
                        }, 200);
                        $(".sliderRayon").show();
                        $("#subscribe").show();
                        $("#connect").show();
                      }, 1300);
                    }
                  });
              }).then(
                function(){
                });
            });});

};

var timeTriggers = function(){

  refBixiTime.on('value', snap => {
    let time = snap[Object.keys(snap)[0]].value_;
    syncTimeBixi(time).then(
      function(hasToSync){
        if(hasToSync){
          insertBixiLastUpdated(time);
          loadTabBixi();
        }
      });});

  refStationnementTime.on('value', snap => {
    let time = snap[Object.keys(snap)[0]].value_;
    syncTimeStationnement(time).then(
      function(hasToSync){
        if(hasToSync){
          insertStationnementLastUpdated(time);
          loadTabStationnement();
          loadTabEmplacementReglementation();
          loadTabReglementation();
          loadTabReglementationPeriode();
          loadTabPeriode();
        }
      });});

  refArceauTime.on('value', snap => {
    let time = snap[Object.keys(snap)[0]].value_;
    syncTimeArceau(time).then(
      function(hasToSync){
        if(hasToSync){
          insertArceauLastUpdated(time);
          loadTabArceau();
        }
      });});

};

//db + all the load
let total = 8;
let progress = 0;
let msg = '';
let scheduleUpdate = 0;
var syncController = function(){

};

var changeMsg = function(newMsg){
  msg = newMsg;
};

var cacheActions = function(){
  main().then(function() {
  });
};

var statusMsg = function(msg){
  $('.status').append(msg);
};

var updateProgBar = function(toAdd){
  let newVal = $('#vie').val() + Math.ceil(toAdd * 100);
  if (newVal > 100) newVal = 100;
  $('#vie').val(newVal);
};


var main = function() {
  statusMsg('Connection &agrave; la base de donn&eacute;e locale <br>');
  return ouparker.dblf.getSchemaBuilder().connect({
    storeType: lf.schema.DataStoreType.INDEXED_DB
  }).then(function(database) {
    dbl = database;
    statusMsg('R&eacute;ussie.<br/>');
    updateProgBar(1/9);
    firstLoad(dbl);
  }).then(
    function(){
    });
};

