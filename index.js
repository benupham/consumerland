require('ol/ol.css');
const ol_Map = require('ol/map').default;
const ol_layer_Tile = require('ol/layer/tile').default;
const ol_source_OSM = require('ol/source/osm').default;
const ol_View = require('ol/view').default;

const map = new ol_Map({
  target: 'map',
  layers: [
    new ol_layer_Tile({
      source: new ol_source_OSM()
    })
  ],
  view: new ol_View({
    center: [0, 0],
    zoom: 0
  })
});