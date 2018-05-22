import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Icon from 'ol/style/icon';
import Circle from 'ol/geom/circle';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Style from 'ol/style/style';


import {productData} from '../data/productData.js';
import {departmentsData} from '../data/departmentsData.js';
import {subdepartmentsData} from '../data/subdepartmentsData.js';
import {brandsData} from '../data/brandsData.js';
import {
  productsImageMax, 
  deptsTextMin, 
  subdeptsTextMax, 
  subdeptsFillMax, 
  subdeptsTextMin, 
  brandsTextMax, 
  brandsFillMax,
  sqrt2, 
  nameOffset, 
  priceOffset,
  colors
} from '../constants.js';
import {textFormatter, iconcache, styleCache} from '../utilities.js';
import {map} from '../index.js';



/*
* Department, Subdepartment & Brands (Subcategories) Features with Fill
* 
*/

// Do not use with already-ingested GeoJSON data -- only the actual JSON variable
const circleFeatureRender = function(featureCollection, colors = null) {
  let circles = [];
  featureCollection.features.forEach(f => {
    const circle = new Feature({
      'geometry': new Circle(f.geometry.coordinates, f.properties.radius || (100 * Math.sqrt(2))),
      'name': f.properties.name,
      'price': f.properties.price || '',
      'type': f.properties.type,
      'src': f.properties.src || ''
    })
    circle.setId(f.id);
    circles.push(circle);
  })
  return circles;
}

const standardFont = '36px sans-serif'; 
const standardFontColor = new Fill({ color: '#606060' });
const standardFontStroke = new Stroke({ color: '#fff', width: 2 });


/*
* Product Dot Feature
* 
*/

// const productsCirclesStyle = function(product, resolution) {
//   const properties = product.getProperties();
//   let style = new Style({
//     fill: new Fill({
//       color: colors[Math.floor(Math.random() * colors.length)],
//     }),
//   })
//   return style;
// }

// const productCircles = circleFeatureRender(productData, colors);

// const productsCirclesSource = new VectorSource({
//        features: productCircles
// });

// export const productsCirclesLayer = new VectorLayer({
//   source: productsCirclesSource,
//   style: productsCirclesStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   minResolution: productsImageMax,
//   maxResolution: brandsFillMax
// })


const circleFillStyle = function(feature, resolution) {
  const properties = feature.getProperties();
  let fill = '#fff';
  if (properties.hover == true && resolution > productsImageMax) {
    fill = '#DCDCDC';
  } 

  const style = new Style({
    fill: new Fill({ color: fill }),
    stroke: new Stroke({ color: '#C0C0C0', width: 2 }) 
  })
  if (resolution <= productsImageMax) {
    style.setStroke(null);
  }

  return style
}

const circleStyleRenderer = function(geo,renderState) {
  const name = renderState.feature.get('name');
  const center = renderState.feature.getGeometry().getCenter();
  const pixel = map.getPixelFromCoordinate(center);
  const radius = renderState.feature.getGeometry().getRadius();
  const src = renderState.feature.get('src') || 'default.png';
  const ctx = renderState.context;
  const res = renderState.resolution;
  const r = radius/res;
  const d = r * 2;

  const img = new Image(d,d);
  img.src = '../product-images/category-images/' + src;

  img.onload = function(e) {
    console.log('pixel',pixel,'src',img.src,'d',d)
    ctx.save();
    ctx.beginPath();
    ctx.arc(pixel[0],pixel[1], r, 0, Math.PI*2, true);
    // const pattern = ctx.createPattern(img, 'no-repeat');
    // ctx.fillStyle = pattern;
    // ctx.fill();
    ctx.closePath();
    ctx.clip();
    console.log(this)
    ctx.drawImage(this, pixel[0] - r, pixel[1] - r, d, d);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.font = standardFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, pixel[0],pixel[1]);
    //ctx.strokeText(name, pixel[0],pixel[1]);
    ctx.fill();
    ctx.closePath();

    // ctx.beginPath();
    // ctx.arc(0,0, r, 0, Math.PI*2, true);
    // ctx.closePath();
    // ctx.clip();

    ctx.restore();
   


  }
  
};
      

const circleTextStyle = function(feature, resolution) {
  const name = feature.get('name');
  const center = feature.getGeometry().getCenter();
  const src = feature.get('src');
  let style = {};

  if (src !== '') {
    style = new Style({
      renderer: circleStyleRenderer,
      geometry: new Point(center)
    })
  } else {
    style = new Style({
      text: new Text({
        text: name,
        font: standardFont,
        fill: standardFontColor,
        stroke: standardFontStroke,
      })
    })  
  }

  return style
  // }
}

const circleStyle = function(feature, resolution) {
  const props = feature.getProperties();
  const name = props.name;
  const src = props.src || '';
  const center = props.geometry.getCenter();
  const radius = props.geometry.getRadius();
  const scale = sqrt2 * radius / resolution > 256 ? 1 : (sqrt2 * radius / resolution) / 256;

  let styles = [];

  // Fill/Stroke Style
  let stroke = '#DCDCDC';
  if (props.hover == true && resolution > productsImageMax) {
    stroke = '#808080';
  }
  const fillStyle = new Style({
    fill: new Fill({ color: '#fff' }),
    stroke: new Stroke({ color: stroke, width: 2 }) 
  })
  if (resolution <= productsImageMax) {
    fillStyle.setStroke(null);
  }

  // Icon Image Style
  let iconStyle = null
  if (src != '') {

    let icon = iconcache[src];
    if (!icon) {
      icon = new Icon({
        size: [256,256],
        crossOrigin: 'anonymous',
        src: './product-images/category-images/' + src 
      });
      iconcache[src] = icon;
    }
    //icon.setScale(scale);
    
    iconStyle = new Style({
      image: icon,
      geometry: new Point(center)
    })    
  }

  // Text Style
  const textStyle = new Style({
    text: new Text({
      text: name,
      font: standardFont,
      fill: standardFontColor,
      stroke: standardFontStroke,
      scale: scale
    })
  })  

  if (iconStyle !== null) {
    styles = [
      fillStyle,
      iconStyle
    ]    
  } else {
    styles = [
      fillStyle,
      textStyle
    ]
  }

  return styles
}
/* Departments */

const departments = circleFeatureRender(departmentsData, colors);

export const departmentsSource = new VectorSource({
       features: departments
});

export const departmentsFillLayer = new VectorLayer({
  source: departmentsSource,
  style: circleFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})



export const departmentsTextLayer = new VectorLayer({
  source: departmentsSource,
  style: circleTextStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: deptsTextMin
})

/* Subdepartments */

const subdepartments = circleFeatureRender(subdepartmentsData, colors);

export const subdepartmentsSource = new VectorSource({
       features: subdepartments
});

export const subdepartmentsFillLayer = new VectorLayer({
  source: subdepartmentsSource,
  style: circleFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: subdeptsFillMax
})

export const subdepartmentsTextLayer = new VectorLayer({
  source: subdepartmentsSource,
  style: circleTextStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: subdeptsTextMax,
  minResolution: subdeptsTextMin
})

/*
*  Brands 
* 
*/

const brands = circleFeatureRender(brandsData, colors);

const brandsSource = new VectorSource({
  features: brands
})

export const brandsFillLayer = new VectorLayer({
  source: brandsSource,
  style: circleFillStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: brandsFillMax
})

export const brandsTextLayer = new VectorLayer({
  source: brandsSource,
  style: circleTextStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  maxResolution: 10
})

