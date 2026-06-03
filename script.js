// 診断項目・質問・診断タイプはここに集約し、後から編集しやすくしています。
const categories = [
  {
    id: "understanding",
    name: "AI理解度",
    description: "AIとは何か、生成AIとは何か、ChatGPT以外のAI活用まで理解できているか。",
    questions: [
      "社内で生成AIやChatGPTの基本的な仕組みを理解している人がいる",
      "AIでできること・できないことをある程度理解している"
    ]
  },
  {
    id: "usage",
    name: "現場活用度",
    description: "社員が日常業務でAIを実際に使えているか。",
    questions: [
      "社員が日常業務でAIを活用している",
      "AIを使って資料作成、文章作成、情報整理などを行っている"
    ]
  },
  {
    id: "design",
    name: "業務設計力",
    description: "どの業務にAIを使うべきか整理できているか。",
    questions: [
      "AIを活用できる業務と、人が行うべき業務を整理できている",
      "自社業務の中でAI化できそうな業務を洗い出せている"
    ]
  },
  {
    id: "education",
    name: "教育・定着力",
    description: "社員にAIを教える仕組みや、継続的に使う体制があるか。",
    questions: [
      "社員向けにAIの使い方を学ぶ機会がある",
      "AI活用が一部の人だけでなく、組織全体に広がる仕組みがある"
    ]
  },
  {
    id: "advanced",
    name: "発展・応用力",
    description: "RAG、AIエージェント、自社専用AIなど応用活用に進める状態か。",
    questions: [
      "RAG、AIエージェント、自社専用AIなどの活用に興味がある",
      "単なるChatGPT利用ではなく、業務システムや社内データとの連携も検討している"
    ]
  },
  {
    id: "security",
    name: "AIセキュリティ管理",
    description: "入力禁止情報、社内ルール、利用ポリシーなどが整っているか。",
    questions: [
      "AIに入力してはいけない情報が社内で明確になっている",
      "AI利用に関する社内ルールやガイドラインがある"
    ]
  },
  {
    id: "risk",
    name: "AIリスク理解度",
    description: "ハルシネーション、著作権、情報漏洩、誤情報などのリスクを理解できているか。",
    questions: [
      "AIの回答が必ず正しいわけではないことを社員が理解している",
      "著作権、個人情報、情報漏洩などのリスクを理解してAIを使っている"
    ]
  },
  {
    id: "management",
    name: "経営推進力",
    description: "AI推進担当、AI活用目標、経営層の関与、予算などがあるか。",
    questions: [
      "経営層がAI活用の必要性を理解し、推進している",
      "AI活用を進める担当者や予算、目標がある"
    ]
  }
];

const ratingLabels = {
  1: "まったく当てはまらない",
  2: "あまり当てはまらない",
  3: "どちらともいえない",
  4: "やや当てはまる",
  5: "非常に当てはまる"
};

const typeDefinitions = {
  A: {
    name: "タイプA：AI未着手タイプ",
    description: "AIへの関心はあるものの、社内理解・活用・ルール整備がまだ進んでいない状態です。まずはAIの基礎理解と安全な使い方を社内で整えることが重要です。"
  },
  B: {
    name: "タイプB：個人任せタイプ",
    description: "一部の社員はAIを使えている一方で、会社全体の活用ルールや定着の仕組みが整っていない状態です。属人的なAI活用から、組織的なAI活用へ進める必要があります。"
  },
  C: {
    name: "タイプC：導入停滞タイプ",
    description: "AIへの理解や関心はあるものの、実際の業務活用まで落とし込めていない状態です。自社業務に合わせたAI活用設計が必要です。"
  },
  D: {
    name: "タイプD：セキュリティ不安タイプ",
    description: "AI活用を進める上で、情報漏洩・誤情報・著作権・個人情報管理などのリスク対策が不足している可能性があります。安全にAIを使うためのルール整備が必要です。"
  },
  E: {
    name: "タイプE：応用活用準備タイプ",
    description: "基礎的なAI活用は進んでいますが、RAG、AIエージェント、自社専用AIなどの応用活用にはまだ伸びしろがあります。"
  },
  F: {
    name: "タイプF：AI推進企業タイプ",
    description: "AI活用の土台が整っており、今後は部門展開、自社専用AI、AIエージェント活用など、より高度な活用へ進める段階です。"
  }
};

const googleFormConfig = {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc4Xz90dXH70o8OGNrEUw6Jgnzlb68_fvDuu898KA_q6-dTcw/formResponse",
  entries: {
    company: "entry.1477955209",
    name: "entry.435442306",
    department: "entry.1940090297",
    position: "entry.1748700416",
    email: "entry.381459743",
    phone: "entry.1294895389",
    message: "entry.727502749",
    totalScore: "entry.677131340",
    diagnosisType: "entry.837387768",
    hiddenMemo: "entry.349930711",
    categoryScores: "entry.405850628",
    answers: "entry.235368696"
  }
};

let latestResult = null;
let radarChart = null;

const categoryCards = document.getElementById("categoryCards");
const questionsContainer = document.getElementById("questions");
const diagnosisForm = document.getElementById("diagnosisForm");
const contactForm = document.getElementById("contactForm");
const formError = document.getElementById("formError");
const submitMessage = document.getElementById("submitMessage");

function renderCategoryCards() {
  categoryCards.innerHTML = categories.map((category, index) => `
    <article class="info-card">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${category.name}</h3>
      <p>${category.description}</p>
    </article>
  `).join("");
}

function renderQuestions() {
  let questionNumber = 1;

  questionsContainer.innerHTML = categories.map((category) => {
    const questionHtml = category.questions.map((text) => {
      const inputName = `q${questionNumber}`;
      const currentNumber = questionNumber;
      questionNumber += 1;

      return `
        <fieldset class="question-block" data-category="${category.id}">
          <div class="question-meta">
            <span class="question-number">Q${currentNumber}</span>
            <span class="question-category">${category.name}</span>
          </div>
          <legend class="question-text">${text}</legend>
          <div class="rating-row">
            ${Object.entries(ratingLabels).map(([value, label]) => `
              <label>
                <input type="radio" name="${inputName}" value="${value}" required>
                <span>${value}：${label}</span>
              </label>
            `).join("")}
          </div>
        </fieldset>
      `;
    }).join("");

    return questionHtml;
  }).join("");
}

function collectAnswers() {
  const answers = {};
  const missingQuestions = [];
  const totalQuestions = categories.reduce((sum, category) => sum + category.questions.length, 0);

  for (let i = 1; i <= totalQuestions; i += 1) {
    const selected = diagnosisForm.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      missingQuestions.push(`Q${i}`);
    } else {
      answers[`q${i}`] = Number(selected.value);
    }
  }

  return { answers, missingQuestions };
}

function calculateScores(answers) {
  const categoryScores = {};
  let questionIndex = 1;

  categories.forEach((category) => {
    const rawScore = category.questions.reduce((sum) => {
      const answer = answers[`q${questionIndex}`] || 0;
      questionIndex += 1;
      return sum + answer;
    }, 0);

    categoryScores[category.id] = {
      name: category.name,
      score: rawScore,
      max: 10
    };
  });

  const averageOutOfTen = Object.values(categoryScores).reduce((sum, item) => sum + item.score, 0) / categories.length;
  const totalScore = Math.round(averageOutOfTen * 10);

  return { categoryScores, totalScore };
}

function chooseDiagnosisType(totalScore, scores) {
  const low = (id, threshold = 5) => scores[id].score <= threshold;
  const high = (id, threshold = 7) => scores[id].score >= threshold;

  if (totalScore < 30) return typeDefinitions.A;
  if (totalScore >= 80) return typeDefinitions.F;
  if (totalScore >= 70 && low("advanced", 6)) return typeDefinitions.E;
  if (high("usage") && (low("education") || low("security"))) return typeDefinitions.B;
  if (high("understanding") && (low("usage") || low("design"))) return typeDefinitions.C;
  if (low("security") || low("risk")) return typeDefinitions.D;

  return {
    name: "バランス改善タイプ",
    description: "AI活用の基礎は見え始めていますが、項目ごとのばらつきがあります。低い項目から順に整備し、ルールづくりや現場での活用設計を進めることが有効です。"
  };
}

function buildIssues(scores) {
  const sortedScores = Object.values(scores).sort((a, b) => a.score - b.score);
  const lowScores = sortedScores.filter((item) => item.score <= 5);
  const issueTargets = lowScores.length ? lowScores : sortedScores.slice(0, 3);

  return issueTargets.map((item) => `${item.name}が${item.score}/10点です。優先的に改善すると、AI活用の定着につながります。`);
}

function renderResults(result) {
  document.getElementById("results").hidden = false;
  document.getElementById("totalScore").textContent = result.totalScore;
  document.getElementById("diagnosisType").textContent = result.type.name;
  document.getElementById("typeDescription").textContent = result.type.description;

  document.getElementById("currentIssues").innerHTML = result.issues.map((issue) => `<li>${issue}</li>`).join("");

  document.getElementById("scoreCards").innerHTML = Object.values(result.categoryScores).map((item) => `
    <article class="score-card">
      <div class="score-top">
        <span>${item.name}</span>
        <strong>${item.score}/10</strong>
      </div>
      <div class="score-bar" aria-hidden="true"><span style="width: ${item.score * 10}%"></span></div>
    </article>
  `).join("");

  renderRadarChart(result.categoryScores);
  document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderRadarChart(categoryScores) {
  const canvas = document.getElementById("radarChart");

  if (typeof Chart === "undefined") {
    drawFallbackRadarChart(canvas, categoryScores);
    return;
  }

  if (radarChart) {
    radarChart.destroy();
  }

  radarChart = new Chart(canvas, {
    type: "radar",
    data: {
      labels: Object.values(categoryScores).map((item) => item.name),
      datasets: [{
        label: "AI活用レベル",
        data: Object.values(categoryScores).map((item) => item.score),
        fill: true,
        backgroundColor: "rgba(23, 105, 224, 0.18)",
        borderColor: "#1769e0",
        pointBackgroundColor: "#1aa6a6",
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "#1769e0"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2
          },
          pointLabels: {
            color: "#172033",
            font: {
              size: 12,
              weight: "700"
            }
          },
          grid: {
            color: "#dbe5f2"
          },
          angleLines: {
            color: "#dbe5f2"
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// CDNが使えないローカル環境でも診断結果が見えるように、canvasで簡易レーダーを描画します。
function drawFallbackRadarChart(canvas, categoryScores) {
  const ctx = canvas.getContext("2d");
  const scores = Object.values(categoryScores);
  const size = Math.min(canvas.width, canvas.height);
  const center = size / 2;
  const radius = size * 0.34;
  const labelRadius = size * 0.43;
  const angleStep = (Math.PI * 2) / scores.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate((canvas.width - size) / 2, (canvas.height - size) / 2);
  ctx.font = "700 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let level = 1; level <= 5; level += 1) {
    const levelRadius = radius * (level / 5);
    ctx.beginPath();
    scores.forEach((_, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const x = center + Math.cos(angle) * levelRadius;
      const y = center + Math.sin(angle) * levelRadius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = "#dbe5f2";
    ctx.stroke();
  }

  scores.forEach((item, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const lineX = center + Math.cos(angle) * radius;
    const lineY = center + Math.sin(angle) * radius;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(lineX, lineY);
    ctx.strokeStyle = "#dbe5f2";
    ctx.stroke();
    ctx.fillStyle = "#172033";
    ctx.fillText(item.name, labelX, labelY);
  });

  ctx.beginPath();
  scores.forEach((item, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const pointRadius = radius * (item.score / 10);
    const x = center + Math.cos(angle) * pointRadius;
    const y = center + Math.sin(angle) * pointRadius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(23, 105, 224, 0.18)";
  ctx.strokeStyle = "#1769e0";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function saveLead(payload) {
  const previousLeads = JSON.parse(localStorage.getItem("aiDiagnosisLeads") || "[]");
  const nextLeads = [...previousLeads, payload];
  localStorage.setItem("aiDiagnosisLeads", JSON.stringify(nextLeads));
  console.log("AI診断LP 送信内容", payload);
}

function appendHiddenField(form, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.appendChild(input);
}

function formatCategoryScores(result) {
  if (!result) return "未診断";

  return Object.values(result.categoryScores)
    .map((item) => `${item.name}: ${item.score}/10`)
    .join("\n");
}

function formatAnswers(result) {
  if (!result) return "未診断";

  let questionNumber = 1;
  return categories.flatMap((category) => category.questions.map((question) => {
    const answer = result.answers[`q${questionNumber}`];
    const line = `Q${questionNumber}. ${question}：${answer}（${ratingLabels[answer]}）`;
    questionNumber += 1;
    return line;
  })).join("\n");
}

function submitToGoogleForm(payload) {
  const iframeName = "googleFormSubmitFrame";
  let iframe = document.querySelector(`iframe[name="${iframeName}"]`);

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.hidden = true;
    document.body.appendChild(iframe);
  }

  const form = document.createElement("form");
  form.action = googleFormConfig.actionUrl;
  form.method = "POST";
  form.target = iframeName;
  form.style.display = "none";

  const entries = googleFormConfig.entries;
  const result = payload.diagnosisResult;
  const contact = payload.contact;

  appendHiddenField(form, entries.company, contact.company || "未入力");
  appendHiddenField(form, entries.name, contact.name || "未入力");
  appendHiddenField(form, entries.department, contact.department || "未入力");
  appendHiddenField(form, entries.position, contact.position || "未入力");
  appendHiddenField(form, entries.email, contact.email || "未入力");
  appendHiddenField(form, entries.phone, contact.phone || "未入力");
  appendHiddenField(form, entries.message, contact.message || "未入力");
  appendHiddenField(form, entries.totalScore, result ? `${result.totalScore}/100` : "未診断");
  appendHiddenField(form, entries.diagnosisType, result ? result.type.name : "未診断");
  appendHiddenField(form, entries.hiddenMemo, "LPでは非表示");
  appendHiddenField(form, entries.categoryScores, formatCategoryScores(result));
  appendHiddenField(form, entries.answers, formatAnswers(result));

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function buildDiagnosisOnlyPayload(result) {
  return {
    contact: {
      company: "診断のみ（無料相談フォーム未入力）",
      name: "診断のみ（無料相談フォーム未入力）",
      department: "診断のみ",
      position: "診断のみ",
      email: "no-reply@example.com",
      phone: "診断のみ",
      message: "診断フォーム回答時点で自動送信"
    },
    diagnosisResult: result,
    submittedAt: new Date().toISOString(),
    submissionType: "diagnosis_only"
  };
}

diagnosisForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";

  const { answers, missingQuestions } = collectAnswers();

  if (missingQuestions.length > 0) {
    formError.textContent = `${missingQuestions.join("、")} に回答してください。`;
    return;
  }

  const { categoryScores, totalScore } = calculateScores(answers);
  const type = chooseDiagnosisType(totalScore, categoryScores);
  const issues = buildIssues(categoryScores);

  latestResult = {
    createdAt: new Date().toISOString(),
    answers,
    categoryScores,
    totalScore,
    type,
    issues
  };

  const diagnosisOnlyPayload = buildDiagnosisOnlyPayload(latestResult);
  saveLead(diagnosisOnlyPayload);
  submitToGoogleForm(diagnosisOnlyPayload);
  renderResults(latestResult);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const contact = Object.fromEntries(formData.entries());
  const payload = {
    contact,
    diagnosisResult: latestResult,
    submittedAt: new Date().toISOString()
  };

  saveLead(payload);
  submitToGoogleForm(payload);
  submitMessage.textContent = "送信しました。Googleフォームにも送信し、控えをローカル保存しました。";
  contactForm.reset();
});

renderCategoryCards();
renderQuestions();
