require('ol/ol.css');
import olMap from 'ol/map';
import View from 'ol/view';
import Extent from 'ol/extent';

import {productCardOverlay, productDetailOverlay, signage, renderProductOverlay, openProductDetail, hideOverlay} from './components/overlays.js';
import {textFormatter, dataTool, iconcache} from './utilities.js';
//import {displayCart, updateCart, updateAddCartButton} from './components/cart.js';
import {displaySignage} from './components/signage.js';
import {searchControl, handleSearch} from './components/search.js';
import {handleJumpStrips} from './components/jumpstrips.js';
import {handleHover, jumpStripsInt} from './events/hover.js';
import {handleClick} from './events/click.js';
import {tagLayer} from './features/tags.js';
import {productsImageMax} from './constants.js';
import {
  departmentsLabelLayer,
  subdepartmentsLabelLayer,
  brandsLabelLayer,
  departmentsCircleLayer,
  // departmentsCircleLabelLayer,
  subdepartmentsCircleLayer,
  brandsCircleLayer,
  // brandsCircleLabelLayer,
  departmentsImageLayer,
  subdepartmentsImageLayer,
  brandsImageLayer,
  productsCircleLayer,
  productsImageLayer,
  // subdepartmentsCircleLabelLayer,
} from './features/categoryFeatures.js';


// $('#info-modal').modal('show');


/*
* Map & View
* 
*/

const ctr = [46000,-46000];
export const view = new View({
  center: ctr,
  resolution: 65, 
  zoomFactor: 1.25,
  minResolution: 1,
  maxResolution: 65,
})


export const map = new olMap({
  renderer: ('canvas'),
  layers: [
    departmentsCircleLayer,
    subdepartmentsCircleLayer,
    brandsCircleLayer,
    subdepartmentsImageLayer,
    // departmentsImageLayer,
    // departmentsLabelLayer,
    // subdepartmentsLabelLayer,
    // productsCircleLayer,
    // productsImageLayer,
    // tagLayer,
    // brandsLabelLayer,
    ],
  target: document.getElementById('map'),
  view: view
});

// Speed up initial load
document.addEventListener('DOMContentLoaded', e => {
  map.addLayer(productsCircleLayer);
  map.addLayer(productsImageLayer);
  map.addLayer(tagLayer);
  map.addLayer(brandsLabelLayer);
  map.addLayer(subdepartmentsLabelLayer);
  map.addLayer(departmentsImageLayer);
  map.addLayer(departmentsLabelLayer);
});

const centerZoom = view.getCenter();  


const mapResize = function(e) {
  if (window.innerWidth < 576) {
    document.getElementById('cart-contents').classList.toggle('dropdown-menu-right');
  }
  const navbarHeight = document.getElementById('navbar').clientHeight;
  const mapHeight = document.documentElement.clientHeight;
  const mapWidth = document.documentElement.clientWidth;
  document.querySelector('#map').style.height = mapHeight + 'px';
  map.setSize([mapWidth,mapHeight]);
  map.updateSize();
}
window.addEventListener('load', mapResize);
window.addEventListener('resize', mapResize);

//map.addOverlay(productCardOverlay);
map.addOverlay(productDetailOverlay);
// for (let i = 0; i < 4; i++) {
//   map.addOverlay(signage[i]);
// }


map.on('pointermove', (e) => {
  dataTool.querySelector('#data-coord').innerHTML = `coord: ${e.coordinate}`;
  handleHover(e);
});
map.getTargetElement().addEventListener('mouseleave', function(){
  window.clearInterval(jumpStripsInt);
})
map.on('click', (e) => {
  // hacky but works! 
  if (e.originalEvent.target.nodeName != 'CANVAS') return;
  handleClick(e);
});



view.on('change:resolution', (e) => {
  const res = view.getResolution();
  if (window.jumpStripActive === true) return; 
  // if (res < 80) {
  //   const signageTimeOut = setTimeout(displaySignage, 100);    
  // }
  if (res >= 50) window.clearInterval(jumpStripsInt);
  //console.log('resolution',view.getResolution(),'zoom',view.getZoom());
  dataTool.querySelector('#data-zoom').innerHTML = `zoom: ${view.getZoom()}`;
  dataTool.querySelector('#data-res').innerHTML = `res: ${view.getResolution()}`;
});

const maxExtent = departmentsCircleLayer.getSource().getExtent(); 
view.on('change:center', (e) => {
  const viewCenter = view.getCenter();
  if (!Extent.containsCoordinate(maxExtent,viewCenter)) {
    view.setCenter(ctr);
    return;
  } 
})

