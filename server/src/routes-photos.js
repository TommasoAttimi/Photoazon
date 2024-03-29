import { connect, createPh, updatePh, deletePh } from "./mongodb-connection.js";

export const getAllPhotos = async (req, res) => {
  try {
    const db = await connect();
    const photosCollection = db.collection("photos");
    let keys = Object.keys(req.query);

    if (keys.length === 0) {
      const photos = await photosCollection.find({}).toArray();
      res.json({ status: "ok", photos: photos });
      return;
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const getSinglePhoto = async (req, res) => {
  try {
    const db = await connect();
    const photosCollection = db.collection("photos");
    const photo = await photosCollection.findOne({ id: req.params.id });

    if (photo) {
      res.json({ status: "ok", photo: photo });
    } else {
      res.status(404).json({ status: "error", msg: "Photo not found" });
    }
  } catch (error) {
    console.error("Error fetching single photo:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const deleteSinglePhoto = async (req, res) => {
  try {
    const [success, data] = await deletePh(req.params.id);
    if (success) {
      res.status(200).json({ status: "ok", photo: data });
    } else {
      res.status(404).json({ status: "error", msg: "Photo not found" });
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const updateSinglePhoto = async (req, res) => {
  try {
    const newPhotoData = req.body;
    if (photoIsValid(newPhotoData)) {
      const [success, data] = await updatePh(req.params.id, newPhotoData);
      if (success) {
        res.json({ status: "ok", data: data });
      } else {
        res.status(404).json({ status: "error", msg: "Photo not found" });
      }
    } else {
      res
        .status(400)
        .json({ status: "error", msg: "Invalid photo attributes" });
    }
  } catch (error) {
    console.error("Error updating photo:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

export const createPhoto = async (req, res) => {
  try {
    const photoData = req.body;
    if (photoIsValid(photoData)) {
      const [success, data] = await createPh(photoData);
      if (success) {
        res.status(201).json({ status: "ok", id: data });
      } else {
        res
          .status(500)
          .json({ status: "error", msg: "Failed to create photo" });
      }
    } else {
      res
        .status(400)
        .json({ status: "error", msg: "Invalid photo attributes" });
    }
  } catch (error) {
    console.error("Error creating photo:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};
