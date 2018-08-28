import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Icon from 'ol/style/icon';
import Style from 'ol/style/style';

import {imagesDir, productsImageMax} from '../constants.js';
import {productsSource} from './categoryFeatures.js';
import {textFormatter, iconcache, styleCache, getFeatureJson} from '../utilities.js';
import {map} from '../index.js';
import { updateCart, checkCart } from '../components/cart.js';


/*
* Product on Sale, in Cart, Tagged Features and Styles
* 
*/

const tagsData = {
  sale: {color: '', src: 'sale-red.png'},
  add: {color: '', src: 'add.png'},
  remove: {color: '', src: 'remove.png'},
}

const tagFeatureRender = function(features, colors = null, tagType = 'sale') {
  let tags = [];
  features.forEach( (f) => {
    if (f.properties.type == 'product' && f.properties.price.indexOf('Reg') > -1) {
      const tag = new Feature({
        'geometry': new Point([f.geometry.coordinates[0] - 75, f.geometry.coordinates[1] + 75]),
        'name': f.id + '-' + tagType,
        'type': tagType,
      })
      tag.setId(f.id + '-' + tagType);
      tags.push(tag);      
    }
  })
  return tags;
}


const tagStyle = function (tag, resolution) {
  const type = tag.get('type');
  const src = tagsData[type].src;
  let style = {};

  let tagIcon = iconcache[src];

  if (!tagIcon) {
    tagIcon = new Icon({
      size: [48,48],
      crossOrigin: 'anonymous',
      src: imagesDir + 'product-images/tags/' + src
    });
  }
  
  if (type === 'sale') {
    tagIcon.setScale(1 / resolution);
  } else {
    const res = 1 / resolution + .2 > 1 ? 1 : 1 / resolution + .2;
    tagIcon.setScale(res);
  }
  
  
  iconcache[src] = tagIcon;

  style = new Style({
    image: tagIcon,
    zIndex: type === 'remove' ? 10 : 0
  })

  return style
}

const tagSource = new VectorSource({
  overlaps: false
});

export const tagLayer = new VectorLayer({
  source: tagSource,
  style: tagStyle,
  zIndex: 4,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderMode: 'vector',
  maxResolution: productsImageMax 
})
tagLayer.set('name','tag-layer');

getFeatureJson(['product'], 'tags')
.then(data => {
  const tagFeatures = tagFeatureRender(data);
  tagSource.addFeatures(tagFeatures);
  map.addLayer(tagLayer);
  
})

const cartAddIcon = new Feature({
  'geometry': new Point([null, null]),
  'name': 'cart-add-icon',
  'type': 'add',
})
cartAddIcon.setId('cart-add-icon');
tagSource.addFeature(cartAddIcon);

export const setCartAddIcon = function(product) {
  // send nowhere if false
  if (product === false) {
    cartAddIcon.getGeometry().setCoordinates([null,null]);
    return;
  }

  // get product coord
  const coordinate = product.getGeometry().getCoordinates();
  cartAddIcon.getGeometry().setCoordinates([coordinate[0] + 75, coordinate[1] + 75]);

  cartAddIcon.set('pId', product.getId());
}

export const setCartRemoveIcon = function(pId) {
  
  if (!checkCart(pId)) {
    if (tagSource.getFeatureById('remove-' + pId) != null) {
      const icon = tagSource.getFeatureById('remove-' + pId);
      tagSource.removeFeature(icon);
    }
  } else {
    const product = productsSource.getFeatureById(pId);
    const coord = product.getGeometry().getCoordinates();
    const cartRemoveIcon = new Feature({
      type: 'remove',
      src: tagsData['remove'].src,
      geometry: new Point([coord[0] + 75, coord[1] + 75]),
      pId: pId
    });
    cartRemoveIcon.setId('remove-' + pId);
    tagSource.addFeature(cartRemoveIcon);
  }

} 

export const cartIconHandleClick = function(cartIcon) {
  const pId = cartIcon.get('pId');
  updateCart(pId);
}

