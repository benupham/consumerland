import {map, view} from '../index.js';
import Circle from 'ol/geom/circle';

import {productsImageMax} from '../constants.js';
import {renderProductOverlay, hideOverlay, productDetailOverlay, productCardOverlay} from '../components/overlays.js';

export const handleClick = function(e) {
  console.log(e);
  // if (productDetailOverlay.getElement().style.display == 'block') {
  //   hideOverlay(productDetailOverlay);
  //   return;
  // }
  const features = map.getFeaturesAtPixel(e.pixel);
  if (features === null) return;
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
    e.stopPropagation();

  } else if (productDetailOverlay.getElement().style.display == 'block') {
    hideOverlay(productDetailOverlay);
    return
  } else if (['brand','dept','subdept'].indexOf(featureType) > -1) {
    
    let circle = feature.getGeometry();
    if (featureStyle != 'circle') {
      circle = new Circle(feature.getGeometry().getCoordinates(), feature.get('radius'));  
    }  
    const center = feature.getGeometry().getCoordinates() || feature.getGeometry().getCenter();   
    hideOverlay(productDetailOverlay);
    const zoomTo = featureType == 'brand' ? 2 
      : featureType == 'subdept' ? productsImageMax - .5 
      : 29;
    view.animate({ resolution: zoomTo, center: center});  
  } else {
    hideOverlay(productDetailOverlay);
  }

}


