// واجهة الإدارة
class AdminInterface {
    constructor() {
        this.currentTab = 'perfumes';
        this.editingItem = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadTabContent();
        this.updateAdminUsername();
    }
    
    // تحديث اسم المشرف
    updateAdminUsername() {
        const username = localStorage.getItem('adminUsername');
        if (username) {
            document.getElementById('adminUsername').textContent = username;
        }
    }
    
    // إعداد معالجات الأحداث
    setupEventListeners() {
        // أزرار التنقل
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // أزرار الإضافة
        const perfumeForm = document.getElementById('perfumeForm');
        if (perfumeForm) {
            perfumeForm.addEventListener('submit', (e) => this.handlePerfumeSubmit(e));
        }
        
        const bottleForm = document.getElementById('bottleForm');
        if (bottleForm) {
            bottleForm.addEventListener('submit', (e) => this.handleBottleSubmit(e));
        }
        
        // أزرار إغلاق النوافذ
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        // النقر خارج النافذة
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // استيراد البيانات
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.handleImport(e));
        }
    }
    
    // تبديل التبويبات
    switchTab(tabName) {
        // تحديث الأزرار النشطة
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // تحديث المحتوى
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        this.currentTab = tabName;
        this.loadTabContent();
    }
    
    // تحميل محتوى التبويب
    loadTabContent() {
        switch (this.currentTab) {
            case 'perfumes':
                this.loadPerfumes();
                break;
            case 'bottles':
                this.loadBottles();
                break;
            case 'orders':
                this.loadOrders();
                break;
        }
    }
    
    // تحميل العطور
    loadPerfumes() {
        const perfumes = dataManager.getAllPerfumes();
        const container = document.getElementById('perfumesList');
        
        if (perfumes.length === 0) {
            container.innerHTML = '<p class="no-items">لا توجد عطور مضافة بعد</p>';
            return;
        }
        
        container.innerHTML = perfumes.map(perfume => this.createPerfumeCard(perfume)).join('');
    }
    
    // إنشاء بطاقة العطر
    createPerfumeCard(perfume) {
        return `
            <div class="item-card">
                <img src="${perfume.image}" alt="${perfume.name}" class="item-image">
                <h3 class="item-name">${perfume.name}</h3>
                <p class="item-description">${perfume.description}</p>
                <p class="item-price">${perfume.pricePerMl} ريال للمل</p>
                <p class="item-type">النوع: ${this.getTypeLabel(perfume.type)}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="adminInterface.editPerfume(${perfume.id})">تعديل</button>
                    <button class="btn-delete" onclick="adminInterface.deletePerfume(${perfume.id})">حذف</button>
                </div>
            </div>
        `;
    }
    
    // تحميل الزجاجات
    loadBottles() {
        const bottles = dataManager.getAllBottles();
        const container = document.getElementById('bottlesList');
        
        if (bottles.length === 0) {
            container.innerHTML = '<p class="no-items">لا توجد زجاجات مضافة بعد</p>';
            return;
        }
        
        container.innerHTML = bottles.map(bottle => this.createBottleCard(bottle)).join('');
    }
    
    // إنشاء بطاقة الزجاجة
    createBottleCard(bottle) {
        return `
            <div class="item-card">
                <img src="${bottle.image}" alt="${bottle.name}" class="item-image">
                <h3 class="item-name">${bottle.name}</h3>
                <p class="item-description">${bottle.description}</p>
                <p class="item-price">السعة: ${bottle.capacity} مل</p>
                <p class="item-price">السعر: ${bottle.price} ريال</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="adminInterface.editBottle(${bottle.id})">تعديل</button>
                    <button class="btn-delete" onclick="adminInterface.deleteBottle(${bottle.id})">حذف</button>
                </div>
            </div>
        `;
    }
    
    // تحميل الطلبات
    loadOrders() {
        const orders = dataManager.getAllOrders();
        const container = document.getElementById('ordersList');
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="no-items">لا توجد طلبات حتى الآن</p>';
            return;
        }
        
        // ترتيب الطلبات حسب التاريخ (الأحدث أولاً)
        const sortedOrders = orders.sort((a, b) => b.id - a.id);
        
        container.innerHTML = sortedOrders.map(order => this.createOrderCard(order)).join('');
    }
    
    // إنشاء بطاقة الطلب
    createOrderCard(order) {
        return `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">طلب #${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-details">
                    <div class="order-detail">
                        <span class="order-label">العطر:</span>
                        <span class="order-value">${order.perfumeName}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-label">الزجاجة:</span>
                        <span class="order-value">${order.bottleName}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-label">السعر النهائي:</span>
                        <span class="order-value">${order.finalPrice} ريال</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-label">رقم الهاتف:</span>
                        <span class="order-value">${order.phoneNumber}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // الحصول على تسمية النوع
    getTypeLabel(type) {
        const labels = {
            'men': 'رجالي',
            'women': 'نسائي',
            'unisex': 'مشترك'
        };
        return labels[type] || type;
    }
    
    // عرض نموذج إضافة عطر
    showAddPerfumeForm() {
        this.editingItem = null;
        document.getElementById('perfumeForm').reset();
        document.querySelector('#perfumeModal h3').textContent = 'إضافة عطر جديد';
        document.getElementById('perfumeModal').style.display = 'block';
    }
    
    // عرض نموذج إضافة زجاجة
    showAddBottleForm() {
        this.editingItem = null;
        document.getElementById('bottleForm').reset();
        document.querySelector('#bottleModal h3').textContent = 'إضافة زجاجة جديدة';
        document.getElementById('bottleModal').style.display = 'block';
    }
    
    // معالجة إرسال نموذج العطر
    handlePerfumeSubmit(event) {
        event.preventDefault();
        
        const perfume = {
            name: document.getElementById('perfumeName').value,
            description: document.getElementById('perfumeDescription').value,
            pricePerMl: parseFloat(document.getElementById('perfumePrice').value),
            type: document.getElementById('perfumeType').value,
            image: document.getElementById('perfumeImage').value || 'https://images.unsplash.com/photo-1555356114-4d5c6bcb3d58?w=400'
        };
        
        if (this.editingItem) {
            // تعديل العطر الموجود
            const perfumes = dataManager.getAllPerfumes();
            const index = perfumes.findIndex(p => p.id === this.editingItem);
            if (index !== -1) {
                perfumes[index] = { ...perfumes[index], ...perfume };
                localStorage.setItem('luxuryPerfumes', JSON.stringify(perfumes));
            }
        } else {
            // إضافة عطر جديد
            dataManager.addPerfume(perfume);
        }
        
        // إغلاق النافذة وإعادة التحميل
        document.getElementById('perfumeModal').style.display = 'none';
        this.loadPerfumes();
        this.showNotification('تم حفظ العطر بنجاح', 'success');
    }
    
    // معالجة إرسال نموذج الزجاجة
    handleBottleSubmit(event) {
        event.preventDefault();
        
        const bottle = {
            name: document.getElementById('bottleName').value,
            capacity: parseInt(document.getElementById('bottleCapacity').value),
            price: parseFloat(document.getElementById('bottlePrice').value),
            description: document.getElementById('bottleDescription').value,
            image: document.getElementById('bottleImage').value || 'https://images.unsplash.com/photo-1602941800791-758cfdb6f7e4?w=400'
        };
        
        if (this.editingItem) {
            // تعديل الزجاجة الموجودة
            const bottles = dataManager.getAllBottles();
            const index = bottles.findIndex(b => b.id === this.editingItem);
            if (index !== -1) {
                bottles[index] = { ...bottles[index], ...bottle };
                local
