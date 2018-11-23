// import Feature from 'ol/feature';
// import Point from 'ol/geom/point';
// import VectorLayer from 'ol/layer/vector';
// import VectorSource from 'ol/source/vector';
// import Circle from 'ol/geom/circle';
// import Polygon from 'ol/geom/polygon';
// import CircleStyle from 'ol/style/circle';
// import Stroke from 'ol/style/stroke';
// import Icon from 'ol/style/icon';
// import Fill from 'ol/style/fill';
// import Text from 'ol/style/text';
// import Style from 'ol/style/style';

// const d3Array = require('d3-array');

// import {
//   imagesDir,
//   productsImageMax,
//   productsCircleMax,
//   brandsLabelMax,
//   brandsLabelMin,
//   brandsCircleMax,
//   brandsCircleMin,
//   brandsImageMax,
//   brandsImageMin,
//   subdeptsLabelMax,
//   subdeptsLabelMin,
//   subdeptsCircleMax,
//   subdeptsCircleMin,
//   subdeptsImageMax,
//   subdeptsImageMin,
//   deptsLabelMax,
//   deptsLabelMin,
//   deptsCircleMax,
//   deptsCircleMin,
//   deptsImageMax,
//   deptsImageMin,
//   maxResolutions,
//   labelColors,
//   labelStyleChange,
//   labelBackgroundColors,
//   labelStrokes,
//   labelStrokeWidth,
//   circleLabelColors,
//   circleColors,
//   circleHoverColors,
//   imageScale,
//   fontFamily,
//   fontSizes,
//   fontSizesByType,
//   fontWeight,
// } from '../constants';
// import {textFormatter, dataTool, getFeatureJson, getFeaturesFromFirestore} from '../utilities.js';
// import {view, map} from '../index.js';
// import { isNullOrUndefined } from 'util';

// /*
// * Label Features
// * 
// */
// const labelFeatureRender = function (featureSets, type='all') {
//   const rangeData = d3Array.histogram()
//   .value(d => {
//     if (d.properties.type == type || type == 'all') return d.properties.radius;
//   })
//   .thresholds(6);
//   const labels = [];
//   featureSets.forEach((featureSet) => {
//     const range = rangeData(featureSet);
//     featureSet.forEach((f) => {
//       let fontSize = '12px Oswald';
//       if (f.properties.type == type) {
//         for (let i = 0; i < range.length; i++) {
//           for (let j = 0; j < range[i].length; j++) {
//             if (range[i][j].id == f.id) {
//               // shrink font size a couple points depending on category level
//               fontSize = fontSizes[i] - (['dept','subdept','brand'].indexOf(f.properties.type));
//               break;
//             }
//           }
//         }
//         let name = textFormatter(f.properties.name, 18, '\n');
//         const label = new Feature({
//           geometry: new Point(f.geometry.coordinates),
//           name: name,
//           fid : f.id,
//           type: f.properties.type,
//           style: 'label',
//           radius: f.properties.radius,
//           fontSize: fontSize,
//           maxRes: f.properties.maxRes
//           //src: f.properties.src
//         });
//         label.setId(f.id + '-label');
//         labels.push(label);        
//       }
//     })
//   })
//   return labels;
// }


// const labelStyleCache = {};
// const resolutionCache = {};

// const labelStyle = function(label, res) {
//   if (label.get('maxRes') < view.getResolution()) return null;

//   let style = labelStyleCache[label.getId()];

//   if (resolutionCache[label.getId()] >= labelStyleChange[label.get('type')] 
//   && view.getResolution() <= labelStyleChange[label.get('type')]) {
//     label.set('styleChange', true);
//     style = null;
//   } else if (resolutionCache[label.getId()] <= labelStyleChange[label.get('type')] 
//   && view.getResolution() >= labelStyleChange[label.get('type')]) {
//     label.set('styleChange', false); 
//     style = null;
//   }
//   const labelType = label.get('type');
//   if (labelType === 'dept') label.set('styleChange', true);
//   if (isNullOrUndefined(style)) {
//     const styleChange = label.get('styleChange');

//     const fontSize = styleChange === true ? label.get('fontSize')*1.5 : label.get('fontSize');
//     const text = label.get('name');
//     const textAlign = styleChange === true ? 'center' : 'left';
//     const offsetX = styleChange === true ? 0 : imageScale[labelType] * 120;
//     const backgroundFillColor = styleChange === true ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)'; 
    
//     style = new Style({
//       text: new Text({
//         font: fontWeight[labelType] + ' ' + fontSize + 'px' + ' ' + fontFamily[labelType],
//         text: text,
//         textBaseline: 'middle',
//         textAlign: textAlign,
//         offsetX: offsetX,
//         fill: new Fill({color: labelColors[labelType]}),
//         stroke: new Stroke({color: labelStrokes[labelType], width: labelStrokeWidth[labelType]}) ,
//         backgroundFill: new Fill({color: backgroundFillColor}),
//         padding: [0,3,0,3]
//       })
//     })
//     labelStyleCache[label.getId()] = style;
//     resolutionCache[label.getId()] = view.getResolution();
//   }

//   return style;
// }

// /*
// * Image Features
// * 
// */

// const imageFeatureRender = function (featureSets, type='all') {
//   const images = [];
//   let extent = [];
//   if (featureSets.length === 1) {
//     extent = d3Array.extent(featureSets[0], function(f) {
//       if (type === f.properties.type) {
//         return f.properties.radius  
//       } 
//     });
//   }

//   featureSets.forEach((featureSet) => {
//     featureSet.forEach((f) => {
//       if ((f.properties.type === type || type === 'all'))  {
//         const src = imagesDir + (f.properties.sampleImg || f.properties.src); 
//         const image = new Feature({
//           geometry: new Point(f.geometry.coordinates),
//           name: f.properties.name,
//           fid: f.id,
//           price: f.properties.price || '',
//           type: f.properties.type,
//           style: 'image',
//           radius: f.properties.radius,
//           relativeRadius: f.properties.radius / extent[1],
//           src: src,
//           maxRes: f.properties.maxRes
//         });
//         image.setId(f.id + '-image');
//         images.push(image);        
//       }
//     })
//   })
//   return images;
// }

// const imageStyleCache = {};
// const imageIconCache = {};

// const imageStyle = function(image, res) {
//   if (image.get('maxRes') < view.getResolution()) return null;
//   let style = imageStyleCache[image.get('src')];
//   if (!style) {
//     let icon = imageIconCache[image.get('src')];
//     const scaleFactor = imageScale[image.get('type')];
//     const radius = image.get('radius');
//     const scale = image.get('relativeRadius') > .7 ? image.get('relativeRadius') : .7;//radius/65 * 2 > 200 ? 1 : radius/65 * 2 / 200;
//     if (!icon) {
//       icon = new Icon({
//         src: image.get('src'),
//         size: [200,200],
//         crossOrigin: 'anonymous',
//         scale: scaleFactor / Math.SQRT2,
//         anchor: [0.5, 0.5]
//       })
//       imageIconCache[image.get('src')] = icon;
//     }
//     const circleStyle = new Style({
//       image: new CircleStyle({
//         fill: new Fill({
//           color: '#fff'
//         }),
//         stroke: new Stroke({
//           color: labelColors[image.get('type')],
//           width: 3
//         }),
//         radius: 105 * scaleFactor
//       })
//     }); 
//     const Iconstyle = new Style({
//       image: icon 
//     })
//     style = [circleStyle, Iconstyle];
//     imageStyleCache[image.get('type')] = style;
//   }
//   if (image.get('type') == 'product') style.getImage().setScale(1/ res);
//   return style;
// }


// /*
// * Circle Features
// * 
// */

// const circleFeatureRender = function(featureSets, type='all') {
//   const circles = [];
//   featureSets.forEach((featureSet) => {
//     featureSet.forEach((f) => {
//       if (f.properties.type == type || type == 'all') {
//         const type = f.properties.type;
//         const color = circleColors[type];
//         const hoverColor = circleHoverColors[type];
//         const circle = new Feature({
//           geometry: new Circle(f.geometry.coordinates, f.properties.radius || (100 * Math.sqrt(2))),
//           name: f.properties.name,
//           fid: f.id,
//           type: type,
//           style: 'circle',
//           radius: f.properties.radius,
//           color: color,
//           hover: false,
//           hoverColor: hoverColor,
//           src: imagesDir + (f.properties.sampleImg || f.properties.src),
//           children: f.properties.value || '' 
//         });
//         circle.setId(f.id + '-circle');
//         circles.push(circle);        
//       }
//     })
//   })
//   return circles;    
// }

// const circleStyleCache = {};
// const circleStyleHoverCache = {};

// const circleStyle = function(circle, res) {
//   const hover = circle.get('hover');
//   let style = hover === false ? circleStyleCache[circle.getId()] : circleStyleHoverCache[circle.getId()];
//   if (!style && hover === false) {
//     style = new Style({
//       fill: new Fill({color: circle.get('color')})
//     })
//     circleStyleCache[circle.getId()] = style;
//   } else if (!style && hover === true) {
//     style = new Style({
//       fill: new Fill({color: circle.get('hoverColor')})
//     })
//     circleStyleHoverCache[circle.getId()] = style;
//   }
//   return style;
// }


// /*
// * Circle Labels Features --- NOT USED
// * 
// */

// const circleLabelRender = function(featureSets, type='all') {
//   const circles = [];
//   featureSets.forEach((featureSet) => {
//     featureSet.forEach((f) => {
//       if (f.properties.type == type || type == 'all') {
//         const type = f.properties.type;
//         const circle = new Feature({
//           geometry: new Polygon.fromCircle(
//             new Circle(f.geometry.coordinates, f.properties.radius || 100), 128
//           ),
//           name: f.properties.name,
//           fid: f.id,
//           type: type,
//           style: 'circlelabel',
//           radius: f.properties.radius,
//           color: circleLabelColors[type],
//           hoverColor: circleHoverColors[type],
//         });
//         circle.setId(f.id + '-circlelabel');
//         circles.push(circle);        
//       }
//     })
//   })
//   return circles;    
// }

// const circleLabelStyleCache = {};
// const circleLabelStyle = function(circleLabel, res) {
//   let style = circleLabelStyleCache[circleLabel.get('id')];
//   if (!style) {
//     const fillColor = 
//     style = new Style({
//       text: new Text({
//         font: circleLabel.get('fontSize'),
//         text: circleLabel.get('name'),
//         placement: 'line',
//         textBaseline: 'bottom',
//         textAlign: 'end',
//         maxAngle: Math.PI,
//         fill: new Fill({color: circleLabelColors[circleLabel.get('type')]}),
//         stroke: new Stroke({color: '#fff', width: 2}) ,
//         //backgroundFill: new Fill({color: 'rgba(0,0,0,1'}),
//         //padding: [0,5,0,5]
//       })
//     })
//     circleLabelStyleCache[circleLabel.get('name')] = style;
//   }
//   return style;
// }


// // Product Image Feature

// const productImageFeatureRender = function (featureSets, type='product') {
//   const images = [];

//   featureSets.forEach((featureSet) => {
//     featureSet.forEach((f) => {
//       const src = imagesDir + f.properties.src; 
//       const image = new Feature({
//         geometry: new Point(f.geometry.coordinates),
//         name: f.properties.name,
//         fid: f.id,
//         price: f.properties.price || '',
//         type: f.properties.type,
//         style: 'image',
//         src: src
//       });
//       image.setId(f.id + '-image');
//       if (f.properties.sprite200Src && f.properties.spriteCoord) {
//         image.set('sprite200Src', imagesDir + f.properties.sprite200Src);
//         image.set('spriteCoord', f.properties.spriteCoord);
//       } 
//       images.push(image);        
//     })
//   })
//   return images;
// }

// // Product Image Style
// const productImageStyleCache = {};
// const productImageIconCache = {};
// const productSpriteIconCache = {};

// const productImageStyle = function(image, res) {
//   let imagesrc = image.get('src');
//   let style = productImageStyleCache[imagesrc];

//   if (!style) {
//     let spriteicon = productSpriteIconCache[imagesrc];
//     let imageicon = productImageIconCache[imagesrc];
//     if (!spriteicon) {
//       let offset = image.get('spriteCoord') != undefined ? image.get('spriteCoord') : [0,0];
//       offset = [offset[0] * .5, offset[1] * .5,];
//       let spritesrc = image.get('sprite200Src') != undefined ? image.get('sprite200Src') : imagesrc;
//       spriteicon = new Icon({
//         src: spritesrc + '-scaled50-compressed.jpg',
//         size: [100,100],
//         offset: offset,
//         crossOrigin: 'anonymous'
//       })
//       productSpriteIconCache[imagesrc] = spriteicon;  
//     }

//     if (!imageicon) {
//       imageicon = new Icon({
//         src: imagesrc,
//         size: [199,199],
//         crossOrigin: 'anonymous'
//       })
//       productImageIconCache[imagesrc] = imageicon;  
//     }

//     // const imageStyle = new Style({ image: imageicon });
//     // const spriteStyle = new Style({ image: spriteicon });

//     // style = [imageStyle, spriteStyle];
//     // productImageStyleCache[imagesrc] = style;

//     style = new Style();
    
    
//   }
//   if (imagesrc.includes('missing-item')) {
//     style.setImage(productImageIconCache[imagesrc]);
//     style.getImage().setScale(1/res);
//   }
//   else if (res >= 2) {
//     style.setImage(productSpriteIconCache[imagesrc]);
//     style.getImage().setScale(2/res);
//   } else {
//     style.setImage(productImageIconCache[imagesrc]);
//     style.getImage().setScale(1/res);
//   }
  
//   return style;
// }


// /*
// * Exports
// */

// // This is used for category labels only
// const maxResData = d3Array.histogram()
// .value(d => d.properties.radius)
// .thresholds([200,400,600,800,1600,2000,2800,3500]);



// const setMaxRange = function(features, range) {
//   features.forEach((f) => {
//     for (let i = 0; i < range.length; i++) {
//       for (let j = 0; j < range[i].length; j++) {
//         if (range[i][j].id == f.id) {
//           f.properties.maxRes = maxResolutions[i];
//           break;
//         }
//       }
//     }  
//   })  
// }

// // Dept Layers defined outside of Promise so they can be exported to the OverviewMap control
// const deptCircleSource = new VectorSource();
// const deptLabelSource = new VectorSource();

// export const departmentsCircleLayer = new VectorLayer({
//   style: circleStyle,
//   source: deptCircleSource,
//   zIndex: 0,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
// });
// export const departmentsLabelLayer = new VectorLayer({
//   style: labelStyle,
//   source: deptLabelSource,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   zIndex: 10,
//   minResolution: deptsLabelMin,
//   maxResolution: deptsLabelMax
// });

// export let maxExtent = [];

// // getFeaturesFromFirestore('categoryfeatures')
// // .then(snapshot => {
// //   const features = [];
// //   for (let f of snapshot.docs) {
// //       features.push(f.data());
// //     } 
// //   console.log(features);
// // }) 

// getFeatureJson(['dept','subdept','brand'], 'categoryfeatures')
// .then(res => {
//   const featureData = res;
//   const maxResRange = maxResData(featureData);
//   setMaxRange(featureData, maxResRange);

//   const deptCircleFeatures = circleFeatureRender([featureData], 'dept');
//   deptCircleSource.addFeatures(deptCircleFeatures);

//   const deptLabelFeatures = labelFeatureRender([featureData], 'dept');
//   deptLabelSource.addFeatures(deptLabelFeatures);
  
//   const departmentsImageLayer = new VectorLayer({
//     source: new VectorSource({
//       features: imageFeatureRender([featureData], 'dept'),
//       overlaps: false
//     }),
//     style: imageStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 9,
//     minResolution: subdeptsImageMax,
//     maxResolution: deptsImageMax
//   })

//   const subdepartmentsLabelLayer = new VectorLayer({
//     source: new VectorSource({
//       features: labelFeatureRender([featureData], 'subdept'),
//       overlaps: false
//     }),
//     style: labelStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 8,
//     minResolution: subdeptsLabelMin,
//     maxResolution: subdeptsLabelMax
//   })
  
//   const subdepartmentsImageLayer = new VectorLayer({
//     source: new VectorSource({
//       features: imageFeatureRender([featureData], 'subdept'),
//       overlaps: false
//     }),
//     style: imageStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 7,
//     minResolution: subdeptsImageMin,
//     maxResolution: subdeptsImageMax
//   })
  
//   const subdepartmentsCircleLayer = new VectorLayer({
//     source: new VectorSource({
//       features: circleFeatureRender([featureData], 'subdept')
//     }),
//     style: circleStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 1,
//     minResolution: subdeptsCircleMin,
//     maxResolution: subdeptsCircleMax
//   })

//   const brandsLabelLayer = new VectorLayer({
//     source: new VectorSource({
//       features: labelFeatureRender([featureData], 'brand'),
//       overlaps: false
//     }),
//     style: labelStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 6,
//     minResolution: brandsLabelMin,
//     maxResolution: brandsLabelMax
//   })


//   const brandsImageLayer = new VectorLayer({
//     source: new VectorSource({
//       features: imageFeatureRender([featureData], 'brand'),
//       overlaps: false
//     }),
//     style: imageStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 5,
//     minResolution: brandsImageMin,
//     maxResolution: brandsImageMax
//   })

//   const brandsCircleLayer = new VectorLayer({
//     source: new VectorSource({
//       features: circleFeatureRender([featureData], 'brand')
//     }),
//     style: circleStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 2,
//     minResolution: brandsCircleMin,
//     maxResolution: brandsCircleMax
//   })

//   map.addLayer(departmentsCircleLayer);
//   map.addLayer(subdepartmentsCircleLayer);
//   map.addLayer(brandsCircleLayer);
//   map.addLayer(brandsImageLayer);
//   map.addLayer(brandsLabelLayer);
//   map.addLayer(subdepartmentsImageLayer);
//   map.addLayer(subdepartmentsLabelLayer);
//   map.addLayer(departmentsImageLayer);
//   map.addLayer(departmentsLabelLayer);
//   maxExtent = departmentsCircleLayer.getSource().getExtent();
  
// })
// .then(() => {
//   document.querySelector('.loading').style.display = 'none';
// })
// .catch(err => console.log(err));

 


// // Products

// // Defined outside Promise so components can use productsSource for feature look-ups
// export const productsSource = new VectorSource({
//   overlaps: false
// });

// getFeatureJson(['product'], 'productsfeatures')
// .then(productData => {
//   const imageFeatures = productImageFeatureRender([productData], 'product');
//   productsSource.addFeatures(imageFeatures);
  
//   const productsImageLayer = new VectorLayer({
//     source: productsSource,
//     style: productImageStyle,
//     renderMode: 'raster',
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 4,
//     maxResolution: productsImageMax
//   });
  
//   const productsCircleLayer = new VectorLayer({
//     source: new VectorSource({
//       features: circleFeatureRender([productData], 'product')
//     }),
//     renderMode: 'raster',
//     style: circleStyle,
//     updateWhileAnimating: true,
//     updateWhileInteracting: true,
//     zIndex: 3,
//     maxResolution: productsCircleMax
//   });
//   map.addLayer(productsCircleLayer);
//   map.addLayer(productsImageLayer);
// })

