import {
  exists,
  getAlbumForPhoto,
  removePhotoFromAlbum,
  addPhotoToAlbumAndSave,
} from "./db.js";
import {
  connect,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "./mongodb-connection.js";

export const addPhotoToAlbum = async (req, res) => {
  let albumId = parseInt(req.params.albumId, 10);
  let photoId = parseInt(req.params.photoId, 10);

  if (!(await exists("albums", albumId))) {
    return res.status(404).send({ status: "error" });
  }
  if (!(await exists("photos", photoId))) {
    return res.status(404).send({ status: "error" });
  }

  let albumContainingPhoto = await getAlbumForPhoto(photoId);
  if (albumContainingPhoto && albumContainingPhoto.id == albumId) {
    return res
      .status(409)
      .send({ status: "error", msg: "photo already in this album" });
  }

  if (albumContainingPhoto) {
    await removePhotoFromAlbum(albumContainingPhoto, photoId);
  }
  await addPhotoToAlbumAndSave(albumId, photoId);
  res.json({ status: "ok" });
};

export const getAll = async (req, res) => {
  let foundAlbums = [];
  let db = await connect();
  let keys = Object.keys(req.query);
  console.log(db.albums);
  if (keys.length == 0) {
    res.json({ status: "ok", albums: db.albums });
    return;
  }
  for (let j = 0; j < db.albums.length; j++) {
    let album = db.albums[j];
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (album[key] == req.query[key]) {
        count++;
      }
    }
    if (req.query.choice == "or") {
      if (count > 0) {
        foundAlbums.push(album);
      }
    } else {
      if (count == keys.length) {
        foundAlbums.push(album);
      }
    }
  }
  res.json({ status: "ok", albums: foundAlbums });
};

export const getSingle = async (req, res) => {
  let db = await connect();
  let album = db.albums.find((album) => album.id == req.params.id);
  if (album) {
    res.json({ status: "ok", album: album });
  } else {
    res.status(404).json({ status: "error" });
  }
};

export const deleteSingle = async (req, res) => {
  let [success, data] = await deleteAlbum(req.params.id);
  if (success) {
    res.status(200).json({ status: "ok", album: data });
  } else {
    res.status(400).json({ status: "error" });
  }
};

export const updateSingle = async (req, res) => {
  let newAlbumData = req.body;
  if (albumIsValid(newAlbumData)) {
    let [success, data] = await updateAlbum(newAlbumData);
    if (success) {
      res.json({ status: "ok", data: data });
    } else {
      res.status(400).json({ status: "error" });
    }
  } else {
    res.status(400).json({ status: "error" });
  }
};

export const create = async (req, res) => {
  if (albumIsValid(req.body)) {
    let [success, data] = await createAlbum(req.body);
    if (success) {
      res.status(201).json({ status: "ok", id: data });
    } else {
      res.status(409).json({ status: "error", msg: data.errmsg });
    }
  } else {
    res.status(400).json({ status: "error", msg: "Invalid album attributes" });
  }
};
