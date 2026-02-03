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
const shapes = [];
const shapeInfo = document.getElementById('shapeInfo');
const generalInfo = document.getElementById('generalInfo');
let currentShape = null;
let circleRadius = 30;
let squareSide = 50;
let triangleBase = 50;
let triangleHeight = 50;
let numberOfTriangles = 0;
let numberOfSquares = 0;
let numberOfCircles = 0;
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
    numberOfCircles = 0;
    numberOfSquares = 0;
    numberOfTriangles = 0;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    updateShapeInfoUI();
    updateGeneralInfo();
});
function switchActiveButton(selectedBtn) {
    const buttons = document.querySelectorAll('.nav-bar button');
    buttons.forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
}
function createNumberInput(labelText, value, onChange) {
    const wrapper = document.createElement('div');
    const color = document.createElement('label');
    color.textContent = "Color : ";
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    const label = document.createElement('label');
    label.textContent = labelText + ': ';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = String(value);
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
        const v = Number(input.value) || 0;
        if (onChange)
            onChange(v);
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
        shapeInfo.appendChild(createNumberInput('Radius', circleRadius, v => circleRadius = v));
    }
    else if (currentShape === 'square') {
        shapeInfo.appendChild(createNumberInput('Side', squareSide, v => squareSide = v));
    }
    else if (currentShape === 'triangle') {
        shapeInfo.appendChild(createNumberInput('Base', triangleBase, v => triangleBase = v));
        shapeInfo.appendChild(createNumberInput('Height', triangleHeight, v => triangleHeight = v));
    }
}
function createStatLine(label, value) {
    const line = document.createElement('div');
    line.className = 'stat-line';
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label + ': ';
    const valueSpan = document.createElement('span');
    valueSpan.textContent = String(value);
    line.appendChild(labelSpan);
    line.appendChild(valueSpan);
    return line;
}
function createStatGroup(titleText) {
    const group = document.createElement('div');
    group.className = 'stat-group';
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = titleText;
    p.appendChild(strong);
    const content = document.createElement('div');
    group.appendChild(p);
    group.appendChild(content);
    return { group, content };
}
function updateGeneralInfo() {
    if (!generalInfo || !canvas)
        return;
    generalInfo.innerHTML = '';
    const canvasArea = canvas.width * canvas.height;
    const totalShapesArea = shapes.reduce((sum, shape) => sum + shape.area(), 0);
    const percentage = Math.min((totalShapesArea / canvasArea) * 100, 100).toFixed(2);
    const inventory = createStatGroup('INVENTORY');
    inventory.content.appendChild(createStatLine('Circles', numberOfCircles));
    inventory.content.appendChild(createStatLine('Squares', numberOfSquares));
    inventory.content.appendChild(createStatLine('Triangles', numberOfTriangles));
    inventory.content.appendChild(createStatLine('Total Shapes', shapes.length));
    generalInfo.appendChild(inventory.group);
    const space = createStatGroup('SPACE USAGE');
    space.content.appendChild(createStatLine('Canvas', `${canvasArea.toLocaleString()} px²`));
    space.content.appendChild(createStatLine('Shapes', `${Math.round(totalShapesArea).toLocaleString()} px²`));
    const occLine = createStatLine('OCCUPIED', `${percentage}%`);
    occLine.style.marginTop = '10px';
    occLine.style.fontWeight = '900';
    space.content.appendChild(occLine);
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${percentage}%`;
    progressContainer.appendChild(progressBar);
    space.content.appendChild(progressContainer);
    generalInfo.appendChild(space.group);
    const debug = createStatGroup('MACRO');
    debug.content.appendChild(createStatLine('Viewport', `${window.innerWidth}x${window.innerHeight}`));
    debug.content.appendChild(createStatLine('DPI', window.devicePixelRatio));
    generalInfo.appendChild(debug.group);
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
    console.log(numberOfCircles, numberOfSquares, numberOfTriangles);
    console.log(shapes);
    console.log(currentShape);
    if (currentShape === 'triangle') {
        const topY = point.y - (triangleHeight / 3);
        const topPoint = new Point(point.x, topY);
        const myTriangle = new Triangle(triangleBase, triangleHeight, '#FF9B51', topPoint);
        myTriangle.draw(ctx);
        numberOfTriangles += 1;
        shapes.push(myTriangle);
        updateGeneralInfo();
    }
    else if (currentShape === 'square') {
        const topLeft = new Point(point.x - (squareSide / 2), point.y - (squareSide / 2));
        const mySquare = new Square(squareSide, '#FF9B51', topLeft);
        mySquare.draw(ctx);
        numberOfSquares += 1;
        shapes.push(mySquare);
        updateGeneralInfo();
    }
    else if (currentShape === 'circle') {
        const myCircle = new Circle(circleRadius, '#FF9B51', point);
        myCircle.draw(ctx);
        numberOfCircles += 1;
        shapes.push(myCircle);
        updateGeneralInfo();
    }
});
updateShapeInfoUI();
updateGeneralInfo();
window.addEventListener('resize', updateGeneralInfo);
