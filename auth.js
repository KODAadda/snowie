// THAY THẰNG URL CỦA BẠN VÀO ĐÂY
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyD3yd5d4BAAlnSG5ACShoxODaiatVI9u2UKC_LgwnHB20zJ3zx_HzKjXHdWcuafY0o/exec';

// Xử lý form đăng ký
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };
    
    // Validate
    if (!userData.name || !userData.email || !userData.password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (userData.password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    try {
        // Hiển thị loading
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Đang đăng ký...';
        submitBtn.disabled = true;
        
        // Gửi data đến Google Sheets
        await sendToGoogleSheets(userData);
        
        // Lưu vào localStorage để đăng nhập ngay
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        alert('✅ Đăng ký thành công! Chào mừng ' + userData.name);
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        alert('❌ Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
    } finally {
        // Khôi phục button
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Đăng ký';
            submitBtn.disabled = false;
        }
    }
});

// Hàm gửi data đến Google Sheets
async function sendToGoogleSheets(userData) {
    const formData = new URLSearchParams();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Network error');
    }
    
    const result = await response.text();
    console.log('Kết quả từ server:', result);
    
    return result;
}

// Kiểm tra đăng nhập khi trang load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Nếu đã đăng nhập, chuyển hướng về trang chủ
        window.location.href = 'index.html';
    }

});
