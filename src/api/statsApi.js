// api/statsApi.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchCurrentStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats/current`)
    return response.data
  } catch (error) {
    console.error('현재 통계 데이터를 불러오는 데 실패했습니다:', error)
    throw error
  }
}

/**
 * 특정 비디오의 조회수 또는 좋아요 이력 데이터를 가져옵니다.
 * @param {string} videoId - 비디오 ID
 * @param {'view' | 'like'} mode - 'view' 또는 'like'
 * @param {string[]} dates - 'YYYY-MM-DD' 형식의 날짜 배열
 * @returns {Promise<object>} API 응답 데이터
 */
export const fetchVideoHistoryStats = async (videoId, mode, dates) => {
  try {
    const datesParam = dates.join(',') // 날짜 배열을 콤마로 구분된 문자열로 변환
    const endpoint = mode === 'view' ? 'views/with-recent' : 'likes'
    const response = await axios.get(
      `${API_BASE_URL}/history/${endpoint}/${videoId}?dates=${datesParam}`,
    )
    return response.data
  } catch (error) {
    console.error(
      `비디오 이력 데이터를 불러오는 데 실패했습니다 (ID: ${videoId}, Mode: ${mode}):`,
      error,
    )
    throw error
  }
}

/**
 * 특정 비디오 ID와 모드에 해당하는 정적 JSON 데이터를 동적으로 가져옵니다.
 * @param {string} videoId - 비디오 ID (예: 'Eq12SwjR25s')
 * @param {'view' | 'like'} mode - 'view' 또는 'like'
 * @returns {Promise<object>} JSON 파일의 내용을 반환하는 Promise
 */
export const loadStaticVideoData = async (videoId, mode) => {
  try {
    // Vite 또는 Webpack과 같은 번들러는 동적 import를 지원합니다.
    // 이 경로는 'src' 디렉토리 기준이 아니라, 현재 파일(statsApi.js)이 있는 위치를 기준으로 합니다.
    // 따라서 '../data'로 시작합니다.
    const path = `../data/globalArtist/${videoId}/${mode}.json`

    // JavaScript의 동적 import()를 사용하여 런타임에 모듈을 로드합니다.
    // import()는 Promise를 반환하며, 로드된 모듈 객체를 resolve합니다.
    // 모듈 객체는 기본 내보내기(default export)를 `default` 속성으로 가집니다.
    const module = await import(path)

    // .json 파일은 자동으로 JavaScript 객체로 파싱됩니다.
    return module.default
  } catch (error) {
    console.error(`Error loading static data for videoId: ${videoId}, mode: ${mode}:`, error)
    // 데이터가 없으면 빈 객체나 적절한 기본값을 반환하여 컴포넌트가 크래시되지 않도록 합니다.
    return {}
  }
}
