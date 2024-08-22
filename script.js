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
            ctx.fillText(label === Math.floor(label) ? label.toFixed(1) : label.toFixed(1), x, centerY + 15); // Label x-axis
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
            ctx.fillText(label === Math.floor(label) ? label.toFixed(1) : label.toFixed(1), centerX + 5, y + 5); // Label y-axis
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
    const angleRadians = angleDegrees * Math.PI / 180;
    const x = (point.x - centerX) / radius;
    const y = (centerY - point.y) / radius;

    const sinValue = Math.sin(angleRadians);
    const cosValue = Math.cos(angleRadians);
    const tanValue = Math.tan(angleRadians);
    const secValue = 1 / cosValue;
    const cscValue = (1 / sinValue === Infinity) ? "Infinity" : (1 / sinValue);
    const cotValue = (cosValue / sinValue === Infinity) ? "Infinity" : (cosValue / sinValue);

    document.getElementById('sinInput').value = sinValue.toFixed(3); 
    document.getElementById('cosInput').value = cosValue.toFixed(3); 
    document.getElementById('tanInput').value = tanValue.toFixed(3); 
    document.getElementById('secInput').value = secValue.toFixed(3); 
    document.getElementById('cscInput').value = cscValue.toFixed(3); 
    document.getElementById('cotInput').value = cotValue.toFixed(3); 

    document.getElementById('angleInput').value = angleDegrees.toFixed(2) + '°'; 
}

function updateFromInput() {
    const angleInput = parseFloat(document.getElementById('angleInput').value);
    const sinInput = parseFloat(document.getElementById('sinInput').value);
    const cosInput = parseFloat(document.getElementById('cosInput').value);
    const tanInput = parseFloat(document.getElementById('tanInput').value);
    const secInput = parseFloat(document.getElementById('secInput').value);
    const cscInput = parseFloat(document.getElementById('cscInput').value);
    const cotInput = parseFloat(document.getElementById('cotInput').value);

    let valid = true;

    if (!isNaN(angleInput) && angleInput >= 0 && angleInput <= 360) {
        angleDegrees = angleInput;
    } else {
        angleDegrees = 0;
    }

    const angleRadians = angleDegrees * Math.PI / 180;

    const sinValue = parseFloat(sinInput);
    const cosValue = parseFloat(cosInput);
    const tanValue = parseFloat(tanInput);
    const secValue = parseFloat(secInput);
    const cscValue = parseFloat(cscInput);
    const cotValue = parseFloat(cotInput);

    if (isNaN(sinValue) || isNaN(cosValue) || isNaN(tanValue) || isNaN(secValue) || isNaN(cscValue) || isNaN(cotValue)) {
        valid = false;
    }

    if (valid) {
        point.x = centerX + radius * cosValue;
        point.y = centerY - radius * sinValue;

        if (cosValue !== 0) {
            document.getElementById('secInput').value = (1 / cosValue).toFixed(3);
        } else {
            document.getElementById('secInput').value = "Infinity";
        }

        if (sinValue !== 0) {
            document.getElementById('cscInput').value = (1 / sinValue).toFixed(3);
        } else {
            document.getElementById('cscInput').value = "Infinity";
        }

        if (sinValue !== 0) {
            document.getElementById('cotInput').value = (cosValue / sinValue).toFixed(3);
        } else {
            document.getElementById('cotInput').value = "Infinity";
        }

        if (cosValue !== 0) {
            document.getElementById('tanInput').value = (sinValue / cosValue).toFixed(3);
        }

        drawCircle();
    } else {
        document.getElementById('angleInput').value = "0";
        document.getElementById('sinInput').value = "0";
        document.getElementById('cosInput').value = "1";
        document.getElementById('tanInput').value = "0";
        document.getElementById('secInput').value = "1";
        document.getElementById('cscInput').value = "Infinity";
        document.getElementById('cotInput').value = "Infinity";
        drawCircle();
    }
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
