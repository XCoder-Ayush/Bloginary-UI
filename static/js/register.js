const registerForm = document.querySelector("#register-form");
registerForm.addEventListener("submit", registerUser);

async function registerUser() {
  event.preventDefault();
  const formData = new FormData();

  //   console.log(formData.get("username"));
  //   const data = Object.fromEntries(formData);
  //   console.log(data);

  const firstName = document.querySelector("#first-name").value;
  const lastName = document.querySelector("#last-name").value;
  const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const jsonData = {
    firstName,
    lastName,
    username,
    email,
    password,
  };

  const imageFile = document.getElementById("image-file").files[0];
  if(imageFile!=undefined){
    formData.append("imageFile", imageFile, "image-file.jpg");
  }

  formData.append("jsonData", JSON.stringify(jsonData));

  console.log(jsonData);
  console.log(imageFile);
  console.log(formData);

  try {
    const response = await fetch("http://localhost:3001/api/v1/auth/register", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("User Registered Successfully");
      window.location.href='http://127.0.0.1:5500/views/login.html'
    } else {
      console.error("Upload failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
