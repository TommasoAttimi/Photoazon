import { connect } from "./mongodb-connection.js";

export async function exists(collection, id) {
  let db = await connect();
  let foundElements = db[collection].filter((element) => element.id == id);
  return foundElements.length > 0;
}

export async function getAlbumForPhoto(photoId) {
  let db = await connect();
  let albums = db.albums;
  for (let i = 0; i < albums.length; i++) {
    let photos = albums[i].photos;
    if (photos.indexOf(photoId) > -1) {
      return albums[i];
    }
  }
  return null;
}

export async function saveAlbums(albums) {
  let db = await connect();
  db.albums = albums;
  await fs.writeFile(JSON.stringify(db));
}

export async function removePhotoFromAlbum(album, photoId) {
  let db = await connect();
  let albums = db.albums;
  let otherPhotos = album.photos.filter((pho) => pho != photoId);

  for (let i = 0; i < albums.length; i++) {
    if (albums[i].id == album.id) {
      albums[i].photos = otherPhotos;
    }
  }

  await saveAlbums(albums);
}

export async function addPhotoToAlbumAndSave(albumId, photoId) {
  let db = await connect();
  let albums = db.albums;
  let album = albums.find((alb) => alb.id == albumId);
  album.photos.push(photoId);
  saveAlbums(albums);
}
