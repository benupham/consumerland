import {map, view} from '../index.js';
import {productsImageMax} from '../constants.js';
import {renderProductOverlay, hideOverlay, productDetailOverlay, productCardOverlay} from '../components/overlays.js';

export const handleClick = function(e) {
  
  const features = map.getFeaturesAtPixel(e.pixel);

  if (features == null) {
    hideOverlay(productCardOverlay);
    return;
  }
  const feature = features[0];
  const featureType = feature.get('type');
  const zoom = view.getZoom();
  const res = view.getResolution();
  const mapSize = map.getSize();
  const constraint = [mapSize[0] + 500, mapSize[1] + 100] ;

  if (featureType == 'product') {
    hideOverlay(productCardOverlay);
    renderProductOverlay(feature, productDetailOverlay);

  } else if ((featureType == 'brand' || 'dept' || 'subdept') && res > productsImageMax) {
    hideOverlay(productDetailOverlay);
    view.fit(feature.getGeometry().getExtent(), {size: constraint, duration: 1000});

  } else {
    hideOverlay(productDetailOverlay);
  }

}


