export type Tier = "Tier-1" | "Tier-2" | "Tier-3";
export type Role = "Awper" | "Entry" | "IGL" | "Lurk" | "Support";
export type MatchStatus = "upcoming" | "live" | "finished";
export type Lang = "ru" | "uk" | "en";
export type Theme = "light" | "dark";

export type Player = {
  id: string;
  nick: string;
  realName: string;
  role: Role;
  country: string;
  teamId?: string;
  rating: number;
  maps: number;
  kd: number;
  adr: number;
  clutch: number;
  photo?: string;
};

export type Team = {
  id: string;
  name: string;
  tag: string;
  tier: Tier;
  region: string;
  logo: string;
  points: number;
  rankTrend: number;
  wins: number;
  losses: number;
  playerIds: string[];
};

export type Match = {
  id: string;
  teamAId: string;
  teamBId: string;
  status: MatchStatus;
  startsAt: string;
  scoreA: number;
  scoreB: number;
  event: string;
  format: "BO1" | "BO3" | "BO5";
};

export type User = {
  id: string;
  nick: string;
  password: string;
  teamId?: string;
  rating: number;
  matches: number;
};

export type Store = {
  teams: Team[];
  players: Player[];
  matches: Match[];
  users: User[];
};

export const socials = {
  discord: "https://discord.gg/your-efl-link",
  tiktok: "https://www.tiktok.com/@your-efl",
  telegram: "https://t.me/your_efl",
};

export const labels = {
  ru: {
    home: "Главная",
    ratings: "Рейтинги",
    matches: "Матчи",
    admin: "Админ",
    teams: "Команды",
    players: "Игроки",
    overall: "Общий",
    allRoles: "Все роли",
    upcoming: "Не начались",
    live: "Идут",
    finished: "Закончились",
    login: "Войти",
    register: "Регистрация",
    logout: "Выйти",
    cabinet: "Личный кабинет",
    topTeams: "Топ команды",
    topPlayers: "Топ игроки",
    nextMatches: "Ближайшие матчи",
    news: "Лига сегодня",
    points: "Очки",
    trend: "Тренд",
    tier: "Тир",
    role: "Роль",
    rating: "Рейтинг",
    teamProfile: "Профиль команды",
    playerProfile: "Профиль игрока",
    roster: "Состав",
    statistics: "Статистика",
    uploadPhoto: "Загрузить фото",
    uploadLogo: "Загрузить лого",
    add: "Добавить",
    save: "Сохранить",
    edit: "Редактировать",
    delete: "Удалить",
    adminPanel: "Админ панель",
    adminHint: "Админ-панель доступна только после входа администратора.",
    adminLoginHelp: "Войдите через обычную кнопку входа справа сверху.",
    matchEditor: "Матчи",
    teamEditor: "Команды",
    playerEditor: "Игроки",
    userEditor: "Пользователи",
    userTeam: "Команда",
    noTeam: "Без команды",
    social: "Соцсети",
    heroEyebrow: "ЦЕНТР РЕЙТИНГА EFL",
    heroText: "Компактный киберспортивный хаб с матчами, tier-рейтингами, формой игроков и данными лиги под контролем админа.",
    newsItems: ["Фиксация рейтинга недели 42", "Квалификации Academy Cup", "Трансферное окно"],
    newsText: "Свежие обновления расписания EFL, составов и игровой формы.",
    nick: "Ник",
    password: "Пароль",
    realName: "Настоящее имя",
    country: "Страна",
    region: "Регион",
    name: "Название",
    tag: "Тег",
    event: "Ивент",
    scoreA: "Счет A",
    scoreB: "Счет B",
    matchesStat: "Матчи",
    adminOnly: "Только администратор может назначить игрока в команду.",
    authInvalid: "Ник пустой или уже занят",
    authWrong: "Неверный логин или пароль",
  },
  uk: {
    home: "Головна",
    ratings: "Рейтинги",
    matches: "Матчі",
    admin: "Адмін",
    teams: "Команди",
    players: "Гравці",
    overall: "Загальний",
    allRoles: "Усі ролі",
    upcoming: "Не почались",
    live: "Йдуть",
    finished: "Завершились",
    login: "Увійти",
    register: "Реєстрація",
    logout: "Вийти",
    cabinet: "Кабінет",
    topTeams: "Топ команди",
    topPlayers: "Топ гравці",
    nextMatches: "Найближчі матчі",
    news: "Ліга сьогодні",
    points: "Очки",
    trend: "Тренд",
    tier: "Тір",
    role: "Роль",
    rating: "Рейтинг",
    teamProfile: "Профіль команди",
    playerProfile: "Профіль гравця",
    roster: "Склад",
    statistics: "Статистика",
    uploadPhoto: "Завантажити фото",
    uploadLogo: "Завантажити лого",
    add: "Додати",
    save: "Зберегти",
    edit: "Редагувати",
    delete: "Видалити",
    adminPanel: "Адмін панель",
    adminHint: "Адмін-панель доступна тільки після входу адміністратора.",
    adminLoginHelp: "Увійдіть через звичайну кнопку входу справа зверху.",
    matchEditor: "Матчі",
    teamEditor: "Команди",
    playerEditor: "Гравці",
    userEditor: "Користувачі",
    userTeam: "Команда",
    noTeam: "Без команди",
    social: "Соцмережі",
    heroEyebrow: "ЦЕНТР РЕЙТИНГУ EFL",
    heroText: "Компактний кіберспортивний хаб з матчами, tier-рейтингами, формою гравців і даними ліги під контролем адміна.",
    newsItems: ["Фіксація рейтингу тижня 42", "Кваліфікації Academy Cup", "Трансферне вікно"],
    newsText: "Свіжі оновлення розкладу EFL, складів і ігрової форми.",
    nick: "Нік",
    password: "Пароль",
    realName: "Справжнє ім'я",
    country: "Країна",
    region: "Регіон",
    name: "Назва",
    tag: "Тег",
    event: "Івент",
    scoreA: "Рахунок A",
    scoreB: "Рахунок B",
    matchesStat: "Матчі",
    adminOnly: "Тільки адміністратор може призначити гравця в команду.",
    authInvalid: "Нік порожній або вже зайнятий",
    authWrong: "Невірний логін або пароль",
  },
  en: {
    home: "Home",
    ratings: "Ratings",
    matches: "Matches",
    admin: "Admin",
    teams: "Teams",
    players: "Players",
    overall: "Overall",
    allRoles: "All roles",
    upcoming: "Upcoming",
    live: "Live",
    finished: "Finished",
    login: "Login",
    register: "Register",
    logout: "Logout",
    cabinet: "Profile",
    topTeams: "Top teams",
    topPlayers: "Top players",
    nextMatches: "Next matches",
    news: "League today",
    points: "Points",
    trend: "Trend",
    tier: "Tier",
    role: "Role",
    rating: "Rating",
    teamProfile: "Team profile",
    playerProfile: "Player profile",
    roster: "Roster",
    statistics: "Statistics",
    uploadPhoto: "Upload photo",
    uploadLogo: "Upload logo",
    add: "Add",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    adminPanel: "Admin panel",
    adminHint: "Admin panel is available only after administrator login.",
    adminLoginHelp: "Use the normal login button in the top right corner.",
    matchEditor: "Matches",
    teamEditor: "Teams",
    playerEditor: "Players",
    userEditor: "Users",
    userTeam: "Team",
    noTeam: "No team",
    social: "Socials",
    heroEyebrow: "EFL RANKING CENTER",
    heroText: "Compact esports hub with live matches, tier rankings, player form and admin-controlled league data.",
    newsItems: ["Week 42 ranking lock", "Academy Cup qualifiers", "Roster window"],
    newsText: "Fresh EFL schedule updates, roster movement and performance notes.",
    nick: "Nick",
    password: "Password",
    realName: "Real name",
    country: "Country",
    region: "Region",
    name: "Name",
    tag: "Tag",
    event: "Event",
    scoreA: "Score A",
    scoreB: "Score B",
    matchesStat: "Matches",
    adminOnly: "Only an administrator can assign a player to a team.",
    authInvalid: "Nick is empty or already used",
    authWrong: "Wrong login or password",
  },
};

export const seedStore: Store = {
  teams: [
    { id: "t-vitality", name: "Team Vitality", tag: "VIT", tier: "Tier-1", region: "EU", logo: "V", points: 1245, rankTrend: 1, wins: 38, losses: 9, playerIds: ["p-shine", "p-tak", "p-nitori", "p-junyme", "p-yksiupe"] },
    { id: "t-g2", name: "G2 Esports", tag: "G2", tier: "Tier-1", region: "EU", logo: "G2", points: 1180, rankTrend: -2, wins: 34, losses: 13, playerIds: ["p-nexa", "p-hunter", "p-m0nesy", "p-malbs", "p-snax"] },
    { id: "t-heroic", name: "Heroic", tag: "HERO", tier: "Tier-1", region: "EU", logo: "H", points: 1201, rankTrend: 0, wins: 36, losses: 11, playerIds: ["p-tesai", "p-kyxsan", "p-degster", "p-nertz", "p-sjuush"] },
    { id: "t-aurora", name: "Aurora Gaming", tag: "AUR", tier: "Tier-2", region: "CIS", logo: "A", points: 997, rankTrend: 3, wins: 29, losses: 16, playerIds: ["p-lack1", "p-kensi", "p-norwi", "p-deko", "p-clax"] },
    { id: "t-nexus", name: "Nexus", tag: "NXS", tier: "Tier-2", region: "EU", logo: "N", points: 866, rankTrend: -1, wins: 24, losses: 18, playerIds: ["p-ragga", "p-xellow"] },
    { id: "t-forge", name: "Forge Academy", tag: "FRG", tier: "Tier-3", region: "UA", logo: "F", points: 612, rankTrend: 4, wins: 18, losses: 20, playerIds: ["p-rainy", "p-void"] },
  ],
  players: [
    { id: "p-shine", nick: "SHiNE", realName: "Maks Shinev", role: "IGL", country: "UA", teamId: "t-vitality", rating: 1.08, maps: 72, kd: 1.05, adr: 73, clutch: 58 },
    { id: "p-tak", nick: "taK", realName: "Anton Karpenko", role: "Entry", country: "PL", teamId: "t-vitality", rating: 1.16, maps: 72, kd: 1.12, adr: 81, clutch: 51 },
    { id: "p-nitori", nick: "nitori", realName: "Leo Nitori", role: "Support", country: "JP", teamId: "t-vitality", rating: 1.10, maps: 69, kd: 1.08, adr: 76, clutch: 63 },
    { id: "p-junyme", nick: "Junyme", realName: "Juny Min", role: "Lurk", country: "KR", teamId: "t-vitality", rating: 1.19, maps: 75, kd: 1.17, adr: 84, clutch: 68 },
    { id: "p-yksiupe", nick: "yksiupe", realName: "Yki Salo", role: "Awper", country: "FI", teamId: "t-vitality", rating: 1.24, maps: 76, kd: 1.31, adr: 79, clutch: 71 },
    { id: "p-nexa", nick: "nexa", realName: "Nemanja Isakovic", role: "IGL", country: "RS", teamId: "t-g2", rating: 1.03, maps: 68, kd: 1.01, adr: 70, clutch: 46 },
    { id: "p-hunter", nick: "huNter", realName: "Nemanja Kovac", role: "Lurk", country: "BA", teamId: "t-g2", rating: 1.15, maps: 68, kd: 1.13, adr: 82, clutch: 61 },
    { id: "p-m0nesy", nick: "m0NESY", realName: "Ilya Osipov", role: "Awper", country: "RU", teamId: "t-g2", rating: 1.29, maps: 70, kd: 1.36, adr: 83, clutch: 76 },
    { id: "p-malbs", nick: "malbsMd", realName: "Mario Samayoa", role: "Entry", country: "GT", teamId: "t-g2", rating: 1.17, maps: 65, kd: 1.14, adr: 86, clutch: 54 },
    { id: "p-snax", nick: "Snax", realName: "Janusz Pogorzelski", role: "Support", country: "PL", teamId: "t-g2", rating: 1.01, maps: 66, kd: 0.98, adr: 69, clutch: 55 },
    { id: "p-tesai", nick: "TeSeS", realName: "Rene Madsen", role: "Entry", country: "DK", teamId: "t-heroic", rating: 1.11, maps: 64, kd: 1.09, adr: 78, clutch: 52 },
    { id: "p-kyxsan", nick: "kyxsan", realName: "Damjan Stoilkovski", role: "IGL", country: "MK", teamId: "t-heroic", rating: 1.04, maps: 64, kd: 1.0, adr: 71, clutch: 49 },
    { id: "p-degster", nick: "degster", realName: "Abdul Gasanov", role: "Awper", country: "RU", teamId: "t-heroic", rating: 1.21, maps: 63, kd: 1.27, adr: 80, clutch: 69 },
    { id: "p-nertz", nick: "NertZ", realName: "Guy Iluz", role: "Lurk", country: "IL", teamId: "t-heroic", rating: 1.18, maps: 64, kd: 1.15, adr: 84, clutch: 64 },
    { id: "p-sjuush", nick: "sjuush", realName: "Rasmus Beck", role: "Support", country: "DK", teamId: "t-heroic", rating: 1.06, maps: 64, kd: 1.02, adr: 72, clutch: 58 },
    { id: "p-lack1", nick: "Lack1", realName: "Aleksei Golubev", role: "IGL", country: "KZ", teamId: "t-aurora", rating: 1.02, maps: 54, kd: 0.99, adr: 69, clutch: 44 },
    { id: "p-kensi", nick: "KENSI", realName: "Aleksandr Gurkin", role: "Entry", country: "RU", teamId: "t-aurora", rating: 1.13, maps: 54, kd: 1.1, adr: 82, clutch: 53 },
    { id: "p-norwi", nick: "Norwi", realName: "Evgeny Ermolin", role: "Support", country: "RU", teamId: "t-aurora", rating: 1.05, maps: 54, kd: 1.03, adr: 74, clutch: 57 },
    { id: "p-deko", nick: "deko", realName: "Denis Zhukov", role: "Awper", country: "RU", teamId: "t-aurora", rating: 1.2, maps: 52, kd: 1.26, adr: 78, clutch: 66 },
    { id: "p-clax", nick: "clax", realName: "Timur Sabirov", role: "Lurk", country: "RU", teamId: "t-aurora", rating: 1.09, maps: 50, kd: 1.07, adr: 77, clutch: 50 },
    { id: "p-ragga", nick: "ragga", realName: "Radu Muntean", role: "Entry", country: "RO", teamId: "t-nexus", rating: 1.09, maps: 44, kd: 1.04, adr: 79, clutch: 48 },
    { id: "p-xellow", nick: "XELLOW", realName: "Adrian Guta", role: "Awper", country: "RO", teamId: "t-nexus", rating: 1.14, maps: 44, kd: 1.18, adr: 76, clutch: 59 },
    { id: "p-rainy", nick: "rainy", realName: "Oleh Rain", role: "Support", country: "UA", teamId: "t-forge", rating: 0.98, maps: 36, kd: 0.96, adr: 67, clutch: 42 },
    { id: "p-void", nick: "void", realName: "Kyrylo Void", role: "Lurk", country: "UA", teamId: "t-forge", rating: 1.06, maps: 36, kd: 1.02, adr: 73, clutch: 47 },
  ],
  matches: [
    { id: "m1", teamAId: "t-vitality", teamBId: "t-g2", status: "live", startsAt: "2026-06-14T18:30", scoreA: 11, scoreB: 9, event: "EFL Masters", format: "BO3" },
    { id: "m2", teamAId: "t-heroic", teamBId: "t-aurora", status: "upcoming", startsAt: "2026-06-15T19:00", scoreA: 0, scoreB: 0, event: "EFL Challenger", format: "BO3" },
    { id: "m3", teamAId: "t-nexus", teamBId: "t-forge", status: "upcoming", startsAt: "2026-06-16T17:00", scoreA: 0, scoreB: 0, event: "Academy Cup", format: "BO1" },
    { id: "m4", teamAId: "t-g2", teamBId: "t-heroic", status: "finished", startsAt: "2026-06-13T21:00", scoreA: 2, scoreB: 1, event: "EFL Masters", format: "BO3" },
    { id: "m5", teamAId: "t-vitality", teamBId: "t-aurora", status: "finished", startsAt: "2026-06-12T20:00", scoreA: 2, scoreB: 0, event: "EFL Masters", format: "BO3" },
  ],
  users: [],
};
