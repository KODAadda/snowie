// auth.js - CODE HOÀN CHỈNH
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    if (!userData.name || !userData.email || !userData.password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Hiển thị loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    
    // LUÔN thành công trước (không chờ response)
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Gửi đến Google Sheets (không chặn UI)
    const formData = `name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&password=${encodeURIComponent(userData.password)}`;
    
    // Tạo hidden iframe để gửi request (bypass CORS)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `https://script.google.com/macros/s/AKfycbyD3yd5d4BAAlnSG5ACShoxODaiatVI9u2UKC_LgwnHB20zJ3zx_HzKjXHdWcuafY0o/exec?${formData}`;
    document.body.appendChild(iframe);
    
    // Chuyển trang sau 1 giây
    setTimeout(() => {
        alert('✅ Đăng ký thành công! Chào mừng ' + userData.name);
        window.location.href = 'index.html';
    }, 1000);
    
    // Xóa iframe sau 5 giây
    setTimeout(() => {
        iframe.remove();
    }, 5000);
});
