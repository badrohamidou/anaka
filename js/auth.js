// بيانات تسجيل الدخول (يمكنك تغييرها)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// التحقق من تسجيل الدخول
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (window.location.pathname.includes('admin.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    }
    
    if (window.location.pathname.includes('login.html') && isLoggedIn) {
        window.location.href = 'admin.html';
    }
}

// معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.querySelector('.login-btn');
    
    // إظهار حالة التحميل
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // محاكاة تأخير الخادم
    setTimeout(() => {
        if (username === ADMIN_CREDENTIALS.username && 
            password === ADMIN_CREDENTIALS.password) {
            // نجاح تسجيل الدخول
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUsername', username);
            
            // إعادة التوجيه إلى لوحة التحكم
            window.location.href = 'admin.html';
        } else {
            // فشل تسجيل الدخول
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // إضافة تأثير الاهتزاز
            document.querySelector('.login-card').style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                document.querySelector('.login-card').style.animation = '';
            }, 500);
        }
    }, 1000);
}

// تسجيل الخروج
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    window.location.href = 'login.html';
}

// إضافة تأثير الاهتزاز
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}
`;

// إضافة الCSS للصفحة
const style = document.createElement('style');
style.textContent = shakeKeyframes;
document.head.appendChild(style);

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    // إضافة معالجات الأحداث
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // إضافة معالج لزر الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});
