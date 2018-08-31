import Overlay from 'ol/overlay';
import MouseWheelZoom from 'ol/interaction/mousewheelzoom';


import {updateAddCartButton, updateCart, checkCart} from './cart.js';
import { omnibox } from './omnibox.js';
import { imagesDir } from '../constants.js';

/*
* Overlays
* 
*/

// Product Detail Overlay (click)
export const productDetailOverlay = new Overlay({
  element: document.getElementById('product-overlay'),
  id: 'productDetail',
  autoPan: true,
  stopEvent: true,
  positioning: 'center-center'
});
// Even with stopEvent=true, pointermove needs to be stopped. 
productDetailOverlay.getElement().onpointermove = function(e) {e.stopPropagation()};

productDetailOverlay.getElement().addEventListener('click', function(e) {
  if (e.target.id === 'product-overlay-add-button') {
    const fid = Number(e.target.getAttribute('data-fid'));
    updateCart(fid);
    toggleOverlayButton(e.target, fid);
  } else {
    hideOverlay(productDetailOverlay);
  }
  
});
  

export const renderProductOverlay = function(fid, overlay) {
  fid = Number(fid);
  const feature = omnibox.featureData.find(f => f.id === fid);
  
  overlay.getElement().style.display = 'block';

  const coordinate = feature.geometry.coordinates;

  const btn = overlay.getElement().querySelector('.add-to-cart');
  btn.setAttribute('data-fid', fid);
  toggleOverlayButton(btn, fid);

  overlay.setPosition(coordinate);

  let name = overlay.getElement().querySelector('.product-name');
  name.setAttribute('data-fid', fid);
  let price = overlay.getElement().querySelector('.product-price');
  price.setAttribute('data-fid', fid);
  let image = overlay.getElement().querySelector('.product-image');
  image.setAttribute('data-fid', fid);

  image.src = '';
  let src = imagesDir + feature.properties.src.replace('200x', '500x');
  image.src = src;
  image.style.width = 250+'px'; 
  let imageOffset = -130;
  
  name.innerHTML = feature.properties.name;    

  price.textContent = feature.properties.price;
  
  const offset = [imageOffset - image.offsetLeft, imageOffset - image.offsetTop];
  overlay.setOffset(offset); 
} 

const toggleOverlayButton = function(btn, fid) {
  if (checkCart(fid)) {
    btn.classList.add('btn-outline-secondary');
    btn.classList.remove('btn-outline-warning');
    btn.textContent = 'Remove';
  } else {
    btn.classList.remove('btn-outline-secondary');
    btn.classList.add('btn-outline-warning');
    btn.textContent = 'Add to Cart';
  }
}

export const hideOverlay = function(overlay) {
  overlay.getElement().style.display = 'none';
}


// Signage (not used right now)
const signs = {};
for (let i = 0; i < 4; i++) {
  signs[i] = new Overlay({
    element: document.getElementById('sign-' + i),
    autoPan: false,
    stopEvent: true
  });
}

export const signage = signs; 

