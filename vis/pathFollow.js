queue()
.defer(d3.xml, "pc.svg", "image/svg+xml")
.await(ready);

function ready(error, xml) {

  //Adding our svg file to HTML document
  var importedNode = document.importNode(xml.documentElement, true);
  d3.select("#pathAnimation").node().appendChild(importedNode);

  // Change here´
  var svg = d3.select("svg");




  d3.csv("paths.csv", function(data) {
    
    var elems = {};
    for (var i = 0; i < data.length; i++)
      {
          elems[data[i].variant] = data[i].paths.split(",");
      };

    var keys = [];
    for(var k in elems) keys.push(k);


    
    // Add variants button returning the variant name
    var selButtons = d3.select("body")
      .selectAll("input")
      .data(keys)
      .enter().append("input")
      .attr("type","button")
      .attr("class","button")
      .attr("value", function (d){return d;} );


    selButtons.on(
      "click", function(d) {

        var callList = [];
        for(var f in elems[d]) callList.push([d,parseInt(f)]);

   
        callList.map(slidefunc);

          /*
         setInterval(function(){

          for(var f in elems[d]) {
            slidefunc(d,f);
            clearInterval();
          }

         }, 600);
         */



        });



    //put multiple markers with delay
    //slideMarker("variant0",0);

    

    var slidefunc = function slideMarker(variant, i){

      
      var f = elems[variant[0]][i];
      debugger;

      var edge = svg.selectAll("g.edge").filter(function(d) { return d3.select(this).select("title").text() === f; });
      
      var path = edge.select("path");
      startPoint = pathStartPoint(path);


      var marker = svg.append("circle");
      marker.attr("r", 5)
        .attr("transform", "scale(1 0.93) translate(" + (parseFloat(startPoint[0]*0.875)) + "," + (parseFloat(startPoint[1]*0.95)+545) + ")"); //<-------- HERE IS THE ISSUE: WRONG PIXELS WHICH I GET FROM pc.svg <path/>

      transition(marker,path);
      
      
    };


    function deleteMarker(){
      var marker = d3.select("svg circle");
      marker.remove();
    }
    
    //Get path start point for placing marker
    function pathStartPoint(path) {
      var d = path.attr("d");
      var d = d.replace("M","m ");
      var d = d.replace("C"," c ");
      dsplitted = d.split(" ");
      return dsplitted[1].split(",");
    }

    function transition(marker,path) {
      marker.transition()
          .duration(3000)
          .attrTween("transform", translateAlong(path.node()))
          .each("end", deleteMarker);// infinite loop
    }
    
    function translateAlong(path) {
      var l = path.getTotalLength();
      return function(i) {
        return function(t) {
          var p = path.getPointAtLength(t * l);
      
          return "scale(1 0.93) translate(" + (p.x*0.875)+ "," + (p.y*0.95+545) + ")"; //<-------- HERE IS THE ISSUE: WRONG PIXELS WHICH I GET FROM: pc.svg <path/>
        }
      }
    }
  });
}