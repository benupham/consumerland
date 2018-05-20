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
import MouseWheelZoom from 'ol/interaction/mousewheelzoom';
import CanvasMap from 'ol/canvasmap';
import {productData} from './data/productData.js';
import {brandsData} from './data/brandsData.js';
import {departmentsData} from './data/departmentsData.js';
import {subdepartmentsData} from './data/subdepartmentsData.js';

import {productCardOverlay, productDetailOverlay, signage, renderProductOverlay, openProductDetail, hideOverlay} from './components/overlays.js';
import {textFormatter, dataTool} from './utilities.js';
import {displayCart, updateCart, updateAddCartButton} from './components/cart.js';
import {displaySignage} from './components/signage.js';
import {searchControl, handleSearch} from './components/search.js';


/*
*  Constants
* 
*/

// Resolution

export const productsImageMax = 5;
const deptsTextMin = 30;
const subdeptsTextMax = 30;
const subdeptsFillMax = 90;
const subdeptsTextMin = 10;
const brandsTextMax = 10;
const brandsFillMax = 20;

const sqrt2 = Math.sqrt(2);

// Offsets

const nameOffset = 120;
const priceOffset = 146;

// Colors

const colors = [
  '#303030',
  '#606060',
  '#808080',
  '#A9A9A9',
  '#C0C0C0',
  '#DCDCDC',
  '#E8E8E8',
  '#fff'
]

/*
* Product Image Features
* 
*/

export const iconcache = new IconCache();
iconcache.setSize(productData.length);
const styleCache = {};

const productsVectorStyle = function(product, resolution) { 
  let style = styleCache[product.getProperties().name];
  if (style) {
    style[0].getImage().setScale(1 / resolution); //resize image icon

    style[1].getText().setScale(1.25 / resolution); // resize text size
    style[1].getText().setOffsetY(nameOffset / resolution);
    style[1].getText().setOffsetX(-100 / resolution);

    style[2].getText().setScale(1.25 / resolution); // resize text size
    style[2].getText().setOffsetY(priceOffset / resolution);
    style[2].getText().setOffsetX(-100 / resolution);

    return style
  }
  else  {
    const productProperties = product.getProperties();

    let productIcon = iconcache[productProperties.src];
    if (!productIcon) {
      productIcon = new Icon({
        offset: productProperties.offset,
        size: productProperties.size,
        stroke: new Stroke({color: '#dee2e6', width: 1 }),
        scale: 1 / resolution,
        crossOrigin: 'anonymous',
        src: productProperties.src
      });
    }
    
    const productName = new Style({
      text: new Text({
        text: textFormatter(productProperties.name, 24, '\n', 40),
        textAlign: 'left',
        scale: 1.25 / resolution,
        font: '12px sans-serif',
        stroke: new Stroke({color: '#fff', width: 2}),
        fill: new Fill({color: '#606060' }),
        offsetX: -100 / resolution,
        offsetY: nameOffset / resolution
      }),
      zIndex: 10
    })

    const productPrice = new Style({
      text: new Text({
        text: productProperties.price,
        textAlign: 'left',
        scale: 1.25 / resolution,
        font: '12px sans-serif',
        stroke: new Stroke({color: '#fff', width: 2}),
        fill: new Fill({color: '#303030' }),
        offsetX: -100 / resolution,
        offsetY: priceOffset / resolution
      }),
      zIndex: 10
    }) 

    // array of styles 
    styleCache[product.getProperties().name] = [
      new Style({
        image: productIcon,
        zIndex: 9,
      }),
      productName,
      productPrice
    ]

    return styleCache[product.getProperties().name]

  }
}

const productsImageFeatures = (new GeoJSON()).readFeatures(productData)

export const productsVectorSource = new VectorSource({
  features: productsImageFeatures,
  overlaps: false
});
const productsVectorLayer = new VectorLayer({
  source: productsVectorSource,
  style: productsVectorStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderMode: 'vector',
  maxResolution: productsImageMax 
})



/*
* Product on Sale, in Cart, Tagged Features and Styles
* 
*/

const tagsData = {
  sale: {color: '', src: 'sale.png'}
}

const tagFeatureRender = function(featureCollection, colors = null, tagType = 'sale') {
  let tags = [];
  featureCollection.features.forEach( (f) => {
    if (f.properties.price.indexOf('Reg') > -1) {
      const tag = new Feature({
        'geometry': new Point([f.geometry.coordinates[0] - 75, f.geometry.coordinates[1] + 75]),
        'name': f.id + '-' + tagType,
        'type': tagType,
      })
      tag.setId(f.id + '-' + tagType);
      tags.push(tag);      
    }
  })
  return tags;
}


const tagStyle = function (tag, resolution) {
  const type = tag.get('type');
  const src = tagsData[type].src || 'sale.png';
  let style = {};

  let tagIcon = iconcache[src];

  if (!tagIcon) {
    tagIcon = new Icon({
      size: [32,32],
      // scale: 1 / resolution + .3,
      crossOrigin: 'anonymous',
      src: './product-images/tags/' + src
    });
  }

  tagIcon.setScale(1 / resolution);
  
  iconcache[src] = tagIcon;

  style = new Style({
    image: tagIcon
  })

  return style
}

const tagFeatures = tagFeatureRender(productData);
const tagSource = new VectorSource({
  features: tagFeatures,
  overlaps: false
});

const tagLayer = new VectorLayer({
  source: tagSource,
  style: tagStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderMode: 'vector',
  maxResolution: productsImageMax 
})



/*
* Department, Subdepartment & Brands (Subcategories) Features with Fill
* 
*/

// Do not use with already-ingested GeoJSON data -- only the actual JSON variable
const circleFeatureRender = function(featureCollection, colors = null) {
  let circles = [];
  featureCollection.features.forEach(f => {
    const circle = new Feature({
      'geometry': new Circle(f.geometry.coordinates, f.properties.radius || (100 * Math.sqrt(2))),
      //'labelPoint': f.geometry.coordinates,
      'name': f.properties.name,
      'price': f.properties.price || '',
      'type': f.properties.type,
      'src': f.properties.src || ''
    })
    circle.setId(f.id);
    circles.push(circle);
  })
  return circles;
}

const standardFont = '16px sans-serif'; 
const standardFontColor = new Fill({ color: '#606060' });
const standardFontStroke = new Stroke({ color: '#fff', width: 2 });


const circleFillStyle = function(feature, resolution) {
  const properties = feature.getProperties();
  console.log(properties);
  let fill = '#fff';
  if (properties.hover == true && resolution > productsImageMax) {
    fill = '#DCDCDC';
  } 

  const style = new Style({
    fill: new Fill({ color: fill }),
    stroke: new Stroke({ color: '#C0C0C0', width: 2 }) 
  })
  if (resolution <= productsImageMax) {
    style.setStroke(null);
  }

  return style
}

const circleTextStyle = function(feature, resolution) {
  const name = feature.get('name');
  const src = feature.get('src');
  const center = feature.getGeometry().getCenter();
  const radius = feature.getGeometry().getRadius();
  let style = {};

  if (src !== '') {
    let logoIcon = iconcache[src];

    if (!logoIcon) {
      logoIcon = new Icon({
        size: [200,200],
        scale: 1 / resolution + .3,
        crossOrigin: 'anonymous',
        src: './product-images/brand-logos/' + src
      });
      iconcache[src] = logoIcon;
    }
    logoIcon.setScale(1 / resolution + .3);
    style = new Style({
      image: logoIcon,
      geometry: new Point(center)
    })
  } else {
    style = new Style({
      text: new Text({
        text: name,
        font: standardFont,
        fill: standardFontColor,
        stroke: standardFontStroke,
      })
    })  
  }

  return style
  // }
}

const circleStyle = function(feature, resolution) {
  const props = feature.getProperties();
  if (style) {
    // update style
    if (props.hover == true && resolution > productsImageMax) {
      fill = '#DCDCDC';
      
    }

  } else {
    
    const name = props.name;
    const src = props.src;
    const center = props.geometry.getCenter();
    const radius = props.geometry.getRadius();

    let fill = '#fff';

    if (src !== '') {
      let logoIcon = iconcache[src];

      if (!logoIcon) {
        logoIcon = new Icon({
          size: [200,200],
          scale: 1 / resolution + .3,
          crossOrigin: 'anonymous',
          src: './product-images/brand-logos/' + src
        });
        iconcache[src] = logoIcon;
      }
      logoIcon.setScale(1 / resolution + .3);
      
      style = new Style({
        image: logoIcon,
        geometry: new Point(center)
      })
    } else {
      style = new Style({
        text: new Text({
          text: name,
          font: standardFont,
          fill: standardFontColor,
          stroke: standardFontStroke
        })
      })  
    }
  }
  style = [

  ]
  return style
}
/* Departments */

const departments = circleFeatureRender(departmentsData, colors);

export const departmentsSource = new VectorSource({
       features: departments
});

const departmentsFillLayer = new VectorLayer({
  source: departmentsSource,
  style: circleFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})

const departmentsTextLayer = new VectorLayer({
  source: departmentsSource,
  style: circleTextStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: deptsTextMin
})

/* Subdepartments */

const subdepartments = circleFeatureRender(subdepartmentsData, colors);

export const subdepartmentsSource = new VectorSource({
       features: subdepartments
});

const subdepartmentsFillLayer = new VectorLayer({
  source: subdepartmentsSource,
  style: circleFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: subdeptsFillMax
})

const subdepartmentsTextLayer = new VectorLayer({
  source: subdepartmentsSource,
  style: circleTextStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: subdeptsTextMax,
  minResolution: subdeptsTextMin
})

/*
*  Brands 
* 
*/

const brands = circleFeatureRender(brandsData, colors);

const brandsSource = new VectorSource({
  features: brands
})

const brandsFillLayer = new VectorLayer({
  source: brandsSource,
  style: circleFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: brandsFillMax
})

const brandsTextLayer = new VectorLayer({
  source: brandsSource,
  style: circleTextStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: 10
})


/*
* Map & View
* 
*/

export const view = new View({
  center: [55667,-46227],
  // extent: [2400,-9795,92400,-83963],
  resolution: 10,
  zoomFactor: 1.25,
  minResolution: 1,
  maxResolution: 100,
})

export const map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [
    departmentsFillLayer,
    subdepartmentsFillLayer,
    brandsFillLayer,
    productsVectorLayer,
    tagLayer,
    departmentsTextLayer,
    subdepartmentsTextLayer,
    brandsTextLayer
    ],
  target: document.getElementById('map'),
  view: view
});

const mapResize = function(e) {
  const mapHeight = document.documentElement.clientHeight;
  const mapWidth = document.documentElement.clientWidth;
  document.querySelector('#map').style.height = mapHeight + 'px';
  map.setSize([mapWidth,mapHeight]);
  map.updateSize();
}
window.addEventListener('load', mapResize);
window.addEventListener('resize', mapResize);

map.addOverlay(productCardOverlay);
map.addOverlay(productDetailOverlay);
for (let i = 0; i < 4; i++) {
  map.addOverlay(signage[i]);
}


map.on('moveend', (e) => {
  if (jumpStripActive === true) return; 
  const signageTimeOut = setTimeout(displaySignage, 100);
});

map.addControl(searchControl);


/*
* Interactions
* 
*/

/* On Hover */ 

let jumpStripsInt = null;
let jumpStripActive = false;
const handleJumpStrips = function(e) {
  // prevent firing if dragging mouse
  if (e.dragging === true) return;

  map.getTargetElement().style.cursor = 'pointer';

  jumpStripActive = true; 

  const res = view.getResolution();
  if (res >= 100) window.clearInterval(jumpStripsInt);
  const size = map.getSize();
  const limit = [size[0] - 100, size[1] - 100];
  const pixel = e.pixel;
  const p = map.getCoordinateFromPixel(e.pixel);
  const ctr = view.getCenter();

  const x = p[0];
  const y = p[1];

  const delta = res / 5;

  let velocity = 10;
  if (pixel[0] < 100 || pixel[1] < 100) {
    velocity = pixel[0] <= pixel[1] ? (100 - pixel[0]) * delta : (100 - pixel[1]) * delta;
  } else {
    velocity = pixel[0] > limit[0] ? (pixel[0] - limit[0]) * delta : (pixel[1] - limit[1]) * delta;
  }  
  const angle = Math.atan2(p[1] - ctr[1], p[0] - ctr[0]); 
  const adj = Math.sin(angle) * velocity;
  const opp = Math.cos(angle) * velocity; 
  const newCtr = [ctr[0] + opp, ctr[1] + adj];

  view.setCenter(newCtr);

  const resDelta = delta * 0.05;
  if (res < 100) {
    view.setResolution(res + resDelta);
  }

  // dataTool.innerHTML = `resolution: ${res}<br>resDelta: ${resDelta}<br>pixel: ${pixel}<br>point: ${p}<br>delta: ${delta}<br>velocity: ${velocity}
  // <br>limit: ${limit}<br>center: ${ctr}`;
}

let highlight = undefined; 
const handleHover = function(e) {
  const resolution = view.getResolution();
  // if (jumpStripsInt != null) {
  //   window.clearInterval(jumpStripsInt);
  //   jumpStripActive = false; 
  // }

  // const size = map.getSize();
  // if (resolution < view.getMaxResolution() && (e.pixel[0] < 100 || e.pixel[1] < 100 || e.pixel[0] > size[0] - 100 || e.pixel[1] > size[1] - 100)) {
  //   jumpStripsInt = window.setInterval(handleJumpStrips, 16, e);
  //   hideOverlay(productCardOverlay);
  //   return
  // } else if (jumpStripsInt != null) {
  //   window.clearInterval(jumpStripsInt);
  //   map.getTargetElement().style.cursor = '';
  //   jumpStripActive = false;
  // }

  if (map.hasFeatureAtPixel(e.pixel)) {
    const features = map.getFeaturesAtPixel(e.pixel);
    const feature = features[0];
    const featureType = feature.get('type');

    if (featureType == 'product') {
      renderProductOverlay(feature, productCardOverlay);
    } 
    else if ((resolution > productsImageMax) && (featureType == 'brand' || 'dept' || 'subdept')) {
      hideOverlay(productCardOverlay);
      map.getTargetElement().style.cursor = 'pointer';
      if (feature != highlight) {
        if (highlight) {
          highlight.set('hover', false);
          feature.dispatchEvent('change');
        }
        feature.set('hover', true);
        feature.dispatchEvent('change');
        highlight = feature;
      }

    } else {
      hideOverlay(productCardOverlay);
      map.getTargetElement().style.cursor = '';
    }
  } else {
    hideOverlay(productCardOverlay);
    map.getTargetElement().style.cursor = '';
    if (highlight) {
      highlight.set('hover', false);
      highlight = undefined;
    }
  }
}
map.on('pointermove', handleHover);
map.getTargetElement().addEventListener('mouseleave', function(){
  window.clearInterval(jumpStripsInt);
})


/* On Click */

const handleClick = function(e) {
  
  const features = map.getFeaturesAtPixel(e.pixel);

  if (features == null) {
    hideOverlay(productCardOverlay);
    return;
  }
  const feature = features[0];
  const featureType = feature.get('type');
  const zoom = view.getZoom();
  const res = view.getResolution();
  const mapSize = map.getSize();
  const constraint = [mapSize[0] + 500, mapSize[1] + 100] ;

  if (featureType == 'product') {
    hideOverlay(productCardOverlay);
    renderProductOverlay(feature, productDetailOverlay);

  } else if ((featureType == 'brand' || 'dept' || 'subdept') && res > productsImageMax) {
    hideOverlay(productDetailOverlay);
    view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

  } else {
    hideOverlay(productDetailOverlay);
  }

}
map.on('singleclick', handleClick);



/* Featured Items */

//add featured items
//remove featured items
// place featured items

