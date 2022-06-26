import Feature from "ol/feature"
import Point from "ol/geom/point"
import Icon from "ol/style/icon"
import Stroke from "ol/style/stroke"
import Fill from "ol/style/fill"
import Text from "ol/style/text"
import Style from "ol/style/style"

import {
  imagesDir,
  fontFamily,
  fontWeight,
  labelColors,
  labelStrokes,
  labelStrokeWidth,
  productLabelFontSize
} from "../constants.js"
import { textFormatter } from "../utilities.js"

// Product Image Feature

export const productImageFeatureRender = function (featureSets, type = "product") {
  const images = []

  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
      const src = imagesDir + f.properties.src
      const image = new Feature({
        geometry: new Point(f.geometry.coordinates),
        name: f.properties.name,
        fid: f.id,
        price: f.properties.price || "",
        type: f.properties.type,
        style: "image",
        src: src
      })
      image.setId(f.id + "-image")
      if (f.properties.sprite200Src && f.properties.spriteCoord) {
        image.set("sprite200Src", imagesDir + f.properties.sprite200Src)
        image.set("spriteCoord", f.properties.spriteCoord)
      }
      images.push(image)
    })
  })
  return images
}

// Product Image Style
const productImageStyleCache = {}
const productImageIconCache = {}
const productSpriteIconCache = {}

export const productImageStyle = function (image, res) {
  let imagesrc = image.get("src")
  let style = productImageStyleCache[imagesrc]

  if (!style) {
    let spriteicon = productSpriteIconCache[imagesrc]
    let imageicon = productImageIconCache[imagesrc]
    if (!spriteicon) {
      let offset = image.get("spriteCoord") != undefined ? image.get("spriteCoord") : [0, 0]
      offset = [offset[0] * 0.5, offset[1] * 0.5]
      let spritesrc = image.get("sprite200Src") != undefined ? image.get("sprite200Src") : imagesrc
      spriteicon = new Icon({
        src: spritesrc + "-scaled50-compressed.jpg",
        size: [99, 99],
        offset: offset
        // crossOrigin: 'anonymous'
      })
      productSpriteIconCache[imagesrc] = spriteicon
    }

    if (!imageicon) {
      imageicon = new Icon({
        src: imagesrc,
        size: [199, 199]
        // crossOrigin: 'anonymous'
      })
      productImageIconCache[imagesrc] = imageicon
    }

    style = new Style()
  }
  if (imagesrc.includes("missing-item")) {
    style.setImage(productImageIconCache[imagesrc])
    style.getImage().setScale(1 / res)
  } else if (res >= 2) {
    style.setImage(productSpriteIconCache[imagesrc])
    style.getImage().setScale(2 / res)
  } else {
    style.setImage(productImageIconCache[imagesrc])
    style.getImage().setScale(1 / res)
  }

  return style
}

export const productLabelFeatureRender = function (featureSets, type = "product") {
  const labels = []

  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
      const label = new Feature({
        geometry: new Point(f.geometry.coordinates),
        name: textFormatter(f.properties.name, 28, "\n", 55),
        fid: f.id,
        price: f.properties.price || "",
        type: f.properties.type,
        style: "label"
      })
      label.setId(f.id + "-label")
      labels.push(label)
    })
  })
  return labels
}

const productLabelStyleCache = {}

export const productLabelStyle = function (label, res) {
  let style = productLabelStyleCache[label.getId()]

  if (!style) {
    const productText = label.get("name") + "\n" + label.get("price")

    style = new Style({
      text: new Text({
        font:
          fontWeight["product"] + " " + productLabelFontSize + "px" + " " + fontFamily["product"],
        text: productText,
        textBaseline: "top",
        textAlign: "center",
        offsetY: 120,
        fill: new Fill({ color: labelColors["product"] }),
        stroke: new Stroke({ color: labelStrokes["product"], width: labelStrokeWidth["product"] })
        // backgroundFill: new Fill({color: backgroundFillColor}),
        // padding: [0,3,0,3]
      })
    })
    productLabelStyleCache[label.getId()] = style
  }
  style.getText().setOffsetY(120 / res)
  style
    .getText()
    .setFont(
      fontWeight["product"] + " " + productLabelFontSize / res + "px" + " " + fontFamily["product"]
    )
  return style
}
