// نظام إدارة البيانات باستخدام LocalStorage

class DataManager {
    constructor() {
        this.perfumesKey = 'luxuryPerfumes';
        this.bottlesKey = 'luxuryBottles';
        this.ordersKey = 'luxuryOrders';
        
        // تهيئة البيانات الافتراضية
        this.initializeDefaultData();
    }
    
    // تهيئة البيانات الافتراضية
    initializeDefaultData() {
        // العطور الافتراضية
        const defaultPerfumes = [
            {
                id: 1,
                name: "عطر الملوك الذهبي",
                description: "مزيج فاخر من المسك والعنبر مع نفحات من الأخشاب الشرقية",
                pricePerMl: 15,
                type: "men",
                image: "https://images.unsplash.com/photo-1555356114-4d5c6bcb3d58?w=400"
            },
            {
                id: 2,
                name: "وردة الشرق",
                description: "عبير وردي أنثوي يجمع بين رقة الزهور وعمق العود",
                pricePerMl: 18,
                type: "women",
                image: "https://images.unsplash.com/photo-1585386959984-a415522e3fd9?w=400"
            },
            {
                id: 3,
                name: "ليلة العرب",
                description: "عطر ليلي ساحر يمزج بين التوابل الشرقية والمسك الأسود",
                pricePerMl: 20,
                type: "unisex",
                image: "https://images.unsplash.com/photo-1562940313-1350a9f3122e?w=400"
            }
        ];
        
        // الزجاجات الافتراضية
        const defaultBottles = [
            {
                id: 1,
                name: "زجاجة فاخرة 30 مل",
                capacity: 30,
                price: 25,
                description: "زجاجة بلورية فاخرة مع غطاء ذهبي",
                image: "https://images.unsplash.com/photo-1602941800791-758cfdb6f7e4?w=400"
            },
            {
                id: 2,
                name: "زجاجة الماس 50 مل",
                capacity: 50,
                price: 35,
                description: "زجاجة على شكل ماسة مع حجر كريم",
                image: "https://images.unsplash.com/photo-1602941800791-758cfdb6f7e4?w=400"
            },
            {
                id: 3,
                name: "زجاجة الكريستال 100 مل",
                capacity: 100,
                price: 50,
                description: "زجاجة كريستال فاخرة مع أحجار سواروفسكي",
                image: "https://images.unsplash.com/photo-1602941800791-758cfdb6f7e4?w=400"
            }
        ];
        
        // التحقق من وجود البيانات
        if (!localStorage.getItem(this.perfumesKey)) {
            localStorage.setItem(this.perfumesKey, JSON.stringify(defaultPerfumes));
        }
        
        if (!localStorage.getItem(this.bottlesKey)) {
            localStorage.setItem(this.bottlesKey, JSON.stringify(defaultBottles));
        }
        
        if (!localStorage.getItem(this.ordersKey)) {
            localStorage.setItem(this.ordersKey, JSON.stringify([]));
        }
    }
    
    // الحصول على جميع العطور
    getAllPerfumes() {
        return JSON.parse(localStorage.getItem(this.perfumesKey)) || [];
    }
    
    // الحصول على جميع الزجاجات
    getAllBottles() {
        return JSON.parse(localStorage.getItem(this.bottlesKey)) || [];
    }
    
    // الحصول على جميع الطلبات
    getAllOrders() {
        return JSON.parse(localStorage.getItem(this.ordersKey)) || [];
    }
    
    // إضافة عطر جديد
    addPerfume(perfume) {
        const perfumes = this.getAllPerfumes();
        const newPerfume = {
            id: Date.now(),
            ...perfume
        };
        perfumes.push(newPerfume);
        localStorage.setItem(this.perfumesKey, JSON.stringify(perfumes));
        return newPerfume;
    }
    
    // إضافة زجاجة جديدة
    addBottle(bottle) {
        const bottles = this.getAllBottles();
        const newBottle = {
            id: Date.now(),
            ...bottle
        };
        bottles.push(newBottle);
        localStorage.setItem(this.bottlesKey, JSON.stringify(bottles));
        return newBottle;
    }
    
    // إضافة طلب جديد
    addOrder(order) {
        const orders = this.getAllOrders();
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleString('ar-SA'),
            ...order
        };
        orders.push(newOrder);
        localStorage.setItem(this.ordersKey, JSON.stringify(orders));
        
        // إرسال البريد الإلكتروني
        this.sendOrderEmail(newOrder);
        
        return newOrder;
    }
    
    // حذف عطر
    deletePerfume(id) {
        let perfumes = this.getAllPerfumes();
        perfumes = perfumes.filter(perfume => perfume.id !== id);
        localStorage.setItem(this.perfumesKey, JSON.stringify(perfumes));
    }
    
    // حذف زجاجة
    deleteBottle(id) {
        let bottles = this.getAllBottles();
        bottles = bottles.filter(bottle => bottle.id !== id);
        localStorage.setItem(this.bottlesKey, JSON.stringify(bottles));
    }
    
    // إرسال بريد إلكتروني بالطلب
    sendOrderEmail(order) {
        // استخدام mailto كبديل مجاني
        const subject = `طلب جديد - ${order.perfumeName}`;
        const body = `
        طلب جديد تم استلامه:
        
        العطر: ${order.perfumeName}
        الحجم: ${order.bottleName}
        السعر النهائي: ${order.finalPrice} ريال
        رقم الهاتف: ${order.phoneNumber}
        التاريخ: ${order.date}
        
        يرجى التواصل مع العميل في أقرب وقت ممكن.
        `;
        
        // فتح نافذة البريد
        window.open(`mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        
        // يمكنك استخدام EmailJS لاحقاً للإرسال التلقائي
        // هذا مجرد حل مؤقت مجاني
    }
    
    // تصدير البيانات
    exportData() {
        const data = {
            perfumes: this.getAllPerfumes(),
            bottles: this.getAllBottles(),
            orders: this.getAllOrders(),
            exportDate: new Date().toLocaleString('ar-SA')
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup-luxury-perfumes-${Date.now()}.json`;
        link.click();
    }
    
    // استيراد البيانات
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.perfumes) {
                        localStorage.setItem(this.perfumesKey, JSON.stringify(data.perfumes));
                    }
                    
                    if (data.bottles) {
                        localStorage.setItem(this.bottlesKey, JSON.stringify(data.bottles));
                    }
                    
                    if (data.orders) {
                        localStorage.setItem(this.ordersKey, JSON.stringify(data.orders));
                    }
                    
                    resolve('تم استيراد البيانات بنجاح');
                } catch (error) {
                    reject('خطأ في ملف البيانات');
                }
            };
            
            reader.readAsText(file);
        });
    }
}

// إنشاء instance عالمي
const dataManager = new DataManager();
