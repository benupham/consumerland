import OverviewMap from 'ol/control/overviewmap';
import Control from 'ol/control/control';
import View from 'ol/view';
import DragPan from 'ol/interaction/dragpan';

import {departmentsCircleLayer,departmentsLabelLayer} from '../features/categoryFeatures.js';
import {view} from '../index.js';

const overviewView = new View({
	// center: [46000,-46000],
	maxResolution: 250,
	minResolution: 250,
	resolution: 200
})

export const overviewMapControl = new OverviewMap({
	className: 'overviewmap ol-overviewmap',
	layers: [departmentsCircleLayer,departmentsLabelLayer],
	collapsed: false,
	view: overviewView,
	target: document.getElementById('overviewmap')
})

// Update Overview map touch with the following 
/* Binding */

// overlayBox.addEventListener('mousedown', function() {
//   window.addEventListener('mousemove', move);
//   window.addEventListener('mouseup', endMoving);
// });
const dragPanInteraction = new DragPan();
overviewMapControl.getOverviewMap().addInteraction(dragPanInteraction);

overviewMapControl.getOverviewMap().on('singleclick', (e) => {
	const overlaymap = overviewMapControl.getOverviewMap();
	const mainmap = overviewMapControl.getMap();
	const features = overlaymap.getFeaturesAtPixel(e.pixel);
	const geometry = features[0].getGeometry();
	console.log(geometry)
	const ctr = geometry.getCoordinates() || geometry.getCenter();
	console.log(ctr)
	mainmap.getView().setCenter(ctr);
});


//BREADCRUMBS 
export const breadCrumbsControl = new Control({
	element: document.getElementById('breadcrumbs')
})

export const updateBreadcrumbs = function(categories) {
	const breadcrumbs = document.getElementById('breadcrumbs');
	breadcrumbs.querySelector('#dept-link').innerHTML = '';
	breadcrumbs.querySelector('#subdept-link').innerHTML = '';
	breadcrumbs.querySelector('#brand-link').innerHTML = '';

	categories.forEach((c) => {
		const type = c.get('type');
		if (type === 'dept') {
			// will need to fix this for case of 2 depts overlapping 
			breadcrumbs.querySelector('#dept-link').innerHTML = c.get('name');
			breadcrumbs.querySelector('#dept-link').setAttribute('data-id', c.getId());
		} else if (type === 'subdept') {
			breadcrumbs.querySelector('#subdept-link').innerHTML = c.get('name');
			breadcrumbs.querySelector('#subdept-link').setAttribute('data-id', c.getId());
		} else if (type === 'brand') {
			breadcrumbs.querySelector('#brand-link').innerHTML = c.get('name');
			breadcrumbs.querySelector('#brand-link').setAttribute('data-id', c.getId());
		}
	})
}