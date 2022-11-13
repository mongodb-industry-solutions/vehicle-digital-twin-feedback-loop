exports = function(changeEvent) {
  
  // Transform changeEvent
  const sagemakerdoc = {
    value: 0.4,
    vin: "5UXFE83578L342684"
    
  }

    // Access a mongodb service:
    const collection = context.services.get("mongodb-atlas").db("Integrations").collection("Sagemaker");
    const doc = collection.insertOne( sagemakerdoc );

};
