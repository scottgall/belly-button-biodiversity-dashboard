
let dropdown = d3.select('#selDataset');
let meta = d3.select('#sample-metadata');
let data = {};

(async function() {
  try {
    const json = await d3.json('samples.json');
    saveData(json);
    addOptions(json.names);
    const subject = dropdown.property('value');
    init(subject);
  } catch(error) {
    console.log(error);
  }
})();

function updateMeta(subject) {
  const metadata = {
    id: subject.id,
    ethnicity: subject.ethnicity,
    gender: subject.gender,
    age: subject.age,
    location: subject.location,
    bbtype: subject.bbtype,
    wfreq: subject.wfreq
  };
  meta.text('');
  for(const [key, value] of Object.entries(metadata)) {
    meta.append('div').text(`${key}: ${value}`);
  }
}

function getBarData(subject) {
  const x = subject.sample_values.slice(0,10).reverse();
  const y = subject.otu_ids.slice(0,10).map(num => `OTU ${num}`).reverse();
  const labels = subject.otu_labels.slice(0,10).reverse();
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
  }];
  const layout = {
    title: {
      text: 'Top 10 Bacteria Cultures Found'
    }
  };
  Plotly.newPlot('bar', data, layout);
}

function updateBar(subject) {
  const plotData = getBarData(subject);
  Plotly.restyle('bar', 'x', [plotData.x]);
  Plotly.restyle('bar', 'y', [plotData.y]);
  Plotly.restyle('bar', 'text', [plotData.labels]);
}

function createGauge(washFreq) {
  const data = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: washFreq,
    title: { text: 'Belly Button Washing Frequency' },
    type: 'indicator',
    mode: 'gauge+number',
    gauge: {
      axis: { 
        range: [null, 9],
        tickvals: [0,1,2,3,4,5,6,7,8,9],
      },
      steps: [
        { range: [0, 1], color: '#d9eaf6' },
        { range: [1, 2], color: '#cae1f2' },
        { range: [2, 3], color: '#bad8ee' },
        { range: [3, 4], color: '#aacfeb' },
        { range: [4, 5], color: '#9ac6e7' },
        { range: [5, 6], color: '#8abee3' },
        { range: [6, 7], color: '#7ab5df' },
        { range: [7, 8], color: '#6bacdc' },
        { range: [8, 9], color: '#5ba3d8' }
      ],
      threshold: {
        line: { color: 'rebeccapurple', width: 4 },
        thickness: 0.75,
        value: washFreq
      }
    }
  }];
  const layout = { width: 500, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
}

function updateGauge(washFreq) {
  Plotly.restyle('gauge', 'value', [washFreq]);
  Plotly.restyle('gauge', 'gauge.threshold.value', [washFreq]);
}

function createBubble(subject) {
  const data = [{
    x: subject.otu_ids,
    y: subject.sample_values,
    text: subject.otu_labels,
    mode: 'markers',
    marker: {
      color: subject.otu_ids,
      size: subject.sample_values
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
  };
  Plotly.newPlot('bubble', data, layout);
}

function updateBubble (subject) {
  Plotly.restyle('bubble', 'x', [subject.otu_ids]);
  Plotly.restyle('bubble', 'y', [subject.sample_values]);
  Plotly.restyle('bubble', 'text', [subject.otu_labels]);
  Plotly.restyle('bubble', 'marker.color', [subject.otu_ids]);
  Plotly.restyle('bubble', 'marker.size', [subject.sample_values]);
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
  const metadata = data.metadata.find(obj => obj.id == subject);
  const samples = data.samples.find(obj => obj.id == subject);
  updateMeta(metadata);
  updateBar(samples);
  updateGauge(metadata.wfreq);
  updateBubble(samples);
}

function init(subject) {
  const metadata = data.metadata.find(obj => obj.id == subject);
  const samples = data.samples.find(obj => obj.id == subject);
  updateMeta(metadata);
  createBar(samples);
  createGauge(metadata.wfreq);
  createBubble(samples);
}