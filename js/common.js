const fetchUrl = "https://estapi.openmarket.weniv.co.kr";

const gnb = document.querySelector(".GNB");
const gnbCartBtn = gnb.querySelector(".cart");
const gnbLoginBtn = gnb.querySelector(".login");
const gnbMyPageBtn = gnb.querySelector(".myPage");
const gnbSellerCenterBtn = gnb.querySelector(".sellerCenter");
const myPageModal = gnb.querySelector(".myPageModal");
const goMyPageBtn = myPageModal.querySelector(".goMyPage");
const logoutBtn = myPageModal.querySelector(".logout");

gnbMyPageBtn.addEventListener("click", () => {
  if (!myPageModal.open) {
    myPageModal.open = true;
  } else {
    myPageModal.open = false;
  }
});

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("orderItem");
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
    gnbLoginBtn.hidden = true;
    gnbMyPageBtn.hidden = false;
  } else if (localStorage.type === "SELLER") {
    gnbLoginBtn.hidden = true;
    gnbCartBtn.hidden = true;
    gnbMyPageBtn.hidden = false;
    gnbSellerCenterBtn.hidden = false;
  }
}

logoutBtn.addEventListener("click", () => {
  logout();
});

goMyPageBtn.addEventListener("click", () => {
  location.href = "myPage.html";
});
