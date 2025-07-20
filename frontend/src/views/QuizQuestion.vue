<template>
  <div class="app-container">
    <!-- 헤더 -->
    <header class="app-header">
      <button class="header-back-btn" @click="quitQuiz">←</button>
      <div class="header-title">퀴즈 풀이</div>
      <div class="header-menu-btn">{{ currentQuestionNumber }}/{{ selectedQuestionCount }}</div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content-centered">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">문제를 불러오는 중...</p>
      </div>

      <div v-else-if="question" class="question-content fade-in">
        <!-- 진행률 -->
        <div class="progress-section">
          <div class="glass-card progress-card-bg">
            <div class="progress-bar">
              <div class="progress-fill progress-fill-bg" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 문제 -->
        <div class="question-section">
          <div class="question-card">
            <h2 class="question-text">{{ question.question }}</h2>
          </div>
        </div>

        <!-- 선택지 -->
        <div class="options-section">
          <button
            v-for="(option, index) in question.options"
            :key="index"
            class="option-btn"
            :class="{ 
              'correct': showResult && index === question.correct,
              'incorrect': showResult && index === selectedAnswer && index !== question.correct,
              'selected': index === selectedAnswer && !showResult
            }"
            :disabled="answering || showResult"
            @click="selectAnswer(index)"
          >
            {{ option }}
          </button>
        </div>

        <!-- 정답 표시 및 설명 -->
        <div v-if="showResult" class="result-section">
          <div class="result-message glass-card" :class="{ correct: isCorrect, incorrect: !isCorrect }">
            {{ isCorrect ? '정답입니다! 🎉' : '틀렸습니다 😅' }}
          </div>
          <div v-if="question.explanation" class="explanation glass-card">
            <h4>📝 해설</h4>
            <p>{{ question.explanation }}</p>
          </div>
          <button class="btn-primary next-btn" @click="nextQuestion">
            <span class="btn-icon">{{ isLastQuestion ? '📊' : '➡️' }}</span>
            {{ isLastQuestion ? '결과 보기' : '다음 문제' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'QuizQuestion',
  props: ['id'],
  data() {
    return {
      loading: true,
      question: null,
      totalQuestions: 10,
      answering: false,
      showResult: false,
      selectedAnswer: null,
      sessionId: null,
      quizMode: 'sequential',
      selectedQuestionCount: 10,
      questionOrder: [],
      currentQuestionNumber: 1
    }
  },
  computed: {
    questionId() {
      return parseInt(this.id) || 1
    },
    progressPercent() {
      return (this.currentQuestionNumber / this.selectedQuestionCount) * 100
    },
    isCorrect() {
      return this.selectedAnswer === this.question.correct
    },
    isLastQuestion() {
      return this.currentQuestionNumber >= this.selectedQuestionCount
    }
  },
  async mounted() {
    this.sessionId = this.$route.query.session
    this.quizMode = this.$route.query.mode || 'sequential'
    this.selectedQuestionCount = parseInt(this.$route.query.count) || 10
    await this.initializeQuiz()
    await this.loadQuestion()
  },
  async beforeRouteUpdate(to, from, next) {
    this.loading = true
    this.showResult = false
    this.selectedAnswer = null
    this.currentQuestionNumber = parseInt(to.params.id)
    await this.loadQuestion()
    next()
  },
  methods: {
    async initializeQuiz() {
      try {
        const response = await fetch('/quiz-data.json')
        const questions = await response.json()
        this.totalQuestions = questions.length
        
        let availableQuestions = Array.from({length: this.totalQuestions}, (_, i) => i + 1)
        
        if (this.quizMode === 'random') {
          this.shuffleArray(availableQuestions)
        }
        
        this.questionOrder = availableQuestions.slice(0, this.selectedQuestionCount)
        
        if (this.quizMode === 'sequential') {
          this.questionOrder.sort((a, b) => a - b)
        }
        
        localStorage.setItem('questionOrder', JSON.stringify(this.questionOrder))
        localStorage.setItem('selectedQuestionCount', this.selectedQuestionCount.toString())
        
        this.currentQuestionNumber = parseInt(this.id) || 1
      } catch (error) {
        console.error('퀴즈 초기화 실패:', error)
      }
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
    },

    async loadQuestion() {
      try {
        const savedOrder = JSON.parse(localStorage.getItem('questionOrder') || '[]')
        const savedCount = parseInt(localStorage.getItem('selectedQuestionCount') || '10')
        
        if (savedOrder.length > 0) {
          this.questionOrder = savedOrder
          this.selectedQuestionCount = savedCount
        }

        const actualQuestionId = this.questionOrder[this.currentQuestionNumber - 1]
        
        const response = await fetch('/quiz-data.json')
        const questions = await response.json()
        this.question = questions[actualQuestionId - 1]
        this.loading = false
      } catch (error) {
        console.error('문제 로딩 실패:', error)
        this.loading = false
      }
    },
    
    async selectAnswer(selectedIndex) {
      if (this.answering || this.showResult) return
      
      this.answering = true
      this.selectedAnswer = selectedIndex
      
      try {
        const answers = JSON.parse(localStorage.getItem('quizAnswers') || '[]')
        answers.push({
          questionNumber: this.currentQuestionNumber,
          questionId: this.questionOrder[this.currentQuestionNumber - 1],
          answer: selectedIndex,
          correct: this.question.correct,
          isCorrect: selectedIndex === this.question.correct
        })
        localStorage.setItem('quizAnswers', JSON.stringify(answers))
        
        setTimeout(() => {
          this.showResult = true
          this.answering = false
        }, 500)
        
      } catch (error) {
        console.error('답안 제출 실패:', error)
        this.answering = false
      }
    },

    nextQuestion() {
      if (this.isLastQuestion) {
        this.$router.push('/quiz/result')
      } else {
        this.$router.push({
          path: `/quiz/question/${this.currentQuestionNumber + 1}`,
          query: { 
            session: this.sessionId,
            mode: this.quizMode,
            count: this.selectedQuestionCount
          }
        })
      }
    },
    
    quitQuiz() {
      if (confirm('정말로 퀴즈를 종료하시겠습니까?')) {
        localStorage.removeItem('quizAnswers')
        localStorage.removeItem('questionOrder')
        localStorage.removeItem('selectedQuestionCount')
        this.$router.push('/quiz')
      }
    }
  }
}
</script>

<style scoped>
/* 진행률 섹션 */
.progress-section {
  margin-bottom: 24px;
}

.progress-card-bg {
  padding: 16px;
  border-radius: 16px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-bg {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 문제 섹션 - 가독성 최우선 */
.question-section {
  margin-bottom: 32px;
}

.question-card {
  background: #ffffff !important;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 2px solid rgba(255,255,255,0.8);
}

.question-text {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* 선택지 섹션 - 명확한 가독성 */
.options-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.option-btn {
  background: #ffffff !important;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  text-align: left;
  line-height: 1.5;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.option-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8f9ff !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.option-btn:disabled {
  cursor: not-allowed;
}

.option-btn.selected {
  background: linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 100%) !important;
  border-color: #f39c12;
  color: #2c3e50;
  font-weight: 600;
}

.option-btn.correct {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%) !important;
  color: white !important;
  border-color: #27ae60;
  font-weight: 600;
}

.option-btn.incorrect {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
  color: white !important;
  border-color: #c0392b;
  font-weight: 600;
}

/* 결과 섹션 */
.result-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 16px;
}

.result-message.correct {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%) !important;
  color: white;
}

.result-message.incorrect {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%) !important;
  color: white;
}

.explanation {
  padding: 20px;
  border-radius: 16px;
}

.explanation h4 {
  margin: 0 0 12px 0;
  color: #667eea;
  font-size: 16px;
  font-weight: 600;
}

.explanation p {
  margin: 0;
  line-height: 1.6;
  color: #555;
  font-size: 14px;
}

.next-btn {
  width: 100%;
  font-size: 16px;
  padding: 16px 24px;
  margin-top: 8px;
}

.btn-icon {
  margin-right: 8px;
  font-size: 14px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .question-card {
    padding: 24px;
  }
  
  .question-text {
    font-size: 18px;
  }
  
  .option-btn {
    padding: 20px;
    font-size: 15px;
  }
  
  .result-message {
    font-size: 16px;
    padding: 16px;
  }
  
  .explanation {
    padding: 16px;
  }
  
  .explanation h4 {
    font-size: 15px;
  }
  
  .explanation p {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .question-card {
    padding: 20px;
  }
  
  .question-text {
    font-size: 16px;
  }
  
  .option-btn {
    padding: 16px;
    font-size: 14px;
  }
  
  .next-btn {
    font-size: 14px;
    padding: 14px 20px;
  }
}
</style>