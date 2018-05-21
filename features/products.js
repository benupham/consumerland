import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Icon from 'ol/style/icon';
import Circle from 'ol/geom/circle';
import CircleStyle from 'ol/style/circle';
import RegularShape from 'ol/style/regularshape';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import IconCache from 'ol/style/iconImageCache';
import Style from 'ol/style/style';
import GeoJSON from 'ol/format/geojson';

import {productData} from '../data/productData.js';
import {productsImageMax, nameOffset, priceOffset} from '../constants.js';
import {textFormatter, iconcache, styleCache} from '../utilities.js';


/*
* Product Image Features
* 
*/

iconcache.setSize(productData.length);

const productsVectorStyle = function(product, resolution) { 
  let style = styleCache[product.getProperties().name];
  if (style) {
    style[0].getImage().setScale(1 / resolution); //resize image icon

    style[1].getText().setScale(1.25 / resolution); // resize text size
    style[1].getText().setOffsetY(nameOffset / resolution);
    style[1].getText().setOffsetX(-100 / resolution);

    style[2].getText().setScale(1.25 / resolution); // resize text size
    style[2].getText().setOffsetY(priceOffset / resolution);
    style[2].getText().setOffsetX(-100 / resolution);

    return style
  }
  else  {
    const productProperties = product.getProperties();

    let productIcon = iconcache[productProperties.src];
    if (!productIcon) {
      productIcon = new Icon({
        offset: productProperties.offset,
        size: productProperties.size,
        stroke: new Stroke({color: '#dee2e6', width: 1 }),
        scale: 1 / resolution,
        crossOrigin: 'anonymous',
        src: productProperties.src
      });
    }
    
    const productName = new Style({
      text: new Text({
        text: textFormatter(productProperties.name, 24, '\n', 40),
        textAlign: 'left',
        scale: 1.25 / resolution,
        font: '12px sans-serif',
        stroke: new Stroke({color: '#fff', width: 2}),
        fill: new Fill({color: '#606060' }),
        offsetX: -100 / resolution,
        offsetY: nameOffset / resolution
      }),
      zIndex: 10
    })

    const productPrice = new Style({
      text: new Text({
        text: productProperties.price,
        textAlign: 'left',
        scale: 1.25 / resolution,
        font: '12px sans-serif',
        stroke: new Stroke({color: '#fff', width: 2}),
        fill: new Fill({color: '#303030' }),
        offsetX: -100 / resolution,
        offsetY: priceOffset / resolution
      }),
      zIndex: 10
    }) 

    // array of styles 
    styleCache[product.getProperties().name] = [
      new Style({
        image: productIcon,
        zIndex: 9,
      }),
      productName,
      productPrice
    ]

    return styleCache[product.getProperties().name]

  }
}

const productsImageFeatures = (new GeoJSON()).readFeatures(productData)

export const productsVectorSource = new VectorSource({
  features: productsImageFeatures,
  overlaps: false
});
export const productsVectorLayer = new VectorLayer({
  source: productsVectorSource,
  style: productsVectorStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderMode: 'vector',
  maxResolution: productsImageMax 
})


