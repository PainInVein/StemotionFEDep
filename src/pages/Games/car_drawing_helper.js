// Cute Car Drawing Helper for Math Racing Game
// Add this to MathRacingGame.jsx

// Helper to draw cute rounded car
const drawCuteCar = (ctx, x, y, car, position) => {
    const width = 70;
    const height = 35;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + 35, y + height + 5, 32, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Car body avec rounded corners
    ctx.fillStyle = car.color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill();
    ctx.strokeStyle = darkenColor(car.color, 0.2);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Roof/cabin
    ctx.fillStyle = car.isPlayer ? '#3b82f6' : darkenColor(car.color, 0.25);
    ctx.beginPath();
    ctx.roundRect(x + 18, y + 4, 36, 18, 6);
    ctx.fill();

    // Windows
    ctx.fillStyle = 'rgba(135,206,250,0.7)';
    ctx.fillRect(x + 22, y + 8, 12, 10);
    ctx.fillRect(x + 38, y + 8, 12, 10);

    // Wheels
    [x + 15, x + 55].forEach(wx => {
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(wx, y + height, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#aaa';
        ctx.beginPath();
        ctx.arc(wx, y + height, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Headlights
    ctx.fillStyle = car.boosting ? '#ffeb3b' : '#fff';
    ctx.beginPath();
    ctx.arc(x + width, y + 12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width, y + 22, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Position badge
    const colors = ['#fbbf24', '#c0c0c0', '#f97316', '#64748b'];
    ctx.fillStyle = colors[position - 1] || '#888';
    ctx.beginPath();
    ctx.arc(x + 35, y + height / 2, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(position, x + 35, y + height / 2);

    // Name tag
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(x - 2, y - 18, car.name.length * 7 + 8, 14);
    ctx.fillStyle = car.isPlayer ? '#60a5fa' : '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(car.name, x + 2, y - 11);
};

// Helper to darken color
const darkenColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    const toHex = v => Math.round(v).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
