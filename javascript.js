let data;
let url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

//GET json from url using fetch
async function getData(Url) {
  const fetchRes = await fetch(Url);
  const fetchResData = await fetchRes.json();
  
  return fetchResData;
}

//Get data and use it to make scatter plot graph
getData(url).then(val => {
  data = val;
  
  const colors = {
      "2600": "gold",
      "Wii": "salmon",
      "NES": "pink",
      "GB": "thistle",
      "DS": "mediumorchid",
      "X360": "limegreen",
      "PS3": "cornflowerblue",
      "PS2": "powderblue",
      "SNES": "palevioletred",
      "GBA": "plum",
      "PS4": "royalblue",
      "3DS": "mediumpurple",
      "N64": "darksalmon",
      "PS": "lightskyblue",
      "XB": "lightgreen",
      "PC": "darkgray",
      "PSP": "lightsteelblue",
      "XOne": "forestgreen"
    }
  
  const w = 1000;
  const h = 1000;
  const padding = 70;
  
  const root = d3.hierarchy(data)
      .eachBefore(d => {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; 
      })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  
    const treemap = d3.treemap()
    .size([w, h])
    .paddingInner(1);
  
    treemap(root);

  //Tooltip
  const tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip');
  
  //SVG canvas
  const svg = d3.select('#chart')
                .append('svg')
                .attr('width', w)
                .attr('height', h);
  
  //Rect
  svg.selectAll("rect")
     .data(root.leaves())
     .enter()
     .append("rect")
     .attr('x', d => d.x0)
     .attr('y', d => d.y0)
     .attr('width', d => d.x1 - d.x0)
     .attr('height', d => d.y1 - d.y0)
     .attr('class', 'tile')
     .attr('fill', d => colors[d.data.category])
     .attr('data-name', d => d.data.name)
     .attr('data-category', d => d.data.category)
     .attr('data-value', d => d.data.value)
     .on('mouseover', d => {
       tooltip.style("left", d3.event.pageX + 20 + "px")
              .style("top", d3.event.pageY - 30 + "px")
              .style("display", "inline-block")
              .style('opacity', 1)
             .html(`Game: ${d.data.name}<br>Platform: ${d.data.category}<br>Sales: €${d.data.value} Million`)
             .attr('data-value', d.data.value);
     })
     .on('mouseout', d => {
       tooltip.style('opacity', 0)
              .style('display', 'none');
     });
  
  //Text labels
  svg.selectAll("text")
     .data(root.leaves())
     .enter()
     .append("text")
     .selectAll('tspan')
     .data(d => {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g) // split the name of game
              .map(v => {
                  return {
                      text: v,
                      x0: d.x0,                        // keep x0 reference
                      y0: d.y0                         // keep y0 reference
                  }
              });
      })
      .enter()
      .append('tspan')
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
      .text((d) => d.text)
      .attr('class', 'text');
  
  //Legend
  const categories = data.children.map(val => {
    return val.name;
  });
  
  const legendSvg = d3.select("body")
                      .append("svg")
                      .attr("id", "legend")
                      .attr("width", w)
                      .attr("height", 300);

  legendSvg.selectAll("rect")
	    .data(categories)
	    .enter()
	    .append("rect")
	    .attr("x", (d, i) => {
        const xOffset = parseInt(i / 5);
        return (xOffset * 150);
      })
      .attr("y", (d, i) => (i % 5) * 40)
	    .attr("height", 20)
	    .attr("width", 20)
	    .attr("fill", d => colors[d])
      .attr("class", "legend-item")
      .attr("stroke", "gray");

  legendSvg.selectAll("text")
           .data(categories)
           .enter()
           .append("text")
           .attr("x", (d, i) => {
              const xOffset = parseInt(i / 5);
              return (xOffset * 150) + 40;
           })
           .attr("y", (d, i) => {    
              return ((i % 5) * 40) + 16;
           })
           .text(d => d);
});