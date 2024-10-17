const products = document.querySelectorAll("article");
// 상품 전체 불러오기
fetch("https://estapi.openmarket.weniv.co.kr/products/")
  .then((response) => response.json())
  .then((json) => {
    // 불러온 후 이미지, 값 등을 페이지에 넣는 방식으로 저장
    products.forEach((product, index) => {
      product.querySelector("img").src = `${json.results[index].image}`;
      product.querySelector(
        "a"
      ).href = `https://estapi.openmarket.weniv.co.kr/products/${[index + 1]}`;
      product.querySelector("p").textContent = `${json.results[index].name}`;
      product.querySelector("h3").textContent = `${json.results[index].info}`;
      product.querySelector(
        "span"
      ).textContent = `${json.results[index].price}`;

      // 상품을 눌렀을 때 상세페이지로 이동하기 => 상품 상세 페이지 + 변경된 이미지 + 내용 추가 필요
      product.addEventListener("click", (e) => {});
    });
  })
  .catch((error) => console.error(error));
