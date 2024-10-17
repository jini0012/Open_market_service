// 로그인 버튼 -> access랑 refresh를 location에 저장을 하는데
// 로그아웃했을 때 이부분이 값이 비도록 만들고,
// 로그인을 하고 난 main 창에서 access랑 refresh가 location에 저장이 되어있으면 -> login을 hidden
// 저장이 안되어있으면 마이 페이지를 hidden

// 판매자 페이지는 토큰이 다를거같으니까? 확인하고 토큰값이 ~~면 판매자 페이지가 보이게끔 (판매자 보이고 장바구니 hidden, 로그인 hidden)

// 로그아웃버튼을 누르면 access값, refresh값을 삭제하고 마이페이지 hidden, 로그인 visible

// 마이페이지 버튼 누르면 모달창 open
// 마이페이지는 UI로만 구현하고 로그아웃 버튼 누르면 로그아웃

// 1. 로그인이 되어있을 떄 로그인 버튼이 아닌 마이 페이지 버튼이 보이도록 구현하기.

// console.log(localStorage.accessToken);
// console.log(localStorage.refreshToken);

// 새 access token 요청하기
// fetch("https://estapi.openmarket.weniv.co.kr/accounts/token/refresh/", {
//   method: "post",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     refresh: localStorage.refreshToken,
//   }),
// })
//   .then((response) => response.json())
//   .then((json) => {
//     console.log(json);
// 새로 받은 access token으로 로컬스토리지에 저장
//     localStorage.setItem("accessToken", `${json.access}`);
//   })
//   .catch((error) => console.error(error));
