import {imagesDir, featureZoomRes} from '../constants.js';
import {view} from '../index.js';
/* 
All data is grabbed from the map feature layers, rather than the db (doh)
*/

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
    const fid = Number(e.target.dataset.id);
    const f = this.featureData.find(c => c.id === fid); 
    
    if (!f) {
      this.renderList()
    } else {
      const center = f.geometry.coordinates;
      view.animate({ resolution: featureZoomRes[f.properties.type], center: center});
      f.properties.type != 'product' && this.renderList(f);
    }
  }

  renderList(category = null) {

    let html = ``;
    
    const header = category === null ? "All Departments" : category.properties.name;
    html += `<div id="omni-list-header" class="bg-white shadow-sm mb-1 h4">`;
    if (category !== null) {
      html += `<button id="omni-list-back" data-id="${category.properties.parent}" type="button" class="btn btn-outline-secondary">Back</button>`
    }
    html += `${header}</div>`;

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
        <img src="${imagesDir + (f.properties.sampleImg || f.properties.src)}" alt="${f.properties.name}" class="omni-image preview-image"  data-id="${f.id}">
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
