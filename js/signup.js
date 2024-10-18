// 구현할 기능

// 1. 비밀번호 유효성검사
// 지정된 형식, 문자 외로 비밀번호를 작성한 경우 : border red / 8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.
// 비밀번호가 유효한경우 -> 초록체크 / border-color none

// 2. 비밀번호 재확인 유효성검사
// 비밀번호가 일치 하지 않을 경우 => border red / 비밀번호가 일치하지 않습니다.
// 비밀번호 재확인이 유효한경우(비밀번호와 값이 같은 경우) => 초록체크 / border-color none
// 비밀번호를 입력하지 않고 재확인을 입력한 경우 => border red / 비밀번호가 일치하지 않습니다.

// 3. 필수정보 입니다.
// input이 invalid할때 p에 필수 정보입니다 값을 넣는 방법?
// 또는 저번처럼 forEach문이나 다른 방법 있는지 확인

const joinBtns = document.querySelectorAll(".join-btns li button");
const sellerOnly = document.querySelectorAll(".seller-only");

const joinForm = document.querySelector(".join-form");
const Msgs = joinForm.querySelectorAll("p[class*=Msg]");

const id = joinForm.id;
const duplicateBtn = joinForm.querySelectorAll(".duplicate-check");
const idMsg = Msgs[0];
const pwMsg = Msgs[1];
const pwCheckMsg = Msgs[2];
const nameMsg = Msgs[3];
const phoneMsg = Msgs[4];
const businessNumMsg = Msgs[5];
const storeNameMsg = Msgs[6];

/* 구매회원가입, 판매회원가입 버튼 click 이벤트 발생 시 */

// 회원가입 구매회원, 판매회원 버튼 전환
joinBtns.forEach((button) => {
  button.addEventListener("click", () => {
    // 버튼 전환 시 id, pw 알림메세지 초기화
    idMsg.textContent = "";
    pwCheckMsg.textContent = "";

    if (button === joinBtns[0]) {
      joinBtns[0].classList.add("active");
      joinBtns[1].classList.remove("active");
      sellerOnly.forEach((elem) => {
        elem.hidden = true;
      });
    } else {
      joinBtns[0].classList.remove("active");
      joinBtns[1].classList.add("active");
      sellerOnly.forEach((elem) => {
        elem.hidden = false;
      });
    }
  });
});

// 회원가입 타입을 지정하는 함수
function joinType() {
  if (joinBtns[0].classList.contains("active")) {
    return "BUYER";
  } else if (joinBtns[1].classList.contains("active")) {
    return "SELLER";
  }
}

// 셀렉트박스 커스텀
joinForm.phone1.addEventListener("click", () => {
  // 셀렉트박스 클릭 시 selected 클래스 추가(css 적용)
  phone1.classList.add("selected");
});

/* 중복확인 버튼 click 이벤트 발생 시 */

// 아이디 중복확인
duplicateBtn[0].addEventListener("click", (e) => {
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
      if (!json.error) {
        // json 에러가 아닐때
        if (json.message == "사용 가능한 아이디입니다." && id.validity.valid) {
          // 20자 이내의 영문,소문자, 대문자,숫자일때 > 로그인
          idMsg.textContent = "멋진 아이디네요 :)";
          idMsg.className = "idMsg validColor";
        } else {
          // pattern이 맞지 않으면 > 로그인 불가
          idMsg.textContent =
            "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.";
          idMsg.className = "idMsg invalidColor";
        }
        // 이미 있는 아이디 > 로그인 불가
      } else if (json.error == "이미 사용 중인 아이디입니다.") {
        idMsg.textContent = "이미 사용 중인 아이디 입니다.";
        idMsg.className = "idMsg invalidColor";
        id.style["border-color"] = "#eb5757";
        // 아이디가 입력되지 않은 경우
      } else {
        idMsg.textContent = "필수 정보 입니다.";
      }
    })
    .catch((error) => console.error(error));
});

// 사업자등록번호 중복확인
// 이미 사용중인 사업자등록번호인경우 :
duplicateBtn[1].addEventListener("click", (e) => {
  e.preventDefault();
  fetch(
    "https://estapi.openmarket.weniv.co.kr/accounts/seller/validate-registration-number/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_registration_number: `${joinForm.businessNum.value}`,
      }),
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      // 사업자번호가 유효하지 않을 경우 경고 메세지 출력
      if (json.error) {
        businessNumMsg.hidden = false;
        businessNumMsg.textContent = "사업자등록번호를 다시 입력해주세요.";
      } else {
        businessNumMsg.textContent = "";
      }
    })
    .catch((error) => console.error(error));
});
/* form 태그 input 이벤트 발생 시 */

// 비밀번호 유효성 검증 및 가입하기 버튼 활성화

joinForm.addEventListener("input", (e) => {
  const password = joinForm.password;
  const passwordRecheck = joinForm.querySelector("#password-recheck");
  const joinBtn = joinForm.querySelector(".signup-btn");
  const input = joinForm.querySelectorAll("input");

  // 상단 input-box가 채워지지 않은 상태에서 하단 input-box에 입력하는 경우 상단 input-box에 '필수 정보입니다' 라는 오류 메세지 띄움
  // 다시 확인!!!!!!!!!!!!!!!!!
  // 비밀번호 일치확인 안보이는 오류
  // input.forEach((elem, index) => {
  //   if (elem.validity.valueMissing) {
  //     p[index].hidden = false;
  //   } else {
  //     p[index].hidden = true;
  //   }
  // });

  // 포커스 이벤트 없어도 바로 작동!!!
  // 비밀번호 입력값 유효할 때 초록색 체크 표시
  if (password.validity.valid) {
    password.classList.add("valid-passwordImg");
    password.classList.remove("invalid-passwordImg");
  } else {
    // 비밀번호 입력값이 유효하지 않을 때
    password.classList.remove("valid-passwordImg");
    password.classList.add("invalid-passwordImg");
  }

  // 비밀번호를 입력하고 입력창에서 포커스를 잃으면 유효성 검사 진행
  password.addEventListener("focusout", () => {
    if (password.validity.valueMissing) {
      // 비밀번호에 값이 없는 경우
      password.style["border-color"] = "";
      pwMsg.textContent = "";
    } else if (!password.validity.valid) {
      // 비밀번호 값이 유효하지 않은 경우
      password.style["border-color"] = "#eb5757";
      pwMsg.textContent =
        "8자이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
    } else if (password.validity.valid) {
      // 비밀번호 값이 있고 유효한 경우
      password.style["border-color"] = "";
      pwMsg.textContent = "";
    }
  });

  // 비밀번호와 비밀번호 재확인 일치 확인
  if (
    (password.validity.valid && !passwordRecheck.validity.valueMissing) ||
    (!password.validity.valid && !passwordRecheck.validity.valueMissing)
  ) {
    // 비밀번호 값이 유효하면서 비밀번호 재확인에 값이 있을 때
    // 그리고 비밀번호 값이 없는 데 비밀번호 재확인을 입력한 경우
    if (password.value !== passwordRecheck.value) {
      // 비밀번호 값과 비밀번호 재확인 값이 일치하지 않다면 아래 동작
      pwCheckMsg.textContent = "비밀번호가 일치하지 않습니다.";
      pwCheckMsg.classList.add("invalidColor");
      passwordRecheck.style["border-color"] = "#eb5757";
      passwordRecheck.classList.remove("valid-passwordImg");
      passwordRecheck.classList.add("invalid-passwordImg");
    } else {
      pwCheckMsg.textContent = "";
      passwordRecheck.style["border-color"] = "";
      pwCheckMsg.classList.remove("invalidColor");
      passwordRecheck.classList.remove("invalid-passwordImg");
      passwordRecheck.classList.add("valid-passwordImg");
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
  if (
    count >= 9 &&
    joinForm.checkbox.checked &&
    idMsg.textContent === "멋진 아이디네요 :)" // 아이디 중복확인이 되었을 경우 활성화
  ) {
    joinBtn.removeAttribute("disabled");
  } else {
    joinBtn.setAttribute("disabled", "");
  }
});

/* 가입하기 버튼 클릭 시 계정 생성 */
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // 구매회원가입 버튼을 누른 경우 : 구매회원계정 생성
  if (joinBtns[0].classList.contains("active")) {
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
          location.href = "login.html";
        }
      })
      .catch((error) => console.error(error));
    // 판매회원가입 버튼을 누른 경우 : 판매회원계정 생성
  } else if (joinBtns[1].classList.contains("active")) {
    fetch("https://estapi.openmarket.weniv.co.kr/accounts/seller/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: id.value,
        password: password.value,
        name: joinForm.name.value,
        phone_number: `${phone1.value}${phone2.value}${phone3.value}`,
        company_registration_number: `${joinForm.businessNum.value}`,
        store_name: `${joinForm.storeName.value}`,
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
          location.href = "login.html";
        }
      })
      .catch((error) => console.error(error));
  }
});
