import Control from 'ol/control/control';

import {updateAddCartButton, updateCart} from '../components/cart.js';
import {view} from '../index.js';
import {productsSource} from '../features/categoryFeatures.js';
import {textFormatter, dataTool} from '../utilities.js';

const previewEl = document.getElementById('product-preview');
const productPreview = new ol.control.Control({element: previewEl});

