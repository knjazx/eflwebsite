import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  ChevronRight,
  LogIn,
  MessageCircle,
  Moon,
  Save,
  Shield,
  Sun,
  UserCircle,
  X,
} from "lucide-react";
import logoUrl from "./assets/efl-logo.png";
import {
  labels,
  Lang,
  Match,
  MatchStatus,
  Player,
  Role,
  seedStore,
  socials,
  Store,
  Team,
  Theme,
  Tier,
  User,
} from "./data";

const storeKey = "efl-store-v1";
const sessionKey = "efl-session-v1";
const themeKey = "efl-theme-v1";
const langKey = "efl-lang-v1";
const tiers: ("Overall" | Tier)[] = ["Overall", "Tier-1", "Tier-2", "Tier-3"];
const roles: ("All" | Role)[] = ["All", "Awper", "Entry", "IGL", "Lurk", "Support"];
const statuses: MatchStatus[] = ["upcoming", "live", "finished"];

const blankTeam: Team = { id: "", name: "", tag: "", tier: "Tier-3", region: "EU", logo: "", points: 500, rankTrend: 0, wins: 0, losses: 0, playerIds: [] };
const blankPlayer: Player = { id: "", nick: "", realName: "", role: "Entry", country: "UA", teamId: "", rating: 1, maps: 0, kd: 1, adr: 70, clutch: 0 };
const blankMatch: Match = { id: "", teamAId: "", teamBId: "", status: "upcoming", startsAt: "2026-06-15T18:00", scoreA: 0, scoreB: 0, event: "EFL Match", format: "BO3" };

function readStore(): Store {
  try {
    const raw = localStorage.getItem(storeKey);
    return raw ? JSON.parse(raw) : seedStore;
  } catch {
    return seedStore;
  }
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function fmtDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function isImageLogo(value?: string) {
  return Boolean(value && (/^(data:image|https?:\/\/|\/)/.test(value)));
}

function App() {
  const [store, setStore] = useState<Store>(readStore);
  const [page, setPage] = useState<"home" | "ratings" | "matches" | "admin" | "team" | "player">("home");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>((localStorage.getItem(themeKey) as Theme) || "light");
  const [lang, setLang] = useState<Lang>((localStorage.getItem(langKey) as Lang) || "ru");
  const [session, setSession] = useState<string | null>(localStorage.getItem(sessionKey));
  const [modal, setModal] = useState<{ type: "team" | "player" | "auth" | "cabinet"; id?: string; mode?: "login" | "register" } | null>(null);
  const [socialOpen, setSocialOpen] = useState(false);
  const t = labels[lang];
  const isAdmin = session === "admin";

  useEffect(() => localStorage.setItem(storeKey, JSON.stringify(store)), [store]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(themeKey, theme);
  }, [theme]);
  useEffect(() => localStorage.setItem(langKey, lang), [lang]);
  useEffect(() => {
    session ? localStorage.setItem(sessionKey, session) : localStorage.removeItem(sessionKey);
  }, [session]);

  const teamById = (id?: string) => store.teams.find((team) => team.id === id);
  const playerById = (id?: string) => store.players.find((player) => player.id === id);
  const currentUser = store.users.find((user) => user.nick === session);
  const rankedTeams = [...store.teams].sort((a, b) => b.points - a.points);
  const rankedPlayers = [...store.players].sort((a, b) => b.rating - a.rating);

  function openTeamPage(id: string) {
    setSelectedTeamId(id);
    setSelectedPlayerId(null);
    setPage("team");
  }

  function openPlayerPage(id: string) {
    setSelectedPlayerId(id);
    setSelectedTeamId(null);
    setPage("player");
  }

  function saveTeam(team: Team) {
    const next = { ...team, id: team.id || uid("team"), logo: team.logo || team.tag.slice(0, 2).toUpperCase() };
    setStore((s) => ({
      ...s,
      teams: s.teams.some((item) => item.id === next.id) ? s.teams.map((item) => (item.id === next.id ? next : item)) : [...s.teams, next],
      players: s.players.map((player) => ({ ...player, teamId: next.playerIds.includes(player.id) ? next.id : player.teamId === next.id ? "" : player.teamId })),
    }));
  }

  function savePlayer(player: Player) {
    const next = { ...player, id: player.id || uid("player") };
    setStore((s) => ({
      ...s,
      players: s.players.some((item) => item.id === next.id) ? s.players.map((item) => (item.id === next.id ? next : item)) : [...s.players, next],
      teams: s.teams.map((team) => ({
        ...team,
        playerIds: next.teamId === team.id ? Array.from(new Set([...team.playerIds, next.id])) : team.playerIds.filter((id) => id !== next.id),
      })),
    }));
  }

  function saveMatch(match: Match) {
    const next = { ...match, id: match.id || uid("match") };
    setStore((s) => ({ ...s, matches: s.matches.some((item) => item.id === next.id) ? s.matches.map((item) => (item.id === next.id ? next : item)) : [...s.matches, next] }));
  }

  function deleteItem(kind: "teams" | "players" | "matches", id: string) {
    setStore((s) => ({
      ...s,
      [kind]: s[kind].filter((item) => item.id !== id),
      teams: kind === "players" ? s.teams.map((team) => ({ ...team, playerIds: team.playerIds.filter((pid) => pid !== id) })) : kind === "teams" ? s.teams.filter((team) => team.id !== id) : s.teams,
      players: kind === "teams" ? s.players.map((player) => (player.teamId === id ? { ...player, teamId: "" } : player)) : kind === "players" ? s.players.filter((player) => player.id !== id) : s.players,
    }));
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setPage("home")}>
          <img src={logoUrl} alt="EFL" />
          <span>EFL - Electronic Future League</span>
        </button>
        <nav>
          {(["home", "ratings", "matches"] as const).map((item) => (
            <button className={page === item ? "active" : ""} onClick={() => setPage(item)} key={item}>
              {t[item]}
            </button>
          ))}
          {isAdmin && <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>{t.admin}</button>}
        </nav>
        <div className="tools">
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label="Language">
            <option value="ru">RU</option>
            <option value="uk">UA</option>
            <option value="en">EN</option>
          </select>
          <button className="iconBtn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} title="Theme">
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          {session ? (
            <button className="account" onClick={() => isAdmin ? setPage("admin") : setModal({ type: "cabinet" })}>
              <UserCircle size={17} /> {session}
            </button>
          ) : (
            <>
              <button onClick={() => setModal({ type: "auth", mode: "login" })}>{t.login}</button>
              <button className="primary" onClick={() => setModal({ type: "auth", mode: "register" })}>{t.register}</button>
            </>
          )}
        </div>
      </header>

      <main className="shell page-enter">
        {page === "home" && <Home t={t} teams={rankedTeams} players={rankedPlayers} matches={store.matches} teamById={teamById} openTeam={openTeamPage} openPlayer={openPlayerPage} />}
        {page === "ratings" && <Ratings t={t} teams={rankedTeams} players={rankedPlayers} teamById={teamById} openTeam={openTeamPage} openPlayer={openPlayerPage} />}
        {page === "matches" && <Matches t={t} matches={store.matches} teamById={teamById} openTeam={openTeamPage} />}
        {page === "admin" && <Admin t={t} isAdmin={isAdmin} store={store} setStore={setStore} saveTeam={saveTeam} savePlayer={savePlayer} saveMatch={saveMatch} deleteItem={deleteItem} />}
        {page === "team" && <TeamPage t={t} team={teamById(selectedTeamId || undefined)} players={store.players} openPlayer={openPlayerPage} back={() => setPage("ratings")} />}
        {page === "player" && <PlayerPage t={t} player={playerById(selectedPlayerId || undefined)} team={teamById(playerById(selectedPlayerId || undefined)?.teamId)} isAdmin={isAdmin} updatePlayer={savePlayer} openTeam={openTeamPage} back={() => setPage("ratings")} />}
      </main>

      <div className="socialDock">
        {socialOpen && (
          <div className="socialMenu">
            <a href={socials.discord} target="_blank">Discord</a>
            <a href={socials.tiktok} target="_blank">TikTok</a>
            <a href={socials.telegram} target="_blank">Telegram</a>
          </div>
        )}
        <button className="floatBtn" onClick={() => setSocialOpen(!socialOpen)} title={t.social}><MessageCircle /></button>
      </div>

      {modal?.type === "auth" && <AuthModal t={t} mode={modal.mode || "login"} store={store} setStore={setStore} setSession={setSession} close={() => setModal(null)} />}
      {modal?.type === "cabinet" && currentUser && <Cabinet t={t} user={currentUser} team={teamById(currentUser.teamId)} logout={() => { setSession(null); setModal(null); }} close={() => setModal(null)} />}
    </div>
  );
}

function Home({ t, teams, players, matches, teamById, openTeam, openPlayer }: { t: typeof labels.ru; teams: Team[]; players: Player[]; matches: Match[]; teamById: (id?: string) => Team | undefined; openTeam: (id: string) => void; openPlayer: (id: string) => void }) {
  return (
    <div className="homeGrid">
      <section className="hero">
        <img src={logoUrl} alt="EFL logo" />
        <div>
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1>Electronic Future League</h1>
          <p>{t.heroText}</p>
        </div>
      </section>
      <section className="panel sideMatches">
        <h2>{t.nextMatches}</h2>
        {matches.slice(0, 4).map((match) => <MatchCard key={match.id} t={t} match={match} teamById={teamById} openTeam={openTeam} compact />)}
      </section>
      <section className="panel">
        <h2>{t.topTeams}</h2>
        <RankingTable teams={teams.slice(0, 6)} openTeam={openTeam} t={t} />
      </section>
      <section className="panel">
        <h2>{t.topPlayers}</h2>
        <PlayerRows players={players.slice(0, 6)} teamById={(id) => teams.find((team) => team.id === id)} openPlayer={openPlayer} t={t} />
      </section>
      <section className="panel newsPanel">
        <h2>{t.news}</h2>
        {t.newsItems.map((title, index) => (
          <article key={title} className="newsItem">
            <span>0{index + 1}</span>
            <div><b>{title}</b><p>{t.newsText}</p></div>
            <ChevronRight size={18} />
          </article>
        ))}
      </section>
    </div>
  );
}

function Ratings({ t, teams, players, teamById, openTeam, openPlayer }: { t: typeof labels.ru; teams: Team[]; players: Player[]; teamById: (id?: string) => Team | undefined; openTeam: (id: string) => void; openPlayer: (id: string) => void }) {
  const [mode, setMode] = useState<"teams" | "players">("teams");
  const [tier, setTier] = useState<"Overall" | Tier>("Overall");
  const [role, setRole] = useState<"All" | Role>("All");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const filteredTeams = tier === "Overall" ? teams : teams.filter((team) => team.tier === tier);
  const filteredPlayers = players.filter((player) => {
    const team = teamById(player.teamId);
    return (tier === "Overall" || team?.tier === tier) && (role === "All" || player.role === role);
  });
  return (
    <section className="panel wide">
      <div className="sectionHead">
        <h2>{t.ratings}</h2>
        <Segment value={mode} setValue={setMode} items={[["teams", t.teams], ["players", t.players]]} />
      </div>
      <div className="filters">
        {tiers.map((item) => <button key={item} className={tier === item ? "selected" : ""} onClick={() => setTier(item)}>{item === "Overall" ? t.overall : item}</button>)}
        {mode === "players" && (
          <div className="roleDropdown">
            <button className="selected" onClick={() => setRoleMenuOpen((open) => !open)}>
              {role === "All" ? t.allRoles : role}
              <ChevronDown size={15} />
            </button>
            {roleMenuOpen && (
              <div className="roleMenu">
                {roles.map((item) => (
                  <button
                    key={item}
                    className={role === item ? "current" : ""}
                    onClick={() => {
                      setRole(item);
                      setRoleMenuOpen(false);
                    }}
                  >
                    {item === "All" ? t.allRoles : item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {mode === "teams" ? <RankingTable teams={filteredTeams} openTeam={openTeam} t={t} /> : <PlayerRows players={filteredPlayers} teamById={teamById} openPlayer={openPlayer} t={t} />}
    </section>
  );
}

function Matches({ t, matches, teamById, openTeam }: { t: typeof labels.ru; matches: Match[]; teamById: (id?: string) => Team | undefined; openTeam: (id: string) => void }) {
  const [status, setStatus] = useState<MatchStatus>("upcoming");
  return (
    <section className="panel wide">
      <div className="sectionHead">
        <h2>{t.matches}</h2>
        <Segment value={status} setValue={setStatus} items={statuses.map((item) => [item, t[item]]) as [MatchStatus, string][]} />
      </div>
      <div className="matchGrid">
        {matches.filter((match) => match.status === status).map((match) => <MatchCard key={match.id} t={t} match={match} teamById={teamById} openTeam={openTeam} />)}
      </div>
    </section>
  );
}

function RankingTable({ teams, openTeam, t }: { teams: Team[]; openTeam: (id: string) => void; t: typeof labels.ru }) {
  return (
    <div className="table">
      <div className="row head"><span>#</span><span>{t.teams}</span><span>{t.tier}</span><span>{t.points}</span><span>{t.trend}</span></div>
      {teams.map((team, index) => (
        <button className="row clickable" key={team.id} onClick={() => openTeam(team.id)}>
          <span>{index + 1}.</span><span className="teamCell"><TeamLogo team={team} />{team.name}</span><span>{team.tier}</span><span>{team.points}</span><span className={team.rankTrend >= 0 ? "positive" : "negative"}>{team.rankTrend >= 0 ? `+${team.rankTrend}` : team.rankTrend}</span>
        </button>
      ))}
    </div>
  );
}

function PlayerRows({ players, teamById, openPlayer, t }: { players: Player[]; teamById: (id?: string) => Team | undefined; openPlayer: (id: string) => void; t: typeof labels.ru }) {
  return (
    <div className="table">
      <div className="row head"><span>#</span><span>{t.players}</span><span>{t.role}</span><span>{t.userTeam}</span><span>{t.rating}</span></div>
      {players.map((player, index) => (
        <button className="row clickable" key={player.id} onClick={() => openPlayer(player.id)}>
          <span>{index + 1}.</span><span className="teamCell"><Avatar player={player} />{player.nick}</span><span>{player.role}</span><span>{teamById(player.teamId)?.tag || "-"}</span><span>{player.rating.toFixed(2)}</span>
        </button>
      ))}
    </div>
  );
}

function MatchCard({ t, match, teamById, openTeam, compact }: { t: typeof labels.ru; match: Match; teamById: (id?: string) => Team | undefined; openTeam: (id: string) => void; compact?: boolean }) {
  const a = teamById(match.teamAId);
  const b = teamById(match.teamBId);
  return (
    <article className={`matchCard ${compact ? "compact" : ""}`}>
      <div className="matchMeta"><span className={`status ${match.status}`}>{t[match.status]}</span><span>{match.event}</span><span>{fmtDate(match.startsAt)}</span></div>
      <div className="versus">
        <button onClick={() => a && openTeam(a.id)}>{a && <TeamLogo team={a} />}{a?.name}</button>
        <strong>{match.status === "upcoming" ? "vs" : `${match.scoreA}:${match.scoreB}`}</strong>
        <button onClick={() => b && openTeam(b.id)}>{b && <TeamLogo team={b} />}{b?.name}</button>
      </div>
      <small>{match.format}</small>
    </article>
  );
}

function TeamPage({ t, team, players, openPlayer, back }: { t: typeof labels.ru; team?: Team; players: Player[]; openPlayer: (id: string) => void; back: () => void }) {
  if (!team) return <EmptyProfile t={t} back={back} />;
  const roster = team.playerIds.map((id) => players.find((player) => player.id === id)).filter(Boolean) as Player[];
  const averageRating = roster.length ? (roster.reduce((sum, player) => sum + player.rating, 0) / roster.length).toFixed(2) : "-";
  const averageAdr = roster.length ? Math.round(roster.reduce((sum, player) => sum + player.adr, 0) / roster.length) : "-";
  return (
    <section className="profilePage page-enter">
      <div className="profilePageHead">
        <button className="backBtn" onClick={back}><ArrowLeft size={17} /> {t.ratings}</button>
        <h1>{t.teamProfile}</h1>
      </div>
      <section className="teamShowcase">
        <div className="teamRosterStage">
          {roster.slice(0, 5).map((player) => (
            <button className="playerStand" key={player.id} onClick={() => openPlayer(player.id)}>
              {player.photo ? <img src={player.photo} alt={player.nick} /> : <span className="playerStandFallback">{player.nick.slice(0, 2).toUpperCase()}</span>}
              <strong><span>{player.country}</span>{player.nick}</strong>
            </button>
          ))}
          {Array.from({ length: Math.max(0, 5 - roster.length) }).map((_, index) => (
            <div className="playerStand empty" key={`empty-${index}`}>
              <span className="playerStandFallback">?</span>
              <strong>{t.players}</strong>
            </div>
          ))}
        </div>
        <div className="teamInfoBoard">
          <div className="teamIdentity">
            <TeamLogo team={team} large />
            <div>
              <span className="teamRegion">{team.region}</span>
              <h2>{team.name}</h2>
              <p>{team.tier}</p>
            </div>
          </div>
          <div className="teamRankingStrip">
            <span>{t.points}</span><b>{team.points}</b>
            <span>{t.trend}</span><b className={team.rankTrend >= 0 ? "positive" : "negative"}>{team.rankTrend >= 0 ? `+${team.rankTrend}` : team.rankTrend}</b>
          </div>
          <div className="teamStatLines">
            <div><span>W-L</span><b>{team.wins}-{team.losses}</b></div>
            <div><span>{t.rating}</span><b>{averageRating}</b></div>
            <div><span>ADR</span><b>{averageAdr}</b></div>
            <div><span>{t.roster}</span><b>{roster.length}</b></div>
          </div>
        </div>
      </section>
    </section>
  );
}

function PlayerPage({ t, player, team, isAdmin, updatePlayer, openTeam, back }: { t: typeof labels.ru; player?: Player; team?: Team; isAdmin: boolean; updatePlayer: (player: Player) => void; openTeam: (id: string) => void; back: () => void }) {
  if (!player) return <EmptyProfile t={t} back={back} />;
  const currentPlayer = player;
  function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePlayer({ ...currentPlayer, photo: String(reader.result) });
    reader.readAsDataURL(file);
  }
  return (
    <section className="profilePage page-enter">
      <div className="profilePageHead">
        <button className="backBtn" onClick={back}><ArrowLeft size={17} /> {t.ratings}</button>
        <h1>{t.playerProfile}</h1>
      </div>
      <div className="playerProfilePage">
        <div className="playerPortraitPanel">
          <Avatar player={player} large />
          {isAdmin && <label className="upload"><Camera size={16} /> {t.uploadPhoto}<input type="file" accept="image/*" onChange={upload} /></label>}
        </div>
        <div className="playerInfoBoard">
          <div className="profileHero">
            <div>
              <span className="teamRegion">{player.country}</span>
              <h2>{player.nick}</h2>
              <p>{player.realName}</p>
            </div>
          </div>
          <div className="teamRankingStrip">
            <span>{t.role}</span><b>{player.role}</b>
            <span>{t.userTeam}</span>
            <b>{team ? <button className="inlineLink" onClick={() => openTeam(team.id)}>{team.name}</button> : t.noTeam}</b>
          </div>
          <div className="teamStatLines">
            <div><span>{t.rating}</span><b>{player.rating.toFixed(2)}</b></div>
            <div><span>K/D</span><b>{player.kd.toFixed(2)}</b></div>
            <div><span>ADR</span><b>{player.adr}</b></div>
            <div><span>Maps</span><b>{player.maps}</b></div>
            <div><span>Clutch</span><b>{player.clutch}%</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyProfile({ t, back }: { t: typeof labels.ru; back: () => void }) {
  return <section className="panel adminGate"><h2>{t.playerProfile}</h2><p>{t.noTeam}</p><button className="primary" onClick={back}><ArrowLeft size={17} /> {t.ratings}</button></section>;
}

function AuthModal({ t, mode, store, setStore, setSession, close }: { t: typeof labels.ru; mode: "login" | "register"; store: Store; setStore: (s: Store) => void; setSession: (s: string) => void; close: () => void }) {
  const [form, setForm] = useState({ nick: "", password: "" });
  const [authMode, setAuthMode] = useState(mode);
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (authMode === "login" && form.nick === "admin" && form.password === "adminknjazx") { setSession("admin"); close(); return; }
    if (authMode === "register") {
      if (!form.nick || !form.password || store.users.some((u) => u.nick === form.nick)) { setError(t.authInvalid); return; }
      setStore({ ...store, users: [...store.users, { id: uid("user"), nick: form.nick, password: form.password, rating: 1, matches: 0 }] });
      setSession(form.nick); close(); return;
    }
    const user = store.users.find((u) => u.nick === form.nick && u.password === form.password);
    if (!user) { setError(t.authWrong); return; }
    setSession(user.nick); close();
  }
  return <Modal close={close} title={authMode === "login" ? t.login : t.register}><form className="form" onSubmit={submit}><input placeholder={t.nick} value={form.nick} onChange={(e) => setForm({ ...form, nick: e.target.value })} /><input placeholder={t.password} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{authMode === "register" && <p className="muted">{t.adminOnly}</p>}<button className="primary"><LogIn size={16} /> {authMode === "login" ? t.login : t.register}</button>{error && <p className="error">{error}</p>}<button type="button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? t.register : t.login}</button></form></Modal>;
}

function Cabinet({ t, user, team, logout, close }: { t: typeof labels.ru; user: User; team?: Team; logout: () => void; close: () => void }) {
  return <Modal close={close} title={t.cabinet}><div className="profileHero"><UserCircle size={58} /><div><h2>{user.nick}</h2><p>{t.userTeam}: {team?.name || t.noTeam}</p></div></div><Stats items={[[t.rating, user.rating.toFixed(2)], [t.matchesStat, user.matches], [t.tier, team?.tier || "-"]]} /><button onClick={logout}>{t.logout}</button></Modal>;
}

function Admin({ t, isAdmin, store, setStore, saveTeam, savePlayer, saveMatch, deleteItem }: { t: typeof labels.ru; isAdmin: boolean; store: Store; setStore: (store: Store) => void; saveTeam: (team: Team) => void; savePlayer: (player: Player) => void; saveMatch: (match: Match) => void; deleteItem: (kind: "teams" | "players" | "matches", id: string) => void }) {
  const [tab, setTab] = useState<"teams" | "players" | "matches" | "users">("teams");
  const [team, setTeam] = useState<Team>(blankTeam);
  const [player, setPlayer] = useState<Player>(blankPlayer);
  const [match, setMatch] = useState<Match>(blankMatch);
  function uploadTeamLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTeam((current) => ({ ...current, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  }
  function uploadPlayerPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPlayer((current) => ({ ...current, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  }
  function assignUserTeam(userId: string, teamId: string) {
    const nextUsers = store.users.map((user) => user.id === userId ? { ...user, teamId } : user);
    setStore({ ...store, users: nextUsers });
  }
  if (!isAdmin) return <section className="panel adminGate"><Shield size={36} /><h2>{t.adminPanel}</h2><p>{t.adminHint}</p><p>{t.adminLoginHelp}</p></section>;
  return (
    <section className="panel wide admin">
      <div className="sectionHead"><h2>{t.adminPanel}</h2><Segment value={tab} setValue={setTab} items={[["teams", t.teamEditor], ["players", t.playerEditor], ["matches", t.matchEditor], ["users", t.userEditor]]} /></div>
      {tab === "teams" && <Editor title={t.teamEditor} onSubmit={() => { saveTeam(team); setTeam(blankTeam); }} submit={t.save}><input placeholder={t.name} value={team.name} onChange={(e) => setTeam({ ...team, name: e.target.value })} /><input placeholder={t.tag} value={team.tag} onChange={(e) => setTeam({ ...team, tag: e.target.value })} /><input placeholder={t.region} value={team.region} onChange={(e) => setTeam({ ...team, region: e.target.value })} /><Select value={team.tier} set={(tier) => setTeam({ ...team, tier: tier as Tier })} items={["Tier-1", "Tier-2", "Tier-3"]} /><label className="upload logoUpload"><Camera size={16} /> {t.uploadLogo}<input type="file" accept="image/*" onChange={uploadTeamLogo} /></label>{team.logo && <TeamLogo team={team} />}<NumberInput label={t.points} value={team.points} set={(points) => setTeam({ ...team, points })} /><NumberInput label="Wins" value={team.wins} set={(wins) => setTeam({ ...team, wins })} /><NumberInput label="Losses" value={team.losses} set={(losses) => setTeam({ ...team, losses })} /><div className="checkGrid">{store.players.map((p) => <label key={p.id}><input type="checkbox" checked={team.playerIds.includes(p.id)} onChange={(e) => setTeam({ ...team, playerIds: e.target.checked ? [...team.playerIds, p.id] : team.playerIds.filter((id) => id !== p.id) })} />{p.nick}</label>)}</div></Editor>}
      {tab === "players" && <Editor title={t.playerEditor} onSubmit={() => { savePlayer(player); setPlayer(blankPlayer); }} submit={t.save}><input placeholder={t.nick} value={player.nick} onChange={(e) => setPlayer({ ...player, nick: e.target.value })} /><input placeholder={t.realName} value={player.realName} onChange={(e) => setPlayer({ ...player, realName: e.target.value })} /><input placeholder={t.country} value={player.country} onChange={(e) => setPlayer({ ...player, country: e.target.value })} /><Select value={player.role} set={(role) => setPlayer({ ...player, role: role as Role })} items={["Awper", "Entry", "IGL", "Lurk", "Support"]} /><Select value={player.teamId || ""} set={(teamId) => setPlayer({ ...player, teamId })} items={["", ...store.teams.map((tm) => tm.id)]} labels={Object.fromEntries(store.teams.map((tm) => [tm.id, tm.name]))} /><label className="upload logoUpload"><Camera size={16} /> {t.uploadPhoto}<input type="file" accept="image/*" onChange={uploadPlayerPhoto} /></label>{player.photo && <Avatar player={player} />}<NumberInput label={t.rating} value={player.rating} step={0.01} set={(rating) => setPlayer({ ...player, rating })} /><NumberInput label="ADR" value={player.adr} set={(adr) => setPlayer({ ...player, adr })} /></Editor>}
      {tab === "matches" && <Editor title={t.matchEditor} onSubmit={() => { saveMatch(match); setMatch(blankMatch); }} submit={t.save}><Select value={match.teamAId} set={(teamAId) => setMatch({ ...match, teamAId })} items={store.teams.map((tm) => tm.id)} labels={Object.fromEntries(store.teams.map((tm) => [tm.id, tm.name]))} /><Select value={match.teamBId} set={(teamBId) => setMatch({ ...match, teamBId })} items={store.teams.map((tm) => tm.id)} labels={Object.fromEntries(store.teams.map((tm) => [tm.id, tm.name]))} /><Select value={match.status} set={(status) => setMatch({ ...match, status: status as MatchStatus })} items={statuses} labels={{ upcoming: t.upcoming, live: t.live, finished: t.finished }} /><input type="datetime-local" value={match.startsAt} onChange={(e) => setMatch({ ...match, startsAt: e.target.value })} /><input placeholder={t.event} value={match.event} onChange={(e) => setMatch({ ...match, event: e.target.value })} /><Select value={match.format} set={(format) => setMatch({ ...match, format: format as Match["format"] })} items={["BO1", "BO3", "BO5"]} /><NumberInput label={t.scoreA} value={match.scoreA} set={(scoreA) => setMatch({ ...match, scoreA })} /><NumberInput label={t.scoreB} value={match.scoreB} set={(scoreB) => setMatch({ ...match, scoreB })} /></Editor>}
      {tab === "users" && <div className="adminList">{store.users.map((user) => <div key={user.id} className="adminItem userAssign"><span>{user.nick}</span><Select value={user.teamId || ""} set={(teamId) => assignUserTeam(user.id, teamId)} items={["", ...store.teams.map((tm) => tm.id)]} labels={{ "": t.noTeam, ...Object.fromEntries(store.teams.map((tm) => [tm.id, tm.name])) }} /></div>)}</div>}
      <div className="adminList">
        {tab !== "users" && (tab === "teams" ? store.teams : tab === "players" ? store.players : store.matches).map((item) => <div key={item.id} className="adminItem"><span>{"name" in item ? item.name : "nick" in item ? item.nick : item.event}</span><button onClick={() => tab === "teams" ? setTeam(item as Team) : tab === "players" ? setPlayer(item as Player) : setMatch(item as Match)}>{t.edit}</button><button onClick={() => deleteItem(tab, item.id)}>{t.delete}</button></div>)}
      </div>
    </section>
  );
}

function Segment<T extends string>({ value, setValue, items }: { value: T; setValue: (value: T) => void; items: [T, string][] }) {
  return <div className="segment">{items.map(([id, label]) => <button key={id} className={value === id ? "selected" : ""} onClick={() => setValue(id)}>{label}</button>)}</div>;
}

function Modal({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  return <div className="modalShade" onMouseDown={close}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modalHead"><h2>{title}</h2><button className="iconBtn" onClick={close}><X size={18} /></button></div>{children}</div></div>;
}

function Stats({ items }: { items: [string, string | number | undefined][] }) {
  return <div className="stats">{items.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>;
}

function Avatar({ player, large }: { player: Player; large?: boolean }) {
  return player.photo ? <img className={large ? "avatar large" : "avatar"} src={player.photo} alt={player.nick} /> : <span className={large ? "avatar large" : "avatar"}>{player.nick.slice(0, 2).toUpperCase()}</span>;
}

function TeamLogo({ team, large }: { team: Team; large?: boolean }) {
  const className = large ? "bigLogo" : "miniLogo";
  return isImageLogo(team.logo) ? <img className={className} src={team.logo} alt={team.name} /> : <b className={className}>{team.logo || team.tag.slice(0, 2).toUpperCase()}</b>;
}

function Editor({ title, children, onSubmit, submit }: { title: string; children: React.ReactNode; onSubmit: () => void; submit: string }) {
  return <form className="editor" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}><h3>{title}</h3><div className="formGrid">{children}</div><button className="primary"><Save size={16} />{submit}</button></form>;
}

function NumberInput({ label, value, set, step = 1 }: { label: string; value: number; set: (value: number) => void; step?: number }) {
  return <label className="fieldLabel">{label}<input type="number" step={step} value={value} onChange={(e) => set(Number(e.target.value))} /></label>;
}

function Select({ value, set, items, labels: labelMap = {} }: { value: string; set: (value: string) => void; items: string[]; labels?: Record<string, string> }) {
  return <select value={value} onChange={(e) => set(e.target.value)}>{items.map((item) => <option value={item} key={item}>{labelMap[item] || item || "-"}</option>)}</select>;
}

export default App;
