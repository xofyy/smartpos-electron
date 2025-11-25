export const translations = {
    tr: {
        // Navigation
        nav_pos: 'POS Terminali',
        nav_products: 'Ürünler',
        nav_settings: 'Ayarlar',
        
        // Common
        search_placeholder: 'Ürün ara...',
        all: 'Tümü',
        cancel: 'İptal',
        save: 'Kaydet',
        delete: 'Sil',
        edit: 'Düzenle',
        actions: 'İşlemler',
        
        // Cart
        current_sale: 'Mevcut Satış',
        cart_empty: 'Sepet boş',
        total: 'Toplam',
        cash: 'Nakit',
        card: 'Kart',
        processing: 'İşleniyor...',
        sale_completed: 'Satış tamamlandı!',
        sale_failed: 'Satış başarısız!',
        
        // Product List
        add_product: 'Ürün Ekle',
        barcode: 'Barkod',
        name: 'İsim',
        category: 'Kategori',
        price: 'Fiyat',
        stock: 'Stok',
        no_products: 'Ürün bulunamadı. Başlamak için ürün ekleyin.',
        delete_confirm: 'Bu ürünü silmek istediğinize emin misiniz?',
        uncategorized: 'Kategorisiz',
        in_stock: 'stokta',
        
        // Product Modal
        edit_product: 'Ürünü Düzenle',
        new_product: 'Yeni Ürün Ekle',
        product_name: 'Ürün Adı',
        error_saving: 'Ürün kaydedilirken hata oluştu',
        
        // Settings
        settings_title: 'Ayarlar',
        general: 'Genel',
        hardware: 'Donanım',
        data: 'Veri Yönetimi',
        currency_symbol: 'Para Birimi Sembolü',
        language: 'Dil',
        theme: 'Tema',
        theme_light: 'Açık (Light)',
        theme_dark: 'Koyu (Dark)',
        scanner_settings: 'Barkod Okuyucu',
        connection_type: 'Bağlantı Tipi',
        usb_keyboard: 'USB Klavye (Tak-Çalıştır)',
        serial_port: 'Seri Port (RS232)',
        port_selection: 'Port Seçimi',
        pos_device: 'POS Cihazı (Ödeme Terminali)',
        connection_port: 'Bağlantı Portu',
        pos_hint: 'Ödeme terminalinin bağlı olduğu COM portunu seçiniz.',
        backup_db: 'Veritabanı Yedekle',
        backup_desc: 'Tüm satış ve ürün verilerinizi güvenli bir dosyaya yedekleyin.',
        backup_btn: 'Yedekle',
        factory_reset: 'Fabrika Ayarlarına Dön',
        reset_desc: 'DİKKAT: Bu işlem tüm ürünleri, satışları ve ayarları kalıcı olarak silecektir. Geri alınamaz!',
        reset_btn: 'Tüm Verileri Sil ve Sıfırla',
        reset_confirm: 'Tüm veriler silinecek ve fabrika ayarlarına dönülecek. Emin misiniz?',
        backup_success: 'Yedekleme başarılı!\nKonum:',
        backup_fail: 'Yedekleme başarısız!',
        currency_example: 'Örnek: ₺, $, €',
        lang_tr: 'Türkçe',
        lang_en: 'English',
        reset_fail: 'Sıfırlama başarısız!'
    },
    en: {
        // Navigation
        nav_pos: 'POS Terminal',
        nav_products: 'Products',
        nav_settings: 'Settings',
        
        // Common
        search_placeholder: 'Search products...',
        all: 'All',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        actions: 'Actions',
        
        // Cart
        current_sale: 'Current Sale',
        cart_empty: 'Cart is empty',
        total: 'Total',
        cash: 'Cash',
        card: 'Card',
        processing: 'Processing...',
        sale_completed: 'Sale completed!',
        sale_failed: 'Sale failed!',
        
        // Product List
        add_product: 'Add Product',
        barcode: 'Barcode',
        name: 'Name',
        category: 'Category',
        price: 'Price',
        stock: 'Stock',
        no_products: 'No products found. Add some products to get started.',
        delete_confirm: 'Are you sure you want to delete this product?',
        uncategorized: 'Uncategorized',
        in_stock: 'in stock',
        
        // Product Modal
        edit_product: 'Edit Product',
        new_product: 'Add New Product',
        product_name: 'Product Name',
        error_saving: 'Error saving product',
        
        // Settings
        settings_title: 'Settings',
        general: 'General',
        hardware: 'Hardware',
        data: 'Data Management',
        currency_symbol: 'Currency Symbol',
        language: 'Language',
        theme: 'Theme',
        theme_light: 'Light',
        theme_dark: 'Dark',
        scanner_settings: 'Barcode Scanner',
        connection_type: 'Connection Type',
        usb_keyboard: 'USB Keyboard (Plug & Play)',
        serial_port: 'Serial Port (RS232)',
        port_selection: 'Port Selection',
        pos_device: 'POS Device (Payment Terminal)',
        connection_port: 'Connection Port',
        pos_hint: 'Select the COM port where the payment terminal is connected.',
        backup_db: 'Backup Database',
        backup_desc: 'Backup all sales and product data to a secure file.',
        backup_btn: 'Backup',
        factory_reset: 'Factory Reset',
        reset_desc: 'WARNING: This will permanently delete all products, sales, and settings. Cannot be undone!',
        reset_btn: 'Delete All Data & Reset',
        reset_confirm: 'All data will be deleted and settings reset. Are you sure?',
        backup_success: 'Backup successful!\nLocation:',
        backup_fail: 'Backup failed!',
        currency_example: 'Example: ₺, $, €',
        lang_tr: 'Turkish',
        lang_en: 'English',
        reset_fail: 'Reset failed!'
    }
}

export type TranslationKey = keyof typeof translations.tr
