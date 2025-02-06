const uploadForm = document.querySelector("form");

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

const radioButtons = uploadForm.querySelectorAll('input[name="delivery"]');
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
