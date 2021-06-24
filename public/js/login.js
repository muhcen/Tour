const stripe = Stripe(
    'pk_test_51IT0v1FB41rzsIXye48A3C8RGaJdqhXa7Y5lWTjmQTtDLBtGoLGRjU701Arnp19szeHFDtzswnvN2y8WJfeLc5nV00sh4LuME6',
);

const logout = document.querySelector('.nav__el--logout');
const form = document.querySelector('.form-login');
const changePasswordForm = document.querySelector('.form-user-settings');
const dataForm = document.querySelector('.form-user-data');
const book = document.querySelector('#booking-tour');
const googleIAP = document.querySelector('#sgin_up_with_google');
const loginOut = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/users/logOut',
        });
        if (res.data.status === 'success') location.replace('http://127.0.0.1:8000');
    } catch (err) {
        alert(err.response.data);
    }
};

const update = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/uploadMe',
            data,
        });
        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        alert(err.response.data);
    }
};

const changePass = async (passwordCurrent, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/users/changePassword',
            data: {
                password: passwordCurrent,
                newPassword: password,
                newPasswordConfirm: passwordConfirm,
            },
        });
        if (res.data.status === 'success') location.reload(true);
    } catch (err) {
        alert(err.response.data);
    }
};

const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            location.assign('/');
        }
        console.log(res);
    } catch (err) {
        console.log(err.response.data);
    }
};

if (form)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        login(email, password);
    });

if (logout) logout.addEventListener('click', loginOut);
if (changePasswordForm)
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passwordCurrent = document.querySelector('#password-current').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#password-confirm').value;

        changePass(passwordCurrent, password, passwordConfirm);
    });

if (dataForm)
    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.querySelector('#name').value);
        form.append('password', document.querySelector('#password').value);
        form.append('photo', document.querySelector('#photo').files[0]);
        console.log(document.querySelector('#photo').files);
        update(form);
    });

if (book)
    book.addEventListener('click', async (e) => {
        e.target.textContent = 'proosesing';
        const { tourId } = e.target.dataset;
        try {
            const session = await axios({
                url: `http://127.0.0.1:8000/api/v1/booking/checkout-session/${tourId}`,
            });
            console.log(session);

            stripe.redirectToCheckout({
                sessionId: session.data.session.id,
            });
        } catch (err) {
            console.log(err.response.data);
        }
    });

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    console.log(profile);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
