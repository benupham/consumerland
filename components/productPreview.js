import Control from 'ol/control/control';
import Overlay from 'ol/overlay';

import {updateCart} from '../components/cart.js';
import {map} from '../index.js';
import {brandsImageLayer} from '../features/categoryFeatures.js';
import {textFormatter, debounce, dataTool} from '../utilities.js';
import {circleColors} from '../constants.js';


// export const productPreviewOverlay = new Overlay({
//   element: document.getElementById('preview'),
//   id: 'productPreview',
//   autoPan: false,
//   stopEvent: false,
//   positioning: 'center-center'
// });

let previewedFeature = null;

export const updatePreview = function (features, e) {
	const f = features[0];
	
	if (previewedFeature === f) return;

	previewedFeature = f; 
	
	let previewName = document.getElementById('preview-name');
	let previewPrice = document.getElementById('preview-price');
	let previewImage = document.getElementById('preview-image');
	let previewInfo = document.getElementById('preview-productinfo');
	previewName.innerHTML = previewPrice.innerHTML = previewImage.style.backgroundColor = '';

	const type = f.get('type');

	if (type === 'product' && f.get('style') === 'image') {
		previewName.innerHTML = '<strong>' + textFormatter(f.get('name'), 40, '<br>', 75) + '</strong>';
		previewPrice.innerHTML = f.get('price');
		previewImage.style.backgroundImage = "url('" + f.get('src') + "')";
	} else {
		previewName.innerHTML = '<h6 class="mt-1">' + textFormatter(f.get('name'), 40, '<br>', 75) + '</h6>';
		previewImage.style.backgroundImage = "url('" + f.get('src') + "')";
		//previewInfo.innerHTML = f.get('children') + ' Products';
	// } else {
	// 	hidePreview();
	// 	return;
	}
	positionPreview(e);
	
}

const positionPreview = function (e) {
	
	const previewCard = document.getElementById('product-preview');
	
	const clientX = e.pointerEvent.clientX;
	const clientY = e.pointerEvent.clientY;
	const offset = 15;

	previewCard.style.top = (clientY + offset) + 'px';
	previewCard.style.left = (clientX + offset) + 'px';
}

export const hidePreview = function () {
	document.getElementById('product-preview').style.left = '-9999px';
}