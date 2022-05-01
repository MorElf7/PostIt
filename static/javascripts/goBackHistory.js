function editComment() {
    const goBackBtn = document.getElementById('backBtn');

    if (window.history.back()) {
        goBackBtn.setAttribute('onclick', 'history.back()');
    }


}