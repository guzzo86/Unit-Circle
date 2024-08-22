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
    y: centerY,
    radius: 7
};

function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';

    for (let x = 0; x <= canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        if (x !== centerX) {
            const label = (x < centerX) ? (centerX - x) / gridSpacing * -1 : (x - centerX) / gridSpacing;
            ctx.fillText(label.toFixed(1), x, centerY + 15);
        }
    }

    for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        if (y !== centerY) {
            const label = (centerY - y) / gridSpacing;
            ctx.fillText(label.toFixed(1), centerX + 5, y + 5);
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
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
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

    angleDegrees = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

    const sinValue = Math.sin(angleDegrees * Math.PI / 180);
    const cosValue = Math.cos(angleDegrees * Math.PI / 180);
    const tanValue = Math.tan(angleDegrees * Math.PI / 180);
    const secValue = 1 / cosValue;
    const cscValue = (1 / sinValue === Infinity) ? "Infinity" : (1 / sinValue);
    const cotValue = (cosValue / sinValue === Infinity) ? "Infinity" : (cosValue / sinValue);

    document.getElementById('sinInput').value = sinValue.toFixed(3);
    document.getElementById('cosInput').value = cosValue.toFixed(3);
    document.getElementById('tanInput').value = tanValue.toFixed(3);
    document.getElementById('secInput').value = secValue.toFixed(3);
    document.getElementById('cscInput').value = cscValue.toFixed(3);
    document.getElementById('cotInput').value = cotValue.toFixed(3);
    document.getElementById('angleInput').value = angleDegrees.toFixed(2);

    document.querySelector('.formulas').innerHTML = `
        <p>sin(θ): y</p>
        <p>cos(θ): x</p>
        <p>tan(θ): sin(θ) / cos(θ)</p>
        <p>sec(θ): 1 / cos(θ)</p>
        <p>csc(θ): 1 / sin(θ)</p>
        <p>cot(θ): cos(θ) / sin(θ)</p>
    `;
}

function updateFromInput() {
    const angle = parseFloat(document.getElementById('angleInput').value);
    const sinValue = parseFloat(document.getElementById('sinInput').value);
    const cosValue = parseFloat(document.getElementById('cosInput').value);
    const tanValue = parseFloat(document.getElementById('tanInput').value);
    const secValue = parseFloat(document.getElementById('secInput').value);
    const cscValue = parseFloat(document.getElementById('cscInput').value);
    const cotValue = parseFloat(document.getElementById('cotInput').value);

    if (!isNaN(angle)) {
        angleDegrees = Math.max(0, Math.min(360, angle));
        const angleRadians = angleDegrees * Math.PI / 180;

        document.getElementById('sinInput').value = (Math.sin(angleRadians)).toFixed(3);
        document.getElementById('cosInput').value = (Math.cos(angleRadians)).toFixed(3);
        document.getElementById('tanInput').value = (Math.tan(angleRadians)).toFixed(3);
        document.getElementById('secInput').value = (1 / Math.cos(angleRadians)).toFixed(3);
        document.getElementById('cscInput').value = (1 / Math.sin(angleRadians)).toFixed(3);
        document.getElementById('cotInput').value = (Math.cos(angleRadians) / Math.sin(angleRadians)).toFixed(3);
    }

    if (!isNaN(sinValue) && !isNaN(cosValue)) {
        document.getElementById('tanInput').value = (sinValue / cosValue).toFixed(3);
        document.getElementById('secInput').value = (1 / cosValue).toFixed(3);
        document.getElementById('cscInput').value = (1 / sinValue).toFixed(3);
        document.getElementById('cotInput').value = (cosValue / sinValue).toFixed(3);
    }

    const angleRadians = angleDegrees * Math.PI / 180;
    point.x = centerX + radius * Math.cos(angleRadians);
    point.y = centerY - radius * Math.sin(angleRadians);

    drawCircle();
}

function handleMouseDown(event) {
    dragging = true;
}

function handleMouseMove(event) {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        point.x = Math.max(centerX - radius, Math.min(centerX + radius, x));
        point.y = Math.max(centerY - radius, Math.min(centerY + radius, y));
        
        updateValues();
    }
}

function handleMouseUp() {
    dragging = false;
}

document.getElementById('angleInput').addEventListener('input', updateFromInput);
document.getElementById('sinInput').addEventListener('input', updateFromInput);
document.getElementById('cosInput').addEventListener('input', updateFromInput);
document.getElementById('tanInput').addEventListener('input', updateFromInput);
document.getElementById('secInput').addEventListener('input', updateFromInput);
document.getElementById('cscInput').addEventListener('input', updateFromInput);
document.getElementById('cotInput').addEventListener('input', updateFromInput);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

drawCircle();

