var ouparker = { dblf: {} };

ouparker.dblf.getSchemaBuilder = function() {
  var ds = lf.schema.create('ouDB', 1);

  ds.createTable('time').
    addColumn('type', lf.Type.STRING).
    addColumn('time', lf.Type.INTEGER).
    addPrimaryKey(['type']).
    addNullable(['time']);

  ds.createTable('bixi').
    addColumn('stationId', lf.Type.INTEGER).
    addColumn('time', lf.Type.INTEGER).
    addColumn('lat', lf.Type.STRING).
    addColumn('long', lf.Type.STRING).
    addColumn('dispo', lf.Type.INTEGER).
    addColumn('total', lf.Type.INTEGER).
    addColumn('rue', lf.Type.STRING).
    addPrimaryKey(['stationId']);

  ds.createTable('arceau').
    addColumn('stationId', lf.Type.INTEGER).
    addColumn('lat', lf.Type.STRING).
    addColumn('long', lf.Type.STRING).
    addPrimaryKey(['stationId']);

  ds.createTable('stationnement').
    addColumn('stationId', lf.Type.STRING).
    addColumn('lat', lf.Type.STRING).
    addColumn('long', lf.Type.STRING).
    addColumn('rue', lf.Type.STRING).
    addPrimaryKey(['stationId']);

  ds.createTable('stationnement2').
    addColumn('stationId', lf.Type.STRING).
    addColumn('sGenre', lf.Type.STRING).
    addColumn('sType', lf.Type.STRING).
    addColumn('nSupVelo', lf.Type.INTEGER).
    addColumn('nTarifHoraire', lf.Type.INTEGER).
    addColumn('nTarifMax', lf.Type.INTEGER).
    addPrimaryKey(['stationId']);

  ds.createTable('EmplacementReglementation').
    addColumn('id', lf.Type.INTEGER).
    addColumn('sNoPlace', lf.Type.STRING).
    addColumn('sCodeReglementation', lf.Type.STRING).
    addPrimaryKey(['id']).
    addForeignKey('fk_sNoPlace_FromEmpl_ToStation', {
      local: 'sNoPlace',
      ref: 'stationnement.stationId'
    }).
    addForeignKey('fk_sCodeReglementation_FromEmpl_ToRegl', {
      local: 'sCodeReglementation',
      ref: 'Reglementation.sCodeReglementation'
    });

  ds.createTable('Reglementation').
    addColumn('sCodeReglementation', lf.Type.STRING).
    addColumn('sTypeReglementation', lf.Type.STRING).
    addColumn('JourDebut', lf.Type.INTEGER).
    addColumn('MoisDebut', lf.Type.INTEGER).
    addColumn('JourFin', lf.Type.INTEGER).
    addColumn('MoisFin', lf.Type.INTEGER).
    addColumn('DureeMax', lf.Type.INTEGER).
    addPrimaryKey(['sCodeReglementation']);

  ds.createTable('ReglementationPeriode').
    addColumn('id', lf.Type.INTEGER).
    addColumn('sCodeReglementation', lf.Type.STRING).
    addColumn('nIDPeriode', lf.Type.INTEGER).
    addPrimaryKey(['id']).
    addForeignKey('fk_sCodeReglementation_FromReglPerio_ToRegl', {
      local: 'sCodeReglementation',
      ref: 'Reglementation.sCodeReglementation'
    }).
    addForeignKey('fk_nIDPeriode_FromReglPerio_ToPeriod', {
      local: 'nIDPeriode',
      ref: 'Periodes.nID'
    });

  ds.createTable('Periodes').
    addColumn('nID', lf.Type.INTEGER).
    addColumn('dtHeureDebut', lf.Type.STRING).
    addColumn('dtHeureFin', lf.Type.STRING).
    addColumn('bAppliqueLundi', lf.Type.INTEGER).
    addColumn('bAppliqueMardi', lf.Type.INTEGER).
    addColumn('bAppliqueMercredi', lf.Type.INTEGER).
    addColumn('bAppliqueJeudi', lf.Type.INTEGER).
    addColumn('bAppliqueVendredi', lf.Type.INTEGER).
    addColumn('bAppliqueSamedi', lf.Type.INTEGER).
    addColumn('bAppliqueDimanche', lf.Type.INTEGER).
    addPrimaryKey(['nID']);

  return ds;
};
