import { ELEMENTS, STORAGE_KEYS} from './constants.js';


export function setUtils() {
    setBtnChooseTheme();
}

// Button thay đổi nền light / dark
function setBtnChooseTheme() {

	ELEMENTS.btnSwitch = document.getElementById('btnSwitch');

	if(!ELEMENTS.btnSwitch) {return;}


    //const btnSwitch = document.getElementById('btnSwitch');

    // 1. Kiểm tra lưu trữ xem người dùng đã chọn theme gì trước đó chưa
    const storedTheme = STORAGE_KEYS.getData(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-bs-theme', storedTheme);

    // 2. Sự kiện click
    ELEMENTS.btnSwitch.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Áp dụng theme mới
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        
        // Lưu lựa chọn
        //localStorage.setItem('theme', newTheme);
        STORAGE_KEYS.saveData(STORAGE_KEYS.THEME, newTheme);
        
        // Đổi icon hiển thị (Tùy chọn)
        ELEMENTS.btnSwitch.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });   
}