const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Fetch data from the samples.json file
d3.json(url).then(function(data) {
  const allIds = data.names;
  const dropdown = document.getElementById("selDataset");

  //Populate the list of samples
  allIds.forEach(id => {
    const option = document.createElement("option");
    option.textContent = id;
    option.value = id;
    dropdown.appendChild(option);
  });

  const defaultId = dropdown.value;
  drawCharts(defaultId);
});

function drawCharts(nameID) {
  d3.json(url).then(function(data) {
    const sampleMetadata = data.metadata.find(sample => sample.id == nameID);
    const individualSamples = data.samples.find(sample => sample.id == nameID);

    //Details of the sample
    const panelBody = document.querySelector(".panel-body");
    panelBody.innerHTML = "";
    for (const [key, value] of Object.entries(sampleMetadata)) {
      const small = document.createElement("small");
      small.textContent = `${key}: ${value}`;
      panelBody.appendChild(small);
      panelBody.appendChild(document.createElement("br"));
    }

    //Get the top 10 values for OTU
    const top_values = individualSamples.sample_values.slice(0, 10).reverse();
    const otu_ids = individualSamples.otu_ids.slice(0, 10).reverse().map(otuId => `OTU ${otuId}`);
    const otu_labels = individualSamples.otu_labels.slice(0, 10).reverse();

    //Plot the bar chart
    const barTrace = {
      x: top_values,
      y: otu_ids,
      text: otu_labels,
      type: 'bar',
      orientation: 'h',
      hovertext: otu_labels
    };
    const barData = [barTrace];
    Plotly.newPlot('bar', barData);

    //Plot the bubble chart
    const bubbleTrace = {
      x: individualSamples.otu_ids,
      y: individualSamples.sample_values,
      text: individualSamples.otu_labels,
      mode: 'markers',
      marker: {
        size: individualSamples.sample_values,
        color: individualSamples.otu_ids,
        colorscale: 'Viridis'
      }
    };
    const bubbleData = [bubbleTrace];
    const bubbleLayout = {
      width: 1000,
      height: 400,
      xaxis: { title: 'OTU ID' }
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}

//Dropdown change event
function optionChanged(newId) {
  drawCharts(newId);
}
