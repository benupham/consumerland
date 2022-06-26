import IconCache from "ol/style/iconImageCache"
import { productsCircleMax, productsImageMax, productsLabelMax } from "./constants.js"

import { view } from "./index.js"

/*
 * Utilities
 *
 */

//https://cofr6smqq6.execute-api.us-west-1.amazonaws.com/production

// Call to the Express server for locally saved JSON feature data
export const getFeatureJson = function (types, requester = "") {
  if (typeof types === "string") types = [types]
  const q = types.join(",")
  return fetch(
    "https://cofr6smqq6.execute-api.us-west-1.amazonaws.com/production/api?type=" +
      q +
      "&requester=" +
      requester
  )
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const areProductsVisible = function () {
  const resolution = view.getResolution()
  if (
    resolution > productsImageMax &&
    resolution > productsLabelMax &&
    resolution > productsCircleMax
  )
    return false

  return true
}

export const getProductsInExtent = function () {
  if (areProductsVisible() === false) return []

  const extent = view.calculateExtent()
  return fetch(
    `https://cofr6smqq6.execute-api.us-west-1.amazonaws.com/production/products?minx=${extent[0]}&miny=${extent[1]}&maxx=${extent[2]}&maxy=${extent[3]}`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const getOmniboxList = function (fid = 0) {
  console.log(`omnibox request ${fid}`)
  return fetch(
    `https://cofr6smqq6.execute-api.us-west-1.amazonaws.com/production/omnibox?fid=${fid}`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const iconcache = new IconCache()

export const styleCache = {}

export function textFormatter(str, width, spaceReplacer, maxLength = null) {
  if (maxLength !== null) {
    str = str.length > maxLength ? str.substr(0, maxLength - 1) + "..." : str.substr(0)
  }
  if (str.length > width) {
    var p = width
    while (p > 0 && str[p] != " " && str[p] != "-") {
      p--
    }
    if (p > 0) {
      var left
      if (str.substring(p, p + 1) == "-") {
        left = str.substring(0, p + 1)
      } else {
        left = str.substring(0, p)
      }
      var right = str.substring(p + 1)
      return left + spaceReplacer + textFormatter(right, width, spaceReplacer, maxLength)
    }
  }

  return str
}

export const debounce = (fn, time) => {
  let timeout

  return function () {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

export const dataTool = document.querySelector("#data-tool")

export const flyTo = function (location, done) {
  var duration = 2000
  var zoom = view.getZoom()
  var parts = 2
  var called = false
  function callback(complete) {
    --parts
    if (called) {
      return
    }
    if (parts === 0 || !complete) {
      called = true
      done(complete)
    }
  }
  view.animate(
    {
      center: location,
      duration: duration
    },
    callback
  )
  view.animate(
    {
      zoom: zoom - 1,
      duration: duration / 2
    },
    {
      zoom: zoom,
      duration: duration / 2
    },
    callback
  )
}

// convert name to filename ready string (or variable name)
export const cleanName = function (name) {
  const newname = name
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+(?=[a-z0-9])/g, "-")

  return newname
}
