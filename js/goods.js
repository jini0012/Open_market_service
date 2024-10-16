// 상품 클릭 시 document.title HODU : 상품 이름으로 변경되게 적용
// 모달창 임시 스크립트
// 로그인이 되지 않은 상태일때만 버튼을 눌렀을 때 모달창이 떠야한다.
// 로그인 예 버튼을 누르면 로그인 창으로 이동, 아니오를 누르면 모달창이 닫힌다.

const dialog = document.querySelector("dialog");
const closeDialog = dialog.querySelector(".closeModal");
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
