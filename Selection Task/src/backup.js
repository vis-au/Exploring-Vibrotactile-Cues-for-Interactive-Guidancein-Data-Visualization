import vegaEmbed from 'vega-embed';


const sseAddress = "127.0.0.1:60951";
const GAME = "TACTILE2";
const EVENT = "TACTILE2";

const urlBind = "http://" + sseAddress + "/bind_game_event";

let dataL = 0;
let json = {};




loadJSON(function (response) {



  json = JSON.parse(response);

  for (let i = 0; i < json.length; i++) {
      let j=json[i];
      j["Acceleration"] *= (0.5 + Math.random());
      j["Displacement"] *= (0.5 + Math.random());
      j["Miles_per_Gallon"] *= (0.5 + Math.random());
      j["Horsepower"] *= (0.5 + Math.random());
  };

  
vegaEmbed('#visContainer', SCATTERPLOT_SPEC, {renderer: 'svg'})
.then(res => {
  const view = res.view;

  view
  .insert("table", json)
  .run();
  console.log("hi");

  view.addSignalListener("brush", (data, brush) => {
    dataL = json
    .filter(item => (item["Horsepower"] > brush.Horsepower[0] && item["Horsepower"] < brush.Horsepower[1] 
    && item["Miles_per_Gallon"] > brush.Miles_per_Gallon[0] && item["Miles_per_Gallon"] < brush.Miles_per_Gallon[1])).length;
    console.log(dataL);

});

});


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


const SCATTERPLOT_SPEC = 
{


    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A scatterplot showing horsepower and miles per gallons for various cars.',
    data:  {"name": "table", "format": {"type": "json"}},

  "hconcat": [
    {

    "width": 600,
    "height": 600,
    "selection": {
      "brush": {"type": "interval"}
    },
    "mark": {"type": "point", "filled": true},
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
      color: {field: "Origin", type: "nominal"}
    }
  }, {
    "width": 600,
    "height": 600,
    "transform": [
      {"filter": {"selection": "brush"}}
    ],
    "mark": {"type": "point", "filled": true},
    "encoding": {
      "x": {
        "field": "Acceleration", "type": "quantitative",

      },
      "y": {
        "field": "Displacement", "type": "quantitative",
 
      },
      color: {field: "Origin", type: "nominal"}
    }
  }],


  };







function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


let nDoc = document.getElementById("number").innerHTML;
let mDoc = document.getElementById("mode").innerHTML;

let number = getRandomInt(3);
let mode = getRandomInt(8);
console.log(number, mode);

function modeChoosing(){


  switch (number){
    case 0:
        document.getElementById("number").innerHTML = "You're selecting around 15 data points. ";
      break;
    case 1:
        document.getElementById("number").innerHTML = "You're selecting around 60 data points. ";
      break;
    case 2:
        document.getElementById("number").innerHTML = "You're selecting around 200 data points. ";
      break;
  }


  switch (mode){
    case 0:
        document.getElementById("mode").innerHTML = "You won't get any cue for the selection ";
      break;
    case 1:
        document.getElementById("mode").innerHTML = "You'll get 1 cues for the selection ";
      break;
    case 2:
        document.getElementById("mode").innerHTML = "You'll get 2 cues for the selection ";
      break;
    case 3:
        document.getElementById("mode").innerHTML = "You'll get 3 cues for the selection ";
      break;
    case 4:
        document.getElementById("mode").innerHTML = "You'll get 4 cues for the selection ";
      break;
    case 5:
        document.getElementById("mode").innerHTML = "You'll get 5 cues for the selection ";
      break;
    case 6:
        document.getElementById("mode").innerHTML = "You'll get 6 cues for the selection ";
      break;
    case 7:
        document.getElementById("mode").innerHTML = "You'll get 7 cues for the selection ";
      break;
  }
}


modeChoosing();


const payloadBind = {
    "game": GAME,
    "event": EVENT,
    "min_value": 0,
    "max_value": 400,
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
            "low": 221,
            "high": 400,
            "pattern": [
            ]        
          },
          {
            "low": 191,
            "high": 220,
            "pattern": [
              { "type": "ti_predefined_buzz5_20" }
            ]        
          },
          {
            "low": 171,
            "high": 190,
            "pattern": [
              { "type": "ti_predefined_buzz4_40" }
            ]        
          },
          {
            "low": 161,
            "high": 170,
            "pattern": [
              { "type": "ti_predefined_buzz3_60" }
            ]        
          },
          {
            "low": 151,
            "high": 160,
            "pattern": [
              { "type": "ti_predefined_buzz2_80" }
            ]
          },
          {
            "low": 150,
            "high": 150,
            "pattern": [
              { "type": "ti_predefined_buzz1_100" }
            ]
          },
          {
            "low": 141,
            "high": 149,
            "pattern": [
              { "type": "ti_predefined_buzz2_80" }
            ]
          },
          {
            "low": 131,
            "high": 140,
            "pattern": [
              { "type": "ti_predefined_buzz3_60" }
            ]        
          },
          {
            "low": 111,
            "high": 130,
            "pattern": [
              { "type": "ti_predefined_buzz4_40" }
            ]        
          },
          {
            "low": 61,
            "high": 110,
            "pattern": [
              { "type": "ti_predefined_buzz5_20" }
            ]        
          },
          {
            "low": 0,
            "high": 60,
            "pattern": [
            ]        
          }
        ]
      }
    ]
};



const tactileGameRequest =  new XMLHttpRequest();
const metadata = {
  "game": GAME,
  "game_display_name": GAME
};

const urlGame = "http://" + sseAddress + "/game_metadata";
tactileGameRequest.open("POST", urlGame, true);
tactileGameRequest.setRequestHeader("Content-Type", "application/json");
tactileGameRequest.send(JSON.stringify(metadata));

const tactileBindRequest =  new XMLHttpRequest();
tactileBindRequest.open("POST", urlBind, true);
tactileBindRequest.setRequestHeader("Content-Type", "application/json");
tactileBindRequest.send(JSON.stringify(payloadBind));


setTimeout(window.setInterval(tactileEvent, 20), 5000);



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
    constructor(move, xp, yp, L, m, s, mss) {
        this.mouse = move;
        this.x = xp;
        this.y = yp;
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
  
  onmousedown = function(e){let d = new Date(); let r = new Record("down", e.clientX, e.clientY, dataL, d.getMinutes(), d.getSeconds(), d.getMilliseconds()); recordArray.push(r);  console.log(recordArray);}
  //onmousemove = function(e){console.log("mouse location:", e.clientX, e.clientY, dataL)}
  onmouseup = function(e){let d = new Date(); let r = new Record("up", e.clientX, e.clientY, dataL, d.getMinutes(), d.getSeconds(), d.getMilliseconds()); recordArray.push(r);  localStorage.setItem('datab', recordArray );}
  
  