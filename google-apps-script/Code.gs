/**
 * «КИРОВЕЦ» — приём результатов квиза в Google Таблицу.
 *
 * Как это работает:
 * 1. Сайт отправляет POST-запрос с JSON на URL этого веб-приложения.
 * 2. Скрипт создаёт два листа: «Результаты» и «Ответы».
 * 3. В «Результаты» попадает одна строка на участника,
 *    в «Ответы» — по строке на каждый вопрос.
 *
 * Повторная отправка с тем же id не создаёт дубликат.
 *
 * Подробная инструкция по установке — в файле SETUP.md.
 */

const RESULTS_SHEET = 'Результаты';
const ANSWERS_SHEET = 'Ответы';

const RESULTS_HEADERS = [
  'ID',
  'Дата и время',
  'Имя',
  'Контакт',
  'Баллы',
  'Всего',
  'Процент',
  'Длительность, сек',
];

const ANSWERS_HEADERS = [
  'ID',
  'Дата и время',
  'Имя',
  '№',
  'Вопрос',
  'Ответ участника',
  'Правильный ответ',
  'Верно',
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return respond_({ ok: false, error: 'Пустой запрос' });
    }

    const data = JSON.parse(e.postData.contents);

    if (!data || !data.id || !data.name) {
      return respond_({ ok: false, error: 'Не хватает обязательных полей: id, name' });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const results = ensureSheet_(spreadsheet, RESULTS_SHEET, RESULTS_HEADERS);

    if (idExists_(results, data.id)) {
      return respond_({ ok: true, duplicate: true });
    }

    const answers = ensureSheet_(spreadsheet, ANSWERS_SHEET, ANSWERS_HEADERS);
    const timestamp = Utilities.formatDate(
      new Date(),
      spreadsheet.getSpreadsheetTimeZone(),
      'dd.MM.yyyy HH:mm:ss'
    );

    results.appendRow([
      data.id,
      timestamp,
      data.name || '',
      data.contact || '',
      Number(data.score) || 0,
      Number(data.total) || 0,
      Number(data.percent) || 0,
      Number(data.durationSec) || 0,
    ]);

    const answerList = Array.isArray(data.answers) ? data.answers : [];
    answerList.forEach((answer) => {
      answers.appendRow([
        data.id,
        timestamp,
        data.name || '',
        answer.index || '',
        answer.question || '',
        answer.selected || '—',
        answer.correct || '',
        answer.isCorrect ? 'Да' : 'Нет',
      ]);
    });

    return respond_({ ok: true });
  } catch (error) {
    return respond_({ ok: false, error: String(error) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {
      /* блокировка уже снята */
    }
  }
}

/** Проверка, что веб-приложение развёрнуто и отвечает. */
function doGet() {
  return respond_({
    ok: true,
    message: 'Приём результатов квиза работает. Отправляйте данные методом POST.',
  });
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#ede9fe');
    headerRange.setFontColor('#2e1065');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function idExists_(sheet, id) {
  if (sheet.getLastRow() < 2) return false;

  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
  return ids.createTextFinder(String(id)).matchEntireCell(true).findNext() !== null;
}

function respond_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
