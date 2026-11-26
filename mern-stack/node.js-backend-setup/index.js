// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.json());

const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/';
const DB_NAME = 'student_managment_db';

const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`MongoDB connected: ${DB_NAME}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}


app.get('/testing',(req,res)=>{
  res.send('your node.js server is working fine');
});

app.get('/', (req, res) => {
  res.send('Server running!');
});

// Sample route: users collection la irundhu data edukka
app.get('/students', async (req, res) => {
  try {
    const studentsDatas = await db.collection('students').find({}).toArray();
    res.json(studentsDatas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sample route: user add panna
app.post('/students', async (req, res) => {
  try {
    const result = await db.collection('students').insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function deleteStudent(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid student id' });
    }

    const result = await db.collection('students').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

     res.status(200).json({ success: 'record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


app.delete('/students/:id', deleteStudent);


async function updateStudent(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid student id' });
    }

    const updates = { ...req.body };
    delete updates._id;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.put('/students/:id', updateStudent);


// DB connect aana apparam dhaan server start aagum
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Ctrl+C pannum bodhu connection close panna
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});