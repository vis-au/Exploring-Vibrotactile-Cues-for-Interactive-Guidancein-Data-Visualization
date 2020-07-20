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