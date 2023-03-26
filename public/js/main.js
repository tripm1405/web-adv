$(document).ready(async () => {
  function showValidate(loginInput) {
    const thisAlert = $(loginInput).parent();
    $(thisAlert).addClass("alert-validate");
  }
  function hideValidate(loginInput) {
    const thisAlert = $(loginInput).parent();
    $(thisAlert).removeClass("alert-validate");
  }
  $(".input").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });
  $(".input-square").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });
  // Login page
  if (location.pathname == "/login") {
    const input = $(".validate-input .input");

    $("#form-login").submit(async (e) => {
      e.preventDefault();
      const username = $("#username").val();
      const password = $("#password").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          $(".progress-spinner").attr("style", "display: none");
          if (data.data.firstLogin) {
            location.href = "/change-password";
          } else {
            location.href = "/";
          }
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Forgot password page
  if (location.pathname == "/forgot-password") {
    const input = $(".validate-input .input-square");

    $("#form-forgot").submit(async (e) => {
      e.preventDefault();
      const email = $("#email").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/forgot-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.status === 200) {
          Alert(data.message, "/login");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Register page
  if (location.pathname == "/register") {
    const input = $(".validate-input .input-square");

    $("#form-register").submit(async (e) => {
      e.preventDefault();
      const phone = $("#phone").val();
      const email = $("#email").val();
      const name = $("#name").val();
      const birthday = $("#birthday").val();
      const address = $("#address").val();
      const cmnd_front = $("#cmnd_front")[0].files[0];
      const cmnd_end = $("#cmnd_end")[0].files[0];

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("name", name);
      formData.append("birthday", birthday);
      formData.append("address", address);
      formData.append("front_cmnd", cmnd_front);
      formData.append("back_cmnd", cmnd_end);

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/register", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          Alert(data.message, "/login");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Change password page
  if (location.pathname == "/change-password") {
    const input = $(".validate-input .input-square");

    $("#form-change").submit(async (e) => {
      e.preventDefault();
      const oldPassword = $("#oldPassword").val() || "";
      const newPassword = $("#newPassword").val();
      const newPassword2 = $("#newPassword2").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      if (newPassword != newPassword2) {
        Alert("Mật khẩu không khớp");
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch("/change-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });
        const data = await response.json();
        if (response.status === 200) {
          Alert(data.message, "/");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Reset password page
  if (location.pathname.match(/\/reset-password\/*/g)) {
    const input = $(".validate-input .input-square");

    $("#form-reset").submit(async (e) => {
      e.preventDefault();
      const newPassword = $("#newPassword").val();
      const newPassword2 = $("#newPassword2").val();

      let invalidInput = false;

      for (let i = 0; i < input.length; i++) {
        if ($(input[i]).val().length == 0) {
          showValidate(input[i]);
          invalidInput = true;
        }
      }

      if (invalidInput) {
        return;
      }

      if (newPassword != newPassword2) {
        Alert("Mật khẩu không khớp");
        return;
      }

      try {
        $(".progress-spinner").attr("style", "display: flex");
        const response = await fetch(location.pathname, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        });
        const data = await response.json();
        if (response.status === 200) {
          Alert(data.message, "/");
        } else {
          Alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  // Home page
  if (location.pathname == "/") {
    $(".function#home").attr(
      "style",
      "background-color: rgba(255, 255, 255, 0.3)"
    );
    // Prevent using functions with the user waiting to activate
    if ($(".current-status").text().trim() !== "Đã xác minh") {
      $(".money-block.hover").attr("data-bs-target", "#xac-minh-modal");
    }
    // Form nap tien
    $("#form-nap-tien").submit(async (e) => {
      e.preventDefault();
      const body = {
        card_number: $("#card-number").val(),
        exp_date: $("#exp-date").val(),
        cvv: $("#cvv").val(),
        amount: $("#amount").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const depositResponse = await fetch("/wallet/deposit", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await depositResponse.json();
      if (depositResponse.status == 200) {
        $("#card-number").val("");
        $("#exp-date").val("");
        $("#cvv").val("");
        $("#amount").val("");
        $(".current-money").text(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").text().trim())
            ) + Number.parseInt(body.amount)
          )
        );
        Alert(data.message);
      } else {
        $("#card-number").val("");
        $("#exp-date").val("");
        $("#cvv").val("");
        $("#amount").val("");
        Alert(data.message);
      }
    });
    // Form rut tien
    $("#form-rut-tien").submit(async (e) => {
      e.preventDefault();
      const body = {
        card_number: $("#w-card-number").val(),
        exp_date: $("#w-exp-date").val(),
        cvv: $("#w-cvv").val(),
        amount: $("#w-amount").val(),
        message: $("#w-message").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const withdrawResponse = await fetch("/wallet/withdraw", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await withdrawResponse.json();
      if (withdrawResponse.status == 200) {
        const isPending =
          data.message == "Thực hiện thành công, chờ admin xác minh";
        $("#w-card-number").val("");
        $("#w-exp-date").val("");
        $("#w-cvv").val("");
        $("#w-amount").val("");
        $("#w-message").val("");
        $(".current-money").text(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").text().trim())
            ) - (isPending ? 0 : Number.parseInt(body.amount * 1.05))
          )
        );
        Alert(data.message);
      } else {
        $("#w-card-number").val("");
        $("#w-exp-date").val("");
        $("#w-cvv").val("");
        $("#w-amount").val("");
        $("#w-message").val("");
        Alert(data.message);
      }
    });
    let tmp_amount = 0;
    // Form chuyen tien
    $("#form-chuyen-tien").submit(async (e) => {
      e.preventDefault();
      const body = {
        phone_number: $("#t-phone-number").val(),
        amount: $("#t-amount").val(),
        message: $("#t-message").val(),
        fee: $("#t-fee").find(":selected").val(),
      };
      tmp_amount = body.amount;
      $(".progress-spinner").attr("style", "display: flex");
      const transferResponse = await fetch("/wallet/transfer", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await transferResponse.json();
      if (transferResponse.status == 200) {
        setTimeout(() => {
          $("#btn-otp").click();
        }, 1000);
      }
      $("#t-phone-number").val("");
      $("#t-amount").val("");
      $("#t-message").val("");
      $("#t-fee").val("");
      Alert(data.message);
    });
    // Form OTP
    $("#form-otp").submit(async (e) => {
      e.preventDefault();
      const body = {
        OTP: $("#otp").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const otpResponse = await fetch("/wallet/otp", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await otpResponse.json();
      if (otpResponse.status == 200) {
        const isPending =
          data.message == "Giao dịch thành công, chờ admin xử lý";
        $(".current-money").text(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").text().trim())
            ) - (isPending ? 0 : Number.parseInt(tmp_amount * 1.05))
          )
        );
      } else {
        setTimeout(() => {
          $("#btn-otp").click();
        }, 1000);
      }
      $("#otp").val("");
      Alert(data.message);
    });
    // Form Mua The
    $("#form-mua-the").submit(async (e) => {
      e.preventDefault();
      const body = {
        nhacungcap: $("#nhacungcap").find(":selected").val(),
        menhgia: $("#menhgia").find(":selected").val(),
        soluong: $("#soluong").find(":selected").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const withdrawResponse = await fetch("/wallet/phonecards", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await withdrawResponse.json();
      if (withdrawResponse.status == 200) {
        $("#nhacungcap").val("");
        $("#menhgia").val("");
        $("#soluong").val("");
        $(".current-money").text(
          MoneyDigit(
            Number.parseInt(
              GetCurrentMoney($(".current-money").text().trim())
            ) - Number.parseInt(body.menhgia * body.soluong)
          )
        );
        $(".card-data").append(`
          <div class="px-5 py-3">
            <div class="d-flex">
              <div class="py-3 col-4">Nhà cung cấp:</div>
              <div class="py-3 col-8">${data.data.nhacungcap}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Mệnh giá:</div>
              <div class="py-3 col-8">${data.data.menhgia}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Số lượng:</div>
              <div class="py-3 col-8">${data.data.soluong}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Tổng tiền:</div>
              <div class="py-3 col-8">${data.data.total_monney}</div>
            </div>
            <div class="d-flex">
              <div class="py-3 col-4">Mã thẻ:</div>
              <div class="py-3 col-8">${data.data.id_card
                .toString()
                .replace(",", "<br/>")}</div>
            </div>
          </div>
        `);
        $("#card-detail").click();
        Alert(data.message);
      } else {
        $("#nhacungcap").val("");
        $("#menhgia").val("");
        $("#soluong").val("");
        Alert(data.message);
      }
    });
  }
  // History page
  if (location.pathname == "/history") {
    $(".function#history").attr(
      "style",
      "background-color: rgba(255, 255, 255, 0.3)"
    );
    $(".status").filter(function () {
      if ($(this).text() == "Success") {
        $(this).attr("style", "color: green");
      }
      if ($(this).text() == "Pending") {
        $(this).attr("style", "color: blue");
      }
      if ($(this).text() == "Canceled") {
        $(this).attr("style", "color: red");
      }
    });
    $(".history-data").click(function (e) {
      e.preventDefault();
      $("#history-detail").click();
      const data = {
        type: {
          name: "Loại GD",
          data: $(this).children(".type").text().trim(),
        },
        money: {
          name: "Số tiền",
          data: $(this).children(".money").text().trim(),
        },
        message: {
          name: "Ghi chú",
          data: $(this)
            .children(".message")
            .text()
            .trim()
            .replace(",", "<br/>"),
        },
        time: {
          name: "Thời gian",
          data: $(this).children(".time").text().trim(),
        },
        status: {
          name: "Trạng thái",
          data: $(this).children(".status").text().trim(),
        },
      };
      $(".history-detail-data").empty();
      $(".history-detail-data").append(`
      <div class="px-5 py-3">
        <div class="d-flex">
          <div class="py-3 col-4">${data.type.name}:</div>
          <div class="py-3 col-8">${data.type.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.money.name}:</div>
          <div class="py-3 col-8">${data.money.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.message.name}:</div>
          <div class="py-3 col-8">${data.message.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.time.name}:</div>
          <div class="py-3 col-8">${data.time.data}</div>
        </div>
        <div class="d-flex">
          <div class="py-3 col-4">${data.status.name}:</div>
          <div class="py-3 col-8">${data.status.data}</div>
        </div>
      </div>
      `);
    });
  }
  // Account page
  if (location.pathname == "/account") {
    $(".function#account").attr(
      "style",
      "background-color: rgba(255, 255, 255, 0.3)"
    );
    $("#form-bo-sung").submit(async function (e) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("front_cmnd", $("#cmnd_front")[0].files[0]);
      formData.append("back_cmnd", $("#cmnd_end")[0].files[0]);

      $(".progress-spinner").attr("style", "display: flex");
      const bosungResponse = await fetch("/update-cmnd", {
        method: "POST",
        body: formData,
      });

      const data = await bosungResponse.json();
      if (bosungResponse.status === 200) {
        $(".user-status").text("Chờ xác minh");
        $(".btn-cmnd").css("display", "none");
      }
      $("#cmnd_front").val("");
      $("#cmnd_end").val("");
      Alert(data.message);
    });
  }
  // Admin page
  if (location.pathname == "/admin") {
    $(".btn-xac-minh").click(async function (e) {
      $("#user-xac-minh").text($(this).attr("user"));
      $("#username").val($(this).attr("user"));
    });
    $(".btn-bo-sung").click(async function (e) {
      $("#user-bo-sung").text($(this).attr("user"));
      $("#username").val($(this).attr("user"));
    });
    $(".btn-huy").click(async function (e) {
      $("#user-huy").text($(this).attr("user"));
      $("#username").val($(this).attr("user"));
    });
    $(".btn-mo-khoa").click(async function (e) {
      $("#user-mo-khoa").text($(this).attr("user"));
      $("#username").val($(this).attr("user"));
    });
    $("#form-xac-minh").submit(async function (e) {
      e.preventDefault();
      const body = {
        username: $("#username").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const xacminhResponse = await fetch("/admin/xac-minh", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await xacminhResponse.json();
      if (xacminhResponse.status === 200) {
        Alert(data.message, "/admin");
      } else {
        Alert(data.message);
      }
    });
    $("#form-bo-sung").submit(async function (e) {
      e.preventDefault();
      const body = {
        username: $("#username").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const bosungResponse = await fetch("/admin/bo-sung", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await bosungResponse.json();
      if (bosungResponse.status === 200) {
        Alert(data.message, "/admin");
      } else {
        Alert(data.message);
      }
    });
    $("#form-huy").submit(async function (e) {
      e.preventDefault();
      const body = {
        username: $("#username").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const huyResponse = await fetch("/admin/huy", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await huyResponse.json();
      if (huyResponse.status === 200) {
        Alert(data.message, "/admin");
      } else {
        Alert(data.message);
      }
    });
    $("#form-mo-khoa").submit(async function (e) {
      e.preventDefault();
      const body = {
        username: $("#username").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const huyResponse = await fetch("/admin/mo-khoa", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await huyResponse.json();
      if (huyResponse.status === 200) {
        Alert(data.message, "/admin");
      } else {
        Alert(data.message);
      }
    });
    $(".gd-click").click(function (e) {
      $(".gd-body").empty();
      $(".gd-body").append(`
        <input type="hidden" id="_id" value="${$(this).attr("_id")}" />
        <div class="d-flex py-2">
          <div class="col-4">Username:</div>
          <div class="col-8 username-gd">${$(this).attr("username")}</div>
        </div>
        <div class="d-flex py-2">
          <div class="col-4">Loại GD:</div>
          <div>${$(this).attr("type")}</div>
        </div>
        <div class="d-flex py-2">
          <div class="col-4">SDT nhận:</div>
          <div>${$(this).attr("receiver_phone_number")}</div>
        </div>
        <div class="d-flex py-2">
          <div class="col-4">Số tiền:</div>
          <div>${$(this).attr("money")}</div>
        </div>
        <div class="d-flex py-2">
          <div class="col-4">Ghi chú:</div>
          <div>${$(this).attr("message")}</div>
        </div>
        <div class="d-flex py-2">
          <div class="col-4">Trạng thái:</div>
          <div>${$(this).attr("status")}</div>
        </div>
        <div class="d-flex py-2">
          <div class="col-4">Thời gian:</div>
          <div>${new Date($(this).attr("date")).toLocaleString("vi-VN")}</div>
        </div>
      `);
    });
    $("#btn-dong-y").click(async function (e) {
      const body = {
        _id: $("#_id").val(),
        username: $(".username-gd").text().trim(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const dongyResponse = await fetch("/admin/dong-y", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await dongyResponse.json();
      if (dongyResponse.status === 200) {
        Alert(data.message, "/admin");
      } else {
        Alert(data.message);
      }
    });
    $("#btn-tu-choi").click(async function (e) {
      const body = {
        _id: $("#_id").val(),
      };
      $(".progress-spinner").attr("style", "display: flex");
      const tuchoiResponse = await fetch("/admin/tu-choi", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await tuchoiResponse.json();
      if (tuchoiResponse.status === 200) {
        Alert(data.message, "/admin");
      } else {
        Alert(data.message);
      }
    });
  }

  // Back button
  $("#back").click(function () {
    if ($(this).hasClass("first")) {
      location.href = "/logout";
    } else {
      history.back();
    }
  });
  // Wallet Function
  $(".function").click(function (e) {
    $(".function").attr("style", "background-color: none");
    $(this).attr("style", "background-color: rgba(255, 255, 255, 0.3)");
    location.href = $(this).attr("href");
  });
});
// Helper function
// Alert
function Alert(message, href = "") {
  $(".progress-spinner").attr("style", "display: none");
  $("[class^='block'].show-alert").append("<div class='notification'></div>");
  $(".notification").text(message);
  setTimeout(() => {
    $(".notification").addClass("hidden");
  }, 2000);
  setTimeout(() => {
    $(".notification").remove();
    if (href) {
      location.href = href;
    }
  }, 3000);
}
function MoneyDigit(money) {
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function GetCurrentMoney(money) {
  return money.toString().replaceAll(".", "");
}
