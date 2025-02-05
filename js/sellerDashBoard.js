const user = JSON.parse(decodeURIComponent(localStorage.user)).name;

const main = document.querySelector("main");
main.querySelector("h2 span").textContent = user;

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
                <button>수정</button>
                <button class="deleteBtn">삭제</button>
              </div>
            </article>
          </li>`;
        })
        .join("");
    });
}

if (!!user) {
  loadOrderList();
}
