// achievements.js – die Zentrale für alle Erfolge
const Erfolge = (function () {
  const SAVE_KEY = "ritterGames";

  // Pfad zu den Bildern automatisch aus dem Speicherort dieser Datei ableiten
  const scriptSrc = document.currentScript ? document.currentScript.src : "";
  const BILDER = scriptSrc.replace(/achievements\.js.*$/, "") + "assets/";

  // Gruppen: Überschrift und Würfelfarbe
  const GRUPPEN = {
    snake:     { titel: "Snake",       bild: "erfolg-gruen" },
    tetris:    { titel: "Tetris",      bild: "erfolg-blau" },
    sorten:    { titel: "Sorten",      bild: "erfolg-pink" },
    allgemein: { titel: "Allgemein",   bild: "erfolg-gelb" },
    meta:      { titel: "Königsklasse", bild: "erfolg-vollmilch" }
  };

  // ============================================================
  //  HIER TRÄGST DU NEUE ERFOLGE EIN – eine Zeile pro Erfolg
  //  art "best"     = bester Wert zählt (z. B. Score einer Runde)
  //  art "summe"    = wird über alle Runden aufaddiert
  //  art "sammlung" = verschiedene Dinge abhaken (item = ein bestimmtes)
  //  art "meta"     = alle anderen Erfolge freigeschaltet
  // ============================================================
  const LISTE = [
    // ---- SNAKE: Würfel in EINER Runde ----
    { id: "snake_2",        gruppe: "snake", name: "Probierhappen",   desc: "Iss 2 Schokowürfel in einer Runde",  art: "best",  zaehler: "snake_rekord", ziel: 2 },
    { id: "erste_schlange", gruppe: "snake", name: "Naschkatze",      desc: "Iss 5 Schokowürfel in einer Runde",  art: "best",  zaehler: "snake_rekord", ziel: 5 },
    { id: "snake_10",       gruppe: "snake", name: "Schokoschlange",  desc: "Iss 10 Schokowürfel in einer Runde", art: "best",  zaehler: "snake_rekord", ziel: 10 },
    { id: "snake_25",       gruppe: "snake", name: "Schokomonster",   desc: "Iss 25 Schokowürfel in einer Runde", art: "best",  zaehler: "snake_rekord", ziel: 25 },
    { id: "snake_50",       gruppe: "snake", name: "Kakao-Kobra",     desc: "Iss 50 Schokowürfel in einer Runde", art: "best",  zaehler: "snake_rekord", ziel: 50 },
    // ---- SNAKE: Würfel INSGESAMT ----
    { id: "snake_gesamt_100", gruppe: "snake", name: "Zahnarzts Albtraum",  desc: "Iss insgesamt 100 Schokowürfel",  art: "summe", zaehler: "snake_gegessen", ziel: 100 },
    { id: "snake_gesamt_500", gruppe: "snake", name: "Kakaobohnen-Baron",   desc: "Iss insgesamt 500 Schokowürfel",  art: "summe", zaehler: "snake_gegessen", ziel: 500, geheim: true },

    // ---- TETRIS: Reihen insgesamt ----
    { id: "tetris_reihen_10",  gruppe: "tetris", name: "Aufräumer",           desc: "Entferne insgesamt 10 Reihen",  art: "summe", zaehler: "tetris_reihen", ziel: 10 },
    { id: "tetris_reihen_50",  gruppe: "tetris", name: "Reihenhaus-Besitzer", desc: "Entferne insgesamt 50 Reihen",  art: "summe", zaehler: "tetris_reihen", ziel: 50 },
    { id: "tetris_reihen_100", gruppe: "tetris", name: "Bauarbeiter",         desc: "Entferne insgesamt 100 Reihen", art: "summe", zaehler: "tetris_reihen", ziel: 100 },
    { id: "tetris_reihen_500", gruppe: "tetris", name: "Abrissbirne",         desc: "Entferne insgesamt 500 Reihen", art: "summe", zaehler: "tetris_reihen", ziel: 500 },
    // ---- TETRIS: 4 Reihen auf einmal ----
    { id: "tetris_vier", gruppe: "tetris", name: "Tetris-Treffer", desc: "Entferne 4 Reihen auf einmal", art: "best", zaehler: "tetris_reihen_auf_einmal", ziel: 4 },
    // ---- TETRIS: Scores ----
    { id: "tetris_1000",  gruppe: "tetris", name: "Klötzchen-Kenner",      desc: "Erreiche 1.000 Punkte in Tetris",  art: "best", zaehler: "tetris_score", ziel: 1000 },
    { id: "tetris_5000",  gruppe: "tetris", name: "Stapelkünstler",        desc: "Erreiche 5.000 Punkte in Tetris",  art: "best", zaehler: "tetris_score", ziel: 5000 },
    { id: "tetris_profi", gruppe: "tetris", name: "Tetris-Profi",          desc: "Erreiche 10.000 Punkte in Tetris", art: "best", zaehler: "tetris_score", ziel: 10000 },
    { id: "tetris_25000", gruppe: "tetris", name: "Schokoladen-Architekt", desc: "Erreiche 25.000 Punkte in Tetris", art: "best", zaehler: "tetris_score", ziel: 25000 },

    // ---- SORTEN (Snake) ----
    { id: "sorte_marzipan",      gruppe: "sorten", name: "Marzipan-Probierer", desc: "Spiele Snake in der Sorte Marzipan",      art: "sammlung", zaehler: "snake_sorten", item: "marzipan" },
    { id: "sorte_nuss",          gruppe: "sorten", name: "Nuss-Knacker",       desc: "Spiele Snake in der Sorte Haselnuss",     art: "sammlung", zaehler: "snake_sorten", item: "nuss" },
    { id: "sorte_alpenmilch",    gruppe: "sorten", name: "Alpenmilch-Fan",     desc: "Spiele Snake in der Sorte Alpenmilch",    art: "sammlung", zaehler: "snake_sorten", item: "alpenmilch" },
    { id: "sorte_knusperflakes", gruppe: "sorten", name: "Flocken-Fan",        desc: "Spiele Snake in der Sorte Knusperflakes", art: "sammlung", zaehler: "snake_sorten", item: "knusperflakes" },
    { id: "sorte_erdbeer",       gruppe: "sorten", name: "Erdbeer-Träumer",    desc: "Spiele Snake in der Sorte Erdbeer",       art: "sammlung", zaehler: "snake_sorten", item: "erdbeer" },
    { id: "sorte_alle",          gruppe: "sorten", name: "Chocolatier",        desc: "Spiele Snake in allen 5 Sorten",          art: "sammlung", zaehler: "snake_sorten", ziel: 5 },

    // ---- ALLGEMEIN ----
    { id: "spiele_1",  gruppe: "allgemein", name: "Erster Biss",   desc: "Starte dein erstes Spiel", art: "summe", zaehler: "spiele_gesamt", ziel: 1 },
    { id: "spiele_10", gruppe: "allgemein", name: "Stammgast",     desc: "Spiele 10 Runden",         art: "summe", zaehler: "spiele_gesamt", ziel: 10 },
    { id: "spiele_50", gruppe: "allgemein", name: "Schoko-Süchtig", desc: "Spiele 50 Runden",        art: "summe", zaehler: "spiele_gesamt", ziel: 50 },

    // ---- META ----
    { id: "meta_alle", gruppe: "meta", name: "Schokoladenkönig", desc: "Schalte alle anderen Erfolge frei", art: "meta", geheim: true }
  ];
  // ============================================================

  // ---------- Speichern / Laden ----------
  function laden() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function speichern(save) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
    catch (e) {}
  }

  // ---------- Fortschritt eines Erfolgs ----------
  function fortschritt(a, save) {
    save = save || laden();
    const z = save.zaehler || {};
    const done = save.achievements || {};
    if (a.art === "summe" || a.art === "best") {
      return { aktuell: Math.min(z[a.zaehler] || 0, a.ziel), ziel: a.ziel };
    }
    if (a.art === "sammlung") {
      const s = (save.sammlungen || {})[a.zaehler] || {};
      if (a.item) return { aktuell: s[a.item] ? 1 : 0, ziel: 1 };
      return { aktuell: Math.min(Object.keys(s).length, a.ziel), ziel: a.ziel };
    }
    if (a.art === "meta") {
      const andere = LISTE.filter(x => x.art !== "meta");
      return { aktuell: andere.filter(x => done[x.id]).length, ziel: andere.length };
    }
    return { aktuell: 0, ziel: 1 };
  }

  // ---------- Prüfen, ob etwas neu freigeschaltet wurde ----------
  function pruefe() {
    const save = laden();
    if (!save.achievements) save.achievements = {};
    const neu = [];

    // Erst normale Erfolge, danach die Meta-Erfolge
    const reihenfolge = LISTE.filter(a => a.art !== "meta").concat(LISTE.filter(a => a.art === "meta"));
    for (const a of reihenfolge) {
      if (save.achievements[a.id]) continue;
      const f = fortschritt(a, save);
      if (f.aktuell >= f.ziel) {
        save.achievements[a.id] = true;
        neu.push(a);
      }
    }
    if (neu.length > 0) {
      speichern(save);
      neu.forEach(zeigeToast);
    }
  }

  // ---------- Meldungen aus den Spielen ----------
  function zaehle(name, menge) {
    const save = laden();
    if (!save.zaehler) save.zaehler = {};
    save.zaehler[name] = (save.zaehler[name] || 0) + (menge === undefined ? 1 : menge);
    speichern(save);
    pruefe();
  }
  function bestwert(name, wert) {
    const save = laden();
    if (!save.zaehler) save.zaehler = {};
    if (wert > (save.zaehler[name] || 0)) {
      save.zaehler[name] = wert;
      speichern(save);
      pruefe();
    }
  }
  function sammle(name, item) {
    const save = laden();
    if (!save.sammlungen) save.sammlungen = {};
    if (!save.sammlungen[name]) save.sammlungen[name] = {};
    if (!save.sammlungen[name][item]) {
      save.sammlungen[name][item] = true;
      speichern(save);
      pruefe();
    }
  }
  function istFreigeschaltet(id) {
    const save = laden();
    return !!(save.achievements && save.achievements[id]);
  }

  // ---------- Popup (wird automatisch über jedes Spiel gelegt) ----------
  const warteschlange = [];
  let toastLaeuft = false;

  function zeigeToast(a) {
    warteschlange.push(a);
    if (!toastLaeuft) naechsterToast();
  }

  function naechsterToast() {
    const a = warteschlange.shift();
    if (!a) { toastLaeuft = false; return; }
    toastLaeuft = true;

    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 12px);" +
      "transform:translate(-50%,-150%);transition:transform .4s ease;" +
      "z-index:99999;pointer-events:none;display:flex;align-items:center;gap:14px;" +
      "background:#24254f;color:#fff;border:2px solid #ffd220;border-radius:18px;" +
      "padding:10px 20px 10px 12px;box-shadow:0 6px 20px rgba(0,0,0,.5);" +
      "font-family:'Jost',sans-serif;max-width:90vw;";
    el.innerHTML =
      '<img src="' + BILDER + GRUPPEN[a.gruppe].bild + '.png" style="width:52px;height:52px">' +
      '<div><div style="font-size:12px;opacity:.8;letter-spacing:1px">ERFOLG FREIGESCHALTET</div>' +
      '<div style="font-size:20px;font-weight:700">' + a.name + '</div></div>';
    document.body.appendChild(el);

    setTimeout(() => { el.style.transform = "translate(-50%,0)"; }, 30);
    setTimeout(() => { el.style.transform = "translate(-50%,-150%)"; }, 3600);
    setTimeout(() => { el.remove(); naechsterToast(); }, 4100);
  }

  // Nur zum Testen: löscht Erfolge und Zähler, Highscores bleiben
  function zuruecksetzen() {
    const save = laden();
    delete save.achievements;
    delete save.zaehler;
    delete save.sammlungen;
    speichern(save);
  }

  return { LISTE, GRUPPEN, BILDER, laden, fortschritt, zaehle, bestwert, sammle, istFreigeschaltet, zuruecksetzen };
})();
