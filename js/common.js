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

const login = document.querySelector(".login");
const myPage = document.querySelector(".myPage");

// 로그인 중인 경우 (localStorage에 토큰이 있는) 5분마다 access토큰 갱신
if (localStorage.accessToken !== "undefined") {
  console.log("로그인 되었습니다!");
  login.hidden = true;
  myPage.hidden = false;
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
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        // 새로 받은 access token으로 로컬스토리지에 저장
        localStorage.setItem("accessToken", `${json.access}`);
      })
      .catch((error) => console.error(error));
  }, 300000);
} else {
  login.hidden = false;
  myPage.hidden = true;
}

// 5분이 지날 때 마다 새로운 access token 값을 저장

//------------------------------------------------------

// 로그아웃버튼 클릭 시 로그아웃 되는 기능
logout.addEventListener("click", () => {
  // 로그아웃버튼을 누르면 access값, refresh값을 삭제하고 마이페이지 hidden, 로그인 visible
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("type");

  // 페이지를 새로고침한다 -> 로그인 토큰이 사라져서 비로그인회원 창으로 보인다.
  location.reload(true);
});
