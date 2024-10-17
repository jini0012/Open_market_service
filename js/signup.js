/* 구현되어야 하는 기능 */
// 필수정보입니다
// 비밀번호 유효성 검사 : 8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요. -> 계정 비밀번호와 달라서 추후 구현

const joinBtns = document.querySelectorAll(".join-btns li button");
const sellerOnly = document.querySelectorAll(".seller-only");

const joinForm = document.querySelector(".join-form");
const id = joinForm.id;
const idMsg = joinForm.querySelector(".validColor");
const idBtn = joinForm.querySelectorAll(".duplicate-check");
const pwMsg = joinForm.querySelector(".password-check");

/* 구매회원가입, 판매회원가입 버튼 click 이벤트 발생 시 */

// 회원가입 구매회원, 판매회원 버튼 전환
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

// 셀렉트박스 커스텀
joinForm.phone1.addEventListener("click", () => {
  // 셀렉트박스 클릭 시 selected 클래스 추가(css 적용)
  phone1.classList.add("selected");
});

/* 중복확인 버튼 click 이벤트 발생 시 */

// 아이디 중복확인
// 이미 사용중인 아이디인경우 : 이미 사용 중인 아이디 입니다.
// 사용 가능한 아이디인 경우 : 멋진 아이디네요 :)

idBtn[0].addEventListener("click", (e) => {
  e.preventDefault();
  fetch("https://estapi.openmarket.weniv.co.kr/accounts/validate-username/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: id.value,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      // console.log(json);
      if (json.message == "사용 가능한 아이디입니다." && id.validity.valid) {
        idMsg.textContent = "멋진 아이디네요 :)";
        idMsg.classList.remove("invalidColor");
        idMsg.classList.add("validColor");
        id.style["border-color"] = "";
      } else if (json.error == "이미 사용 중인 아이디입니다.") {
        idMsg.textContent = "이미 사용 중인 아이디 입니다.";
        idMsg.classList.remove("validColor");
        idMsg.classList.add("invalidColor");
        id.style["border-color"] = "#eb5757";
      } else {
        idMsg.textContent =
          "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.";
        idMsg.classList.remove("validColor");
        idMsg.classList.add("invalidColor");
        id.style["border-color"] = "#eb5757";
      }
    })
    .catch((error) => console.error(error));
});

/* form 태그 input 이벤트 발생 시 */

// 비밀번호 유효성 검증 및 가입하기 버튼 활성화
// 비밀번호가 유효하게 입력되었으면 체크 표시 -> 초록색 체크 표시
// 비밀번호 !== 비밀번호 재확인 : 비밀번호가 일치하지 않습니다.

joinForm.addEventListener("input", (e) => {
  const password = joinForm.password;
  const passwordRecheck = joinForm.querySelector("#password-recheck");

  const joinBtn = joinForm.querySelector(".signup-btn");
  const input = joinForm.querySelectorAll("input");

  // 상단 input-box가 채워지지 않은 상태에서 하단 input-box에 입력하는 경우 상단 input-box에 '필수 정보입니다' 라는 오류 메세지 띄움
  // 다시 확인!!!!!!!!!!!!!!!!!
  // 비밀번호 일치확인 안보이는 오류
  const p = joinForm.querySelectorAll("p");
  input.forEach((elem, index) => {
    if (elem.validity.valueMissing) {
      p[index].classList.remove("hidden");
      // console.log(`${index}: ${p[index].classList}`);
    } else {
      p[index].classList.add("hidden");
    }
  });

  // 비밀번호 필수 정보 알림

  // 비밀번호 입력값 유효할 때 초록색 체크 표시
  if (password.validity.valid) {
    password.classList.add("valid-password");
    password.classList.remove("invalid-password");
  } else {
    password.classList.remove("valid-password");
    password.classList.add("invalid-password");
  }

  // 비밀번호 일치 확인
  if (password.validity.valid && !passwordRecheck.validity.valueMissing) {
    if (password.value !== passwordRecheck.value) {
      pwMsg.textContent = "비밀번호가 일치하지 않습니다.";
      pwMsg.classList.add("passwordInvalid");
      passwordRecheck.classList.remove("valid-password");
      passwordRecheck.classList.add("invalid-password");
    } else {
      pwMsg.textContent = "";
      pwMsg.classList.remove("passwordInvalid");
      passwordRecheck.classList.remove("invalid-password");
      passwordRecheck.classList.add("valid-password");
    }
  }

  // 모든 값이 들어가있을 때 가입하기 버튼 사용 가능
  let count = 0;
  input.forEach((elem) => {
    if (elem.validity.valid) {
      count += 1;
    }
  });
  // 모든 값이 들어가있고, checkbox가 체크 되어있을 때 가입하기 버튼 활성화
  if (count >= 9 && joinForm.checkbox.checked) {
    joinBtn.removeAttribute("disabled");
  } else {
    joinBtn.setAttribute("disabled", "");
  }
});

/* 가입하기 버튼 클릭 시 계정 생성 */
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // 구매회원 계정 생성
  // if 문넣어서 buyer이면 적용
  fetch("https://estapi.openmarket.weniv.co.kr/accounts/buyer/signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: id.value,
      password: password.value,
      name: joinForm.name.value,
      phone_number: `${phone1.value}${phone2.value}${phone3.value}`,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.phone_number[0] === "이미 등록된 핸드폰 번호입니다.") {
        joinForm.querySelector(".phoneInvalid").textContent =
          "해당 사용자 전화번호는 이미 존재합니다.";
      } else {
        joinForm.querySelector(".phoneInvalid").textContent = "";
        // 회원가입 완료시 로그인 페이지로 이동
        window.location.href =
          "http://127.0.0.1:5501/001_Project%20%EB%B0%8F%20%EC%8B%A4%EC%8A%B5/Project03_Open_market_service/login.html";
      }
    })
    .catch((error) => console.error(error));

  // 판매회원 계정 생성
  // if문 넣어서 seller이면 적용
});

/* 사업자등록번호 인증 시스템 추가*/
