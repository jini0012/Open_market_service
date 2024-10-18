//공동 js 적용
// 마이페이지 모달 만들기
const myPageBtn = document.querySelector(".myPageBtn");
const myPageModal = document.querySelector(".myPageModal");
const logout = myPageModal.querySelector(".logout");

// 마이페이지 버튼 클릭 시 켜지고 꺼지는 모달창
myPageBtn.addEventListener("click", () => {
  if (!myPageModal.open) {
    // 모달이 닫혀있는 경우 마이페이지 버튼 클릭시 open
    myPageModal.open = true;
  } else {
    // 모달이 열려있는경우 마이페이지 버튼 클릭시 close
    myPageModal.open = false;
  }
});

//------------------------------------------------------
const cart = document.querySelector(".cart");
const login = document.querySelector(".login");
const myPage = document.querySelector(".myPage");
const sellerCenter = document.querySelector(".sellerCenter");

// 추후 refresh 만료시 로그아웃 되는 기능 추가 예정

// 로그인중인경우 (로그인되지 않은경우 : 비회원인경우 기본 UI -장바구니, 로그인 UI)
if (localStorage.accessToken) {
  if (localStorage.accessToken !== "undefined") {
    // 로그인 중인 경우 (localStorage에 토큰이 있는) 5분마다 access토큰 갱신
    setInterval(() => {
      fetch("https://estapi.openmarket.weniv.co.kr/accounts/token/refresh/", {
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
          console.log(json);
          // 새로 받은 access token으로 로컬스토리지에 저장
          localStorage.setItem("accessToken", `${json.access}`);
        })
        .catch((error) => console.error(error));
    }, 300000);
  }

  // 구매회원인경우
  if (localStorage.type === "BUYER") {
    login.hidden = true;
    myPage.hidden = false;
    // 판매회원인경우
  } else if (localStorage.type === "SELLER") {
    login.hidden = true;
    cart.hidden = true;
    myPage.hidden = false;
    sellerCenter.hidden = false;
  }
}

//------------------------------------------------------

// 로그아웃버튼 클릭 시 로그아웃 되는 기능
logout.addEventListener("click", () => {
  // 로그아웃버튼을 누르면 access값, refresh값을 삭제
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("type");

  // 페이지를 새로고침한다 -> 로그인 토큰이 사라져서 비로그인회원 창으로 보인다.
  location.reload(true);
});
