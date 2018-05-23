import Control from 'ol/control/control';
import {map} from '../index.js';
import {productsImageMax} from '../constants.js';
import {productsVectorSource} from '../features/products.js';
import {productData} from '../data/productData.js';
import {brandsData} from '../data/brandsData.js';
import {departmentsData} from '../data/departmentsData.js';
import {subdepartmentsData} from '../data/subdepartmentsData.js';
import matchSorter from 'match-sorter';

/*
* Search
* 
*/

export const handleSearch = function(e) {
  if (e.keyCode != 13) {
    return
  }
  const query = document.getElementById('search-input').value;
  if (query != '') {
    try {
      console.log('query',query);
      let products = productData.features;
      let match = matchSorter(products, query, {keys: ['properties.name'] })
      console.log('match',match[0].id);
      const feature = productsVectorSource.getFeatureById(match[0].id); 
      console.log(feature);
      map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
        resolution: productsImageMax - .001 //need to make this a variable
      })
    }
    catch(err) {
      console.log(query +' not found');
    }
  }
} 

// export const searchControl = new Control({
//   element: document.getElementById('search-cart-overlay'),
// });
document.getElementById('search-button').onclick = handleSearch;

document.getElementById('search-input').onkeypress = handleSearch;

//document.getElementById('search-cart-overlay').onpointermove = function(e) {e.stopPropagation()};




