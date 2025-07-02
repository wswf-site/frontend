<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const showMegaCrewTable = ref(false)

const megaCrewData = ref([
  { team: 'BUMSUP', actualLike: '166만', estimatedLike: 5731 },
  { team: 'OSAKA_OjoGang', actualLike: '69만', estimatedLike: 2756 },
  { team: 'MOTIV', actualLike: '44만', estimatedLike: 1989 },
  { team: 'AGSQUAD', actualLike: '38만', estimatedLike: 1535 },
  { team: 'RHTokyo', actualLike: '14만', estimatedLike: 717 },
])
</script>

<template>
  <div class="main-container">
    <div style="padding: 20px">
      <h1>🎬 MISSION DASHBOARD</h1>
      <RouterView />
    </div>

    <div class="info-box-small">
      팀 이름을 클릭하면 상세 통계를 볼 수 있습니다.<br />
      조회수는 약 5분마다 집계 (youtube data API)
      <br />
      좋아요 수는 약 30분마다 집계 (returnyoutubedislike.com) - likes 값을 클릭하면 수집한 시각이
      나옵니다.
    </div>

    <div class="accuracy-info-box">
      <p>
        <strong>⚠️ 좋아요 수는 값이 정확하지 않습니다.</strong>
        <br />
        본 데이터는 YouTube 공식 API를 기반으로 한 값이 아니며, 타 사이트로부터 수집한 정보를
        기준으로 약 200배를 적용하여 추정한 수치입니다. <br />
      </p>

      <div class="x200-explanation-group">
        <button
          @click="showMegaCrewTable = !showMegaCrewTable"
          class="toggle-button minimal-toggle-button"
        >
          X200을 하는 이유
          <span :class="['arrow-icon', { rotated: showMegaCrewTable }]">▼</span>
        </button>

        <div v-if="showMegaCrewTable" class="toggle-content-area minimal-content-area">
          <p class="x200-reason-text">
            추정값에 X200을 할 때 그나마 좋아요 수가 실제와 비슷했기 때문에 X200으로 계산했습니다.
          </p>

          <h3 class="mission-table-title">지난 MEGA CREW Mission 결과</h3>

          <table class="mega-crew-table no-background-table-rows">
            <thead>
              <tr>
                <th>TEAM</th>
                <th>실제Like</th>
                <th>추정Like</th>
                <th>추정Like X 200</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in megaCrewData" :key="data.team">
                <td>{{ data.team }}</td>
                <td>{{ data.actualLike }}</td>
                <td>{{ data.estimatedLike.toLocaleString() }}</td>
                <td>{{ (data.estimatedLike * 200).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
          <p class="explanation-note"></p>
        </div>
      </div>
    </div>
    페이지가 뜨지 않는다면 새로고침 해주세요! <br />

    <div class="contact-info left-aligned-contact">
      혹시나 오류가 생긴다면
      <a href="https://open.kakao.com/o/sht5aJDh" target="_blank" rel="noopener noreferrer">
        https://open.kakao.com/o/sht5aJDh
      </a>
      로 연락 바랍니다!
    </div>
  </div>
</template>

<style scoped>
/* --- 전체 레이아웃 및 기본 스타일 --- */
.main-container {
  max-width: 800px;
  margin: 0 auto; /* 중앙 정렬 */
  padding: 0 20px; /* 좌우 여백 */
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #333;
}

/* --- 정보 박스 스타일 --- */
.info-box-small {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
  margin-top: 10px;
  margin-bottom: 15px; /* 하단 여백 추가 */
}

/* 좋아요 정확도 정보 박스 (X200 이유와 표를 포함) */
.accuracy-info-box {
  background-color: #fff3cd; /* 연한 노란색 배경 */
  border: 1px solid #ffeeba; /* 노란색 테두리 */
  border-radius: 8px;
  padding: 15px 20px; /* 기본 패딩 */
  margin-bottom: 20px;
  font-size: 1rem;
  color: #664d03;
  line-height: 1.6;
}

.accuracy-info-box strong {
  color: #993300;
}

/* --- X200 이유 토글 그룹 (accuracy-info-box 내부) --- */
.x200-explanation-group {
  margin-top: 15px; /* 정확도 설명 텍스트와의 상단 간격 */
  padding-top: 15px; /* 내부 내용의 상단 패딩 */
  /* 위에 있는 정보와 구분하기 위한 점선 */
  border-top: 1px dashed rgba(102, 77, 3, 0.3);
}

/* 최소한의 스타일을 가진 토글 버튼 (X200을 하는 이유) */
.toggle-button.minimal-toggle-button {
  width: auto; /* 내용에 따라 너비 조절 */
  background-color: transparent; /* 배경색 없음 */
  border: none;
  padding: 0; /* 패딩 없음 */
  font-size: 1rem; /* 글자 크기 조정 */
  font-weight: bold; /* 굵게 */
  color: #444; /* 덜 튀는 어두운 회색으로 변경 */
  text-align: left;
  cursor: pointer;
  display: inline-flex; /* 텍스트 너비만큼만 차지 */
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
}

.toggle-button.minimal-toggle-button:hover {
  color: #222; /* 호버 시 더 어두운 회색으로 변경 */
  text-decoration: underline; /* 호버 시 밑줄 유지 */
}

.toggle-button.minimal-toggle-button .arrow-icon {
  margin-left: 5px; /* 화살표와 텍스트 사이 간격 */
  font-size: 0.8em; /* 화살표 크기 조정 */
  color: inherit; /* 부모 색상 (버튼 텍스트 색상)을 따르도록 변경 */
}

/* 최소한의 스타일을 가진 토글 내용 영역 */
.toggle-content-area.minimal-content-area {
  background-color: transparent; /* 배경색 없음 */
  border-top: none; /* 상단 테두리 없음 */
  padding-top: 15px; /* 상단 패딩 유지 */
  padding-left: 0;
  padding-right: 0;
}

.x200-reason-text {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #664d03; /* 부모 박스 색상 상속 */
}

.mission-table-title {
  font-size: 1.1rem; /* 더 작은 제목 */
  color: #444;
  margin-top: 0;
  margin-bottom: 15px;
  text-align: left; /* 표 제목 왼쪽 정렬 */
  font-weight: bold;
}

/* --- MEGA CREW 표 스타일 --- */
.mega-crew-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.mega-crew-table th,
.mega-crew-table td {
  border: 1px solid #ddd;
  padding: 10px 12px;
  text-align: center;
}

.mega-crew-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #555;
}

/* 표 행 배경색 제거 */
.mega-crew-table.no-background-table-rows tbody tr:nth-child(odd) {
  background-color: transparent;
}

.mega-crew-table.no-background-table-rows tbody tr:hover {
  background-color: transparent;
}

.explanation-note {
  font-size: 0.85rem;
  color: #888;
  text-align: right;
  margin-top: 10px;
}

/* --- 연락처 정보 스타일 --- */
.contact-info {
  margin-top: 50px;
  color: #aaa;
  font-size: 0.9rem;
  text-align: left; /* 왼쪽 정렬 유지 */
}

.contact-info a {
  color: #999;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
  color: #777;
}
</style>
