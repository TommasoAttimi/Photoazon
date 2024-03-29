import {
  exists,
  getAlbumForPhoto,
  removePhotoFromAlbum,
  addPhotoToAlbumAndSave,
} from "./db.js";
import {
  connect,
  createAlb,
  updateAlb,
  deleteAlb,
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

export const getAllAlbums = async (req, res) => {
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

export const getSingleAlbum = async (req, res) => {
  try {
    const db = await connect();
    const albumsCollection = db.collection("albums");
    const album = await albumsCollection.findOne({ id: req.params.id });

    if (album) {
      res.json({ status: "ok", album: album });
    } else {
      res.status(404).json({ status: "error", msg: "Album not found" });
    }
  } catch (error) {
    console.error("Error fetching single album:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const deleteSingleAlbum = async (req, res) => {
  try {
    const [success, data] = await deleteAlb(req.params.id);
    if (success) {
      res.status(200).json({ status: "ok", album: data });
    } else {
      res.status(404).json({ status: "error", msg: "Album not found" });
    }
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const updateSingleAlbum = async (req, res) => {
  try {
    const newAlbumData = req.body;
    if (albumIsValid(newAlbumData)) {
      const [success, data] = await updateAlb(req.params.id, newAlbumData);
      if (success) {
        res.json({ status: "ok", data: data });
      } else {
        res.status(404).json({ status: "error", msg: "Album not found" });
      }
    } else {
      res
        .status(400)
        .json({ status: "error", msg: "Invalid album attributes" });
    }
  } catch (error) {
    console.error("Error updating album:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const createAlbum = async (req, res) => {
  try {
    if (albumIsValid(req.body)) {
      const [success, data] = await createAlb(req.body);
      if (success) {
        res.status(201).json({ status: "ok", id: data });
      } else {
        res.status(409).json({ status: "error", msg: data.errmsg });
      }
    } else {
      res
        .status(400)
        .json({ status: "error", msg: "Invalid album attributes" });
    }
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};
