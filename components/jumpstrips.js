import Extent from 'ol/extent';

import {map, view, maxExtent} from '../index.js';
//import {jumpStripActive} from '../variables.js';

window.jumpStripActive = false;
export const handleJumpStrips = function(e) {
  // prevent firing if dragging mouse
  if (e.dragging === true) return;

  map.getTargetElement().style.cursor = 'pointer';
  const res = view.getResolution();

  window.jumpStripActive = true; 

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

  const resDelta = delta * 0.05;
  if (res < 100) {
    view.setResolution(res + resDelta);
  }

  view.setCenter(newCtr);
  console.log('jumping');


  const viewExtent = view.calculateExtent();
  if (!Extent.containsExtent(maxExtent,viewExtent)) {
    view.setCenter(ctr);
    return;
  } 

  // dataTool.innerHTML = `resolution: ${res}<br>resDelta: ${resDelta}<br>pixel: ${pixel}<br>point: ${p}<br>delta: ${delta}<br>velocity: ${velocity}
  // <br>limit: ${limit}<br>center: ${ctr}`;
}
