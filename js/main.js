// 판매자 페이지는 토큰이 다를거같으니까? 확인하고 토큰값이 ~~면 판매자 페이지가 보이게끔 (판매자 보이고 장바구니 hidden, 로그인 hidden)

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
