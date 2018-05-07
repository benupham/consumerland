require('ol/ol.css');
import olMap from 'ol/map';
import View from 'ol/view';
import Projection from 'ol/proj/projection';
import Loadingstrategy from 'ol/loadingstrategy';
import Proj from 'ol/proj';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Polygon from 'ol/geom/polygon';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Icon from 'ol/style/icon';
import Circle from 'ol/geom/circle';
import CircleStyle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import IconCache from 'ol/style/iconImageCache';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Extent from 'ol/extent';
import GeoJSON from 'ol/format/geojson';
import Select from 'ol/interaction/select';
import CanvasMap from 'ol/canvasmap';
import Overlay from 'ol/overlay';
import {productData} from './data/d3productSet1.js';
import {departmentsData} from './departmentsData.js';
import {subdepartmentsData} from './subdepartmentsData.js';
import Control from 'ol/control/control';
import matchSorter from 'match-sorter';

/*
* Utility Functions
* 
*/

const circleFeatureRender = function(features) {
  let circles = [];
  features.features.forEach(f => {
    const circle = new Feature({
      'geometry': new Circle(f.geometry.coordinates, f.properties.radius || 100),
      //'labelPoint': f.geometry.coordinates,
      'name': f.properties.name,
      'fill': f.properties.fill
    })
    circle.setId(f.id);
    circles.push(circle);
  })
  return circles;
}

const colors = [
  '#000',
  '#808080',
  '#A9A9A9',
  '#C0C0C0',
  '#E8E8E8',
  '#fff'
]

/*
* Product Features
* 
*/


const iconcache = new IconCache();
iconcache.setSize(productData.length);
const styleCache = {};

const productsVectorStyle = function(product, resolution) {
  let style = styleCache[product.getProperties().name];

  if (style) {
    style.getImage().setScale(1/resolution);
    //style.getImage().setRadius(100 / resolution);
    return [style]
  }
  else  {
    const productProperties = product.getProperties();
    // styleCache[product.getProperties().name] = new Style({
    //   image: new CircleStyle({
    //     fill: new Fill({color: colors[Math.floor(Math.random() * 5)]}),
    //     radius: 100 / resolution        
    //   })
    // })

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
  renderMode: 'vector',
  maxResolution: 6 
})

// Product circles (for high-resolution)

const productsCirclesStyle = function(product, resolution) {
  const properties = product.getProperties();
  let style = new Style({
    fill: new Fill({
      color: colors[Math.floor(Math.random() * 5)]
    }),
  })
  return style;
}

const productCircles = circleFeatureRender(productData)

const productsCirclesSource = new VectorSource({
       features: productCircles
});

const productsCirclesLayer = new VectorLayer({
  source: productsCirclesSource,
  style: productsCirclesStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: 5,
  opacity: 0.5
})


/*
* Department & Subdepartment Features
* 
*/


const departmentsVectorStyle = function(dept, resolution) {
  const properties = dept.getProperties();
  let style = new Style({
    fill: new Fill({
      color: properties.fill
    }),
    text: new Text({
      text: properties.name,
      fill: new Fill({
        color: '#aaa'
      }),
    })
  })
  return style;
}

const departments = circleFeatureRender(departmentsData);

const departmentsVectorSource = new VectorSource({
       features: departments
});

const departmentsVectorLayer = new VectorLayer({
  source: departmentsVectorSource,
  style: departmentsVectorStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})

const subdepartments = circleFeatureRender(subdepartmentsData);

const subdepartmentsVectorSource = new VectorSource({
       features: subdepartments
});

const subdepartmentsVectorLayer = new VectorLayer({
  source: subdepartmentsVectorSource,
  style: departmentsVectorStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})



/*
* Map & View
* 
*/

var view = new View({
  center: [39870,-37605],
  zoom: 8,
  zoomFactor: 1.25,
  minResolution: 1,
  maxResolution: 100,
})


var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [departmentsVectorLayer,subdepartmentsVectorLayer,productsVectorLayer,productsCirclesLayer],
  target: document.getElementById('map'),
  view: view
});


/*
* Controls
* 
*/

const searchControl = new Control({
  element: document.getElementById('search-overlay'),
});
map.addControl(searchControl);

const handleSearch = function(e) {
  e.preventDefault();
  const query = this.elements[0].value;
  if (query != '') {
    try {
      console.log('query',query);
      let products = productData.features;
      let match = matchSorter(products, query, {keys: ['properties.name'] })
      console.log('match',match[0].id);
      const feature = productsVectorLayer.getSource().getFeatureById(match[0].id); 
      map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
        resolution: 2 //need to make this a variable
      })
    }
    catch(err) {
      console.log(query +' not found');
    }
  }
} 

const searchForm = document.getElementById('search').addEventListener('submit', handleSearch);



/*
* Interactions
* 
*/

map.on('click', function(evt) {
  var info = document.getElementById('info');
  info.innerHTML = 
  'event coor: ' + evt.coordinate + 
  '<br> Coordinate from pixel: ' +  map.getCoordinateFromPixel(evt.coordinate) +
  '<br> Pixel from Coordinate: ' +  map.getPixelFromCoordinate(evt.coordinate) +
  '<br> event pixel: ' + map.getEventPixel(evt) + 
  '<br> event coordinate: ' + map.getEventCoordinate(evt.coordinate) + 
  '<br> features at pixel: ' + map.getFeaturesAtPixel(evt.pixel)[0].getProperties().name +
  '<br> Resolution: ' + map.getView().getResolution() + 
  '<br> Zoom: ' + map.getView().getZoom();
});


// let highlight; 

// const onProductHover = function(evt) {
//   const pixel = evt.pixel;
//   const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
//   const resolution = map.getView().getResolution();
//   if (feature !== highlight) {
//     if (highlight) {
//       highlight.setStyle(productsVectorStyle);
//     }
//     if (feature) {
//       feature.setProperties({'hover': true});
//       let properties = feature.getProperties();
//       feature.setStyle(styleCache[feature.getProperties().name]);
//       feature.getStyle().getImage().setScale(1/resolution * 1.1);
//     }
//     highlight = feature;
//   }

// }

// map.on('pointermove', onProductHover);

// let clicked; 

// const onProductClick = function(evt) {
//   const pixel = evt.pixel;
//   const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
//   console.log('step 1' + feature, clicked);
//   if (feature !== clicked) {
//     console.log('step 2: ' + feature,clicked);
//     if (clicked) {
//       clicked.setStyle( function (resolution) {
//         this.get('originalStyle').getImage().setScale(1 / resolution);
//         this.get('originalStyle').setZIndex(0);
//         return this.get('originalStyle');
//       });
//     }
//     if (feature) {
//       feature.setStyle( function (resolution) {
//         this.get('originalStyle').getImage().setScale(1);
//         this.get('originalStyle').setZIndex(1);
//         return this.get('originalStyle');
//       }); 
//     }
//     clicked = feature;
//   }
// }



