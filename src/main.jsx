import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Map as MapIcon,
  Compass,
  ChartNoAxesCombined,
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  Search,
  Shuffle,
  Plus,
  Minus,
  Maximize,
  Minimize,
  MapPin,
  Flag,
  Lightbulb,
  Bookmark,
  BookOpen,
  Target,
  Flame,
  X,
  Trophy,
  RotateCcw,
  Globe,
  GraduationCap,
} from "lucide-react";
import Map from "./Map";
import {
  states as usStates,
  regions as usRegions,
  displayRegion as usDisplayRegion,
  colors as usColors,
  california,
  shuffle,
} from "./data";
import {
  states as inStates,
  regions as inRegions,
  displayRegion as inDisplayRegion,
  colors as inColors,
  karnataka,
} from "./india-data";
import "./styles.css";

function readProgress(country = "us") {
  try {
    const key = `statewise-progress-${country}`;
    const legacy =
      country === "us" ? localStorage.getItem("statewise-progress") : null;
    const raw = localStorage.getItem(key) || legacy;
    const p = JSON.parse(raw);
    return p && Array.isArray(p.learned) && Array.isArray(p.sessions)
      ? p
      : { learned: [], sessions: [] };
  } catch {
    return { learned: [], sessions: [] };
  }
}

function App() {
  const [country, setCountry] = useState(() => {
    try {
      return localStorage.getItem("statewise-country") || "us";
    } catch {
      return "us";
    }
  });

  const isIndia = country === "in";
  const states = isIndia ? inStates : usStates;
  const regions = isIndia ? inRegions : usRegions;
  const colors = isIndia ? inColors : usColors;
  const displayRegion = isIndia ? inDisplayRegion : usDisplayRegion;
  const totalStates = states.length;
  const stateNoun = isIndia ? "states & UTs" : "states";

  const [tab, setTab] = useState("Explore"),
    [selected, setSelected] = useState(() => (isIndia ? "KA" : "06")),
    [region, setRegion] = useState("All regions"),
    [search, setSearch] = useState(""),
    [labels, setLabels] = useState(true),
    [zoom, setZoom] = useState(1),
    [progress, setProgress] = useState(() => readProgress(country)),
    [quiz, setQuiz] = useState(null),
    [answer, setAnswer] = useState(null);

  const mapRef = useRef(null),
    fullscreenButtonRef = useRef(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  const handleCountryChange = (newCountry) => {
    if (newCountry === country) return;
    setCountry(newCountry);
    try {
      localStorage.setItem("statewise-country", newCountry);
    } catch {}
    setSelected(newCountry === "in" ? "KA" : "06");
    setRegion("All regions");
    setSearch("");
    setZoom(1);
    setQuiz(null);
    setAnswer(null);
    setProgress(readProgress(newCountry));
  };

  useEffect(() => {
    const sync = () => {
      if (!document.fullscreenElement) {
        setMapExpanded(false);
        fullscreenButtonRef.current?.focus();
      }
    };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    if (!mapExpanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const outside = [
      ...document.querySelectorAll(
        "header,.page-heading,.state-card,.practice-section,footer",
      ),
    ];
    outside.forEach((el) => (el.inert = true));
    return () => {
      document.body.style.overflow = previousOverflow;
      outside.forEach((el) => (el.inert = false));
    };
  }, [mapExpanded]);

  const closeMap = async () => {
    if (document.fullscreenElement === mapRef.current)
      await document.exitFullscreen();
    setMapExpanded(false);
    fullscreenButtonRef.current?.focus();
  };

  const toggleMap = async () => {
    if (mapExpanded) {
      await closeMap();
      return;
    }
    setMapExpanded(true);
    try {
      await mapRef.current?.requestFullscreen?.();
    } catch {
      /* Use the full-viewport layout when native fullscreen is unavailable. */
    }
  };

  const mapKeys = (e) => {
    if (!mapExpanded) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMap();
    }
    if (e.key === "Tab") {
      const controls = [
        ...mapRef.current.querySelectorAll(
          'button:not(:disabled),input,select,[tabindex="0"]',
        ),
      ];
      if (e.shiftKey && document.activeElement === controls[0]) {
        e.preventDefault();
        controls.at(-1)?.focus();
      } else if (!e.shiftKey && document.activeElement === controls.at(-1)) {
        e.preventDefault();
        controls[0]?.focus();
      }
    }
  };

  const state = states.find((s) => s.id === selected) || states[0];
  const learned = progress.learned.includes(state.id);

  const isFeatured =
    (country === "us" && state.abbr === "CA") ||
    (country === "in" && state.abbr === "KA");
  const featuredData = country === "us" ? california : karnataka;

  const save = (p) => {
    setProgress(p);
    try {
      localStorage.setItem(`statewise-progress-${country}`, JSON.stringify(p));
      if (country === "us") {
        localStorage.setItem("statewise-progress", JSON.stringify(p));
      }
    } catch {}
  };

  const select = (id) => {
    setSelected(id);
    setSearch("");
  };

  const toggleLearned = () =>
    save({
      ...progress,
      learned: learned
        ? progress.learned.filter((id) => id !== state.id)
        : [...progress.learned, state.id],
    });

  const startQuiz = (mode) => {
    const pool = states.filter(
      (s) => region === "All regions" || displayRegion(s) === region,
    );
    const questions = shuffle(pool)
      .slice(0, 10)
      .map((s) => ({
        state: s,
        options: shuffle([
          s,
          ...shuffle(states.filter((x) => x.id !== s.id)).slice(0, 3),
        ]),
      }));
    setQuiz({ mode, questions, index: 0, score: 0, done: false });
    setAnswer(null);
  };

  const respond = (id) => {
    if (answer || quiz.done) return;
    const correct = id === quiz.questions[quiz.index].state.id;
    setAnswer({ id, correct });
    if (correct) setQuiz((q) => ({ ...q, score: q.score + 1 }));
  };

  const next = () => {
    if (quiz.index === quiz.questions.length - 1) {
      save({
        ...progress,
        sessions: [
          ...progress.sessions,
          {
            score: quiz.score,
            total: quiz.questions.length,
            date: new Date().toISOString(),
          },
        ],
      });
      setQuiz({ ...quiz, done: true });
    } else setQuiz({ ...quiz, index: quiz.index + 1 });
    setAnswer(null);
  };

  const total = progress.sessions.reduce((n, s) => n + s.total, 0),
    correct = progress.sessions.reduce((n, s) => n + s.score, 0);

  return (
    <>
      <header>
        <a className="brand" href="./" aria-label="Statewise home">
          <span className="brand-icon">
            <MapIcon size={23} />
          </span>
          statewise<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          {[
            ["Explore", Compass],
            ["Practice", GraduationCap],
            ["My progress", ChartNoAxesCombined],
          ].map(([name, Icon]) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => setTab(name)}
            >
              <Icon size={17} />
              {name}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <div
            className="country-switch"
            role="radiogroup"
            aria-label="Country selection"
          >
            <button
              className={country === "us" ? "active" : ""}
              role="radio"
              aria-checked={country === "us"}
              onClick={() => handleCountryChange("us")}
            >
              🇺🇸 <span className="country-name">USA</span>
            </button>
            <button
              className={country === "in" ? "active" : ""}
              role="radio"
              aria-checked={country === "in"}
              onClick={() => handleCountryChange("in")}
            >
              🇮🇳 <span className="country-name">India</span>
            </button>
          </div>
          <span className="little-note">A little smarter, state by state.</span>
          <button
            className="avatar"
            aria-label="View my progress"
            onClick={() => setTab("My progress")}
          >
            Y<span />
          </button>
        </div>
      </header>
      <main>
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <span /> YOUR NEXT DISCOVERY STARTS HERE
            </div>
            <h1>
              {tab === "Explore" ? (
                <>
                  Small steps. <span>Big country.</span>
                </>
              ) : tab === "Practice" ? (
                <>
                  A little practice. <span>A lot of progress.</span>
                </>
              ) : (
                <>
                  Look how far <span>you’ve come.</span>
                </>
              )}
            </h1>
            <p>
              {tab === "Explore"
                ? `${totalStates} ${stateNoun}, endless things to discover. Let’s put your curiosity on the map.`
                : tab === "Practice"
                  ? "Make it stick. Turn what you’ve discovered into what you know."
                  : `Every ${isIndia ? "state and territory" : "state"} is a small win. Keep your curiosity going.`}
            </p>
          </div>
          <div className="journey-badge">
            <span className="journey-icon">
              <Flag size={18} />
            </span>
            <div>
              <strong>
                Your journey has{" "}
                {progress.learned.length ? "begun" : "just begun"}
              </strong>
              <small>
                {progress.learned.length} of {totalStates} {stateNoun} explored
              </small>
            </div>
          </div>
        </div>
        {tab === "Explore" ? (
          <>
            <div className="workspace">
              <section
                ref={mapRef}
                className={`map-panel ${mapExpanded ? "map-expanded" : ""}`}
                role={mapExpanded ? "dialog" : undefined}
                aria-modal={mapExpanded ? true : undefined}
                aria-label={`Explore the ${isIndia ? "India" : "United States"} map`}
                onKeyDown={mapKeys}
              >
                <div className="map-toolbar">
                  <div>
                    <h2>
                      Meet {isIndia ? "India" : "the United States"}{" "}
                      <span>
                        {totalStates} {stateNoun}. One big adventure.
                      </span>
                    </h2>
                  </div>
                  <div className="map-filters">
                    <label className="select-wrap">
                      <select
                        aria-label="Filter by region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option>All regions</option>
                        {regions.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </label>
                    <div className="search-wrap">
                      <Search size={16} />
                      <input
                        aria-label="Find a state"
                        placeholder="Find a state…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && (
                        <div className="search-results">
                          {states
                            .filter((s) =>
                              `${s.name} ${s.abbr} ${s.capital}`
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                            )
                            .map((s) => (
                              <button key={s.id} onClick={() => select(s.id)}>
                                {s.name}
                                <span>{s.abbr}</span>
                              </button>
                            ))}
                          {!states.some((s) =>
                            `${s.name} ${s.abbr} ${s.capital}`
                              .toLowerCase()
                              .includes(search.toLowerCase()),
                          ) && <p>No states found. Try a name or capital.</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="map-canvas">
                  <div className="map-hint">
                    <span className="pulse" /> Pick a state. Get to know it.
                  </div>
                  <Map
                    country={country}
                    selected={selected}
                    onSelect={select}
                    region={region}
                    labels={labels}
                    zoom={zoom}
                  />
                  {country === "us" ? (
                    <>
                      <div className="ocean pacific">
                        PACIFIC
                        <br />
                        OCEAN
                      </div>
                      <div className="ocean atlantic">
                        ATLANTIC
                        <br />
                        OCEAN
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ocean arabian-sea">
                        ARABIAN
                        <br />
                        SEA
                      </div>
                      <div className="ocean bay-bengal">
                        BAY OF
                        <br />
                        BENGAL
                      </div>
                      <div className="ocean indian-ocean">
                        INDIAN OCEAN
                      </div>
                    </>
                  )}
                  <div className="map-controls">
                    <button
                      aria-label="Zoom in"
                      disabled={zoom >= 1.6}
                      onClick={() => setZoom(Math.min(1.6, zoom + 0.2))}
                    >
                      <Plus size={17} />
                    </button>
                    <button
                      aria-label="Zoom out"
                      disabled={zoom <= 1}
                      onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                    >
                      <Minus size={17} />
                    </button>
                    <button
                      ref={fullscreenButtonRef}
                      aria-label={
                        mapExpanded
                          ? "Exit fullscreen map"
                          : "Enter fullscreen map"
                      }
                      title={
                        mapExpanded ? "Exit fullscreen (Esc)" : "Fullscreen map"
                      }
                      aria-pressed={mapExpanded}
                      onClick={toggleMap}
                    >
                      {mapExpanded ? (
                        <Minimize size={16} />
                      ) : (
                        <Maximize size={16} />
                      )}
                    </button>
                  </div>
                  <button
                    className="surprise"
                    onClick={() =>
                      select(
                        shuffle(states.filter((s) => s.id !== selected))[0].id,
                      )
                    }
                  >
                    <Shuffle size={15} /> Surprise me
                  </button>
                </div>
                <div className="map-bottom">
                  <div className="legend">
                    {regions.map((r) => (
                      <button
                        key={r}
                        className={region === r ? "chosen" : ""}
                        onClick={() =>
                          setRegion(region === r ? "All regions" : r)
                        }
                      >
                        <i style={{ background: colors[r] }} />
                        {r}
                      </button>
                    ))}
                  </div>
                  <button
                    className="label-toggle"
                    role="switch"
                    aria-checked={labels}
                    onClick={() => setLabels(!labels)}
                  >
                    <span className={labels ? "switch on" : "switch"} /> State
                    labels
                  </button>
                </div>
              </section>
              <aside className="state-card" aria-live="polite">
                <div
                  className={`state-photo ${isFeatured ? (isIndia ? "karnataka" : "california") : ""}`}
                  style={
                    isFeatured
                      ? {
                          backgroundImage: `linear-gradient(0deg,rgba(12,35,24,.6),transparent 80%),url(${featuredData.image})`,
                        }
                      : { backgroundColor: colors[displayRegion(state)] }
                  }
                >
                  <span className="region-tag">
                    <span
                      style={{ background: colors[displayRegion(state)] }}
                    />
                    {displayRegion(state)}
                  </span>
                  <div className="photo-title">
                    <h2>{state.name}</h2>
                    <p>{state.nickname}</p>
                  </div>
                  <span className="abbr-stamp">{state.abbr}</span>
                </div>
                <div className="state-info">
                  <div className="facts">
                    <div>
                      <MapPin size={17} />
                      <span>
                        Capital<strong>{state.capital}</strong>
                      </span>
                    </div>
                    <div>
                      <Flag size={17} />
                      <span>
                        {isIndia ? "Formation" : "Statehood"}
                        <strong>{state.year}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="fact-box">
                    <h3>
                      <Lightbulb size={16} /> A little state of wonder
                    </h3>
                    <p>
                      {isFeatured
                        ? featuredData.fact
                        : isIndia
                          ? `Known as ${state.nickname}, ${state.name} formed in ${state.year}. Its capital is ${state.capital} — keep that one in your back pocket for your next quiz.`
                          : `Known as the ${state.nickname.replace(/^The /, "")}, ${state.name} became a state in ${state.year}. Its capital is ${state.capital} — keep that one in your back pocket for your next quiz.`}
                    </p>
                  </div>
                  <button
                    className={`learn-button ${learned ? "is-learned" : ""}`}
                    onClick={toggleLearned}
                  >
                    {learned ? <Check size={17} /> : <Bookmark size={17} />}{" "}
                    {learned ? "Added to your discoveries" : "Mark as learned"}{" "}
                    {learned ? "" : <Plus size={15} />}
                  </button>
                  <button
                    className="text-button"
                    onClick={() => startQuiz("capitals")}
                  >
                    Put your knowledge to the test <ArrowRight size={15} />
                  </button>
                </div>
              </aside>
            </div>
            <section className="practice-section">
              <div className="section-heading">
                <h2>
                  A little practice goes a long way
                  <span>Pick your next challenge.</span>
                </h2>
                <button onClick={() => setTab("Practice")}>
                  See all practice <ArrowRight size={15} />
                </button>
              </div>
              <div className="practice-grid">
                <PracticeCard
                  type="locations"
                  icon={MapIcon}
                  title="Find the state"
                  desc="A name, a map. Can you connect the two?"
                  meta="MAP CHALLENGE"
                  color="green"
                  start={startQuiz}
                />
                <PracticeCard
                  type="capitals"
                  icon={Flag}
                  title="Capital connections"
                  desc="Get to know the cities at the heart of each state."
                  meta="MULTIPLE CHOICE"
                  color="peach"
                  start={startQuiz}
                />
                <div className="journey-card">
                  <div>
                    <span className="eyebrow">YOUR PERSONAL FIELD GUIDE</span>
                    <h3>One state at a time.</h3>
                    <p>
                      You don’t have to know it all.
                      <br />
                      Just discover something new today.
                    </p>
                  </div>
                  <div className="mini-book">
                    <BookOpen size={55} strokeWidth={1.1} />
                    <span>{totalStates}</span>
                  </div>
                  <div className="journey-meter">
                    <span>
                      <strong>{progress.learned.length}</strong> / {totalStates}{" "}
                      {stateNoun} learned
                    </span>
                    <span>
                      {Math.round(
                        (progress.learned.length / totalStates) * 100,
                      )}
                      %
                    </span>
                    <div>
                      <i
                        style={{
                          width: `${(progress.learned.length / totalStates) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : tab === "Practice" ? (
          <section className="practice-page">
            <div className="practice-grid">
              <PracticeCard
                type="locations"
                icon={MapIcon}
                title="Find the state"
                desc={`Locate 10 ${stateNoun} on an unlabeled map.`}
                meta="MAP CHALLENGE"
                color="green"
                start={startQuiz}
              />
              <PracticeCard
                type="capitals"
                icon={Flag}
                title="Capital connections"
                desc="Match the state to its capital city."
                meta="MULTIPLE CHOICE"
                color="peach"
                start={startQuiz}
              />
              <PracticeCard
                type="nicknames"
                icon={Globe}
                title="What’s in a nickname?"
                desc="Match each memorable nickname to its state."
                meta="MULTIPLE CHOICE"
                color="lavender"
                start={startQuiz}
              />
            </div>
            <div className="practice-tip">
              <Lightbulb /> Each round has up to 10 questions, with instant
              feedback and no time pressure.{" "}
              {region !== "All regions" && `Practicing the ${region} region.`}
            </div>
          </section>
        ) : (
          <section className="progress-page">
            <div className="stats">
              <div>
                <Bookmark />
                <strong>
                  {progress.learned.length}
                  <small>/ {totalStates}</small>
                </strong>
                <span>{isIndia ? "States & UTs learned" : "States learned"}</span>
              </div>
              <div>
                <Target />
                <strong>
                  {total ? Math.round((correct / total) * 100) : 0}
                  <small>%</small>
                </strong>
                <span>Quiz accuracy</span>
              </div>
              <div>
                <Trophy />
                <strong>{progress.sessions.length}</strong>
                <span>Quizzes completed</span>
              </div>
            </div>
            <h2>Your discoveries</h2>
            <p>
              Explore a state and mark it as learned to add it to your field
              guide.
            </p>
            <div className="state-directory">
              {states.map((s) => (
                <button
                  key={s.id}
                  className={progress.learned.includes(s.id) ? "known" : ""}
                  onClick={() => {
                    select(s.id);
                    setTab("Explore");
                  }}
                >
                  <span>{s.abbr}</span>
                  {s.name}
                  {progress.learned.includes(s.id) && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>
        )}
        <footer>
          <span>
            <Compass size={15} /> Made for curious minds. Built for little
            discoveries.
          </span>
          <span>
            All {totalStates} {stateNoun}. All yours to explore.{" "}
            <span className="footer-star">✳</span>
          </span>
        </footer>
      </main>
      {quiz && (
        <div className="modal-backdrop">
          <section
            className="quiz-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-title"
            ref={(el) => {
              if (el && !el.contains(document.activeElement)) el.focus();
            }}
            tabIndex="-1"
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuiz(null);
              if (e.key === "Tab") {
                const els = [
                  ...e.currentTarget.querySelectorAll(
                    'button:not(:disabled),[tabindex="0"]',
                  ),
                ];
                if (
                  e.shiftKey &&
                  (document.activeElement === els[0] ||
                    document.activeElement === e.currentTarget)
                ) {
                  e.preventDefault();
                  els.at(-1)?.focus();
                } else if (
                  !e.shiftKey &&
                  document.activeElement === els.at(-1)
                ) {
                  e.preventDefault();
                  els[0]?.focus();
                }
              }
            }}
          >
            <button
              className="close-quiz"
              aria-label="Close quiz"
              onClick={() => setQuiz(null)}
            >
              <X />
            </button>
            {quiz.done ? (
              <div className="quiz-result">
                <Trophy size={48} />
                <div className="eyebrow">ANOTHER STEP FORWARD</div>
                <h2 id="quiz-title">Nice exploring!</h2>
                <strong>
                  {quiz.score}
                  <span> / {quiz.questions.length}</span>
                </strong>
                <p>
                  {quiz.score === quiz.questions.length
                    ? "A perfect round. You really know your states!"
                    : "Every question is a chance to learn. Ready for another adventure?"}
                </p>
                <button
                  className="primary"
                  onClick={() => startQuiz(quiz.mode)}
                >
                  <RotateCcw size={17} /> Play again
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setQuiz(null);
                    setTab("My progress");
                  }}
                >
                  See my progress <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="eyebrow">
                  {quiz.mode === "locations"
                    ? "MAP CHALLENGE"
                    : quiz.mode === "capitals"
                      ? "CAPITAL CONNECTIONS"
                      : "STATE NICKNAMES"}
                </div>
                <div className="quiz-topline">
                  <span>
                    Question {quiz.index + 1} of {quiz.questions.length}
                  </span>
                  <span>{quiz.score} correct</span>
                </div>
                <div className="quiz-progress">
                  <i
                    style={{
                      width: `${(quiz.index / quiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
                <h2 id="quiz-title">
                  {quiz.mode === "locations"
                    ? `Where is ${quiz.questions[quiz.index].state.name}?`
                    : quiz.mode === "capitals"
                      ? `What is the capital of ${quiz.questions[quiz.index].state.name}?`
                      : `Which state is known as “${quiz.questions[quiz.index].state.nickname}”?`}
                </h2>
                {quiz.mode === "locations" ? (
                  <>
                    <div
                      className={`map-verdict ${answer ? (answer.correct ? "is-correct" : "is-incorrect") : ""}`}
                      role="status"
                      aria-live="polite"
                    >
                      {answer ? (
                        <>
                          {answer.correct ? (
                            <Check size={20} />
                          ) : (
                            <X size={20} />
                          )}
                          <div>
                            <strong>
                              {answer.correct ? "Correct!" : "Incorrect."}
                            </strong>
                            <span>
                              {answer.correct
                                ? `That’s ${quiz.questions[quiz.index].state.name}.`
                                : `You picked ${states.find((s) => s.id === answer.id)?.name || "another state"}. ${quiz.questions[quiz.index].state.name} is marked ✓ on the map.`}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span>Tap a state on the map to answer.</span>
                      )}
                    </div>
                    <Map
                      country={country}
                      region="All regions"
                      labels={false}
                      quiz
                      selected={
                        answer ? quiz.questions[quiz.index].state.id : null
                      }
                      result={
                        answer
                          ? {
                              correctId: quiz.questions[quiz.index].state.id,
                              chosenId: answer.id,
                            }
                          : null
                      }
                      onSelect={respond}
                    />
                    <label className="map-answer-select">
                      Or choose a {isIndia ? "state or UT" : "state"}
                      <select
                        aria-label="Choose state answer"
                        disabled={!!answer}
                        value={answer?.id || ""}
                        onChange={(e) => respond(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a {isIndia ? "state or UT" : "state"}…
                        </option>
                        {states.map((s) => (
                          <option value={s.id} key={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                ) : (
                  <div className="answers">
                    {quiz.questions[quiz.index].options.map((s, i) => (
                      <button
                        key={s.id}
                        disabled={!!answer}
                        className={
                          answer
                            ? s.id === quiz.questions[quiz.index].state.id
                              ? "correct"
                              : s.id === answer.id
                                ? "incorrect"
                                : ""
                            : ""
                        }
                        onClick={() => respond(s.id)}
                      >
                        <span>{String.fromCharCode(65 + i)}</span>
                        {quiz.mode === "capitals" ? s.capital : s.name}
                        {answer &&
                          s.id === quiz.questions[quiz.index].state.id && (
                            <Check size={19} />
                          )}
                      </button>
                    ))}
                  </div>
                )}
                {answer && (
                  <div className="answer-feedback" role="status">
                    <strong>
                      {answer.correct
                        ? "That’s right!"
                        : "A new one to remember."}
                    </strong>
                    <p>
                      {quiz.questions[quiz.index].state.name} ·{" "}
                      {quiz.questions[quiz.index].state.capital} ·{" "}
                      {quiz.questions[quiz.index].state.nickname}
                    </p>
                    <button className="primary" onClick={next}>
                      {quiz.index === quiz.questions.length - 1
                        ? "See results"
                        : "Next question"}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function PracticeCard({ type, icon: Icon, title, desc, meta, color, start }) {
  return (
    <button className={`practice-card ${color}`} onClick={() => start(type)}>
      <div className="practice-icon">
        <Icon size={23} strokeWidth={1.5} />
      </div>
      <ArrowUpRight className="practice-arrow" size={20} />
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="practice-meta">
        {meta}
        <span>•</span>10 QUESTIONS
        <ArrowRight size={15} />
      </div>
    </button>
  );
}

createRoot(document.getElementById("root")).render(<App />);
