const fetchUrl = "https://estapi.openmarket.weniv.co.kr";

const myPageBtn = document.querySelector(".myPageBtn");
const myPageModal = document.querySelector(".myPageModal");
const logoutBtn = myPageModal.querySelector(".logout");

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

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("type");
  location.reload(true);
}

function getAccessToken() {
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
        alert(
          "로그인 세션이 만료되어 로그아웃되었습니다. 재로그인을 진행해주세요."
        );
        logout();
      }
      return response.json();
    })
    .then((json) => {
      localStorage.setItem("accessToken", `${json.access}`);
    })
    .catch((error) => console.error(error));
}

if (localStorage.accessToken) {
  if (localStorage.accessToken !== "undefined") {
    setInterval(() => {
      getAccessToken();
    }, 299000);
  }

  setTimeout(() => {
    alert(
      "로그인 세션이 만료되어 로그아웃되었습니다. 재로그인을 진행해주세요."
    );
    logout();
  }, 86400000);

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

logoutBtn.addEventListener("click", () => {
  logout();
});
