// fxn for all of code to be responsive to window size
function make_responsive() {
    // pull width of parent container
    var svgWidth = document.getElementById('chartArea').clientWidth;
    var svgHeight = svgWidth / 1.5;

    // clear SVG area if it isn't empty
    var svgArea = d3.select("#scatter").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // determine SVG wrapper dimensions & margins
    // var svgWidth = 900;
    // var svgHeight = 600;
    
    var margin = {
      top: 50,
      bottom: 50,
      right: 100,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // append group element to SVG element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // read CSV
    d3.csv("assets/data/data.csv").then((data) => {
  
        // parse data
        data.forEach((d) => {
          d.poverty = +d.poverty;
          d.healthcare = +d.healthcare;
        });
  
        // create scales
        var xScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.poverty))
          .range([0, width]);

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.healthcare)])
          .range([height, 0]);
  
        // create axes
        var xAxis = d3.axisBottom(xScale).ticks(6);
        var yAxis = d3.axisLeft(yScale).ticks(6);
  
        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
  
        chartGroup.append("g")
          .call(yAxis);
  
        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xScale(d.poverty))
          .attr("cy", d => yScale(d.healthcare))
          .attr("r", "10")
          .attr("fill", "gold")
          .attr("stroke-width", "1")
          .attr("stroke", "black");
  
        // create tooltip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html((d) => (`poverty: ${d.poverty}<hr>healthcare: ${d.healthcare}`));
  
        chartGroup.call(toolTip);
  
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
        })
          .on("mouseout", function(d) {
            toolTip.hide(d);
          });

        }).catch(function(error) {
        console.log(error);

      });
  }
  
  // initialize page
  make_responsive();
  
  // change dimensions of SVG when window is resized
  d3.select(window).on("resize", make_responsive);
  