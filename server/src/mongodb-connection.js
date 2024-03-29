import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config";
const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function createPhoto(photo) {
  try {
    await connect();
    const result = await client
      .db("photoazon")
      .collection("photos")
      .insertOne(photo);
    return [true, result.insertedId];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function updatePhoto(photo) {
  try {
    await connect();
    const result = await client
      .db("photoazon")
      .collection("photos")
      .updateOne({ title: photo.title }, { $set: photo });
    return [true, result.deleteCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function deletePhoto(id) {
  try {
    await connect();
    const result = await client
      .db("photoazon")
      .collection("photos")
      .deleteOne({ _id: new ObjectId(id) });

    return [true, result.modifiedCount];
  } catch (err) {
    console.log("delete", err);
    return [false, err];
  } finally {
    await close();
  }
}
export async function connect() {
  await client.connect();
}

export async function close() {
  await client.close();
}

export async function createAlbum(album) {
  try {
    await connect();
    const result = await client
      .db("photoazon")
      .collection("albums")
      .insertOne(album);
    return [true, result.insertedId];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function updateAlbum(album) {
  try {
    await connect();
    const result = await client
      .db("photoazon")
      .collection("albums")
      .updateOne({ title: album.title }, { $set: album });
    return [true, result.deleteCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function deleteAlbum(id) {
  try {
    await connect();
    const result = await client
      .db("photoazon")
      .collection("albums")
      .deleteOne({ _id: new ObjectId(id) });

    return [true, result.modifiedCount];
  } catch (err) {
    console.log("delete", err);
    return [false, err];
  } finally {
    await close();
  }
}
