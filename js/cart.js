if (localStorage.type === "SELLER") {
  location.href = "error.html";
} else {
  fetch(`${fetchUrl}/cart`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => console.log(json))
    .catch((error) => console.error("error :", error));
}
