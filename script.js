const canvas = document.getElementById('unitCircle');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = (canvas.width / 2) - 30; // Adjusted to fit canvas size
const gridInterval = 0.2; // Grid intervals: 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.5
let dragging = false;

const point = {
    x: centerX + radius,
    y: centerY
};

function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';

    // Draw horizontal and vertical grid lines
    for (let i = -8; i <= 8; i++) {
        const value = i * gridInterval; // Grid intervals
        const gridX = centerX + value * radius;
        const gridY = centerY - value * radius;

        if (i !== 0) {
            // Vertical grid lines
            ctx.beginPath();
            ctx.moveTo(gridX, 0);
            ctx.lineTo(gridX, canvas.height);
            ctx.stroke();
            ctx.fillText(value.toFixed(1), gridX + 5, centerY + 15);

            // Horizontal grid lines
            ctx.beginPath();
            ctx.moveTo(0, gridY);
            ctx.lineTo(canvas.width, gridY);
            ctx.stroke();
            ctx.fillText(value.toFixed(1), centerX + 5, gridY - 5);
        }
    }

    // Draw axes
    ctx.strokeStyle = '#f00'; // X-axis color: red
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = '#888'; // Y-axis color: grey
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw unit circle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw lines connecting dot to axes
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point.x, centerY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    // Draw point
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    updateValues();
}

function updateValues() {
    const x = (point.x - centerX) / radius;
    const y = (centerY - point.y) / radius;

    const angleRadians = Math.atan2(y, x);
    let angleDegrees = (angleRadians * 180 / Math.PI);
    angleDegrees = (angleDegrees + 360) % 360; // Normalize to 0-360 degrees

    const sinValue = Math.sin(angleRadians);
    const cosValue = Math.cos(angleRadians);
    const tanValue = Math.tan(angleRadians);
    const secValue = (cosValue !== 0) ? (1 / cosValue) : Infinity;
    const cscValue = (sinValue !== 0) ? (1 / sinValue) : Infinity;
    const cotValue = (sinValue !== 0) ? (cosValue / sinValue) : Infinity;

    document.getElementById('angleInput').value = angleDegrees.toFixed(3);
    document.getElementById('sinInput').value = sinValue.toFixed(3);
    document.getElementById('cosInput').value = cosValue.toFixed(3);
    document.getElementById('tanInput').value = tanValue.toFixed(3);
    document.getElementById('secInput').value = secValue === Infinity ? "∞" : secValue.toFixed(3);
    document.getElementById('cscInput').value = cscValue === Infinity ? "∞" : cscValue.toFixed(3);
    document.getElementById('cotInput').value = cotValue === Infinity ? "∞" : cotValue.toFixed(3);
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isInsideCircle(x, y)) {
        dragging = true;
    }
}

function handleMouseMove(e) {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - centerX;
        const dy = y - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Constrain the movement to the circle's radius
        const constrainedDistance = Math.min(distance, radius);

        point.x = centerX + (dx / distance) * constrainedDistance;
        point.y = centerY + (dy / distance) * constrainedDistance;

        drawCircle();
    }
}

function handleMouseUp() {
    dragging = false;
}

function isInsideCircle(x, y) {
    const dx = x - centerX;
    const dy = y - centerY;
    return dx * dx + dy * dy <= radius * radius;
}

function validateInput(inputId, max = 360, min = 0) {
    const input = document.getElementById(inputId);
    let value = parseFloat(input.value);

    if (isNaN(value)) {
        value = 0;
    } else if (value > max) {
        value = max;
    } else if (value < min) {
        value = min;
    }

    input.value = value.toFixed(3);

    return value;
}

function updateAllValues() {
    const angleInput = document.getElementById('angleInput');
    const angle = validateInput('angleInput');

    const angleRadians = angle * Math.PI / 180;
    const sinValue = Math.sin(angleRadians);
    const cosValue = Math.cos(angleRadians);
    const tanValue = Math.tan(angleRadians);
    const secValue = (cosValue !== 0) ? (1 / cosValue) : Infinity;
    const cscValue = (sinValue !== 0) ? (1 / sinValue) : Infinity;
    const cotValue = (sinValue !== 0) ? (cosValue / sinValue) : Infinity;

    document.getElementById('sinInput').value = sinValue.toFixed(3);
    document.getElementById('cosInput').value = cosValue.toFixed(3);
    document.getElementById('tanInput').value = tanValue.toFixed(3);
    document.getElementById('secInput').value = secValue === Infinity ? "∞" : secValue.toFixed(3);
    document.getElementById('cscInput').value = cscValue === Infinity ? "∞" : cscValue.toFixed(3);
    document.getElementById('cotInput').value = cotValue === Infinity ? "∞" : cotValue.toFixed(3);

    const x = (point.x - centerX) / radius;
    const y = (centerY - point.y) / radius;
    const distance = Math.sqrt(x * x + y * y);
    point.x = centerX + (x / distance) * radius;
    point.y = centerY + (y / distance) * radius;

    drawCircle();
}

document.getElementById('angleInput').addEventListener('change', updateAllValues);
document.getElementById('sinInput').addEventListener('change', updateAllValues);
document.getElementById('cosInput').addEventListener('change', updateAllValues);
document.getElementById('tanInput').addEventListener('change', updateAllValues);
document.getElementById('secInput').addEventListener('change', updateAllValues);
document.getElementById('cscInput').addEventListener('change', updateAllValues);
document.getElementById('cotInput').addEventListener('change', updateAllValues);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

drawCircle();
