import Control from 'ol/control/control';

export const search = new Control({
  element: document.getElementById('search-overlay'),
});


const searchForm = document.getElementById('search');

const handleSearch = function(e) {
  e.preventDefault();
  const query = searchForm.elements[0].value;
  if (query != '') {
    try {
      console.log('query',query);
      let products = productData.features;
      let match = matchSorter(products, query, {keys: ['properties.name'] })
      console.log('match',match[0].id);
      const feature = productsVectorLayer.getSource().getFeatureById(match[0].id); 
      map.getView().animate({
        center: feature.getGeometry().getCoordinates(),
        zoom: 5
      })
    }
    catch(err) {
      console.log(query +' not found');
    }
  }
} 
searchForm.addEventListener('submit', handleSearch);

