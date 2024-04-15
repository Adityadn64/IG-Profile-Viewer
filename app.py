from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from instaloader import Instaloader, Profile
import base64
import requests

app = Flask(__name__)
CORS(app)

chrome_options = Options()
chrome_options.add_argument("--headless")  # Jalankan browser dalam mode headless
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
chrome_options.add_argument("--disable-web-security")

driver = webdriver.Chrome(options=chrome_options)

@app.after_request
def set_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']

        if username:
            try:
                L = Instaloader()
                profile = Profile.from_username(L.context, username)
                profile_info = profile._asdict()
                
                # Mengambil gambar profil
                profile_pic_data = base64.b64encode(requests.get(profile.profile_pic_url).content).decode('utf-8')
                profile_info['profile_pic_data'] = profile_pic_data  # Tambahkan data gambar profil ke dalam profile_info

                # Mengambil postingan
                posts = []
                for post in profile.get_posts():
                    if post.is_video:
                        # Jika postingan berupa video, set src elemen video
                        posts.append({
                            'video_url': post.video_url,
                            'shortcode': post.shortcode,
                            'caption': post.caption,
                            'likes': post.likes,
                            'comments': post.comments,
                            'timestamp': post.date_utc.timestamp(),
                            'is_video': True
                        })
                    else:
                        # Jika postingan berupa gambar, konversi ke base64
                        image_data = base64.b64encode(requests.get(post.url).content).decode('utf-8')
                        posts.append({
                            'image_data': image_data,
                            'shortcode': post.shortcode,
                            'caption': post.caption,
                            'likes': post.likes,
                            'comments': post.comments,
                            'timestamp': post.date_utc.timestamp(),
                            'is_video': False
                        })

                # Tambahkan perhitungan jumlah postingan gambar dan video setelah loop
                total_images = sum(1 for post in posts if not post['is_video'])
                total_videos = sum(1 for post in posts if post['is_video'])
                profile_info['total_images'] = total_images
                profile_info['total_videos'] = total_videos

                return render_template('result.html', profile_info=profile_info, posts=posts)
            except Exception as e:
                return render_template('result.html', error=f'Gagal mengambil data. Error: {str(e)}')
        else:
            return render_template('result.html', error='Mohon isi nama pengguna.')

    return render_template('index.html')  # Pastikan ini masuk ke blok else yang benar

if __name__ == '__main__':
    app.run(debug=True)
