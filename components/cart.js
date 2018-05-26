/*
* Cart
* 
*/
import {productsSource} from '../features/categoryFeatures.js';

const cart = [];
const cartContents = document.querySelector('#cart-contents');

export const updateCart = function(e) {
  const pId = this.getAttribute('data-pid');
  const product = productsSource.getFeatureById(pId);
  console.log('update cart',pId, product.get('type'), product.get('fid'), 
    product.get('style'), product.get('inCart'));
  const src = product.get('src');
  const name = product.get('name');

  if (product.get('inCart') === true) {
    for (var i = cart.length - 1; i >= 0; i--) {
      if (cart[i].pId === pId) {
        cart.splice(i,1);
        cartContents.removeChild(cartContents.childNodes[i]);
        updateAddCartButton(false, this);
        product.set('inCart',false);
        document.getElementById('cart-count').innerHTML = cart.length;
        return 
      } 
    }    
  }

  cart.push({
    pId: pId,
    name: product.get('name'),
    src: product.get('src'),
    price: product.get('price')
  });

  const cartItem = document.getElementById('cart-item').cloneNode(true);
  cartItem.id = 'item-' + pId;
  cartItem.querySelector('img').src = src;
  cartItem.querySelector('.cart-product-name').textContent = name;
  cartContents.appendChild(cartItem);
  product.set('inCart',true);
  updateAddCartButton(true, this);
  document.getElementById('cart-count').innerHTML = cart.length;

}

export const updateAddCartButton = function(inCart, btn) {
  if (inCart === true) {
    btn.classList.remove("btn-outline-warning");
    btn.classList.add('btn-outline-secondary');
    btn.textContent = 'Remove';
  } else if (inCart === false) {
    btn.classList.remove("btn-outline-secondary");
    btn.classList.add('btn-outline-warning');
    btn.textContent = 'Add to Cart';
  }
}