import Control from 'ol/control/control';
import {map} from '../index.js';
import {productsImageMax, searchResolutions} from '../constants.js';
import {flyTo} from '../utilities.js';
import {allFeatureData} from '../data/allFeatureDataCollection.js';
import matchSorter from 'match-sorter';

/*
* Search
* 
*/

const searchIndex = allFeatureData.features.map(f => {
  return {
    value: f.properties.name,
    label: (f.properties.type === 'product' ? f.properties.name : f.properties.name + ' in ' + '<span class="feature-parent">' + f.properties.parent + '</span>'),
    count: f.properties.value,
    type: f.properties.type,
    parent: f.properties.parent,
    coord: f.geometry.coordinates
  }
});



export const handleSearch = function(e) {
  if (e.keyCode != 13) {
    return
  }
  const query = document.getElementById('search-input').value;
  if (query != '') {
    try {
      console.log('query',query);
      let items = allFeatureData.features;
      let match = matchSorter(items, query, {keys: ['properties.name'] });
      console.log(match);
      console.log('match', match[0].id);
      const result = match[0];
      const coord = result.geometry.coordinates;
      //const feature = productsSource.getFeatureById(match[0].id + '-image'); 
      //console.log(feature);
      // map.getView().animate({
      //   center: coord,
      //   resolution: productsImageMax - 5 >= 1 ? productsImageMax - 5 : 1 , //need to make this a variable
      // })
    }
    catch(err) {
      console.log(query +' not found');
    }
  }
} 

const termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
$( "#search-input" ).autocomplete({
  classes: {"ui-autocomplete": "autocomplete"},
  source: function(request, response) {
    console.log(request);
    let match = matchSorter(searchIndex, request.term, {keys: ['value'] });
    match = match.slice(0,10);
    match.sort((a,b) => {
      return b.count - a.count;
    });
    console.log(match);
    response(match);
  },
  select: function(e, ui) {
    console.log(e, ui.item.coord);
    $( "#search-input" ).value = ui.item.value;
    map.getView().animate({
      center: ui.item.coord,
      resolution: searchResolutions[ui.item.type] 
    })
  },
  open: function(e, ui) {
    const term = document.getElementById('search-input').value;
    const styledTerm = termTemplate.replace('%s', term);
    console.log(term, styledTerm);
    $('ul.autocomplete li div').each(function() {
      $(this).html($(this).text().replace(term, styledTerm));
    });
  }

});




