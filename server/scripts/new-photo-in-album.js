async function send(albumId, photoId) {
  let res = await fetch(
    `http://localhost:3000/albums/${albumId}/photos/${photoId}`,
    {
      method: "POST",
    }
  );
  let json = await res.json();
  console.log(json.status, res.status);
}
send(1, 1);
