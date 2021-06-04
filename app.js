
let dropdown = d3.select('#selDataset');
let meta = d3.select('#sample-metadata');
let data = {};


(async function() {
  try {
    const json = await d3.json("samples.json");
    let subjects = json.names;
    saveData(json);
    addOptions();
    init();
  } catch(error) {
    console.log(error);
  }
})();


function saveData(json) {
  data = json;
}

function optionChanged() {
  updateMeta();
  updatePlot();
}

function updateMeta() {
  const subject = dropdown.property('value');
  const found = data.metadata.find(obj => obj.id == subject);
  const metadata = {
    id: found.id,
    ethnicity: found.ethnicity,
    gender: found.gender,
    age: found.age,
    location: found.location,
    bbtype: found.bbtype,
    wfreq: found.wfreq
  }
  meta.text('');
  for(const [key, value] of Object.entries(metadata)) {
    meta.append('div').text(`${key}: ${value}`)
  }
}

function createPlot() {
  const plotData = getPlotData();
  const data = [{
    type: 'bar',
    x: plotData.x,
    y: plotData.y,
    text: plotData.labels,
    orientation: 'h'
  }]
  const layout = {
    title: {
      text: 'Top 10 Bacteria Cultures Found'
    }
  }
  Plotly.newPlot('bar', data, layout);
}

function updatePlot() {
  const plotData = getPlotData();
  Plotly.restyle('bar', 'x', [plotData.x]);
  Plotly.restyle('bar', 'y', [plotData.y]);
  Plotly.restyle('bar', 'text', [plotData.labels]);
  
}

function getPlotData() {
  const subject = dropdown.property('value');
  const found = data.samples.find(obj => obj.id == subject);
  const x = found.sample_values.slice(0,10).reverse();
  const y = found.otu_ids.slice(0,10).map(num => `OTU ${num}`).reverse();
  const labels = found.otu_labels.slice(0,10).reverse();
  return { x, y, labels };
}

function addOptions() {
  data.names.forEach(subject => {
    dropdown.append('option').text(subject).property('value', subject);
  });
}

function init() {
  updateMeta();
  createPlot();
}