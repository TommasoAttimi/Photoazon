import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

import {
  getSinglePhoto,
  deleteSinglePhoto,
  updateSinglePhoto,
  getAllPhotos,
  createPhoto,
} from "./routes-photos.js";

import {
  addPhotoToAlbum,
  getSingleAlbum,
  deleteSingleAlbum,
  updateSingleAlbum,
  getAllAlbums,
  createAlbum,
} from "./routes-albums.js";

app.use(bodyParser.json());

app.post("/photos", createPhoto);
app.get("/photos", getAllPhotos);
app.get("/photos/:id", getSinglePhoto);
app.put("/photos/:id", updateSinglePhoto);
app.delete("/photos/:id", deleteSinglePhoto);

app.post("/albums/:albumId/photos/:photoId", addPhotoToAlbum);
app.post("/albums", createAlbum);
app.get("/albums", getAllAlbums);
app.get("/albums/:id", getSingleAlbum);
app.put("/albums/:id", updateSingleAlbum);
app.delete("/albums/:id", deleteSingleAlbum);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
