if (!localStorage.getItem("type") || !localStorage.getItem("user")) {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}

const user = JSON.parse(decodeURIComponent(localStorage.user));
const main = document.querySelector("main");
const data = main.querySelectorAll("main ul li span");

if (!!user.user_type) {
  main.querySelector("h2 span").textContent = user.name;
  data[0].textContent = user.user_type;
  data[1].textContent = user.username;
  data[2].textContent = user.name;
  data[3].textContent = user.phone_number.replace(
    /(\d{3})(\d{4})(\d{4})/,
    "$1-$2-$3"
  );

  if (user.user_type === "SELLER") {
    const orderListBtn = main.querySelector(".order-list-btn");
    orderListBtn.style.display = "none";
  }
}
