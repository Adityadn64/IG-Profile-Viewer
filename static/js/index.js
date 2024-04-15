function search() {
    var usernameInput = document.getElementsByName("username")[0].value;
    var search = document.querySelector('.search')

    if (usernameInput.trim() === "") {
    } else {
        search.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Search'
    }
}