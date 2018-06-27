/*
* Cart
* 
*/
import {productsSource} from '../features/categoryFeatures.js';

const cart = [];
const cartContents = document.querySelector('#cart-contents');

export const updateCart = function(pId) {
  const product = productsSource.getFeatureById(pId);
  const src = product.get('src');
  const name = product.get('name');

  if (checkCart(pId)) {
    for (var i = cart.length - 1; i >= 0; i--) {
      if (cart[i].pId === pId) {
        cart.splice(i,1);
        cartContents.removeChild(cartContents.childNodes[i]);
        document.getElementById('cart-count').innerHTML = cart.length;
        return false;
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
  document.getElementById('cart-count').innerHTML = cart.length;
  return true;

}

export const checkCart = function(pId) {
  const result = cart.some((item) => {
    console.log('in cart: ' + item.pId);
    return item.pId === pId;
  });
  return result; 
} 

