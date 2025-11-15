const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1ASuGvrR3PwW1frWpGqV6WKnVcgT0LeBl6d5h8CCBJkPN9y27WDfO7WzbGUgTuXM/exec';

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    console.log('📝 Dữ liệu đăng ký:', userData);
    
    try {
        // Hiển thị loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;
        
        // Gửi đến Google Sheets với no-cors
        const formData = new URLSearchParams();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        
        console.log('🚀 Đang gửi request đến Google Sheets...');
        
        // Sử dụng no-cors mode
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        console.log('✅ Request đã gửi (no-cors mode)');
        
        // Lưu local
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        alert('✅ Đăng ký thành công! Chào mừng ' + userData.name);
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('❌ Lỗi:', error);
        alert('❌ Lỗi đăng ký: ' + error.message);
    } finally {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Đăng ký';
            submitBtn.disabled = false;
        }
    }
});

// Kiểm tra form có tồn tại không
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (form) {
        console.log('✅ Form đăng ký đã được tìm thấy');
    } else {
        console.error('❌ Không tìm thấy form đăng ký');
    }
});
