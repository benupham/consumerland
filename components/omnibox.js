import {imagesDir, featureZoomRes} from '../constants.js';
import {view, map} from '../index.js';
import {productsImageMax, searchResolutions, mapMaxResolution, mapCenter, labelColors} from '../constants.js';
import {flyTo, getFeatureJson} from '../utilities.js';
import matchSorter from 'match-sorter';
import {featureData} from '../features/getFeatureData';
import { isNullOrUndefined } from 'util';

/*
* Search
* 
*/




// const termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
// $( "#search-input" ).autocomplete({
//   classes: {"ui-autocomplete": "autocomplete"},
//   source: function(request, response) {
//     console.log(request);
//     let match = matchSorter(searchIndex, request.term, {keys: ['value'] });
//     match = match.slice(0,10);
//     match.sort((a,b) => {
//       return b.count - a.count;
//     });
//     console.log(match);
//     response(match);
//   },
//   select: function(e, ui) {
//     console.log(e, ui.item.coord);
//     $( "#search-input" ).value = ui.item.value;
//     map.getView().animate({
//       center: ui.item.coord,
//       resolution: searchResolutions[ui.item.type] 
//     })
//   },
//   open: function(e, ui) {
//     const term = document.getElementById('search-input').value;
//     const styledTerm = termTemplate.replace('%s', term);
//     console.log(term, styledTerm);
//     $('ul.autocomplete li div').each(function() {
//       $(this).html($(this).text().replace(term, styledTerm));
//     });
//   },

// }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
//   const parent = searchIndex.find(p => p.id === item.parent);
//   item.parentName = parent.value; 
//   item.label = item.value + ' in ' + '<span class="feature-parent">' + item.parentName + '</span>'
//   return $( "<li>" )
//     .data( "ui-autocomplete-item", item )
//     .append( "<a>" + item.label + "</a>" )
//     .appendTo( ul );
// };;


class Omnibox {
  constructor(elem) {
    this.renderList = this.renderList.bind(this);
    elem.addEventListener('click', (e) => this.onClick(e));
    document.getElementById('search-button').addEventListener('click', (e) => this.handleSearch(e));
    document.getElementById('search-input').addEventListener('keypress', (e) => this.handleSearch(e));
    this.elem = elem;
    this.featureData = [];
    this.searchIndex = [];
  }

  getFeatureData(data) {
    this.featureData = data; 
    this.renderList();
    this.getSearchIndex();
  }
  
  // init() {
  //   this.renderList();
  //   this.getSearchIndex();
  // }

  goToFeature(coord, type) {
    map.getView().animate({
      center: coord,
      resolution: searchResolutions[type] 
    })
  }

  getSearchIndex() {
    this.searchIndex = (this.featureData.map(f => {
      return {
        value: f.properties.name,
        label: (f.properties.type === 'product' ? f.properties.name : f.properties.name + ' in ' + '<span class="feature-parent">' + f.properties.parent + '</span>'),
        count: f.properties.value,
        type: f.properties.type,
        parent:  f.properties.parent,
        coord: f.geometry.coordinates,
        id: f.id
      }
    }))
  }

  handleSearch(e) {
    if (e.keyCode != 13 && e.target.id != 'search-button' && e.target.dataset.id === undefined) {
      return
    }
    let fid = '';
    if (e.target.dataset.id !== undefined) {
      fid = Number(e.target.dataset.id);
      const feature = this.searchIndex.find(f => f.id === fid);
      document.getElementById('search-input').value = feature.value; 
    } 
    console.log(fid)
    const query = fid != '' ? fid : document.getElementById('search-input').value;
  
    try {
      console.log('query',query);
      let items = this.searchIndex;
      const key = fid != '' ? 'id' : 'value';
      let match = matchSorter(items, query, {keys: ['value', 'id'] });
      console.log(match);
      console.log('match', match[0].value);
      const result = match[0];
      // const coord = result.coord;
      // const type = result.type;
      // map.getView().animate({
      //   center: coord,
      //   resolution: searchResolutions[type] 
      // })
      this.goToFeature(result.coord, result.type);
      $( "#search-input" ).autocomplete('close');
    }
    catch(err) {
      console.log(query +' not found');
    }
  } 

  onMapClick(fid) {
    const f = this.featureData.find(c => c.id === fid);
    f.properties.type != 'product' && this.renderList(f);
  }

  onClick(e) {
    if (isNullOrUndefined(e.target.dataset.id) || e.target.dataset.id === 'all-dept') {
      view.animate({ resolution: mapMaxResolution, center: mapCenter })
      this.renderList();
    } else {
      const fid = Number(e.target.dataset.id);
      const f = this.featureData.find(c => c.id === fid); 
      this.goToFeature(f.geometry.coordinates, f.properties.type)
      f.properties.type != 'product' && this.renderList(f);
    }
  }

  renderList(category = null) {

    let html = ``;
    

    const header = category === null ? "All Departments" : category.properties.name;
    const headerColor = category === null ? "inherit" : category.properties.type;
    html += `<div id="omni-list-header" class="omni-list-header bg-white p-1 shadow-sm mb-1">`;
    if (category !== null) {
      html += `<button id="omni-list-back" data-id="${category.properties.parent || 'all-dept'}" type="button" class="btn btn-sm btn-outline-secondary mr-2">Back</button>`
    }
    html += `<span class="align-middle h5" style="color: ${labelColors[headerColor]};">${header}</span></div>`;
    
    html += `<div id="omni-list" class="omni-list">`;

    let featureArray = [];
    if (category === null) {
      featureArray = this.featureData.filter(i => {
        return i.properties.type === 'dept'; 
      });
    } else {
      featureArray = this.featureData.filter(i => {          
        return i.properties.parent === category.id; 
      });
    }

    featureArray.sort((a,b) => {
      if(a.properties.name < b.properties.name) return -1;
      if(a.properties.name > b.properties.name) return 1;
      return 0;
    });
    featureArray.forEach(f => {
      html += this.renderListItem(f);
    });

    html += `</div>`;
    this.elem.innerHTML = html;
  }

  getChildrenArray(f) {
    let array = this.featureData.filter(i => {
      // need to filter by dept because of generic "Sales" subdept
        if (i.properties.dept === f.properties.dept || f.properties.type === 'dept') {
          return i.properties.parent === f.properties.name; 
        }
      });

    return (
      array.sort((a,b) => {
        console.log(a,b)
        if(a.properties.name < b.properties.name) return -1;
        if(a.properties.name > b.properties.name) return 1;
        return 0;
      })
    );
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
    // Only because brands have a placeholder src value for brand logos
    const src = f.properties.src.includes('.') ? f.properties.src : 'product-images/missing-item.jpg' ;
    return (
      `<div id="omni-list-item-${f.id}" data-id="${f.id}" class="media shadow-sm mb-1 p-1 type-${f.properties.type}">
        <img src="${imagesDir + (f.properties.sampleImg || src )}" alt="${f.properties.name}" class="omni-image preview-image mr-2"  data-id="${f.id}">
        <div class="media-body mr-1">
          <div class="omni-list-name" data-id="${f.id}" style="color: ${labelColors[f.properties.type]};">${f.properties.name}</div>
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
const elem = document.getElementById('departments');
export const omnibox = new Omnibox(elem);

