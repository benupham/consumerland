import Feature from "ol/feature"
import Circle from "ol/geom/circle"
import Fill from "ol/style/fill"
import Style from "ol/style/style"

import { imagesDir, circleColors, circleHoverColors, deptColors } from "../constants.js"
import { view } from "../index.js"

/*
 * Circle Features
 *
 */

// Rendering Function
export const circleFeatureRender = function (featureSets, type = "all") {
  const circles = []
  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
      if (f.properties.type == type || type == "all") {
        const type = f.properties.type
        const color = circleColors[type] ? circleColors[type] : undefined
        const hoverColor = circleHoverColors[type]
        const circle = new Feature({
          geometry: new Circle(f.geometry.coordinates, f.properties.radius || 100 * Math.sqrt(2)),
          name: f.properties.name,
          fid: f.id,
          type: type,
          style: "circle",
          color: color || deptColors[f.properties.dept] || deptColors[f.id],
          radius: f.properties.radius,
          hover: false,
          hoverColor: hoverColor,
          src: imagesDir + (f.properties.sampleImg || f.properties.src),
          children: f.properties.value || "",
          maxRes: f.properties.maxRes
        })
        circle.setId(f.id + "-circle")
        circles.push(circle)
      }
    })
  })
  return circles
}

const circleStyleCache = {}
const circleStyleHoverCache = {}

// Style Function
export const circleStyle = function (circle, res) {
  if (circle.get("maxRes") < view.getResolution()) return null
  const hover = circle.get("hover")
  let style =
    hover === false ? circleStyleCache[circle.getId()] : circleStyleHoverCache[circle.getId()]
  if (!style && hover === false) {
    style = new Style({
      fill: new Fill({ color: circle.get("color") })
    })
    circleStyleCache[circle.getId()] = style
  } else if (!style && hover === true) {
    style = new Style({
      fill: new Fill({ color: circle.get("hoverColor") })
    })
    circleStyleHoverCache[circle.getId()] = style
  }
  return style
}
