// الواجهة الرئيسية للعملاء
class CustomerInterface {
    constructor() {
        this.selectedPerfume = null;
        this.selectedBottle = null;
        this.init();
    }
    
    init() {
        this.loadPerfumes();
        this.setupEventListeners();
    }
    
    // تحميل وعرض العطور
    loadPerfumes() {
        const perfumes = dataManager.getAllPerfumes();
        const grid = document.getElementById('perfumesGrid');
        
        grid.innerHTML = perfumes.map(perfume => this.createPerfumeCard(perfume)).join('');
        
        // إضافة معالجات الأحداث
        perfumes.forEach(perfume => {
            const card = document.querySelector(`[data-perfume-id="${perfume.id}"]`);
            if (card) {
                card.addEventListener('click', () => this.selectPerfume(perfume));
            }
        });
    }
    
    // إنشاء بطاقة العطر
    createPerfumeCard(perfume) {
        return `
            <div class="perfume-card" data-perfume-id="${perfume.id}">
                <img src="${perfume.image}" alt="${perfume.name}" class="perfume-image">
                <h3 class="perfume-name">${perfume.name}</h3>
                <p class="perfume-description">${perfume.description}</p>
                <p class="perfume-price">${perfume.pricePerMl} ريال للمل</p>
                <button class="btn-order" onclick="customerInterface.openOrderModal(${perfume.id})">
                    اطلب الآن
                </button>
            </div>
        `;
    }
    
    // فتح نافذة الطلب
    openOrderModal(perfumeId) {
        const perfumes = dataManager.getAllAllPerfumes();
        const perfume = perfumes.find(p => p.id === perfumeId);
        
        if (!perfume) return;
        
        this.selectedPerfume = perfume;
        
        // تعبئة البيانات
        document.getElementById('selectedPerfume').value = perfume.name;
        
        // تعبئة قائمة الزجاجات
        this.loadBottlesSelect();
        
        // إعادة تعيين السعر
        document.getElementById('finalPrice').value = '';
        
        // فتح النافذة
        document.getElementById('orderModal').style.display = 'block';
    }
    
    // تحميل الزجاجات في القائمة المختارة
    loadBottlesSelect() {
        const bottles = dataManager.getAllBottles();
        const select = document.getElementById('bottleSelect');
        
        select.innerHTML = '<option value="">اختر الحجم</option>' +
            bottles.map(bottle => `
                <option value="${bottle.id}">
                    ${bottle.name} - ${bottle.capacity} مل - ${bottle.price} ريال
                </option>
            `).join('');
    }
    
    // حساب السعر النهائي
    calculateFinalPrice() {
        const bottleId = document.getElementById('bottleSelect').value;
        if (!bottleId || !this.selectedPerfume) return;
        
        const bottles = dataManager.getAllBottles();
        const bottle = bottles.find(b => b.id == bottleId);
        
        if (!bottle) return;
        
        this.selectedBottle = bottle;
        
        const finalPrice = (bottle.capacity * this.selectedPerfume.pricePerMl) + bottle.price;
        document.getElementById('finalPrice').value = `${finalPrice} ريال`;
    }
    
    // معالجة إرسال الطلب
    handleOrderSubmit(event) {
        event.preventDefault();
        
        if (!this.selectedPerfume || !this.selectedBottle) {
            alert('يرجى اختيار العطر والحجم');
            return;
        }
        
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        
        if (!phoneNumber) {
            alert('يرجى إدخال رقم الهاتف');
            return;
        }
        
        // إنشاء الطلب
        const order = {
            perfumeName: this.selectedPerfume.name,
            bottleName: this.selectedBottle.name,
            finalPrice: (this.selectedBottle.capacity * this.selectedPerfume.pricePerMl) + this.selectedBottle.price,
            phoneNumber: phoneNumber,
            perfumeId: this.selectedPerfume.id,
            bottleId: this.selectedBottle.id
        };
        
        // حفظ الطلب
        dataManager.addOrder(order);
        
        // إظهار رسالة النجاح
        this.showSuccessMessage();
        
        // إغلاق النافذة وإعادة التعيين
        setTimeout(() => {
            document.getElementById('orderModal').style.display = 'none';
            document.getElementById('orderForm').reset();
            this.selectedPerfume = null;
            this.selectedBottle = null;
        }, 2000);
    }
    
    // إظهار رسالة النجاح
    showSuccessMessage() {
        // إنشاء عنصر رسالة النجاح
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3>شكراً لثقتك بنا</h3>
                <p>سنتصل بك قريباً لتأكيد طلبك</p>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // إزالة الرسالة بعد 3 ثواني
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    // إعداد معالجات الأحداث
    setupEventListeners() {
        // زر إغلاق النافذة
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('orderModal').style.display = 'none';
            });
        }
        
        // النقر خارج النافذة
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('orderModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // تغيير اختيار الزجاجة
        const bottleSelect = document.getElementById('bottleSelect');
        if (bottleSelect) {
            bottleSelect.addEventListener('change', () => this.calculateFinalPrice());
        }
        
        // إرسال النموذج
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.handleOrderSubmit(e));
        }
    }
}

// إنشاء instance عالمي
const customerInterface = new CustomerInterface();

// إضافة CSS للرسالة النجاح
const successStyle = `
<style>
.success-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
    border: 2px solid #D4AF37;
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    z-index: 3000;
    animation: successFadeIn 0.3s ease;
}

.success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.success-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #D4AF37, #FFD700);
    color: #0d0d0d;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.success-message h3 {
    color: #FFD700;
    margin-bottom: 0.5rem;
}

.success-message p {
    color: #f5f5f5;
}

@keyframes successFadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', successStyle);
