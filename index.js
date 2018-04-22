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
import GeoJSON from 'ol/format/geojson';
import Select from 'ol/interaction/select';
import CanvasMap from 'ol/canvasmap';
import Overlay from 'ol/overlay';
import Control from 'ol/control/control';



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
  feature.setId('beans-' + i);
  feature.set('price', 5.99);
  feature.setStyle(
    function (resolution) {
      this.get('originalStyle').getImage().setScale(1 / resolution);
      return this.get('originalStyle');
    }
  );
  features[i] = feature;
}

// let center = new Point([0,0]);
// let boundaryBox = new Polygon.fromExtent([-80*200,80*200,80*200,-80*200]);
// let strokeStyle = new Style({
//   stroke: new Stroke({
//     color: '#319FD3',
//     width: 1
//   }),
// });
// const theCenter = new Feature(center);
// const theBoundaryBox = new Feature(boundaryBox);

//features.push(theCenter,theBoundaryBox);

const vectorSource = new VectorSource({
  features: features
});

const jsonVectorSource = new VectorSource({
       url: './sample.geojson',
       format: new GeoJSON()
       //features: (new GeoJSON()).readFeatures(geojsonObject)
});

const jsonVectorLayer = new VectorLayer({
  source: jsonVectorSource
})


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


var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [vectorLayer, jsonVectorLayer],
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
  '<br> features at pixel: ' + map.getFeaturesAtPixel(evt.pixel) +
  '<br> Resolution: ' + map.getView().getResolution() + 
  '<br> Zoom: ' + map.getView().getZoom();
  //console.log(map.getView());
  //console.log(map.getFeaturesAtPixel(evt.pixel, {hitTolerance: 100})[0].getProperties().name);
  //console.log(features[100]);
  //console.log(evt);
});


let highlight; 

const onProductHover = function(evt) {
  const pixel = evt.pixel;
  const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

  if (feature !== highlight) {
    if (highlight) {
      highlight.setStyle( function (resolution) {
        this.get('originalStyle').getImage().setScale(1 / resolution);
        return this.get('originalStyle');
      });
    }
    if (feature) {
      feature.setStyle( function (resolution) {
        this.get('originalStyle').getImage().setScale(1 / resolution * 1.1);
        return this.get('originalStyle');
      }); 
    }
    highlight = feature;
  }

}

map.on('pointermove', onProductHover);

let clicked; 

const onProductClick = function(evt) {
  const pixel = evt.pixel;
  const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
  console.log('step 1' + feature, clicked);
  if (feature !== clicked) {
    console.log('step 2: ' + feature,clicked);
    if (clicked) {
      clicked.setStyle( function (resolution) {
        this.get('originalStyle').getImage().setScale(1 / resolution);
        this.get('originalStyle').setZIndex(0);
        return this.get('originalStyle');
      });
    }
    if (feature) {
      feature.setStyle( function (resolution) {
        this.get('originalStyle').getImage().setScale(1);
        this.get('originalStyle').setZIndex(1);
        return this.get('originalStyle');
      }); 
    }
    clicked = feature;
  }
}

map.on('click', onProductClick);

/* Search field prototype */

const searchForm = document.getElementById('search');

const handleSearch = function(e) {
  e.preventDefault();
  const query = searchForm.elements[0].value;
  if (query != '') {
    try {
      const feature = vectorLayer.getSource().getFeatureById(query); 
      map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
        zoom: 6
      })
    }
    catch(err) {
      console.log(query +' not found');
    }

  }



//  map.getLayers().getSource().getFeatureById()

} 
searchForm.addEventListener('submit', handleSearch);


const search = new Control({
  element: document.getElementById('search-overlay'),


});
map.addControl(search);

console.log(view.getProjection().setWorldExtent([-100000, -100000, 100000, 100000]));

