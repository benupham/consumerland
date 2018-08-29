import {map, view} from '../index.js';
import Circle from 'ol/geom/circle';

import {productsImageMax, searchResolutions} from '../constants.js';
import {hidePreview} from '../components/productPreview.js';
import {renderProductOverlay, hideOverlay, productDetailOverlay} from '../components/productDetail.js';
import {cartIconHandleClick} from '../features/tags2.js';
import {omnibox} from '../components/omnibox.js';

export const handleClick = function(e) {
  hidePreview();

  if (productDetailOverlay.getElement().style.display == 'block') {
    hideOverlay(productDetailOverlay);
    return
  } 
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
    renderProductOverlay(feature, productDetailOverlay);
    e.stopPropagation();

  } else if (['brand','dept','subdept'].includes(featureType)) {
    console.log(feature)
    omnibox.onMapClick(feature.get('fid'));
    
    const center = feature.getGeometry().getCoordinates() || feature.getGeometry().getCenter();   
    // hideOverlay(productDetailOverlay);
    const zoomTo = searchResolutions[featureType];
    view.animate({ resolution: zoomTo, center: center});  
  } else if (featureType === 'add' || featureType === 'remove') {
    cartIconHandleClick(feature);
  }

}


