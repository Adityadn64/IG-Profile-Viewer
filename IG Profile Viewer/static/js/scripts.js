function togglePostData(button, event) {
    // Menghentikan penyebaran event agar event tidak mencapai elemen .post-item
    event.stopPropagation();

    var postContainer = button.closest('.post-item');
    var postsData = postContainer.querySelector('.postsdata');
    postsData.style.display = (postsData.style.display === 'none') ? 'block' : 'none';

    // Hapus class 'selected' saat menampilkan data postingan
    postContainer.classList.remove("selected");
        
    // Reset warna tanda centang pada thumbnail
    var checkMark = postContainer.querySelector('.check-mark');
    checkMark.style.color = '';
}

function stopPropagation(event) {
    // Menghentikan penyebaran event agar event tidak mencapai elemen .post-item
    event.stopPropagation();
}

function toggleCaption(element) {
    var captionContainer = element.parentElement;
    captionContainer.classList.toggle('show-more');

    var captionText = captionContainer.querySelector('.caption');
    var isExpanded = captionContainer.classList.contains('show-more');

    if (isExpanded) {
        captionText.style.webkitLineClamp = 'initial'; // Hilangkan batasan
        element.innerHTML = 'Read Less';
    } else {
        captionText.style.webkitLineClamp = '3'; // Terapkan batasan 3 baris
        element.innerHTML = 'Read More';
    }
}

function filterPosts() {
    var filter = document.getElementById("postFilter").value;
    var cfilter = document.getElementById("cfilter");
    var postContainer = document.getElementById("postContainer");
    var posts = document.getElementsByClassName("post-item");

    for (var i = 0; i < posts.length; i++) {
        var postType = posts[i].getAttribute("data-type");

        if (filter === "all" || postType === filter) {
            posts[i].style.display = "";
        } else {
            posts[i].style.display = "none";
        }
    }

    if (filter === "all") {
        // Jika nilai filter adalah "all", kosongkan innerHTML
        cfilter.innerHTML = "Post";
    } else {
        // Jika nilai filter bukan "all", set innerHTML sesuai nilai filter
        cfilter.innerHTML = filter.charAt(0).toUpperCase() + filter.slice(1); // Untuk membuat huruf pertama besar
    }
}

// Di dalam scripts.js
document.addEventListener("DOMContentLoaded", function () {
    // ... (kode yang sudah ada)

    // Menanggapi klik pada thumbnail postingan
    var postItems = document.getElementsByClassName("post-item");

    for (var i = 0; i < postItems.length; i++) {
        postItems[i].addEventListener("click", function (event) {
            // Menghentikan penyebaran event agar event tidak mencapai elemen .post-item
            event.stopPropagation();

            // Toggle class 'selected' untuk menandai postingan yang dipilih
            this.classList.toggle("selected");

            // Ambil tanda centang pada thumbnail
            var checkMark = this.querySelector('.check-mark');

            // Periksa apakah postingan ini dipilih atau tidak
            if (this.classList.contains("selected")) {
                // Jika dipilih, tampilkan tanda centang
                checkMark.style.color = 'green';
            } else {
                // Jika tidak dipilih, sembunyikan tanda centang
                checkMark.style.color = '';
            }

            // Hitung jumlah postingan yang dipilih
            var selectedPosts = document.getElementsByClassName("post-item selected");
            var selectedPostsCount = selectedPosts.length;

            // Hitung jumlah video yang dipilih
            var selectedVideoCount = Array.from(selectedPosts).filter(post => post.getAttribute("data-type") === "video").length;

            // Hitung jumlah gambar yang dipilih
            var selectedImageCount = Array.from(selectedPosts).filter(post => post.getAttribute("data-type") === "image").length;

            // Perbarui teks pada elemen #selectedPostsCount
            document.getElementById("selectedPostsCount").innerText = selectedPostsCount;
            document.getElementById("selectedPostsCount-video").innerText = selectedVideoCount;
            document.getElementById("selectedPostsCount-image").innerText = selectedImageCount;

            // Tampilkan atau sembunyikan elemen #chooseposts tergantung pada apakah ada postingan yang dipilih
            var choosePosts = document.getElementById("chooseposts");
            choosePosts.style.display = (selectedPostsCount > 0) ? 'block' : 'none';
        });
    }
});

var video = document.getElementById("videoSource");
var playButton = document.querySelector(".p_Video");
var isPlaying = false;

video.addEventListener("loadedmetadata", function() {
    playButton.addEventListener("click", toggleVideo);
});

function toggleVideo(event) {
    event.stopPropagation();

    if (!isPlaying) {
        var playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Video successfully started
                isPlaying = true;
                playButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">
                        <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
                    </svg>
                `;
            })
            .catch(error => {
                // Video failed to start, handle the error
                console.error("Video failed to start:", error);
            });
        }
    } else {
        video.pause();
        isPlaying = false;
        playButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
            </svg>
        `;
    }
}

function downloadPost(dataURL, fileName, event) {
    // Ganti innerHtml menjadi spinner saat proses download
    var DownloadButtonPost = event.currentTarget;
    DownloadButtonPost.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

    // Force a reflow to ensure the spinner is rendered before continuing
    DownloadButtonPost.offsetWidth;

    // Menghentikan penyebaran event agar event tidak mencapai elemen .post-item
    event.stopPropagation();

    var a = document.createElement('a');
    a.href = dataURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Ganti innerHtml kembali setelah selesai download
    DownloadButtonPost.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path></svg>';
}

function selectAllPosts(checkbox) {
    var postItems = document.getElementsByClassName("post-item");

    for (var i = 0; i < postItems.length; i++) {
        var post = postItems[i];
        var checkMark = post.querySelector('.check-mark');
        var postType = post.getAttribute("data-type");

        // Update the selected class of each post based on the filter
        var filter = document.getElementById("postFilter").value;
        var shouldSelect = (filter === "all" || postType === filter);
        
        // If the checkbox is checked, select the posts; otherwise, unselect them
        post.classList.toggle("selected", checkbox.checked && shouldSelect);

        // Update the check mark color
        checkMark.style.color = checkbox.checked && shouldSelect ? 'green' : '';
    }

    // Update the selected posts count based on the filter
    var selectedPostsCount = Array.from(postItems).filter(post => post.classList.contains("selected")).length;

    // Update the selected video count based on the filter
    var selectedVideoCount = Array.from(postItems).filter(post => post.classList.contains("selected") && post.getAttribute("data-type") === "video").length;

    // Update the selected image count based on the filter
    var selectedImageCount = Array.from(postItems).filter(post => post.classList.contains("selected") && post.getAttribute("data-type") === "image").length;

    document.getElementById("selectedPostsCount").innerText = selectedPostsCount;
    document.getElementById("selectedPostsCount-video").innerText = selectedVideoCount;
    document.getElementById("selectedPostsCount-image").innerText = selectedImageCount;

    // Show or hide the chooseposts element based on the filter
    var choosePosts = document.getElementById("chooseposts");
    choosePosts.style.display = (selectedPostsCount > 0) ? 'block' : 'none';
}

var username = document.getElementById('username').innerText;

var isDownloadCancelled = false;

var downloadButton = document.getElementById("downloadButton");
var cancelDownloadButton = document.querySelector(".cancelDownloadButton");

downloadButton.addEventListener("click", function() {
    // Logika untuk menampilkan atau menyembunyikan cancelDownloadButton
    cancelDownloadButton.style.display = "block";
});

document.addEventListener("DOMContentLoaded", function () {
    // ... (kode yang sudah ada)

    // Menanggapi klik pada tombol cancel
    var cancelDownloadButton = document.querySelector(".cancelDownloadButton");
    if (cancelDownloadButton) {
        cancelDownloadButton.addEventListener("click", function () {
            isDownloadCancelled = true;
            // Ubah teks atau status sesuai keinginan
            var downloadButton = document.getElementById("downloadButton");
            if (downloadButton) {
                downloadButton.innerHTML = "Download cancelled.";
            }

            setTimeout(function () {
                downloadButton.innerHTML = "Download Selected Posts (Zip)";
                cancelDownloadButton.style.display = "";
            }, 1250);
        });
    }
});

async function downloadSelectedPosts() {
    isDownloadCancelled = false;

    // Ganti innerHtml menjadi spinner saat proses download
    var downloadButton = document.getElementById("downloadButton");
    downloadButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

    var zip = new JSZip();

    var selectedPosts = document.getElementsByClassName("post-item selected");

    for (var i = 0; i < selectedPosts.length; i++) {
        if (isDownloadCancelled) {
            // Hentikan loop jika unduhan dibatalkan
            break;
        }

        downloadButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Getting Files...';

        var post = selectedPosts[i];
        var postType = post.getAttribute("data-type");
        var postShortcode = post.querySelector('.download-button').getAttribute("data-shortcode");

        var postData = {};
        if (postType === "image") {
            var imageData = post.querySelector('.img-fluid').src;
            postData = { type: "image", data: getImageBase64Data(imageData) };
        } else if (postType === "video") {
            var videoElement = post.querySelector('video');
            postData = { type: "video", data: await getVideoBase64Data(videoElement) };
        }
    
        var fileName = username + "_post_" + postShortcode + "." + (postType === "image" ? "png" : "mp4");
        zip.file(fileName, postData.data, { base64: true });
    }

    if (isDownloadCancelled) {
        // Hentikan proses unduhan jika dibatalkan
        return;
    }

    downloadButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Compressing Files...';

    zip.generateAsync({ type: "blob" }).then(function (content) {
        var a = document.createElement('a');
        var url = URL.createObjectURL(content);
        a.href = url;
        a.download = username + "_post.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Ganti innerHtml kembali setelah selesai download
        downloadButton.innerHTML = 'Download Selected Posts (Zip)';
        cancelDownloadButton.style.display = "";
    });
    
    cancelDownloadButton.style.display = "";
}

function getImageBase64Data(url) {
    // Ambil base64 dari URL gambar
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.crossOrigin = "Anonymous";

    return new Promise(function (resolve, reject) {
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            resolve(canvas.toDataURL("image/png").split(",")[1]);
        };

        img.onerror = function (error) {
            reject(error);
        };

        img.src = url;
    });
}

function getVideoBase64Data(videoElement) {
    // Mengambil elemen <source> pertama dalam elemen <video>
    var sourceElement = videoElement.querySelector('source');
    
    // Mendapatkan URL video dari atribut src di elemen <source>
    var videoUrl = sourceElement.getAttribute('src');

    // Menggunakan Fetch API untuk mendapatkan data video sebagai blob
    return fetch(videoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }))
        .catch(error => {
            console.error('Error fetching or converting video data:', error);
            throw error; // Re-throw error to be caught by the caller
        });
}
