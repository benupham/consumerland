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
import RegularShape from 'ol/style/regularshape';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import IconCache from 'ol/style/iconImageCache';
import Style from 'ol/style/style';
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

const circleFeatureRender = function(features, colors = null) {
  let circles = [];
  features.features.forEach(f => {
    const circle = new Feature({
      'geometry': new Circle(f.geometry.coordinates, f.properties.radius || 100),
      //'labelPoint': f.geometry.coordinates,
      'name': f.properties.name,
      'fill': colors ? colors[Math.floor(Math.random() * (colors.length -1))] : f.properties.fill 
    })
    circle.setId(f.id);
    circles.push(circle);
  })
  return circles;
}

const colors = [
  '#000',
  '#303030',
  '#606060',
  '#808080',
  '#A9A9A9',
  '#C0C0C0',
  '#DCDCDC',
  '#E8E8E8',
  '#fff'
]

function stringDivider(str, width, spaceReplacer) {
        if (str.length > width) {
          var p = width;
          while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
            p--;
          }
          if (p > 0) {
            var left;
            if (str.substring(p, p + 1) == '-') {
              left = str.substring(0, p + 1);
            } else {
              left = str.substring(0, p);
            }
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
          }
        }
        return str;
      }

/*
* Product Image Features
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

/*
* Product Circle Features (at low zoom levels)
* 
*/

const productsCirclesStyle = function(product, resolution) {
  const properties = product.getProperties();
  let style = new Style({
    fill: new Fill({
      color: properties.fill
    }),
  })
  return style;
}

const productCircles = circleFeatureRender(productData, colors);

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
* Product Names
* 
*/

const productsNamesStyle = function(product, resolution) {
  const properties = product.getProperties();
  let style = new Style({
    text: new Text({
      text: stringDivider(properties.name, 24, '\n'),
      scale: 1.25 / resolution,
      offsetY: 140 / resolution
    })
  })
  return style;
}

const productsNamesLayer = new VectorLayer({
  source: productsVectorSource,
  style: productsNamesStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderMode: 'vector',
  maxResolution: 6 
})



/*
* Department & Subdepartment Features with Fill
* 
*/

const departments = circleFeatureRender(departmentsData, colors);
const subdepartments = circleFeatureRender(subdepartmentsData, colors);

const departmentsFillStyle = function(dept, resolution) {
  const properties = dept.getProperties();
  const fill = new Fill({ color: properties.fill });

  let style = new Style({
      fill: fill,
      text: new Text({
        text: properties.name,
        fill: new Fill({
          color: '#aaa'
        }),
      })
    })

  return style;
}

const departmentsFillSource = new VectorSource({
       features: departments
});

const departmentsFillLayer = new VectorLayer({
  source: departmentsFillSource,
  style: departmentsFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: 6
})

const subdepartmentsFillSource = new VectorSource({
       features: subdepartments
});

const subdepartmentsFillLayer = new VectorLayer({
  source: subdepartmentsFillSource,
  style: departmentsFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: 6
})

/*
* Department & Subdepartment Features No Fill
* 
*/

const departmentsNoFillStyle = function(dept, resolution) {
  const properties = dept.getProperties();
  const stroke = new Stroke({ color: properties.fill, width: 20 });

  let style = new Style({
      stroke: stroke,
      text: new Text({
        text: properties.name,
        fill: new Fill({
          color: '#aaa'
        }),
      })
    })

  return style;
}

const departmentsNoFillSource = new VectorSource({
       features: departments
});

const departmentsNoFillLayer = new VectorLayer({
  source: departmentsNoFillSource,
  style: departmentsNoFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: 6
})

const subdepartmentsNoFillSource = new VectorSource({
       features: subdepartments
});

const subdepartmentsNoFillLayer = new VectorLayer({
  source: subdepartmentsNoFillSource,
  style: departmentsNoFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: 6
})


/*
* Map & View
* 
*/

var view = new View({
  center: [39870,-37605],
  resolution: 20,
  zoomFactor: 1.5,
  minResolution: .75,
  maxResolution: 100,
})


var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [
    departmentsFillLayer,
    subdepartmentsFillLayer,
    departmentsNoFillLayer,
    subdepartmentsNoFillLayer,
    productsVectorLayer,
    productsCirclesLayer,
    productsNamesLayer
    ],
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



