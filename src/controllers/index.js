const readline = require('readline'),
fs = require('fs');

module.exports = class Geo{
  constructor(filname, distance = null){
    this.customers_near = [];
    this.filname = filname;
    this.distance = distance;
  }

  //check if existing 
  checkForNearestCustomer(data,userDistance){
    return new Promise((resolve, reject)=>{
      if(data 
        && Object.prototype.toString.call(data).slice(8,-1) == "Object"
        && data.latitude 
        && data.longitude 
        && data.user_id
        && data.name
        && typeof Number(data.latitude) !== NaN 
        && typeof Number(data.longitude) !== NaN
        && typeof data.user_id == 'number'
        && typeof data.name == 'string'
        ){
          let distance = this.getDistanceFromLatLonInKm(
            global.config.defaultLatitude,
            global.config.defaultLongitude,
            Number(data.latitude),
            Number(data.longitude)
          );
          let verifyDistance = userDistance ? userDistance : global.config.max_radius_in_km; //change max_radius_in_km in config as required 
          if(distance <= verifyDistance){ 
            this.add(this.customers_near,data);
          }
        }
        else reject(global.config.file_format_wrong)
    })
  }


  //calculating distance between two locations
  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2){
    let R = global.config.radiusOfEEarth; 
    let dLat = this.deg2rad(lat2-lat1);  
    let dLon = this.deg2rad(lon2-lon1); 
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c;
    return d;
  }


  //converting degrees to radians
  deg2rad(deg){
    return deg * (Math.PI/180)
  }



  /* -------Helpers------ */

  //sort data bby key
  sortByKey(data,key){
  return  data.sort((a,b)=>a[key] - b[key]); //ascending
  }

  //log data
  log(data){
    return console.log(data);
  }

  //parse to JSON
  parse(data){
    return JSON.parse(data)
  } 

  //add to object(array)
  add(obj, data){
    return obj.push(this.customizeOutput(config.customizeOutputBy.id_name ,data))
  } 

  //customize the output as required
    customizeOutput(customiseBy, data){
    if(customiseBy == config.customizeOutputBy.id_name){
      return { user_id: data.user_id, name: data.name}
    }
    return data;
  }

  findCustomers(){
    return new Promise((resolve, reject)=>{
      try {
        if(!this.filname){
          throw global.config.file_not_found;
        }
        const readInterface = readline.createInterface({
          input: fs.createReadStream(this.filname),
          // output: process.stdout,
          console: false
        });

        readInterface.on('line', (line) => {
          this.checkForNearestCustomer(this.parse(line),this.distance)
              .catch(err=> reject(err))
        });
      
        readInterface.on('close', ()=> {
          this.sortByKey(this.customers_near, 'user_id');
          resolve(this.customers_near);
          this.customers_near = [];
        });
      }
      catch(err){
        reject(err);
      }

    })
  }

}
