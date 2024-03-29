import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

import {
  getSingle,
  deleteSingle,
  updateSingle,
  getAll,
  create,
} from "./routes-photos.js";

import { addPhotoToAlbum } from "./routes-albums.js";

app.use(bodyParser.json());

app.post("/photos", create);
app.get("/photos/:id", getSingle);
app.get("/photos", getAll);
app.put("/photos/:id", updateSingle);
app.delete("/photos/:id", deleteSingle);

app.post("/albums/:albumId/photos/:photoId", addPhotoToAlbum);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
