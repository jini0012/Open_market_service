// 상품 클릭 시 document.title HODU : 상품 이름으로 변경되게 적용
// 모달창 임시 스크립트
// 로그인이 되지 않은 상태일때만 버튼을 눌렀을 때 모달창이 떠야한다.
// 로그인 예 버튼을 누르면 로그인 창으로 이동, 아니오를 누르면 모달창이 닫힌다.

const dialog = document.querySelector("dialog");
const closeDialog = dialog.querySelector(".closeModal");
const yesBtn = dialog.querySelector(".yesBtn");
const noBtn = dialog.querySelector(".noBtn");
const buyBtn = document.querySelector(".buy");
const cartBtn = document.querySelector(".cart");

// 바로 구매 버튼 클릭 시 로그인 모달
buyBtn.addEventListener("click", () => {
  dialog.showModal();
});

// 장바구니 버튼 클릭 시 로그인 모달
cartBtn.addEventListener("click", () => {
  dialog.showModal();
});

// 모달창 닫기
closeDialog.addEventListener("click", () => {
  dialog.close();
});

// 예 버튼을 눌렀을 떄 로그인창으로 이동
yesBtn.addEventListener("click", () => {
  location.href = "login.html";
});

// 아니오 버튼을 눌렀을 때 모달창 닫기
noBtn.addEventListener("click", () => {
  dialog.close();
});

// 마이페이지 모달 만들기

// 판매자 사이트의경우 바로구매와 장바구니를 disabled(클래스 부여 또는 속성 적용)

const form = document.querySelector(".countForm");
const Btns = form.querySelectorAll("button");
const num = form.num;
let total = form.querySelector(".count");
let totalPrice = form.querySelector(".totalPrice");
const defaultPrice = totalPrice.textContent
  .split("")
  .filter((elem) => elem >= 0)
  .join("");

console.log(total);
console.log(defaultPrice);

// 재고 없는 경우 plus 버튼 disabled
if (plus.disabled === true) {
  plus.classList.add("plusDisabled");
  plus.querySelector("img").src = "./assets/icon-plus-line-disabled.svg";
}

// - 버튼 또는 + 버튼 클릭 시 input.value 변경
let count = 1;
Btns.forEach((button) => {
  button.addEventListener("click", () => {
    if (count >= 1) {
      if (button.id === "plus") {
        count++;
      } else if (button.id === "minus") {
        count--;
      }
    } else {
      count = 1;
    }
    num.value = count;
    // 총 수량 함께 변경 및 금액 변경
    total.textContent = num.value;
    totalPrice.textContent = num.value * defaultPrice;
  });
});
