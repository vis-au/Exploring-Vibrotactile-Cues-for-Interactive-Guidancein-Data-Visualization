import vegaEmbed from 'vega-embed';

const sseAddress = "127.0.0.1:49925";
const GAME = "TACTILE";
const EVENT = "TACTILE";

const urlBind = "http://" + sseAddress + "/bind_game_event";

  document.onmouseup = window.clearInterval(vIn);
const SCATTERPLOT_SPEC = 
{
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A scatterplot showing horsepower and miles per gallons for various cars.',
    data: {url: 'cars.json'},
    layer: [
      {
        mark: 'point',
        encoding: {
          size: {value: 1000},
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {value: "transparent"}
        },
        width: 750,
        height: 750
      },
      {
        mark: 'circle',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        },
        width: 750,
        height: 750,

        selection: {
          "brush": {
            "type": "interval"
          }
        }
      },
  
    ],

  };



vegaEmbed('#visContainer', SCATTERPLOT_SPEC)
  .then(res => {
    const view = res.view;
    const textarea = document.querySelector("#hoveredItem");
    view.addSignalListener("brush", (data, brush) => {
      fetch("cars.json")
      .then(res => res.json())
      .then(d => d.filter(item => (item["Horsepower"] > brush.Horsepower[0] && item["Horsepower"] < brush.Horsepower[1] 
      && item["Miles_per_Gallon"] > brush.Miles_per_Gallon[0] && item["Miles_per_Gallon"] < brush.Miles_per_Gallon[1])))
      .then(d => {
        tactileEvent(d.length);})
  });

});

const payloadBind = {
    "game": GAME,
    "event": EVENT,
    "min_value": 0,
    "max_value": 300,
    "value_optional": false,
    "handlers": 
    [
      {
        "device-type": "tactile",
        "zone": "one",
        "mode": "vibrate",
        "pattern": 
        [
          {
            "low": 391,
            "high": 392,
            "pattern": [
              { "type": "ti_predefined_buzz1_100" }
            ]
          },
          {
            "low": 301,
            "high": 390,
            "pattern": [
              { "type": "ti_predefined_buzz2_80" }
            ]
          },
          {
            "low": 201,
            "high": 300,
            "pattern": [
              { "type": "ti_predefined_buzz3_60" }
            ]        
          },
          {
            "low": 101,
            "high": 200,
            "pattern": [
              { "type": "ti_predefined_buzz4_40" }
            ]        
          },
          {
            "low": 1,
            "high": 100,
            "pattern": [
              { "type": "ti_predefined_buzz5_20" }
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

function tactileEvent(dataCount){
  const tactileEventRequest = new XMLHttpRequest();
  const payloadEvent = {
    "game": GAME,
    "event": EVENT,
    "data": {
      "value": dataCount
    }
  };
        
  console.log(dataCount);
  const urlEvent = "http://" + sseAddress + "/game_event";
  tactileEventRequest.open("POST", urlEvent, true);
  tactileEventRequest.setRequestHeader("Content-Type", "application/json");
  tactileEventRequest.send(JSON.stringify(payloadEvent));
}


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