/* ============================================================
   «КИРОВЕЦ» — логика квиза о Петербургском тракторном заводе
   ============================================================ */

(() => {
  'use strict';

  /* ------------------------------------------------------------
     НАСТРОЙКИ
     1. Создайте Google Таблицу и веб-приложение Apps Script
        (подробная инструкция — в SETUP.md).
     2. Вставьте URL веб-приложения, который заканчивается на /exec,
        в поле sheetsEndpoint ниже.
     Пока поле пустое, сайт работает в демо-режиме и сохраняет
     результаты только в localStorage браузера.
     ------------------------------------------------------------ */
  const CONFIG = {
    sheetsEndpoint: 'https://script.google.com/macros/s/AKfycbxJpSA0PcGrMT_8-bzvmIGfGgDxH8VCNSudrNrQCr0Fo8cfDjh20DT_fuMHVGZg3AaI/exec',
    quizTitle: 'КИРОВЕЦ',
    requireContact: true,
  };

  /* ------------------------------------------------------------
     ВОПРОСЫ
     correct — индекс правильного варианта, начиная с нуля.
     Замените этот массив на свои вопросы — всё остальное
     (подсчёт, разбор, отправка) подстроится автоматически.
     ------------------------------------------------------------ */
  const QUESTIONS = [
    {
      q: 'В каком городе началась история завода, где сегодня делают «Кировец»?',
      options: ['Златоуст', 'Сормово', 'Кронштадт', 'Тула'],
      correct: 2,
      explain:
        'Кронштадтский чугунолитейный завод построили в 1789 году, а в 1801-м перевели в Санкт-Петербург. От этой точки отсчитывает историю Кировский завод.',
    },
    {
      q: 'В 1824 году сильнейшее наводнение почти разрушило завод. В какой поэме Пушкин описал это бедствие?',
      options: ['«Медный всадник»', '«Евгений Онегин»', '«Полтава»', '«Пиковая дама»'],
      correct: 0,
      explain:
        'Наводнение 7 (19) ноября 1824 года стало одним из самых разрушительных в истории Петербурга. Пушкин описал его во вступлении к «Медному всаднику».',
    },
    {
      q: 'В 1868 году Путилов предложил правительству поставлять продукцию по твёрдой цене — 1 рубль 88 копеек за пуд. Что именно он обязался производить?',
      options: ['Паровозы', 'Железнодорожные рельсы', 'Пушки', 'Тракторы'],
      correct: 1,
      explain:
        'При Путилове завод стал одним из главных поставщиков рельсов для железных дорог России, а также выпускал сталь, боеприпасы и вагоны. Тракторы здесь начнут делать только в XX веке.',
    },
    {
      q: 'В 1924 году завод начал выпускать трактор. Как он назывался?',
      options: ['«Кировец»', '«Универсал»', '«Фордзон-Путиловец»', '«Сталинец»'],
      correct: 2,
      explain:
        '«Фордзон-Путиловец» — локализованная версия американского Fordson. Именно с неё началось массовое тракторостроение в СССР. Имя «Кировец» появится только в 1962 году.',
    },
    {
      q: 'Осенью 1941 года завод эвакуировали в Челябинск, где вместе с Челябинским тракторным заводом и еще шестью передислоцированными предприятиями образовали "Кировский завод Наркомата танковой промышленности в городе Челябинске". Однако завод приобрел известность под другим названием. Какое имя получил этот гигант?',
      options: ['Танкоград', 'Кировград', 'Трактороград', 'Уралмаш'],
      correct: 0,
      explain:
        'Официальное название было длинным, а в историю предприятие вошло как Танкоград. Там выпускали танки КВ, ИС и Т-34.',
    },
    {
      q: 'Какой тяжёлый танк, созданный в 1945 году, не успел повоевать, но прошёл в Берлинском параде союзных войск?',
      options: ['КВ-85', 'ИС-3', 'ИС-7', 'Т-34'],
      correct: 1,
      explain:
        'ИС-3 разработали на Кировском заводе в Челябинске. В боях Великой Отечественной он не участвовал, зато 7 сентября 1945 года прошёл по Берлину на параде союзных войск.',
    },
    {
      q: 'В 1961 году для нового колёсного трактора создали КБ-3. Кто его возглавил?',
      options: ['Жозеф Котин', 'Исаак Зальцман', 'Манфред Казак', 'Виталий Поляченко'],
      correct: 3,
      explain:
        'Виталия Поляченко называют отцом «Кировца». Первый К-700 собрали 13 июля 1962 года, а на конвейер он встал в сентябре 1964-го.',
    },
    {
      q: 'Что произошло на заводе в 1975 году?',
      options: [
        'Собрали 100-тысячный К-700 и начали выпускать К-701',
        'Собрали 200-тысячный трактор',
        'Выпустили первый «Кировец»',
        'Полностью перешли на танки',
      ],
      correct: 0,
      explain:
        'Стотысячный К-700 и новый К-701 на 300 л.с. совпали в 1975 году. Двухсоттысячный трактор собрали в 1980-м, трёхсоттысячный — в 1985-м.',
    },
    {
      q: 'Какую роль сыграл Жозеф Котин в создании «Кировца»?',
      options: [
        'Лично возглавлял КБ-3',
        'Занимался только танками',
        'Курировал проект как главный конструктор завода',
        'Придумал название «Кировец»',
      ],
      correct: 2,
      explain:
        'Котин был главным конструктором Кировского завода с 1937 года и отвечал за тракторное направление.',
    },
    {
      q: 'Что умеет «КИРОВЕЦ-АГРОМОНИТОР»?',
      options: [
        'Управляет трактором без водителя',
        'Следит за параметрами трактора и передаёт данные',
        'Заменяет двигатель',
        'Раздаёт корм животным',
      ],
      correct: 1,
      explain:
        '«Агромонитор» — система удалённого контроля: показывает, где работает машина, сколько топлива расходует и какие ошибки появились. Управлять трактором вместо водителя она не умеет.',
    },
    {
      q: 'Какая мощность у флагманского К-7М, который завод начал выпускать в 2023 году?',
      options: ['250 л.с.', '700 л.с.', '90 л.с.', '460 л.с.'],
      correct: 3,
      explain:
        'К-7М в версии на 460 л.с. стал самым мощным трактором российского производства. Масса машины может достигать 22 тонн — это нужно, чтобы реализовать тягу.',
    },
    {
      q: 'Как сотрудники «Петербургского тракторного завода» ласково называют трактор «Кировец»?',
      options: ['Кирюша', 'Кирочка', 'Кириешка', 'Гаврюша'],
      correct: 0,
      explain: '',
    },
    {
      q: 'В 2023 году в Курганской области открыли мемориал трактору К-700А. Сколько лет этот трактор проработал без капитального ремонта?',
      options: ['5 лет', '10 лет', '22 года', '40 лет'],
      correct: 2,
      explain:
        'На этом К-700А механизатор Иван Прокопьев отработал 22 года без капремонта и вспахивал около 1800 гектаров за сезон. Мемориал открыли в селе Арсеновка.',
    },
    {
      q: 'У К-7М шарнирно-сочленённая рама. Что это значит?',
      options: [
        'Две секции соединены шарниром и поворачиваются гидравликой',
        'Поворачиваются только задние колеса',
        'Две секции соединены шарниром и поворачиваются за счет поворота самих колес',
        'Секции складываются только для транспортировки',
      ],
      correct: 0,
      explain:
        'Две секции соединены шарниром: гидравлика поворачивает их относительно друг друга. Поэтому огромный трактор разворачивается на удивление компактно.',
    },    {
      q: 'Как звучит слоган бренда «КИРОВЕЦ»?',
      options: [
        '«Сохраняя традиции, создаём будущее»',
        '«Исключительная эффективность»',
        '«Постоянное улучшение»',
        '«Быстрее. Выше. Сильнее.»',
      ],
      correct: 1,
      explain:
        'Слоган «Исключительная эффективность» подчёркивает главное обещание бренда: много работы за меньшее время и с меньшими затратами.',
    },

  ];

  /* ------------------------------------------------------------ */

  const TOTAL = QUESTIONS.length;
  const BEST_KEY = 'kirovets.best';
  const SUBMISSIONS_KEY = 'kirovets.submissions';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const $ = (selector) => document.querySelector(selector);

  const screens = {
    hero: $('#screen-hero'),
    intro: $('#screen-intro'),
    quiz: $('#screen-quiz'),
    results: $('#screen-results'),
  };

  const el = {
    startBtn: $('#startBtn'),
    backToHero: $('#backToHero'),
    form: $('#participantForm'),
    name: $('#name'),
    contact: $('#contact'),
    qCounter: $('#qCounter'),
    qScore: $('#qScore'),
    qLabel: $('#qLabel'),
    questionText: $('#questionText'),
    options: $('#options'),
    progress: $('#progress'),
    progressFill: $('#progressFill'),
    feedback: $('#feedback'),
    feedbackTitle: $('#feedbackTitle'),
    feedbackText: $('#feedbackText'),
    nextBtn: $('#nextBtn'),
    resultScore: $('#resultScore'),
    resultTotal: $('#resultTotal'),
    resultTier: $('#resultTier'),
    resultText: $('#resultText'),
    resultBest: $('#resultBest'),
    resultTime: $('#resultTime'),
    saveStatus: $('#saveStatus'),
    reviewList: $('#reviewList'),
    reviewSummary: $('#reviewSummary'),
    restartBtn: $('#restartBtn'),
    shareBtn: $('#shareBtn'),
    year: $('#year'),
    heroCount: $('#heroCount'),
    headerCount: $('#headerCount'),
    statTotal: $('#statTotal'),
    statTotalLabel: $('#statTotalLabel'),
    questionCard: $('.card--question'),
  };

  const state = {
    participant: { name: '', contact: '' },
    current: 0,
    score: 0,
    answers: [],
    locked: false,
    startedAt: 0,
    finishedAt: 0,
    submitted: false,
    submissionId: '',
    submitting: false,
  };

  let confettiRun = 0;

  /* ============================================================
     УТИЛИТЫ
     ============================================================ */

  function plural(n, forms) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(1, Math.round(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    if (minutes === 0) return `${rest} с`;
    return `${minutes} мин ${String(rest).padStart(2, '0')} с`;
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function readBest() {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch (error) {
      return 0;
    }
  }

  function writeBest(value) {
    try {
      localStorage.setItem(BEST_KEY, String(value));
    } catch (error) {
      /* приватный режим — просто не запоминаем рекорд */
    }
  }

  function saveLocalSubmission(payload) {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const safeList = Array.isArray(list) ? list : [];
      safeList.push(payload);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(safeList.slice(-100)));
    } catch (error) {
      console.warn('Не удалось сохранить демо-результат:', error);
    }
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function isPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15 && /^[+\d\s()\-]+$/.test(value);
  }

  function isContact(value) {
    return isEmail(value) || isPhone(value);
  }

  function getTier(percent) {
    if (percent === 100) {
      return {
        title: 'Главный конструктор',
        text: 'Идеально! Ты знаешь «Кировец» так, будто сам собирал его на конвейере.',
      };
    }
    if (percent >= 80) {
      return {
        title: 'Шеф-механик',
        text: 'Мощный результат! Ещё пара деталей — и можно руководить сборочным цехом.',
      };
    }
    if (percent >= 60) {
      return {
        title: 'Тракторист',
        text: 'Уверенно держишь курс: история и техника завода у тебя в руках.',
      };
    }
    if (percent >= 40) {
      return {
        title: 'Стажёр',
        text: 'Неплохой старт. Загляни в разбор ответов — там спрятаны мощные факты.',
      };
    }
    return {
      title: 'Пассажир',
      text: 'Пока ты в кабине пассажиром. Но это отличный повод узнать, на что способен «Кировец».',
    };
  }

  function syncTotals() {
    const questionWord = plural(TOTAL, ['вопрос', 'вопроса', 'вопросов']);
    if (el.heroCount) el.heroCount.textContent = `${TOTAL} ${questionWord}`;
    if (el.headerCount) el.headerCount.textContent = `${TOTAL} ${questionWord}`;
    if (el.statTotal) el.statTotal.textContent = String(TOTAL);
    if (el.statTotalLabel) el.statTotalLabel.textContent = questionWord;
    if (el.resultTotal) el.resultTotal.textContent = `из ${TOTAL}`;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, node]) => {
      const active = key === name;
      node.hidden = !active;
      node.classList.toggle('is-active', active);
    });
    window.scrollTo(0, 0);
  }

  /* ============================================================
     ПЫЛЬ И ИСКРЫ
     ============================================================ */

  function initDust() {
    const canvas = $('#dust');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let width = 0;
    let height = 0;
    let rafId = null;

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(150, Math.max(55, Math.round((width * height) / 14000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.35,
        base: Math.random() * 0.3 + 0.08,
        amp: Math.random() * 0.18 + 0.03,
        speed: Math.random() * 0.7 + 0.2,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.1,
        vy: Math.random() * 0.06 + 0.015,
        ember: Math.random() < 0.16,
      }));
      paint(performance.now());
    }

    function paint(time) {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y > height + 10) particle.y = -10;

        const twinkle = Math.sin(time * 0.001 * particle.speed + particle.phase) * particle.amp;
        const alpha = Math.max(0.03, Math.min(0.6, particle.base + twinkle));
        ctx.beginPath();
        ctx.fillStyle = particle.ember
          ? `rgba(255, 64, 86, ${(alpha * 0.9).toFixed(3)})`
          : `rgba(255, 225, 205, ${alpha.toFixed(3)})`;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(time) {
      paint(time);
      rafId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (rafId === null && !reduceMotion.matches) {
        rafId = window.requestAnimationFrame(loop);
      }
    }

    function stop() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    build();
    start();

    window.addEventListener('resize', () => {
      stop();
      build();
      start();
    });

    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', () => {
        stop();
        if (reduceMotion.matches) paint(performance.now());
        else start();
      });
    }
  }

  /* ============================================================
     КОНФЕТТИ
     ============================================================ */

  function launchConfetti() {
    if (reduceMotion.matches) return;
    const canvas = $('#confetti');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const run = ++confettiRun;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas.classList.add('is-active');

    const colors = ['#e4002b', '#ff5c5c', '#ffb35c', '#f4efe8', '#8f877f'];
    const originX = width / 2;
    const originY = height * 0.3;

    const parts = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        w: 4 + Math.random() * 7,
        h: 7 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        ttl: 100 + Math.random() * 70,
      };
    });

    let last = performance.now();

    function frame(now) {
      if (run !== confettiRun) return;
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const part of parts) {
        part.life += dt;
        if (part.life >= part.ttl) continue;
        alive = true;

        part.vy += 0.16 * dt;
        part.vx *= Math.pow(0.995, dt);
        part.vy *= Math.pow(0.995, dt);
        part.x += part.vx * dt;
        part.y += part.vy * dt;
        part.rot += part.vr * dt;

        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - part.life / part.ttl);
        ctx.translate(part.x, part.y);
        ctx.rotate(part.rot);
        ctx.fillStyle = part.color;
        ctx.fillRect(-part.w / 2, -part.h / 2, part.w, part.h);
        ctx.restore();
      }

      if (alive) {
        window.requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
        canvas.classList.remove('is-active');
      }
    }

    window.requestAnimationFrame(frame);
  }

  /* ============================================================
     ФОРМА ЗНАКОМСТВА
     ============================================================ */

  function setFieldError(field, hasError) {
    const input = document.getElementById(field);
    const message = document.querySelector(`[data-error-for="${field}"]`);
    if (input) input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    if (message) message.hidden = !hasError;
  }

  function resetFormErrors() {
    ['name', 'contact'].forEach((field) => setFieldError(field, false));
  }

  function openIntro() {
    resetFormErrors();
    showScreen('intro');
    window.setTimeout(() => {
      if (el.name) el.name.focus({ preventScroll: true });
    }, 80);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const name = el.name ? el.name.value.trim() : '';
    const contact = el.contact ? el.contact.value.trim() : '';

    let valid = true;

    if (!name) {
      setFieldError('name', true);
      valid = false;
    } else {
      setFieldError('name', false);
    }

    if (CONFIG.requireContact && !isContact(contact)) {
      setFieldError('contact', true);
      valid = false;
    } else {
      setFieldError('contact', false);
    }

    if (!valid) {
      const firstInvalid = document.querySelector('.field input[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    state.participant = { name, contact };
    startQuiz();
  }

  /* ============================================================
     КВИЗ
     ============================================================ */

  function startQuiz() {
    state.current = 0;
    state.score = 0;
    state.answers = new Array(TOTAL).fill(null);
    state.locked = false;
    state.startedAt = Date.now();
    state.finishedAt = 0;
    state.submitted = false;
    state.submitting = false;
    state.submissionId = makeId();

    showScreen('quiz');
    renderQuestion();
  }

  function updateScoreLabel() {
    if (!el.qScore) return;
    el.qScore.textContent = `${state.score} ${plural(state.score, ['балл', 'балла', 'баллов'])}`;
  }

  function renderQuestion() {
    const question = QUESTIONS[state.current];
    state.locked = false;

    if (el.qCounter) {
      el.qCounter.textContent = `Вопрос ${state.current + 1} из ${TOTAL}`;
    }
    if (el.qLabel) {
      el.qLabel.textContent = `Вопрос ${String(state.current + 1).padStart(2, '0')}`;
    }
    if (el.questionText) {
      el.questionText.textContent = question.q;
    }

    updateScoreLabel();

    if (el.progress) {
      el.progress.setAttribute('aria-valuemax', String(TOTAL));
      el.progress.setAttribute('aria-valuenow', String(state.current + 1));
    }
    if (el.progressFill) {
      el.progressFill.style.width = `${((state.current + 1) / TOTAL) * 100}%`;
    }

    if (el.feedback) {
      el.feedback.hidden = true;
      el.feedback.classList.remove('is-correct', 'is-wrong');
    }
    if (el.nextBtn) {
      el.nextBtn.textContent =
        state.current === TOTAL - 1 ? 'Показать результат →' : 'Следующий вопрос →';
    }

    if (el.options) {
      el.options.replaceChildren();
      question.options.forEach((text, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option';
        button.dataset.index = String(index);

        const key = document.createElement('span');
        key.className = 'option__key';
        key.setAttribute('aria-hidden', 'true');
        key.textContent = String(index + 1);

        const label = document.createElement('span');
        label.className = 'option__text';
        label.textContent = text;

        const mark = document.createElement('span');
        mark.className = 'option__mark';
        mark.setAttribute('aria-hidden', 'true');

        button.append(key, label, mark);
        button.addEventListener('click', () => selectAnswer(index));
        el.options.append(button);
      });
    }

    if (el.questionCard) {
      el.questionCard.classList.remove('is-swapping');
      void el.questionCard.offsetWidth;
      el.questionCard.classList.add('is-swapping');
    }

    if (el.questionText) {
      el.questionText.focus({ preventScroll: true });
    }
  }

  function selectAnswer(index) {
    if (state.locked) return;
    const question = QUESTIONS[state.current];
    if (index < 0 || index >= question.options.length) return;

    state.locked = true;
    state.answers[state.current] = index;

    const isCorrect = index === question.correct;
    if (isCorrect) state.score += 1;

    updateScoreLabel();

    if (el.options) {
      const buttons = el.options.querySelectorAll('.option');
      buttons.forEach((button, optionIndex) => {
        button.disabled = true;
        const mark = button.querySelector('.option__mark');

        if (optionIndex === question.correct) {
          button.classList.add('is-correct');
          if (mark) mark.textContent = '✓';
        } else if (optionIndex === index) {
          button.classList.add('is-wrong');
          if (mark) mark.textContent = '✕';
        } else {
          button.classList.add('is-dim');
        }
      });
    }

    if (el.feedbackTitle) {
      el.feedbackTitle.textContent = isCorrect ? 'Верно!' : 'Не совсем';
    }
    if (el.feedbackText) {
      el.feedbackText.textContent = question.explain;
    }
    if (el.feedback) {
      el.feedback.classList.toggle('is-correct', isCorrect);
      el.feedback.classList.toggle('is-wrong', !isCorrect);
      el.feedback.hidden = false;
    }

    if (el.progress) {
      el.progress.setAttribute('aria-valuenow', String(state.current + 1));
    }
  }

  function nextQuestion() {
    if (!state.locked) return;
    if (state.current >= TOTAL - 1) {
      finishQuiz();
      return;
    }
    state.current += 1;
    renderQuestion();
  }

  function finishQuiz() {
    state.finishedAt = Date.now();
    showResults();
  }

  /* ============================================================
     РЕЗУЛЬТАТ
     ============================================================ */

  function showResults() {
    const percent = Math.round((state.score / TOTAL) * 100);
    const tier = getTier(percent);
    const durationSeconds = Math.max(
      1,
      Math.round(((state.finishedAt || Date.now()) - state.startedAt) / 1000)
    );

    const previousBest = readBest();
    const isNewBest = state.score > previousBest;
    if (isNewBest) writeBest(state.score);

    if (el.resultScore) el.resultScore.textContent = String(state.score);
    if (el.resultTotal) el.resultTotal.textContent = `из ${TOTAL}`;
    if (el.resultTier) el.resultTier.textContent = tier.title;
    if (el.resultText) el.resultText.textContent = tier.text;
    if (el.resultTime) el.resultTime.textContent = `Время прохождения: ${formatDuration(durationSeconds)}`;

    if (el.resultBest) {
      if (isNewBest && state.score > 0) {
        el.resultBest.textContent = 'Новый лучший результат на этом устройстве!';
      } else if (previousBest > 0) {
        el.resultBest.textContent = `Лучший результат на этом устройстве: ${previousBest} из ${TOTAL}`;
      } else {
        el.resultBest.textContent = 'Это первый результат на этом устройстве.';
      }
    }

    renderReview();
    animateRing(percent);
    showScreen('results');

    if (el.resultTier) {
      el.resultTier.setAttribute('tabindex', '-1');
      el.resultTier.focus({ preventScroll: true });
    }

    if (percent >= 70) {
      window.setTimeout(launchConfetti, 280);
    }

    submitResults();
  }

  function animateRing(percent) {
    const ring = $('#ringFg');
    if (!ring) return;

    const radius = 76;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);

    ring.style.transition = 'none';
    ring.style.strokeDasharray = String(circumference);
    ring.style.strokeDashoffset = String(circumference);

    if (reduceMotion.matches) {
      ring.style.strokeDashoffset = String(offset);
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        ring.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        ring.style.strokeDashoffset = String(offset);
      });
    });
  }

  function renderReview() {
    if (!el.reviewList) return;
    el.reviewList.replaceChildren();

    QUESTIONS.forEach((question, index) => {
      const selected = state.answers[index];
      const isCorrect = selected === question.correct;

      const item = document.createElement('li');
      item.className = `review-item ${isCorrect ? 'is-correct' : 'is-wrong'}`;

      const icon = document.createElement('span');
      icon.className = 'review-item__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = isCorrect ? '✓' : '✕';

      const body = document.createElement('div');
      body.className = 'review-item__body';

      const questionLine = document.createElement('p');
      questionLine.className = 'review-item__q';
      const number = document.createElement('span');
      number.className = 'review-item__num';
      number.textContent = `${index + 1}.`;
      questionLine.append(number, document.createTextNode(` ${question.q}`));

      const userLine = document.createElement('p');
      userLine.className = 'review-item__answer';
      const userLabel = document.createElement('span');
      userLabel.className = 'label';
      userLabel.textContent = 'Твой ответ:';
      userLine.append(
        userLabel,
        document.createTextNode(
          ` ${selected === null || selected === undefined ? '—' : question.options[selected]}`
        )
      );

      body.append(questionLine, userLine);

      if (!isCorrect) {
        const correctLine = document.createElement('p');
        correctLine.className = 'review-item__answer review-item__answer--correct';
        const correctLabel = document.createElement('span');
        correctLabel.className = 'label';
        correctLabel.textContent = 'Правильно:';
        correctLine.append(correctLabel, document.createTextNode(` ${question.options[question.correct]}`));
        body.append(correctLine);
      }

      if (question.explain) {
        const explain = document.createElement('p');
        explain.className = 'review-item__explain';
        explain.textContent = question.explain;
        body.append(explain);
      }

      item.append(icon, body);
      el.reviewList.append(item);
    });

    if (el.reviewSummary) {
      el.reviewSummary.textContent = `Правильно: ${state.score} из ${TOTAL}`;
    }
  }

  /* ============================================================
     ОТПРАВКА В GOOGLE ТАБЛИЦУ
     ============================================================ */

  function buildPayload() {
    const finished = state.finishedAt || Date.now();
    return {
      id: state.submissionId,
      quiz: CONFIG.quizTitle,
      name: state.participant.name,
      contact: state.participant.contact,
      score: state.score,
      total: TOTAL,
      percent: Math.round((state.score / TOTAL) * 100),
      startedAt: new Date(state.startedAt).toISOString(),
      finishedAt: new Date(finished).toISOString(),
      durationSec: Math.max(1, Math.round((finished - state.startedAt) / 1000)),
      answers: QUESTIONS.map((question, index) => {
        const selected = state.answers[index];
        return {
          index: index + 1,
          question: question.q,
          selected: selected === null || selected === undefined ? '' : question.options[selected],
          correct: question.options[question.correct],
          isCorrect: selected === question.correct,
        };
      }),
    };
  }

  function renderSaveStatus(kind) {
    if (!el.saveStatus) return;
    el.saveStatus.hidden = false;
    el.saveStatus.dataset.state = kind;
    el.saveStatus.replaceChildren();

    if (kind === 'saving') {
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      el.saveStatus.append(spinner, document.createTextNode('Сохраняем результат…'));
      return;
    }

    if (kind === 'saved') {
      el.saveStatus.append(document.createTextNode('✓ Результат сохранён в таблице'));
      return;
    }

    if (kind === 'demo') {
      el.saveStatus.append(
        document.createTextNode('◐ Демо-режим: сохранено в этом браузере')
      );
      return;
    }

    el.saveStatus.append(document.createTextNode('Не удалось отправить результат. '));
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'status-btn';
    retry.textContent = 'Повторить';
    retry.addEventListener('click', () => {
      state.submitted = false;
      submitResults();
    });
    el.saveStatus.append(retry);
  }

  async function submitResults() {
    if (state.submitted || state.submitting) return;
    state.submitting = true;
    renderSaveStatus('saving');

    const payload = buildPayload();
    const endpoint = String(CONFIG.sheetsEndpoint || '').trim();

    if (!endpoint) {
      saveLocalSubmission(payload);
      state.submitted = true;
      state.submitting = false;
      renderSaveStatus('demo');
      return;
    }

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      state.submitted = true;
      renderSaveStatus('saved');
    } catch (error) {
      console.error('Не удалось отправить результат:', error);
      renderSaveStatus('error');
    } finally {
      state.submitting = false;
    }
  }

  /* ============================================================
     ПОДЕЛИТЬСЯ
     ============================================================ */

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();

    const copied = document.execCommand('copy');
    area.remove();

    if (!copied) throw new Error('Не удалось скопировать текст');
  }

  function flashButton(button, message, original) {
    button.textContent = message;
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 2200);
  }

  async function shareResult() {
    const link = /^https?:$/.test(window.location.protocol) ? window.location.href : '';
    const text = `Мой результат в квизе «${CONFIG.quizTitle}»: ${state.score} из ${TOTAL}. А сколько наберёшь ты?${link ? ` ${link}` : ''}`;
    const original = el.shareBtn.textContent;

    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: `Квиз «${CONFIG.quizTitle}»`, text });
          return;
        } catch (shareError) {
          if (shareError && shareError.name === 'AbortError') return;
        }
      }
      await copyText(text);
      flashButton(el.shareBtn, 'Скопировано ✓', original);
    } catch (error) {
      console.warn('Не удалось поделиться результатом:', error);
      flashButton(el.shareBtn, 'Не получилось :(', original);
    }
  }

  /* ============================================================
     КЛАВИАТУРА
     ============================================================ */

  function handleKeydown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (!screens.quiz || screens.quiz.hidden) return;

    const tag = (event.target && event.target.tagName ? event.target.tagName : '').toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';

    if (event.key === 'Enter') {
      if (state.locked) {
        event.preventDefault();
        nextQuestion();
      }
      return;
    }

    if (!isTyping && !state.locked && /^[1-9]$/.test(event.key)) {
      const index = Number(event.key) - 1;
      const question = QUESTIONS[state.current];
      if (question && index < question.options.length) {
        event.preventDefault();
        selectAnswer(index);
      }
    }
  }

  /* ============================================================
     ИНИЦИАЛИЗАЦИЯ
     ============================================================ */

  function init() {
    if (el.year) el.year.textContent = String(new Date().getFullYear());

    syncTotals();
    initDust();

    if (el.startBtn) el.startBtn.addEventListener('click', openIntro);
    if (el.backToHero) {
      el.backToHero.addEventListener('click', () => {
        showScreen('hero');
      });
    }
    if (el.form) el.form.addEventListener('submit', handleFormSubmit);
    if (el.nextBtn) el.nextBtn.addEventListener('click', nextQuestion);

    ['name', 'contact'].forEach((field) => {
      const input = document.getElementById(field);
      if (!input) return;
      input.addEventListener('input', () => setFieldError(field, false));
    });

    if (el.restartBtn) {
      el.restartBtn.addEventListener('click', () => {
        if (el.name) el.name.value = '';
        if (el.contact) el.contact.value = '';
        openIntro();
      });
    }

    if (el.shareBtn) el.shareBtn.addEventListener('click', shareResult);
    document.addEventListener('keydown', handleKeydown);
  }

  init();
})();
