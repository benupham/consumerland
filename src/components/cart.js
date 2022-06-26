/*
* Cart
* 
*/
import {productsSource} from '../features/getFeatureData';
import {setCartRemoveIcon} from '../features/tags2.js';
import { omnibox } from './omnibox';
import { imagesDir } from '../constants';

const cart = [];
const cartContents = document.querySelector('#cart-contents');

export const updateCart = function(fid, name, src) {
  fid = parseInt(fid);
  const product = omnibox.featureData.find(f => f.id === fid);

  if (checkCart(fid)) {
    for (var i = cart.length - 1; i >= 0; i--) {
      if (cart[i].fid === fid) {
        cart.splice(i,1);
        setCartRemoveIcon(fid);
        cartContents.removeChild(cartContents.childNodes[i]);
        document.getElementById('cart-count').innerHTML = cart.length;
        return false;
      } 
    }    
  }

  cart.push({
    fid: fid,
    name: name,
    src: src
  });
  setCartRemoveIcon(fid);

  const cartItem = document.getElementById('cart-item').cloneNode(true);
  cartItem.id = 'item-' + fid;
  cartItem.querySelector('img').src = src;
  cartItem.querySelector('.cart-product-name').textContent = name;
  cartContents.appendChild(cartItem);
  document.getElementById('cart-count').innerHTML = cart.length;
  return true;

}

export const checkCart = function(fid) {
  return (
     cart.some(f => {
      return f.fid === fid
    })
  ) 
} 

