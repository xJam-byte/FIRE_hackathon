/**
 * AI Provider — анализ текста тикета через OpenAI GPT-4o-mini.
 */
const config = require('../config');

async function analyze(ticket) {
    if (!config.openaiApiKey) {
        throw new Error('OPENAI_API_KEY не задан в .env');
    }

    const systemPrompt = `Ты — NLP-модуль проекта FIRE (Freedom Intelligent Routing Engine).
Твоя задача: проанализировать текст обращения и вернуть РОВНО один JSON-объект
строго по схеме ниже. Никакого текста, пояснений, markdown, переносов до/после JSON.

Жесткие правила (соответствие ТЗ):
1) ticket_type ТОЛЬКО из списка:
   ["Жалоба","Смена данных","Консультация","Претензия",
    "Неработоспособность приложения","Мошеннические действия","Спам"]

2) sentiment ТОЛЬКО из:
   ["Позитивный","Нейтральный","Негативный"]

3) language ТОЛЬКО из:
   ["RU","KZ","ENG"]
   Если язык не уверен — ставь "RU".

4) priority — целое число 1..10.
   Руководство для оценки:
   - "Мошеннические действия" -> 9-10
   - "Неработоспособность приложения" (не работает/ошибка/не могу войти) -> 7-9
   - "Смена данных" -> 6-8
   - "Жалоба" / "Претензия" -> 6-9 (зависит от остроты)
   - "Консультация" -> 3-6
   - "Спам" -> 1-3
   Если segment = VIP или Priority, то priority не ниже 7.

5) summary:
   - 1–2 предложения, кратко по сути
   - обязательно заканчивается фразой: "Рекомендуется: <одно действие>."
   - без воды, без лишних деталей

6) Гео-нормализация:
   - Ты НЕ выдумываешь координаты.
   - Если координаты нельзя уверенно определить из входных данных — ставь null.
   - Поля client_lat и client_lon должны быть числами или null.

Возвращай только JSON с ключами:
ticket_type, sentiment, priority, language, summary, client_lat, client_lon
Никаких других ключей.

Контекст клиента: сегмент=${ticket.segment}, город=${ticket.city || 'неизвестен'}, область=${ticket.region || 'неизвестна'}, страна=${ticket.country || 'неизвестна'}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.openaiApiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.1,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: ticket.description || '(пустое обращение, только вложение)' },
            ],
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    // Валидация ответа
    const validTypes = ['Жалоба', 'Смена данных', 'Консультация', 'Претензия', 'Неработоспособность приложения', 'Мошеннические действия', 'Спам'];
    const validSentiments = ['Позитивный', 'Нейтральный', 'Негативный'];
    const validLangs = ['RU', 'KZ', 'ENG'];

    return {
        ticket_type: validTypes.includes(parsed.ticket_type) ? parsed.ticket_type : 'Консультация',
        sentiment: validSentiments.includes(parsed.sentiment) ? parsed.sentiment : 'Нейтральный',
        priority: Math.min(Math.max(parseInt(parsed.priority, 10) || 5, 1), 10),
        language: validLangs.includes(parsed.language) ? parsed.language : 'RU',
        summary: parsed.summary || 'Анализ не дал результата.',
        client_lat: typeof parsed.client_lat === 'number' ? parsed.client_lat : null,
        client_lon: typeof parsed.client_lon === 'number' ? parsed.client_lon : null,
    };
}

module.exports = { analyze };
