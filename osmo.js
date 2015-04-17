var osmosis = require('osmosis');

osmosis
.get('www.craigslist.org/about/sites')
.find('h1 + div a')
.set('location')
.follow('@href')
.find('header + div + div li > a')
.set('category')
.follow('@href')
.find('p > a', '.totallink + a.button.next:first')
.follow('@href')
.set({
    'title':        'section > h2',
    'description':  '#postingbody',
    'subcategory':  'div.breadbox > span[4]',
    'date':         'time@datetime',
    'latitude':     '#map@data-latitude',
    'longitude':    '#map@data-longitude',
    'images[]':     'img@src'
})
.data(function(listing) {
    console.log(listing);
})
