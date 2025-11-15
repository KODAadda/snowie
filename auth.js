// Sử dụng XMLHttpRequest thay vì fetch
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
    
    // Gửi đến Google Sheets
    const xhr = new XMLHttpRequest();
    const formData = `name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&password=${encodeURIComponent(userData.password)}`;
    
    xhr.open('POST', 'https://script.google.com/macros/s/AKfycbyD3yd5d4BAAlnSG5ACShoxODaiatVI9u2UKC_LgwnHB20zJ3zx_HzKjXHdWcuafY0o/exec', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // ✅ THÀNH CÔNG: Server trả về 200
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                        alert('✅ Đăng ký thành công! Chào mừng ' + userData.name);
                        window.location.href = 'index.html';
                    } else {
                        // Server trả về lỗi
                        alert('❌ Lỗi: ' + (response.message || 'Đăng ký thất bại'));
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                } catch (e) {
                    // Lỗi parse JSON
                    alert('❌ Lỗi xử lý dữ liệu từ server');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } else {
                // ❌ HTTP ERROR
                alert('❌ Lỗi kết nối: ' + xhr.status + ' - ' + xhr.statusText);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    };
    
    xhr.onerror = function() {
        // ❌ LỖI MẠNG
        alert('❌ Lỗi kết nối mạng! Vui lòng thử lại.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    };
    
    xhr.send(formData);
});
