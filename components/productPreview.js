import Control from 'ol/control/control';

import {updateAddCartButton, updateCart} from '../components/cart.js';
import {view} from '../index.js';
import {productsSource} from '../features/categoryFeatures.js';
import {textFormatter, debounce, dataTool} from '../utilities.js';

const preview = document.getElementById('product-preview');

export const productPreview = new Control({element: preview});

export const updatePreview = function (features) {

	const updateCategoriesList = function(categories) {
		const list = preview.querySelector('#preview-categories-list');
		list.querySelector('#dept-link').innerHTML = '';
		list.querySelector('#subdept-link').innerHTML = '';
		list.querySelector('#brand-link').innerHTML = '';

		categories.forEach((c) => {
			const type = c.get('type');
			if (type === 'dept') {
				// will need to fix this for case of 2 depts overlapping 
				list.querySelector('#dept-link').innerHTML = textFormatter(c.get('name'), 30, '', 25);
				list.querySelector('#dept-link').setAttribute('data-id', c.getId());
			} else if (type === 'subdept') {
				list.querySelector('#subdept-link').innerHTML = textFormatter(c.get('name'), 30, '', 25);
				list.querySelector('#subdept-link').setAttribute('data-id', c.getId());
			} else if (type === 'brand') {
				list.querySelector('#brand-link').innerHTML = textFormatter(c.get('name'), 30, '', 25);
				list.querySelector('#brand-link').setAttribute('data-id', c.getId());
			}
		})
	}

	const updateProduct = function (product) {
		const pId = product.getId();
		if (product.get('inCart') === undefined) {
		  product.set('inCart', false);
		}

		let image = preview.querySelector('.product-image');
		image.setAttribute('data-pid', pId);
		image.src = '';
		image.src = product.get('src');
		console.log(product.get('src'));
		image.style.width = 200+'px'; 

		let name = preview.querySelector('.product-name');
		name.innerHTML = textFormatter(product.get('name'), 40, '<br>');
		name.setAttribute('data-pid', pId);

		let price = preview.querySelector('.product-price');
		price.textContent = product.get('price');
		price.setAttribute('data-pid', pId);

		const btn = preview.querySelector('.add-to-cart');
		btn.setAttribute('data-pid', pId);
		updateAddCartButton(product.get('inCart'), btn);
		btn.addEventListener('click', updateCart);
		
	}

	const categories = [];

	features.forEach((f) => {
		const type = f.get('type');
		if ( type === 'product' && f.get('style') === 'image') {
			updateProduct(f);
		}
		else categories.push(f);
	})

	updateCategoriesList(categories);
	 
}