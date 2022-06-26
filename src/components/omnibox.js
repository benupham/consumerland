import {imagesDir, featureZoomRes} from '../constants.js';
import {view, map} from '../index.js';
import {productsImageMax, searchResolutions, mapMaxResolution, mapCenter, labelColors} from '../constants.js';
import {flyTo, getFeatureJson, getOmniboxList} from '../utilities.js';
import matchSorter from 'match-sorter';
import {featureData} from '../features/getFeatureData';
import { isNullOrUndefined } from 'util';

/*
* Search
* 
*/

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
    // this.featureData = data; 
    this.renderList();
    // this.getSearchIndex();
  }

  goToFeature(coord, type) {
    map.getView().animate({
      center: coord,
      resolution: searchResolutions[type] 
    })
  }

  // needs to be updated to API 
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
    }));
    console.log(this.searchIndex)
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
      this.goToFeature(result.coord, result.type);
      $( "#search-input" ).autocomplete('close');
    }
    catch(err) {
      console.log(query +' not found');
    }
  } 

  onMapClick(fid) {
    // const f = this.featureData.find(c => c.id === fid);
    f.properties.type != 'product' && this.renderList(f);
  }

  onClick(e) {
    console.log(e.target.parentElement)
    if (isNullOrUndefined(e.target.dataset.id)) return;
    if (e.target.dataset.id === 'all-dept') {
      view.animate({ resolution: mapMaxResolution, center: mapCenter })
      this.renderList();
    } else {
      const featureData = e.target.dataset
      const fid = parseInt(featureData.id);
      this.goToFeature((featureData.coord).split(","), featureData.type)
      featureData.type != 'product' && this.renderList(featureData)
    }
  }

  async renderList(featureData = 0) {
    console.log(`renderlist ${featureData}`)
    let html = ``;

    // const breadcrumb = this.renderBreadcrumb(category);
    // html += `<div id="omni-list-breadcrumb" class="omni-list-breadcrumb mr-1 mb-2 text-black-50">${breadcrumb}</div>`

    const header = featureData === 0 ? "Departments" : featureData.name;
    const headerColor = featureData === 0 ? "inherit" : featureData.type;
    html += `<div id="omni-list-header" class="omni-list-header bg-white p-1 shadow-sm mb-1">`;
    // if (category !== null) {
    //   html += `<button id="omni-list-back" data-id="${category.properties.parent || 'all-dept'}" type="button" class="btn btn-sm btn-outline-secondary mr-2">Back</button>`
    // }
    html += `<span class="align-middle h5" style="color: ${labelColors[headerColor]};">${header}</span></div>`;
    
    html += `<div id="omni-list" class="omni-list">`;

    const omniboxList = await getOmniboxList(featureData.id || 0) || []

    // console.log(`omniboxList ${omniboxList}`)

    omniboxList.sort((a,b) => {
      if(a.properties.name < b.properties.name) return -1;
      if(a.properties.name > b.properties.name) return 1;
      return 0;
    });
    omniboxList.forEach(f => {
      html += this.renderListItem(f);
    });

    html += `</div>`;
    this.elem.innerHTML = html;
  }

  renderListItem(f) {
    // Only because brands have a placeholder src value for brand logos that doesn't have a file extension
    const src = f.properties.src.includes('.') ? f.properties.src : 'product-images/missing-item.jpg'
    const id = f.id
    const coordinates = f.geometry.coordinates
    const name = f.properties.name
    const type = f.properties.type
    
    return (
      `<div id="omni-list-item-${id}" data-id="${id}" data-coord="${coordinates[0]},${coordinates[1]}" data-name="${name}" data-type="${type}" class="media border-bottom mb-1 p-1 type-${type}">
        <img src="${imagesDir + (f.properties.sampleImg || src )}" alt="${name}" class="omni-image preview-image mr-2 order-1"  data-id="${id}" data-coord="${coordinates[0]},${coordinates[1]}" data-name="${name}" data-type="${type}" >
        <div class="media-body mr-1 ml-3 ">
          <div class="omni-list-name" data-id="${id}" data-coord="${coordinates[0]},${coordinates[1]}" data-name="${name}" data-type="${type}" style="color: ${labelColors[type]};">${name}</div>
          <div id="omni-list-item-price" data-id="${id}" class="preview-price">${f.properties.price || ''}</div>
        </div>
      </div>`
    )
  } 

  // renderTagButtons(feature) {

  // }

  renderBreadcrumb(category) {
    return ' '
    let breadcrumb = ' ';
    if (category === null) {
      return ' '
    } else { 
      let parent = category;
      let i = 0;
      do {
        this.featureData.forEach(f => {
          if (f.id === parent.properties.parent) {
            const parentLink = `<a class="small breadcrumb-link" data-id="${f.id}">${f.properties.name}</a> / `;
            breadcrumb = parentLink + breadcrumb;
            parent = f; 
            console.log(parent.properties.name)
          }  
        i++;  
        })  
      } while (i < 5); 
    }
    breadcrumb = `<a class="small breadcrumb-link" data-id="all-dept">Departments / </a>` + breadcrumb; 
    return breadcrumb
  }
  
}

const elem = document.getElementById('departments');
export const omnibox = new Omnibox(elem);
// omnibox.renderList()

// Autcomplete functionality for search


// const termTemplate = "<span class='ui-autocomplete-term'>%s</span>";

// $( "#search-input" ).autocomplete({
//   classes: {"ui-autocomplete": "autocomplete"},
//   source: function(request, response) {
//     console.log(request);
//     let match = matchSorter(this.searchIndex, request.term, {keys: ['value'] });
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
// };