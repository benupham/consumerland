require('ol/ol.css');
import olMap from 'ol/map';
import View from 'ol/view';

import {productCardOverlay, productDetailOverlay, signage, renderProductOverlay, openProductDetail, hideOverlay} from './components/overlays.js';
import {textFormatter, dataTool, iconcache} from './utilities.js';
import {displayCart, updateCart, updateAddCartButton} from './components/cart.js';
import {displaySignage} from './components/signage.js';
import {searchControl, handleSearch} from './components/search.js';
import {handleJumpStrips} from './components/jumpstrips.js';
import {handleHover, jumpStripsInt} from './events/hover.js';
import {handleClick} from './events/click.js';
import {productsVectorLayer} from './features/products.js';
import {tagLayer} from './features/tags.js';
import { 
  departmentsFillLayer, 
  departmentsTextLayer,
  departmentsSource,
  subdepartmentsFillLayer,
  subdepartmentsTextLayer,
  brandsFillLayer,
  brandsTextLayer
} from './features/circleFeatures.js';
import {productsImageMax} from './constants.js';
import {
  departmentsLabelLayer,
  subdepartmentsLabelLayer,
  brandsLabelLayer,
  departmentsCircleLayer,
  subdepartmentsCircleLayer,
  brandsCircleLayer,
  departmentsImageLayer,
  subdepartmentsImageLayer,
  brandsImageLayer
} from './features/categoryFeatures.js';





/*
* Map & View
* 
*/

export const view = new View({
  center: [55667,-46227],
  // extent: [2400,-9795,92400,-83963],
  resolution: 90, 
  zoomFactor: 1.1,
  minResolution: 1,
  maxResolution: 100,
})
export const maxExtent = departmentsSource.getExtent();

export const map = new olMap({
  renderer: (['canvas']),
  layers: [
    departmentsCircleLayer,
    subdepartmentsCircleLayer,
    brandsCircleLayer,
    departmentsImageLayer,
    subdepartmentsImageLayer,
    departmentsLabelLayer,
    subdepartmentsLabelLayer,
    productsVectorLayer,
    tagLayer,
    brandsImageLayer,

    // brandsLabelLayer
    ],
  target: document.getElementById('map'),
  view: view
});

// const layers = map.getLayers();
// layers.forEach((l) => {
//   l.on('precompose', (e) => {
//     e.context.globalCompositeOperation = 'source-over';
//   } )
// })
// departmentsTextLayer.on('precompose', (e) => {
//   e.context.globalCompositeOperation = 'source-atop';
// });


const centerZoom = view.getCenter();  


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
map.addControl(searchControl);

map.on('pointermove', handleHover);
map.getTargetElement().addEventListener('mouseleave', function(){
  window.clearInterval(jumpStripsInt);
})
map.on('singleclick', handleClick);



view.on('change:resolution', (e) => {
  const res = view.getResolution();
  if (window.jumpStripActive === true) return; 
  if (res < 80) {
    const signageTimeOut = setTimeout(displaySignage, 100);    
  }
  if (res >= 100) window.clearInterval(jumpStripsInt);
  console.log('resolution',view.getResolution(),'zoom',view.getZoom())
});

