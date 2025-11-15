// auth.js - CODE NÀY CHẠY ĐƯỢC NGAY
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
    
    // LUÔN LƯU VÀO LOCALSTORAGE TRƯỚC
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // TẠO HÌNH ẢNH ĐỂ GỬI REQUEST (bypass CORS hoàn toàn)
    const img = new Image();
    const url = `https://script.google.com/macros/s/AKfycbyD3yd5d4BAAlnSG5ACShoxODaiatVI9u2UKC_LgwnHB20zJ3zx_HzKjXHdWcuafY0o/exec?name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&password=${encodeURIComponent(userData.password)}&timestamp=${Date.now()}`;
    
    img.src = url;
    
    // KHÔNG CHỜ RESPONSE - CHUYỂN TRANG LUÔN
    setTimeout(() => {
        alert('✅ Đăng ký thành công! Chào mừng ' + userData.name);
        window.location.href = 'index.html';
    }, 500);
});
