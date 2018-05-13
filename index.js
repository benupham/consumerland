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
import {productData} from './data/productData.js';
import {brandsData} from './data/brandsData.js';
import {departmentsData} from './data/departmentsData.js';
import {subdepartmentsData} from './data/subdepartmentsData.js';
import Control from 'ol/control/control';
import matchSorter from 'match-sorter';

/*
* Utility Functions
* 
*/

// Do not use with already-ingested GeoJSON data -- only the actual JSON variable
const circleFeatureRender = function(featureCollection, colors = null) {
  let circles = [];
  featureCollection.features.forEach(f => {
    const circle = new Feature({
      'geometry': new Circle(f.geometry.coordinates, f.properties.radius || 100),
      //'labelPoint': f.geometry.coordinates,
      'name': f.properties.name,
      'type': f.properties.type,
      'fill': 'lightgrey'//colors ? colors[Math.floor(Math.random() * (colors.length -1))] : f.properties.fill 
    })
    circle.setId(f.id);
    circles.push(circle);
  })
  return circles;
}

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

function textFormatter(str, width, spaceReplacer, maxLength = null) {
  if (maxLength !== null) {
    str = str.length > maxLength ? str.substr(0, maxLength - 1) + '...' : str.substr(0);
  }
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
      return left + spaceReplacer + textFormatter(right, width, spaceReplacer, maxLength);
    }
  }
 
  return str;    
}


/*
* Resolution Constants
* 
*/

const productsImageMax = 5;
const deptsTextMin = 30;
const subdeptsTextMax = 30;
const subdeptsFillMax = 90;
const subdeptsTextMin = 10;
const brandsTextMax = 10;
const brandsFillMax = 20;

/*
* Product Image Features
* 
*/

const iconcache = new IconCache();
iconcache.setSize(productData.length);
const styleCache = {};

const removeIcon = new Style({
  image: new Icon({
    size: [24,24],
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    anchor: [-85,85],
    crossOrigin: 'anonymous',
    src: 'product-images/remove.png'
  }),
  zIndex: 100
})

const addIcon = new Style({
  image: new Icon({
    size: [24,24],
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    anchor: [-85,85],
    crossOrigin: 'anonymous',
    src: 'product-images/add.png'
  }),
  zIndex: 100
})

const productsVectorStyle = function(product, resolution) { 
  let style = styleCache[product.getProperties().name];
  if (style) {
    style[0].getImage().setScale(1 / resolution); //resize image icon
    style[1].getText().setScale(1.25 / resolution); // resize text size
    style[1].getText().setOffsetY(120 / resolution); // resize text position relative to image
    style[2].getText().setScale(1.25 / resolution); // resize text size
    style[2].getText().setOffsetY(160 / resolution); // resize text position relative to image
    style[1].getText().getFill().setColor('#606060');
    style[2].getText().getFill().setColor('#606060');
    style[0].setZIndex(1);
    style[1].setZIndex(10);
    style[2].setZIndex(10);
    // style[0].setStroke(null);
    if (product.get('highlighted') === true) {
      style[0].getImage().setScale(1);
      style[1].getText().setScale(1);
      style[2].getText().setScale(1);
      style[1].getText().getFill().setColor('orange');
      style[2].getText().getFill().setColor('orange');
      style[0].setZIndex(30);
      style[1].setZIndex(30);
      style[2].setZIndex(30);
    } 
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
        text: textFormatter(productProperties.name, 30, '\n', 63),
        scale: 1.25 / resolution,
        font: '12px sans-serif',
        stroke: new Stroke({color: '#fff', width: 2}),
        fill: new Fill({color: '#606060' }),
        offsetY: 120 / resolution
      }),
      zIndex: 10
    })

    const productPrice = new Style({
      text: new Text({
        text: productProperties.price,
        scale: 1.25 / resolution,
        font: '18px sans-serif',
        stroke: new Stroke({color: '#fff'}),
        fill: new Fill({color: '#606060' }),
        offsetY: 160 / resolution
      }),
      zIndex: 10
    }) 

    // array of styles 
    styleCache[product.getProperties().name] = [
      new Style({
        image: productIcon,
        zIndex: 1,
      }),
      productName,
      productPrice
    ]

    return styleCache[product.getProperties().name]

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
  maxResolution: productsImageMax 
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
* Department, Subdepartment & Brands (Subcategories) Features with Fill
* 
*/

const standardFont = '16px sans-serif'; 
const standardFontColor = new Fill({ color: '#606060' });
const standardFontStroke = new Stroke({ color: '#fff', width: 2 });

const dataTool = document.querySelector('#data-tool');

const circleFillStyle = function(feature, resolution) {
  dataTool.innerHTML = 'zoom: ' + view.getZoom() + '<br>res: ' + view.getResolution();
  const properties = feature.getProperties();

  const style = new Style({
    fill: new Fill({ color: '#fff' }),
    stroke: new Stroke({ color: '#C0C0C0', width: 2 }) 
  })
  if (properties.type === 'brand' && resolution <= 5) {
    style.getFill().setColor('#fff');
  }

  return style
}

const circleTextStyle = function(feature, resolution) {
  const properties = feature.getProperties();

  const style = new Style({
    text: new Text({
      text: properties.name,
      font: standardFont,
      fill: standardFontColor,
      stroke: standardFontStroke
    })
  })
  if (properties.type === 'brand' && resolution <= 5) {
    const brandOffset = -(properties.geometry.getRadius() - 100) / resolution;
    style.getText().setOffsetY(brandOffset);
  }

  return style
}
/* Departments */

const departments = circleFeatureRender(departmentsData, colors);

const departmentsSource = new VectorSource({
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

const subdepartmentsSource = new VectorSource({
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

var view = new View({
  center: [48685.686728395056,-31232.65817901234],
  resolution: 100,
  zoomFactor: 1.25,
  minResolution: 1,
  maxResolution: 100,
})

var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [
    departmentsFillLayer,
    subdepartmentsFillLayer,
    brandsFillLayer,
    productsVectorLayer,
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


/*
* Controls
* 
*/

const handleSearch = function(e) {
  if (e.keyCode != 13) {
    return
  }
  const query = document.getElementById('search-input').value;
  if (query != '') {
    try {
      console.log('query',query);
      let products = productData.features;
      let match = matchSorter(products, query, {keys: ['properties.name'] })
      console.log('match',match[0].id);
      const feature = productsVectorLayer.getSource().getFeatureById(match[0].id); 
      map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
        resolution: productsImageMax //need to make this a variable
      })
    }
    catch(err) {
      console.log(query +' not found');
    }
  }
} 

const searchControl = new Control({
  element: document.getElementById('search-cart-overlay'),
});
document.getElementById('search-button').onclick = handleSearch;

document.getElementById('search-input').onkeypress = handleSearch;

map.addControl(searchControl);


/*
* Overlays
* 
*/

// Product Card
const productOverlay = new Overlay({
  element: document.getElementById('product-overlay'),
  autoPan: true,
});

map.addOverlay(productOverlay);

const updateProductOverlay = function(status) {
  const btn = document.getElementById('add-to-cart');
  if (status == 'in') {
    btn.classList.remove("btn-outline-warning");
    btn.classList.add('btn-outline-secondary');
    btn.textContent = 'Remove';
    btn.onclick = removeProductFromCart; 
  } else if (status == 'out') {
    btn.classList.remove("btn-outline-secondary");
    btn.classList.add('btn-outline-warning');
    btn.textContent = 'Add to Cart';
    btn.onclick = addProductToCart;
  }
}

const renderProductOverlay = function(product) {
  document.getElementById('product-overlay').style.display = 'block';
  productOverlay.set('product', product.getId());
  const coordinate = product.getGeometry().getCoordinates();
  


  if (cartContents.querySelector('#item-'+product.getId())) {
    updateProductOverlay('in');
  } else {
    updateProductOverlay('out');
  }
  productOverlay.setPosition(coordinate);

  let name = document.querySelector('#product-name');
  let price = document.querySelector('#product-price');
  let image = document.querySelector('#product-image');

  name.textContent = product.get('name');
  price.textContent = product.get('price');

  image.src = '';
  image.src = product.get('src');
  const offset = [-100 - image.offsetLeft, -100 - image.offsetTop];
  productOverlay.setOffset(offset);
  
} 

const hideProductOverlay = function() {
  document.getElementById('product-overlay').style.display = 'none';
}


/*
* Cart
* 
*/

const cart = [];
const cartContents = document.querySelector('#cart-contents');

const addProductToCart = function() {
  const pId = productOverlay.get('product');
  const product = productsVectorSource.getFeatureById(pId);
  updateProductOverlay('in');
  cart.push({
    pId: pId,
    name: product.get('name'),
    src: product.get('src'),
    price: product.get('price')
  });
  cart.forEach(p => {
    if (!cartContents.querySelector('#item-'+p.pId)) {
      const cartItem = document.getElementById('cart-item').cloneNode(true);
      cartItem.id = 'item-' + p.pId;
      cartItem.querySelector('img').src = p.src;
      cartItem.querySelector('.cart-product-name').textContent = p.name;
      cartContents.appendChild(cartItem);      
    }
  })
  console.log(cart);
}
document.getElementById('add-to-cart').onclick = addProductToCart;

const removeProductFromCart = function() {
  const pId = productOverlay.get('product');
  const product = productsVectorSource.getFeatureById(pId);
  for (var i = cart.length - 1; i >= 0; i--) {
    if (cart[i].pId == productOverlay.get('product')) {
      cart.splice(i,1);
      cartContents.removeChild(cartContents.childNodes[i]);
      updateProductOverlay('out');
      break
    }
  }
}

const displayCart = function() {
  if (cartContents.style.display == 'block') {
    cartContents.style.display = 'none';
    return
  }
  cartContents.style.display = 'block';
}
document.getElementById('cart-open-button').onclick = displayCart;

/*
* Interactions
* 
*/


/* On Hover */ 

map.on('wheel', e => {
  hideProductOverlay();
})

let highlighted = null;
const handleHover = function(e) {
  const resolution = view.getResolution();

  if (map.hasFeatureAtPixel(e.pixel)) {
    const features = map.getFeaturesAtPixel(e.pixel);
    const feature = features[0];
    const featureType = feature.get('type');
    if (feature != highlighted) {
      if (highlighted) {
        highlighted.set('highlighted', false);
      } 
      if (featureType == 'product') {
        map.getTarget().style.cursor = 'pointer';
        feature.set('highlighted', true);
        const hoverStyle = productsVectorStyle(feature);
        styleCache[feature.get('name')] = hoverStyle;
      } 
      highlighted = feature;
    } 
    if (featureType != 'product') {
      map.getTarget().style.cursor = '';
    }
  } else {
  }
}
map.on('pointermove', handleHover);


/* On Click */

const handleClick = function(e) {
  const features = map.getFeaturesAtPixel(e.pixel);
  const feature = features[0];
  const featureType = feature.get('type');

  if (document.getElementById('product-overlay').style.display == 'block' &&
      featureType != 'product') {
    hideProductOverlay();
    return
  }
  if (features.length > 0) {
    const zoom = view.getZoom();
    console.log(zoom);
    const mapSize = map.getSize();
    const constraint = [mapSize[0] + 1000, mapSize[1] + 2000] ;

    if (featureType == 'product') {
      renderProductOverlay(feature);

    } else if (featureType == 'brand') {
      hideProductOverlay();
      view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

    } else if (featureType == 'subdept') {
      hideProductOverlay();
      view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

    } else if (featureType == 'dept') {
      hideProductOverlay();
      view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

    } else {
      // handle cases of "fake" feature layers, like product circles
    }
  } else {
    // what happens if they click on no features? 
  }
}

map.on('click', handleClick);


// map.on('click', function(evt) {
//   var info = document.getElementById('info');
//   info.innerHTML = 
//   'event coor: ' + evt.coordinate + 
//   '<br> Coordinate from pixel: ' +  map.getCoordinateFromPixel(evt.coordinate) +
//   '<br> Pixel from Coordinate: ' +  map.getPixelFromCoordinate(evt.coordinate) +
//   '<br> event pixel: ' + map.getEventPixel(evt) + 
//   '<br> event coordinate: ' + map.getEventCoordinate(evt.coordinate) + 
//   '<br> features at pixel: ' + map.getFeaturesAtPixel(evt.pixel)[0].getProperties().name +
//   '<br> Resolution: ' + map.getView().getResolution() + 
//   '<br> Zoom: ' + map.getView().getZoom();
// });


// let highlight; 






