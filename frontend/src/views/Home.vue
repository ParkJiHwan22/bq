// views/Home.vue (랜딩페이지)
<template>
  <div class="app-container">
    <!-- 상단 헤더 -->
    <header class="app-header">
      <div class="profile-section" @click="goToMyPage">
        <div class="avatar header-element-bg">
          <i class="icon">👤</i>
        </div>
        <span class="username">사용자님</span>
      </div>
      <div class="notification-icon header-element-bg-light">
        <i class="icon">🔔</i>
        <span class="notification-dot"></span>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 환영 섹션 -->
      <section class="welcome-section">
        <h1 class="welcome-title">⚾ 야구 퀴즈</h1>
        <p class="welcome-subtitle">당신의 야구 상식을 테스트해보세요!</p>
      </section>

      <!-- 액션 카드들 -->
      <section class="action-cards">
        <!-- 퀴즈 시작 메인 카드 -->
        <div class="main-card glass-card" @click="goToQuiz">
          <div class="card-bg-pattern"></div>
          <div class="card-content">
            <div class="card-icon main-icon">🎯</div>
            <h3 class="card-title">퀴즈 시작하기</h3>
            <p class="card-description">새로운 도전을 시작해보세요</p>
            <div class="card-arrow">→</div>
          </div>
        </div>

        <!-- 서브 카드들 -->
        <div class="sub-cards">
          <div class="card glass-card-light" @click="goToRanking">
            <div class="card-content">
              <div class="card-icon">🏆</div>
              <h4 class="card-title">랭킹</h4>
              <p class="card-subtitle">순위 확인</p>
            </div>
            <div class="card-stats">
              <span class="stats-number">TOP 10</span>
            </div>
          </div>

          <div class="card glass-card-light" @click="goToMyPage">
            <div class="card-content">
              <div class="card-icon">📊</div>
              <h4 class="card-title">마이페이지</h4>
              <p class="card-subtitle">내 기록</p>
            </div>
            <div class="card-stats">
              <span class="stats-number">85%</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 하단 네비게이션 -->
    <nav class="bottom-nav bottom-nav-bg">
      <div class="nav-item active">
        <div class="nav-icon">🏠</div>
        <span class="nav-label">홈</span>
      </div>
      <div class="nav-item" @click="goToQuiz">
        <div class="nav-icon">🎯</div>
        <span class="nav-label">퀴즈</span>
      </div>
      <div class="nav-item" @click="goToRanking">
        <div class="nav-icon">🏆</div>
        <span class="nav-label">랭킹</span>
      </div>
      <div class="nav-item" @click="goToMyPage">
        <div class="nav-icon">👤</div>
        <span class="nav-label">마이</span>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToQuiz() {
      this.$router.push('/quiz')
    },
    goToRanking() {
      this.$router.push('/ranking')
    },
    goToMyPage() {
      this.$router.push('/mypage')
    }
  }
}
</script>

<style scoped>
/* 페이지별 고유 스타일 */
.main-content {
  background: linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 0 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.welcome-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin: 0 0 24px 0;
}

/* 헤더 요소들 */
.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-section:active {
  transform: scale(0.98);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.notification-icon {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.notification-icon:active {
  transform: scale(0.95);
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4757;
}

.icon {
  font-size: 20px;
}

/* 액션 카드들 */
.action-cards {
  margin-bottom: 30px;
} 

.main-card {
  padding: 24px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.card-content {
  position: relative;
  z-index: 2;
}

.main-icon {
  font-size: 40px;
  margin-bottom: 12px;
  display: block;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 16px 0;
}

.card-arrow {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 24px;
  color: #667eea;
  font-weight: bold;
}

.sub-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card:active {
  transform: scale(0.95);
}

.card-icon {
  font-size: 28px;
  margin-bottom: 8px;
  display: block;
}

.card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.card-subtitle {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.card-stats {
  position: absolute;
  top: 16px;
  right: 16px;
}

.stats-number {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

/* 하단 네비게이션 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 12px 0 8px;
  z-index: 1000;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active .nav-icon {
  background: #667eea;
  color: white;
}

.nav-item.active .nav-label {
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: transparent;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .app-container {
    padding-bottom: 90px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .main-card {
    padding: 20px;
  }
  
  .sub-cards {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 16px;
  }
}

/* 터치 피드백 개선 */
@media (hover: none) {
  .activity-item:hover {
    background: initial;
  }
}
</style>