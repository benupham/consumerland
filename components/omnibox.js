import {imagesDir, featureZoomRes} from '../constants.js';
import {view} from '../index.js';
import Overlay from 'ol/overlay';
import {map} from '../index.js';
import {productsImageMax, searchResolutions, mapMaxResolution, mapCenter} from '../constants.js';
import {flyTo, getFeatureJson} from '../utilities.js';
import matchSorter from 'match-sorter';
import {Omnibox} from './omnibox.js';
import {productsSource} from '../features/categoryFeatures.js';

/*
* Search
* 
*/

let searchIndex = [];
getFeatureJson(['product','brand','dept','subdept'])
.then(res => {

  const elem = document.getElementById('departments');
  const omnibox = new Omnibox(elem, res);
  omnibox.renderList();

  searchIndex = res.map(f => {
    return {
      value: f.properties.name,
      label: (f.properties.type === 'product' ? f.properties.name : f.properties.name + ' in ' + '<span class="feature-parent">' + f.properties.parent + '</span>'),
      count: f.properties.value,
      type: f.properties.type,
      parent:  f.properties.parent,
      coord: f.geometry.coordinates,
      id: f.id
    }
  });
  console.log(searchIndex)
});

export const handleSearch = function(e) {
  if (e.keyCode != 13 && e.target.id != 'search-button' && e.target.dataset.id === undefined) {
    return
  }

  if (e.target.dataset.id !== undefined) {
    const fid = Number(e.target.dataset.id);
    const feature = searchIndex.find(f => f.id === fid);
    document.getElementById('search-input').value = feature.value; 
  } 

  const query = document.getElementById('search-input').value;

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
  },

}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
  const parent = searchIndex.find(p => p.id === item.parent);
  item.parentName = parent.value; 
  item.label = item.value + ' in ' + '<span class="feature-parent">' + item.parentName + '</span>'
  return $( "<li>" )
    .data( "ui-autocomplete-item", item )
    .append( "<a>" + item.label + "</a>" )
    .appendTo( ul );
};;


export class Omnibox {
  constructor(elem, featureData) {
    // Depts, subdept and brands split from products to speed processing
    this.categories = featureData.filter(f => f.properties.type != 'product');
    this.products = featureData.filter(f => f.properties.type === 'product');
    this.renderList = this.renderList.bind(this);
    elem.addEventListener('click', (e) => this.onClick(e));
    this.elem = elem;
    this.featureData = featureData;
  }
  
  onClick(e) {
    if (e.target.dataset.id === 'undefined') {
      view.animate({ resolution: mapMaxResolution, center: mapCenter })
      this.renderList();
    } else {
      handleSearch(e);
      const fid = Number(e.target.dataset.id);
      const f = this.featureData.find(c => c.id === fid); 
      f.properties.type != 'product' && this.renderList(f);
    }
  }

  renderList(category = null) {

    let html = ``;
    

    const header = category === null ? "All Departments" : category.properties.name;
    html += `<div id="omni-list-header" class="omni-list-header bg-white p-1 shadow-sm mb-1 h4">`;
    if (category !== null) {
      html += `<button id="omni-list-back" data-id="${category.properties.parent}" type="button" class="btn btn-outline-secondary">Back</button>`
    }
    html += `${header}</div>`;
    
    html += `<div id="omni-list" class="omni-list">`;

    if (category === null) {
      this.featureData.forEach(f => {
        if (f.properties.type === 'dept') {
          html += this.renderListItem(f);
        }
      });
    } else {
      this.featureData.forEach(f => {
        if (f.properties.parent === category.id) {
          html += this.renderListItem(f);
        }
      });
    }
    html += `</div>`;
    this.elem.innerHTML = html;
  }

  getChildrenArray(f) {
    return (this.featureData.filter(i => {
      // need to filter by dept because of generic "Sales" subdept
      if (i.properties.dept === f.properties.dept || f.properties.type === 'dept') {
        return i.properties.parent === f.properties.name; 
      }
    }));
  }

  renderChildrenLinks(f) {
    const children = this.getChildrenArray(f);
    let html = '';
    children.forEach(c => {
      html += `<a href="#" id="child-link-${c.id}" class="child-link">${c.properties.name}</a>, `
    });
    return html; 
  }

  renderListItem(f) {
    return (
      `<div id="omni-list-item-${f.id}" data-id="${f.id}" class="media shadow-sm mb-1 p-1 type-${f.properties.type}">
        <img src="${imagesDir + (f.properties.sampleImg || f.properties.src)}" alt="${f.properties.name}" class="omni-image preview-image mr-2"  data-id="${f.id}">
        <div class="media-body mr-1">
          <div class="omni-list-name"  data-id="${f.id}">${f.properties.name}</div>
          <div id="omni-list-item-price" data-id="${f.id}" class="preview-price">${f.properties.price || ''}</div>
        </div>
      </div>`
    )
  } 

  renderTagButtons(feature) {

  }

  renderBreadcrumb() {

  }
}
