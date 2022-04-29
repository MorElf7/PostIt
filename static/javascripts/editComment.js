function editComment() {

    const commentReadOnly = document.getElementById('editComment')
    // console.log('sdfdg');
    const textArea = document.createElement('textarea');
    const submitBtn = document.getElementById('editSubmit');
    
    textArea.innerHTML = commentReadOnly.innerHTML;
    textArea.setAttribute('class', 'col-md mb-2 text-start form-control');
    textArea.setAttribute('name', 'comment[content]');
    // textArea.setAttribute('height', '30px');

    commentReadOnly.parentNode.insertBefore(textArea, commentReadOnly);
    commentReadOnly.parentNode.removeChild(commentReadOnly);

    submitBtn.removeAttribute('hidden');
    submitBtn.removeAttribute('disabled');
}