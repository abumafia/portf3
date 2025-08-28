document.addEventListener('DOMContentLoaded', function() {
    // DOM elementlari
    const postsContainer = document.getElementById('posts-container');
    const galleryContainer = document.getElementById('gallery-container');
    const contactForm = document.getElementById('contact-form');
    const postModal = document.getElementById('post-modal');
    const closeModal = document.getElementById('close-modal');
    const commentForm = document.getElementById('comment-form');
    
    // Quantum effektlar
    initQuantumEffects();
    
    // Postlarni yuklash
    async function loadPosts() {
        try {
            const response = await fetch('https://portf3.onrender.com/api/posts');
            const posts = await response.json();
            
            postsContainer.innerHTML = '';
            
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Xatolik postlarni yuklashda:', error);
            postsContainer.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <div class="text-blue-400 text-5xl mb-4">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="text-gray-300 text-xl">Postlar yuklanmadi. Iltimos, keyinroq urunib ko'ring.</p>
                </div>
            `;
        }
    }
    
    // Galereyani yuklash
    async function loadGallery() {
        try {
            const response = await fetch('https://portf3.onrender.com/api/gallery');
            const gallery = await response.json();
            
            galleryContainer.innerHTML = '';
            
            gallery.forEach(item => {
                const galleryElement = createGalleryElement(item);
                galleryContainer.appendChild(galleryElement);
            });
        } catch (error) {
            console.error('Xatolik galereyani yuklashda:', error);
            galleryContainer.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <div class="text-blue-400 text-5xl mb-4">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="text-gray-300 text-xl">Galereya yuklanmadi. Iltimos, keyinroq urunib ko'ring.</p>
                </div>
            `;
        }
    }
    
    // Post elementini yaratish
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'quantum-card hover:shadow-xl';
        postDiv.innerHTML = `
            ${post.mediaUrl ? `
                <div class="h-48 overflow-hidden relative">
                    ${post.mediaType === 'image' ? 
                        `<img src="${post.mediaUrl}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">` : 
                        `<video src="${post.mediaUrl}" class="w-full h-full object-cover" controls></video>`
                    }
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">Post</span>
                    </div>
                </div>
            ` : ''}
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2 text-white">${post.title}</h3>
                <p class="text-gray-400 mb-4">${post.content.substring(0, 100)}...</p>
                <div class="flex justify-between items-center">
                    <button class="text-blue-400 hover:text-blue-300 view-post quantum-tooltip" data-id="${post._id}" data-tooltip="Ko'proq o'qish">
                        <i class="fas fa-eye mr-2"></i> Ko'proq
                    </button>
                    <div class="flex items-center space-x-4">
                        <button class="text-gray-400 hover:text-red-400 like-post quantum-tooltip" data-id="${post._id}" data-tooltip="Like">
                            <i class="far fa-heart"></i>
                            <span class="ml-1">${post.likes}</span>
                        </button>
                        <button class="text-gray-400 hover:text-blue-400 comment-post quantum-tooltip" data-id="${post._id}" data-tooltip="Izohlar">
                            <i class="far fa-comment"></i>
                            <span class="ml-1">${post.comments ? post.comments.length : 0}</span>
                        </button>
                        <button class="text-gray-400 hover:text-green-400 share-post quantum-tooltip" data-id="${post._id}" data-tooltip="Ulashish">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-4 text-sm text-gray-500">
                    <i class="far fa-clock mr-1"></i> ${new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>
        `;
        
        return postDiv;
    }
    
    // Galereya elementini yaratish
    function createGalleryElement(item) {
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'quantum-card overflow-hidden';
        
        if (item.type === 'image') {
            galleryDiv.innerHTML = `
                <img src="${item.url}" alt="${item.title}" class="w-full h-48 object-cover transition-transform duration-500 hover:scale-110">
                <div class="p-4">
                    <h4 class="text-white font-medium mb-2">${item.title}</h4>
                    <p class="text-gray-400 text-sm">${item.description || ''}</p>
                </div>
            `;
        } else {
            galleryDiv.innerHTML = `
                <video src="${item.url}" class="w-full h-48 object-cover" controls></video>
                <div class="p-4">
                    <h4 class="text-white font-medium mb-2">${item.title}</h4>
                    <p class="text-gray-400 text-sm">${item.description || ''}</p>
                </div>
            `;
        }
        
        return galleryDiv;
    }
    
    // Postni ko'rish modali
    function openPostModal(postId) {
        // Yuklash animatsiyasi
        document.getElementById('modal-title').innerHTML = `
            <div class="inline-block mr-2 quantum-loader" style="width: 20px; height: 20px;"></div>
            Yuklanmoqda...
        `;
        document.getElementById('modal-content').innerHTML = '';
        document.getElementById('modal-media').innerHTML = '';
        document.getElementById('comments-container').innerHTML = '';
        
        postModal.classList.remove('hidden');
        
        fetch(`https://portf3.onrender.com/api/posts/${postId}`)
            .then(response => response.json())
            .then(post => {
                document.getElementById('modal-title').textContent = post.title;
                document.getElementById('modal-content').textContent = post.content;
                document.getElementById('post-id').value = post._id;
                
                const mediaContainer = document.getElementById('modal-media');
                mediaContainer.innerHTML = '';
                
                if (post.mediaUrl) {
                    if (post.mediaType === 'image') {
                        mediaContainer.innerHTML = `
                            <img src="${post.mediaUrl}" alt="${post.title}" class="w-full rounded-lg mb-4">
                        `;
                    } else {
                        mediaContainer.innerHTML = `
                            <video src="${post.mediaUrl}" class="w-full rounded-lg mb-4" controls></video>
                        `;
                    }
                }
                
                // Kommentariyalarni yuklash
                loadComments(post.comments);
            })
            .catch(error => {
                console.error('Xatolik postni yuklashda:', error);
                document.getElementById('modal-title').innerHTML = `
                    <div class="text-red-400">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        Xatolik yuz berdi
                    </div>
                `;
                document.getElementById('modal-content').innerHTML = `
                    <p class="text-gray-400">Post yuklanmadi. Iltimos, keyinroq urunib ko'ring.</p>
                `;
            });
    }
    
    // Kommentariyalarni yuklash
    function loadComments(comments) {
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = '';
        
        if (!comments || comments.length === 0) {
            commentsContainer.innerHTML = `
                <div class="text-center py-6">
                    <div class="text-blue-400 text-3xl mb-3">
                        <i class="far fa-comments"></i>
                    </div>
                    <p class="text-gray-500">Hali izohlar mavjud emas.</p>
                </div>
            `;
            return;
        }
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'border-b border-gray-700 pb-6 mb-6';
            commentElement.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mr-3">
                            <span class="text-blue-400 font-semibold">${comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                        <div>
                            <h6 class="font-semibold text-white">${comment.author || 'Foydalanuvchi'}</h6>
                            <p class="text-gray-500 text-sm">${new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button class="text-gray-500 hover:text-red-400 like-comment quantum-tooltip" data-post-id="${document.getElementById('post-id').value}" data-comment-id="${comment._id}" data-tooltip="Like">
                        <i class="far fa-heart mr-1"></i> ${comment.likes || 0}
                    </button>
                </div>
                <p class="text-gray-300 mb-4">${comment.content}</p>
                
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="mt-4 ml-4 pl-4 border-l-2 border-blue-800">
                        <h6 class="text-gray-400 text-sm font-semibold mb-3">Javoblar:</h6>
                        ${comment.replies.map(reply => `
                            <div class="mb-4 last:mb-0">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center mr-2">
                                            <span class="text-purple-400 text-sm font-semibold">${reply.author ? reply.author.charAt(0).toUpperCase() : 'U'}</span>
                                        </div>
                                        <div>
                                            <h6 class="font-semibold text-white text-sm">${reply.author || 'Foydalanuvchi'}</h6>
                                            <p class="text-gray-500 text-xs">${new Date(reply.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button class="text-gray-500 hover:text-red-400 like-reply quantum-tooltip" data-post-id="${document.getElementById('post-id').value}" data-comment-id="${comment._id}" data-reply-id="${reply._id}" data-tooltip="Like">
                                        <i class="far fa-heart mr-1"></i> ${reply.likes || 0}
                                    </button>
                                </div>
                                <p class="text-gray-300 text-sm">${reply.content}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="mt-4">
                    <button class="text-blue-400 text-sm reply-btn quantum-tooltip" data-comment-id="${comment._id}" data-tooltip="Javob berish">
                        <i class="fas fa-reply mr-1"></i> Javob berish
                    </button>
                    <form class="reply-form hidden mt-3" data-comment-id="${comment._id}">
                        <div class="mb-2">
                            <input type="text" class="quantum-input w-full text-sm reply-author" placeholder="Ismingiz" required>
                        </div>
                        <div class="mb-2">
                            <textarea class="quantum-input w-full text-sm reply-content" placeholder="Javobingiz" rows="2" required></textarea>
                        </div>
                        <button type="submit" class="neon-button text-sm py-1 px-3">
                            Yuborish
                        </button>
                    </form>
                </div>
            `;
            
            commentsContainer.appendChild(commentElement);
        });
        
        // Reply tugmalarini sozlash
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const commentId = this.getAttribute('data-comment-id');
                const form = document.querySelector(`.reply-form[data-comment-id="${commentId}"]`);
                form.classList.toggle('hidden');
            });
        });
        
        // Reply formlarini sozlash
        document.querySelectorAll('.reply-form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const commentId = this.getAttribute('data-comment-id');
                const author = this.querySelector('.reply-author').value;
                const content = this.querySelector('.reply-content').value;
                
                submitReply(document.getElementById('post-id').value, commentId, author, content);
            });
        });
        
        // Komment like tugmalarini sozlash
        document.querySelectorAll('.like-comment').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const commentId = this.getAttribute('data-comment-id');
                
                likeComment(postId, commentId);
            });
        });
        
        // Reply like tugmalarini sozlash
        document.querySelectorAll('.like-reply').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const commentId = this.getAttribute('data-comment-id');
                const replyId = this.getAttribute('data-reply-id');
                
                likeReply(postId, commentId, replyId);
            });
        });
    }
    
    // Postga like bosish
    async function likePost(postId) {
        try {
            const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}/like`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            // Like sonini yangilash
            const likeBtn = document.querySelector(`.like-post[data-id="${postId}"]`);
            if (likeBtn) {
                const likeCount = likeBtn.querySelector('span');
                likeCount.textContent = result.likes;
                
                // Animatsiya
                likeBtn.innerHTML = `<i class="fas fa-heart mr-1"></i> ${result.likes}`;
                likeBtn.classList.add('text-red-400');
                
                // Tooltipni yangilash
                likeBtn.setAttribute('data-tooltip', 'Liked');
            }
        } catch (error) {
            console.error('Xatolik like qilishda:', error);
        }
    }
    
    // Kommentga like bosish
    async function likeComment(postId, commentId) {
        try {
            const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}/comment/${commentId}/like`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            // Like sonini yangilash
            const likeBtn = document.querySelector(`.like-comment[data-comment-id="${commentId}"]`);
            if (likeBtn) {
                likeBtn.innerHTML = `<i class="fas fa-heart mr-1"></i> ${result.likes}`;
                likeBtn.classList.add('text-red-400');
            }
        } catch (error) {
            console.error('Xatolik komment like qilishda:', error);
        }
    }
    
    // Javobga like bosish
    async function likeReply(postId, commentId, replyId) {
        try {
            const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}/comment/${commentId}/reply/${replyId}/like`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            // Like sonini yangilash
            const likeBtn = document.querySelector(`.like-reply[data-reply-id="${replyId}"]`);
            if (likeBtn) {
                likeBtn.innerHTML = `<i class="fas fa-heart mr-1"></i> ${result.likes}`;
                likeBtn.classList.add('text-red-400');
            }
        } catch (error) {
            console.error('Xatolik javob like qilishda:', error);
        }
    }
    
    // Javob qoldirish
    async function submitReply(postId, commentId, author, content) {
        try {
            const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}/comment/${commentId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ author, content })
            });
            
            if (response.ok) {
                // Modalni qayta yuklash
                openPostModal(postId);
            }
        } catch (error) {
            console.error('Xatolik javob qoldirishda:', error);
        }
    }
    
    // Postni ulashish
    async function sharePost(postId) {
        // Bu yerda haqiqiy ulashish funksiyasi bo'lishi kerak
        // Hozircha faqat demo
        try {
            if (navigator.share) {
                const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}`);
                const post = await response.json();
                
                await navigator.share({
                    title: post.title,
                    text: post.content.substring(0, 100),
                    url: window.location.href + `#post=${postId}`
                });
            } else {
                // Fallback - post ID ni clipboardga nusxalash
                await navigator.clipboard.writeText(window.location.href + `#post=${postId}`);
                alert('Post havolasi nusxalandi!');
            }
        } catch (error) {
            console.error('Xatolik ulashishda:', error);
        }
    }
    
    // Komment qoldirish
    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const postId = document.getElementById('post-id').value;
        const author = document.getElementById('comment-author').value;
        const content = document.getElementById('comment-content').value;
        
        // Yuklash animatsiyasi
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <div class="inline-block mr-2 quantum-loader" style="width: 16px; height: 16px;"></div>
            Yuklanmoqda...
        `;
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ author, content })
            });
            
            if (response.ok) {
                // Formani tozalash
                document.getElementById('comment-content').value = '';
                
                // Modalni qayta yuklash
                openPostModal(postId);
            }
        } catch (error) {
            console.error('Xatolik komment qoldirishda:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Kontakt formasi
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Yuklash animatsiyasi
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <div class="inline-block mr-2 quantum-loader" style="width: 16px; height: 16px;"></div>
            Yuklanmoqda...
        `;
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('https://portf3.onrender.com/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Quantum muvaffaqiyat animatsiyasi
                const successDiv = document.createElement('div');
                successDiv.className = 'fixed top-4 right-4 quantum-card p-4 text-green-400 border-green-500 z-50';
                successDiv.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        <span>Xabaringiz yuborildi!</span>
                    </div>
                `;
                document.body.appendChild(successDiv);
                
                // 5 soniyadan keyin olib tashlash
                setTimeout(() => {
                    successDiv.remove();
                }, 5000);
                
                this.reset();
            }
        } catch (error) {
            console.error('Xatolik xabar yuborishda:', error);
            
            // Xato animatsiyasi
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed top-4 right-4 quantum-card p-4 text-red-400 border-red-500 z-50';
            errorDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    <span>Xatolik yuz berdi. Keyinroq urunib ko'ring.</span>
                </div>
            `;
            document.body.appendChild(errorDiv);
            
            // 5 soniyadan keyin olib tashlash
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Modalni yopish
    closeModal.addEventListener('click', function() {
        postModal.classList.add('hidden');
    });
    
    // Tashqi joyga bosganda modalni yopish
    postModal.addEventListener('click', function(e) {
        if (e.target === postModal) {
            postModal.classList.add('hidden');
        }
    });
    
    // Quantum effektlarni ishga tushirish
    function initQuantumEffects() {
        // Har bir quantum-card uchun hover effektlari
        const quantumCards = document.querySelectorAll('.quantum-card');
        quantumCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Neon button effektlari
        const neonButtons = document.querySelectorAll('.neon-button');
        neonButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = `
                    0 0 10px var(--neon-blue),
                    0 0 30px var(--neon-blue),
                    0 0 60px var(--neon-blue)
                `;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '';
            });
        });
    }
    
    // Event delegatsiya
    document.addEventListener('click', function(e) {
        // Postni ko'rish
        if (e.target.classList.contains('view-post') || e.target.closest('.view-post')) {
            e.preventDefault();
            const btn = e.target.classList.contains('view-post') ? e.target : e.target.closest('.view-post');
            const postId = btn.getAttribute('data-id');
            openPostModal(postId);
        }
        
        // Postga like bosish
        if (e.target.classList.contains('like-post') || e.target.closest('.like-post')) {
            const btn = e.target.classList.contains('like-post') ? e.target : e.target.closest('.like-post');
            const postId = btn.getAttribute('data-id');
            likePost(postId);
        }
        
        // Postga comment yozish
        if (e.target.classList.contains('comment-post') || e.target.closest('.comment-post')) {
            const btn = e.target.classList.contains('comment-post') ? e.target : e.target.closest('.comment-post');
            const postId = btn.getAttribute('data-id');
            openPostModal(postId);
            // Komment formaga fokus
            setTimeout(() => {
                document.getElementById('comment-author')?.focus();
            }, 500);
        }
        
        // Postni ulashish
        if (e.target.classList.contains('share-post') || e.target.closest('.share-post')) {
            const btn = e.target.classList.contains('share-post') ? e.target : e.target.closest('.share-post');
            const postId = btn.getAttribute('data-id');
            sharePost(postId);
        }
    });
    
    // Dastlabki yuklash
    loadPosts();
    loadGallery();
});
