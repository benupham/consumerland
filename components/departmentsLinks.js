
import {getFeatureJson, cleanName} from '../utilities.js';
import {view} from '../index.js';

export const renderDeptsLinks = function() {

  getFeatureJson(['dept','subdept'])
  .then(featureData => {
    console.log(featureData)
    const deptsAccordion = document.getElementById('departments-accordion');

    const departments = featureData.filter(f => {
      return f.properties.type === 'dept';
    })
    const subdepartments = featureData.filter(f => {
      return f.properties.type === 'subdept';
    })
    console.log(departments, subdepartments)
    let html = ``;

    departments.forEach( d => {
      
      html += 
      `<h5 class="mb-0">
        <a id="${d.id}-link" data-id="${d.id}" data-coord="${d.geometry.coordinates}" data-type="dept" class="department-link" data-toggle="collapse" href="#collapse-${d.id}">
          ${d.properties.name}
        </a>
      </h5>
      <div id="collapse-${d.id}" class="collapse" data-parent="#accordion">
          <ul class="">`;

      subdepartments.forEach(s => {

        if (s.properties.parent === d.properties.name) {
          html += 
          `<li><a id="$${s.id}-link" data-id="${s.id}" data-coord="${s.geometry.coordinates}" data-type="subdept" class="">${s.properties.name}</a></li>`
        }

      });

      html += `</ul>
            </div>`;

    });

    deptsAccordion.innerHTML = html;
    deptsAccordion.addEventListener('click',(e) => {
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





