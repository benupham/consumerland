import Control from "ol/control/control"
import Overlay from "ol/overlay"

import { map, view } from "../index.js"
import { textFormatter, debounce, dataTool } from "../utilities.js"
import { circleColors, labelColors } from "../constants.js"

let previewedFeature = null

export const updatePreview = function (e) {
  const features = map.getFeaturesAtPixel(e.pixel)
  if (features === null) {
    hidePreview()
    previewedFeature = null
    return
  }

  const f = features[0]
  if (previewedFeature === f) return
  if (f.get("style") === "tag") return
  if (["product", "brand"].includes(f.get("type")) && view.getResolution() <= 2) {
    hidePreview()
    previewedFeature = null
    return
  }

  // console.log(f.get('type') === ('product' || 'brand'))

  previewedFeature = f

  let previewName = document.getElementById("preview-name")
  let previewPrice = document.getElementById("preview-price")
  let previewImage = document.getElementById("preview-image")
  let previewInfo = document.getElementById("preview-productinfo")
  previewName.innerHTML = previewPrice.innerHTML = previewImage.style.backgroundColor = ""

  const type = f.get("type")

  if (type === "product" && f.get("style") === "image") {
    previewName.innerHTML = "<strong>" + textFormatter(f.get("name"), 40, "<br>", 75) + "</strong>"
    previewPrice.innerHTML = f.get("price")
    previewImage.style.backgroundImage = "url('" + f.get("src") + "')"
  } else {
    previewName.innerHTML =
      '<h6 class="mt-1" style="color:' +
      labelColors[f.get("type")] +
      ';">' +
      textFormatter(f.get("name"), 40, "<br>", 75) +
      "</h6>"
    previewImage.style.backgroundImage = "url('" + f.get("src") + "')"
  }
  positionPreview(e)
}

const positionPreview = function (e) {
  const previewCard = document.getElementById("product-preview")

  const clientX = e.pointerEvent.clientX
  const clientY = e.pointerEvent.clientY
  const offset = 15

  previewCard.style.top = clientY + offset + "px"
  previewCard.style.left = clientX + offset + "px"
}

export const hidePreview = function () {
  document.getElementById("product-preview").style.left = "-9999px"
}
