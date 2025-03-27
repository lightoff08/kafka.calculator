// app.js
document.addEventListener('DOMContentLoaded', () => {
    let isShift = false;
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const scientificButtons = document.querySelectorAll('.scientific');
    scientificButtons.forEach(button => {
        button.dataset.original = button.textContent;
    });
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
    function handleValue(value) {
        if (isShift) {
            value = applyShift(value);
            toggleShift();
        }
        display.value += value;
    }
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
    function toggleShift() {
        isShift = !isShift;
        document.querySelector('.shift').style.background = isShift ? '#6a11cb' : '#ff69f5';
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
    function clearDisplay() {
        display.value = '';
    }
    function backspace() {
        display.value = display.value.slice(0, -1);
    }
    function factorial(n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calculate();
        if (e.key === 'Backspace') backspace();
    });
});
