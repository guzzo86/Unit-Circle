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
    ctx.strokeStyle = '#444'; // Grid line color
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff'; // Text color for labels

    // Draw horizontal grid lines and labels
    for (let x = 0; x <= canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        if (x !== centerX) {
            const label = (x < centerX) ? (centerX - x) / gridSpacing * -1 : (x - centerX) / gridSpacing;
            const offset = label % 1 === 0 ? 0 : 3; // Move labels by 3 pixels if they are not whole numbers
            ctx.fillText(label.toFixed(1), x - (label > 0 ? offset : -offset), centerY + 15); // Label x-axis
        }
    }

    // Draw vertical grid lines and labels
    for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        if (y !== centerY) {
            const label = (centerY - y) / gridSpacing;
            const offset = label % 1 === 0 ? 0 : 3; // Move labels by 3 pixels if they are not whole numbers
            ctx.fillText(label.toFixed(1), centerX + 5, y + (label > 0 ? offset : -offset)); // Label y-axis
        }
    }

    // Draw coordinate axes
    ctx.strokeStyle = '#f00'; // Red for x-axis
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.strokeStyle = '#f00'; // Red for y-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Label the origin
    ctx.fillText('0', centerX + 5, centerY + 15);

    // Draw unit circle
    ctx.strokeStyle = '#fff'; // White circle color
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw point
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; // White point color
    ctx.fill();

    // Draw perpendicular lines to x and y axes
    ctx.strokeStyle = '#f00'; // Red for vertical line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, centerY);
    ctx.stroke();
    ctx.strokeStyle = '#00F'; // Blue for horizontal line
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

    document.getElementById('sinValue').value = sinValue.toFixed(3); // Rounded to three decimal places
    document.getElementById('cosValue').value = cosValue.toFixed(3); // Rounded to three decimal places
    document.getElementById('tanValue').value = tanValue.toFixed(3); // Rounded to three decimal places
    document.getElementById('secValue').value = secValue.toFixed(3); // Rounded to three decimal places
    document.getElementById('cscValue').value = cscValue.toFixed(3); // Rounded to three decimal places
    document.getElementById('cotValue').value = cotValue.toFixed(3); // Rounded to three decimal places

    // Update angle value in degrees
    document.getElementById('angleInput').value = angleDegrees.toFixed(3) + '°'; // Rounded to three decimal places
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

        // Calculate angle in degrees (range: 0 to 359.999º, angle increases counter-clockwise)
        const angleRadians = Math.atan2(dy, dx);
        angleDegrees = (360 - (angleRadians * 180 / Math.PI)) % 360;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Lock point onto the circle
        point.x = centerX + (dx / distance) * radius;
        point.y = centerY + (dy / distance) * radius;

        drawCircle();

        // Update angle value in degrees
        document.getElementById('angleInput').value = angleDegrees.toFixed(3) + '°'; // Rounded to three decimal places
    }
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

// Handle input validation and updates
function validateInput(value, max, min) {
    if (isNaN(value) || value === '' || value < min || value > max) {
        return 0;
    }
    return Math.max(min, Math.min(value, max));
}

document.getElementById('angleInput').addEventListener('change', function () {
    let angle = parseFloat(this.value);
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

document.getElementById('sinValue').addEventListener('change', function () {
    let sin = parseFloat(this.value);
    let angle = Math.asin(sin) * 180 / Math.PI;
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

document.getElementById('cosValue').addEventListener('change', function () {
    let cos = parseFloat(this.value);
    let angle = Math.acos(cos) * 180 / Math.PI;
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

document.getElementBy('tanValue').addEventListener('change', function () {
    let tan = parseFloat(this.value);
    let angle = Math.atan(tan) * 180 / Math.PI;
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

document.getElementById('secValue').addEventListener('change', function () {
    let sec = parseFloat(this.value);
    let angle = Math.acos(1 / sec) * 180 / Math.PI;
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

document.getElementById('cscValue').addEventListener('change', function () {
    let csc = parseFloat(this.value);
    let angle = Math.asin(1 / csc) * 180 / Math.PI;
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

document.getElementById('cotValue').addEventListener('change', function () {
    let cot = parseFloat(this.value);
    let angle = Math.atan(1 / cot) * 180 / Math.PI;
    angle = validateInput(angle, 360, 0);
    angleDegrees = angle;
    updateValues();
    drawCircle();
});

drawCircle();
