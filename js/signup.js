const selectAccountTypeBtns = document.querySelectorAll(".join-btns li button");
const sellerOnly = document.querySelectorAll(".seller-only");

const joinForm = document.querySelector(".join-form");
const phoneSelectBtn = joinForm.querySelector(".selectBtn");
const phone1 = joinForm.querySelectorAll("#phone1 li");
const Msgs = joinForm.querySelectorAll("p[class*=Msg]");

const id = joinForm.id;
const duplicateBtns = joinForm.querySelectorAll(".duplicate-check");
const idMsg = Msgs[0];
const pwMsg = Msgs[1];
const pwCheckMsg = Msgs[2];
const nameMsg = Msgs[3];
const phoneMsg = Msgs[4];
const businessNumMsg = Msgs[5];
const storeNameMsg = Msgs[6];

selectAccountTypeBtns.forEach((button) => {
  button.addEventListener("click", () => {
    joinForm.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.style.borderColor = "#c4c4c4";
    });
    Msgs.forEach((errorMsg) => {
      errorMsg.textContent = "";
    });

    if (button === selectAccountTypeBtns[0]) {
      selectAccountTypeBtns[0].classList.add("active");
      selectAccountTypeBtns[1].classList.remove("active");
      sellerOnly.forEach((elem) => {
        elem.hidden = true;
      });
    } else {
      selectAccountTypeBtns[0].classList.remove("active");
      selectAccountTypeBtns[1].classList.add("active");
      sellerOnly.forEach((elem) => {
        elem.hidden = false;
      });
    }
  });
});

function selectAccountType() {
  if (selectAccountTypeBtns[0].classList.contains("active")) {
    return "BUYER";
  } else if (selectAccountTypeBtns[1].classList.contains("active")) {
    return "SELLER";
  }
}

phoneSelectBtn.addEventListener("click", () => {
  phoneSelectBtn.classList.toggle("selected");
  if (phoneSelectBtn.classList.contains("selected")) {
    joinForm.querySelector(".optionList").style.display = "unset";
    phone1.forEach((elem) => {
      elem.addEventListener("click", () => {
        phoneSelectBtn.textContent = elem.textContent;
        joinForm.querySelector(".optionList").style.display = "none";
        phoneSelectBtn.classList.remove("selected");
      });
    });
  } else {
    joinForm.querySelector(".optionList").style.display = "none";
  }
});

// 아이디 인증
duplicateBtns[0].addEventListener("click", (e) => {
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
        idMsg.textContent = json.error;
        idMsg.className = "idMsg invalidColor";
        id.style["border-color"] = "#eb5757";
        // 아이디가 입력되지 않은 경우
      } else {
        idMsg.textContent = "필수 정보 입니다.";
        idMsg.className = "idMsg invalidColor";
      }
    })
    .catch((error) => console.error(error));
});

// 사업자등록번호 인증
duplicateBtns[1].addEventListener("click", (e) => {
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
      if (json.error) {
        businessNumMsg.hidden = false;
        businessNumMsg.className = "businessNumMsg invalidColor";

        if (json.error === "이미 등록된 사업자등록번호입니다.") {
          businessNumMsg.textContent = "해당 사업자등록번호는 이미 존재합니다.";
        } else {
          businessNumMsg.textContent = "사업자등록번호를 다시 입력해주세요.";
        }
      } else {
        businessNumMsg.textContent = "사용 가능한 사업자등록번호 입니다.";
        businessNumMsg.className = "businessNumMsg validColor";
      }
    })
    .catch((error) => console.error(error));
});

joinForm.addEventListener("input", (e) => {
  const password = joinForm.password;
  const passwordRecheck = joinForm.querySelector("#password-recheck");
  const joinBtn = joinForm.querySelector(".signup-btn");
  const input = joinForm.querySelectorAll("input");

  const currentIndex = Array.from(input).indexOf(e.target);
  // 현재 입력중인 input의 인덱스

  for (const [index, elem] of input.entries()) {
    // 현재 입력중인 input인덱스보다 작고 input 값이 비었을 때
    if (index < currentIndex && elem.validity.valueMissing) {
      Msgs[index].hidden = false;
      if (selectAccountTypeBtns[0].classList.contains("active")) {
        businessNumMsg.hidden = true;
      }
      Msgs[index].textContent = "필수 정보 입니다.";
      input[index].style["border-color"] = "#eb5757";
    }
  }

  //비밀번호 input 초록색 체크 표시 (focus 이벤트 없이 작동)
  if (password.validity.valid) {
    password.classList.add("valid-passwordImg");
    password.classList.remove("invalid-passwordImg");
  } else {
    password.classList.remove("valid-passwordImg");
    password.classList.add("invalid-passwordImg");
  }

  // 비밀번호 focusout 이벤트 에러 메세지, input boeder 색상 변경(입력창에서 포커스를 잃으면 유효성 검사 진행)
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
    // 비밀번호 값이 유효하면서 비밀번호 재확인에 값이 있을 때 ||  비밀번호 값이 없는 데 비밀번호 재확인을 입력한 경우
    if (password.value !== passwordRecheck.value) {
      // 비밀번호 값과 비밀번호 재확인 값이 일치하지 않다면 아래 동작
      pwCheckMsg.textContent = "비밀번호가 일치하지 않습니다.";
      pwCheckMsg.classList.add("invalidColor");
      passwordRecheck.style["border-color"] = "#eb5757";
      passwordRecheck.classList.remove("valid-passwordImg");
      passwordRecheck.classList.add("invalid-passwordImg");
    } else {
      // 비밀번호 === 비밀번호 재확인 값 일경우 동작
      pwCheckMsg.textContent = "";
      passwordRecheck.style["border-color"] = "";
      pwCheckMsg.classList.remove("invalidColor");
      passwordRecheck.classList.remove("invalid-passwordImg");
      passwordRecheck.classList.add("valid-passwordImg");
    }
  }

  // 모든 input 값이 유효한지 확인
  let count = 0;
  input.forEach((elem) => {
    if (elem.validity.valid) {
      count += 1;
    }
  });
  if (
    count >= 9 &&
    joinForm.checkbox.checked &&
    idMsg.textContent === "멋진 아이디네요 :)"
  ) {
    joinBtn.removeAttribute("disabled");
  } else {
    joinBtn.setAttribute("disabled", "");
  }
});

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Buyer 계정 생성
  if (selectAccountTypeBtns[0].classList.contains("active")) {
    fetch("https://estapi.openmarket.weniv.co.kr/accounts/buyer/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: id.value,
        password: password.value,
        name: joinForm.name.value,
        phone_number: `${phoneSelectBtn.textContent}${phone2.value}${phone3.value}`,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // 휴대폰 번호가 이미 등록된 회원의 번호인 경우 가입 불가
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
    // Seller 계정 생성
  } else if (selectAccountTypeBtns[1].classList.contains("active")) {
    fetch("https://estapi.openmarket.weniv.co.kr/accounts/seller/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: id.value,
        password: password.value,
        name: joinForm.name.value,
        phone_number: `${phoneSelectBtn.textContent}${phone2.value}${phone3.value}`,
        company_registration_number: `${joinForm.businessNum.value}`,
        store_name: `${joinForm.storeName.value}`,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // 휴대폰 번호가 이미 등록된 회원의 번호인 경우 가입 불가
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
