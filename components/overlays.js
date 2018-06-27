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

// Product Card Overlay (hover)
export const productCardOverlay = new Overlay({
  element: document.getElementById('product-card'),
  id: 'productCard',
  autoPan: false,
  stopEvent: false
});

// Product Overlay (click)
export const productDetailOverlay = new Overlay({
  element: document.getElementById('product-overlay'),
  id: 'productDetail',
  autoPan: true,
  stopEvent: true,
  positioning: 'center-center'
});

// productDetailOverlay.getElement().addEventListener('click', function(e) {
//   console.log(e)
//   const inCart = updateCart(e.target.getAttribute('data-pid'));
//   updateAddCartButton(inCart, e.target);
//   console.log('updated cart B');
// });

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

export const openProductDetail = function(e) {
  e.stopPropagation();
  hideOverlay(productCardOverlay);
  const pId = this.getAttribute('data-pid');
  const p = productsSource.getFeatureById(pId);
  view.animate({resolution: 2, anchor: p.getGeometry().getCoordinates()});
  view.animate({center: p.getGeometry().getCoordinates()});
  renderProductOverlay(p,productDetailOverlay);

}

export const renderProductOverlay = function(product, overlay) {
  const pId = product.getId();
  
  // Even with stopEvent=true, pointermove needs to be stopped. 
  overlay.getElement().onpointermove = function(e) {e.stopPropagation()};
  if (overlay.getId() == 'productCard') {
    overlay.getElement().onclick = function(e) {e.stopPropagation()};
  }

  if (overlay.getId() == 'productDetail') {
    overlay.getElement().addEventListener('click', (e) => {
      if (e.target.id === 'product-overlay-add-button') {
        updateCart(pId);
      }
      hideOverlay(overlay);
    })
  }

  overlay.getElement().style.display = 'block';

  overlay.set('product', pId);

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

  if (overlay.getId() == 'productCard') {
    image.addEventListener('click', openProductDetail);
    name.addEventListener('click', openProductDetail);
    price.addEventListener('click', openProductDetail);
  }
  if (overlay.getId() == 'productDetail') {
    overlay.getElement().querySelector('.close').addEventListener('click', () => {
      hideOverlay(overlay);
    })
  }

  image.src = '';
  let src = product.get('src').replace('200x', '500x');
  image.src = src;
  image.style.width = 250+'px'; 
  let imageOffset = -130;
  
  const res = view.getResolution();
  if (res > 5 && overlay.getId() === 'productCard') {
    name.innerHTML = textFormatter(product.get('name'), 15, '<br>', 10);
    image.style.width = 115+'px'; 
    imageOffset = -57;   
  } else if (res > 3 && overlay.getId() === 'productCard') {
    name.innerHTML = textFormatter(product.get('name'), 25, '<br>', 20);
    image.style.width = 150+'px'; 
    imageOffset = -75;   
  } else {
    name.innerHTML = product.get('name');    
  }

  price.textContent = product.get('price');
  
  const offset = [imageOffset - image.offsetLeft, imageOffset - image.offsetTop];
  overlay.setOffset(offset); 
} 

const toggleOverlayButton = function(btn, pId) {
  if (checkCart(pId)) {
    btn.className = 'btn-outline-secondary';
    btn.textContent = 'Remove';
  } else {
    btn.className = 'btn-outline-warning';
    btn.textContent = 'Add to Cart';
  }
}

export const hideOverlay = function(overlay) {
  overlay.getElement().style.display = 'none';
}


