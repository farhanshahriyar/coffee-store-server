const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

// mongodb code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvknusc.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Establish DB and verify connection
    const coffeeCollection = client.db("coffeestoreDB").collection("coffee");

    // all post requests here
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee); // checking if the data is coming or hitting (ok)
      const result = await coffeeCollection.insertOne(newCoffee);
      res.json(result);
    });
    
    // all get requests here
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find({});
      const result = await cursor.toArray();
      res.send(result); // checking the data is available or not
    });

      // find operation here
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.json(result);
    });

    // all delete requests here
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.json(result);
    });

    // all put requests here
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
        quantity: updatedCoffee.quantity,
        supplier: updatedCoffee.supplier,
        taste: updatedCoffee.taste,
        category: updatedCoffee.category,
        details: updatedCoffee.details,
        photo: updatedCoffee.photo
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.json(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






// routes
app.get('/', (req, res) => {
    res.send('coffee server is up and running')
})

// listen on port
app.listen(port, () => {
    console.log(`coffee server is running on port ${port}`)
})