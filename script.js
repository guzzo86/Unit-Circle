const canvas = document.getElementById('unitCircle');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;
const gridSpacing = 60;
let dragging = false;

const point = {
    x: centerX + radius,
    y: centerY,
    radius: 7 // Smaller radius for the draggable point
};

function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#444'; // Lighter grid lines for contrast
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff'; // White text for contrast

    for (let x = 0; x <= canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        if (x !== centerX) {
            const label = (x < centerX) ? (centerX - x) / gridSpacing * -1 : (x - centerX) / gridSpacing;
            ctx.fillText(label === Math.floor(label) ? label.toFixed(0) : label.toFixed(1), x, centerY + 15); // Label x-axis
        }
    }    
    for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        if (y !== centerY) {
            const label = (centerY - y) / gridSpacing;
            ctx.fillText(label === Math.floor(label) ? label.toFixed(0) : label.toFixed(1), centerX + 5, y + 5); // Label y-axis
        }
    }

    // Draw coordinate axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Label the origin
    ctx.fillText('0', centerX + 5, centerY + 15);

    // Draw unit circle
    ctx.strokeStyle = '#fff'; // White circle for contrast
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw radius line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    // Draw point
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; // White point for visibility
    ctx.fill();

    // Draw perpendicular lines to x and y axes
    ctx.strokeStyle = '#f00'; // Red lines for visibility
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, centerY);
    ctx.stroke();
    ctx.strokeStyle = '#00F'; // Blue lines for visibility
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(centerX, point.y);
    ctx.stroke();

    updateValues();
}

function updateValues() {
    const x = (point.x - centerX) / radius;
    const y = (centerY - point.y) / radius;

    const sinValue = y.toFixed(2);
    const cosValue = x.toFixed(2);
    const tanValue = (y / x).toFixed(2);
    const secValue = (1 / x).toFixed(2);
    const cscValue = (1 / y === Infinity ? "Infinity" : (1 / y).toFixed(2));
    const cotValue = (x / y === Infinity ? "Infinity" : (x / y).toFixed(2));

    document.getElementById('sinValue').textContent = sinValue;
    document.getElementById('cosValue').textContent = cosValue;
    document.getElementById('tanValue').textContent = tanValue;
    document.getElementById('secValue').textContent = secValue;
    document.getElementById('cscValue').textContent = cscValue;
    document.getElementById('cotValue').textContent = cotValue;
}

function isInsideCircle(x, y) {
    const dx = x - point.x;
    const dy = y - point.y;
    return dx * dx + dy * dy <= point.radius * point.radius;
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isInsideCircle(x, y)) {
        dragging = true;
    }
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isInsideCircle(x, y)) {
        dragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Lock point onto the circle
        point.x = centerX + (dx / distance) * radius;
        point.y = centerY + (dy / distance) * radius;

        drawCircle();
    }
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

drawCircle();
// coded by guzzo86
