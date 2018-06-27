import Overlay from 'ol/overlay';
import MouseWheelZoom from 'ol/interaction/mousewheelzoom';


import {updateAddCartButton, updateCart, checkCart} from '../components/cart.js';
import {view, map} from '../index.js';
import {productsSource} from '../features/categoryFeatures.js';
import {textFormatter, dataTool} from '../utilities.js';
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
  console.log(e)
  if (e.target.id === 'product-overlay-add-button') {
    const pId = e.target.getAttribute('data-pid');
    updateCart(pId);
    toggleOverlayButton(e.target, pId);
  } else {
    hideOverlay(productDetailOverlay);
  }
  
});
  

export const renderProductOverlay = function(product, overlay) {
  const pId = product.getId();
  
  overlay.getElement().style.display = 'block';

  const coordinate = product.getGeometry().getCoordinates();

  const btn = overlay.getElement().querySelector('.add-to-cart');
  btn.setAttribute('data-pid', pId);
  toggleOverlayButton(btn, pId);

  overlay.setPosition(coordinate);

  let name = overlay.getElement().querySelector('.product-name');
  name.setAttribute('data-pid', pId);
  let price = overlay.getElement().querySelector('.product-price');
  price.setAttribute('data-pid', pId);
  let image = overlay.getElement().querySelector('.product-image');
  image.setAttribute('data-pid', pId);

  image.src = '';
  let src = product.get('src').replace('200x', '500x');
  image.src = src;
  image.style.width = 250+'px'; 
  let imageOffset = -130;
  
  name.innerHTML = product.get('name');    

  price.textContent = product.get('price');
  
  const offset = [imageOffset - image.offsetLeft, imageOffset - image.offsetTop];
  overlay.setOffset(offset); 
} 

const toggleOverlayButton = function(btn, pId) {
  if (checkCart(pId)) {
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

