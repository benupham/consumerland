require('ol/ol.css');
import olMap from 'ol/map';
import View from 'ol/view';
import Projection from 'ol/proj/projection';
import Proj from 'ol/proj';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Polygon from 'ol/geom/polygon';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Icon from 'ol/style/icon';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Extent from 'ol/extent';



/* The sample icon/images */
var iconCount = 20;
var icons = new Array(iconCount);
for (let i = 0; i < iconCount; ++i) {
  icons[i] = new Icon({
    offset: [0, i*200+i],
    size: [200, 200],
    crossOrigin: 'anonymous',
    src: './images/sprites.png'
  });
}

const featureCount = 25000;
const features = new Array(featureCount);
var feature, geometry, featureStyle;
const columns = Math.ceil(Math.sqrt(featureCount));
const rows = columns;
const points = [];
const boundary = Math.round(columns/2);
for (let k = -80; k < 80; k++) {
  for (let j = 80; j > -80; j--) {
    let x = 200 * k;
    let y = 200 * j;
    points.push([x, y]);
  }
}

for (let i = 0; i < featureCount; ++i) {
  geometry = new Point(points[i]);
  feature = new Feature(geometry);
 
  featureStyle =  new Style({
    image: icons[i % (iconCount - 1)],
  })
 
  feature.set('originalStyle',featureStyle);
  feature.setStyle(
    function (resolution) {
      this.get('originalStyle').getImage().setScale(1 / resolution);
      return this.get('originalStyle');
    }
  );
  features[i] = feature;
}

let center = new Point([0,0]);
let boundaryBox = new Polygon.fromExtent([-80*200,80*200,80*200,-80*200]);
let strokeStyle = new Style({
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
});
const theCenter = new Feature(center);
const theBoundaryBox = new Feature(boundaryBox);

features.push(theCenter,theBoundaryBox);

var vectorSource = new VectorSource({
  features: features
});


var vectorLayer = new VectorLayer({
  source: vectorSource,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

var view = new View({
  center: [0, 0],
  zoom: 4,
  zoomFactor: 2,
  minResolution: 1,
  maxResolution: 80,
  projection: new Projection({
   units: 'pixels',
   extent: [-100000,-100000,100000,100000]
  })
})

console.log(view.getProjection());

var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['webgl', 'canvas']),
  layers: [vectorLayer],
  target: document.getElementById('map'),
  view: view
});

map.on('click', function(evt) {
  var info = document.getElementById('info');
  info.innerHTML = 
  'event coor: ' + evt.coordinate + 
  '<br> Coordinate from pixel: ' +  map.getCoordinateFromPixel(evt.coordinate) +
  '<br> Pixel from Coordinate: ' +  map.getPixelFromCoordinate(evt.coordinate) +
  '<br> event pixel: ' + map.getEventPixel(evt) + 
  '<br> event coordinate: ' + map.getEventCoordinate(evt.coordinate) + 
  '<br> features at pixel: ' + map.getFeaturesAtPixel(evt.coordinate, {hitTolerance: 100}) +
  '<br> Resolution: ' + map.getView().getResolution() + 
  '<br> Zoom: ' + map.getView().getZoom();
  console.log(map.getView());
});