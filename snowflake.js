function createSnowflake() {
  const snowContainer = document.querySelector('.snow-container'); // 눈송이 담을 컨테이너 선택
  const snowflake = document.createElement('div'); // 새로운 <div> 요소 생성
  snowflake.classList.add('snowflake'); // .snowflake 클래스 추가
  snowflake.innerHTML = '*'; // 눈송이 모양 설정
  snowContainer.appendChild(snowflake); // .snow-container 내부에 눈송이 추가

  // 랜덤 위치, 크기, 애니메이션 지속 시간 설정
  let size = Math.random() * 10 + 5; // 눈송이 크기 (5px ~ 15px)
  let startX = Math.random() * window.innerWidth; // 화면 너비 안에서 랜덤한 가로 위치
  let duration = Math.random() * 5 + 3; // 애니메이션 지속 시간 (3~8초)

  // css 스타일 적용
  snowflake.style.left = `${startX}px`; // 눈송이 가로 위치 지정
  snowflake.style.fontSize = `${size}px`; // 눈송이 크기 지정
  snowflake.style.animationDuration = `${duration}s`; // 애니메이션 지속 기간 설정

  // 일정 시간이 지나면 눈송이 제거 (메모리 관리)
  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}

// 100ms마다 새로운 눈송이 생성 (눈이 계속 내리는 효과)
setInterval(createSnowflake, 100);
