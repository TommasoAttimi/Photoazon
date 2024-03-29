async function send() {
  let res = await fetch("http://localhost:3000/albums", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "",
      creationDate: "",
      modifiedDate: newDate(),
      hashtags: ["#", "#", "#"],
    }),
  });
  let json = await res.json();
  console.log(res.status, json);
}
send();
