/** Static, authored markup only. Never interpolate pupil input into HTML. */
export function renderStartPage(root: HTMLElement): void {
  root.innerHTML = `
    <a class="skip-link" href="#inhalt">Zum Inhalt</a>
    <header class="site-header">
      <a class="brand" href="#inhalt" aria-label="Zelllabor 11 – zur Startseite">
        <span class="brand-mark" aria-hidden="true">zl<span>11</span></span>
        <span>Zelllabor 11<small>Die Zelle erforschen</small></span>
      </a>
      <span class="header-subject">Biologie <span aria-hidden="true">/</span> Jahrgang 11</span>
    </header>

    <main id="inhalt" tabindex="-1">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Ein virtueller Lernraum entsteht</p>
          <h1 id="page-title">Zelllabor 11<span>Die Zelle<br />erforschen.</span></h1>
          <p class="intro">Kleine Strukturen. Große Zusammenhänge. Hier entsteht ein digitales Zelllabor, in dem du Zellbiologie Schritt für Schritt untersuchen kannst.</p>
          <p class="development-note"><strong>Noch in Entwicklung.</strong> Diese Startseite ist das technische Fundament. Lernmissionen stehen noch nicht zur Verfügung.</p>
          <a class="text-link" href="#entwicklungsstand">Zum Entwicklungsstand <span class="link-arrow" aria-hidden="true"></span></a>
        </div>
        <div class="lab-sheet" aria-hidden="true">
          <div class="sheet-caption"><span>ZL / 11</span><span>Perspektiven verbinden</span></div>
          <div class="diagram">
            <span class="diagram-axis axis-x"></span><span class="diagram-axis axis-y"></span>
            <span class="diagram-ring ring-one"></span><span class="diagram-ring ring-two"></span>
            <span class="diagram-ring ring-three"></span><span class="diagram-centre">zl<span>11</span></span>
            <span class="diagram-point point-one"></span><span class="diagram-point point-two"></span>
            <span class="diagram-coordinate">STRUKTUR ↔ FUNKTION</span>
          </div>
          <p class="sheet-footer">Genau hinsehen.<br /><strong>Zusammenhänge verstehen.</strong></p>
        </div>
      </section>

      <section id="entwicklungsstand" class="development" aria-labelledby="development-title">
        <div class="section-heading"><p class="eyebrow">Entwicklungsstand</p><h2 id="development-title">Der Anfang ist gelegt.</h2></div>
        <div class="development-detail">
          <span class="phase-label">P00 · Technisches Fundament</span>
          <p>Die Grundlage für das spätere Zelllabor wird aufgebaut. Aufgaben, fachliche Rückmeldungen und interaktive Zellmodelle folgen erst in weiteren Entwicklungsphasen.</p>
          <p class="release-note"><span aria-hidden="true">ⓘ</span> Noch kein für den Unterricht freigegebenes Lernspiel.</p>
        </div>
      </section>
    </main>

    <footer class="site-footer"><span>Zelllabor 11 · Die Zelle erforschen</span><span>Ein Projekt für die biologische Bildung.</span></footer>
  `;
}
