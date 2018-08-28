import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Icon from 'ol/style/icon';
import Style from 'ol/style/style';

import {imagesDir} from '../constants.js';

// Product Image Feature

export const productImageFeatureRender = function (featureSets, type='product') {
  const images = [];

  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
      const src = imagesDir + f.properties.src; 
      const image = new Feature({
        geometry: new Point(f.geometry.coordinates),
        name: f.properties.name,
        fid: f.id,
        price: f.properties.price || '',
        type: f.properties.type,
        style: 'image',
        src: src
      });
      image.setId(f.id + '-image');
      if (f.properties.sprite200Src && f.properties.spriteCoord) {
        image.set('sprite200Src', imagesDir + f.properties.sprite200Src);
        image.set('spriteCoord', f.properties.spriteCoord);
      } 
      images.push(image);        
    })
  })
  return images;
}

// Product Image Style
const productImageStyleCache = {};
const productImageIconCache = {};
const productSpriteIconCache = {};

export const productImageStyle = function(image, res) {
  let imagesrc = image.get('src');
  let style = productImageStyleCache[imagesrc];

  if (!style) {
    let spriteicon = productSpriteIconCache[imagesrc];
    let imageicon = productImageIconCache[imagesrc];
    if (!spriteicon) {
      let offset = image.get('spriteCoord') != undefined ? image.get('spriteCoord') : [0,0];
      offset = [offset[0] * .5, offset[1] * .5,];
      let spritesrc = image.get('sprite200Src') != undefined ? image.get('sprite200Src') : imagesrc;
      spriteicon = new Icon({
        src: spritesrc + '-scaled50-compressed.jpg',
        size: [100,100],
        offset: offset,
        crossOrigin: 'anonymous'
      })
      productSpriteIconCache[imagesrc] = spriteicon;  
    }

    if (!imageicon) {
      imageicon = new Icon({
        src: imagesrc,
        size: [199,199],
        crossOrigin: 'anonymous'
      })
      productImageIconCache[imagesrc] = imageicon;  
    }

    // const imageStyle = new Style({ image: imageicon });
    // const spriteStyle = new Style({ image: spriteicon });

    // style = [imageStyle, spriteStyle];
    // productImageStyleCache[imagesrc] = style;

    style = new Style();
    
    
  }
  if (imagesrc.includes('missing-item')) {
    style.setImage(productImageIconCache[imagesrc]);
    style.getImage().setScale(1/res);
  }
  else if (res >= 2) {
    style.setImage(productSpriteIconCache[imagesrc]);
    style.getImage().setScale(2/res);
  } else {
    style.setImage(productImageIconCache[imagesrc]);
    style.getImage().setScale(1/res);
  }
  
  return style;
}

