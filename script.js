/*eslint no-undef:0, quotes: 0, global-strict: 0, no-console: 0*/


/*

  hi.
  hypothetically you want to do this with your own data. getting the charts is pretty easy. but the device info matching is tougher

  ## histogram chart of viewports

  this requires a little bit of google analytics hacking and mostly google sheets action.

  google analytics: you go to the Viewport report, add "Mobile Device Info" as a secondary dimension and get an export of all the data.
  dump into google sheets. add columns to split the viewport into width and height columns. then fix up the non-portrait tablet dimensions

  then you pivot table that shit:
  * row: viewport width.
  * value: sum of session traffic

  now create chart, histogram, tweak.

  you should have something that provides a fair amount of insight already!


  ## device info lookup

  make a new pivot table off the initial dump
  * row: viewport width.
  * row: mobile device info.
  * value: sum of session traffic

  this will be your lookup guy.
  I used sheetsee.js for the display of the google sheet data. If you want that you'll need to clean up the data from this pivot report.
  make sure there's a viewport width next to every device entry. probably want to massage the display of the percentage value. I'll leave that to you.


  <3z

*/


"use strict";

$('button').on('click', function(){
  $('iframe').each(function(i, el){
    el.style.pointerEvents = "none";
  });

  $('#description')[0].hidden = true;
  $('button')[0].hidden = true;
  document.querySelector('#fullTable').removeAttribute('hidden');
});




$(document).on('mousemove', function(e){

  var offsetX = e.offsetX;

  if (offsetX < 73 || offsetX > 840) return;


  // offsets: 73  to 837      // mousemove offsetX value of left edge of chart to right edge
  // actuals : 280 to 960     // left and right edge values of the actual chart.

  // slope = (y2 - y1)/(x2 - x1)

  var viewportX = (offsetX - 73) * ( 960 - 280 ) / (837 - 73 ) + 280;

  var regexRange = [];
  viewportX = Math.floor(viewportX - 2);
  for (var i = 5; i; i--){
    regexRange.push('(' + (viewportX++) + ')');
  }
  regexRange = regexRange.join('"|"');


//  console.log('mouse', offsetX, 'calculated', viewportX, 'regexRange', regexRange);

  // extra quotes are intentional to trick the regex
  $('#fullTableFilter').val('"' + regexRange + '"').keyup();
  document.querySelector('#fullTable').style.visibility = "visible";

});





document.addEventListener('DOMContentLoaded', function() {

  var URL = "1YY2_nKgSyizOF066zeukJazqAFRJu8bI28rulogiAEo";

  Tabletop.init(
    { key: URL, simpleSheet: false, wanted : ["Sheet2"] , simple_url : true,

      callback: function(data) {

        var tableOptions = {"data": data.Sheet2.elements, "pagination": 30,
                            "tableDiv": "#fullTable", "filterDiv": "#fullTableFilter"};
        Sheetsee.makeTable(tableOptions);
        Sheetsee.initiateTableFilter(tableOptions);
      }

    });


});
