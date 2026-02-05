import Circle from './models/circle.js'
import Square from './models/square.js'
import Triangle from './models/triangle.js';    
import Point from './models/point.js';
import Shape from './models/shape.js';

const triangleBtn = document.getElementById('drawTriangleBtn') as HTMLButtonElement;
const squareBtn = document.getElementById('drawSquareBtn') as HTMLButtonElement;
const circleBtn = document.getElementById('drawCircleBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearCanvas') as HTMLButtonElement;
const canvas = document.getElementById('shapesCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const shapes: Shape[] =[];

const shapeInfo = document.getElementById('shapeInfo') as HTMLDivElement;
const generalInfo = document.getElementById('generalInfo') as HTMLDivElement;

let currentShape: string | null = null;
let draggedShape: Shape | null = null;
let isDragged: boolean = false;
let wasDragging = false; 
let posOffset = {x: 0, y: 0};

let selectedColor = '#FF9B51'

let circleRadius = 30;
let squareSide = 50;
let triangleBase = 50;
let triangleHeight = 50;

let numberOfTriangles = 0 ;
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
    shapes.length = 0 ;
    numberOfCircles = 0;
    numberOfSquares = 0;
    numberOfTriangles = 0;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    updateShapeInfoUI();
    updateGeneralInfo();
})

function switchActiveButton(selectedBtn: HTMLButtonElement){
    const buttons = document.querySelectorAll('.nav-bar button');
    buttons.forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
}

function createNumberInput(labelText: string, value: number, onChange?: (v:number)=>void){
    const numberInput = document.createElement('div');
    const color = document.createElement('label');
    color.textContent = "Color : ";
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'shapeColor';
    colorInput.value = selectedColor
    colorInput.style.width = "100%"; 
    colorInput.style.height = "40px";
    colorInput.addEventListener('input', ()=>{
        selectedColor = colorInput.value;
    });
    const label = document.createElement('label');
    label.textContent = labelText + ': ';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = String(value);
    input.addEventListener('input', ()=>{
        input.value = input.value.replace(/[^0-9]/g, '');
        const v = Number(input.value) || 0;
        if (onChange) onChange(v);
        
    })
    numberInput.appendChild(color);
    numberInput.appendChild(colorInput);
    numberInput.appendChild(label);
    numberInput.appendChild(input);
    return numberInput;
}

function updateShapeInfoUI(){
    if(!shapeInfo) return;
    shapeInfo.innerHTML = '';
    const title = document.createElement('p');
    title.textContent = currentShape ? `Selected: ${currentShape}` : 'No shape selected.';
    shapeInfo.appendChild(title);

    if(!currentShape) return;

    if(currentShape === 'circle'){
        shapeInfo.appendChild(createNumberInput('Radius', circleRadius, v => circleRadius = v));
    } else if(currentShape === 'square'){
        shapeInfo.appendChild(createNumberInput('Side', squareSide, v => squareSide = v));
    } else if(currentShape === 'triangle'){
        shapeInfo.appendChild(createNumberInput('Base', triangleBase, v => triangleBase = v));
        shapeInfo.appendChild(createNumberInput('Height', triangleHeight, v => triangleHeight = v));
    }
}

function createStatLine(label: string, value: string | number): HTMLDivElement {
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

function createStatGroup(titleText: string): { group: HTMLDivElement, content: HTMLDivElement } {
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
    if (!generalInfo || !canvas) return;

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

function onClickCoords(canvas:HTMLCanvasElement, event: MouseEvent){
    const rect = canvas.getBoundingClientRect();
    const x= event.clientX - rect.left
    const y= event.clientY - rect.top;
    return new Point(x,y)
}

function checkCollisions(shape1: Shape, shape2: Shape): boolean {
    const r1 = shape1.getCollisionBox();
    const r2 = shape2.getCollisionBox();
    return (
        r1.x < r2.x + r2.w &&
        r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h &&
        r1.y + r1.h > r2.y
    );
}

function checkCollisionOnCanvas(shape: Shape): boolean{
    const box = shape.getCollisionBox();
    return(
        box.x < 0 || box.y < 0 ||
        box.x + box.w > canvas.width ||
        box.y + box.h > canvas.height
    )
}

function triggerError() {
    canvas.classList.add('canvas-error');
    setTimeout(() => canvas.classList.remove('canvas-error'), 400);
}

function redrawCanvas() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    shapes.forEach(shape => {
        shape.draw(ctx);
        //const bounds = shape.getCollisionBox();
        //ctx.save();
        //ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        //ctx.lineWidth = 1;
        //ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.restore();
    });
}

canvas.addEventListener('click', (event: MouseEvent) => {
    
    if (wasDragging) {
        wasDragging = false;
        return;
    }
    
    if(!ctx) return;
    const point = onClickCoords(canvas, event);

    let nextShape : Shape | null = null;
    if(currentShape === 'triangle') {
        nextShape = new Triangle(triangleBase, triangleHeight,selectedColor, point);
    } else if(currentShape === 'square') {
        const topLeft = new Point(point.x - (squareSide/2), point.y - (squareSide/2));
        nextShape = new Square(squareSide,selectedColor, topLeft);
    } else if(currentShape === 'circle') {
       nextShape = new Circle(circleRadius,selectedColor, point);
    }
    if(nextShape){
        const isOutOfCanvas = checkCollisionOnCanvas(nextShape);
        const isColliding = shapes.some(existingShape => checkCollisions(nextShape,existingShape));
        if(isColliding || isOutOfCanvas)
        {
            console.log("Collision triggered");
            triggerError();
            return
        }
        shapes.push(nextShape);
        if(currentShape === 'triangle'){
            numberOfTriangles++;
        }
        else if(currentShape === 'circle'){
            numberOfCircles++;
        }
        else if(currentShape === 'square'){
            numberOfSquares++;
        }
        redrawCanvas();
        updateGeneralInfo();
    }
});

let startDragPosition: Point | null = null; 

canvas.addEventListener('mousedown',(event: MouseEvent) => {
    const mousePos = onClickCoords(canvas,event);
    wasDragging = false;
    
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (shape?.isInside(mousePos)) {
            isDragged = true;
            draggedShape = shape;  
            posOffset.x = mousePos.x - draggedShape.point.x;
            posOffset.y = mousePos.y - draggedShape.point.y;
            
            startDragPosition = new Point(draggedShape.point.x, draggedShape.point.y);
            return;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragged || !draggedShape) return;

    wasDragging = true;

    const mousePos = onClickCoords(canvas, e);
    
    const newX = mousePos.x - posOffset.x;
    const newY = mousePos.y - posOffset.y;
    
    draggedShape.point.x = newX;
    draggedShape.point.y = newY;

    const isColliding = shapes.some(s => {
        if (!draggedShape) return false; 
        return s !== draggedShape && checkCollisions(draggedShape, s);
    });    
    const isOutOfCanvas = checkCollisionOnCanvas(draggedShape);

    if (isColliding || isOutOfCanvas) {
        if (startDragPosition) {
            draggedShape.point.x = startDragPosition.x;
            draggedShape.point.y = startDragPosition.y;
        }
        triggerError();
        isDragged = false;
        draggedShape = null;
        startDragPosition = null;
    }

    redrawCanvas();
    updateGeneralInfo();
});

window.addEventListener('mouseup', () => {
    isDragged = false;
    draggedShape = null;
    startDragPosition = null; 
});

updateShapeInfoUI();
updateGeneralInfo();

window.addEventListener('resize', updateGeneralInfo);