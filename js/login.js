// 로그인 버튼 클릭시 유효성 검사
// 아이디, 비밀번호 공란 또는 비밀번호만 입력: 아이디를 입력해주세요.
// 아이디만 입력 : 비밀번호를 입력해주세요.
// 아이디, 비밀번호가 일치하지 않을 경우 : 아이디 또는 비밀번호가 일치하지 않습니다.
const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const iptId = loginForm.id;
  const iptPw = loginForm.password;
  const msg = loginForm.querySelector("p");
  msg.classList.add("login-error");

  const idValue = iptId.value;
  const pwValue = iptPw.value;
  console.log(iptId);

  // input 태그 내 value 값이 있는지 검사
  if ((!idValue && !pwValue) || (!idValue && pwValue)) {
    msg.innerText = `아이디를 입력해주세요`;
  } else if (!pwValue) {
    msg.innerText = `비밀번호를 입력해주세요`;
  } else {
    msg.innerText = ``;
  }

  // 아이디, 비밀번호의 유효성 검사
});
