const canvas = document.getElementById('unitCircle');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;
const gridSpacing = 60;
let dragging = false;
let angleDegrees = 0; // Initialize angle in degrees

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

    // Draw horizontal grid lines and label x-axis
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

    // Draw vertical grid lines and label y-axis
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

    // Update values
    updateValues();
}

function updateValues() {
    const x = (point.x - centerX) / radius;
    const y = (centerY - point.y) / radius;

    const sinValue = Math.sin(angleDegrees * Math.PI / 180);
    const cosValue = Math.cos(angleDegrees * Math.PI / 180);
    const tanValue = Math.tan(angleDegrees * Math.PI / 180);
    const secValue = 1 / cosValue;
    const cscValue = (1 / sinValue === Infinity) ? "Infinity" : (1 / sinValue);
    const cotValue = (cosValue / sinValue === Infinity) ? "Infinity" : (cosValue / sinValue);

    document.getElementById('sinValue').textContent = sinValue.toFixed(3); // Rounded to two decimal places
    document.getElementById('cosValue').textContent = cosValue.toFixed(3); // Rounded to two decimal places
    document.getElementById('tanValue').textContent = tanValue.toFixed(3); // Rounded to two decimal places
    document.getElementById('secValue').textContent = secValue.toFixed(3); // Rounded to two decimal places
    document.getElementById('cscValue').textContent = cscValue.toFixed(3); // Rounded to two decimal places
    document.getElementById('cotValue').textContent = cotValue.toFixed(3); // Rounded to two decimal places

    // Update angle value in degrees (angle increases counter-clockwise)
    document.getElementById('angleValue').textContent = angleDegrees.toFixed(2) + '°'; // Rounded to two decimal places
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

canvas.addEventListener('mousemove', (e) => {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - centerX;
        const dy = y - centerY;

        // Calculate angle in degrees (range: 0 to 359.99º, angle increases counter-clockwise)
        angleRadians = Math.atan2(dy, dx);
        angleDegrees = (360 - (angleRadians * 180 / Math.PI)) % 360;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Lock point onto the circle
        point.x = centerX + (dx / distance) * radius;
        point.y = centerY + (dy / distance) * radius;

        drawCircle();

        // Update angle value in degrees with 3 decimal places
        document.getElementById('angleValue').textContent = angleDegrees.toFixed(3) + '°'; // Rounded to three decimal places
    }
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

drawCircle();
// Coded by guzzo86
