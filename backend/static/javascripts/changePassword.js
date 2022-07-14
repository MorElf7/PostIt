function changePassword() {
    console.log("HI");

    const btn = document.getElementById('changePasswordBtn');
    btn.setAttribute('hidden', '');
    btn.setAttribute('disabled', '');

    const oldPasswordLabel = document.getElementById('oldPassLabel');
    oldPasswordLabel.removeAttribute('hidden');
    const oldPassword = document.getElementById('oldPassword');
    oldPassword.removeAttribute('hidden');
    oldPassword.removeAttribute('disabled');
    
    const newPasswordLabel = document.getElementById('newPassLabel');
    newPasswordLabel.removeAttribute('hidden');
    const newPassword = document.getElementById('newPassword');
    newPassword.removeAttribute('hidden');
    newPassword.removeAttribute('disabled');
}