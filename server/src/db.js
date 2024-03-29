import { connect } from "./mongodb-connection.js";

export async function exists(id) {
  try {
    const db = await connect();
    const collection = db.collection("albums");
    const document = await collection.findOne({ _id: id });
    return document !== null;
  } catch (error) {
    console.error(`Error checking existence in collection`, error);
    throw error;
  }
}

export async function getAlbumForPhoto(photoId) {
  try {
    const db = await connect();
    const albumsCollection = db.collection("albums");
    const album = await albumsCollection.findOne({ photos: photoId });
    return album;
  } catch (error) {
    console.error("Error retrieving album for photo", error);
    throw error;
  }
}

export async function saveAlbums(albums) {
  try {
    const db = await connect();
    const result = await db.collection("albums").replaceOne({}, { albums });
    console.log(`${result.modifiedCount} document updated`);
  } catch (error) {
    console.error("Error saving albums", error);
    throw error;
  }
}

export async function removePhotoFromAlbum(album, photoId) {
  try {
    const db = await connect();
    const albumsCollection = db.collection("albums");
    const otherPhotos = album.photos.filter((pho) => pho !== photoId);
    const result = await albumsCollection.updateOne(
      { _id: album._id },
      { $set: { photos: otherPhotos } }
    );

    console.log(`${result.modifiedCount} document(s) updated`);
  } catch (error) {
    console.error("Error removing photo from album", error);
    throw error;
  }
}

export async function addPhotoToAlbumAndSave(albumId, photoId) {
  try {
    const db = await connect();
    const albumsCollection = db.collection("albums");
    const album = await albumsCollection.findOne({ _id: albumId });
    if (!album) {
      throw new Error(`Album with ID ${albumId} not found`);
    }
    album.photos.push(photoId);

    const result = await albumsCollection.updateOne(
      { _id: albumId },
      { $set: { photos: album.photos } }
    );

    console.log(`${result.modifiedCount} document updated`);
  } catch (error) {
    console.error("Error adding photo to album and saving", error);
    throw error;
  }
}
