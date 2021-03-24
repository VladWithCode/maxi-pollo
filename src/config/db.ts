import { MongoError } from 'mongodb';
import mongoose from 'mongoose';

const DB_URI = process.env.DB_URI || 'mongodb://localhost/meals';

mongoose.connect(DB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err: MongoError) => {
  if (!err) return console.log('Connected to DB');

  console.log(err);
});

export default mongoose;
