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
    for (let i = -7; i <= 7; i++) {
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

    // Draw unit circle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw radius line and point
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Draw horizontal and vertical lines from point
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, centerY);
    ctx.stroke();
    ctx.strokeStyle = '#00F';
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(centerX, point.y);
    ctx.stroke();

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
    document.getElementById('secInput').value = secValue === Infinity ? "Infinity" : secValue.toFixed(3);
    document.getElementById('cscInput').value = cscValue === Infinity ? "Infinity" : cscValue.toFixed(3);
    document.getElementById('cotInput').value = cotValue === Infinity ? "Infinity" : cotValue.toFixed(3);
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

function updateFromInput() {
    let angleInput = parseFloat(document.getElementById('angleInput').value);
    let sinInput = parseFloat(document.getElementById('sinInput').value);
    let cosInput = parseFloat(document.getElementById('cosInput').value);
    let tanInput = parseFloat(document.getElementById('tanInput').value);
    let secInput = parseFloat(document.getElementById('secInput').value);
    let cscInput = parseFloat(document.getElementById('cscInput').value);
    let cotInput = parseFloat(document.getElementById('cotInput').value);

    // Validate angle input
    if (isNaN(angleInput) || angleInput < 0 || angleInput > 360) {
        angleInput = 0;
    }

    // Validate and correct other values
    if (isNaN(sinInput)) sinInput = 0;
    if (isNaN(cosInput)) cosInput = 1;
    if (isNaN(tanInput)) tanInput = 0;
    if (isNaN(secInput) || secInput === 0) secInput = Infinity;
    if (isNaN(cscInput) || cscInput === 0) cscInput = Infinity;
    if (isNaN(cotInput)) cotInput = Infinity;

    // Update circle position based on angle input
    if (angleInput !== 0) {
        const angleRadians = angleInput * Math.PI / 180;
        const x = radius * Math.cos(angleRadians) + centerX;
        const y = centerY - radius * Math.sin(angleRadians);

        point.x = x;
        point.y = y;

        drawCircle();
    } else {
        resetInputs();
    }
}

function resetInputs() {
    document.getElementById('angleInput').value = 0;
    document.getElementById('sinInput').value = 0;
    document.getElementById('cosInput').value = 1;
    document.getElementById('tanInput').value = 0;
    document.getElementById('secInput').value = 1;
    document.getElementById('cscInput').value = "Infinity";
    document.getElementById('cotInput').value = "Infinity";
}

function handleBlur(event) {
    updateFromInput();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        updateFromInput();
    }
}

document.querySelectorAll('.info input').forEach(input => {
    input.addEventListener('blur', handleBlur);
    input.addEventListener('keypress', handleKeyPress);
});

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

drawCircle();
