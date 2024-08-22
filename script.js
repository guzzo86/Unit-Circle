const canvas = document.getElementById('unitCircle');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;
const gridSpacing = 60;
let dragging = false;
let angleDegrees = 0;

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

    for (let x = -5; x <= 5; x += 0.2) {
        const gridX = centerX + x * gridSpacing;
        ctx.beginPath();
        ctx.moveTo(gridX, 0);
        ctx.lineTo(gridX, canvas.height);
        ctx.stroke();
        if (x !== 0) {
            ctx.fillText(x.toFixed(1), gridX, centerY + 15);
        }
    }

    for (let y = -5; y <= 5; y += 0.2) {
        const gridY = centerY - y * gridSpacing;
        ctx.beginPath();
        ctx.moveTo(0, gridY);
        ctx.lineTo(canvas.width, gridY);
        ctx.stroke();
        if (y !== 0) {
            ctx.fillText(y.toFixed(1), centerX + 5, gridY + 5);
        }
    }

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

    ctx.fillText('0', centerX + 5, centerY + 15);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

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
    angleDegrees = (360 - (angleRadians * 180 / Math.PI)) % 360;

    const sinValue = Math.sin(angleDegrees * Math.PI / 180);
    const cosValue = Math.cos(angleDegrees * Math.PI / 180);
    const tanValue = Math.tan(angleDegrees * Math.PI / 180);
    const secValue = 1 / cosValue;
    const cscValue = (1 / sinValue === Infinity) ? "Infinity" : (1 / sinValue);
    const cotValue = (cosValue / sinValue === Infinity) ? "Infinity" : (cosValue / sinValue);

    document.getElementById('angleInput').value = angleDegrees.toFixed(0);
    document.getElementById('sinInput').value = sinValue.toFixed(3);
    document.getElementById('cosInput').value = cosValue.toFixed(3);
    document.getElementById('tanInput').value = tanValue.toFixed(3);
    document.getElementById('secInput').value = secValue.toFixed(3);
    document.getElementById('cscInput').value = cscValue;
    document.getElementById('cotInput').value = cotValue;
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

        point.x = centerX + (dx / distance) * radius;
        point.y = centerY + (dy / distance) * radius;

        drawCircle();
    }
}

function handleMouseUp() {
    dragging = false;
}

function isInsideCircle(x, y) {
    const dx = x - point.x;
    const dy = y - point.y;
    return dx * dx + dy * dy <= point.radius * point.radius;
}

function updateFromInput() {
    let angleInput = parseFloat(document.getElementById('angleInput').value);
    let sinInput = parseFloat(document.getElementById('sinInput').value);
    let cosInput = parseFloat(document.getElementById('cosInput').value);
    let tanInput = parseFloat(document.getElementById('tanInput').value);
    let secInput = parseFloat(document.getElementById('secInput').value);
    let cscInput = parseFloat(document.getElementById('cscInput').value);
    let cotInput = parseFloat(document.getElementById('cotInput').value);

    // Validate and correct inputs
    if (isNaN(angleInput) || angleInput < 0 || angleInput > 360) {
        angleInput = 0;
    }
    if (isNaN(sinInput) || isNaN(cosInput) || isNaN(tanInput) || isNaN(secInput) || isNaN(cscInput) || isNaN(cotInput)) {
        resetInputs();
        return;
    }

    // Correct values
    if (secInput === 0) secInput = Infinity;
    if (cscInput === 0) cscInput = Infinity;
    if (cotInput === 0) cotInput = Infinity;

    // Update circle position
    const angleRadians = angleInput * Math.PI / 180;
    const x = cosInput * radius + centerX;
    const y = centerY - sinInput * radius;
    
    point.x = x;
    point.y = y;

    drawCircle();
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

document.querySelectorAll('.info input').forEach(input => {
    input.addEventListener('input', updateFromInput);
});

drawCircle();
