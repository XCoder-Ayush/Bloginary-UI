async function loginUser(username, password) {
  const url = "http://localhost:3001/api/v1/auth";

  const data = {
    username,
    password
  };

  const response=await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const resp=await response.json();
  // console.log(resp);

  if(resp.success){
    const token=resp.token;
    localStorage.setItem('jwtToken',token)
    window.location.href='http://127.0.0.1:5500/views/home.html'
  }else{
    console.log(resp.message)
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    loginUser(username, password);
  });
