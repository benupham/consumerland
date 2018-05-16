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
*  Constants
* 
*/

// Resolution

const productsImageMax = 5;
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
  zIndex: 100,
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
    style[0].setZIndex(2);

    style[1].getText().setScale(1.25 / resolution); // resize text size
    style[1].getText().setOffsetY(nameOffset / resolution);
    style[1].getText().setOffsetX(-100 / resolution);
    style[1].getText().getFill().setColor('#606060');
    style[1].setZIndex(10);

    style[2].getText().setScale(1.25 / resolution); // resize text size
    style[2].getText().setOffsetY(priceOffset / resolution);
    style[2].getText().setOffsetX(-100 / resolution);
    style[2].getText().getFill().setColor('#606060');
    style[2].setZIndex(10);

    if (product.get('highlighted') === true) {
      style[0].getImage().setScale(1);
      style[0].setZIndex(30);

      style[1].getText().setScale(1.25);
      style[1].getText().getFill().setColor('orange');
      style[1].getText().setOffsetY(nameOffset);
      style[1].getText().setOffsetX(-100);
      style[1].setZIndex(30);

      style[2].getText().setScale(1.25);
      style[2].getText().getFill().setColor('orange');
      style[2].getText().setOffsetY(priceOffset);
      style[2].getText().setOffsetX(-100);
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

const productsVectorSource = new VectorSource({
  features: productsImageFeatures
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
* Department, Subdepartment & Brands (Subcategories) Features with Fill
* 
*/

const standardFont = '16px sans-serif'; 
const standardFontColor = new Fill({ color: '#606060' });
const standardFontStroke = new Stroke({ color: '#fff', width: 2 });


const circleFillStyle = function(feature, resolution) {
  const properties = feature.getProperties();

  const style = new Style({
    fill: new Fill({ color: '#fff' }),
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
        stroke: standardFontStroke
      })
    })  
  }

  return style
  // }
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
  center: [55667,-46227],
  // extent: [2400,-9795,92400,-83963],
  resolution: 10,
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
        resolution: productsImageMax - .001 //need to make this a variable
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

document.getElementById('search-cart-overlay').onpointermove = function(e) {e.stopPropagation()};

map.addControl(searchControl);


/*
* Overlays
* 
*/



// Product Card Overlay (hover)
const productCardOverlay = new Overlay({
  element: document.getElementById('product-card'),
  autoPan: false,
  stopEvent: false
});
map.addOverlay(productCardOverlay);

// Product Overlay (click)
const productOverlay = new Overlay({
  element: document.getElementById('product-overlay'),
  autoPan: true,
  stopEvent: false
});
map.addOverlay(productOverlay);

const updateAddCartButton = function(inCart, btn) {
  if (inCart === true) {
    btn.classList.remove("btn-outline-warning");
    btn.classList.add('btn-outline-secondary');
    btn.textContent = 'Remove';
  } else if (inCart === false) {
    btn.classList.remove("btn-outline-secondary");
    btn.classList.add('btn-outline-warning');
    btn.textContent = 'Add to Cart';
  }
}

const renderProductOverlay = function(product, overlay) {
  overlay.getElement().onpointermove = function(e) {e.stopPropagation()};
  overlay.getElement().onpointerdown = function(e) {e.stopPropagation()};
  overlay.getElement().style.display = 'block';
  overlay.set('product', product.getId());
  const coordinate = product.getGeometry().getCoordinates();
  
  const btn = overlay.getElement().querySelector('.add-to-cart');
  btn.setAttribute('data-pid', product.getId());
  const inCart = product.get('inCart') || false;
  updateAddCartButton(inCart, btn);
  btn.addEventListener('click', updateCart);

  overlay.setPosition(coordinate);

  let name = overlay.getElement().querySelector('.product-name');
  let price = overlay.getElement().querySelector('.product-price');
  let image = overlay.getElement().querySelector('.product-image');

  name.textContent = product.get('name');
  price.textContent = product.get('price');

  image.src = '';
  image.src = product.get('src');
  const offset = [-100 - image.offsetLeft, -100 - image.offsetTop];
  overlay.setOffset(offset);
  
} 

const hideProductOverlay = function(overlay) {
  overlay.getElement().style.display = 'none';
}


/*
* Cart
* 
*/

const cart = [];
const cartContents = document.querySelector('#cart-contents');

const updateCart = function(e) {
  const pId = this.getAttribute('data-pid');
  const product = productsVectorSource.getFeatureById(pId);
  const src = product.get('src');
  const name = product.get('name');

  for (var i = cart.length - 1; i >= 0; i--) {
    if (cart[i].pId == pId) {
      cart.splice(i,1);
      cartContents.removeChild(cartContents.childNodes[i]);
      updateAddCartButton(false, this);
      product.set('inCart',false);
      return 
    } 
  }

  cart.push({
    pId: pId,
    name: product.get('name'),
    src: product.get('src'),
    price: product.get('price')
  });

  const cartItem = document.getElementById('cart-item').cloneNode(true);
  cartItem.id = 'item-' + pId;
  cartItem.querySelector('img').src = src;
  cartItem.querySelector('.cart-product-name').textContent = name;
  cartContents.appendChild(cartItem);
  product.set('inCart',true);
  updateAddCartButton(true, this);

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

let highlighted = null;
const dataTool = document.querySelector('#data-tool');

const handleJumpStrips = function(e) {
  const res = view.getResolution();
  const size = map.getSize();
  const limit = [size[0] - 100, size[1] - 100];
  const pixel = e.pixel;
  const p = map.getCoordinateFromPixel(e.pixel);
  const ctr = view.getCenter();
  //const ctr = map.getPixelFromCoordinate(ctrCoor);
  
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

  dataTool.innerHTML = `resolution: ${res}<br>resDelta: ${resDelta}<br>pixel: ${pixel}<br>point: ${p}<br>delta: ${delta}<br>velocity: ${velocity}
  <br>limit: ${limit}<br>center: ${ctr}`;


}



let jumpStripsInt = null;
const handleHover = function(e) {
  if (jumpStripsInt != null) {
    window.clearInterval(jumpStripsInt);
  }
  const resolution = view.getResolution();

  const size = map.getSize();
  if (e.pixel[0] < 100 || e.pixel[1] < 100 || e.pixel[0] > size[0] - 100 || e.pixel[1] > size[1] - 100) {
    jumpStripsInt = window.setInterval(handleJumpStrips, 16, e);
    return
  } else if (jumpStripsInt != null) {
    window.clearInterval(jumpStripsInt);
  }

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
        renderProductOverlay(feature, productCardOverlay);
      } 
      highlighted = feature;
    } 
    if (featureType != 'product') {
      map.getTarget().style.cursor = '';
      hideProductOverlay(productCardOverlay);
    }
  } else {
  }
}
map.on('pointermove', handleHover);


/* On Click */

const handleClick = function(e) {
  console.log('handleClick click event',e);
  const features = map.getFeaturesAtPixel(e.pixel);
  const feature = features[0];
  const featureType = feature.get('type');

  if (document.getElementById('product-overlay').style.display == 'block' &&
      featureType != 'product') {
    hideProductOverlay(productOverlay);
    return
  }
  if (features.length > 0) {
    const zoom = view.getZoom();
    const mapSize = map.getSize();
    const constraint = [mapSize[0] + 1000, mapSize[1] + 2000] ;

    if (featureType == 'product') {
      hideProductOverlay(productCardOverlay);
      renderProductOverlay(feature, productOverlay);

    } else if (featureType == 'brand') {
      hideProductOverlay(productOverlay);
      view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

    } else if (featureType == 'subdept') {
      hideProductOverlay(productOverlay);
      view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

    } else if (featureType == 'dept') {
      hideProductOverlay(productOverlay);
      view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

    } else {
      // handle cases of "fake" feature layers, like product circles
    }
  } else {
    // what happens if they click on no features? 
  }
}

map.on('singleclick', handleClick);

