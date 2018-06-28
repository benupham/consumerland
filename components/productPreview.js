import Control from 'ol/control/control';

import {updateCart} from '../components/cart.js';
import {view} from '../index.js';
import {productsSource} from '../features/categoryFeatures.js';
import {textFormatter, debounce, dataTool} from '../utilities.js';
import {circleColors} from '../constants.js';

const preview = document.getElementById('preview');

//export const productPreview = new Control({element: preview});

export const updatePreview = function (features) {
	let previewText = document.getElementById('preview-text');
	previewText.innerHTML = '';
	let previewImage = document.getElementById('preview-image');
	previewImage.style.backgroundImage = '';
	const f = features[0];
	const type = f.get('type');
	if (['dept','subdept','brand','product'].includes(type)) {
		if (type === 'product' && f.get('style') === 'image') {
			previewText.innerHTML = textFormatter(f.get('name'), 50, '', 45);
			previewText.innerHTML += '&nbsp&nbsp<strong>' + f.get('price') + '<strong>';
			previewImage.style.backgroundImage = "url('" + f.get('src') + "')";
		} else if (type != 'product') {
			previewText.innerHTML = '<strong>' + textFormatter(f.get('name'), 50, '', 45) + '</strong>';
			previewImage.style.backgroundColor = circleColors[type];
		}
	}
}