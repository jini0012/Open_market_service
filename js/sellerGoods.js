const uploadForm = document.querySelector("form");
const radioButtons = uploadForm.querySelectorAll('input[name="delivery"]');
let radioSelected = "PARCEL";

uploadForm.addEventListener("input", () => {
  let count = 0;
  inputs.forEach((input) => {
    if (input.value !== "") {
      count += 1;
    }
  });

  if (count >= 6) {
    uploadForm.querySelectorAll("button")[1].disabled = false;
  } else {
    uploadForm.querySelectorAll("button")[1].disabled = true;
  }

  const selectedRadio = uploadForm.querySelector(
    'input[name="delivery"]:checked'
  );
  if (selectedRadio) {
    radioSelected = selectedRadio.value;
  }
});

const imageFile = uploadForm.querySelector('input[type="file"]');
const preview = uploadForm.querySelector(".image label");

imageFile.addEventListener("input", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    preview.style.background = `url("${reader.result}") no-repeat center`;
    preview.style.backgroundSize = "contain";
  };

  if (!!file) {
    reader.readAsDataURL(file);
  }
});

const inputs = uploadForm.querySelectorAll("div input");
const productName = inputs[0];
const productPrice = inputs[1];
const productFee = inputs[4];
const productStock = inputs[5];

function numberToString(e) {
  let value = e.target.value.replace(/[^\d]/g, ""); // 모든 문자 제거
  if (value) {
    value = Number(value).toLocaleString("ko-KR");
  }
  e.target.value = value;
}

productName.addEventListener("input", (e) => {
  const lengthText = e.target.parentElement.querySelector("span");
  lengthText.innerHTML =
    productName.value.length > 20 ? `20/20` : `${productName.value.length}/20`;
});

productPrice.addEventListener("input", (e) => {
  numberToString(e);
});
productFee.addEventListener("input", (e) => {
  numberToString(e);
});
productStock.addEventListener("input", (e) => {
  numberToString(e);
});

const cancelBtn = uploadForm.querySelector("button");
const detailInfo = uploadForm.querySelector("textarea");

cancelBtn.addEventListener("click", () => {
  radioButtons.forEach((radio) => {
    radio.checked = false;
  });
  imageFile.value = "";
  preview.style.background = "revert-layer";
  inputs.forEach((input) => {
    input.value = "";
  });
  detailInfo.value = "";
});

function uploadProduct() {
  const formData = new FormData();

  formData.append("name", productName.value);
  formData.append("info", detailInfo.value);
  formData.append("image", imageFile.files[0]);
  formData.append("price", parseInt(productPrice.value.replace(/,/g, "")));
  formData.append("shipping_method", radioSelected);
  formData.append("shipping_fee", parseInt(productFee.value.replace(/,/g, "")));
  formData.append("stock", parseInt(productStock.value.replace(/,/g, "")));

  fetch(`${fetchUrl}/products/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      console.error("Error:", response);
    }
    alert("상품 등록이 완료되었습니다.");
    location.href = "sellerDashBoard.html";
  });
}

uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  uploadProduct();
});
