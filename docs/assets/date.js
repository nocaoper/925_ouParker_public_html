//afficher heures
let affHeures = function(tab) {
  let jour = new Date().getDay();
  let heures = new Date().getHours();
  let minutes = new Date().getMinutes();

  for(let i=0;i<tab.length;i++){ 
    if (switchDuJour(tab[i], jour)){
      return String(retournerHeures(tab[i]));
    }
  }
  return false;
}

let retournerHeures = function(tab) {
  let resultat = '';
  resultat += String(tab.Periodes.dtHeureDebut) + ' &agrave; ' + String(tab.Periodes.dtHeureFin) + '<br/>';
  return resultat;
}

//disponibilite 
var dispo = function(tab) {
  return tabDuJour(tab);
};

var tabDuJour = function(tab) {
  let jour = new Date().getDay();
  let heures = new Date().getHours();
  let minutes = new Date().getMinutes();

  for(let i=0;i<tab.length;i++){ 
    if (switchDuJour(tab[i], jour)){
      return verifierHeure(heures, minutes, tab[i]);
    }
  }
  return false;
};

var verifierHeure = function(heures, minutes, tab){
  let heureDebut = parseInt(tab.Periodes.dtHeureDebut.substring(0,2));
  let minutesDebut = parseInt(tab.Periodes.dtHeureDebut.substring(3,5));
  let heureFin = parseInt(tab.Periodes.dtHeureFin.substring(0,2));
  let minutesFin = parseInt(tab.Periodes.dtHeureFin.substring(3,5));

  let debut = toMinutes(heureDebut, minutesDebut);
  let fin = toMinutes(heureFin, minutesFin);

  let dateMaintenant = toMinutes(heures, minutes);

  let timeIsValid = (debut < dateMaintenant) && (fin > dateMaintenant)
  return timeIsValid;
};

var toMinutes = function(heures, minutes) {
  return heures * 60 + minutes;
};

var switchDuJour = function(tab, jour) {
  if (jour == 0) {
    if (tab.Periodes.bAppliqueDimanche == 1) { return true; };
  }
  else if (jour == 1) {
    if (tab.Periodes.bAppliqueLundi == 1) { return true; };
  }
  else if (jour == 2) {
    if (tab.Periodes.bAppliqueMardi == 1) { return true; };
  }
  else if (jour == 3) {
    if (tab.Periodes.bAppliqueMercredi == 1) { return true; };
  }
  else if (jour == 4) {
    if (tab.Periodes.bAppliqueJeudi == 1) { return true; };
  }
  else if (jour == 5) {
    if (tab.Periodes.bAppliqueVendredi == 1) { return true; };
  }
  else if (jour == 6) {
    if (tab.Periodes.bAppliqueSamedi == 1) { return true; };
  } else {
    return false;
  }
};

