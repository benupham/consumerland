require('ol/ol.css');
import olMap from 'ol/map';
import View from 'ol/view';
import Projection from 'ol/proj/projection';
import Proj from 'ol/proj';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Polygon from 'ol/geom/polygon';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Icon from 'ol/style/icon';
import IconCache from 'ol/style/iconImageCache';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Extent from 'ol/extent';
import GeoJSON from 'ol/format/geojson';
import Select from 'ol/interaction/select';
import CanvasMap from 'ol/canvasmap';
import Overlay from 'ol/overlay';
import Control from 'ol/control/control';

import matchSorter from 'match-sorter';

import {yogurtData} from './yogurt.js';

const yogurt = yogurtData; 




/* The sample icon/images */
var iconCount = 20;
var icons = new Array(iconCount);
for (let i = 0; i < iconCount; ++i) {
  icons[i] = new Icon({
    offset: [0, i*200+i],
    size: [200, 200],
    crossOrigin: 'anonymous',
    src: './images/sprites.png'
  });
}

const featureCount = 25000;
const features = new Array(featureCount);
var feature, geometry, featureStyle;
const columns = Math.ceil(Math.sqrt(featureCount));
const rows = columns;
const points = [];
const boundary = Math.round(columns/2);
for (let k = -80; k < 80; k++) {
  for (let j = 80; j > -80; j--) {
    let x = 200 * k;
    let y = 200 * j;
    points.push([x, y]);
  }
}
var feature, geometry, featureStyle;
for (let i = 0; i < featureCount; ++i) {
  geometry = new Point(points[i]);
  feature = new Feature(geometry);
 
  featureStyle =  new Style({
    image: icons[i % (iconCount - 1)],
  })
 
  feature.set('originalStyle',featureStyle);
  feature.setId('beans-' + i);
  feature.set('price', 5.99);
  feature.setStyle(
    function (resolution) {
      this.get('originalStyle').getImage().setScale(1 / resolution);
      return this.get('originalStyle');
    }
  );
  features[i] = feature;
}




const vectorSource = new VectorSource({
  features: features
});

// const yogurt = {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "id": "noosa Coconut Yoghurt",
//       "properties": {
//         "name": "noosa Coconut Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-coconut-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "id": "Stonyfield Organic Organic Wild Berry Smoothie",
//       "properties": {
//         "name": "Stonyfield Organic Organic Wild Berry Smoothie",
//         "id": "some-id",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-wild-berry-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Strawberry Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-strawberry-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Vanilla Stonyfield Organic Whole Milk Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-vanilla-stonyfield-organic-whole-milk-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Strawberry Banana Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-strawberry-banana-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Icelandic Style Skyr Non-Fat Yogurt, Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-icelandic-style-skyr-nonfat-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Vanilla Skyr Yogurt 4%",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-vanilla-skyr-yogurt-4-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Strawberry-Beet-Berry Stonyfield Organic Whole Milk Strawberry-Beet-Berry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-strawberrybeetberry-stonyfield-organic-whole-milk-strawberrybeetberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Pear-Spinach-Mango Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-pearspinachmango-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Blueberry Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-blueberry-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 5% Milkfat Greek Strained Fage Total 5% Milkfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-5-milkfat-greek-strained-fage-total-5-milkfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Vanilla Almond Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-vanilla-almond-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Honey Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-honey-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Strained Non-Fat Yogurt Coconut",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-strained-nonfat-yogurt-coconut-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Icelandic Style Skyr Blueberry Non-fat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-icelandic-style-skyr-blueberry-nonfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Yobaby Plain with Probiotics Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-yobaby-plain-with-probiotics-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Vanilla Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-vanilla-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           0,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Kids Organic Blueberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-kids-organic-blueberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Low-Fat Yogurt Tubes Strawberry - 8 CT",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-lowfat-yogurt-tubes-strawberry-8-ct-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Raspberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-raspberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Strained Non-Fat Strawberry Icelandic Style Skyr Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-strained-nonfat-strawberry-icelandic-style-skyr-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Greek Gods Honey Vanilla Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-greek-gods-honey-vanilla-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Triple Cream Icelandic-Style Strained Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-triple-cream-icelandicstyle-strained-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Yobaby Vanilla with Probiotics Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-yobaby-vanilla-with-probiotics-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Strawberry Dairy-Free Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-strawberry-dairyfree-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Kids Organic Strawberry Banana Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-kids-organic-strawberry-banana-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Plain Almond Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-plain-almond-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Kids Organic Blueberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-kids-organic-blueberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Strained Non-Fat Yogurt Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-strained-nonfat-yogurt-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Peach Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-peach-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Peach on the Bottom Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-peach-on-the-bottom-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Strained Non-Fat Peach Icelandic Style Skyr Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-strained-nonfat-peach-icelandic-style-skyr-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Almond Milk Peach Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-almond-milk-peach-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Lowfat Strawberry Banana Yogurt Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-lowfat-strawberry-banana-yogurt-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Strawberry Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-strawberry-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Strawberry on the Bottom Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-strawberry-on-the-bottom-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           200,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Strawberry on the Bottom Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-strawberry-on-the-bottom-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani \"Flip\" Almond Coco Loco Low-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-flip-almond-coco-loco-lowfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "id": "Fage Total 2% with Mixed Berries Lowfat Greek Strained Yogurt",
//       "properties": {
//         "name": "Fage Total 2% with Mixed Berries Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-mixed-berries-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic YoKids Organic Strawberry Vanilla & Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-yokids-organic-strawberry-vanilla-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Cherry Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-cherry-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% Milkfat Greek Strained Fage Total 0% Milkfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-milkfat-greek-strained-fage-total-0-milkfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kevita Tangerine Sparkling Probiotic Drink",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kevita-tangerine-sparkling-probiotic-drink-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Whole-Milk Yogurt Mixed Berries",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-wholemilk-yogurt-mixed-berries-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Whole Milk Plain Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-whole-milk-plain-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Finest Blueberry Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-finest-blueberry-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Raspberry on the Bottom Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-raspberry-on-the-bottom-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic YoBaby Peach & Pear Whole Milk Organic Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-yobaby-peach-pear-whole-milk-organic-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Sheep Milk Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-sheep-milk-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Strawberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-strawberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Strained Low-Fat Yogurt Black Cherry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-strained-lowfat-yogurt-black-cherry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Maple Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-maple-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Wild Blueberry Dairy-Free Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-wild-blueberry-dairyfree-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Almond Milk Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-almond-milk-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           400,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "GoodBelly Probiotics Juice Drink Pomegranate Blackberry Flavor",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/goodbelly-probiotics-juice-drink-pomegranate-blackberry-flavor-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Blueberry on the Bottom Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-blueberry-on-the-bottom-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Whole Milk Plain Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-whole-milk-plain-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Yobaby Apple/Blueberry with Probiotics Stonyfield Organic YoBaby Apple/Blueberry Whole Milk Yogurt with Probiotics",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-yobaby-appleblueberry-with-probiotics-stonyfield-organic-yobaby-appleblueberry-whole-milk-yogurt-with-probiotics-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Plain Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-plain-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Kids Organic Strawberry Banana Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-kids-organic-strawberry-banana-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa yoghurt mates coconut almond chocolate",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-yoghurt-mates-coconut-almond-chocolate-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic 100% Grassfed Plain Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-100-grassfed-plain-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Cultured Goat Milk Kefir Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-cultured-goat-milk-kefir-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Vanilla Bean Dairy-Free Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-vanilla-bean-dairyfree-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Dairy Free Vanilla Soy Stonyfield Organic Dairy Free Vanilla Soy Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-dairy-free-vanilla-soy-stonyfield-organic-dairy-free-vanilla-soy-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Sheep Milk Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-sheep-milk-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Kids Strawberry Banana Whole Milk Stonyfield Organic Kids Strawberry Banana Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-kids-strawberry-banana-whole-milk-stonyfield-organic-kids-strawberry-banana-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Co Yo Coconut Milk Yogurt Alternative Natural Flavor",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/co-yo-coconut-milk-yogurt-alternative-natural-flavor-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Blueberry Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-blueberry-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Nonfat Acai & Mixed Berries Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-nonfat-acai-mixed-berries-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Very Berry Lowfat Yogurt Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-very-berry-lowfat-yogurt-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Unsweetend Plain Dairy-Free Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-unsweetend-plain-dairyfree-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Strawberry Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-strawberry-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           600,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Plain Sheep Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-plain-sheep-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Cherry Pomegranate Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-cherry-pomegranate-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Silk Dairy-Free Blueberry Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/silk-dairyfree-blueberry-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Vanilla Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-vanilla-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Blueberry Low-Fat Yogurt Tubes",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-blueberry-lowfat-yogurt-tubes-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Triple Cream Icelandic-Style Yogurt Raspberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-triple-cream-icelandicstyle-yogurt-raspberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Kids Cherry & Berry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-kids-cherry-berry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Kids Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-kids-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Raspberry Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-raspberry-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Vanilla Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-vanilla-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Old Chatham Sheepherding Company Sheep's Milk Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/old-chatham-sheepherding-company-sheeps-milk-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Yobaby Mango/Banana with Probiotics Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-yobaby-mangobanana-with-probiotics-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Non-Fat Drinkable Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-nonfat-drinkable-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Wild Blueberry Dairy-Free Probiotic Drinkable Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-wild-blueberry-dairyfree-probiotic-drinkable-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Passionate Mango Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-passionate-mango-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Chocolate Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-chocolate-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa yoghurt mates banana chocolate peanut",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-yoghurt-mates-banana-chocolate-peanut-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Plain Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-plain-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           800,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Honey Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-honey-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Goat Milk Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-goat-milk-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Whole-Milk Yogurt Strawberry & Rhubarb",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-wholemilk-yogurt-strawberry-rhubarb-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Almond Milk Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-almond-milk-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Strained Whole-Milk Yogurt Blueberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-strained-wholemilk-yogurt-blueberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Strawberry Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-strawberry-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Key Lime Crumble Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-key-lime-crumble-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway ProBugs Goo-Berry Pie Organic Whole Milk Kefir Cultured Milk Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-probugs-gooberry-pie-organic-whole-milk-kefir-cultured-milk-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Strawberry Dairy-Free Probiotic Drinkable Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-strawberry-dairyfree-probiotic-drinkable-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Raspberry Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-raspberry-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Vanilla Blended Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-vanilla-blended-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Organic Lactose Free Lowfat Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-organic-lactose-free-lowfat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Plain Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-plain-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Blackberry Grade A Sheep Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-blackberry-grade-a-sheep-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Banana Vanilla Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-banana-vanilla-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Traderspoint Creamery Low Fat Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/traderspoint-creamery-low-fat-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Peach Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-peach-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggis Yogurt, Triple Cream, Icelandic-Style, Strained, Lemon",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-yogurt-triple-cream-icelandicstyle-strained-lemon-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Kids Organic Strawberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-kids-organic-strawberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1000,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Sweet Cream Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-sweet-cream-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Artisan Almond Milk Yogurt Key Lime",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-artisan-almond-milk-yogurt-key-lime-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Unsweetened Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-unsweetened-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Indonesian Vanilla Bean Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-indonesian-vanilla-bean-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Raspberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-raspberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "365 Whole Milk Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/365-whole-milk-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Original Plain Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-original-plain-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "White Mountain Organic Bulgarian Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/white-mountain-organic-bulgarian-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Maple Hill Creamery Organic Vanilla Bean Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/maple-hill-creamery-organic-vanilla-bean-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "GT's CocoYo",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/gts-cocoyo-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Silk Dairy-Free Strawberry Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/silk-dairyfree-strawberry-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Lemon Dairy-Free Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-lemon-dairyfree-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Epic Seed Greek Yogurt + Chia Strawberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-epic-seed-greek-yogurt-chia-strawberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Maple Hill Creamery Organic Plain Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/maple-hill-creamery-organic-plain-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa mates Yoghurt Honey Pretzel Peanut",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-mates-yoghurt-honey-pretzel-peanut-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Saint Benoit Creamery Organic Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/saint-benoit-creamery-organic-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Icelandic Style Cream-Skyr 4% Milkfat Strained Whole-Milk Yogurt Mango",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-icelandic-style-creamskyr-4-milkfat-strained-wholemilk-yogurt-mango-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1200,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Goat Milk Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-goat-milk-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Silk Dairy-Free Peach Mango Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/silk-dairyfree-peach-mango-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Peach Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-peach-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Sheep Milk Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-sheep-milk-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's 0% Milkfat Yogurt Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-0-milkfat-yogurt-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Pineapple Almond Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-pineapple-almond-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Whole Milk Blended Vanilla Bean Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-whole-milk-blended-vanilla-bean-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's 0% Milkfat Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-0-milkfat-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Lowfat with Strawberries Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-lowfat-with-strawberries-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Blueberry Acai Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-blueberry-acai-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Dairy Free Blueberry Soy Stonyfield Organic Dairy Free Blueberry Soy Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-dairy-free-blueberry-soy-stonyfield-organic-dairy-free-blueberry-soy-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Kids Lemonade & Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-kids-lemonade-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Goat Milk Yogurt Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-goat-milk-yogurt-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Strawberry Sheep Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-strawberry-sheep-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Raspberry Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-raspberry-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Saint Benoit Creamery French Vanilla Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/saint-benoit-creamery-french-vanilla-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Ecuadorian Mango Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-ecuadorian-mango-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Blueberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-blueberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1400,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Vanilla Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-vanilla-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani S'more S'mores Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-smore-smores-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Washington Black Cherry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-washington-black-cherry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Key Lime Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-key-lime-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Strawberry Rhubarb Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-strawberry-rhubarb-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Key Lime Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-key-lime-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Pineapple on the Bottom 2% Low-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-pineapple-on-the-bottom-2-lowfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Traderspoint Creamery Organic Wildberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/traderspoint-creamery-organic-wildberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "GoodBelly PlusShot Strawberry Probiotic Juice Drink",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/goodbelly-plusshot-strawberry-probiotic-juice-drink-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Original Plain Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-original-plain-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Honey Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-honey-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Nonfat with Peaches Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-nonfat-with-peaches-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Baja Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-baja-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Organic Valley Grassmilk Organic Whole Milk Wild Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/organic-valley-grassmilk-organic-whole-milk-wild-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Aussie Greek Vanilla Bean Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-aussie-greek-vanilla-bean-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Whole Milk Blended Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-whole-milk-blended-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Pineapple Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-pineapple-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "365 Low Fat Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/365-low-fat-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1600,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Kids Organic Strawberry Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-kids-organic-strawberry-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Lemon Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-lemon-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Swedish Style Whole-Milk Drinkable Yogurt Strawberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-swedish-style-wholemilk-drinkable-yogurt-strawberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic O'Soy Fruit on the Bottom Strawberry Organic Soy Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-osoy-fruit-on-the-bottom-strawberry-organic-soy-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Key Lime Coconut Milk Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-key-lime-coconut-milk-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Capretta Rich & Creamy Plain Goat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/capretta-rich-creamy-plain-goat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Nonfat with Mixed Berries Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-nonfat-with-mixed-berries-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Plain Nonfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-plain-nonfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic 100% Org Grassfed Wm Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-100-org-grassfed-wm-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa mates Finest Yoghurt & Crunchies Honey Cranberry Almond",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-mates-finest-yoghurt-crunchies-honey-cranberry-almond-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Greek Gods Probiotic Nonfat Greek Style Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-greek-gods-probiotic-nonfat-greek-style-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Yogurt, Artisan Almond Milk, Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-yogurt-artisan-almond-milk-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Epic Seed Greek Yogurt + Chia Coconut",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-epic-seed-greek-yogurt-chia-coconut-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Lactose Free Lowfat Kefir Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-lactose-free-lowfat-kefir-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Strawberry Whole Milk Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-strawberry-whole-milk-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Mango Yoghurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-mango-yoghurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Greek Gods Strawberry Greek Yogurt Honey",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-greek-gods-strawberry-greek-yogurt-honey-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Peach Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-peach-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Organic Valley Grassmilk Organic Whole Milk Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/organic-valley-grassmilk-organic-whole-milk-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           1800,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Vanilla Almond Milk Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-vanilla-almond-milk-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Smooth & Creamy Whole Milk Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-smooth-creamy-whole-milk-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Unsweetened Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-unsweetened-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Organic Valley Plain Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/organic-valley-plain-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Whole Milk Blended Raspberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-whole-milk-blended-raspberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Saint Benoit Creamery Organic French Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/saint-benoit-creamery-organic-french-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Black Cherry on the Bottom Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-black-cherry-on-the-bottom-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Strawberry Kefir Cultured Lowfat Milk Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-strawberry-kefir-cultured-lowfat-milk-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway ProBugs Orange Creamy Crawler Organic Whole Milk Kefir Cultured Milk Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-probugs-orange-creamy-crawler-organic-whole-milk-kefir-cultured-milk-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway ProBugs Strawnana Split Organic Whole Milk Kefir Cultured Milk Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-probugs-strawnana-split-organic-whole-milk-kefir-cultured-milk-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Maple Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-maple-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Lactose Free Grade A Low Fat Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-lactose-free-grade-a-low-fat-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "365 Fat Free Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/365-fat-free-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Co Yo Coconut Milk Yogurt Alternative Raw Chocolate Flavor",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/co-yo-coconut-milk-yogurt-alternative-raw-chocolate-flavor-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Organic Low Fat Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-organic-low-fat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Vanilla Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-vanilla-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Bellwether Farms Blueberry Sheep Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/bellwether-farms-blueberry-sheep-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Key Lime Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-key-lime-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Traderspoint Creamery Organic Raspberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/traderspoint-creamery-organic-raspberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2000,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 0% with Cherry Nonfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-0-with-cherry-nonfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Whole Milk Peach Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-whole-milk-peach-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Lactose Free Blueberry Pomegranate Acai Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-lactose-free-blueberry-pomegranate-acai-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Epic Seed Greek Yogurt Peach & Chia",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-epic-seed-greek-yogurt-peach-chia-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Goat Milk Yogurt Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-goat-milk-yogurt-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Smooth & Creamy Whole Milk French Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-smooth-creamy-whole-milk-french-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Clover Organic Blueberry Cream On Top Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/clover-organic-blueberry-cream-on-top-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Fat Free Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-fat-free-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Vanilla Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-vanilla-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Clover Cream On Top Vanilla Organic Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/clover-cream-on-top-vanilla-organic-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Philippine Coconut Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-philippine-coconut-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Unsweetened Vanilla Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-unsweetened-vanilla-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Raspberry Pear Whole Milk Organic Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-raspberry-pear-whole-milk-organic-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic YoKids Organic Squeezers Strawberry Banana Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-yokids-organic-squeezers-strawberry-banana-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Chocolate on the Bottom Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-chocolate-on-the-bottom-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Organic Peach Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-organic-peach-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Chobani Vanilla Blended Non-Fat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/chobani-vanilla-blended-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Organic Valley Grassmilk Organic Whole Milk Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/organic-valley-grassmilk-organic-whole-milk-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Capretta Plain Greek Goat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/capretta-plain-greek-goat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2200,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Nonfat with Raspberries Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-nonfat-with-raspberries-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Lowfat with Blueberries Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-lowfat-with-blueberries-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Nonfat Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-nonfat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Blackberry Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-blackberry-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "365 Low Fat Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/365-low-fat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Peach on the Bottom Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-peach-on-the-bottom-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Vanilla Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-vanilla-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Zen Monkey Yogurt Oatmeal Apple Cinnamon",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/zen-monkey-yogurt-oatmeal-apple-cinnamon-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Yoghurt, Blood Orange",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-yoghurt-blood-orange-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "The Epic Seed Blueberry Greek Yogurt + Chia",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/the-epic-seed-blueberry-greek-yogurt-chia-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Smooth & Creamy Lowfat French Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-smooth-creamy-lowfat-french-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Goat Milk Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-goat-milk-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Organic Strained with Strawberry Rosehip Kefir Cup",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-organic-strained-with-strawberry-rosehip-kefir-cup-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Plain Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-plain-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Lowfat with Honey Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-lowfat-with-honey-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Blueberry Pomegranate Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-blueberry-pomegranate-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Tonix Coconut Water Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/tonix-coconut-water-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Strawberry Pomegranate Acai Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-strawberry-pomegranate-acai-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Liberté Organic Whole Milk Lemon Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/libert-organic-whole-milk-lemon-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2400,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Lowfat Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-lowfat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Lactose Free Organic Whole Milk Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-lactose-free-organic-whole-milk-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Traderspoint Creamery Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/traderspoint-creamery-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Maple Hill Creamery Organic Strawberry Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/maple-hill-creamery-organic-strawberry-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Capretta Non Fat Plain Goat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/capretta-non-fat-plain-goat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Plain Nonfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-plain-nonfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Zen Monkey Pineapple Coconut Oats & Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/zen-monkey-pineapple-coconut-oats-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Saint Benoit Creamery Organic Plain French Style Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/saint-benoit-creamery-organic-plain-french-style-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Plain Unsweetened Artisan Almond Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-plain-unsweetened-artisan-almond-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Aussie Greek Plain Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-aussie-greek-plain-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Kids Strawberry Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-kids-strawberry-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Lowfat with Cherries Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-lowfat-with-cherries-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Apricot Mango on the Bottom Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-apricot-mango-on-the-bottom-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Lactose Free Low Fat Yogurt Blueberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-lactose-free-low-fat-yogurt-blueberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggis Yogurt, Drinkable, Whole-Milk, Swedish Style Filmjolk, Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-yogurt-drinkable-wholemilk-swedish-style-filmjolk-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Maple Hill Creamery 100% Grass-Fed Cows Whole Milk Yogurt Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/maple-hill-creamery-100-grassfed-cows-whole-milk-yogurt-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "So Delicious Dairy Free Coconut Milk Plain Yogurt Alternative",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/so-delicious-dairy-free-coconut-milk-plain-yogurt-alternative-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Blueberry Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-blueberry-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Plain Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-plain-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2600,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Co Yo Coconut Milk Yogurt Alternative Mango Flavor",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/co-yo-coconut-milk-yogurt-alternative-mango-flavor-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Icelandic Style Cream-Skyr 2% Milkfat Strained Low-Fat Yogurt Vanilla & Cardamon",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-icelandic-style-creamskyr-2-milkfat-strained-lowfat-yogurt-vanilla-cardamon-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Whole Milk Blended Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-whole-milk-blended-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hil Greek Almond Milk Strawberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hil-greek-almond-milk-strawberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Traderspoint Creamery Banana Mango Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/traderspoint-creamery-banana-mango-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Raspberry on the Bottom Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-raspberry-on-the-bottom-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Organic Strained with Blueberry Lavender Kefir Cup",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-organic-strained-with-blueberry-lavender-kefir-cup-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Cherry Vanilla Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-cherry-vanilla-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Clover Organic Cream on Top Peach Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/clover-organic-cream-on-top-peach-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Nonfat with Lemon Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-nonfat-with-lemon-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Yoghurt, Finest, Blackberry Serrano",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-yoghurt-finest-blackberry-serrano-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Strawberry Organic Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-strawberry-organic-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Strawberry Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-strawberry-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "noosa Mates Finest Yoghurt & Crunchies Maple Ginger",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/noosa-mates-finest-yoghurt-crunchies-maple-ginger-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Co Yo Coconut Milk Yogurt Alternative Mixed Berry Flavor",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/co-yo-coconut-milk-yogurt-alternative-mixed-berry-flavor-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Low Fat Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-low-fat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Zen Monkey Oatmeal Blueberry Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/zen-monkey-oatmeal-blueberry-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Plum Tots Organics Mighty 4 Tots Banana Kiwi Spinach Kale Greek Yogurt Barley Oat Nutrition Blend of 4 Food Groups",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/plum-tots-organics-mighty-4-tots-banana-kiwi-spinach-kale-greek-yogurt-barley-oat-nutrition-blend-of-4-food-groups-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "White Mountain Organic Bulgarian Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/white-mountain-organic-bulgarian-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           2800,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Plain Organic Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-plain-organic-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Saint Benoit Creamery Organic French-Style Meyer Lemon Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/saint-benoit-creamery-organic-frenchstyle-meyer-lemon-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Plain Dairy-Free Probiotic Drinkable Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-plain-dairyfree-probiotic-drinkable-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic 100% Grassfed Blueberry Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-100-grassfed-blueberry-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Good Karma Dairy Free Yogurt Strawberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/good-karma-dairy-free-yogurt-strawberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Icelandic-style Strained Yogurt Triple Cream Chocolate",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-icelandicstyle-strained-yogurt-triple-cream-chocolate-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Good Karma Plain Yogurt Cups",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/good-karma-plain-yogurt-cups-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Greek Plain Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-greek-plain-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Non-Fat Drinkable Yogurt Blueberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-nonfat-drinkable-yogurt-blueberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggis Yogurt, Low-Fat, Icelandic Style Cream-Skyr, Strained, Lingonberry & Strawberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-yogurt-lowfat-icelandic-style-creamskyr-strained-lingonberry-strawberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Redwood Hill Farm Goat Milk Yogurt Blueberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/redwood-hill-farm-goat-milk-yogurt-blueberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Clover Organic Forest Berry Cream On Top Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/clover-organic-forest-berry-cream-on-top-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Mango Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-mango-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Green Valley Organics Lactose Free Low Fat Yogurt Vanilla",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/green-valley-organics-lactose-free-low-fat-yogurt-vanilla-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Plain Unsweetened Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-plain-unsweetened-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Plain Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-plain-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Greek 0% Fat Plain  Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-greek-0-fat-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3000,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Blueberry Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-blueberry-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Plain Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-plain-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Plain Unsweetened Organic Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-plain-unsweetened-organic-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Straus Family Creamery Organic Plain Nonfat Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/straus-family-creamery-organic-plain-nonfat-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Organic Valley Grassmilk Organic Whole Milk Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/organic-valley-grassmilk-organic-whole-milk-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Blueberry Almond Milk Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-blueberry-almond-milk-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Wildberries and Cream Organic Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-wildberries-and-cream-organic-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway ProBugs Sublime Slime Lime Organic Whole Milk Kefir Cultured Milk Smoothie",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-probugs-sublime-slime-lime-organic-whole-milk-kefir-cultured-milk-smoothie-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           1400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "365 Organic Fat Free Vanilla Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/365-organic-fat-free-vanilla-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           1600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Vanilla Bean Lowfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-vanilla-bean-lowfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           1800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Wallaby Organic Organic Lemon Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/wallaby-organic-organic-lemon-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           2000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic 100% Grassfed Strawberry Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-100-grassfed-strawberry-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           2200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Blueberry on the Bottom Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-blueberry-on-the-bottom-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           2400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggis Yogurt, Drinkable, Whole-Milk, Swedish Style Filmjolk, Blueberry",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-yogurt-drinkable-wholemilk-swedish-style-filmjolk-blueberry-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           2600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Siggi's Swedish Style Non-Fat Drinkable Yogurt Plain",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/siggis-swedish-style-nonfat-drinkable-yogurt-plain-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           2800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Organic Strained with Granola Kefir Cup",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-organic-strained-with-granola-kefir-cup-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           3000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic 100% Grassfed Vanilla Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-100-grassfed-vanilla-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           3200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Natural Organic Strained Kefir Cup",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-natural-organic-strained-kefir-cup-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           3400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Brown Cow Cream Top Coffee Whole Milk Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/brown-cow-cream-top-coffee-whole-milk-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3200,
//           3600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Lifeway Strawberry Kefir",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/lifeway-strawberry-kefir-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           0
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Forager Project Plain Dairy Free Cashewgurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/forager-project-plain-dairy-free-cashewgurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Kite Hill Peach Almond Milk Greek Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/kite-hill-peach-almond-milk-greek-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           400
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Nonfat Gotta Have Vanilla Organic Frozen Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-nonfat-gotta-have-vanilla-organic-frozen-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           600
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Plain Nonfat Stonyfield Organic Plain Nonfat Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-plain-nonfat-stonyfield-organic-plain-nonfat-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           800
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Maple Hill Creamery Cream On Top Plain Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/maple-hill-creamery-cream-on-top-plain-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           1000
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Stonyfield Organic Organic Greek 0% Fat Vanilla Bean Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/stonyfield-organic-organic-greek-0-fat-vanilla-bean-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           1200
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {
//         "name": "Fage Total 2% with Raspberry Pomegranate Lowfat Greek Strained Yogurt",
//         "offset": [
//           0,
//           0
//         ],
//         "size": [
//           200,
//           200
//         ],
//         "src": "product-images/dairy-eggs/yogurt/fage-total-2-with-raspberry-pomegranate-lowfat-greek-strained-yogurt-200x.jpg",
//         "department": "dairy-eggs",
//         "subdepartment": "yogurt"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           3400,
//           1400
//         ]
//       }
//     }
//   ]
// }

const iconcache = new IconCache;
iconcache.setSize(yogurt.length);

const styleCache = {};

const productsVectorStyle = function(product, resolution) {
  product.setId(product.getProperties().name);
  let style = styleCache[product.getProperties().name];
  if (style) {
    style.getImage().setScale(1/resolution);
    return [style]
  }
  else  {
    const productProperties = product.getProperties();
    //const scale = productProperties.hover ? 1.1/ resolution : 1/resolution
    let productIcon = new Icon({
      offset: productProperties.offset,
      size: productProperties.size,
      scale: 1 / resolution,
      crossOrigin: 'anonymous',
      src: productProperties.src
    });
    styleCache[product.getProperties().name] = new Style({
      image: productIcon
    })

    return [styleCache[product.getProperties().name]]

  }
}

const productsVectorSource = new VectorSource({
       features: (new GeoJSON()).readFeatures(yogurt)
});

const productsVectorLayer = new VectorLayer({
  source: productsVectorSource,
  style: productsVectorStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})


var vectorLayer = new VectorLayer({
  source: vectorSource,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

var view = new View({
  center: [20, 20],
  zoom: 4,
  zoomFactor: 2,
  minResolution: 1,
  maxResolution: 80,
  projection: new Projection({
   units: 'pixels',
   extent: [0,0,100000,100000]
  })
})


var map = new olMap({
  renderer: /** @type {Array<ol.renderer.Type>} */ (['canvas']),
  layers: [productsVectorLayer],
  target: document.getElementById('map'),
  view: view
});

map.on('click', function(evt) {
  var info = document.getElementById('info');
  info.innerHTML = 
  'event coor: ' + evt.coordinate + 
  '<br> Coordinate from pixel: ' +  map.getCoordinateFromPixel(evt.coordinate) +
  '<br> Pixel from Coordinate: ' +  map.getPixelFromCoordinate(evt.coordinate) +
  '<br> event pixel: ' + map.getEventPixel(evt) + 
  '<br> event coordinate: ' + map.getEventCoordinate(evt.coordinate) + 
  '<br> features at pixel: ' + map.getFeaturesAtPixel(evt.pixel)[0].getId() +
  '<br> Resolution: ' + map.getView().getResolution() + 
  '<br> Zoom: ' + map.getView().getZoom();
  //console.log(map.getView());
  //console.log(map.getFeaturesAtPixel(evt.pixel, {hitTolerance: 100})[0].getProperties().name);
  //console.log(features[100]);
  //console.log(evt);
});


let highlight; 




const onProductHover = function(evt) {
  const pixel = evt.pixel;
  const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
  const resolution = map.getView().getResolution();
  if (feature !== highlight) {
    if (highlight) {
      //highlight.setProperties({'hover': false});
      highlight.setStyle(productsVectorStyle);
    }
    if (feature) {
      feature.setProperties({'hover': true});
      let properties = feature.getProperties();
      //console.log(properties);
      feature.setStyle(styleCache[feature.getProperties().name]);
      feature.getStyle().getImage().setScale(1/resolution * 1.1);
      // feature.setStyle( function (resolution) {
      //   this.get('originalStyle').getImage().setScale(1 / resolution * 1.1);
      //   return this.get('originalStyle');
      // }); 
    }
    highlight = feature;
  }

}

map.on('pointermove', onProductHover);

let clicked; 

const onProductClick = function(evt) {
  const pixel = evt.pixel;
  const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
  console.log('step 1' + feature, clicked);
  if (feature !== clicked) {
    console.log('step 2: ' + feature,clicked);
    if (clicked) {
      clicked.setStyle( function (resolution) {
        this.get('originalStyle').getImage().setScale(1 / resolution);
        this.get('originalStyle').setZIndex(0);
        return this.get('originalStyle');
      });
    }
    if (feature) {
      feature.setStyle( function (resolution) {
        this.get('originalStyle').getImage().setScale(1);
        this.get('originalStyle').setZIndex(1);
        return this.get('originalStyle');
      }); 
    }
    clicked = feature;
  }
}

//map.on('click', onProductClick);

/* Search field prototype */

const searchForm = document.getElementById('search');

const handleSearch = function(e) {
  e.preventDefault();
  const query = searchForm.elements[0].value;
  if (query != '') {
    try {
      console.log('query',query);
      let products = yogurt.features;
      let match = matchSorter(products, query, {keys: ['properties.name'] })
      console.log('match',match[0].properties.name);
      const feature = productsVectorLayer.getSource().getFeatureById(match[0].properties.name); 
      map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
        zoom: 6
      })
    }
    catch(err) {
      console.log(query +' not found');
    }

  }



//  map.getLayers().getSource().getFeatureById()

} 
searchForm.addEventListener('submit', handleSearch);


const search = new Control({
  element: document.getElementById('search-overlay'),


});
map.addControl(search);



