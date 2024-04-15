<?php
require 'vendor/autoload.php'; // Sesuaikan dengan path Instaloader di server Anda
use Instaloader\Instaloader;
use Instaloader\Profile;

$app = new \Slim\Slim();

// Enable CORS
$app->response->headers->set('Access-Control-Allow-Origin', '*');

$app->post('/', function () use ($app) {
    $username = $app->request->post('username');

    if ($username) {
        try {
            $L = new Instaloader();
            $profile = Profile::fromUsername($L->getContext(), $username);
            $profileInfo = $profile->asArray();

            // Ambil gambar profil
            $profilePicData = base64_encode(file_get_contents($profileInfo['profile_pic_url']));
            $profileInfo['profile_pic_data'] = $profilePicData;

            // Ambil postingan
            $posts = [];
            foreach ($profile->getPosts() as $post) {
                if ($post->isVideo) {
                    // Jika postingan berupa video, set src elemen video
                    $posts[] = [
                        'video_url' => $post->getVideoUrl(),
                        'shortcode' => $post->getShortcode(),
                        'caption' => $post->getCaption(),
                        'likes' => $post->getLikes(),
                        'comments' => $post->getComments(),
                        'timestamp' => $post->getTimestamp(),
                        'is_video' => true
                    ];
                } else {
                    // Jika postingan berupa gambar, konversi ke base64
                    $imageData = base64_encode(file_get_contents($post->getDisplayUrl()));
                    $posts[] = [
                        'image_data' => $imageData,
                        'shortcode' => $post->getShortcode(),
                        'caption' => $post->getCaption(),
                        'likes' => $post->getLikes(),
                        'comments' => $post->getComments(),
                        'timestamp' => $post->getTimestamp(),
                        'is_video' => false
                    ];
                }
            }

            // Tambahkan perhitungan jumlah postingan gambar dan video setelah loop
            $totalImages = count(array_filter($posts, fn($post) => !$post['is_video']));
            $totalVideos = count(array_filter($posts, fn($post) => $post['is_video']));
            $profileInfo['total_images'] = $totalImages;
            $profileInfo['total_videos'] = $totalVideos;

            echo json_encode(['profile_info' => $profileInfo, 'posts' => $posts]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Gagal mengambil data. Error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Mohon isi nama pengguna.']);
    }
});

$app->run();
