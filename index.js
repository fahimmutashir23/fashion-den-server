const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const data = require("./data.json");
const reviews = require("./review.json")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyhg6t2.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const fashionCollection = client.db("fashionDB").collection("fashion");
    const fashionCartCollection = client.db("fashionDB").collection("fashionsCart");
   
    app.get("/fashionsBrand", (req, res) => {
        res.send(data)
    })

    app.get("/reviews", (req, res) => {
        res.send(reviews)
    })

    app.get("/fashions", async(req, res) => {
        const cursor = fashionCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get("/fashions/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await fashionCollection.findOne(query);
        res.send(result)
    })

    app.get("/fashionsCart", async(req, res) => {
        const cursor = fashionCartCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post("/fashions", async(req, res) => {
        const data = req.body;
        const result = await fashionCollection.insertOne(data);
        res.send(result)
    })

    app.post("/fashionsCart", async(req, res) => {
        const data = req.body;
        const result = await fashionCartCollection.insertOne(data);
        res.send(result)
    })

    app.put("/fashions/:id", async(req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert : true };
        const updateProduct = {
            $set: {
                name: data.name,
                brand: data.brand,
                type: data.type,
                price: data.price,
                photo: data.photo,
                rating: data.rating
            }
        }
        const result = await fashionCollection.updateOne(filter, updateProduct, options);
        res.send(result)
    })

    app.delete('/fashionsCart/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await fashionCartCollection.deleteOne(query);
        res.send(result)
    })

    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res)=> {
    res.send("fashion Den surver is running successfully")
})

app.listen(port, () => {
    console.log(`server is running port ${port}`);
})