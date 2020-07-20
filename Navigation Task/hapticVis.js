const sseAddress = "127.0.0.1:50125";
const GAME = "TACTILE5";
const EVENT = "TACTILE5";

const urlBind = "http://" + sseAddress + "/bind_game_event";

let nums8 = [0,1,2,3,4,5,6];
let nums3 = [0,1,2];

let json = {};
let number, mode;
let matrixNav = localStorage.getItem("matrixNav");
let matrixFlag;

    if(matrixNav==null)
    {
      reset();
    }
    function reset(){
      matrixFlag = [];
      for(var i=0; i<3; i++) {
        matrixFlag[i] = [];
          for(var j=0; j<7; j++) {
            matrixFlag[i][j] = 0;
          }
      }
      localStorage.setItem("matrixNav", JSON.stringify(matrixFlag));
    }


    function getRandomInt8() {
      if(nums8.length == 0)
       {nums8 = [0,1,2,3,4,5,6];
        modeCount = [0,0,0,0,0,0,0,0];}
      let r = Math.floor(Math.random() * (nums8.length));
      let e = nums8[r];
      nums8.splice(r,1);
      return e;
    }
    
    function getRandomInt3() {
      if(nums3.length == 0)
       {nums3 = [0,1,2];
        numberCount = [0,0,0];}
    
      let r = Math.floor(Math.random() * (nums3.length));
      let e = nums3[r];
      nums3.splice(r,1);
      return e;
    }
    

    var height = 1000;

    var width = 2000;


    const randomX = d3.randomNormal(width / 2, 150);
    const randomY = d3.randomNormal(height / 2, 150);
    number = getRandomInt3();
    var randomLength;
    switch (number){
      case 0:
        randomLength = d3.randomUniform(height/2, height/2)(); //the area of the target 
        break;
      case 1:
        randomLength = d3.randomUniform(height/3, height/3)(); //the area of the target 
        break;
      case 2:
        randomLength = d3.randomUniform(height/5, height/5)(); //the area of the target 
        break;
    }



    var randomTX = d3.randomUniform(0, randomLength)();
    var randomTY = Math.sqrt(Math.pow(randomLength, 2) - Math.pow(randomTX, 2));
    var randomFlagX = d3.randomUniform(-1, 1)();
    var randomFlagY = d3.randomUniform(-1, 1)();

    if(randomFlagX < 0) randomTX = width/2+randomTX;
    else if(randomFlagX >= 0) randomTX = width/2-randomTX;
    if(randomFlagY < 0) randomTY = height/2+randomTY;
    else if(randomFlagY >= 0) randomTY = height/2-randomTY;



    // var paraX =  Math.floor(Math.random() * 2);
    // var paraY =  Math.floor(Math.random() * 2);
    // console.log(paraX, paraY);
    // if(paraX==1) randomTX = d3.randomUniform(width / 3, width/9*4);
    // else randomTX = d3.randomUniform(width/9*5, width / 3*2);

    // if(paraY==1) randomTY = d3.randomUniform(height/9, height/9*4);
    // else randomTY = d3.randomUniform(height/9*5, height/9*8);

    var data = Array.from({
      length: 2000
    }, () => [randomX(), randomY()]);
    var target = Array.from({
      length: 1
    }, () => [randomTX, randomTY]);
    var center = [width / 2, height / 2];

    console.log(data);
    console.log(target);

    var svg = d3.select("#visContainer")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);


    let radiusStart = 0;
    let radiusEnd = Math.PI/4;

    let arcData = d3.arc()
    .innerRadius(0)
    .outerRadius(1200)
    .startAngle(radiusStart) 
    .endAngle(radiusEnd); //radians
    
    let changeRotate = 0;

    let arc = svg.append("path")
    .attr("d", arcData)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate("+changeRotate+")" )
    .attr("fill", "grey")
    .attr("fill-opacity", "0");


    const circle = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .insert("circle")
      .attr("transform", d => `translate(${d})`)
      .attr("r", 5);

    const targ = svg.append("g")
      .selectAll("circle")
      .data(target)
      .enter()
      .insert("circle")
      .attr("transform", d => `translate(${d})`)
      .attr("r", 20)
      .attr("fill", "red")
      .attr("id", "target");



    const zoom = d3.zoom()
      .extent([
        [0, 0],
        [width, height]
      ])
      .scaleExtent([20, 20])
      .on("zoom", zoomed);

    svg.call(zoom);
    svg.call(zoom.scaleBy, 20);

    svg.call(zoom).on("mousedown.zoom", null)



    function zoomed() {
      const {
        transform
      } = d3.event;
      circle.attr("transform", d => `translate(${transform.apply(d)})`);
      targ.attr("transform", d => `translate(${transform.apply(d)})`);
    }

    var distance1, distance2, change; 
    var mouse, x=width/2, y=height/2;

    var changeColor;
    var firstTime = 0;

    function mouseover() {


      svg.on('mousemove', function () {
        mouse = d3.mouse(this);
        x = mouse[0];
        y = mouse[1];      
     });


      const gapX = width/4;
      const gapY = height/4;
      const yOffset = 0; // don't know where the offset on the top of screen comes from

      let diffX = 0;
      let diffY = 0;

      if (x > gapX && x < width - gapX) {
        diffX = 0;
      } else {
        diffX = (width/2-x)/gapX;
      }

      if (y > gapY + yOffset && y < height - gapY + yOffset) {
        diffY = 0;
      } else {
        diffY = (height/2-y)/gapY;
      }
      
      xQD = x - width/2;
      yQD = height/2 - y;

      xSide = Math.abs(xQD);
      ySide = Math.abs(yQD);

      radian = Math.atan(xSide / ySide);
      radiandiff = Math.PI/8;
      if(xQD >= 0 && yQD >= 0)
        changeRadian =  radian - radiandiff;
      else if (xQD >= 0 && yQD < 0)
        changeRadian =  radiandiff*7 - radian;
      else if (xQD < 0 && yQD < 0)
      changeRadian =  radiandiff*7 + radian;

      else if (xQD < 0 && yQD >= 0)
      changeRadian =  radiandiff*15 - radian;

      //if(x-(width/2)<0) changeRadian += Math.PI;

      var reg = /translate\((.?\d*.?.?\d*),(.?\d*.?.?\d*)\)/;

      var pos1 = d3.select("#target").attr("transform").match(reg);
      distance1 = Math.sqrt(Math.pow(center[0] - pos1[1], 2) + Math.pow(center[1] - pos1[2], 2));

     zoom.translateBy(svg, diffX, diffY);
      // svg.transition()
      // .duration(1)
      // .call(zoom.translateBy, diffX, diffY);



      var pos2 = d3.select("#target").attr("transform").match(reg);
      if(pos2[1]>0&&pos2[1]<2000&&pos2[2]>0&&pos2[2]<1000)
      {
        if(firstTime == 0){
          let d = new Date(); 
          let r = new Record("enterScreen", randomTX, randomTY, number, mode, d.getMinutes(), d.getSeconds(), d.getMilliseconds()); 
          recordArray.push(r);
          firstTime = 1;
        }
      }
      distance2 = Math.sqrt(Math.pow(center[0] - pos2[1], 2) + Math.pow(center[1] - pos2[2], 2));
      console.log(change);
      change = distance2 - distance1;
      
      

      changeColor = -change/40;
      if(changeColor<0) changeColor = 0;
      if(changeColor>1) changeColor = 1;



      changeRotate = changeRadian * (180/Math.PI);

      arc
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate("+changeRotate+")" )
      .attr("fill-opacity",changeColor);


    }

    // const brush = d3.brush()
    // .on("start brush end", brushed);

    // svg.append("g")
    // .call(xAxis);

    // svg.append("g")
    // .call(yAxis);





    class Record {
      constructor(move, randomTX, randomTY, number, mode, m, s, mss) {
          this.mouse = move;
          this.randomTX = randomTX;
          this.randomTY = randomTY;
          this.number = number;
          this.mode = mode;
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

   // document.getElementById("interact").innerHTML = "You can move the mouse arond the edges of the page to find the red dot";
    let startButton = document.getElementById("start");
    startButton.addEventListener("click", start);

    var radar;
    function start(){
      
      radar = setInterval(mouseover, 5);
      startButton.style.visibility = "hidden";
      svg.selectAll("polygon").attr("fill", "white");
      

      let d = new Date(); 
      let r = new Record("down", randomTX, randomTY, number, mode, d.getMinutes(), d.getSeconds(), d.getMilliseconds()); 
      recordArray.push(r);
      let copy = JSON.stringify(localStorage);
      console.log(recordArray, copy);
    }
    
    document.getElementById("resetButton").addEventListener("click", reset);

    targ.on("click",
    function end(){
      clearInterval(radar);
      startButton.style.visibility = "visible";
      let d = new Date(); 
      let r = new Record("up", randomTX, randomTY, number, mode, d.getMinutes(), d.getSeconds(), d.getMilliseconds()); 
      recordArray.push(r);  
      localStorage.setItem(JSON.stringify(d), JSON.stringify(recordArray)); 
      location.reload(); //to reload the page and refresh the visualization
    }
    )
    







    

//let nDoc = document.getElementById("number").innerHTML;
//let mDoc = document.getElementById("mode").innerHTML;
let modeCount = [0,0,0,0,0,0,0,0];
let numberCount = [0,0,0];
let singleCount = 1;

let scale = 1;
let elementCount = 0;
let payloadBind = {};

//document.getElementById("nextButton").addEventListener("click", modeChoosing);


function modeChoosing(){
  clearGridBrush();
 //  number = getRandomInt3();
   mode = getRandomInt8();

  matrixFlag=JSON.parse(matrixNav);

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

  localStorage.setItem("matrixNav", JSON.stringify(matrixFlag));

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
  switchMode(mode);
}





function switchMode(mode){

  arc.attr("visibility","visible");

  switch (mode){
    case 0:


      if(modeCount[0]>=singleCount) 
      {
        mode++;
      }
      else
      {
        document.getElementById("mode").innerHTML = "You will get color cues for the selection ";
        unbind();
        ++modeCount[0];
        console.log(number, mode, modeCount);
        break;
      }
    case 1:

      if(modeCount[1]>=singleCount) 
      {
        mode++;
      }
      else
      {
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
                  "low":  Math.ceil(250/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.ceil(242/scale+0.5),
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
      }
     
    case 2:


      if(modeCount[2]>=singleCount) 
      {
        mode++;
      }
      else
      {
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
                  "low":  Math.ceil(250/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz3_60" }
                  ]        
                },
                {
                  "low":  Math.ceil(242/scale+0.5),
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
      }

    case 3:


    if(modeCount[3]>=singleCount) 
    {
      mode++;
    }
    else
    {
      document.getElementById("mode").innerHTML = "You'll get color and point vibration cues for the selection ";
      payloadBind = {
        "game": GAME,
        "event": EVENT,
        "min_value": 0,
        "max_value": Math.floor(400/scale+0.5),
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
                "low":  192,
                "high": 241,
                "pattern": [
                  { "type": "ti_predefined_buzz1_100" }
                ]
              },
              {
                "low":  0,
                "high": 191,
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
    }

    case 4:

        if(modeCount[4]>=singleCount) 
        {
          mode++;
        }
      else
      {
        document.getElementById("mode").innerHTML = "You'll get point vibration cues for the selection ";
        payloadBind = {
          "game": GAME,
          "event": EVENT,
          "min_value": 0,
          "max_value": Math.floor(400/scale+0.5),
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
                  "low":  216,
                  "high": 241,
                  "pattern": [
                    { "type": "ti_predefined_buzz1_100" }
                  ]
                },
                {
                  "low":  0,
                  "high": 215,
                  "pattern": [
                  ]
                }
              ]
            }
          ]
        };
        bind(interval);
        clearGridBrush();
        ++modeCount[4];
        console.log(number, mode, modeCount);
        break;
      }

    case 5:


        if(modeCount[5]>=singleCount) 
        {
          mode++;
        }
      else
      {
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
                  "low":  Math.ceil(250/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.ceil(242/scale+0.5),
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
      }

    case 6:


        if(modeCount[6]>=singleCount) 
        {
          mode++;
        }
      else
      {
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
                  "low":  Math.ceil(250/scale+0.5),
                  "high":  Math.floor(278/scale+0.5),
                  "pattern": [
                    { "type": "ti_predefined_buzz4_40" }
                  ]        
                },
                {
                  "low":  Math.ceil(242/scale+0.5),
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
        clearGridBrush();
        ++modeCount[6];
        console.log(number, mode, modeCount);
        break;
      }

    // case 7:

    //   if(modeCount[7]>=singleCount) 
    //     {
    //       mode=0;
    //     }
    //   else
    //   {
    //     document.getElementById("mode").innerHTML = "You'll get no cue for the selection ";
    //     unbind();
    //     clearGridBrush();
    //     ++modeCount[7];
    //     console.log(number, mode, modeCount);
    //     break;
    //   }

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

unbind();

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
const dataCount = changeColor*240;
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


function clearGridBrush(){
  arc.attr("visibility","hidden");
  svg.selectAll("polygon").attr("fill", "white");
}

modeChoosing();