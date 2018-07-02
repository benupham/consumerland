
import {getFeatureJson, cleanName} from '../utilities.js';
import {view} from '../index.js';

export const renderDeptsLinks = function() {

  getFeatureJson(['dept','subdept'])
  .then(featureData => {
    const deptsMenu = document.getElementById('departments');

    const departments = featureData.filter(f => {
      return f.properties.type === 'dept';
    })
    const subdepartments = featureData.filter(f => {
      return f.properties.type === 'subdept';
    })
    console.log(departments, subdepartments)
    let html = `<ul class="accordion departments list-unstyled" id="departments-accordion">`;

    departments.forEach( d => {
      
      html += 
      `<li class="mb-0">
        <a id="${d.id}-link" data-id="${d.id}" data-coord="${d.geometry.coordinates}" data-type="dept" class="department-link text-warning" data-toggle="collapse" data-target="#collapse-${d.id}">
          ${d.properties.name}
        </a>
      <ul id="collapse-${d.id}" class="collapse list-unstyled" data-parent="#departments-accordion">
          `;

      subdepartments.forEach(s => {

        if (s.properties.parent === d.id) {
          html += 
          `<li><a id="$${s.id}-link" data-id="${s.id}" data-coord="${s.geometry.coordinates}" data-type="subdept" class="text-info subdepartment-link">${s.properties.name}</a></li>`
        }

      });

      html += `</ul>
            
            </li>`;

    });

    html += `</ul>`;

    deptsMenu.innerHTML = html;
    deptsMenu.addEventListener('click',(e) => {
      const el = e.target;
      let zoomTo = 29;
      if (el.dataset.type === 'dept') {
        const center = el.dataset.coord.split(',');
        //animate to the dept 
        view.animate({ resolution: zoomTo, center: center});  
      } else if (el.dataset.type === 'subdept') {
        const center = el.dataset.coord.split(',');
        zoomTo = 6;
        view.animate({ resolution: zoomTo, center: center});  
      }
    
    })
  })

}

renderDeptsLinks();





