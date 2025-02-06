const uploadForm = document.querySelector("form");

const imageFile = uploadForm.querySelector('input[type="file"]');
imageFile.addEventListener("input", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const preview = uploadForm.querySelector(".image label");
    preview.style.background = `url("${reader.result}") no-repeat center`;
    preview.style.backgroundSize = "contain";
  };

  if (!!file) {
    reader.readAsDataURL(file);
  }
});
