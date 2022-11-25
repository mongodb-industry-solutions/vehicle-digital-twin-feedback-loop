exports = function(arg){
  
  console.log(JSON.stringify(arg))
  
  /**
   * Update battery status of a vehicle
   * run manually: exports({fullDocument: { vin: '5UXFE83578L342684', value: 0.4 }})
   * arg = { vin: '5UXFE83578L342684', value: percentage }
   */
   
   let status;

   if (arg.fullDocument.value >=55.5) { 
     status = "OK";
   } else {
     status = "NOK"
   }
  
  var collection = context.services.get("mongodb-atlas").db("Vehicles").collection("Vehicle");
    
  const query = { "_id": arg.fullDocument.vin };
  const update = {
    "$set": {
      "battery.status": status
    }
  };
    
  const options = { "upsert": false };
    
  collection.updateOne(query, update, options).then((result) => {
    console.log(JSON.stringify(result));
  });
  return true
};