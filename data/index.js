var fs = require('fs');
var _ = require('lodash');

var products = JSON.parse(fs.readFileSync(__dirname + '/data.json'));
products = _.sampleSize(products, 7000);

fs.writeFileSync(__dirname + '/product.json', JSON.stringify(products));

var brands = _.map(_.uniq(_.map(products, 'brand')), function(brand) {
   return {
      brand: brand
   }
});

var categories = _.map(_.uniq(_.map(products, 'brand')), function(brand) {
   return {
      brand: brand
   }
});

fs.writeFileSync(__dirname + '/brand.json', JSON.stringify(brands));
