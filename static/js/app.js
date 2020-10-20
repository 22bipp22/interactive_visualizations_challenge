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
            title: `Microbes for Test Subject ID #${microbe}`,
            xaxis: { title: "OTU ID"}
            
        }
        Plotly.newPlot("bubble", dataTrace2, layout2);

    });
};

//Populate the info box with the metadata from the sample chosen. 
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
                values: [ 5.55, 5.55, 5.55, 5.55, 5.55, 5.55, 5.55, 5.55, 5.55, 50.05 ],
                text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
                marker: {
                    colors: ["lightblue","lightskyblue", "deepskyblue", "cornflowerblue", "royalblue",
                            "blue", "mediumblue", "darkblue", "navy", "transparent"]
                },
                hole: .4,
                type: 'pie',
                rotation: 90,
                direction: "clockwise",
                textinfo: 'text',
                textposition: 'inside',
                showlegend: false,
                domain: {
                    x: [0,1],
                    y: [0, 1]
                  },  
            }
        ];
                
        let layout = { width: 600, 
            height: 600, 
            margin: { t: 45, b: 10 },
            title: "Belly Button Washing Frequency",
            font: { color: "royalblue", family: "Arial", size: 18 },
            annotations: [
                { 
                    text: "Scrubs per Week",
                    font: { color: "darkskyblue", size: 18},
                    align: "center",
                    x: .5,
                    y: 1,
                    showarrow: false
                    }],
            shapes:[{
                type: 'path',
                // path: 'M .5 .5 L .5 .5 L .77, .68Z',
                path: gaugePointer(metaWfreq),
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
        
        };

        Plotly.newPlot('gauge', trace3, layout);

        function gaugePointer(value){
            
            //set x and y for zero or null value
            let x = .1;
            let y = .5;

            //set x and y for 1-9
            switch(value) { 
            case 1:  
                x = .11; 
                y = .61;
                break;
            case 2:
                x = .22;
                y = .7;
                break;
            case 3:
                x = .33;
                y = .75;
                break;
            case 4:
                x = .44; 
                y = .8;
                break;
            case 5:
                x = .55;
                y = .75;
                break;
            case 6:
                x = .66;
                y = .72;
                break;
            case 7:
                x = .77;
                y = .68;
                break;
            case 8:
                x = .88;
                y = .61;
                break;
            case 9:
                x = .85;
                y = .5;
                break;
            };
            
            console.log(x, y)
            let mainPath = 'M .5 .5 L .5 0.5 L ',
            pathX = String(x),
            pathY = String(y),
            pathEnd = ' Z';
            let path = mainPath.concat(`${pathX} ${pathY}${pathEnd}`);
            console.log(path)
        
            return path;
        };
        
        
    });
}

// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }