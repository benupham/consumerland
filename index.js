import 'ol/ol.css';
import View from 'ol/view';
import Extent from 'ol/extent';
import olMap from 'ol/map';



import './style.css';

import {maxExtent} from './features/getFeatureData';
import {productDetailOverlay} from './components/productDetail.js';
import {hidePreview} from './components/productPreview.js';
import {textFormatter, dataTool, iconcache} from './utilities.js';
import {handleSearch} from './components/omnibox.js';
import {handleHover, jumpStripsInt} from './events/hover.js';
import {handleClick} from './events/click.js';
import {mapMaxResolution, mapStartResolution, mapCenter} from './constants.js';
import {overviewMapControl, breadCrumbsControl, updateBreadcrumbs} from './components/controls.js';


// $('#info-modal').modal('show');


/*
* Map & View
* 
*/

export const map = new olMap({
  renderer: ('canvas'),
  target: document.getElementById('map')
});

const ctr = mapCenter;
export const view = new View({
  center: mapCenter,
  resolution: mapStartResolution, 
  zoomFactor: 1.1,
  minResolution: 1,
  maxResolution: mapMaxResolution,
}); 

map.setView(view);



const centerZoom = view.getCenter();  

const mapResize = function(e) {
  if (window.innerWidth < 576) {
    document.getElementById('cart-contents').classList.toggle('dropdown-menu-right');
  }
  const mapHeight = document.documentElement.clientHeight; 
  const mapWidth = document.documentElement.clientWidth;
  document.querySelector('#map').style.height = mapHeight + 'px';
  map.setSize([mapWidth,mapHeight]);
  map.updateSize();
  // console.log(`navbarHeight: ${document.getElementById('navbar').offsetHeight} \n mapHeight: ${mapHeight} 
  //   \n mapWidth: ${mapWidth} \n windowHeight: ${window.innerHeight}`)

}
window.addEventListener('load', mapResize);
window.addEventListener('resize', mapResize);

/*
* Controls and Overlays 
* 
*/

map.addControl(overviewMapControl);

map.addOverlay(productDetailOverlay);


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
  hidePreview();
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


  dataTool.querySelector('#data-zoom').innerHTML = `zoom: ${view.getZoom()}`;
  dataTool.querySelector('#data-res').innerHTML = `res: ${view.getResolution()}`;
});

view.on('change:center', (e) => {
  hidePreview();

  const viewCenter = view.getCenter();
  if (!Extent.containsCoordinate(maxExtent,viewCenter)) {
    view.setCenter(ctr);
    return;
  } 
})

