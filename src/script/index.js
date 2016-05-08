var Handlebars = require('handlebars');
var keywordTemplateText = require('../template/keyword.html');
var brandTemplateText = require('../template/brand.html');
var recommendedTemplateText = require('../template/recommended.html');
var menuTemplateText = require('../template/menu.html');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('I5YMQQ8937', '50fa2c1a43ffa2fff2d98c02e6a7a30f');
var products = client.initIndex('best-buy');

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
      keyword: response.results[0],
      brand: response.results[1],
      recommended: response.results[2]
   });
}

function handleInput() {
   var queries;
   if (this.value.length) {
      queries = [{
         indexName: 'best-buy',
         query: this.value,
         params: {
            hitsPerPage: 6
         }
      }, {
         indexName: 'best-buy-brand',
         query: this.value,
         params: {
            hitsPerPage: 6
         }
      }, {
         indexName: 'best-buy',
         query: this.value,
         params: {
            hitsPerPage: 4
         }
      }];

      client.search(queries)
         .then(resultsCallback)
         .catch();
   } else {
      hideAutocomplete();
   }
}
