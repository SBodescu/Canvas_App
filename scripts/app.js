import Circle from './models/circle.js';
import Square from './models/square.js';
import Triangle from './models/triangle.js';
import Point from './models/point.js';
const triangleBtn = document.getElementById('drawTriangleBtn');
const squareBtn = document.getElementById('drawSquareBtn');
const circleBtn = document.getElementById('drawCircleBtn');
const clearBtn = document.getElementById('clearCanvas');
const canvas = document.getElementById('shapesCanvas');
const ctx = canvas.getContext('2d');
let currentShape = null;
const shapes = [];
const shapeInfo = document.getElementById('shapeInfo');
// size state per-shape (defaults)
let circleRadius = 30;
let squareSide = 50;
let triangleBase = 50;
let triangleHeight = 50;
function switchActiveButton(selectedBtn) {
    const buttons = document.querySelectorAll('.nav-bar button');
    buttons.forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
}
triangleBtn.addEventListener('click', () => {
    currentShape = 'triangle';
    switchActiveButton(triangleBtn);
    updateShapeInfoUI();
});
squareBtn.addEventListener('click', () => {
    currentShape = 'square';
    switchActiveButton(squareBtn);
    updateShapeInfoUI();
});
circleBtn.addEventListener('click', () => {
    currentShape = 'circle';
    switchActiveButton(circleBtn);
    updateShapeInfoUI();
});
clearBtn.addEventListener('click', () => {
    shapes.length = 0;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    updateShapeInfoUI();
});
function createNumberInput(labelText, value, min = 1, step = 1, onChange) {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText + ': ';
    const input = document.createElement('input');
    input.type = 'number';
    input.value = String(value);
    input.min = String(min);
    input.step = String(step);
    input.addEventListener('input', () => {
        const v = Number(input.value) || min;
        if (onChange)
            onChange(v);
        updateShapeInfoUI();
    });
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}
function updateShapeInfoUI() {
    if (!shapeInfo)
        return;
    shapeInfo.innerHTML = '';
    const title = document.createElement('p');
    title.textContent = currentShape ? `Selected: ${currentShape}` : 'No shape selected.';
    shapeInfo.appendChild(title);
    if (!currentShape)
        return;
    if (currentShape === 'circle') {
        shapeInfo.appendChild(createNumberInput('Radius', circleRadius, 1, 1, v => circleRadius = v));
    }
    else if (currentShape === 'square') {
        shapeInfo.appendChild(createNumberInput('Side', squareSide, 1, 1, v => squareSide = v));
    }
    else if (currentShape === 'triangle') {
        shapeInfo.appendChild(createNumberInput('Base', triangleBase, 1, 1, v => triangleBase = v));
        shapeInfo.appendChild(createNumberInput('Height', triangleHeight, 1, 1, v => triangleHeight = v));
    }
}
function onClickCoords(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return new Point(x, y);
}
canvas.addEventListener('click', (event) => {
    if (!ctx)
        return;
    const point = onClickCoords(canvas, event);
    console.log(shapes);
    console.log(currentShape);
    if (currentShape === 'triangle') {
        // center the triangle on the click: compute top vertex so centroid is at click
        const topY = point.y - (triangleHeight / 3);
        const topPoint = new Point(point.x, topY);
        const myTriangle = new Triangle(triangleBase, triangleHeight, '#FF9B51', topPoint);
        myTriangle.draw(ctx);
        shapes.push(myTriangle);
    }
    else if (currentShape === 'square') {
        // pass top-left so the square is centered at click
        const topLeft = new Point(point.x - (squareSide / 2), point.y - (squareSide / 2));
        const mySquare = new Square(squareSide, '#FF9B51', topLeft);
        mySquare.draw(ctx);
        shapes.push(mySquare);
    }
    else if (currentShape === 'circle') {
        const myCircle = new Circle(circleRadius, '#FF9B51', point);
        myCircle.draw(ctx);
        shapes.push(myCircle);
    }
});
// initialize UI
updateShapeInfoUI();
//# sourceMappingURL=app.js.map