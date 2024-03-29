async function send() {
  let res = await fetch("http://localhost:3000/photos", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Venice",
      creationDate: "11/12/2023",
      modifiedDate: newDate(),
      url: "url",
      hashtags: ["#venice", "#italy", "#photography"],
    }),
  });
  let json = await res.json();
  console.log(res.status, json);
}
send();
