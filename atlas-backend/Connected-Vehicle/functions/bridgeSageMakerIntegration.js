exports = async function(changeEvent) {
  
  /**
   * Function to bridge Sagemaker integration for simplification reasons
   **/
  
  // Transform changeEvent
  const sagemakerdoc = {
    value: 0.4,
    vin: "5UXFE83578L342684"
    
  }
    // Wait for 5 seconds to simulate processing on the backend
  await new Promise(resolve => setTimeout(resolve, 5000));

    // Access a mongodb service:
    const collection = context.services.get("mongodb-atlas").db("Integrations").collection("Sagemaker");
    const doc = collection.insertOne( sagemakerdoc );

};
