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

if (localStorage.accessToken) {
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

const searchForm = gnb.querySelector("form");
const searchValue = searchForm.querySelector("input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  location.href = `index.html?search=${searchValue.value}`;
});
