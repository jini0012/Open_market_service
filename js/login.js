// 로그인 구매회원, 판매회원 버튼 전환
const loginBtns = document.querySelectorAll(".login-btns li button");
loginBtns.forEach((button) => {
  button.addEventListener("click", () => {
    if (button === loginBtns[0]) {
      loginBtns[0].classList.add("active");
      loginBtns[1].classList.remove("active");
    } else {
      loginBtns[1].classList.add("active");
      loginBtns[0].classList.remove("active");
    }
  });
});

// 로그인 버튼 클릭시 유효성 검사
// 아이디, 비밀번호 공란 또는 비밀번호만 입력: 아이디를 입력해주세요.
// 아이디만 입력 : 비밀번호를 입력해주세요.
// 아이디, 비밀번호가 일치하지 않을 경우 : 아이디 또는 비밀번호가 일치하지 않습니다.
const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const idValue = loginForm.id.value;
  const pwValue = loginForm.password.value;
  const msg = loginForm.querySelector("p");
  msg.classList.add("login-error");

  // input 태그 내 value 값이 있는지 검사
  if ((!idValue && !pwValue) || (!idValue && pwValue)) {
    msg.innerText = `아이디를 입력해주세요`;
  } else if (!pwValue) {
    msg.innerText = `비밀번호를 입력해주세요`;
  } else {
    msg.innerText = ``;
  }

  // 아이디, 비밀번호의 유효성 검사
  fetch("https://estapi.openmarket.weniv.co.kr/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: idValue,
      password: pwValue,
      login_type: "BUYER",
      // BUYER : 일반 구매자, SELLER : 판매자
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (!json.error) {
        localStorage.setItem("accessToken", `${json.access}`);
        localStorage.setItem("refreshToken", `${json.refresh}`);
        localStorage.setItem("username", `${json.user.username}`);
        localStorage.setItem("name", `${json.user.name}`);
        localStorage.setItem("phone", `${json.user.phone_number}`);
        localStorage.setItem("type", `${json.user.user_type}`);
        // 로그인 완료 후 페이지 이동
        location.href = "./index.html";
      } else if (pwValue) {
        // 아이디만 입력했을 때 '비밀번호를 입력해주세요'가 나오지 않는 오류 방지
        msg.innerText = `아이디 또는 비밀번호가 일치하지 않습니다.`;
      }
    })
    .catch((error) => console.error(error));
});
