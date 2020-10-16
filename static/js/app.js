d3.json("samples.json").then((data) => {
    mydropDown(data);
});

//Populate the dropdown with the data from json
function mydropDown(data) {
    
    let nameVal = data.names;
    // console.log(nameVal);
    let dropDown = d3.select("#selDataset");
    dropDown.html("");

    nameVal.forEach((name) => {
        
        let selectionVal = "OTU " + name;
            
        let options = dropDown.append("option");
        options.text(selectionVal);
        options.attr("value", name);
    
    });
};
// d3.select("selDataset").on("change", optionChanged);

// Dropdown selection event handler
function optionChanged() {
    // // Prevent the page from refreshing
    // d3.event.preventDefault();
  
    // Select the input value from the form
    let newValue = d3.select(this).node();

    //***I can not get the value of the selection!!!! */
    // let newMicrobe = newValue.text(); 
   
    console.log(newValue);
    // console.log(newMicrobe);
  
    // clear the input value
    // d3.select("#selDataset").node().value = "";
  
    
  }

let microbe = 940;
let key = 0;
    
builtPlot(key, microbe);


function builtPlot(key, microbe) {
    d3.json("samples.json").then((sampleData) => {
        console.log(sampleData);
        let otuSamples = sampleData.samples;
        console.log(otuSamples);
        let sampleId = otuSamples[key];
        

        console.log(sampleId);
        let otuIds = sampleId.otu_ids.slice(0,10);
        console.log(otuIds);
        let otuValues = sampleId.sample_values.slice(0,10);
        console.log(otuValues);
        
        let otuIdsLabels = [];
        otuIds.forEach((id) => {
            // let text = "OTU "
            let otuIdsLabel = "OTU " + (id);
            console.log(otuIdsLabel);
            otuIdsLabels.push(otuIdsLabel);
        });
        console.log(otuIdsLabels);

        let trace1 = {
            x: otuValues,
            y: otuIdsLabels,
            type: "bar",
            orientation: 'h'

        }

        let dataTrace = [trace1];

        let layout = {
            title: "This is shit!!"
        }

        Plotly.newPlot("plot", dataTrace, layout);
    
    });
};



// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }