const fetchUrl = "https://api.wenivops.co.kr/services/open-market";

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("orderItem");
  localStorage.removeItem("type");
  localStorage.removeItem("user");
  location.reload(true);
}

function getAccessToken() {
  fetch(`${fetchUrl}/accounts/token/refresh/`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: localStorage.refreshToken,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        alert(
          "로그인 세션이 만료되어 로그아웃되었습니다. 재로그인을 진행해주세요."
        );
        logout();
      }
      return response.json();
    })
    .then((json) => {
      localStorage.setItem("accessToken", `${json.access}`);
    })
    .catch((error) => console.error(error));
}

if (localStorage.accessToken) {
  if (localStorage.accessToken !== "undefined") {
    setInterval(() => {
      getAccessToken();
    }, 299000);
  }

  setTimeout(() => {
    alert(
      "로그인 세션이 만료되어 로그아웃되었습니다. 재로그인을 진행해주세요."
    );
    logout();
  }, 86400000);
}
