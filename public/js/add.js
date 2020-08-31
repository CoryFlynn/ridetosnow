function submitRide() {
  var date = $("#dateTime").val();
  var pay = $("#pay2Input").val();
  var slots = $("#slotsInput").val();
  var resort = $("#resort1").val();
  var description = $("#driverRideDescription").val();
  var start = $("#start1").val();
  $.ajax({
    method: "POST",
    url: "/add",
    data: {
      user_id: sessionStorage.getItem("user_id"),
      date: date,
      pay: pay,
      slots: slots,
      resort: resort,
      description: description,
      start: start
    },
    dataType: "text"
  }).then((data) => {
    console.log("html " + sessionStorage.getItem("user_id"));
  });
}
