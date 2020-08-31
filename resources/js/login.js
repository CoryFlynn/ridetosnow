function submitForm() {
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log("js " + email + " " + password);
  if (re.test(String(email).toLowerCase())) {
    $.ajax({
      url: `/login`, // the Heroku DB
      method: "POST",
      data: {
        email: email,
        password: password
      },
      success: (data) => {
        console.log(data);
        if (data == "ERROR") {
          document.getElementById("error").innerHTML = "Invalid login credentials";
        } else {
          console.log(data);
          sessionStorage.setItem("user_id", data[0].user_id);
          window.location.href = "Home.html";
        }
      }
    });
  } else {
    alert("Please insert a valid email");
  }
}
