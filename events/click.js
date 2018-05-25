import {map, view} from '../index.js';
import Circle from 'ol/geom/circle';

import {productsImageMax} from '../constants.js';
import {renderProductOverlay, hideOverlay, productDetailOverlay, productCardOverlay} from '../components/overlays.js';

export const handleClick = function(e) {
  console.log(e.originalEvent);
  console.log(e.pointerEvent);
  console.log(e);
  if (productDetailOverlay.getElement().style.display == 'block') {
    console.log(productDetailOverlay.getElement().style.display)
    hideOverlay(productDetailOverlay);
    return;
  }

  const features = map.getFeaturesAtPixel(e.pixel);
  const feature = features[0];
  const featureType = feature.get('type');
  const featureStyle = feature.get('style');
  const zoom = view.getZoom();
  const res = view.getResolution();
  const mapSize = map.getSize();
  const constraint = [mapSize[0] + 500, mapSize[1] + 100] ;

  if (featureType == 'product' && featureStyle == 'image') {
    hideOverlay(productCardOverlay);
    renderProductOverlay(feature, productDetailOverlay);

  } else if ((featureType == 'brand' || 'dept' || 'subdept')) {
    let circle = feature.getGeometry();
    if (featureStyle != 'circle') {
      circle = new Circle(feature.getGeometry().getCoordinates(), feature.get('radius'));  
    }     
    hideOverlay(productDetailOverlay);
    view.fit(circle.getExtent(), {size: constraint, duration: 1000});

  } else {
    hideOverlay(productDetailOverlay);
  }

}


