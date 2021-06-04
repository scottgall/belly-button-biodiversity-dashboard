
let dropdown = d3.select('#selDataset');
let meta = d3.select('#sample-metadata');
let data = {};


(async function() {
  try {
    const json = await d3.json("samples.json");
    saveData(json);
    addOptions();
    init();
  } catch(error) {
    console.log(error);
  }
})();



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

function getBarData() {
  const subject = dropdown.property('value');
  const found = data.samples.find(obj => obj.id == subject);
  const x = found.sample_values.slice(0,10).reverse();
  const y = found.otu_ids.slice(0,10).map(num => `OTU ${num}`).reverse();
  const labels = found.otu_labels.slice(0,10).reverse();
  return { x, y, labels };
}

function createBar() {
  const plotData = getBarData();
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

function updateBar() {
  const plotData = getBarData();
  Plotly.restyle('bar', 'x', [plotData.x]);
  Plotly.restyle('bar', 'y', [plotData.y]);
  Plotly.restyle('bar', 'text', [plotData.labels]);
  
}

function getBubbleData() {
  const subject = dropdown.property('value');
  const found = data.samples.find(obj => obj.id == subject);
  const x = found.otu_ids;
  const y = found.sample_values;
  const labels = found.otu_labels;
  return { x, y, labels };
}

function createBubble() {
  const plotData = getBubbleData();
  const data = [{
    x: plotData.x,
    y: plotData.y,
    text: plotData.labels,
    mode: 'markers',
    marker: {
      color: plotData.x,
      size: plotData.y
    }
  }];
  const layout = {
    title: {
      text: 'Bacteria Cultures Per Sample'
    },
    xaxis: {
      title: {
        text: 'OTU ID'
      }
    }
  }
  Plotly.newPlot('bubble', data, layout);
}

function updateBubble () {
  const plotData = getBubbleData();
  Plotly.restyle('bubble', 'x', [plotData.x]);
  Plotly.restyle('bubble', 'y', [plotData.y]);
  Plotly.restyle('bubble', 'text', [plotData.labels]);
  Plotly.restyle('bubble', 'marker.color', [plotData.x]);
  Plotly.restyle('bubble', 'marker.size', [plotData.y]);
}


function addOptions() {
  data.names.forEach(subject => {
    dropdown.append('option').text(subject).property('value', subject);
  });
}

function saveData(json) {
  data = json;
}

function optionChanged() {
  updateMeta();
  updateBar();
  updateBubble();
}

function init() {
  updateMeta();
  createBar();
  createBubble();
}