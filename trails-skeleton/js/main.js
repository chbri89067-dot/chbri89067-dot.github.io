let data, scatterplot, barchart;

const dispatcher = d3.dispatch('filterCategories');

d3.csv('data/vancouver_trails.csv')
  .then(_data => {
    data = _data;

    data.forEach(d => {
      d.time = +d.time;
      d.distance = +d.distance;
    });

    const colorScale = d3.scaleOrdinal()
      .domain(['Easy', 'Intermediate', 'Difficult'])
      .range(['#b5cfb7', '#73a876', '#2d6a30']);

    scatterplot = new Scatterplot({ parentElement: '#scatterplot', colorScale: colorScale }, data);
    scatterplot.updateVis();

    barchart = new Barchart({ parentElement: '#barchart', colorScale: colorScale }, dispatcher, data);
    barchart.updateVis();
  })
  .catch(error => console.error(error));

dispatcher.on('filterCategories', selectedCategories => {
  if (selectedCategories.length == 0) {
    scatterplot.data = data;
  } else {
    scatterplot.data = data.filter(d => selectedCategories.includes(d.difficulty));
  }
  scatterplot.updateVis();
});
