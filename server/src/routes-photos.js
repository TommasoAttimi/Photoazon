import {
  connect,
  close,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "./mongodb-connection.js";

export const getAll = async (req, res) => {
  let foundPhotos = [];
  let db = await connect();
  let keys = Object.keys(req.query);
  if (keys.length == 0) {
    res.json({ status: "ok", photos: db.photos });
    return;
  }
  for (let j = 0; j < db.photos.length; j++) {
    let photo = db.photos[j];
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (photo[key] == req.query[key]) {
        count++;
      }
    }
    if (req.query.choice == "or") {
      if (count > 0) {
        foundPhotos.push(photo);
      }
    } else {
      if (count == keys.length) {
        foundPhotos.push(photo);
      }
    }
  }
  res.json({ status: "ok", photos: foundPhotos });
};

export const getSingle = async (req, res) => {
  let db = await connect();
  let photo = db.photos.find((photo) => photo.id == req.params.id);
  if (photo) {
    res.json({ status: "ok", photo: photo });
  } else {
    res.status(404).json({ status: "error" });
  }
};

export const deleteSingle = async (req, res) => {
  let [success, data] = await deletePhoto(req.params.id);
  if (success) {
    res.status(200).json({ status: "ok", photo: data });
  } else {
    res.status(400).json({ status: "error" });
  }
};

export const updateSingle = async (req, res) => {
  let newPhotoData = req.body;
  if (photoIsValid(newPhotoData)) {
    let [success, data] = await updatePhoto(newphotoData);
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
  if (photoIsValid(req.body)) {
    let [success, data] = await createPhoto(req.body);
    if (success) {
      res.status(201).json({ status: "ok", id: data });
    } else {
      res.status(409).json({ status: "error", msg: data.errmsg });
    }
  } else {
    res.status(400).json({ status: "error", msg: "Invalid photo attributes" });
  }
};
