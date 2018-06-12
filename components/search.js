import Control from 'ol/control/control';
import {map} from '../index.js';
import {productsImageMax, searchResolutions} from '../constants.js';
import {flyTo, getFeatureJson} from '../utilities.js';
import matchSorter from 'match-sorter';

/*
* Search
* 
*/
let searchIndex = [];
getFeatureJson(['product','brand','dept','subdept'])
.then(res => {
  searchIndex = res.map(f => {
    return {
      value: f.properties.name,
      label: (f.properties.type === 'product' ? f.properties.name : f.properties.name + ' in ' + '<span class="feature-parent">' + f.properties.parent + '</span>'),
      count: f.properties.value,
      type: f.properties.type,
      parent: f.properties.parent,
      coord: f.geometry.coordinates
    }
  });
});

export const handleSearch = function(e) {
  if (e.keyCode != 13) {
    return
  }
  const query = document.getElementById('search-input').value;
  if (query != '') {
    try {
      console.log('query',query);
      let items = searchIndex;
      let match = matchSorter(items, query, {keys: ['value'] });
      console.log(match);
      console.log('match', match[0].value);
      const result = match[0];
      const coord = result.coord;
      map.getView().animate({
        center: coord,
        resolution: searchResolutions[result.type] 
      })
      $( "#search-input" ).autocomplete('close');
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




