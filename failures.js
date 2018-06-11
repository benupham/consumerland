/*
* Icon Layer
* 
*/

// const addIcon = new Feature({
//   geometry: new Point({
//     position: []
//   }),
//   type: 'addIcon',
//   name: 'addIcon',
//   product: null,
//   src: 'product-images/add.png'
// })

// const iconStyle = function(icon, resolution) {
//   let style = styleCache[icon.getProperties().name];

//   if (style) {
//     style.getImage()
//     //style.getImage().setRadius(100 / resolution);
//     return [style]
//   } else {

//   }

//   styleCache[icon.getProperties().name] = new Style({
//     image: new Icon({
//       size: [24,24],
//       crossOrigin: 'anonymous',
//       src: icon.get('src')
//     }),
//   })

//   return [styleCache[icon.getProperties().name]]
// }

// addIcon.setStyle(iconStyle);

// const IconSource = new VectorSource({
//   features: [addIcon]
// })

// const IconLayer = new VectorLayer({
//   source: IconSource,
//   style: iconStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   opacity: 1,
//   maxResolution: 8
// })

const addIconOverlay = new Overlay({
  element: document.getElementById('add-cart-icon')
})
map.addOverlay(addIconOverlay);


const showAddCartIcon = function(product) {
  const coordinate = product.getGeometry().getCoordinates();
  const iconCoordinate = [coordinate[0] + 75, coordinate[1] + 75];
  addIconOverlay.setPosition(iconCoordinate);
  const addIcon = addIconOverlay.getElement();
  const id = product.getId();
  addIcon.setAttribute('data-product', product.getId());
  addIcon.setAttribute('data-coor', iconCoordinate);
  addIcon.onclick = showRemoveCartIcon;
}


const hideAddCartIcon = function() {
  console.log('hi')
  addIconOverlay.setPosition(undefined);
}

const showRemoveCartIcon = function() {

  const removeIcon = document.getElementById('remove-cart-icon').cloneNode();
  //document.getElementById('remove-cart-icon');
  //const newRemoveIcon = removeIcon.cloneNode();
  removeIcon.id = 'remove-cart-icon' + '-' + this.getAttribute('data-product');
  removeIcon.setAttribute('data-product', this.getAttribute('data-product'));
  document.getElementById('pm-overlays').appendChild(removeIcon);
  console.log(this.getAttribute('data-coor'))
  const removeIconOverlay = new Overlay({
    element: removeIcon,
    position: this.getAttribute('data-coor').split(',')
  })
  map.addOverlay(removeIconOverlay);

  // const removeIcon = new Feature({
  //   geometry: new Point(),
  //   type: 'removeIcon',
  //   name: 'removeIcon',
  //   product: product.getId(),
  //   src: 'product-images/remove.png'
  // })
  // removeIcon.getGeometry().setCoordinates(iconCoordinate);
  // IconSource.addFeature(removeIcon);

}



const handleHover = function(e) {
  const features = map.getFeaturesAtPixel(e.pixel);
  const resolution = view.getResolution();

  if (features.length > 0) {
    const featureTypes = [];
    features.forEach((f) => {
      featureTypes.push(f.get('type'));
    })
    const feature = features[0];
    const featureType = feature.get('type');
    
    if ((featureType == 'product')) {
      showAddCartIcon(feature);
    } else if ( featureType != 'product' ) {
      hideAddCartIcon();
    }
  }
}


// else if (featureType == 'addIcon') {
//       const product = productsVectorSource.getFeatureById(feature.get('product'));
//       renderRemoveCartIcon(product);
//       addIcon.getGeometry().setCoordinates([]);

//     } 




const departmentsFillStyle = function(dept, resolution) {
  dataTool.innerHTML = 'zoom: ' + view.getZoom() + '<br>res: ' + view.getResolution();
  const properties = dept.getProperties();
  const fill = new Fill({ color: properties.fill });

  let style = new Style({
      fill: fill,
      text: new Text({
        text: resolution < 20 ? '' : properties.name,
        font: standardFont,
        fill: standardFontColor,
        stroke: standardFontStroke
      })
    })

  return style;
}


const subdepartmentsFillStyle = function(subdept, resolution) {
  const properties = subdept.getProperties();
  const fill = new Fill({ color: properties.fill });

  let style = new Style({
      fill: fill,
      text: new Text({
        text: resolution > 30 ? '' : properties.name,
        font: '18px sans-serif',
        fill: new Fill({ color: '#303030' }),
        stroke: new Stroke({ color: '#fff', width: 3 })
      }),
    })

  return style;
}

const circlesNoFillStyle = function(feature, resolution) {
  const properties = feature.getProperties();

  const stroke = new Stroke({ color: properties.fill, width: 2 / resolution });
  let style = new Style({
      stroke: stroke,
      fill: new Fill({ color: 'white' }),
      text: new Text({
        text: properties.name,
        font: '18px sans-serif',
        //scale: 1.25 / resolution,
        fill: new Fill({
          color: '#000'
        }),
        offsetY: resolution > 4 ? 0 : -(properties.geometry.getRadius() - 100) / resolution,
      })
    })

  return style;
}

// Only reason is to allow text along the edge of the circle 
const circlePolygonRender = function(featureCollection, colors, numberOfEdges = 128) {
  let circles = [];
  featureCollection.features.forEach(f => {
    const circle = new Feature({
      'geometry': new Polygon.fromCircle(
        new Circle(f.geometry.coordinates, f.properties.radius || 100), numberOfEdges
        ),
      'labelPoint': f.geometry.coordinates,
      'name': f.properties.name,
      'type': f.properties.type,
      'fill': colors ? colors[Math.floor(Math.random() * (colors.length -1))] : f.properties.fill
    })
    circle.setId(f.id);
    circles.push(circle);
  })
  return circles;
}




/*
* Product Circle Features (at low zoom levels)
* 
*/

const productsCirclesStyle = function(product, resolution) {
  const properties = product.getProperties();
  let style = new Style({
    fill: new Fill({
      color: properties.fill
    }),
  })
  return style;
}

const productCircles = circleFeatureRender(productData, colors);

const productsCirclesSource = new VectorSource({
       features: productCircles
});

const productsCirclesLayer = new VectorLayer({
  source: productsCirclesSource,
  style: productsCirclesStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: 5,
  opacity: 0.5
})


const productHoverBackground = new Feature({
  style: new Style({
    image: new RegularShape({
      fill: new Fill({ color: '#fff' }),
      stroke: new Stroke({ color: '#6c757d', width: 1 }),
      radius: 100 * 2,
      points: 4,
      scale: 1,
      rotation: Math.PI / 4
    }),
    zIndex: 1,
  }),
  type: 'hoverBg',
  geometry: new Point({ coordinates: [] }),
  id: 'hover-bg'
})

productsImageFeatures.push(productHoverBackground);


const removeIcon = new Style({
  image: new Icon({
    size: [24,24],
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    anchor: [-85,85],
    crossOrigin: 'anonymous',
    src: 'product-images/remove.png'
  }),
  zIndex: 100,
})

const addIcon = new Style({
  image: new Icon({
    size: [24,24],
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    anchor: [-85,85],
    crossOrigin: 'anonymous',
    src: 'product-images/add.png'
  }),
  zIndex: 100
})



// This might be useful for low resolution views where more than 1 dept or sub is visible
// const extentDepts = departmentsSource.getFeaturesInExtent(extent);
// const extentSubdepts = subdepartmentsSource.getFeaturesInExtent(extent);
// for (var i = extentDepts.length - 1; i >= 0; i--) {
//   if (extentDepts[i].getGeometry().intersectsCoordinate(ctr)) extentDepts.splice(i, 1);
// }
// for (var i = extentSubdepts.length - 1; i >= 0; i--) {
//   if (extentSubdepts[i].getGeometry().intersectsCoordinate(ctr)) extentSubdepts.splice(i, 1);
// }

// This needs to be changed to D3 histograms to get relative sizing at all resolutions
// const radiusSorter = function(f) {
//   let maxRes = 0;
//   let fontSize = '10px sans-serif';
//   const ranges = [200,400,800,1400,4310,6400];
//   // let v = f.properties.type == 'dept' ? f.properties.radius + 5000 
//   //   : f.properties.type == 'subdept' ? f.properties.radius + 2000 
//   //   : f.properties.radius;
//   let v = f.properties.radius;
//   for (let i = 0; i < ranges.length; i++) {
//     if (ranges[i] >= v) {
//       v = ranges[i];
//       break;
//     } 
//   }
//   // If radius is equal to or less than the cases below
//   switch(v) {
//     case 200:
//       maxRes = 5;
//       fontSize = '10px Baskerville';
//       break;
//     case 400:
//       maxRes = 10;
//       fontSize = '12px Baskerville';
//       break;
//     case 800:
//       maxRes = 20;
//       fontSize = '14px Baskerville';
//       break;
//     case 1400:
//       maxRes = 25;
//       fontSize = '16px Baskerville';
//       break;
//     case 4310:
//       maxRes = 55;
//       fontSize = '18px Baskerville';
//       break;
//     case 6400:
//       maxRes = 90;
//       fontSize = '18px Baskerville';
//       break;
//     default:
//       maxRes = 100;
//       fontSize = '22px Baskerville';
//       break;                 
//   }
//   return [maxRes,fontSize]
// }

// const typeSorter = function(f) {
//   let maxRes = 0;
//   let minRes = 0;
//   let fontSize = '10px sans-serif';
//   let type = f.properties.type;
//   const ranges = ['product','brand','subdept','dept'];
//   switch(type) {
//     case 'product':
//       maxRes = 5;
//       minRes = 0;
//       break;
//     case 'brand':
//       maxRes = 25;
//       minRes = 0;
//       break;
//     case 'subdept':
//       maxRes = 200;
//       minRes = 55;
//       break;
//     case 'dept':
//       maxRes = 200;
//       minRes = 90;
//       break;
//   }
//   return [maxRes,minRes]
// }


// const colorSchemes = [
//   d3Chromatic.schemeBuGn[4],
//   d3Chromatic.schemeBuPu[4],
//   d3Chromatic.schemeOrRd[4],
//   d3Chromatic.schemePuBu[4],
//   d3Chromatic.schemeYlGnBu[4],
//   d3Chromatic.schemeYlOrBr[4],
// ]


// const deptColorSchemes = {};
// const deptColors = {};
// allFeatureData.features.forEach((f, i) => {
//   if (f.properties.type === 'dept') {
//     f.properties.colorScheme =  d3Chromatic.schemeGreys[5];//colorSchemes[4];
//     deptColorSchemes[f.properties.name] = f.properties.colorScheme;
//     const color = f.properties.colorScheme[Math.floor(Math.random() * f.properties.colorScheme.length)];
//     f.properties.color = d3Color.color(color);
//     deptColors[f.properties.name] = f.properties.color;
//     f.properties.color.opacity = 0.7;
//     f.properties.hoverColor = f.properties.color.darker(0.3);
//     console.log(f.properties.name, colorSchemes.indexOf(f.properties.colorScheme));
//   }
// })
// allFeatureData.features.forEach((f, i) => {
//   if (f.properties.type === 'subdept') {
//     const parent = f.properties.parent;
//     const parentColors = deptColorSchemes[parent];
//     const parentColor = deptColors[parent];
//     const color = parentColors[Math.floor(Math.random() * parentColors.length)];
//     // const color = parentColor;
//     f.properties.color = d3Color.color(color);
//     f.properties.color.opacity = 0.3 //Math.random();
//     f.properties.hoverColor = f.properties.color.darker(0.3);
//     console.log(f.properties.name, f.properties.hoverColor);
//   }
// })
