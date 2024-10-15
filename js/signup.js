// 회원가입 구매회원, 판매회원 버튼 전환
const joinBtns = document.querySelectorAll(".join-btns li button");
const sellerOnly = document.querySelectorAll(".seller-only");
joinBtns.forEach((button) => {
  button.addEventListener("click", () => {
    // 버튼 전환 시 id, pw 알림메세지 초기화
    idMsg.textContent = "";
    pwMsg.textContent = "";

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
const idMsg = joinForm.querySelector(".id-check");
const idBtn = joinForm.querySelectorAll(".duplicate-check");
idBtn[0].addEventListener("click", (e) => {
  e.preventDefault();
  // if 중복확인 체크 후 사용중인 아이디인경우
  idMsg.textContent = "이미 사용 중인 아이디 입니다.";
  idMsg.classList.add("id-error");
  idMsg.classList.remove("id-check");

  // if 사용 가능한 아이디인 경우
  idMsg.textContent = "멋진 아이디네요 :)";
  idMsg.classList.remove("id-error");
  idMsg.classList.add("id-check");
});

// 비밀번호 유효성 검증
// 비밀번호가 유효하게 입력되었으면 체크 표시 -> 초록색 체크 표시
// 비밀번호 !== 비밀번호 재확인 : 비밀번호가 일치하지 않습니다.
const password = joinForm.querySelector("#password");
const passwordRecheck = joinForm.querySelector("#password-recheck");
const pwMsg = joinForm.querySelector(".password-check");

joinForm.addEventListener("input", (e) => {
  // 비밀번호 입력값 유효할 때 초록색 체크 표시
  if (password.validity.valid) {
    password.classList.add("valid-password");
    password.classList.remove("invalid-password");
  }

  // 비밀번호 일치 확인
  if (password.validity.valid && !passwordRecheck.validity.valueMissing) {
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
  }
});

// API 기능 구현

// fetch('https://estapi.openmarket.weniv.co.kr/accounts/buyer/signup/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     "username": String,
// 		"password": String,
// 		"name": String,
// 		"phone_number": String,
//   })
// })

// fetch("https://estapi.openmarket.weniv.co.kr/")
//   .then((response) => response)
//   .then((json) => console.log(json))
//   .catch((error) => console.error(error));

console.log(joinForm.querySelector("#id"));
