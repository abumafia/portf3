document.addEventListener('DOMContentLoaded', function() {
    // DOM elementlari
    const postsSection = document.getElementById('posts-section');
    const messagesSection = document.getElementById('messages-section');
    const gallerySection = document.getElementById('gallery-section');
    const postsContainer = document.getElementById('posts-container');
    const messagesContainer = document.getElementById('messages-container');
    const galleryAdminContainer = document.getElementById('gallery-admin-container');
    const addPostBtn = document.getElementById('add-post-btn');
    const addGalleryBtn = document.getElementById('add-gallery-btn');
    const postModal = document.getElementById('post-modal');
    const galleryModal = document.getElementById('gallery-modal');
    const deleteModal = document.getElementById('delete-modal');
    const postForm = document.getElementById('post-form');
    const galleryForm = document.getElementById('gallery-form');
    const mediaTypeSelect = document.getElementById('media-type');
    const mediaFileContainer = document.getElementById('media-file-container');
    const mediaPreview = document.getElementById('media-preview');
    const mediaFile = document.getElementById('media-file');
    const galleryFile = document.getElementById('gallery-file');
    const galleryPreview = document.getElementById('gallery-preview');
    
    // O'zgaruvchilar
    let currentDeleteId = null;
    let currentDeleteType = null;
    
    // Tab navigatsiyasi
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Faol tabni o'zgartirish
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active-tab'));
            this.classList.add('active-tab');
            
            // Kontentni ko'rsatish
            const target = this.getAttribute('href').substring(1);
            
            postsSection.classList.add('hidden');
            messagesSection.classList.add('hidden');
            gallerySection.classList.add('hidden');
            
            if (target === 'posts') {
                postsSection.classList.remove('hidden');
                loadPosts();
            } else if (target === 'messages') {
                messagesSection.classList.remove('hidden');
                loadMessages();
            } else if (target === 'gallery') {
                gallerySection.classList.remove('hidden');
                loadGallery();
            }
        });
    });
    
    // Media turi o'zgarganda
    mediaTypeSelect.addEventListener('change', function() {
        if (this.value === 'none') {
            mediaFileContainer.classList.add('hidden');
            mediaPreview.classList.add('hidden');
        } else {
            mediaFileContainer.classList.remove('hidden');
        }
    });
    
    // Media fayl tanlanganda
    mediaFile.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                mediaPreview.innerHTML = '';
                if (file.type.startsWith('image')) {
                    mediaPreview.innerHTML = `<img src="${e.target.result}" class="max-h-48 rounded-md">`;
                } else if (file.type.startsWith('video')) {
                    mediaPreview.innerHTML = `<video src="${e.target.result}" class="max-h-48 rounded-md" controls></video>`;
                }
                mediaPreview.classList.remove('hidden');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Galereya fayl tanlanganda
    galleryFile.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                galleryPreview.innerHTML = '';
                if (file.type.startsWith('image')) {
                    galleryPreview.innerHTML = `<img src="${e.target.result}" class="max-h-48 rounded-md">`;
                } else if (file.type.startsWith('video')) {
                    galleryPreview.innerHTML = `<video src="${e.target.result}" class="max-h-48 rounded-md" controls></video>`;
                }
                galleryPreview.classList.remove('hidden');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Postlarni yuklash
    async function loadPosts() {
        try {
            const response = await fetch('https://portf3.onrender.com/api/posts');
            const posts = await response.json();
            
            postsContainer.innerHTML = '';
            
            if (posts.length === 0) {
                postsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Hali postlar mavjud emas.</p>';
                return;
            }
            
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Xatolik postlarni yuklashda:', error);
            postsContainer.innerHTML = '<p class="text-red-500 text-center py-8">Xatolik yuz berdi. Qayta urunib ko\'ring.</p>';
        }
    }
    
    // Xabarlarni yuklash
    async function loadMessages() {
        try {
            const response = await fetch('https://portf3.onrender.com/api/messages');
            const messages = await response.json();
            
            messagesContainer.innerHTML = '';
            
            if (messages.length === 0) {
                messagesContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Hali xabarlar mavjud emas.</p>';
                return;
            }
            
            messages.forEach(message => {
                const messageElement = createMessageElement(message);
                messagesContainer.appendChild(messageElement);
            });
        } catch (error) {
            console.error('Xatolik xabarlarni yuklashda:', error);
            messagesContainer.innerHTML = '<p class="text-red-500 text-center py-8">Xatolik yuz berdi. Qayta urunib ko\'ring.</p>';
        }
    }
    
    // Galereyani yuklash
    async function loadGallery() {
        try {
            const response = await fetch('https://portf3.onrender.com/api/gallery');
            const gallery = await response.json();
            
            galleryAdminContainer.innerHTML = '';
            
            if (gallery.length === 0) {
                galleryAdminContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Hali galereya elementlari mavjud emas.</p>';
                return;
            }
            
            gallery.forEach(item => {
                const galleryElement = createGalleryElement(item);
                galleryAdminContainer.appendChild(galleryElement);
            });
        } catch (error) {
            console.error('Xatolik galereyani yuklashda:', error);
            galleryAdminContainer.innerHTML = '<p class="text-red-500 text-center py-8">Xatolik yuz berdi. Qayta urunib ko\'ring.</p>';
        }
    }
    
    // Post elementini yaratish
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'bg-white rounded-xl overflow-hidden shadow-md border border-gray-200';
        postDiv.innerHTML = `
            ${post.mediaUrl ? `
                <div class="h-48 overflow-hidden">
                    ${post.mediaType === 'image' ? 
                        `<img src="${post.mediaUrl}" alt="${post.title}" class="w-full h-full object-cover">` : 
                        `<video src="${post.mediaUrl}" class="w-full h-full object-cover" controls></video>`
                    }
                </div>
            ` : ''}
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${post.title}</h3>
                <p class="text-gray-600 mb-4">${post.content.substring(0, 100)}...</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${new Date(post.createdAt).toLocaleDateString()}</span>
                    <div class="flex items-center space-x-2">
                        <span class="text-gray-600"><i class="far fa-heart"></i> ${post.likes}</span>
                        <span class="text-gray-600"><i class="far fa-comment"></i> ${post.comments.length}</span>
                    </div>
                </div>
                <div class="flex justify-end space-x-2 mt-4">
                    <button class="text-blue-500 hover:text-blue-700 edit-post" data-id="${post._id}">
                        <i class="fas fa-edit"></i> Tahrirlash
                    </button>
                    <button class="text-red-500 hover:text-red-700 delete-post" data-id="${post._id}">
                        <i class="fas fa-trash"></i> O'chirish
                    </button>
                </div>
            </div>
        `;
        
        return postDiv;
    }
    
    // Xabar elementini yaratish
    function createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 p-6 mb-4';
        messageDiv.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold">${message.name}</h3>
                    <p class="text-gray-600">${message.email}</p>
                </div>
                <span class="text-sm text-gray-500">${new Date(message.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="text-gray-700 mb-4">${message.message}</p>
            <div class="flex justify-end">
                <button class="text-red-500 hover:text-red-700 delete-message" data-id="${message._id}">
                    <i class="fas fa-trash"></i> O'chirish
                </button>
            </div>
        `;
        
        return messageDiv;
    }
    
    // Galereya elementini yaratish
    function createGalleryElement(item) {
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'bg-white rounded-xl overflow-hidden shadow-md border border-gray-200';
        galleryDiv.innerHTML = `
            <div class="h-48 overflow-hidden">
                ${item.type === 'image' ? 
                    `<img src="${item.url}" alt="${item.title}" class="w-full h-full object-cover">` : 
                    `<video src="${item.url}" class="w-full h-full object-cover" controls></video>`
                }
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${item.title}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${new Date(item.createdAt).toLocaleDateString()}</span>
                    <span class="text-sm text-gray-500 capitalize">${item.type}</span>
                </div>
                <div class="flex justify-end space-x-2 mt-4">
                    <button class="text-red-500 hover:text-red-700 delete-gallery" data-id="${item._id}">
                        <i class="fas fa-trash"></i> O'chirish
                    </button>
                </div>
            </div>
        `;
        
        return galleryDiv;
    }
    
    // Yangi post qo'shish
    addPostBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Yangi Post Qo\'shish';
        document.getElementById('post-id').value = '';
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        document.getElementById('media-type').value = 'none';
        mediaFileContainer.classList.add('hidden');
        mediaPreview.classList.add('hidden');
        mediaPreview.innerHTML = '';
        mediaFile.value = '';
        
        postModal.classList.remove('hidden');
    });
    
    // Yangi galereya elementi qo'shish
    addGalleryBtn.addEventListener('click', function() {
        document.getElementById('gallery-modal-title').textContent = 'Yangi Media Qo\'shish';
        document.getElementById('gallery-id').value = '';
        document.getElementById('gallery-title').value = '';
        document.getElementById('gallery-type').value = 'image';
        galleryPreview.classList.add('hidden');
        galleryPreview.innerHTML = '';
        galleryFile.value = '';
        
        galleryModal.classList.remove('hidden');
    });
    
    // Post formasi
    postForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('post-title').value);
        formData.append('content', document.getElementById('post-content').value);
        formData.append('mediaType', document.getElementById('media-type').value);
        
        const mediaFile = document.getElementById('media-file').files[0];
        if (mediaFile) {
            formData.append('media', mediaFile);
        }
        
        const postId = document.getElementById('post-id').value;
        const url = postId ? `https://portf3.onrender.com/api/posts/${postId}` : 'https://portf3.onrender.com/api/posts';
        const method = postId ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            if (response.ok) {
                postModal.classList.add('hidden');
                loadPosts();
            } else {
                console.error('Xatolik postni saqlashda');
            }
        } catch (error) {
            console.error('Xatolik postni saqlashda:', error);
        }
    });
    
    // Galereya formasi
    galleryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('gallery-title').value);
        formData.append('type', document.getElementById('gallery-type').value);
        
        const galleryFile = document.getElementById('gallery-file').files[0];
        if (galleryFile) {
            formData.append('media', galleryFile);
        }
        
        const galleryId = document.getElementById('gallery-id').value;
        const url = galleryId ? `https://portf3.onrender.com/api/gallery/${galleryId}` : 'https://portf3.onrender.com/api/gallery';
        const method = galleryId ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            if (response.ok) {
                galleryModal.classList.add('hidden');
                loadGallery();
            } else {
                console.error('Xatolik galereya elementini saqlashda');
            }
        } catch (error) {
            console.error('Xatolik galereya elementini saqlashda:', error);
        }
    });
    
    // Modalni yopish
    document.getElementById('close-modal').addEventListener('click', function() {
        postModal.classList.add('hidden');
    });
    
    document.getElementById('close-gallery-modal').addEventListener('click', function() {
        galleryModal.classList.add('hidden');
    });
    
    document.getElementById('cancel-post').addEventListener('click', function() {
        postModal.classList.add('hidden');
    });
    
    document.getElementById('cancel-gallery').addEventListener('click', function() {
        galleryModal.classList.add('hidden');
    });
    
    // O'chirish modali
    document.getElementById('cancel-delete').addEventListener('click', function() {
        deleteModal.classList.add('hidden');
    });
    
    document.getElementById('confirm-delete').addEventListener('click', async function() {
        if (currentDeleteId && currentDeleteType) {
            try {
                let url = '';
                if (currentDeleteType === 'post') {
                    url = `https://portf3.onrender.com/api/posts/${currentDeleteId}`;
                } else if (currentDeleteType === 'message') {
                    url = `https://portf3.onrender.com/api/messages/${currentDeleteId}`;
                } else if (currentDeleteType === 'gallery') {
                    url = `https://portf3.onrender.com/api/gallery/${currentDeleteId}`;
                }
                
                const response = await fetch(url, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    deleteModal.classList.add('hidden');
                    
                    // Yangilash
                    if (currentDeleteType === 'post') {
                        loadPosts();
                    } else if (currentDeleteType === 'message') {
                        loadMessages();
                    } else if (currentDeleteType === 'gallery') {
                        loadGallery();
                    }
                }
            } catch (error) {
                console.error('Xatolik o\'chirishda:', error);
            }
        }
    });
    
    // Event delegatsiya
    document.addEventListener('click', function(e) {
        // Postni tahrirlash
        if (e.target.classList.contains('edit-post') || e.target.closest('.edit-post')) {
            const btn = e.target.classList.contains('edit-post') ? e.target : e.target.closest('.edit-post');
            const postId = btn.getAttribute('data-id');
            editPost(postId);
        }
        
        // Postni o'chirish
        if (e.target.classList.contains('delete-post') || e.target.closest('.delete-post')) {
            const btn = e.target.classList.contains('delete-post') ? e.target : e.target.closest('.delete-post');
            const postId = btn.getAttribute('data-id');
            showDeleteModal(postId, 'post');
        }
        
        // Xabarni o'chirish
        if (e.target.classList.contains('delete-message') || e.target.closest('.delete-message')) {
            const btn = e.target.classList.contains('delete-message') ? e.target : e.target.closest('.delete-message');
            const messageId = btn.getAttribute('data-id');
            showDeleteModal(messageId, 'message');
        }
        
        // Galereya elementini o'chirish
        if (e.target.classList.contains('delete-gallery') || e.target.closest('.delete-gallery')) {
            const btn = e.target.classList.contains('delete-gallery') ? e.target : e.target.closest('.delete-gallery');
            const galleryId = btn.getAttribute('data-id');
            showDeleteModal(galleryId, 'gallery');
        }
    });
    
    // Postni tahrirlash
    async function editPost(postId) {
        try {
            const response = await fetch(`https://portf3.onrender.com/api/posts/${postId}`);
            const post = await response.json();
            
            document.getElementById('modal-title').textContent = 'Postni Tahrirlash';
            document.getElementById('post-id').value = post._id;
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-content').value = post.content;
            document.getElementById('media-type').value = post.mediaType || 'none';
            
            if (post.mediaUrl) {
                mediaPreview.innerHTML = '';
                if (post.mediaType === 'image') {
                    mediaPreview.innerHTML = `<img src="${post.mediaUrl}" class="max-h-48 rounded-md">`;
                } else if (post.mediaType === 'video') {
                    mediaPreview.innerHTML = `<video src="${post.mediaUrl}" class="max-h-48 rounded-md" controls></video>`;
                }
                mediaPreview.classList.remove('hidden');
                mediaFileContainer.classList.remove('hidden');
            } else {
                mediaPreview.classList.add('hidden');
                mediaFileContainer.classList.add('hidden');
            }
            
            postModal.classList.remove('hidden');
        } catch (error) {
            console.error('Xatolik postni yuklashda:', error);
        }
    }
    
    // O'chirish modali
    function showDeleteModal(id, type) {
        currentDeleteId = id;
        currentDeleteType = type;
        deleteModal.classList.remove('hidden');
    }
    
    // Tashqi joyga bosganda modallarni yopish
    postModal.addEventListener('click', function(e) {
        if (e.target === postModal) {
            postModal.classList.add('hidden');
        }
    });
    
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            galleryModal.classList.add('hidden');
        }
    });
    
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.classList.add('hidden');
        }
    });
    
    // Chiqish
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        // Bu yerda chiqish logikasi
        window.location.href = '/';
    });
    
    // Dastlabki yuklash
    loadPosts();
});
