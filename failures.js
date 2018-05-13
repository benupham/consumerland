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


else if (featureType == 'addIcon') {
      const product = productsVectorSource.getFeatureById(feature.get('product'));
      renderRemoveCartIcon(product);
      addIcon.getGeometry().setCoordinates([]);

    } 




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
