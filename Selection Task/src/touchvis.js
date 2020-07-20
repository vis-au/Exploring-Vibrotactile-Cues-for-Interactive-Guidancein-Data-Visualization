import vegaEmbed from 'vega-embed';


const sseAddress = "127.0.0.1:50167";
const GAME = "TACTILE2";
const EVENT = "TACTILE2";

const urlBind = "http://" + sseAddress + "/bind_game_event";

let dataL = 0;
let json = {};
let rand = 0;
let number, mode;

let matrixBrush = localStorage.getItem("matrixBrush");
let matrixFlag;


function reset(){
  matrixFlag = [];
  for(var i=0; i<3; i++) {
    matrixFlag[i] = [];
      for(var j=0; j<7; j++) {
        matrixFlag[i][j] = 0;
      }
  }
  localStorage.setItem("matrixBrush", JSON.stringify(matrixFlag));
}


document.getElementById("resetButton").addEventListener("click", reset);

loadJSON(function (response) {





  if(matrixBrush==null)
  {
    reset();
  }
 
    localStorage.setItem("matrixBrush", JSON.stringify(matrixFlag));
 




  json = JSON.parse(response);

  for (let i = 0; i < json.length; i++) {
      let j=json[i];
      j["Acceleration"] *= (0.5 + Math.random());
      j["Displacement"] *= (0.5 + Math.random());
      j["Miles_per_Gallon"] *= (0.5 + Math.random());
      j["Horsepower"] *= (0.5 + Math.random());
  };


  
if(rand == 0){


 // document.getElementById("interact").innerHTML = "You can brush an area to select";

  const SCATTERPLOT_SPEC = 
{


    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A scatterplot showing horsepower and miles per gallons for various cars.',
    data:  {"name": "table", "format": {"type": "json"}},

  "hconcat": [
    {

    "width": 500,
    "height": 500,
    "selection": {
      "brush": {"type": "interval", "color":{"value": "red"}}
    },
    "mark": {"type": "point", "filled": true},
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative",
       "axis": {"titlePadding": 20}},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative",
      "axis": {"titlePadding": 30}},
      color: {field: "Origin", type: "nominal"}
    }
  }, {
    "width": 500,
    "height": 500,
    "transform": [
      {"filter": {"selection": "brush"}}
    ],
    "mark": {"type": "point", "filled": true},
    "encoding": {
      "x": {
        "field": "Acceleration", "type": "quantitative",
        "axis": {"titlePadding": 20}
      },
      "y": {
        "field": "Displacement", "type": "quantitative",
        "axis": {"titlePadding": 30}
      },
      color: {field: "Origin", type: "nominal"}
    }
  }],


  };

    vegaEmbed('#visContainer', SCATTERPLOT_SPEC, {renderer: 'svg', padding: {"left": 20, "top": 20, "right": 20, "bottom": 20}})
    .then(res => {
      const view = res.view;

      view
        .insert("table", json)
        .run();

      console.log("hi0");

      view.addSignalListener("brush", (data, brush) => {
        try {
          const dataMatchingFilter = json
            .filter(item => {
              const isHorsepower = item["Horsepower"] > brush.Horsepower[0] && item["Horsepower"] < brush.Horsepower[1];
              const isMilesPerGallon = item["Miles_per_Gallon"] > brush.Miles_per_Gallon[0] && item["Miles_per_Gallon"] < brush.Miles_per_Gallon[1];
              return (isHorsepower && isMilesPerGallon);
            });
      
          dataL = dataMatchingFilter.length;

          console.log(dataL);
        } catch (e) {
          //console.log(e);  //Something wrong here probabaly about reading the item filter without checking if it's empty first
        }
    });

    });




  }

else if(rand == 1){

  document.getElementById("interact").innerHTML = "You can scroll the mouse wheel to select";

  const SCATTERPLOT_SPEC = 
{


    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A scatterplot showing horsepower and miles per gallons for various cars.',
    data:  {"name": "table", "format": {"type": "json"}},

  "hconcat": [
    {

    "width": 700,
    "height": 700,
    "selection": {
      "grid": {
        "type": "interval", "bind": "scales",
        //"translate": "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!"
        "translate": "[window:click, window:dbclick] > window:mousemove!"
      }
    },
    "mark": {"type": "point", "filled": true},
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative","scale": {"domain": [75, 150]},
       "axis": {"titlePadding": 20}},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative","scale": {"domain": [20, 40]},
      "axis": {"titlePadding": 30}},
      color: {field: "Origin", type: "nominal"}
    }
  }, {
    "width": 700,
    "height": 700,
    "transform": [
      {"filter": {"selection": "grid"}}
    ],
    "mark": {"type": "point", "filled": true},
    "encoding": {
      "x": {
        "field": "Acceleration", "type": "quantitative",
        "axis": {"titlePadding": 20}
      },
      "y": {
        "field": "Displacement", "type": "quantitative",
        "axis": {"titlePadding": 30}
      },
      color: {field: "Origin", type: "nominal"}
    }
  }],


  };


  vegaEmbed('#visContainer', SCATTERPLOT_SPEC, {renderer: 'svg', padding: {"left": 20, "top": 20, "right": 20, "bottom": 20}})
  .then(res => {
    const view = res.view;

    view
      .insert("table", json)
      .run();

    console.log("hi1");

    view.addSignalListener("grid", (data, grid) => {
      try {
        const dataMatchingFilter = json
          .filter(item => {
            const isHorsepower = item["Horsepower"] > grid.Horsepower[0] && item["Horsepower"] < grid.Horsepower[1];
            const isMilesPerGallon = item["Miles_per_Gallon"] > grid.Miles_per_Gallon[0] && item["Miles_per_Gallon"] < grid.Miles_per_Gallon[1];
            return (isHorsepower && isMilesPerGallon);
          });
    
        dataL = dataMatchingFilter.length;

        console.log(dataL);
      } catch (e) {
        //console.log(e);  //Something wrong here probabaly about reading the item filter without checking if it's empty first
      }
  });

  });



}

else if(rand == 2){
  document.getElementById("interact").innerHTML = "You can drag and scroll the mouse wheel to select";

  const SCATTERPLOT_SPEC = 
  {
   
  
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      description: 'A scatterplot showing horsepower and miles per gallons for various cars.',
      data:  {"name": "table", "format": {"type": "json"}},
  
    "hconcat": [
      {
  
      "width": 700,
      "height": 700,
      "selection": {
        "grid": {
          "type": "interval", "bind": "scales"
        }
      },
      "mark": {"type": "point", "filled": true},
      "encoding": {
        "x": {"field": "Horsepower", "type": "quantitative",
         "axis": {"titlePadding": 20}},
        "y": {"field": "Miles_per_Gallon", "type": "quantitative",
        "axis": {"titlePadding": 30}},
        color: {field: "Origin", type: "nominal"}
      }
    }, {
      "width": 700,
      "height": 700,
      "transform": [
        {"filter": {"selection": "grid"}}
      ],
      "mark": {"type": "point", "filled": true},
      "encoding": {
        "x": {
          "field": "Acceleration", "type": "quantitative",
          "axis": {"titlePadding": 20}
        },
        "y": {
          "field": "Displacement", "type": "quantitative",
          "axis": {"titlePadding": 30}
        },
        color: {field: "Origin", type: "nominal"}
      }
    }],
  
  
    };
  
  
    vegaEmbed('#visContainer', SCATTERPLOT_SPEC, {renderer: 'svg', padding: {"left": 20, "top": 20, "right": 20, "bottom": 20}})
    .then(res => {
      const view = res.view;
  
      view
        .insert("table", json)
        .run();
  
      console.log("hi2");
  
      view.addSignalListener("grid", (data, grid) => {
        try {
          const dataMatchingFilter = json
            .filter(item => {
              const isHorsepower = item["Horsepower"] > grid.Horsepower[0] && item["Horsepower"] < grid.Horsepower[1];
              const isMilesPerGallon = item["Miles_per_Gallon"] > grid.Miles_per_Gallon[0] && item["Miles_per_Gallon"] < grid.Miles_per_Gallon[1];
              return (isHorsepower && isMilesPerGallon);
            });
      
          dataL = dataMatchingFilter.length;
  
          console.log(dataL);
        } catch (e) {
          //console.log(e);  //Something wrong here probabaly about reading the item filter without checking if it's empty first
        }
    });
  
    });

}


}, 'cars.json');// Change the file name accordingly if you have a different relative path or file name



/*
* A function to read JSON files
*/
function loadJSON(callback, file) {

  // We load the file using an XMLHttpRequest, which is part of AJAX
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");

  // Open the file for reading. Filename is relative to the script file.
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") { //readState == 4 means it's done, HTTP Status Code 200: The request has succeeded.
          // It is necessary to use an anonymous callback as .open will NOT
          // return a value but simply returns undefined in asynchronous mode.
          callback(xobj.responseText);
      }
  };

  xobj.send(null); //fill in "null" in case of an older version of browser 
};





//let nDoc = document.getElementById("number").innerHTML;
//let mDoc = document.getElementById("mode").innerHTML;
let modeCount = [0,0,0,0,0,0,0,0];
let numberCount = [0,0,0];
let singleCount = 1;
let nums8 = [0,1,2,3,4,5,6];
let nums3 = [0,1,2];

let scale = 1;
let elementCount = 0;
let payloadBind = {};

document.getElementById("nextButton").addEventListener("click", refresh);


function refresh(){
  location.reload(); 
}

function getRandomInt8() {
  if(nums8.length == 0)
   {nums8 = [0,1,2,3,4,5,6];
    modeCount = [0,0,0,0,0,0,0,0];}

  let r = Math.floor(Math.random() * (nums8.length));
  let e = nums8[r];
  return e;
}

function getRandomInt3() {
  if(nums3.length == 0)
   {nums3 = [0,1,2];
    numberCount = [0,0,0];}

  let r = Math.floor(Math.random() * (nums3.length));
  let e = nums3[r];
  return e;
}

function modeChoosing(){


try {
  clearGridBrush();
}
catch(error){
  console.error(error);
}
  number = getRandomInt3();
  mode = getRandomInt8();

  matrixFlag=JSON.parse(matrixBrush);
  if(matrixFlag[number][mode] == 1){
    let foundNotDone = false;

    for(var i=0; i<3 && !foundNotDone; i++) {
      for(var j=0; j<7; j++) {
          if(matrixFlag[i][j] == 0)
          {
            number = i;
            mode = j;
            matrixFlag[number][mode] = 1;
            foundNotDone = true;
            break;
          }
      }
    }
  }

  else {
    matrixFlag[number][mode] = 1;
  }
  localStorage.setItem("matrixBrush", JSON.stringify(matrixFlag));
  console.log(matrixFlag);

  let totalCount = 1;
  for(var i=0; i<3; i++) {
    for(var j=0; j<7; j++) {
        if(matrixFlag[i][j] == 0)
          totalCount++;
    }
  }

  if(totalCount==1) reset();

  document.getElementById("total").innerHTML = "You have " + totalCount + " trials left in this round";

  console.log(number, mode, modeCount);

  switchNumber(number);
  switchMode(mode);
}



function switchNumber(number){
  switch (number){
    case 0:
        document.getElementById("number").innerHTML = "You're selecting around 15 data points ";
        scale = 16;
        elementCount = 15;
      break;
    case 1:
        document.getElementById("number").innerHTML = "You're selecting around 60 data points ";
        scale = 4;
        elementCount = 60;
      break;
    case 2:
        document.getElementById("number").innerHTML = "You're selecting around 240 data points ";
        scale = 1;
        elementCount = 240;
      break;
  }
}

function switchMode(mode){


  switch (mode){
    case 0:
      if(rand == 0)
      {
        brushChange();
      }
      else{
        gridChange();
      } 


        document.getElementById("mode").innerHTML = "You will get color cues for the selection ";
        unbind();
        ++modeCount[0];
        console.log(number, mode, modeCount);
        break;
      
    case 1:
        document.getElementById("mode").innerHTML = "You'll get increasing vibration cues for the selection ";
        payloadBind = {
          "game": GAME,
          "event": EVENT,
          "min_value": 0,
          "max_value": Math.floor(480/scale+0.5),
          "value_optional": true,
          "handlers": 
          [
            {
              "device-type": "tactile",
              "zone": "one",
              "mode": "vibrate",
              "pattern": 
              [
                {
                  "low":  Math.floor(394/scale+0.5),
                  "high":  Math.floor(480/scale+0.5),
                  "pattern": [
                  ]        
                },
                {
                  "low":  Math.floor(328/scale+0.5),
                  "high":  Math.floor(393/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]        
                },
                {
                  "low":  Math.floor(279/scale+0.5),
                  "high":  Math.floor(327/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.ceil(249/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.ceil(241/scale+0.5),
                  "high":  Math.ceil(249/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]
                },
                {
                  "low":  Math.floor(239/scale+0.5),
                  "high":  Math.floor(241/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]
                },
                {
                  "low":  Math.floor(231/scale+0.5),
                  "high":  Math.floor(238/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]
                },
                {
                  "low":  Math.floor(202/scale+0.5),
                  "high":  Math.floor(230/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.floor(155/scale+0.5),
                  "high":  Math.floor(201/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.floor(87/scale+0.5),
                  "high":  Math.floor(154/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]        
                },
                {
                  "low":  Math.floor(0/scale+0.5),
                  "high":  Math.floor(86/scale+0.5),
                  "pattern": [
                  ]        
                }
              ]
            }
          ]
        };
        bind(interval);
        clearGridBrush();
        ++modeCount[1];
        console.log(number, mode, modeCount);
        break;
      
     
    case 2:
        if(rand == 0)
        {
          brushChange();
        }
        else{
          gridChange();
        }

  
        document.getElementById("mode").innerHTML = "You'll get color and increasing vibration cues for the selection";
        payloadBind = {
          "game": GAME,
          "event": EVENT,
          "min_value": 0,
          "max_value": Math.floor(480/scale+0.5),
          "value_optional": true,
          "handlers": 
          [
            {
              "device-type": "tactile",
              "zone": "one",
              "mode": "vibrate",
              "pattern": 
              [
                {
                  "low":  Math.floor(394/scale+0.5),
                  "high":  Math.floor(480/scale+0.5),
                  "pattern": [
                  ]        
                },
                {
                  "low":  Math.floor(328/scale+0.5),
                  "high":  Math.floor(393/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]        
                },
                {
                  "low":  Math.floor(279/scale+0.5),
                  "high":  Math.floor(327/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.ceil(249/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.ceil(241/scale+0.5),
                  "high":  Math.ceil(249/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]
                },
                {
                  "low":  Math.floor(239/scale+0.5),
                  "high":  Math.floor(241/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]
                },
                {
                  "low":  Math.floor(231/scale+0.5),
                  "high":  Math.floor(238/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]
                },
                {
                  "low":  Math.floor(202/scale+0.5),
                  "high":  Math.floor(230/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.floor(155/scale+0.5),
                  "high":  Math.floor(201/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.floor(87/scale+0.5),
                  "high":  Math.floor(154/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]        
                },
                {
                  "low":  Math.floor(0/scale+0.5),
                  "high":  Math.floor(86/scale+0.5),
                  "pattern": [
                  ]        
                }
              ]
            }
          ]
        };
        bind(interval);
        ++modeCount[2];
        console.log(number, mode, modeCount);
        break;
      

    case 3:
      if(rand == 0)
      {
        brushChange();
      }
      else{
        gridChange();
      }

 
      document.getElementById("mode").innerHTML = "You'll get color and point vibration cues for the selection ";
      payloadBind = {
        "game": GAME,
        "event": EVENT,
        "min_value": 0,
        "max_value": Math.floor(480/scale+0.5),
        "value_optional": true,
        "handlers": 
        [
          {
            "device-type": "tactile",
            "zone": "one",
            "mode": "vibrate",
            "pattern": 
            [
              {
                "low":  elementCount+2,
                "high":  elementCount*2,
                "pattern": [

                ]
              },
              {
                "low":  elementCount-1,
                "high": elementCount+1,
                "pattern": [
                  { "type": "ti_predefined_buzz1_100" }
                ]
              },
              {
                "low":  0,
                "high":  elementCount-2,
                "pattern": [

                ]
              }
            ]
          }
        ]
      };
      bind(interval);
      ++modeCount[3];
      console.log(number, mode, modeCount);
      break;
    

    case 4:
    
        document.getElementById("mode").innerHTML = "You'll get point vibration cues for the selection ";
        payloadBind = {
          "game": GAME,
          "event": EVENT,
          "min_value": 0,
          "max_value": Math.floor(480/scale+0.5),
          "value_optional": true,
          "handlers": 
          [
            {
              "device-type": "tactile",
              "zone": "one",
              "mode": "vibrate",
              "pattern": 
              [
                {
                  "low":  elementCount+2,
                  "high":  elementCount*2,
                  "pattern": [
  
                  ]
                },
                {
                  "low":  elementCount-1,
                  "high": elementCount+1,
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]
                },
                {
                  "low":  0,
                  "high":  elementCount-2,
                  "pattern": [
  
                  ]
                }
              ]
            }
          ]
        };
        bind(interval);
        ++modeCount[4];
        console.log(number, mode, modeCount);
        break;
      

    case 5:
        if(rand == 0)
        {
          brushChange();
        }
        else{
          gridChange();
        }

      
        document.getElementById("mode").innerHTML = "You'll get color and decreasing vibration cues for the selection ";
        payloadBind = {
          "game": GAME,
          "event": EVENT,
          "min_value": 0,
          "max_value": Math.floor(480/scale+0.5),
          "value_optional": true,
          "handlers": 
          [
            {
              "device-type": "tactile",
              "zone": "one",
              "mode": "vibrate",
              "pattern": 
              [
                {
                  "low":  Math.floor(394/scale+0.5),
                  "high":  Math.floor(480/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]        
                },
                {
                  "low":  Math.floor(328/scale+0.5),
                  "high":  Math.floor(393/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]        
                },
                {
                  "low":  Math.floor(279/scale+0.5),
                  "high":  Math.floor(327/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.ceil(249/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.ceil(241/scale+0.5),
                  "high":  Math.ceil(249/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]
                },
                {
                  "low":  Math.floor(239/scale+0.5),
                  "high":  Math.floor(241/scale+0.5),
                  "pattern": [
               
                  ]
                },
                {
                  "low":  Math.floor(231/scale+0.5),
                  "high":  Math.floor(238/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]
                },
                {
                  "low":  Math.floor(202/scale+0.5),
                  "high":  Math.floor(230/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.floor(155/scale+0.5),
                  "high":  Math.floor(201/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.floor(87/scale+0.5),
                  "high":  Math.floor(154/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]        
                },
                {
                  "low":  Math.floor(0/scale+0.5),
                  "high":  Math.floor(86/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]        
                }
              ]
            }
          ]
        };
        bind(interval);
        ++modeCount[5];
        console.log(number, mode, modeCount);
        break;
      

    case 6:
      
        document.getElementById("mode").innerHTML = "You'll get decreasing vibration cues for the selection ";
        payloadBind = {
          "game": GAME,
          "event": EVENT,
          "min_value": 0,
          "max_value": Math.floor(480/scale+0.5),
          "value_optional": true,
          "handlers": 
          [
            {
              "device-type": "tactile",
              "zone": "one",
              "mode": "vibrate",
              "pattern": 
              [
                {
                  "low":  Math.floor(394/scale+0.5),
                  "high":  Math.floor(480/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]        
                },
                {
                  "low":  Math.floor(328/scale+0.5),
                  "high":  Math.floor(393/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]        
                },
                {
                  "low":  Math.floor(279/scale+0.5),
                  "high":  Math.floor(327/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.ceil(249/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.ceil(241/scale+0.5),
                  "high":  Math.ceil(249/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]
                },
                {
                  "low":  Math.floor(239/scale+0.5),
                  "high":  Math.floor(241/scale+0.5),
                  "pattern": [
               
                  ]
                },
                {
                  "low":  Math.floor(231/scale+0.5),
                  "high":  Math.floor(238/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz5_20" }
                  ]
                },
                {
                  "low":  Math.floor(202/scale+0.5),
                  "high":  Math.floor(230/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.floor(155/scale+0.5),
                  "high":  Math.floor(201/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.floor(87/scale+0.5),
                  "high":  Math.floor(154/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz2_80" }
                  ]        
                },
                {
                  "low":  Math.floor(0/scale+0.5),
                  "high":  Math.floor(86/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]        
                }
              ]
            }
          ]
        };
        bind(interval);
        ++modeCount[6];
        console.log(number, mode, modeCount);
        break;
      

    // case 7:

      
    //     document.getElementById("mode").innerHTML = "You'll get no cue for the selection ";
    //     unbind();
    //     clearGridBrush();
    //     ++modeCount[7];
    //     console.log(number, mode, modeCount);
    //     break;
      

  }
}









const tactileGameRequest =  new XMLHttpRequest();
const metadata = {
"game": GAME,
"game_display_name": GAME
};

const urlGame = "http://" + sseAddress + "/game_metadata";


tactileGameRequest.open("POST", urlGame, true);
tactileGameRequest.setRequestHeader("Content-Type", "application/json");
tactileGameRequest.send(JSON.stringify(metadata));


const urlUnbind = "http://" + sseAddress + "/remove_game_event";
const unbindEvent = {
  "game": GAME,
  "event": EVENT,
};

let eventInterval;

function bind(callback){
  try {
    unbind();
  }
  catch(error){
    console.error(error);
  }

bindEvent();

callback();
}

function interval(){

  eventInterval = window.setInterval(tactileEvent, 50);
}


function bindEvent(){
const tactileBindRequest =  new XMLHttpRequest();
tactileBindRequest.open("POST", urlBind, true);
tactileBindRequest.setRequestHeader("Content-Type", "application/json");
tactileBindRequest.send(JSON.stringify(payloadBind));
}

function unbind(){
clearInterval(eventInterval);

const tactileUnbindRequest =  new XMLHttpRequest();
tactileUnbindRequest.open("POST", urlUnbind, true);
tactileUnbindRequest.setRequestHeader("Content-Type", "application/json");
tactileUnbindRequest.send(JSON.stringify(unbindEvent));
}

function tactileEvent(){
const dataCount = dataL;
const tactileEventRequest = new XMLHttpRequest();
const payloadEvent = {
  "game": GAME,
  "event": EVENT,
  "data": {
    "value": dataCount
  }
};
      
//console.log(dataCount);
const urlEvent = "http://" + sseAddress + "/game_event";
tactileEventRequest.open("POST", urlEvent, true);
tactileEventRequest.setRequestHeader("Content-Type", "application/json");
tactileEventRequest.send(JSON.stringify(payloadEvent));

//document.onmouseup = window.clearInterval(vIn);
}








//function populateStorage() {

//}



class Record {
    constructor(move, xp, yp, number, mode, L, m, s, mss) {
        this.mouse = move;
        this.x = xp;
        this.y = yp;
        this.number = number;
        this.mode = mode;
        this.dataCount = L;
        this.minute = m;
        this.second = s;
        this.ms = mss;
    }
  }
  
  
  class RecordList{ 
    constructor(){ 
      this.length=0; 
      this.data={}; 
    } 
    getElementAtIndex(index){ 
      return this.data[index]; 
    } 
    push(element){ 
      this.data[this.length]=element; 
      this.length++; 
      return this.length; 
    } 
    pop(){ 
      const item= this.data[this.length-1]; 
      delete this.data[this.length-1]; 
      this.length--; 
      return this.data; 
    } 
    
    deleteAt(index){ 
      for(let i=index; i<this.length-1;i++){ 
        this.data[i]=this.data[i+1]; 
      } 
      delete this.data[this.length-1]; 
      this.length--; 
      return this.data; 
    } 
    insertAt(item, index){ 
      for(let i=this.length;i>=index;i--){ 
        this.data[i]=this.data[i-1]; 
      } 
      this.data[index]=item; 
      this.length++; 
      return this.data; 
    } 
  
    dateSum(date){
      let sum = 0;
      for (let i = 0; i < this.length; i++) {
        if(this.getElementAtIndex(i).date == date)
        sum += Number(this.getElementAtIndex(i).streams);
      }
      return sum;
    }  
    
  } 
  
  
  let recordArray = new RecordList();

  document.addEventListener('mousedown',
  e =>{
    let d = new Date(); 
    let r = new Record("down", e.clientX, e.clientY, number, mode, dataL, d.getMinutes(), d.getSeconds(), d.getMilliseconds()); 
    recordArray.push(r);
  }
  );

  document.addEventListener('mouseup',
  e =>{
     let d = new Date(); 
     let r = new Record("up", e.clientX, e.clientY, number, mode, dataL, d.getMinutes(),  d.getSeconds(), d.getMilliseconds()); 
     recordArray.push(r);  
     
     localStorage.setItem(JSON.stringify(d), JSON.stringify(recordArray)); 
     console.log(recordArray);
     let copy = JSON.stringify(localStorage);
     console.log(recordArray, copy);
    }
    );
  
  

let gridE;
let brushE;

// let brushBack = document.querySelector(".brush_brush_bg").firstChild;
// let brushLine = document.querySelector(".brush_brush").firstChild;

function brushChange(){
  brushE = window.setInterval(brushEvent, 10);
}

function brushEvent(){

  if(mode!=1 && mode!=7){
    let e = document.querySelector(".brush_brush_bg").firstChild;
    let f = document.querySelector(".brush_brush").firstChild;
    e.style.fill = "black";
    f.style.stroke = "black";
    f.style.strokeWidth = 2;
    if(e!=null)
      if(dataL>=0.5*elementCount && dataL <= 1.5*elementCount)
      e.style.fillOpacity = 0.625-Math.abs(elementCount-dataL)/elementCount;
      else e.style.fillOpacity = 0.125;
      f.style.strokeOpacity = 0.625 - e.style.fillOpacity;
    }
//     if(dataL>=0.5*elementCount && dataL <= 1.5*elementCount)
//     {
//     brushBack.style.fillOpacity = 0.5-Math.abs(elementCount-dataL)/elementCount;
//     brushBack.style.fill = "black";
//     brushLine.style.stroke = "black";
//     brushLine.style.strokeWidth = 2;
//   }
//     else {
//       brushBack.style.fillOpacity = 0;   
//       brushBack.style.fill = "black";
// brushLine.style.stroke = "black";
// brushLine.style.strokeWidth = 2; 
//     }
//     brushLine.style.strokeOpacity = 0.5 - brushBack.style.fillOpacity;
}

function gridChange(){
  gridE = window.setInterval(gridEvent, 10);
}

function gridEvent(){
  if(mode!=1 && mode!=7){
  let e = document.querySelectorAll(".background")[1];
  e.style.fill = "black";
  if(e!=null)
    if(dataL>=0.5*elementCount && dataL <= 1.5*elementCount)
    e.style.fillOpacity = 0.5-Math.abs(elementCount-dataL)/elementCount;
    else e.style.fillOpacity = 0;
  }
}

function clearGridBrush(){
  if(rand==0)
  {
    clearInterval(brushE);
    document.querySelector(".brush_brush_bg").firstChild.style.fillOpacity = 0.125;
    document.querySelector(".brush_brush").firstChild.style.stroke = "white";
  }
  else
  {
    clearInterval(gridE);
    document.querySelectorAll(".background")[1].style.fillOpacity = 0;
    document.querySelectorAll(".background")[1].style.fill = "white";
  }

}


modeChoosing();