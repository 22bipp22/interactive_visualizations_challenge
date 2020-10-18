//Read the json, assign it to a variable then call the function to populate the dropdown menu
d3.json("samples.json").then((data) => {
    mydropDown(data);
    // console.log(data)
});  

//Populate the dropdown with the data from json
function mydropDown(data) {
    
    //Grab the test subject ID # from the data (names field)
    let nameVal = data.names;

    let dropDown = d3.select("#selDataset");
    dropDown.html("");

    //Populate the dropdown options with the sample "names" (test subject ID #)
    nameVal.forEach((name) => {
        
        let selectionVal = name;
            
        let options = dropDown.append("option");
        options.text(selectionVal);
        options.attr("value", name);
    
    });
};

// Dropdown selection event handler
function optionChanged() {
    
    // Reference the value selected and assign it to a variable
    let newValue = d3.select("#selDataset").property("value");

    //Pull in the data and get the Key(index) for the selected item
    d3.json("samples.json").then((data) => {
        let bellyButtonData = data.names;
        // console.log(bellyButtonData);
        let newIndex = getKeyByValue(bellyButtonData, newValue)
        console.log(newIndex, newValue);
        buildPlots(newIndex, newValue);
        populateMetaData(newIndex, newValue);
        }) 
    
    //Function to get the key from the data
    function getKeyByValue(object, value) { 
        return Object.keys(object).find(key => object[key] === value); 
    
    }; 
    
};

//Set the initial values for populating the webpage with the plot and call the function to build the plot
let microbe = 940;
let key = 0;    

buildPlots(key, microbe);
populateMetaData(key, microbe);

//Builds the horizontal bar chart on the webpage
function buildPlots(key, microbe) {
    d3.json("samples.json").then((sampleData) => {
        // console.log(sampleData);
        let otuSamples = sampleData.samples;
        // console.log(otuSamples);
        let sampleId = otuSamples[key];

        // Slice the data to only show the top 10 Microbes
        let otuIds = sampleId.otu_ids.slice(0,10);        
        let otuValues = sampleId.sample_values.slice(0,10);
        let otuLabels = sampleId.otu_labels.slice(0,10);
        
        //Reverse the order of the data to display most prevelant at the top of the bar chart
        let otuIdsR = otuIds.reverse();
        let otuValuesR = otuValues.reverse();
        let otuLabelsR = otuLabels.reverse();
        
        //create labels for display on the y axis of horizontal bar
        let otuIdsLabels = [];
        otuIds.forEach((id) => {
            let otuIdsLabel = "OTU " + (id);
            otuIdsLabels.push(otuIdsLabel);
        });
        otuIdsLabelsR = otuIdsLabels.reverse();
      
        //Create the Horizontal Bar chart
        let trace1 = {
            x: otuValuesR,
            y: otuIdsLabels,
            type: "bar",
            orientation: 'h',
            text: otuLabelsR

        }

        let dataTrace = [trace1];

        let layout = {
            title: `Microbes for Test Subject ID #${microbe}`,
            hovermode: "closest"
        }

        Plotly.newPlot("bar", dataTrace, layout);

        //Create the Bubble Chart using all data for given subject
        let trace2 = {
            x: sampleId.otu_ids,
            y: sampleId.sample_values,
            mode: "markers",
            marker: {
                size: sampleId.sample_values,
                color: sampleId.otu_ids
            },
            text: sampleId.otu_labels

        }

        let dataTrace2 = [trace2];

        let layout2 = {
            title: `Microbes for Test Subject ID #${microbe}`
            
        }
        Plotly.newPlot("bubble", dataTrace2, layout2);

    });
};

function populateMetaData(key, value) {
    d3.json("samples.json").then((data) => {
        
        let metaData = data.metadata;
        console.log(metaData);
        let metaSelected = metaData[key];
        console.log(metaSelected);

        let metaId = value;
        let metaEthnic = metaSelected.ethnicity;
        let metaGender = metaSelected.gender;
        let metaAge = metaSelected.age;
        let metaLocation = metaSelected.location;
        let metaBbtype = metaSelected.bbtype;
        let metaWfreq = metaSelected.wfreq;

        //Add the demographic data to the Demographic Info Box
        let info = d3.select("#sample-metadata");

        info.html("");

        info.append('h6').text(`Id: ${metaId}`);
        info.append('h6').text(`Ethnicity: ${metaEthnic}`);
        info.append('h6').text(`Gender: ${metaGender}`);
        info.append('h6').text(`Age: ${metaAge}`);
        info.append('h6').text(`Location: ${metaLocation}`);
        info.append('h6').text(`bbtype: ${metaBbtype}`);
        info.append('h6').text(`wfreq: ${metaWfreq}`);

        //Use the metaData Washing Frequency to populate the gauge chart
        let trace3 = [
            {
                domain: { x: [0, 1], y: metaWfreq },
                value: 270,
                title: { text: "Speed" },
                type: "indicator",
                mode: "gauge+number"
            }
        ];
                
        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot('gauge', data, layout);
    });
}

// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }