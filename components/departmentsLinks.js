
import {getFeatureJson, cleanName} from '../utilities.js';
import {view} from '../index.js';

export const renderDeptsLinks = function() {

  const sortNames = (a, b) => {
    if(a.properties.name < b.properties.name) return -1;
    if(a.properties.name > b.properties.name) return 1;
    return 0;
  }

  getFeatureJson(['dept','subdept'])
  .then(featureData => {
    const deptsMenu = document.getElementById('departments');

    const departments = featureData.filter(f => {
      return f.properties.type === 'dept';
    })
    departments.sort(sortNames);
    const subdepartments = featureData.filter(f => {
      return f.properties.type === 'subdept';
    })
    subdepartments.sort(sortNames);
    console.log(departments, subdepartments)
    let html = `<ul class="accordion departments list-unstyled" id="departments-accordion">`;

    departments.forEach( d => {
      
      html += 
      `<li class="mb-0">
        <a id="${d.id}-link" data-id="${d.id}" data-coord="${d.geometry.coordinates}" data-type="dept" class="department-link" data-toggle="collapse" data-target="#collapse-${d.id}">
          ${d.properties.name}
        </a>
      <ul id="collapse-${d.id}" class="collapse list-unstyled" data-parent="#departments-accordion">
          `;

      subdepartments.forEach(s => {

        if (s.properties.parent === d.id) {
          html += 
          `<li><a id="$${s.id}-link" data-id="${s.id}" data-coord="${s.geometry.coordinates}" data-type="subdept" class="subdepartment-link">${s.properties.name}</a></li>`
        }

      });

      html += `</ul>
            
            </li>`;

    });

    html += `</ul>`;

    deptsMenu.innerHTML = html;
    let currentDept = null;
    let currentSubdept = null; 
    deptsMenu.addEventListener('click',(e) => {
      const el = e.target;
      let zoomTo = 29;
      if (el.dataset.type === 'dept') {
        const center = el.dataset.coord.split(',');
        //animate to the dept 
        view.animate({ resolution: zoomTo, center: center});
        if (el !== currentDept) {
          console.log('hello')
          if (currentDept) currentDept.classList.remove('font-weight-normal');
          if (currentSubdept) currentSubdept.classList.remove('font-weight-normal');

          el.classList.add('font-weight-normal');
          currentDept = el;
          currentSubdept = null;  
        } 
      } else if (el.dataset.type === 'subdept') {
        const center = el.dataset.coord.split(',');
        zoomTo = 6;
        view.animate({ resolution: zoomTo, center: center});
        if (el !== currentSubdept) {
          if (currentSubdept) currentSubdept.classList.remove('font-weight-normal');
          el.classList.add('font-weight-normal');
          currentSubdept = el;   
        }
      }
    
    })
  })

}







