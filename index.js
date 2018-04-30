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
import IconCache from 'ol/style/iconImageCache';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Extent from 'ol/extent';
import GeoJSON from 'ol/format/geojson';
import Select from 'ol/interaction/select';
import CanvasMap from 'ol/canvasmap';
import Overlay from 'ol/overlay';
import {search} from './controls.js';

import matchSorter from 'match-sorter';

import {productData} from './productSet.js';



console.log(productData);

const iconcache = new IconCache();
iconcache.setSize(productData.length);

const styleCache = {};


const productsVectorStyle = function(product, resolution) {
  let style = styleCache[product.getProperties().name];
  if (style) {
    style.getImage().setScale(1/resolution);
    return [style]
  }
  else  {
    const productProperties = product.getProperties();
    let productIcon = iconcache[productProperties.src];
    if (!productIcon) {
      productIcon = new Icon({
        offset: productProperties.offset,
        size: productProperties.size,
        scale: 1 / resolution,
        crossOrigin: 'anonymous',
        src: productProperties.src
      });
    }
    
    styleCache[product.getProperties().name] = new Style({
      image: productIcon
    })

    return [styleCache[product.getProperties().name]]

  }
}

const productsVectorSource = new VectorSource({
       features: (new GeoJSON()).readFeatures(productData)
});

const productsVectorLayer = new VectorLayer({
  source: productsVectorSource,
  style: productsVectorStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})

let center = Math.ceil(Math.sqrt(productData.features.length)) * 100;
console.log(center);

var view = new View({
  center: [center, center],
  zoom: 0,
  zoomFactor: 2,
  minResolution: 1,
  maxResolution: 20,
  projection: new Projection({
   units: 'pixels',
   extent: [center,center,center,center]
  })
})


var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [productsVectorLayer],
  target: document.getElementById('map'),
  view: view
});

map.addControl(search);

map.on('click', function(evt) {
  var info = document.getElementById('info');
  info.innerHTML = 
  'event coor: ' + evt.coordinate + 
  '<br> Coordinate from pixel: ' +  map.getCoordinateFromPixel(evt.coordinate) +
  '<br> Pixel from Coordinate: ' +  map.getPixelFromCoordinate(evt.coordinate) +
  '<br> event pixel: ' + map.getEventPixel(evt) + 
  '<br> event coordinate: ' + map.getEventCoordinate(evt.coordinate) + 
  '<br> features at pixel: ' + map.getFeaturesAtPixel(evt.pixel)[0].getId() +
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
  const resolution = map.getView().getResolution();
  if (feature !== highlight) {
    if (highlight) {
      //highlight.setProperties({'hover': false});
      highlight.setStyle(productsVectorStyle);
    }
    if (feature) {
      feature.setProperties({'hover': true});
      let properties = feature.getProperties();
      //console.log(properties);
      feature.setStyle(styleCache[feature.getProperties().name]);
      feature.getStyle().getImage().setScale(1/resolution * 1.1);
      // feature.setStyle( function (resolution) {
      //   this.get('originalStyle').getImage().setScale(1 / resolution * 1.1);
      //   return this.get('originalStyle');
      // }); 
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

//map.on('click', onProductClick);

/* Search field prototype */






// //old code 


// /* The sample icon/images */
// // var iconCount = 20;
// // var icons = new Array(iconCount);
// // for (let i = 0; i < iconCount; ++i) {
// //   icons[i] = new Icon({
// //     offset: [0, i*200+i],
// //     size: [200, 200],
// //     crossOrigin: 'anonymous',
// //     src: './images/sprites.png'
// //   });
// // }

// // const featureCount = 25000;
// // const features = new Array(featureCount);
// // var feature, geometry, featureStyle;
// // const columns = Math.ceil(Math.sqrt(featureCount));
// // const rows = columns;
// // const points = [];
// // const boundary = Math.round(columns/2);
// // for (let k = -80; k < 80; k++) {
// //   for (let j = 80; j > -80; j--) {
// //     let x = 200 * k;
// //     let y = 200 * j;
// //     points.push([x, y]);
// //   }
// // }
// // var feature, geometry, featureStyle;
// // for (let i = 0; i < featureCount; ++i) {
// //   geometry = new Point(points[i]);
// //   feature = new Feature(geometry);
 
// //   featureStyle =  new Style({
// //     image: icons[i % (iconCount - 1)],
// //   })
 
// //   feature.set('originalStyle',featureStyle);
// //   feature.setId('beans-' + i);
// //   feature.set('price', 5.99);
// //   feature.setStyle(
// //     function (resolution) {
// //       this.get('originalStyle').getImage().setScale(1 / resolution);
// //       return this.get('originalStyle');
// //     }
// //   );
// //   features[i] = feature;
// // }


// // var vectorLayer = new VectorLayer({
// //   source: vectorSource,
// //   updateWhileAnimating: true,
// //   updateWhileInteracting: true,
// // });

