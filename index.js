const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@emajohn-cluster.qrt35.mongodb.net/?retryWrites=true&w=majority&appName=emajohn-cluster`;

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
    // Send a ping to confirm a successful connection

    const productCollection = client.db('emaJohnDB').collection('products');


    // read
    app.get('/products', async (req, res)=> {

        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
    
        console.log('pagination query', page, size);

        //pagination
        const result = await productCollection.find()
        .skip(page*size)
        .limit(size)
        .toArray();
        res.send(result);
    })

    app.post('/productByIds', async(req, res) => {
      const ids = req.body;
      const idsWithObjectId = ids.map(id => new ObjectId(id))
      const query = {
        _id:{
          $in: idsWithObjectId
        }
      }
      console.log(idsWithObjectId)
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })

    

    app.get('/productCount', async(req, res) => {
        const count = await productCollection.estimatedDocumentCount();
        res.send({ count });
    })



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('directory is start')
})

app.listen(port, ()=>{
    console.log(`server is running : ${port}`)
})