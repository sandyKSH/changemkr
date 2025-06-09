// --- 점수 맵핑 데이터 ---
// situation_step 형태의 key 아래, 각 choiceKey에 feedback, correct, point 정보를 저장
let selectedSituation = null;
let selectedStep = null;
let selectedChoice = null;

const scoreMap = {
  '1_1': {
    'need_help': { feedback: "정답이에요! 버스 번호 확인은 시각적으로 어렵기 때문에 도움이 필요할 수 있어요.", correct: true, point: 10 },
    'no_help':   { feedback: "버스 번호는 음성으로 알 수 없기 때문에 도움이 필요해요.", correct: false, point: -5 }
  },
  '1_2': {
    'ask_first':       { feedback: "정답입니다! 구체적으로 물어보고 적극적으로 돕는 것이 좋아요.", correct: true,  point: 10 },
    'polite_approach': { feedback: "좋은 방법이에요! 조심스럽게 접근하는 것도 바람직해요.", correct: true,  point: 8 },
    'wrong_touch':     { feedback: "동의 없이 신체 접촉은 불편함을 줄 수 있어요.", correct: false, point: -5 },
    'wrong_grab':      { feedback: "동의 없이 팔을 잡는 것은 적절하지 않아요.", correct: false, point: -8 }
  },
  '2_1': {
    'need_help': { feedback: "안내견과 함께 있을 때는 대부분 도움이 필요하지 않아요.", correct: false, point: -5 },
    'no_help':   { feedback: "정답이에요! 안내견과 함께라면 잘 갈 수 있어요.", correct: true,  point: 10 }
  },
  '3_1': {
    'need_help': { feedback: "맞아요! 점자블록이 없는 환경에서는 도움이 필요해요.", correct: true,  point: 10 },
    'no_help':   { feedback: "점자블록이 없어서 길찾기가 어려운 상황이에요.", correct: false, point: -5 }
  },
  '3_2': {
    'direct_guide':  { feedback: "정답이에요! 직접 안내해주는 것이 가장 확실해요.", correct: true,  point: 10 },
    'verbal_guide':  { feedback: "좋은 방법이에요! 구체적인 설명도 도움이 돼요.", correct: true,  point: 8 },
    'wrong_dog':     { feedback: "절대 안 돼요! 안내견을 함부로 만지거나 조작하면 안 됩니다.", correct: false, point: -10 },
    'wrong_complex': { feedback: "너무 복잡한 설명은 오히려 혼란을 줄 수 있어요.", correct: false, point: -3 }
  },
  '4_1': {
    'need_help': { feedback: "안내견은 계단도 잘 안내할 수 있어요.", correct: false, point: -3 },
    'no_help':   { feedback: "정답이에요! 안내견과 함께라면 계단도 문제없어요.", correct: true,  point: 10 }
  },
  '5_1': {
    'need_help': { feedback: "이어폰을 사용하고 있다는 것은 스크린리더 등으로 수업을 듣고 있다는 뜻이에요.", correct: false, point: -3 },
    'no_help':   { feedback: "정답이에요! 조용히 수업을 듣고 있을 때는 방해하지 않는 것이 좋아요.", correct: true,  point: 10 }
  },
  '6_1': {
    'need_help': { feedback: "정답입니다! 키오스크는 시각장애인이 혼자 사용하기 어려운 대표적인 기기예요.", correct: true,  point: 10 },
    'no_help':   { feedback: "키오스크는 터치스크린이라 시각장애인이 사용하기 어려워요.", correct: false, point: -5 }
  },
  '6_2': {
    'ask_help':     { feedback: "정답이에요! 먼저 의사를 묻고 적극적으로 도와주는 것이 좋아요.", correct: true,  point: 10 },
    'call_staff':   { feedback: "좋은 방법이에요! 전문 도움을 요청하는 것도 바람직해요.", correct: true,  point: 8 },
    'wrong_touch':  { feedback: "동의 없이 신체 접촉은 불편함을 줄 수 있어요.", correct: false, point: -8 },
    'wrong_suggest':{ feedback: "근본적인 해결책이 아니에요. 접근성 개선이 더 중요해요.", correct: false, point: -5 }
  },
  '7_1': {
    'need_help': { feedback: "정답이에요! 팀플에서는 적절한 도움과 배려가 필요해요.", correct: true,  point: 10 },
    'no_help':   { feedback: "적절한 도움은 부담이 아니라 배려예요.", correct: false, point: -3 }
  },
  '7_2': {
    'ask_role':     { feedback: "정답입니다! 본인의 의사를 존중하며 역할을 조율하는 것이 좋아요.", correct: true,  point: 10 },
    'offer_help':   { feedback: "좋은 방법이에요! 필요시 도움을 제공하겠다는 의사표현이 좋아요.", correct: true,  point: 8 },
    'wrong_exclude':{ feedback: "미리 배제하는 것은 차별적인 접근이에요.", correct: false, point: -8 },
    'wrong_replace':{ feedback: "대신 해주는 것은 진정한 도움이 아니에요.", correct: false, point: -5 }
  }
};

// 전공별 상황 데이터
const majorMap = {
  science: {
    title: "이공계열 실험 수업",
    text: "오늘은 실험이 있는 날이야. 개별적으로 수업 시간 내에 활동을 마무리해야해. 오늘 수업에는 매십이의 수업 도우미가 보이질 않아. 그리고 다른 학생들보다 진행속도가 느리고 힘들어하는 것 같은데...",
    choices: {
      'help_needed':   { text: "응, 너무 뒤쳐지지 않을 정도로만 도와주면 좋을 것 같아.", correct: true,  point: 10 },
      'wait_request':  { text: "아니, 먼저 도와달라고 하기 전에는 안 도와주는게 예의야.", correct: false, point: -5 }
    },
    step2: {
      'offer_help':     { text: "도움이 필요한다면 내가 도와줄테니 말해줘라고 말한다.", correct: true,  point: 8 },
      'check_progress': { text: "중간 중간 잘 진행되고 어려운 부분은 없는지 살며시 물어본다. ", correct: true,  point: 5 },
      'do_for_them':    { text: "실험을 단계별로 하나씩 대신해주면서 알아듣기 쉽게 설명해준다.", correct: false, point: -8 },
      'watch_correct':  { text: "옆에서 실험하는 걸 지켜보면서 잘 못 될때마다 잡아준다.", correct: false, point: -5 }
    }
  },
  engineering: {
    title: "공학계열 조립 실습",
    text: "오늘은 기계 조립 실습이 있는 날이야. 제품 조립서를 직접 보고 만들어야해서 굉장히 복잡해. 매십이가 잘 활동할 수 있도록...",
    choices: {
      'help_needed': { text: "응, 실습인 만큼 내가 도와주면 더욱 도움이 될 거야.", correct: true,  point: 10 },
      'too_much':    { text: "아니, 너무 과도한 배려는 오히려 불편하게 만들 수도 있어.", correct: false, point: -3 }
    },
    step2: {
      'explain_parts':     { text: "부품 하나하나의 명칭과 최종 조립물의 형태를 말로 설명해준다. ", correct: true,  point: 10 },
      'offer_when_stuck':  { text: "조립하다 막히는 부분이 있으면 나에게 물어보라고 한다. ", correct: true,  point: 8 },
      'tell_everything':   { text: "부품 별로 어떨때 쓰이는지와 어떻게 조립해야하는지 순서를 다 알려준다.", correct: false, point: -5 },
      'do_difficult':      { text: "어려워보이는 부분의 조립은 먼저 나서서 조립해준다.", correct: false, point: -8 }
    }
  },
  medical: {
    title: "의학·보건계열 시험",
    text: "전공 범위가 많다보니 시험도 자주 있는 편이야. 이번주에 첫 시험이 있는데, 오픈북 시험이라고해. 매십이에게는 적합하지 않을 것 같은데...",
    choices: {
      'ask_first':            { text: "응, 매십이가 부담스럽지 않게끔 먼저 의사를 물어보고", correct: true,  point: 10 },
      'too_much_interference':{ text: "아니, 당사자의 동의를 떠나 너무 과한 참견일 수도 있어 자칫 부담스럽게 느낄 수도 있어.", correct: false, point: -5 }
    },
    step2: {
      'visit_prof_together': { text: "당사자 의사를 확인후 교수님께 함께 찾아가 적합한 시험 방식에 대해 여쭤본다. ", correct: true,  point: 10 },
      'suggest_talk':       { text: "당사자에게 먼저 물어본 후 교수님께 말씀드려볼 수 있도록 권유한다.)", correct: true,  point: 8 },
      'email_quietly':      { text: "당사자를 생각해서 교수님께 조용히 건의 메일을 드린다.", correct: false, point: -8 },
      'suggest_school':     { text: "당사자의 편의성을 생각해 적합한 방식으로 시험이 치뤄질 수 있도록 학교 측에 건의한다.", correct: false, point: -5 }
    }
  },
  humanities: {
    title: "인문사회과학계열 토론 수업",
    text: "수업중 조를 구성해 토론하는 시간이 됐어. 다들 매십이의 안내견을 보며 신기해하며 안내견을 만지려하고 있고 매십이는 이를 조금 부담스러워하는 것 같아.",
    choices: {
      'correct_etiquette': { text: "응, 매십이도 부담스러워하고 안내견을 만지는 건 에티켓에 어긋난다고 알고 있어.", correct: true,  point: 10 },
      'let_them_bond':    { text: "아니, 안내견을 만지며 빨리 친해질 수 있을거고 매십이는 많은 관심이 부끄러운 걸꺼야.", correct: false, point: -8 }
    },
    step2: {
      'tell_etiquette': { text: "그 자리에서 허락없이 안내견을 만지고 부르는 행위는 에티켓에 어긋난다고 조원들에게 말해준다.", correct: true,  point: 10 },
      'gesture_stop':   { text: "하지말라는 제스쳐와 함께 안내견을 허락 없이 함부로 대하는 것은 실례라고 말한다.", correct: true,  point: 8 },
      'change_subject': { text: "지금은 수업 중이니 수업에 집중하자고 말해서 불편한 상황을 유하게 넘긴다.", correct: false, point: -5 },
      'partial_correct':{ text: "지금은 앉아 있으니 괜찮지만 시각장애인이 이동중일 때 안내견을 부르거나 만지는 행동은 잘 못 된거라고 말한다.", correct: false, point: -3 }
    }
  },
  arts: {
    title: "예체능계열 활동 수업",
    text: "매십이와 함께 전공 수업을 듣고 있는 중이야. 교수님께서 활동적인 과제를 내주셨어. 매십이는 앞을 볼 수 없어서 힘들 것 같은데...",
    choices: {
      'help_needed':     { text: "응, 도와주는 것이 좋을 것 같아.", correct: true,  point: 10 },
      'burden_concern':  { text: "아니, 오히려 역차별이나 과도한 배려처럼 부담감을 느낄 수 있을 것 같아.", correct: false, point: -5 }
    },
    step2: {
      'continuous_feedback': { text: "활동을 하나씩 잘 따라올 수 있도록 옆에서 계속 지켜보며 피드백을 해준다.", correct: true,  point: 10 },
      'ask_specific':        { text: "어떤 부분이 어려운지 구체적으로 물어본 후 도와준다.)", correct: true,  point: 5 },
      'do_instead':          { text: "앞이 안보여 활동을 수행하기 힘드니 내가 직접 대신 해준다.", correct: false, point: -8 },
      'ask_prof_easier':     { text: "교수님께 말씀드려 매십이가 좀 더 쉽게 수행할 수 있도록 활동 난이도를 조절해달라고 정중히 요청 드린다.", correct: false, point: -5 }
    }
  },
  business: {
    title: "융합·경영계열 분석 수업",
    text: "매십이와 함께 경영학 수업을 듣고 있는 중이야. 이번에는 교수님께서 통계자료를 보며 원인이 무엇인지 분석후 간단히 발표 준비를 하라고 하셨어. 혼자서는 힘들 것 같은데...",
    choices: {
      'help_needed':      { text: "응, 힘든 부분을 내가 도와주는게 좋을 것 같아!", correct: true,  point: 10 },
      'materials_enough': { text: "아니, 수업자료도 잘 나와 있으니 굳이 그럴 필요는 없을 것 같아.", correct: false, point: -5 }
    },
    step2: {
      'read_data':      { text: "그림 속 통계자료의 수치가 몇인지 하나씩 따라 읽어준후 원인을 생각해볼 수 있도록 한다. ", correct: true,  point: 8 },
      'ask_difficulty': { text: "혹시 어려운 부분이 있는지 물어본 후 도와준다.", correct: true,  point: 5 },
      'explain_meaning':{ text: "각각의 통계자료가 어떤 의미를 가지는지 하나씩 알려준다.", correct: false, point: -5 },
      'give_answer':    { text: "통계자료가 무엇이 원인인지 설명해주고 그 이유를 말해보라고 한다.", correct: false, point: -8 }
    }
  }
};

// --- 전역 상태 변수 ---
let currentScore = 0;
let progress = 0;
const totalSteps = 8;  // 총 8단계로 진행
let scoreHistory = [];

// --- makeChoice 함수: 버튼 클릭 시 호출 ---
// situation: 숫자(1~7), step: 숫자(1~2), choiceKey: 문자열
function makeChoice(situation, step, choiceKey) {
    const key = `${situation}_${step}`;
    const feedbackDiv = document.getElementById(`feedback${situation}_${step}`);
    const continueBtn = document.getElementById(`continue${situation}_${step}`);
    const data = scoreMap[key]?.[choiceKey] || { feedback: "알 수 없는 선택입니다.", correct: false, point: 0 };

    // 피드백만 표시하고, “다음으로” 버튼만 보이게 한다.
    feedbackDiv.className = 'feedback show ' + (data.correct ? 'correct' : 'wrong');
    feedbackDiv.textContent = data.feedback;
    continueBtn.style.display = 'block';

    // → 점수나 진행도 업데이트는 여기서 하지 않는다.
    // → 대신 전역 변수에 “선택 정보”만 저장해둔다.
    selectedSituation = situation;
    selectedStep = step;
    selectedChoice = choiceKey;

    setTimeout(() => {
      const target = feedbackDiv || continueBtn;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    }

function applyScore() {
    if (selectedSituation === null || selectedStep === null || selectedChoice === null) {
        // 선택된 것이 없으면(예: 버튼을 누르기 전에 바로 Next를 눌렀거나),
        // 아무 작업도 하지 않고 종료.
        return;
    }

    // scoreMap에서 해당 데이터 가져오기
    const key = `${selectedSituation}_${selectedStep}`;
    const data = scoreMap[key]?.[selectedChoice];
    if (!data) return;

    // 점수와 진행도 업데이트
    currentScore += data.point;
    progress++;
    document.getElementById('currentScore').textContent = currentScore;
    document.getElementById('progressText').textContent = progress;
    document.getElementById('progressBar').style.width = `${(progress / totalSteps) * 100}%`;

    // 기록 저장
    scoreHistory.push({ 
        key, 
        choiceKey: selectedChoice, 
        feedback: data.feedback, 
        point: data.point 
    });

    // 선택 변수를 리셋해서, 재사용 시 복잡해지지 않게 한다.
    selectedSituation = null;
    selectedStep = null;
    selectedChoice = null;
}

// --- 화면 전환 함수 ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'major_situation') {
    // 전공 선택 후 major_situation으로 이동할 때는 selectMajor 함수에서 이미 렌더링함
  }

  if (id === 'summaryScreen') {
    generateFinalReport();
  }
}

// --- 전공 상황 렌더링 함수 ---
function selectMajor(major) {
  const data = majorMap[major];
  if (!data) return;

  // 제목 및 설명 삽입
  document.getElementById('major_story').innerHTML = `
    <strong>📍 ${data.title}</strong><br><br>
    ${data.text}
  `;

  // 첫 단계 선택지 생성
  const container = document.getElementById('major_choices');
  container.innerHTML = '';

  Object.entries(data.choices).forEach(([key, val]) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = val.text;
    btn.onclick = () => {
      // 첫 번째 단계 피드백 표시
      const feedback = document.getElementById('feedbackMajor');
      feedback.className = 'feedback show ' + (val.correct ? 'correct' : 'wrong');
      feedback.textContent = val.correct
        ? "맞아, 이런 상황에서는 도움이 필요해. 어떤 방식으로 도와주는게 좋을까?"
        : "이 상황에서는 도움이 필요한 편이다. 다시 생각해보아요.";

      currentScore += val.point;
      progress++;
      document.getElementById('currentScore').textContent = currentScore;
      //document.getElementById('progressText').textContent = progress;
      //document.getElementById('progressBar').style.width = `${(progress / totalSteps) * 100}%`;

      scoreHistory.push({
        key: `major_${major}_step1`,
        choiceKey: key,
        feedback: feedback.textContent,
        point: val.point
      });

      // 0.5초 후 두 번째 단계로 전환
      setTimeout(() => {
        container.innerHTML = '';
        Object.entries(data.step2).forEach(([key2, val2]) => {
          const btn2 = document.createElement('button');
          btn2.className = 'choice-btn';
          btn2.textContent = val2.text;
          btn2.onclick = () => {
            const feedback2 = document.getElementById('feedbackMajor');
            feedback2.className = 'feedback show ' + (val2.correct ? 'correct' : 'wrong');
            feedback2.textContent = val2.correct
              ? "정답이에요! 이런 방식으로 도와주는 것이 가장 효과적이에요."
              : "상대방의 입장을 더 고려해보세요.";

            currentScore += val2.point;
            progress++;
            document.getElementById('currentScore').textContent = currentScore;
            document.getElementById('progressText').textContent = progress;
            document.getElementById('progressBar').style.width = `${(progress / totalSteps) * 100}%`;

            scoreHistory.push({
              key: `major_${major}_step2`,
              choiceKey: key2,
              feedback: feedback2.textContent,
              point: val2.point
            });

            document.getElementById('continueMajor').style.display = 'block';
          };
          container.appendChild(btn2);
        });
        document.querySelector('#major_situation .choice-title').textContent = '🤔 어떤 식으로 도와주는게 좋을까?';
      }, 1000);
    };
    container.appendChild(btn);
  });

  showScreen('major_situation');
}

// --- 최종 리포트 생성 함수 ---
function generateFinalReport() {
    // 최종 점수 표시
    document.getElementById('finalScore').textContent = currentScore;

    // 점수 등급 설정
    const gradeElement = document.getElementById('scoreGrade');
    let grade = '';
    if (currentScore >= 70) grade = '나는... 🏆 시각장애 도움 전문가';
    else if (currentScore >= 50) grade = '나는... 🌟 시각장애인을 배려하는 동반자';
    else if (currentScore >= 30) grade = '나는... 📚 도움 방법을 학습 중인 친구';
    else grade = '나는... 🌱 도움 방법을 알아가는 새싹';
    gradeElement.textContent = grade;

    // scoreHistory에서 맞힌/틀린 항목 추리기
    const goodChoices = scoreHistory.filter(item => item.point > 0);
    const badChoices  = scoreHistory.filter(item => item.point < 0);

    // feedback 텍스트만 뽑아서 최대 3개, 부족하면 빈 문자열로 채우기
    let selectedGoodPoints = goodChoices.map(item => item.feedback).slice(0, 3);
    while (selectedGoodPoints.length < 3) selectedGoodPoints.push('');

    let selectedImprovements = badChoices.map(item => item.feedback).slice(0, 3);
    while (selectedImprovements.length < 3) selectedImprovements.push('');

    // 잘한 점 리스트 렌더링
    const goodPointsList = document.getElementById('goodPoints');
    goodPointsList.innerHTML = '';
    selectedGoodPoints.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;  // 빈 문자열일 경우 빈 <li>가 됩니다
        goodPointsList.appendChild(li);
    });

    // 개선할 점 리스트 렌더링
    const improvementPointsList = document.getElementById('improvementPoints');
    improvementPointsList.innerHTML = '';
    selectedImprovements.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;  // 빈 문자열은 빈 항목으로
        improvementPointsList.appendChild(li);
    });
}


// --- 리포트 다운로드 함수 (이미지 저장) ---
function downloadReport() {
  console.log('▶ downloadReport 호출됨');  // 함수가 호출되는지 확인용
  const today = new Date().toLocaleDateString('ko-KR').replace(/\./g, '-');
  const captureEl = document.getElementById('reportCapture');

  if (typeof html2canvas !== 'function') {
    return alert('html2canvas가 로드되지 않아 이미지 변환을 할 수 없습니다.');
  }

  html2canvas(captureEl, { scale: 2 })
    .then(canvas => {
      // 브라우저 호환성 고려한 다운로드
      if (canvas.toBlob) {
        canvas.toBlob(blob => {
          const link = document.createElement('a');
          link.download = `매십이의하루_체험리포트_${today}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        });
      } else {
        // toBlob 미지원 시 fallback
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `매십이의하루_체험리포트_${today}.png`;
        link.href = dataURL;
        link.click();
      }
    })
    .catch(err => {
      console.error('이미지 변환 실패:', err);
      alert('이미지 저장에 실패했습니다.');
    });
}

// --- 트위터 공유 (Intent URL) ---
function shareToTwitter() {
  const gradeText = document.getElementById('scoreGrade').textContent;
  const message = encodeURIComponent(
    `🌟 매십이의 하루 체험 완료!\n\n` +
    `나는 '${gradeText}'였어요.\n` +
    `어려운 상황을 보면 바로 나서서 도움을 주려고 하는 따뜻한 마음을 가지고 있어요. ` +
    `때로는 먼저 물어보는 것도 좋답니다!\n\n` +
    `너도 체험해봐! 👇\nhttps://changemkr.vercel.app/`
  );
  const url = encodeURIComponent('https://changemkr.vercel.app/');
  window.open(
    `https://twitter.com/intent/tweet?text=${message}&url=${url}`,
    '_blank'
  );
}

// --- 범용 공유 (Web Share API / 클립보드 fallback) ---
function shareToKakao() {
  const gradeText = document.getElementById('scoreGrade').textContent;
  const shareText =
    `🌟 매십이의 하루 체험 완료!\n\n` +
    `나는 '${gradeText}'였어요.\n` +
    `어려운 상황을 보면 바로 나서서 도움을 주려고 하는 따뜻한 마음을 가지고 있어요. ` +
    `때로는 먼저 물어보는 것도 좋답니다!\n\n` +
    `너도 체험해봐!\nhttps://changemkr.vercel.app/`;

  if (navigator.share) {
    navigator.share({
      title: '매십이의 하루 체험 완료',
      text: shareText,
      url: 'https://changemkr.vercel.app/'
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(shareText)
      .then(() => alert('공유 메시지가 클립보드에 복사되었습니다!'));
  }
}

// --- DOMContentLoaded 이벤트로 초기화 ---
// (현재 MakeChoice, ShowScreen, SelectMajor 함수는 HTML 이벤트 핸들러에서 직접 호출되므로 별도 추가 필요 없음)
document.addEventListener('DOMContentLoaded', () => {
  // 진행도 바 초기 세팅
  document.getElementById('progressText').textContent = progress;
  document.getElementById('progressBar').style.width = `0%`;
});

document.getElementById('twitterShareBtn')
  .addEventListener('click', shareToTwitter);
document.getElementById('nativeShareBtn')
  .addEventListener('click', shareToKakao);
