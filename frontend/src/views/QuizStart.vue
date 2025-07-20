<template>
  <div class="app-container">
    <!-- 헤더 -->
    <header class="app-header">
      <div class="hero-icon">⚾</div>
      <h1 class="header-title">야구 퀴즈 선택</h1>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container glass-card">
        <div class="loading-spinner"></div>
        <p class="loading-text">퀴즈 정보를 불러오는 중...</p>
      </div>

      <!-- 퀴즈 시작 콘텐츠 -->
      <div v-else class="quiz-content fade-in">

        <!-- 문제 수 선택 섹션 -->
        <section class="option-section">
          <div class="glass-card-dark">
            <h3 class="section-title">📝 1. 문제 수 선택</h3>
            <p class="section-subtitle">원하는 문제 수를 선택하세요</p>
            
            <div class="question-count-grid">
              <button 
                v-for="count in questionCountOptions"
                :key="count"
                class="count-option glass-card-light"
                :class="{ active: selectedQuestionCount === count }"
                @click="setQuestionCount(count)"
              >
                <span class="count-number">{{ count }}</span>
                <span class="count-label">문제</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 문제 출제 방식 선택 섹션 -->
        <section class="option-section">
          <div class="glass-card-dark">
            <h3 class="section-title">🎲 2. 출제 방식</h3>
            <p class="section-subtitle">문제 출제 순서를 선택하세요</p>
            
            <div class="quiz-mode-options">
              <button 
                class="mode-option glass-card-light"
                :class="{ active: quizMode === 'sequential' }"
                @click="setQuizMode('sequential')"
              >
                <div class="mode-icon icon-bg-primary">📋</div>
                <div class="mode-content">
                  <h4 class="mode-title">순차적 출제</h4>
                  <p class="mode-description">기본 순서대로 진행</p>
                </div>
                <div class="mode-badge" v-if="quizMode === 'sequential'">추천</div>
              </button>
              
              <button 
                class="mode-option glass-card-light"
                :class="{ active: quizMode === 'random' }"
                @click="setQuizMode('random')"
              >
                <div class="mode-icon icon-bg-primary">🎲</div>
                <div class="mode-content">
                  <h4 class="mode-title">랜덤 출제</h4>
                  <p class="mode-description">문제 순서를 무작위로</p>
                </div>
                <div class="mode-badge" v-if="quizMode === 'random'">도전</div>
              </button>
            </div>
          </div>
        </section>

        <!-- 시작 버튼 섹션 -->
        <section class="start-section">
          <div class="button-group">
            <button class="btn-primary start-quiz-btn" @click="startQuiz">
              <span class="btn-icon">🚀</span>
              퀴즈 시작하기
            </button>
            <button class="btn-secondary" @click="goHome">
              홈으로 돌아가기
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'QuizStart',
  data() {
    return {
      loading: true,
      totalQuestions: 0,
      quizMode: 'sequential', // 기본값: 순차적 출제
      selectedQuestionCount: 10, // 기본값: 10문제
      questionCountOptions: [5, 10, 20] // 선택 가능한 문제 수
    }
  },
  async mounted() {
    await this.loadQuizInfo()
  },
  methods: {
    async loadQuizInfo() {
      try {
        // 실제로는 API 호출: GET /api/quiz/info
        const response = await fetch('/quiz-data.json')
        const questions = await response.json()
        this.totalQuestions = questions.length
        
        // 로딩 시간을 시뮬레이션 (실제에서는 제거)
        setTimeout(() => {
          this.loading = false
        }, 300)
      } catch (error) {
        console.error('퀴즈 정보 로딩 실패:', error)
        this.loading = false
      }
    },
    
    setQuizMode(mode) {
      this.quizMode = mode
      // 햅틱 피드백 시뮬레이션
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    },

    setQuestionCount(count) {
      this.selectedQuestionCount = count
      // 햅틱 피드백 시뮬레이션
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    },
    
    async startQuiz() {
      try {
        // 기존 퀴즈 데이터 초기화
        localStorage.removeItem('quizAnswers')
        localStorage.removeItem('questionOrder')
        localStorage.removeItem('selectedQuestionCount')
        localStorage.removeItem('quizMode')
        
        // 퀴즈 세션 생성
        const sessionId = 'session_' + Date.now()
        
        // 선택된 설정을 localStorage에 저장
        localStorage.setItem('quizMode', this.quizMode)
        localStorage.setItem('selectedQuestionCount', this.selectedQuestionCount.toString())
        
        console.log('퀴즈 시작:', {
          mode: this.quizMode,
          count: this.selectedQuestionCount,
          sessionId: sessionId
        })
        
        // 선택된 모드와 문제 수를 쿼리 파라미터로 전달
        this.$router.push({
          path: `/quiz/question/1`,
          query: { 
            session: sessionId,
            mode: this.quizMode,
            count: this.selectedQuestionCount
          }
        })
      } catch (error) {
        console.error('퀴즈 시작 실패:', error)
        alert('퀴즈 시작에 실패했습니다.')
      }
    },
    
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* 페이지별 고유 스타일 */
.main-content {
  padding: 0 20px 40px;
  max-width: 600px;
  margin: 0 auto;
}

.quiz-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-icon {
  font-size: 24px;
  color: white;
}

/* 옵션 섹션 */
.option-section {
  margin: 4px 0;
}

.glass-card-dark {
  padding: 24px;
}

/* 문제 수 선택 그리드 */
.question-count-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.count-option {
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #333;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px;
}

/* 문제 수 선택 - 활성화된 상태 배경색 변경 */
.count-option.active {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
  border: 1px solid rgba(255, 215, 0, 0.5) !important;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.count-number {
  font-size: 24px;
  font-weight: 800;
  color: #667eea;
}

.count-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 퀴즈 모드 옵션 */
.quiz-mode-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-option {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  color: #333;
  position: relative;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px;
}

/* 퀴즈 모드 선택 - 활성화된 상태 배경색 변경 */
.mode-option.active {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
  color: #333 !important;
  border: 1px solid rgba(255, 215, 0, 0.5) !important;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

.mode-option.active .mode-title {
  color: #333 !important;
  font-weight: 700;
}

.mode-option.active .mode-description {
  color: #444 !important;
  font-weight: 500;
}

.mode-option.active .mode-icon {
  background: rgba(255, 255, 255, 0.8) !important;
  color: #333 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mode-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mode-content {
  flex: 1;
}

.mode-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.mode-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.mode-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: uppercase;
}

/* 시작 버튼 섹션 */
.start-section {
  margin: 8px 0;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.start-quiz-btn {
  width: 100%;
  max-width: 300px;
  font-size: 18px;
  padding: 18px 32px;
  position: relative;
  overflow: hidden;
}

.btn-icon {
  margin-right: 8px;
  font-size: 16px;
}

.start-quiz-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.start-quiz-btn:active::after {
  width: 300px;
  height: 300px;
}

/* 로딩 상태 */
.loading-container {
  margin: 40px 20px;
  padding: 60px 20px;
}

.loading-text {
  color: #333;
  font-size: 16px;
  margin-top: 16px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .main-content {
    padding: 0 16px 40px;
  }
  
  .glass-card-dark {
    padding: 20px;
  }
  
  .question-count-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .quiz-mode-options {
    gap: 8px;
  }
  
  .mode-option {
    padding: 16px;
    gap: 12px;
  }
  
  .mode-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .mode-title {
    font-size: 15px;
  }
  
  .mode-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .question-count-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .count-option {
    padding: 16px 12px;
  }
  
  .count-number {
    font-size: 20px;
  }
  
  .quiz-mode-options {
    flex-direction: column;
  }
  
  .mode-option {
    padding: 16px;
  }
  
  .start-quiz-btn {
    font-size: 16px;
    padding: 16px 28px;
  }
}
</style>