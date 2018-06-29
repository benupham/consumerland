
import {getFeatureJson, cleanName} from '../utilities.js';

getFeatureJson(['dept','subdept'])
.then(featureData => {
  console.log(featureData)
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
      <a id="${d.id}-link" class="department-link" data-toggle="collapse" href="#collapse-${d.id}">
        ${d.properties.name}
      </a>
    </h5>
    <div id="collapse-${d.id}" class="collapse" data-parent="#accordion">
        <ul class="list-group list-group-flush">`;

    subdepartments.forEach(s => {

      if (s.properties.parent === d.properties.name) {
        html += 
        `<li id="${s.id}-link" class="list-group-item">${s.properties.name}</li>`
      }

    });

    html += `</ul>
          </div>`;

  });

  const deptsAccordion = document.getElementById('departments-accordion');
  console.log(html)
  deptsAccordion.innerHTML = html;

})


