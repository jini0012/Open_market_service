//공동 js 적용
// 마이페이지 모달 만들기
const myPageBtn = document.querySelector(".myPageBtn");
const myPageModal = document.querySelector(".myPageModal");
const logout = myPageModal.querySelector(".logout");

// 마이페이지 버튼 클릭 시 켜지고 꺼지는 모달창
myPageBtn.addEventListener("click", () => {
  if (!myPageModal.open) {
    myPageModal.open = true;
  } else {
    myPageModal.open = false;
  }
});
// 로그아웃버튼 클릭 시 로그아웃 되는 기능
logout.addEventListener("click", () => {
  //   myPageModal.close();
  // 로그아웃버튼을 누르면 access값, refresh값을 삭제하고 마이페이지 hidden, 로그인 visible
});

//----------------------------------------------------------------------------
