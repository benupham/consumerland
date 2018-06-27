import Overlay from 'ol/overlay';
import MouseWheelZoom from 'ol/interaction/mousewheelzoom';


import {updateAddCartButton, updateCart} from '../components/cart.js';
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

productDetailOverlay.getElement().addEventListener('click', function(e) {
  console.log(e)
  const inCart = updateCart(e.target.getAttribute('data-pid'));
  updateAddCartButton(inCart, e.target);
  console.log('updated cart B');
});

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
  if (product.get('inCart') === undefined) {
    product.set('inCart', false);
  }
  // Even with stopEvent=true, pointermove needs to be stopped. 
  overlay.getElement().onpointermove = function(e) {e.stopPropagation()};
  if (overlay.getId() == 'productCard') {
    overlay.getElement().onclick = function(e) {e.stopPropagation()};
  }

  if (overlay.getId() == 'productDetail') {
    overlay.getElement().addEventListener('click', (e) => {
      hideOverlay(overlay);
    })
  }

  overlay.getElement().style.display = 'block';

  overlay.set('product', product.getId());

  const coordinate = product.getGeometry().getCoordinates();

  const btn = overlay.getElement().querySelector('.add-to-cart');
  btn.setAttribute('data-pid', product.getId());
  updateAddCartButton(product.get('inCart'), btn);

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

/*
*
* Add to/Remove from Cart Icon Overlay
*
*/
export const addToCartIconOverlay = new Overlay({
  element: document.getElementById('add-to-cart-icon'),
  id: 'addToCartIconOverlay',
  autoPan: false,
  stopEvent: true,
  positioning: 'center-center'
});


// addToCartIconOverlay.getElement().addEventListener('click', function(e) {
//   updateCart(e.target.getAttribute('data-pid'));
//   // add X mark to product if not in cart
//   placeRemoveFromCartIcon(e.target.getAttribute('data-pid'));
// });

addToCartIconOverlay.getElement().addEventListener('click', () => {
  const pId = addToCartIconOverlay.getElement().getAttribute('data-pid');
  const coord = addToCartIconOverlay.getElement().getAttribute('data-coord');
  console.log(pId);
  const addRemoveIcon = updateCart(pId);
  if (addRemoveIcon === true) {
    placeRemoveFromCartIcon(pId, coord);
  } 
});

export const placeAddToCartIconOverlay = function(product) {
  if (product === false) {
    addToCartIconOverlay.setPosition([null,null]);
    return false;
  }
  const btn = addToCartIconOverlay.getElement();
  btn.setAttribute('data-pid', product.getId());
  
  const coordinate = product.getGeometry().getCoordinates();
  addToCartIconOverlay.setPosition(coordinate);
  btn.setAttribute('data-coord',coordinate);

  const res = view.getResolution();
  addToCartIconOverlay.setOffset([80/res,-80/res]);
}

const placeRemoveFromCartIcon = function(pId, coord) {
  // create new X icon
  const icon = document.createElement('button');
  const res = view.getResolution();
  icon.id = 'remove-from-cart-icon' + '-' + pId;
  icon.innerHTML = '&#10006;';
  icon.className = 'btn btn-primary remove-from-cart-icon';
  icon.setAttribute('data-pid', pId);
  icon.addEventListener('click', function(){
    updateCart(pId);
    icon.remove();
  });
  const removeIcon = document.body.appendChild(icon);
  const removeOverlay = new Overlay({
    position: coord.split(','),
    positioning: 'center-center',
    element: removeIcon,
    offset: [80/res,-80/res]
  })

  console.log(coord)
  map.addOverlay(removeOverlay);
  view.on('change:resolution', () => {
    console.log('hi')
    const res = view.getResolution();
    removeOverlay.setOffset([80/res,-80/res]);
  })
}
