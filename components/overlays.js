import Overlay from 'ol/overlay';
import MouseWheelZoom from 'ol/interaction/mousewheelzoom';


import {updateAddCartButton, updateCart} from '../components/cart.js';
import {view} from '../index.js';
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
  autoPan: false,
  stopEvent: true
});

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
  console.log('render overlay: ', product.getId(), product.get('fid'), 
    product.get('style'), product.get('inCart'));
  if (product.get('inCart') === undefined) {
    product.set('inCart', false);
  }
  // Even with stopEvent=true, pointermove needs to be stopped. 
  overlay.getElement().onpointermove = function(e) {e.stopPropagation()};
  if (overlay.getId() == 'productCard') {
    overlay.getElement().onclick = function(e) {e.stopPropagation()};
  }
  overlay.getElement().style.display = 'block';

  overlay.set('product', product.getId());
  console.log(overlay.get('product'));
  const coordinate = product.getGeometry().getCoordinates();

  const btn = overlay.getElement().querySelector('.add-to-cart');
  btn.setAttribute('data-pid', product.getId());
  updateAddCartButton(product.get('inCart'), btn);
  btn.addEventListener('click', updateCart);

  overlay.setPosition(coordinate);

  let name = overlay.getElement().querySelector('.product-name');
  name.setAttribute('data-pid', product.getId());
  let price = overlay.getElement().querySelector('.product-price');
  price.setAttribute('data-pid', product.getId());
  let image = overlay.getElement().querySelector('.product-image');
  image.setAttribute('data-pid', product.getId());

  if (overlay.getId() == 'productCard') {
    image.addEventListener('click', openProductDetail);
    name.addEventListener('click', openProductDetail);
    price.addEventListener('click', openProductDetail);
  }
  if (overlay.getId() == 'productDetail') {
    overlay.getElement().querySelector('.close').addEventListener('click', () => {
      hideOverlay(productDetailOverlay);
    })
  }

  image.src = '';
  image.src = product.get('src');
  image.style.width = 200+'px'; 
  let imageOffset = -100;
  
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

  //const resolution = view.getResolution();

  //const imageRatio = 1 / (resolution * 0.5) > 1 ? 1 : 1 / (resolution * 0.5);
  //const imageOffset = -100 * imageRatio;
  //image.style.width = 200 * imageRatio + 'px';

  
  const offset = [imageOffset - image.offsetLeft, imageOffset - image.offsetTop];
  overlay.setOffset(offset); 
} 

export const hideOverlay = function(overlay) {
  overlay.getElement().style.display = 'none';
}

