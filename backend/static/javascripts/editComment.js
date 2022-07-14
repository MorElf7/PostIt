function editComment() {

    const commentReadOnly = document.getElementById('editComment')
    const textArea = document.createElement('textarea');
    const submitBtn = document.getElementById('editSubmit');
    
    textArea.innerHTML = commentReadOnly.innerHTML;
    textArea.setAttribute('class', 'col-md mb-2 text-start form-control');
    textArea.setAttribute('name', 'comment[content]');
    textArea.setAttribute('id', 'editCommentTextArea');
    textArea.setAttribute('rows', '2');

    commentReadOnly.parentNode.insertBefore(textArea, commentReadOnly);
    commentReadOnly.parentNode.removeChild(commentReadOnly);

    submitBtn.removeAttribute('hidden');
    submitBtn.removeAttribute('disabled');
}