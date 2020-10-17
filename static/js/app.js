//Read the json, assign it to a variable then call the function to populate the dropdown menu
d3.json("samples.json").then((data) => {
    mydropDown(data);
    
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
        buildPlot(newIndex, newValue);
        }) 
    
    //Function to get the key from the data
    function getKeyByValue(object, value) { 
        return Object.keys(object).find(key => object[key] === value); 
    
    }; 
    
};

//Set the initial values for populating the webpage with the plot and call the function to build the plot
let microbe = 940;
let key = 0;    

buildPlot(key, microbe);

//Builds the horizontal bar chart on the webpage
function buildPlot(key, microbe) {
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
        
        let otuIdsLabels = [];
        otuIdsR.forEach((id) => {
            // let text = "OTU "
            let otuIdsLabel = "OTU " + (id);
            // console.log(otuIdsLabel);
            otuIdsLabels.push(otuIdsLabel);
        });

        
        // console.log(otuIdsLabels);

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

        Plotly.newPlot("plot", dataTrace, layout);
    
    });
};



// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }