if (
  !localStorage.getItem("type") ||
  localStorage.getItem("type") === "SELLER"
) {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}
const user = JSON.parse(decodeURIComponent(localStorage.user)).name;

const main = document.querySelector("main");
main.querySelector("h2 span").textContent = user;
