// 회원가입 구매회원, 판매회원 버튼 전환
const joinBtns = document.querySelectorAll(".join-btns li button");
const sellerOnly = document.querySelectorAll(".seller-only");
joinBtns.forEach((button) => {
  button.addEventListener("click", () => {
    if (button === joinBtns[0]) {
      joinBtns[0].classList.add("active");
      joinBtns[1].classList.remove("active");
      sellerOnly.forEach((elem) => elem.classList.add("seller-only"));
    } else {
      joinBtns[0].classList.remove("active");
      joinBtns[1].classList.add("active");
      sellerOnly.forEach((elem) => elem.classList.remove("seller-only"));
    }
  });
});

// 아이디 중복확인
// 이미 사용중인 아이디인경우 : 이미 사용 중인 아이디 입니다.
// 사용 가능한 아이디인 경우 : 멋진 아이디네요 :)
const joinForm = document.querySelector(".join-form");
joinForm.addEventListener("submit", (e) => {});

// 비밀번호 유효성 검증
// 비밀번호가 모두 입력되었으면 체크 표시 -> 초록색 체크 표시
// 비밀번호 !== 비밀번호 재확인 : 비밀번호가 일치하지 않습니다.

joinForm.addEventListener("input", (e) => {
  const password = joinForm.querySelector("#password");
  const passwordRecheck = joinForm.querySelector("#password-recheck");
  const pwMsg = joinForm.querySelector(".password-check");

  // 비밀번호 입력 시 초록색 체크 표시
  if (password.value !== null) {
    password.classList.add("valid-password");
    password.classList.remove("invalid-password");
  }

  // 비밀번호 일치 확인
  if (password.value !== passwordRecheck.value) {
    pwMsg.textContent = "비밀번호가 일치하지 않습니다.";
    pwMsg.classList.add("join-error");
    passwordRecheck.classList.remove("valid-password");
    passwordRecheck.classList.add("invalid-password");
  } else {
    pwMsg.textContent = "";
    pwMsg.classList.remove("join-error");
    passwordRecheck.classList.remove("invalid-password");
    passwordRecheck.classList.add("valid-password");
  }
});
