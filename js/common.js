const fetchUrl = "https://estapi.openmarket.weniv.co.kr";

const gnb = document.querySelector(".GNB");
const cartBtn = gnb.querySelector(".cart");
const loginBtn = gnb.querySelector(".login");
const myPageBtn = gnb.querySelector(".myPage");
const sellerCenterBtn = gnb.querySelector(".sellerCenter");
const myPageModal = gnb.querySelector(".myPageModal");
const logoutBtn = myPageModal.querySelector(".logout");

myPageBtn.addEventListener("click", () => {
  if (!myPageModal.open) {
    myPageModal.open = true;
  } else {
    myPageModal.open = false;
  }
});

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
    loginBtn.hidden = true;
    myPageBtn.hidden = false;
  } else if (localStorage.type === "SELLER") {
    loginBtn.hidden = true;
    cartBtn.hidden = true;
    myPageBtn.hidden = false;
    sellerCenterBtn.hidden = false;
  }
}

logoutBtn.addEventListener("click", () => {
  logout();
});
