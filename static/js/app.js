//Read the json, assign it to a variable then call the function to populate the dropdown menu
d3.json("samples.json").then((data) => {
    let bellyButtonData = data;
    mydropDown(data);
    
});  

//Populate the dropdown with the data from json
function mydropDown(data) {
    
    //Grab the OTU number from the data (names field)
    let nameVal = data.names;

    let dropDown = d3.select("#selDataset");
    dropDown.html("");

    //Populate the dropdown options with the OTU number, adding the letters OTU before each one
    nameVal.forEach((name) => {
        
        let selectionVal = "OTU " + name;
            
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
        

        // console.log(sampleId);
        let otuIds = sampleId.otu_ids.slice(0,10);
        // console.log(otuIds);
        let otuValues = sampleId.sample_values.slice(0,10);
        // console.log(otuValues);
        
        let otuIdsLabels = [];
        otuIds.forEach((id) => {
            // let text = "OTU "
            let otuIdsLabel = "OTU " + (id);
            // console.log(otuIdsLabel);
            otuIdsLabels.push(otuIdsLabel);
        });
        // console.log(otuIdsLabels);

        let trace1 = {
            x: otuValues,
            y: otuIdsLabels,
            type: "bar",
            orientation: 'h'

        }

        let dataTrace = [trace1];

        let layout = {
            title: `Data for OTU ${microbe}`
        }

        Plotly.newPlot("plot", dataTrace, layout);
    
    });
};



// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }