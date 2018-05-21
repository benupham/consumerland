import IconCache from 'ol/style/iconImageCache';

/*
* Utilities
* 
*/

export const iconcache = new IconCache();

export const styleCache = {};

export function textFormatter(str, width, spaceReplacer, maxLength = null) {
  if (maxLength !== null) {
    str = str.length > maxLength ? str.substr(0, maxLength - 1) + '...' : str.substr(0);
  }
  if (str.length > width) {
    var p = width;
    while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
      p--;
    }
    if (p > 0) {
      var left;
      if (str.substring(p, p + 1) == '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      var right = str.substring(p + 1);
      return left + spaceReplacer + textFormatter(right, width, spaceReplacer, maxLength);
    }
  }
 
  return str;    
}

export const dataTool = document.querySelector('#data-tool');
