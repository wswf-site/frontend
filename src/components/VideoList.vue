<script setup>
import { ref, computed } from 'vue'
import { formatDateSimple } from '@/utils/dateUtils'
import currentStatsData from '@/data/danceFilm/currentStats.json' // 정적 데이터 불러오기
// import { useRouter } from 'vue-router' // useRouter import

// const router = useRouter() // router 인스턴스 생성

const videos = ref([])
const showLikeCollectedAt = ref({})

const calculateScore = (video) => {
  return video.viewCount + video.likeCount * 100
}

const sortByScoreDesc = (videos) => {
  return videos.sort((a, b) => b.score - a.score)
}

const assignRanks = (videos) => {
  let prevScore = null
  let currentRank = 0
  let actualIndex = 0

  videos.forEach((v) => {
    actualIndex += 1
    if (v.score !== prevScore) {
      currentRank = actualIndex
    }
    v.rank = currentRank
    prevScore = v.score
  })

  return videos
}

// 고정 데이터로 처리
const enriched = currentStatsData.map((v) => ({
  ...v,
  score: calculateScore(v),
}))

const sorted = sortByScoreDesc(enriched)
const ranked = assignRanks(sorted)

videos.value = ranked
showLikeCollectedAt.value = Object.fromEntries(ranked.map((v) => [v.videoId, false]))

const toggleLikeCollectedAt = (videoId) => {
  showLikeCollectedAt.value[videoId] = !showLikeCollectedAt.value[videoId]
}

const getLatestCollectedAt = () => {
  const timestamps = videos.value.map((v) => new Date(v.collectedAt))
  return timestamps.length ? formatDateSimple(new Date(Math.max(...timestamps))) : ''
}

const mode = ref('normal') // 'normal' 또는 'withDiff'

// 차이 행이 삽입된 데이터 구성
const videosWithDiffRows = computed(() => {
  const result = []
  for (let i = 0; i < videos.value.length; i++) {
    result.push({ ...videos.value[i], isDiff: false })

    if (i < videos.value.length - 1) {
      const current = videos.value[i]
      const next = videos.value[i + 1]

      result.push({
        isDiff: true,
        diffView: current.viewCount - next.viewCount,
        diffLike: current.likeCount - next.likeCount,
        diffScore: current.score - next.score,
      })
    }
  }
  return result
})
</script>

<template>
  <div>
    <router-link to="/" class="home-link">← 미션 선택 페이지로 돌아가기</router-link>
    <h2 style="margin-top: 15px; margin-bottom: 8px">♦️ DANCE FILM MISSION</h2>
    <div v-if="videos.length" style="margin-bottom: 16px">
      ⏱️ 조회 수 마지막 수집 시각: <strong>{{ getLatestCollectedAt() }}</strong>
    </div>
    <p>※ 좋아요 수는 정확하지 않습니다</p>

    <div class="tabs">
      <button class="tab" :class="{ active: mode === 'normal' }" @click="mode = 'normal'">
        순위만
      </button>
      <button class="tab" :class="{ active: mode === 'withDiff' }" @click="mode = 'withDiff'">
        차이 포함
      </button>
    </div>

    <table class="video-table" v-if="mode === 'normal'">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Views</th>
          <th>Likes</th>
          <th>Score</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="video in videos" :key="video.videoId">
          <td>{{ video.rank }}</td>
          <td>
            <router-link :to="`/dance-film/video/${video.videoId}`">
              {{ video.teamName }}
            </router-link>
          </td>
          <td>{{ video.viewCount.toLocaleString() }}</td>
          <td
            @click="toggleLikeCollectedAt(video.videoId)"
            :class="['like-cell', { open: showLikeCollectedAt[video.videoId] }]"
          >
            <div>{{ video.likeCount.toLocaleString() }}</div>

            <div class="like-meta">
              <span v-if="showLikeCollectedAt[video.videoId]">
                {{ video.likeCollectedAt ? formatDateSimple(video.likeCollectedAt) : '정보 없음' }}
              </span>
            </div>
          </td>

          <td>{{ (video.viewCount + video.likeCount * 100).toLocaleString() }}</td>
          <td>
            <a
              :href="`http://youtube.com/watch?v=${video.videoId}`"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #ff0000; font-size: 14px"
            >
              ▶
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="video-table" v-else>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Views</th>
          <th>Likes</th>
          <th>Score</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in videosWithDiffRows" :key="idx" :class="{ 'diff-row': row.isDiff }">
          <template v-if="!row.isDiff">
            <td>{{ row.rank }}</td>
            <td>
              <router-link :to="`/dance-film/video/${row.videoId}`">
                {{ row.teamName }}
              </router-link>
            </td>
            <td>{{ row.viewCount.toLocaleString() }}</td>
            <td
              @click="toggleLikeCollectedAt(row.videoId)"
              :class="['like-cell', { open: showLikeCollectedAt[row.videoId] }]"
            >
              <div>{{ row.likeCount.toLocaleString() }}</div>
              <div class="like-meta">
                <span v-if="showLikeCollectedAt[row.videoId]">
                  {{ row.likeCollectedAt ? formatDateSimple(row.likeCollectedAt) : '정보 없음' }}
                </span>
              </div>
            </td>
            <td>{{ row.score.toLocaleString() }}</td>
            <td>
              <a
                :href="`http://youtube.com/watch?v=${row.videoId}`"
                target="_blank"
                rel="noopener noreferrer"
                style="color: #ff0000; font-size: 14px"
              >
                ▶
              </a>
            </td>
          </template>

          <template v-else>
            <td colspan="2" style="font-style: italic; color: #888">-</td>
            <td>{{ row.diffView.toLocaleString() }}</td>
            <td>{{ row.diffLike.toLocaleString() }}</td>
            <td>{{ row.diffScore.toLocaleString() }}</td>
            <td></td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
.home-link {
  font-size: 0.95rem;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 8px;
  display: inline-block;
  transition: color 0.2s;
}

.home-link:hover {
  color: #0056b3;
}

.tabs {
  display: flex;
  margin-bottom: 30px;
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

.diff-row {
  background-color: #f9f9f9;
  font-style: italic;
  color: #555;
}

.video-table {
  width: 100%;
  max-width: 800px;
  margin: 0;
  border-collapse: collapse;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-table th,
.video-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.video-table th {
  background-color: #e8e7e7;
  font-weight: bold;
}

.video-table tr:hover {
  background-color: #f9f9f9;
}

.video-table a {
  text-decoration: none;
  color: #007acc;
  font-weight: 500;
}

.video-table a:hover {
  text-decoration: underline;
}

.like-cell {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.like-meta {
  font-size: 12px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  /* 여기서 색상을 연하게 설정 */
  color: #888; /* 회색 톤으로 연하게 (더 연하게 하려면 #999, #aaa 등 사용) */
}

/* 증감량 표시를 위한 스타일 */
.diff-value {
  font-size: 0.85em;
  margin-left: 5px;
  font-weight: normal;
}
.diff-value.positive {
  color: #28a745; /* 초록색 */
}
.diff-value.negative {
  color: #dc3545; /* 빨간색 */
}
</style>
