const user = JSON.parse(decodeURIComponent(localStorage.user)).name;

const main = document.querySelector("main");
main.querySelector("h2 span").textContent = user;
const upLoadBtn = main.querySelector(".uploadBtn");

upLoadBtn.addEventListener("click", () => {
  location.href = "sellerGoods.html";
});

function deleteProduct(productId) {
  fetch(`${fetchUrl}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (!response.ok) {
      console.error("Error", error);
    }
    loadOrderList();
  });
}

function updateProduct(id) {
  location.href = `sellerGoodsUpdate.html?id=${id}`;
}

function loadOrderList() {
  const goodsList = main.querySelector(".goods");
  fetch(`${fetchUrl}/${user}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error", error);
      }
      return response.json();
    })
    .then((json) => {
      main.querySelector("nav ul li span").textContent = `(${json.count})`;

      const sellerProducts = json.results;
      goodsList.innerHTML = sellerProducts
        .map((result) => {
          return `<li>
            <article>
              <img src="${result.image}" alt="${result.info}" />
              <div class="goods-details">
                <h3>${result.name}</h3>
                <p>재고 : <span>${result.stock}</span>개</p>
              </div>
              <p class="price">${result.price.toLocaleString("ko-KR")}원</p>
              <div>
                <button onclick="updateProduct(${result.id})">수정</button>
                <button class="deleteBtn" onclick="deleteProduct(${
                  result.id
                })">삭제</button>
              </div>
            </article>
          </li>`;
        })
        .join("");
    });
}
if (localStorage.getItem("type") === "SELLER" && !!user) {
  loadOrderList();
} else {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}
