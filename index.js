const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.rvqsrsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const todoCollection = client.db("TodoAPP").collection("userTodos");
    //save todo in the database
    app.post("/user-todo", async (req, res) => {
      const data = req.body;
      const result = await todoCollection.insertOne(data);
      res.send(result);
    });
    //get all todo specific user
    app.get("/user-todo", async (req, res) => {
      const name = req.query.useName;
      const query = { userName: name };
      const result = await todoCollection.find(query).toArray();
      res.send(result);
    });
    //delete todo using id
    app.delete("/user-todo", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
    //update todo
    app.put("/user-todo", async (req, res) => {
      const id = req.query.id;
      const data = req.body.editedText;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          todoText: data,
        },
      };
      const result = await todoCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("server is liv now");
});

app.listen(port, () => {
  console.log(`the server is running in port:${port}`);
});
