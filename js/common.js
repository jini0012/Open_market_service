const fetchUrl = "https://estapi.openmarket.weniv.co.kr";

const myPageBtn = document.querySelector(".myPageBtn");
const myPageModal = document.querySelector(".myPageModal");
const logout = myPageModal.querySelector(".logout");

myPageBtn.addEventListener("click", () => {
  if (!myPageModal.open) {
    myPageModal.open = true;
  } else {
    myPageModal.open = false;
  }
});

const cart = document.querySelector(".cart");
const login = document.querySelector(".login");
const myPage = document.querySelector(".myPage");
const sellerCenter = document.querySelector(".sellerCenter");

// 추후 refresh 만료시 로그아웃 되는 기능 추가 예정

if (localStorage.accessToken) {
  if (localStorage.accessToken !== "undefined") {
    setInterval(() => {
      fetch(`${fetchUrl}/accounts/token/refresh/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: localStorage.refreshToken,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            location.href = "error.html";
          }
          return response.json();
        })
        .then((json) => {
          localStorage.setItem("accessToken", `${json.access}`);
        })
        .catch((error) => console.error(error));
    }, 300000);
  }

  if (localStorage.type === "BUYER") {
    login.hidden = true;
    myPage.hidden = false;
  } else if (localStorage.type === "SELLER") {
    login.hidden = true;
    cart.hidden = true;
    myPage.hidden = false;
    sellerCenter.hidden = false;
  }
}

logout.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("type");
  location.reload(true);
});
