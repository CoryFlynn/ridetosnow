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
  var dY = $("#isDriver").is(":checked");
  console.log(dY);
  var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log(d);
  if (regEx.test(String(email.value).toLowerCase())) {
    $.ajax({
      url: `/signup`,
      method: "POST",
      data: {
        email: email.value,
        password: password.value,
        first: first_name.value,
        last: last_name.value,
        isDriver: d,
        is18: i
      },
      success: (data) => {
        sessionStorage.setItem("user_id", data[0].user_id);
        $.ajax({
          url: `/Home.html`, // the local Node server
          method: "GET"
        });
      }
    });
  }
}
