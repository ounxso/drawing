// 주요 요소 가져오기
const saveBtn = document.getElementById('save');
const textInput = document.getElementById('text');
const fileInput = document.getElementById('file');
const fillBtn = document.getElementById('fill-btn');
const destroyBtn = document.getElementById('destroy-btn');
const eraseBtn = document.getElementById('erase-btn');
// getElementById() -> 특정 ID를 가진 HTML 요소 가져온다. (버튼, 입력 필드 등)

// 주요 요소 가져오기
const colorOptions = Array.from(
  // HTMLCollection을 배열(Array)로 변환하여 forEach 같은 배열 메서드를 사용 가능하게 만든다.
  document.getElementsByClassName('color-option')
);

// 주요 요소 가져오기
const color = document.getElementById('color');
const lineWidth = document.getElementById('line-width');

// 주요 요소 가져오기
const canvas = document.querySelector('canvas'); // js에서 canvas 불러오기
const ctx = canvas.getContext('2d');
// context 작성
// context -> 캔버스에 그림 그릴 때 사용하는 붓
// 캔버스에서 2D 드로잉을 위한 context 가져온다.

// 캔버스 기본 설정
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 700;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = 'round'; // 그리는 선 -> 둥글게

// 선 그리기 관련 이벤트
let isPainting = false;
let isFilling = false;

function onMove(event) {
  // 마우스 이동 시 실행
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke(); // 호출하여 선을 실제로 그리도록 만든다.
    return;
  }

  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  // 마우스를 누르면 그리기 시작한다.
  isPainting = true;
}

function cancelPainting() {
  // 마우스를 떼거나 캔버스를 벗어나면 멈춘다.
  isPainting = false;
  ctx.beginPath();
}

// 선 굵기 & 색상 변경
function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

// 색상 옵션 클릭시 색 변경
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  // console.dir() -> 객체 확인
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

// 그리기 모드 & 채우기 모드 전환
function onModeClick() {
  // 버튼 클릭할 때마다 선 그리기 모드와 채우기 모드 전환
  if (isFilling) {
    // true, 캔버스를 클릭하면 전체가 채워지는 모드
    isFilling = false;
    modeBtn.innerText = 'Fill';
    // 사용자가 채우기 모드일 때, 이 버튼을 클릭한다면, 채우기 모드를 멈추고 modeBtn의 텍스트를 Fill로 바꿔줘서 사용자에게 모드가 바뀌었다는 걸 알려준다.
  } else {
    // false, 일반적인 브러시 그리기 모드
    isFilling = true;
    modeBtn.innerText = 'Draw';
    // 사용자가 버튼을 클릭했을 때, 채우기 모드가 아니라면, 채우기 모드로 바꾸고, 버튼의 텍스트도 바꿔준다.
  }
}

// 캔버스를 클릭하면 전체 채우기
function onCanvasClick() {
  // isFilling일 때, 캔버스를 클릭하면 캔버스 크기의 새로운 사각형을 만들고, 해당 색상으로 채워준다.
  if (isFilling) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

// 캔버스 초기화 & 지우개 기능
function onDestroyClick() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraseClick() {
  // 브러시 색을 흰색으로 변경하여 지우개처럼 작동
  ctx.strokeStyle = 'white';
  isFilling = false;
  fillBtn.innerText = 'Fill';
}

// 이미지 파일 추가
function onFileChange(event) {
  const file = event.target.files[0];
  /* 파일 배열인 이유는, html의 input에 multiple 속성을 추가할 수 있기 때문이다.
  multiple 속성을 추가하면 사용자가 파일을 여러 개 업로드할 수 있다. */

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null; // input에 있는 파일 지워주기
  };
}

// 캔버스에 텍스트 추가
function onDoubleClick(event) {
  const text = textInput.value;

  if (text !== ' ') {
    ctx.save(); // ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장한다.

    ctx.lineWidth = 1; // 여기서 수정 가능하다.
    ctx.font = '70px serif';
    ctx.fillText(text, event.offsetX, event.offsetY); // 더블 클릭하면 텍스트 입력 필드의 값을 텍스트에 그린다.
    ctx.restore(); // 수정 완료하면, ctx.restore 이라고 쓰면 된다.
  }
}

// 캔버스 이미지로 저장
function onSaveClick() {
  const url = canvas.toDataURL(); // PNG 이미지 URL 생성
  const a = document.createElement('a'); // 링크 생성
  a.href = url; // 캔버스에서 불러온 이미지, URL로 간다.
  a.download = 'myDrawing.png';
  /* a 태그에 download 속성을 더해준다. 
  download 속성은, 브라우저에게 href에 있는 콘텐츠를 다운로드 하라고 알리는 역할  */
  a.click();
}

canvas.addEventListener('dbclick', onDoubleClick);
// onDoubleClick -> 더블클릭 이벤트는 기본적으로 mousedown, mouseup이 매우 빠르게 일어날 때 발생한다.
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', cancelPainting);
canvas.addEventListener('mouseleave', cancelPainting);

canvas.addEventListener('click', onCanvasClick);
// click은 mousedown과 다르다.
// click -> mousedown, mouseup이 같이 실행된 걸 의미한다.

lineWidth.addEventListener('change', onLineWidthChange);

color.addEventListener('change', onColorChange);

colorOptions.forEach((color) => color.addEventListener('click', onColorClick));

fillBtn.addEventListener('click', onModeClick);
destroyBtn.addEventListener('click', onDestroyClick);
eraseBtn.addEventListener('click', onEraseClick);
fileInput.addEventListener('click', onFileChange);
saveBtn.addEventListener('click', onSaveClick);

/* 사각형 채우는 함수
ctx.fillRect(x값, y값, w값, h값);
*/

/* 사각형 선 그리는 함수
ctx.rect(x, y, w, h);
*/

/* 새 경로 시작하기, 이전 경로와 단절
ctx.beginPath();
*/

/*
moveTo(x, y) -> 브러쉬의 좌표를 움직여 준다.
lineTo(x, y) -> 라인을 그려준다.
*/
