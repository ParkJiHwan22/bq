// views/QuizResult.vue (퀴즈 결과 페이지)
<template>
  <div class="app-container">
    <!-- 상단 헤더 -->
    <header class="app-header">
      <div class="header-title">
        <span class="title-text">퀴즈 결과</span>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <div v-if="loading" class="loading-card glass-card">
        <div class="loading-content">
          <div class="loading-spinner">🎯</div>
          <p>결과를 계산하는 중...</p>
        </div>
      </div>

      <div v-else class="result-content">
        <!-- 결과 헤더 카드 -->
        <div class="result-header-card glass-card">
          <div class="celebration-icon">🎉</div>
          <h1 class="completion-title">퀴즈 완료!</h1>
          <div class="score-display">
            <div class="score-circle">
              <span class="score">{{ correctCount }}</span>
              <span class="total">/ {{ totalQuestions }}</span>
            </div>
            <div class="score-text">
              <p class="accuracy-rate">정답률 {{ Math.round((correctCount / totalQuestions) * 100) }}%</p>
              <p class="grade">{{ getGrade() }}</p>
            </div>
          </div>
        </div>

        <!-- 문제별 결과 카드 -->
        <div class="question-results-card glass-card-light">
          <button 
            class="toggle-btn" 
            @click="showQuestionDetails = !showQuestionDetails"
          >
            <div class="toggle-content">
              <span class="toggle-icon">📝</span>
              <span class="toggle-text">문제별 결과 {{ showQuestionDetails ? '숨기기' : '보기' }}</span>
            </div>
            <span class="toggle-arrow">{{ showQuestionDetails ? '▲' : '▼' }}</span>
          </button>
          
          <div v-if="showQuestionDetails" class="questions-list">
            <div 
              v-for="(result, index) in questionResults" 
              :key="index"
              class="question-item glass-card-subtle"
              :class="{ correct: result.isCorrect, incorrect: !result.isCorrect }"
            >
              <div class="question-header">
                <span class="question-number">Q{{ result.questionNumber }}</span>
                <span class="result-icon">{{ result.isCorrect ? '✅' : '❌' }}</span>
              </div>
              <div class="question-content">
                <div class="answer-row user-answer-row">
                  <span class="answer-label">선택:</span>
                  <span class="answer-text">{{ result.userAnswer }}</span>
                </div>
                <div v-if="!result.isCorrect" class="answer-row correct-answer-row">
                  <span class="answer-label">정답:</span>
                  <span class="answer-text">{{ result.correctAnswer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div class="action-section">
          <div class="button-group">
            <button class="btn-primary retry-btn" @click="retryQuiz">
              <span class="btn-icon">🔄</span>
              다시 도전하기
            </button>
            <button class="btn-secondary" @click="goHome">
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'QuizResult',
  data() {
    return {
      loading: true,
      totalQuestions: 0,
      correctCount: 0,
      incorrectCount: 0,
      timeSpent: 0,
      questionResults: [],
      showQuestionDetails: false,
      allQuestions: []
    }
  },
  async mounted() {
    await this.calculateResults()
  },
  methods: {
    async calculateResults() {
      try {
        // 퀴즈 답안 데이터 가져오기
        const answers = JSON.parse(localStorage.getItem('quizAnswers') || '[]')
        const questionOrder = JSON.parse(localStorage.getItem('questionOrder') || '[]')
        
        // 전체 문제 데이터 로드
        const response = await fetch('/quiz-data.json')
        this.allQuestions = await response.json()
        
        this.totalQuestions = answers.length
        this.correctCount = answers.filter(answer => answer.isCorrect).length
        this.incorrectCount = this.totalQuestions - this.correctCount
        
        // 소요 시간 계산 (임시로 문제당 평균 30초로 계산)
        this.timeSpent = Math.ceil(this.totalQuestions * 0.5)
        
        // 문제별 결과 준비
        this.questionResults = answers.map(answer => {
          const question = this.allQuestions[answer.questionId - 1]
          return {
            questionNumber: answer.questionNumber,
            questionId: answer.questionId,
            userAnswer: question.options[answer.answer],
            correctAnswer: question.options[answer.correct],
            isCorrect: answer.isCorrect
          }
        })
        
        this.loading = false
      } catch (error) {
        console.error('결과 계산 실패:', error)
        this.loading = false
      }
    },

    getGrade() {
      const accuracy = (this.correctCount / this.totalQuestions) * 100
      if (accuracy >= 90) return '🏆 완벽해요!'
      if (accuracy >= 80) return '🥉 훌륭해요!'
      if (accuracy >= 70) return '👍 좋아요!'
      if (accuracy >= 60) return '📚 조금 더!'
      return '💪 다시 도전!'
    },

    retryQuiz() {
      // 퀴즈 데이터 정리
      localStorage.removeItem('quizAnswers')
      localStorage.removeItem('questionOrder')
      localStorage.removeItem('selectedQuestionCount')
      
      // 퀴즈 시작 페이지로 이동
      this.$router.push('/quiz')
    },
    
    goHome() {
      // 퀴즈 데이터 정리
      localStorage.removeItem('quizAnswers')
      localStorage.removeItem('questionOrder')
      localStorage.removeItem('selectedQuestionCount')
      
      // 홈으로 이동
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* 메인 레이아웃 */
.main-content {
  background: linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 0 20px 30px 20px;
}

/* 로딩 카드 */
.loading-card {
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner {
  font-size: 40px;
  animation: spin 2s linear infinite;
}

.loading-content p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 결과 헤더 카드 */
.result-header-card {
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 16px;
}

.celebration-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.completion-title {
  font-size: 28px;
  font-weight: 800;
  color: #333;
  margin: 0 0 24px 0;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.score {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.total {
  font-size: 14px;
  opacity: 0.9;
}

.score-text {
  text-align: left;
}

.accuracy-rate {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
}

.grade {
  font-size: 16px;
  color: #666;
  margin: 0;
}



/* 문제별 결과 카드 */
.question-results-card {
  padding: 24px;
  margin-bottom: 16px;
}

.toggle-btn {
  width: 100%;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.toggle-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  font-size: 20px;
}

.toggle-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.toggle-arrow {
  font-size: 14px;
  color: #666;
  transition: transform 0.3s ease;
}

.questions-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  padding: 16px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.question-item.correct {
  border-color: rgba(40, 167, 69, 0.3);
  background: rgba(40, 167, 69, 0.05);
}

.question-item.incorrect {
  border-color: rgba(220, 53, 69, 0.3);
  background: rgba(220, 53, 69, 0.05);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-number {
  font-weight: 700;
  color: #667eea;
  font-size: 16px;
}

.result-icon {
  font-size: 20px;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.answer-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  min-width: 40px;
}

.answer-text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.correct-answer-row .answer-text {
  color: #28a745;
  font-weight: 600;
}

/* 액션 섹션 */
.action-section {
  margin: 16px 0 8px 0;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.retry-btn {
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

.retry-btn::after {
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

.retry-btn:active::after {
  width: 300px;
  height: 300px;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .score-display {
    flex-direction: column;
    gap: 16px;
  }
  
  .score-text {
    text-align: center;
  }
  
  .question-header {
    align-items: flex-start;
  }
  
  .retry-btn {
    font-size: 16px;
    padding: 16px 28px;
  }
}</style>