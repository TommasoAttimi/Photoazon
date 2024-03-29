async function send(id) {
  let res = await fetch(`http://localhost:3000/albums/${id}`, {
    method: "DELETE",
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
send();
