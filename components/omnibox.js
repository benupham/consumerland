import {imagesDir} from '../constants.js';

/* 
All data is grabbed from the map feature layers, rather than the db (doh)
*/

export class Omnibox {
  constructor(elem, featureData) {
    // Depts, subdept and brands split from products to speed processing
    this.categories = featureData.filter(f => f.properties.type != 'product');
    this.products = featureData.filter(f => f.properties.type === 'product');
    this.renderList = this.renderList.bind(this); 
    this.elem = elem;
  }
  
  renderList(feature = null) {
    const category = feature;

    let html = ``;

    if (category === null) {
      html += `<div shadow-sm mb-1>All Departments</div>`
      this.categories.forEach(f => {
        if (f.properties.type === 'dept') {
          html += `
          <div id="omni-list-item-${f.id}" class="media shadow-sm mb-1 p-1 type-${f.properties.type}">
            <img src="${imagesDir + (f.properties.sampleImg || f.properties.src)}" alt="${f.properties.name}" class="omni-image preview-image">
            <div class="media-body mr-1">
              <div class="omni-list-name">${f.properties.name}</div>
            </div>
          </div>`;
        }
      });
    }
    else if (category.properties.type != 'brand') {
      this.categories.forEach(f => {
        if (f.properties.parent === category.properties.name) {
          html += `
          <div id="omni-list-item-${f.id}" class="media shadow-sm mb-1 p-1 type-${f.properties.type}">
            <img src="${imagesDir + (f.properties.sampleImg || f.properties.src)}" alt="${f.properties.name}" class="omni-image preview-image">
            <div class="media-body mr-1">
              <div class="omni-list-name">${f.properties.name}</div>
              ${this.renderChildrenLinks(f)}
            </div>
          </div>`;
        }
      });
    } else if (category.properties.type === 'brand') {
      this.products.forEach(f => {
        if (f.properties.parent === category.properties.name) {
          html += `
          <div id="omni-list-item-${f.id}" class="media shadow-sm mb-1 p-1 type-${f.properties.type}">
            <img src="${imagesDir + f.properties.src}" alt="${f.properties.name}" class="omni-${f.properties.type}-image preview-image">
            <div class="media-body">
              <div class="omni-list-name">${f.properties.name}</div>
            </div>
          </div>`;
        }
      });
    }

    this.elem.innerHTML = html;
  }

  getChildrenArray(f) {
    const searchArray = f.properties.type === 'brand' ? this.products : this.categories;
    return (searchArray.filter(i => {
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
    `<div id="omni-list-item-${f.id}" class="media shadow-sm mb-1 p-1">
        <img src="${imagesDir + (f.properties.sampleImg || f.properties.src)}" alt="${f.properties.name}" class="omni-${f.properties.type}-image preview-image">
        <div class="media-body mr-1">
          <div class="omni-list-name">${f.properties.name}</div>
          ${this.renderChildrenLinks(f)}
        </div>
      </div>`
    )
  } 

  renderTagButtons(feature) {

  }

  renderBreadcrumb() {

  }
}
