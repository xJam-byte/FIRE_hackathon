// Мок-данные для демонстрации интерфейса FIRE

export interface Ticket {
  id: string;
  clientGuid: string;
  gender: 'М' | 'Ж';
  birthDate: string;
  segment: 'Mass' | 'VIP' | 'Priority';
  description: string;
  country: string;
  region: string;
  city: string;
  street: string;
  house: string;
  // AI-аналитика
  type: string;
  sentiment: 'Позитивный' | 'Нейтральный' | 'Негативный';
  priority: number;
  language: 'RU' | 'KZ' | 'ENG';
  summary: string;
  recommendation: string;
  // Назначение
  assignedManager: string;
  assignedOffice: string;
  status: 'Новое' | 'В обработке' | 'Завершено';
  createdAt: string;
}

export interface Manager {
  id: string;
  fullName: string;
  position: 'Спец' | 'Ведущий спец' | 'Глав спец';
  skills: string[];
  businessUnit: string;
  currentLoad: number;
  maxLoad: number;
  avatar: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  managersCount: number;
  ticketsCount: number;
  lat: number;
  lng: number;
}

// Обращения
export const tickets: Ticket[] = [
  {
    id: 'TK-0001',
    clientGuid: 'a1b2c3d4-e5f6-7890',
    gender: 'М',
    birthDate: '1985-03-15',
    segment: 'VIP',
    description: 'Не могу войти в мобильное приложение, после обновления выдаёт ошибку авторизации. Пробовал переустановить — не помогло.',
    country: 'Казахстан',
    region: 'Алматинская область',
    city: 'Алматы',
    street: 'пр. Абая',
    house: '52',
    type: 'Неработоспособность приложения',
    sentiment: 'Негативный',
    priority: 8,
    language: 'RU',
    summary: 'Ошибка авторизации после обновления мобильного приложения.',
    recommendation: 'Проверить версию приложения, направить в техподдержку для сброса сессии.',
    assignedManager: 'Касымов А.Б.',
    assignedOffice: 'Алматы',
    status: 'В обработке',
    createdAt: '2024-01-15T23:45:00',
  },
  {
    id: 'TK-0002',
    clientGuid: 'b2c3d4e5-f6a7-8901',
    gender: 'Ж',
    birthDate: '1990-07-22',
    segment: 'Mass',
    description: 'Хочу изменить номер телефона, привязанный к счёту. Старый номер больше не активен.',
    country: 'Казахстан',
    region: 'г. Астана',
    city: 'Астана',
    street: 'ул. Мангилик Ел',
    house: '10',
    type: 'Смена данных',
    sentiment: 'Нейтральный',
    priority: 5,
    language: 'RU',
    summary: 'Запрос на смену привязанного номера телефона.',
    recommendation: 'Запросить документы, удостоверяющие личность, и провести смену через Глав спеца.',
    assignedManager: 'Нурланова Г.С.',
    assignedOffice: 'Астана',
    status: 'Новое',
    createdAt: '2024-01-16T01:12:00',
  },
  {
    id: 'TK-0003',
    clientGuid: 'c3d4e5f6-a7b8-9012',
    gender: 'М',
    birthDate: '1978-11-03',
    segment: 'Priority',
    description: 'Менің шотымнан рұқсатсыз ақша алынды. 50,000 теңге. Бұл алаяқтық!',
    country: 'Казахстан',
    region: 'Карагандинская область',
    city: 'Караганда',
    street: 'пр. Бухар-жырау',
    house: '88',
    type: 'Мошеннические действия',
    sentiment: 'Негативный',
    priority: 10,
    language: 'KZ',
    summary: 'Сообщение о несанкционированном списании 50,000 ₸ со счёта.',
    recommendation: 'Немедленно заблокировать счёт, инициировать расследование мошенничества.',
    assignedManager: 'Ахметов Е.К.',
    assignedOffice: 'Астана',
    status: 'В обработке',
    createdAt: '2024-01-16T02:30:00',
  },
  {
    id: 'TK-0004',
    clientGuid: 'd4e5f6a7-b8c9-0123',
    gender: 'Ж',
    birthDate: '1995-05-18',
    segment: 'Mass',
    description: 'I would like to know the interest rates for your deposit products. Can you provide a comparison?',
    country: 'Казахстан',
    region: 'Алматинская область',
    city: 'Алматы',
    street: 'ул. Толе би',
    house: '155',
    type: 'Консультация',
    sentiment: 'Позитивный',
    priority: 3,
    language: 'ENG',
    summary: 'Запрос информации о процентных ставках по депозитам.',
    recommendation: 'Предоставить актуальный перечень депозитов и текущие ставки.',
    assignedManager: 'Жумабаева А.Т.',
    assignedOffice: 'Алматы',
    status: 'Завершено',
    createdAt: '2024-01-16T03:15:00',
  },
  {
    id: 'TK-0005',
    clientGuid: 'e5f6a7b8-c9d0-1234',
    gender: 'М',
    birthDate: '1988-09-07',
    segment: 'VIP',
    description: 'Крайне недоволен обслуживанием. Ожидал 40 минут в очереди, консультант не смог ответить на мои вопросы. Требую связаться с руководством.',
    country: 'Казахстан',
    region: 'г. Астана',
    city: 'Астана',
    street: 'пр. Республики',
    house: '22',
    type: 'Жалоба',
    sentiment: 'Негативный',
    priority: 9,
    language: 'RU',
    summary: 'Жалоба на длительное ожидание (40 мин) и некомпетентное обслуживание.',
    recommendation: 'Связаться с клиентом, принести извинения, привлечь руководителя офиса.',
    assignedManager: 'Касымов А.Б.',
    assignedOffice: 'Астана',
    status: 'В обработке',
    createdAt: '2024-01-16T04:00:00',
  },
  {
    id: 'TK-0006',
    clientGuid: 'f6a7b8c9-d0e1-2345',
    gender: 'Ж',
    birthDate: '2000-12-25',
    segment: 'Mass',
    description: 'asdf jklö wer test spamspam',
    country: 'Казахстан',
    region: 'Алматинская область',
    city: 'Алматы',
    street: '',
    house: '',
    type: 'Спам',
    sentiment: 'Нейтральный',
    priority: 1,
    language: 'RU',
    summary: 'Бессмысленное сообщение, классифицировано как спам.',
    recommendation: 'Игнорировать, не назначать менеджера.',
    assignedManager: '—',
    assignedOffice: '—',
    status: 'Завершено',
    createdAt: '2024-01-16T04:30:00',
  },
  {
    id: 'TK-0007',
    clientGuid: 'a7b8c9d0-e1f2-3456',
    gender: 'М',
    birthDate: '1992-02-14',
    segment: 'Mass',
    description: 'Прошу разъяснить условия получение ипотеки для молодой семьи. Какие документы нужны?',
    country: 'Казахстан',
    region: 'Актюбинская область',
    city: 'Актобе',
    street: 'ул. Маресьева',
    house: '77',
    type: 'Консультация',
    sentiment: 'Позитивный',
    priority: 4,
    language: 'RU',
    summary: 'Запрос о условиях ипотечного кредитования для молодых семей.',
    recommendation: 'Предоставить пакет документов и условия «Баспана Хит».',
    assignedManager: 'Сатпаев Д.М.',
    assignedOffice: 'Астана',
    status: 'Новое',
    createdAt: '2024-01-16T05:00:00',
  },
  {
    id: 'TK-0008',
    clientGuid: 'b8c9d0e1-f2a3-4567',
    gender: 'Ж',
    birthDate: '1983-06-30',
    segment: 'Priority',
    description: 'Мне начислили комиссию за обслуживание карты, хотя мне обещали бесплатное обслуживание. Прошу разобраться и вернуть деньги.',
    country: 'Казахстан',
    region: 'Алматинская область',
    city: 'Алматы',
    street: 'ул. Жандосова',
    house: '44',
    type: 'Претензия',
    sentiment: 'Негативный',
    priority: 7,
    language: 'RU',
    summary: 'Претензия о неправомерном начислении комиссии за обслуживание карты.',
    recommendation: 'Проверить запись о промо-условиях, инициировать возврат средств.',
    assignedManager: 'Жумабаева А.Т.',
    assignedOffice: 'Алматы',
    status: 'В обработке',
    createdAt: '2024-01-16T05:30:00',
  },
  {
    id: 'TK-0009',
    clientGuid: 'c9d0e1f2-a3b4-5678',
    gender: 'М',
    birthDate: '1975-01-20',
    segment: 'VIP',
    description: 'Добрый день! Хочу поблагодарить менеджера Алию за отличное обслуживание. Очень профессионально и приятно.',
    country: 'Казахстан',
    region: 'г. Астана',
    city: 'Астана',
    street: 'пр. Кабанбай батыра',
    house: '62',
    type: 'Консультация',
    sentiment: 'Позитивный',
    priority: 2,
    language: 'RU',
    summary: 'Благодарность сотруднику за профессиональное обслуживание.',
    recommendation: 'Оформить благодарность для менеджера, направить в HR.',
    assignedManager: 'Ахметов Е.К.',
    assignedOffice: 'Астана',
    status: 'Завершено',
    createdAt: '2024-01-16T06:00:00',
  },
  {
    id: 'TK-0010',
    clientGuid: 'd0e1f2a3-b4c5-6789',
    gender: 'Ж',
    birthDate: '1998-04-10',
    segment: 'Mass',
    description: 'Карточкам екі күн бойы тауарларды сатып ала алмаймын. Терминалдарда қате шығады.',
    country: 'Казахстан',
    region: 'Южно-Казахстанская область',
    city: 'Шымкент',
    street: 'ул. Байтурсынова',
    house: '33',
    type: 'Неработоспособность приложения',
    sentiment: 'Негативный',
    priority: 8,
    language: 'KZ',
    summary: 'Невозможность совершать покупки картой — ошибка на POS-терминалах в течение 2 дней.',
    recommendation: 'Проверить статус карты, возможно техническая блокировка. Перевыпуск при необходимости.',
    assignedManager: 'Сатпаев Д.М.',
    assignedOffice: 'Алматы',
    status: 'Новое',
    createdAt: '2024-01-16T06:30:00',
  },
];

// Менеджеры
export const managers: Manager[] = [
  {
    id: 'MGR-001',
    fullName: 'Касымов Арман Бауыржанович',
    position: 'Глав спец',
    skills: ['VIP', 'ENG'],
    businessUnit: 'Астана Главный',
    currentLoad: 5,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-002',
    fullName: 'Нурланова Гульнара Сериковна',
    position: 'Глав спец',
    skills: ['VIP', 'KZ'],
    businessUnit: 'Астана Главный',
    currentLoad: 3,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-003',
    fullName: 'Ахметов Ерлан Кайратович',
    position: 'Ведущий спец',
    skills: ['VIP', 'KZ', 'ENG'],
    businessUnit: 'Астана Главный',
    currentLoad: 7,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-004',
    fullName: 'Жумабаева Айгуль Талгатовна',
    position: 'Ведущий спец',
    skills: ['ENG'],
    businessUnit: 'Алматы Центральный',
    currentLoad: 4,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-005',
    fullName: 'Сатпаев Дамир Муратович',
    position: 'Спец',
    skills: ['KZ'],
    businessUnit: 'Алматы Центральный',
    currentLoad: 6,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-006',
    fullName: 'Бектурова Замира Оразовна',
    position: 'Спец',
    skills: [],
    businessUnit: 'Алматы Центральный',
    currentLoad: 2,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-007',
    fullName: 'Тулеуов Мурат Ержанович',
    position: 'Ведущий спец',
    skills: ['VIP'],
    businessUnit: 'Астана Главный',
    currentLoad: 8,
    maxLoad: 10,
    avatar: '🐢',
  },
  {
    id: 'MGR-008',
    fullName: 'Калиева Динара Болатовна',
    position: 'Спец',
    skills: ['ENG', 'KZ'],
    businessUnit: 'Алматы Центральный',
    currentLoad: 1,
    maxLoad: 10,
    avatar: '🐢',
  },
];

// Офисы
export const offices: Office[] = [
  {
    id: 'OFF-001',
    name: 'Астана Главный',
    address: 'пр. Мангилик Ел, 55/20',
    city: 'Астана',
    managersCount: 4,
    ticketsCount: 24,
    lat: 51.1694,
    lng: 71.4491,
  },
  {
    id: 'OFF-002',
    name: 'Алматы Центральный',
    address: 'ул. Фурманова, 100',
    city: 'Алматы',
    managersCount: 4,
    ticketsCount: 18,
    lat: 43.2220,
    lng: 76.8512,
  },
];

// Статистика для дашборда
export const dashboardStats = {
  totalTickets: 42,
  critical: 8,
  aiProcessed: 38,
  pending: 12,
  byType: [
    { type: 'Консультация', count: 14, color: 'var(--neon-blue)' },
    { type: 'Жалоба', count: 8, color: 'var(--neon-red)' },
    { type: 'Смена данных', count: 5, color: 'var(--neon-purple)' },
    { type: 'Претензия', count: 6, color: 'var(--neon-orange)' },
    { type: 'Неработоспособность', count: 4, color: 'var(--neon-green)' },
    { type: 'Мошенничество', count: 3, color: '#ff0055' },
    { type: 'Спам', count: 2, color: 'var(--text-muted)' },
  ],
  bySentiment: [
    { sentiment: 'Позитивный', count: 10, color: 'var(--neon-green)' },
    { sentiment: 'Нейтральный', count: 18, color: 'var(--neon-blue)' },
    { sentiment: 'Негативный', count: 14, color: 'var(--neon-red)' },
  ],
  managerLoad: managers.map(m => ({
    name: m.fullName.split(' ').slice(0, 2).join(' '),
    load: m.currentLoad,
    max: m.maxLoad,
  })),
};
