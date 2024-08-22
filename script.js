const canvas = document.getElementById('unitCircle');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
const gridSpacing = 50;

let angleDegrees = 0;
let point = { x: centerX, y: centerY, radius: 5 };

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
            const label = Math.abs((x - centerX) / gridSpacing);
            ctx.fillText(label.toFixed(1), x, centerY + 15); // Label x-axis
        }
    }    

    // Draw vertical grid lines and label y-axis
    for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        if (y !== centerY) {
            const label = Math.abs((centerY - y) / gridSpacing);
            ctx.fillText(label.toFixed(1), centerX + 5, y + 5); // Label y-axis
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
    const angleInput = parseFloat(document.getElementById('angleInput').value);
    const sinInput = parseFloat(document.getElementById('sinInput').value);
    const cosInput = parseFloat(document.getElementById('cosInput').value);
    const tanInput = parseFloat(document.getElementById('tanInput').value);
    const secInput = parseFloat(document.getElementById('secInput').value);
    const cscInput = parseFloat(document.getElementById('cscInput').value);
    const cotInput = parseFloat(document.getElementById('cotInput').value);

    angleDegrees = angleInput;

    const rad = angleDegrees * Math.PI / 180;
    const sinValue = Math.sin(rad);
    const cosValue = Math.cos(rad);
    const tanValue = Math.tan(rad);
    const secValue = 1 / cosValue;
    const cscValue = (sinValue === 0) ? "Infinity" : (1 / sinValue);
    const cotValue = (sinValue === 0) ? "Infinity" : (cosValue / sinValue);

    document.getElementById('sinInput').value = sinValue.toFixed(3);
    document.getElementById('cosInput').value = cosValue.toFixed(3);
    document.getElementById('tanInput').value = tanValue.toFixed(3);
    document.getElementById('secInput').value = secValue.toFixed(3);
    document.getElementById('cscInput').value = cscValue;
    document.getElementById('cotInput').value = cotValue;

    point.x = centerX + radius * cosValue;
    point.y = centerY - radius * sinValue;

    drawCircle();
}

document.getElementById('angleInput').addEventListener('input', (e) => {
    const angle = parseFloat(e.target.value);
    angleDegrees = angle;
    const rad = angle * Math.PI / 180;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

document.getElementById('sinInput').addEventListener('input', (e) => {
    const sinValue = parseFloat(e.target.value);
    const rad = Math.asin(sinValue);
    angleDegrees = rad * 180 / Math.PI;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

document.getElementById('cosInput').addEventListener('input', (e) => {
    const cosValue = parseFloat(e.target.value);
    const rad = Math.acos(cosValue);
    angleDegrees = rad * 180 / Math.PI;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

document.getElementById('tanInput').addEventListener('input', (e) => {
    const tanValue = parseFloat(e.target.value);
    const rad = Math.atan(tanValue);
    angleDegrees = rad * 180 / Math.PI;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

document.getElementById('secInput').addEventListener('input', (e) => {
    const secValue = parseFloat(e.target.value);
    const cosValue = 1 / secValue;
    const rad = Math.acos(cosValue);
    angleDegrees = rad * 180 / Math.PI;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

document.getElementById('cscInput').addEventListener('input', (e) => {
    const cscValue = parseFloat(e.target.value);
    const sinValue = 1 / cscValue;
    const rad = Math.asin(sinValue);
    angleDegrees = rad * 180 / Math.PI;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

document.getElementById('cotInput').addEventListener('input', (e) => {
    const cotValue = parseFloat(e.target.value);
    const rad = Math.atan(1 / cotValue);
    angleDegrees = rad * 180 / Math.PI;
    point.x = centerX + radius * Math.cos(rad);
    point.y = centerY - radius * Math.sin(rad);
    drawCircle();
});

drawCircle();
