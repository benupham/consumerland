// import Extent from 'ol/extent';

// import {signage} from '../components/productDetail.js';
// import {map, view} from '../index.js';
// //import {departmentsSource, subdepartmentsSource} from '../features/circleFeatures.js';
// import {departmentsCircleLayer, subdepartmentsCircleLayer} from '../features/categoryFeatures.js';

// /* Signage */

// export const displaySignage = function() {
//   const viewExtent = view.calculateExtent();
//   const res = view.getResolution();
//   const ctr = view.getCenter();

//   const closestDepts = [];
//   const cnt = 4;
//   for (let i = 0; i < 4; i++) {
//     const closestDept = departmentsCircleLayer.getSource().getClosestFeatureToCoordinate(ctr, (f) => {
//       // if the feature intersects the ctr, skip
//       if (f.getGeometry().intersectsCoordinate(ctr)) return false;

//       // if the feature's center is in the view, skip
//       if (Extent.containsCoordinate(viewExtent,f.getGeometry().getCenter())) return false;

//       // if we've already found the feature, skip as well
//       if (closestDepts.indexOf(f) > -1) return false;

//       return true;

//     });
//     if (closestDept != null) closestDepts.push(closestDept);
//   }

//   // This logic is wasteful
//   if (closestDepts.length == 0) {
//     for (let i = 0; i < 4; i++) {
//       signage[i].getElement().style.display = 'none';
//     }
//   } else {
//     for (let i = 0; i < 4; i++) {
//       signage[i].getElement().style.display = 'inline-block';
//     }
//   }

//   closestDepts.forEach((f, i) => {
//     const coord = f.getGeometry().getCenter();
//     const angle = Math.atan2(coord[1] - ctr[1], coord[0] - ctr[0]);
//     const deg = -angle * (180 / Math.PI);
//     const adj = Math.sin(angle) * 400 * res;
//     const opp = Math.cos(angle) * 400 * res;
//     const signCtr = [ctr[0] + opp, ctr[1] + adj];

//     let sign = signage[i];

//     sign.setPosition(signCtr);

//     if (Math.abs(deg) > 90) {
//       sign.getElement().innerHTML = '&larr; ' + f.get('name');
//       sign.getElement().style.transform = 'rotate(' + deg + 'deg) scale(-1, -1)';
//     } else {
//       sign.getElement().innerHTML = f.get('name') + ' &rarr;';
//       sign.getElement().style.transform = 'rotate(' + deg + 'deg)';
//     }
//     sign.getElement().setAttribute('feature', f.getId());
//     sign.getElement().addEventListener('click', function(e) {
//       const fid = this.getAttribute('feature');
//       view.fit(departmentsCircleLayer.getSource().getFeatureById(fid).getGeometry(), {
//         duration: 1000,
//         callback: displaySignage
//       });
//     });
//   })

//   const names = [];
//   closestDepts.forEach((f) => {
//     names.push(f.get('name'));
//   })

// }
