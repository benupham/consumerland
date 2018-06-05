require('ol/ol.css');
import olMap from 'ol/map';
import View from 'ol/view';
import Extent from 'ol/extent';

// import './dist/style.css';

import {productCardOverlay, productDetailOverlay, signage, renderProductOverlay, openProductDetail, hideOverlay} from './components/overlays.js';
import {productPreview} from './components/productPreview.js';
import {textFormatter, dataTool, iconcache} from './utilities.js';
//import {displayCart, updateCart, updateAddCartButton} from './components/cart.js';
import {displaySignage} from './components/signage.js';
import {handleSearch} from './components/search.js';
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
import {overviewMapControl, breadCrumbsControl, updateBreadcrumbs} from './components/controls.js';


$('#info-modal').modal('show');


/*
* Map & View
* 
*/

const ctr = [46000,-46000];
export const view = new View({
  center: ctr,
  resolution: 65, 
  zoomFactor: 1.5,
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

// Speed up initial load by loading this stuff here.
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
  const navbarHeight = document.getElementById('navbar').offsetHeight;
  const mapHeight = document.documentElement.clientHeight - navbarHeight; 
  const mapWidth = document.documentElement.clientWidth;
  document.querySelector('#map').style.height = mapHeight + 'px';
  map.setSize([mapWidth,mapHeight]);
  map.updateSize();
  console.log(`navbarHeight: ${document.getElementById('navbar').offsetHeight} \n mapHeight: ${mapHeight} 
    \n mapWidth: ${mapWidth} \n windowHeight: ${window.innerHeight}`)

}
window.addEventListener('load', mapResize);
window.addEventListener('resize', mapResize);

// map.addOverlay(productCardOverlay);
map.addControl(overviewMapControl);
// map.addControl(breadCrumbsControl);

map.addControl(productPreview);


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
map.on('singleclick', (e) => {
  // hacky but works for event propagation issues Map Browser Events
  if (e.originalEvent.target.nodeName != 'CANVAS') return;
  handleClick(e);
});



view.on('change:resolution', (e) => {
  // console.log(e);
  const res = view.getResolution();
  if (window.jumpStripActive === true) return; 
  // if (res < 80) {
  //   const signageTimeOut = setTimeout(displaySignage, 100);    
  // }
  if (res >= 50) window.clearInterval(jumpStripsInt);
  const ctr = view.getCenter();
  const pixel = map.getPixelFromCoordinate(ctr);
  const features = map.getFeaturesAtPixel(pixel);
  // console.log(features);
  // debounce()

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

document.getElementById('search-button').onclick = handleSearch;
document.getElementById('search-input').onkeypress = handleSearch;
