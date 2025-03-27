document.addEventListener('DOMContentLoaded', () => {
    let isShift = false;
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const scientificButtons = document.querySelectorAll('.scientific');

    // 儲存原始的文字標籤，方便切換時回復
    scientificButtons.forEach(button => {
        button.dataset.original = button.textContent;
    });

    // 按鈕事件監聽
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            const action = button.dataset.action;

            if (action) {
                handleAction(action);
            } else if (value) {
                handleValue(value);
            }
        });
    });

    // 處理數值輸入
    function handleValue(value) {
        if (isShift) {
            value = applyShift(value);
            toggleShift(); // 自動關閉 shift
        }
        display.value += value;
    }

    // 處理特殊操作
    function handleAction(action) {
        switch(action) {
            case 'clear':
                clearDisplay();
                break;
            case 'backspace':
                backspace();
                break;
            case 'calculate':
                calculate();
                break;
            case 'shift':
                toggleShift();
                break;
        }
    }

    // 切換 Shift 狀態，並更新科學按鈕文字
    function toggleShift() {
        isShift = !isShift;
        document.querySelector('.shift').style.background = isShift ? '#6a11cb' : '#ff69f5';
        
        // 定義對應的轉換規則（僅對按鈕上顯示的文字，不含括號）
        const mapping = {
            'sin': 'asin',
            'cos': 'acos',
            'tan': 'atan',
            'log': 'log10',
            'ln': 'exp',
            '√': '^3√',
            'x^y': 'x^2',
            'π': '2π',
            'e': '1/e',
            '!': 'nPr'
        };

        scientificButtons.forEach(button => {
            const orig = button.dataset.original;
            button.textContent = isShift ? (mapping[orig] || orig) : orig;
        });
    }

    // Shift 狀態下對輸入值的轉換
    function applyShift(value) {
        const shiftMap = {
            'sin(': 'asin(',
            'cos(': 'acos(',
            'tan(': 'atan(',
            'log(': 'log10(',
            'ln(': 'exp(',
            '√(': '^3√(',
            '^': 'x^2',
            'π': '2π',
            'e': '1/e',
            '!': 'nPr'
        };
        return shiftMap[value] || value;
    }

    // 清除顯示
    function clearDisplay() {
        display.value = '';
    }

    // 刪除字元
    function backspace() {
        display.value = display.value.slice(0, -1);
    }

    // 階乘計算
    function factorial(n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    // 計算結果
    function calculate() {
        try {
            let expr = display.value
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E)
                .replace(/√\((.+?)\)/g, 'Math.sqrt($1)')
                .replace(/\^3√\((.+?)\)/g, 'Math.cbrt($1)')
                .replace(/\^/g, '**')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/asin\(/g, 'Math.asin(')
                .replace(/acos\(/g, 'Math.acos(')
                .replace(/atan\(/g, 'Math.atan(')
                .replace(/log\(/g, 'Math.log(')
                .replace(/log10\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/exp\(/g, 'Math.exp(')
                .replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)));

            display.value = eval(expr);
        } catch (error) {
            display.value = 'Error';
        }
    }

    // 鍵盤支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calculate();
        if (e.key === 'Backspace') backspace();
    });
});
