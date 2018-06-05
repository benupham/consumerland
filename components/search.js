import Control from 'ol/control/control';
import {map} from '../index.js';
import {productsImageMax} from '../constants.js';
import {allFeatureData} from '../data/allFeatureDataCollection.js';
import matchSorter from 'match-sorter';

/*
* Search
* 
*/

export const handleSearch = function(e) {
  console.log(e);
  if (e.keyCode != 13) {
    return
  }
  const query = document.getElementById('search-input').value;
  if (query != '') {
    try {
      console.log('query',query);
      let items = allFeatureData.features;
      let match = matchSorter(items, query, {keys: ['properties.name'] })
      console.log('match', match[0].id);
      const result = match[0];
      const coord = result.geometry.coordinates;
      //const feature = productsSource.getFeatureById(match[0].id + '-image'); 
      //console.log(feature);
      map.getView().animate({
        center: coord,
        resolution: productsImageMax - 5 >= 1 ? productsImageMax - 5 : 1 , //need to make this a variable
      })
    }
    catch(err) {
      console.log(query +' not found');
    }
  }
} 





