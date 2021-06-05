
let dropdown = d3.select('#selDataset');
let meta = d3.select('#sample-metadata');
let data = {};


(async function() {
  try {
    const json = await d3.json("samples.json");
    saveData(json);
    addOptions(json.names);
    const subject = dropdown.property('value');
    init(subject);
  } catch(error) {
    console.log(error);
  }
})();



function updateMeta(subject) {
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

function getBarData(subject) {
  const found = data.samples.find(obj => obj.id == subject);
  const x = found.sample_values.slice(0,10).reverse();
  const y = found.otu_ids.slice(0,10).map(num => `OTU ${num}`).reverse();
  const labels = found.otu_labels.slice(0,10).reverse();
  return { x, y, labels };
}

function createBar(subject) {
  const plotData = getBarData(subject);
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

function updateBar(subject) {
  const plotData = getBarData(subject);
  Plotly.restyle('bar', 'x', [plotData.x]);
  Plotly.restyle('bar', 'y', [plotData.y]);
  Plotly.restyle('bar', 'text', [plotData.labels]);
  
}

function getGaugeData(subject) {
  return data.metadata.find(obj => obj.id == subject).wfreq;
}

function createGauge(subject) {
  const washFreq = getGaugeData(subject);
  const data = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: washFreq,
    title: { text: "Belly Button Washing Frequency" },
    xaxis: { title: { text: "poop" } },
    type: "indicator",
    mode: "gauge"
  }]
  const layout = {
    xaxis: {
      title: {
        text: 'poop'
      }
    },
    yaxis: {
      title: {
        text: 'poop'
      }
    }
  }
  Plotly.newPlot('gauge', data, layout);
}

function updateGauge(subject) {
  const washFreq = getGaugeData(subject);
  Plotly.restyle('gauge', 'value', [washFreq]);
}

function getBubbleData(subject) {
  const found = data.samples.find(obj => obj.id == subject);
  const x = found.otu_ids;
  const y = found.sample_values;
  const labels = found.otu_labels;
  return { x, y, labels };
}

function createBubble(subject) {
  const plotData = getBubbleData(subject);
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

function updateBubble (subject) {
  const plotData = getBubbleData(subject);
  Plotly.restyle('bubble', 'x', [plotData.x]);
  Plotly.restyle('bubble', 'y', [plotData.y]);
  Plotly.restyle('bubble', 'text', [plotData.labels]);
  Plotly.restyle('bubble', 'marker.color', [plotData.x]);
  Plotly.restyle('bubble', 'marker.size', [plotData.y]);
}


function addOptions(subjects) {
  subjects.forEach(id => {
    dropdown.append('option').text(id).property('value', id);
  });
}

function saveData(json) {
  data = json;
}

function optionChanged(subject) {
  updateMeta(subject);
  updateBar(subject);
  updateGauge(subject);
  updateBubble(subject);
}

function init(subject) {
  updateMeta(subject);
  createBar(subject);
  createGauge(subject);
  createBubble(subject);
}