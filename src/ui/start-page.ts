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
          <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Zwei Lernwege · Entwicklungsvorschau</p>
          <h1 id="page-title">Zelllabor 11<span>Die Zelle<br />erfor&shy;schen.</span></h1>
          <p class="intro">Untersuche den Wasserhaushalt einer Pflanzenzelle oder stelle biologische Daten selbst dar. Jeder Lernweg endet mit einer eigenen schriftlichen Erklärung.</p>
          <section class="learning-path" aria-labelledby="water-path">
            <h2 id="water-path">A · Wasserhaushalt erklären</h2>
            <p>Material untersuchen → Ursache und Wirkung verknüpfen → eigene biologische Erklärung schreiben.</p>
            <ol>
              <li><a class="text-link exercise-link" href="#/m602">Erste Übung ausprobieren – Wasserhaushalt der Zelle</a></li>
              <li><a class="text-link exercise-link" href="#/m603">Kausalnetz ausprobieren – Ursache und Wirkung</a><p>Hier schließt du den Lernweg mit zwei bis vier eigenen Sätzen ab.</p></li>
            </ol>
            <p>Optionale Vertiefung: <a class="text-link exercise-link" href="#/m604">Untersuchung planen – Kontrolle und Rücktausch</a></p>
          </section>
          <section class="learning-path" aria-labelledby="data-path">
            <h2 id="data-path">B · Daten darstellen und deuten</h2>
            <p>Relative Änderung berechnen → Diagramm erstellen → Verlauf mit Zahlen beschreiben und eine Schlussgrenze benennen.</p>
            <ol>
              <li><a class="text-link exercise-link" href="#/m1001">Relative Massenänderung berechnen</a></li>
              <li><a class="text-link exercise-link" href="#/m1002">Ein Diagramm selbst erstellen</a><p>Hier schließt du den Lernweg mit deiner eigenen Datenbeschreibung ab.</p></li>
            </ol>
          </section>
          <p>Alle Übungen sind frei erreichbar und wiederholbar. Du kannst innerhalb dieser Sitzung wechseln; beim Neuladen gehen eigene Entwürfe verloren.</p>
          <p class="development-note">Begrenzte Entwicklungsvorschau. Noch keine Unterrichtsfreigabe.</p>
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

      <details id="entwicklungsstand" class="development"><summary>Entwicklungsstand und Grenzen</summary>
        <div class="section-heading"><p class="eyebrow">Entwicklungsstand</p><h2 id="development-title">Der Anfang ist gelegt.</h2></div>
        <div class="development-detail">
          <span class="phase-label">M6 · Drei verbundene Übungsvorschauen</span>
          <p>Untersuche ein Zellmodell, beantworte drei kurze Fragen und nutze gezielte Rückmeldungen zum Überarbeiten. Zwei Materialfälle ermöglichen eine Wiederholung desselben Beziehungstyps. Die vollständige Mission M6 ist noch nicht verfügbar.</p>
          <p>Im Kausalnetz verknüpfst du Wasserverlust, Volumen und Turgor selbst. Anschließend kannst du eine kontrollierte Untersuchung planen, zwei didaktische Rücktauschfälle auswerten und einen eigenen Versuchsplan begründen. Alle drei Übungen sind ohne Zugangssperre erreichbar.</p>
          <p class="release-note"><span aria-hidden="true">ⓘ</span> Noch kein für den Unterricht freigegebenes Lernspiel.</p>
        </div>
      </details>
    </main>

    <footer class="site-footer"><span>Zelllabor 11 · Die Zelle erforschen</span><span>Ein Projekt für die biologische Bildung.</span></footer>
  `;
  root.querySelector<HTMLAnchorElement>('a[href="#entwicklungsstand"]')!.addEventListener('click', () => {
    const details = root.querySelector<HTMLDetailsElement>('#entwicklungsstand')!; details.open = true;
    const title = root.querySelector<HTMLElement>('#development-title')!; title.tabIndex = -1; title.focus(); title.scrollIntoView({ block: 'start' });
  });
}
