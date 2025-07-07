<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import ViewChart from './ViewChart.vue'

// 수정: 실제 API 함수 대신, 동적 정적 데이터 로더 함수를 임포트합니다.
import { loadStaticVideoData } from '@/api/statsApi' // 또는 적절한 경로

const route = useRoute()
const videoId = ref(route.params.videoId)

const charts = ref([])
const teamName = ref('')
const activeTab = ref('view') // 'view' or 'like'

// 차트 필터링
const filteredCharts = computed(() =>
  charts.value.filter((chart) => chart.mode === activeTab.value),
)

const loadCharts = async () => {
  charts.value = []
  teamName.value = '' // 데이터 로드 전 초기화

  if (!videoId.value) {
    console.warn('Video ID가 없어 차트 데이터를 불러올 수 없습니다.')
    return
  }

  try {
    // 특정 날짜 범위는 정적 데이터를 불러올 때는 필요 없지만,
    // 데이터 내부에서 필터링하거나 UI에 표시하기 위해 유지할 수 있습니다.
    const datesToDisplay = ['2025-07-05', '2025-07-04', '2025-07-03', '2025-07-02'] // 표시하고 싶은 날짜들

    // 조회수 데이터 가져오기 (views.json 파일 내용 전체)
    const viewsJsonData = await loadStaticVideoData(videoId.value, 'views')
    console.log('조회수 정적 데이터:', viewsJsonData)

    if (viewsJsonData && viewsJsonData.dailyData) {
      for (const date of datesToDisplay) {
        // UI에 표시할 날짜만 순회
        if (viewsJsonData.dailyData[date] && viewsJsonData.dailyData[date].length > 0) {
          charts.value.push({
            mode: 'view',
            type: 'daily', // 이제 'recent' 타입은 없음
            date: date,
            data: viewsJsonData.dailyData[date],
            id: `view-daily-${date}`,
          })
          // 팀 이름 설정 (데이터가 있을 때 한 번만 설정)
          if (!teamName.value && viewsJsonData.dailyData[date][0]?.teamName) {
            teamName.value = viewsJsonData.dailyData[date][0].teamName
          }
        }
      }
    }

    // 좋아요 데이터 가져오기 (likes.json 파일 내용 전체)
    const likesJsonData = await loadStaticVideoData(videoId.value, 'likes')
    console.log('좋아요 정적 데이터:', likesJsonData)

    if (likesJsonData) {
      for (const date of datesToDisplay) {
        // UI에 표시할 날짜만 순회
        if (likesJsonData[date] && likesJsonData[date].length > 0) {
          charts.value.push({
            mode: 'like',
            type: 'daily',
            date: date,
            data: likesJsonData[date],
            id: `like-daily-${date}`,
          })
        }
      }
    }

    // 생성된 차트 설정을 날짜 내림차순으로 정렬
    charts.value.sort((a, b) => {
      // 'recent' 타입이 없으므로, 날짜만으로 정렬합니다.
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date) // 최신 날짜가 먼저 오도록
      }
      return 0
    })
  } catch (error) {
    console.error(`차트 데이터를 불러오는 데 실패했습니다 (Video ID: ${videoId.value}):`, error)
  }
}

onMounted(() => {
  loadCharts()
})

// videoId가 변경되면 차트를 다시 로드합니다.
watch(
  () => route.params.videoId,
  (newVideoId) => {
    videoId.value = newVideoId
    loadCharts()
  },
)
</script>

<template>
  <div class="page-wrapper">
    <router-link to="/api-mission" class="back-link">← 돌아가기</router-link>
    <div class="blank" style="margin-bottom: 10px"></div>
    <h2 class="page-title">
      <span class="stat-label"> Global Artist Performance MISSION 상세 통계</span>
      <span class="team-name">{{ teamName || '로딩 중...' }} </span><br />
    </h2>
    <div class="header"></div>

    <div class="tabs">
      <button :class="['tab', activeTab === 'view' ? 'active' : '']" @click="activeTab = 'view'">
        🎞️ Views
      </button>
      <button :class="['tab', activeTab === 'like' ? 'active' : '']" @click="activeTab = 'like'">
        ❤️ Likes
      </button>
    </div>

    <template v-if="filteredCharts.length > 0">
      <ViewChart
        v-for="chart in filteredCharts"
        :key="chart.id"
        :videoId="videoId"
        :mode="chart.mode"
        :type="chart.type"
        :date="chart.date"
        :rawData="chart.data"
      />
    </template>
    <div v-else class="no-data-message">데이터가 없습니다.</div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
.page-wrapper {
  padding: 10px;
  max-width: 700px;
  margin-left: 0;
}
.blank {
  margin-bottom: 5px;
}
.header {
  align-items: center;
  margin-bottom: 10px;
}

.back-link {
  font-size: 0.95rem;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0056b3;
}
.page-title {
  margin: 15px 0 25px 0;
  line-height: 1.2;
  text-align: left;
}

.stat-label {
  display: block;
  font-size: 1.5rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
  letter-spacing: 0.03em;
}

.team-name {
  display: block;
  font-size: 2.3rem;
  font-weight: 800;
  color: #2c3e50;
}

.tabs {
  display: flex;
  margin-bottom: 16px;
}

.tab {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-weight: bold;
  color: #555;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease-in-out;
}

.tab:hover {
  color: #000;
}

.tab.active {
  color: #000;
  border-bottom: 3px solid #007bff;
}

.no-data-message {
  text-align: center;
  color: #888;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
