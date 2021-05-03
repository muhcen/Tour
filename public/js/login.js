const logout = document.querySelector(".nav__el--logout");
const form = document.querySelector(".form-login");
const changePasswordForm = document.querySelector(".form-user-settings");
const dataForm = document.querySelector(".form-user-data");
const btnBooking = document.querySelector("#booking-tour1");
const book = document.querySelector("#booking-tour");
const loginOut = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/v1/users/logOut",
    });
    if (res.data.status === "success")
      location.replace("http://127.0.0.1:8000/overview");
  } catch (err) {
    alert(err.response.data);
  }
};

const update = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/uploadMe",
      data,
    });
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    alert(err.response.data);
  }
};

const changePass = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8000/api/v1/users/changePassword",
      data: {
        password: passwordCurrent,
        newPassword: password,
        newPasswordConfirm: passwordConfirm,
      },
    });
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    alert(err.response.data);
  }
};

const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      window.setTimeout(() => {
        location.assign("/overview");
      }, 500);
    }
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};

if (form)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    login(email, password);
  });

if (logout) logout.addEventListener("click", loginOut);
if (changePasswordForm)
  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordCurrent = document.querySelector("#password-current").value;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#password-confirm").value;

    changePass(passwordCurrent, password, passwordConfirm);
  });

if (dataForm)
  dataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.querySelector("#name").value);
    form.append("password", document.querySelector("#password").value);
    form.append("photo", document.querySelector("#photo").files[0]);
    console.log(document.querySelector("#photo").files);
    update(form);
  });

if (btnBooking)
  btnBooking.addEventListener("click", async (e) => {
    const { tourId } = e.target.dataset;
    try {
      const session = await axios({
        url: `http://127.0.0.1:8000/api/v1/users/checkout-session/${tourId}`,
      });
      console.log(session);
    } catch (err) {
      console.log(err.response.data);
    }
  });

if (book)
  book.addEventListener("click", async (e) => {
    const tour = book.dataset.tourId;
    console.log(tour);
    try {
      const session = await axios({
        method: "POST",
        url: `http://127.0.0.1:8000/api/v1/tours/order`,
        data: {
          tour,
        },
      });
      console.log(session);
    } catch (err) {
      console.log(err.response.data);
    }
  });
