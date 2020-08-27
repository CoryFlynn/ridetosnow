function getDriverInfo(id, toggle) {
  if (toggle == 0) {
    document.getElementById(id).style.height = "0px";
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.height = "50px";
    document.getElementById(id).style.visibility = "visible";
  }
}

function submitForm() {
  var dY = $("#dYes").is(":checked");
  var dN = $("#dNo").is(":checked");
  var iY = $("#iYes").is(":checked");
  var iN = $("#iNo").is(":checked");
  if (!(dY || dN)) {
    document.getElementById("error").innerHTML = "Please select the Driver option";
    return;
  } else if (dY && !(iY || iN)) {
    document.getElementById("error").innerHTML = "Please answer the question above";
    return;
  } else if (dY && iN) {
    document.getElementById("error").innerHTML = "Drivers must be 18 or older";
    return;
  }
  var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEx.test(String(email.value).toLowerCase())) {
    $.ajax({
      url: `/signup`,
      method: "POST",
      data: {
        email: $("#email").val(),
        password: $("#password").val(),
        first: $("#first_name").val(),
        last: $("#last_name").val(),
        isDriver: dY ? true : false,
        is18: iY ? true : false
      },
      success: (data) => {
        console.log(data);
        if (data == "Nah") document.getElementById("error").innerHTML = "User with this email already exists";
        else {
          sessionStorage.setItem("user_id", data[0].user_id);
          $.ajax({
            url: `/`, // the local Node server
            method: "GET"
          });
        }
      }
    });
  }
}
