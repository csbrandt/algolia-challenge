var Handlebars = require('handlebars');
var keywordTemplateText = require('../template/keyword.html');
var brandTemplateText = require('../template/brand.html');
var recommendedTemplateText = require('../template/recommended.html');
var menuTemplateText = require('../template/menu.html');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('I5YMQQ8937', '50fa2c1a43ffa2fff2d98c02e6a7a30f');

Handlebars.registerPartial('keyword', keywordTemplateText);
Handlebars.registerPartial('brand', brandTemplateText);
Handlebars.registerPartial('recommended', recommendedTemplateText);

var menuTemplate = Handlebars.compile(menuTemplateText);
var dropdownMenu = document.body.querySelectorAll('.dropdown-menu')[0];

document.body.querySelectorAll('#search')[0].addEventListener('input', handleInput, true);

function showAutocomplete() {
   dropdownMenu.classList.remove('hide-all');
   dropdownMenu.classList.add('show-all');
}

function hideAutocomplete() {
   dropdownMenu.classList.remove('show-all');
   dropdownMenu.classList.add('hide-all');
}

function resultsCallback(response) {
   showAutocomplete();
   dropdownMenu.innerHTML = menuTemplate({
      keyword: filterUniqueCategories(response.results[0].hits, 8),
      brand: response.results[1],
      recommended: {hits: response.results[0].hits.splice(0, 4)}
   });
}

function filterUniqueCategories(hits, amount) {
   var uniqueCategories = [];
   var categories = hits.map(function(hit) {
      return hit._highlightResult.categories.map(function(category) {
         return category.value;
      });
   });

   uniqueCategories = Array.prototype.concat.apply([], categories).filter(function(category, index, self) {
      return self.indexOf(category) === index;
   });

   return {
      hits: uniqueCategories.map(function(category) {
         return {
            _highlightResult: {
               categories: {
                  value: category
               }
            }
         }
      }).slice(0, amount)
   };
}

function handleInput() {
   var queries;
   if (this.value.length) {
      queries = [{
         indexName: 'best-buy',
         query: this.value,
         params: {
            hitsPerPage: 6,
            attributesToRetrieve: 'name,url,image',
            attributesToHighlight: 'categories,name'
         }
      }, {
         indexName: 'best-buy-brand',
         query: this.value,
         params: {
            hitsPerPage: 6
         }
      }];

      client.search(queries)
         .then(resultsCallback)
         .catch();
   } else {
      hideAutocomplete();
   }
}
