/**
 * 🌱 gardenKeeper® - KOMPLETTES Pflegeanleitung-System
 * Version: 2025.11.14
 *
 * Dieses System ermöglicht automatische Pflegeanleitungen basierend auf durchgeführten Arbeiten.
 * Einfach neue Anleitungen hinzufügen - siehe ANLEITUNG am Ende der Datei!
 */

// =========================================
// 🎨 CSS FÜR PFLEGEANLEITUNGEN (wird ins PDF integriert)
// =========================================

const PFLEGEANLEITUNG_CSS = `
<style>
/* Pflegeanleitung-Styles */
.pflegeanleitung-container {
    page-break-before: always;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background: white;
}

.pfl-header {
    text-align: center;
    padding: 30px 20px;
    background: linear-gradient(135deg, #9ba687 0%, #6b7456 100%);
    border-radius: 15px 15px 0 0;
    color: white;
    margin-bottom: 0;
}

.pfl-header h1 {
    font-size: 2.5em;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.pfl-header .subtitle {
    font-size: 1.3em;
    opacity: 0.95;
    font-weight: 300;
}

.pfl-welcome-box {
    background: linear-gradient(135deg, #f0f9f6 0%, #e8f5f1 100%);
    padding: 25px;
    border-radius: 0 0 15px 15px;
    border-left: 5px solid #00b4b4;
    margin-bottom: 30px;
}

.pfl-welcome-box h2 {
    color: #6b7456;
    margin: 0 0 15px 0;
    font-size: 1.6em;
}

.pfl-welcome-box p {
    color: #4a4539;
    line-height: 1.8;
    margin-bottom: 10px;
}

.pfl-section {
    margin-bottom: 35px;
    page-break-inside: avoid;
}

.pfl-section h2 {
    font-size: 1.8em;
    color: #6b7456;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 3px solid #00b4b4;
    display: flex;
    align-items: center;
    gap: 10px;
}

.pfl-section h2::before {
    content: attr(data-icon);
    font-size: 1.2em;
}

.pfl-section p {
    color: #4a4539;
    line-height: 1.8;
    margin-bottom: 15px;
}

.pfl-important {
    background: #fff3cd;
    border-left: 5px solid #ffc107;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}

.pfl-important h4 {
    color: #856404;
    margin: 0 0 12px 0;
    font-size: 1.3em;
}

.pfl-important ul {
    margin: 0;
    padding-left: 20px;
}

.pfl-important li {
    color: #856404;
    margin-bottom: 8px;
    line-height: 1.6;
}

.pfl-warning {
    background: #f8d7da;
    border-left: 5px solid #dc3545;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}

.pfl-warning h4 {
    color: #721c24;
    margin: 0 0 12px 0;
    font-size: 1.3em;
}

.pfl-warning ul {
    margin: 0;
    padding-left: 20px;
}

.pfl-warning li {
    color: #721c24;
    margin-bottom: 8px;
}

.pfl-tip {
    background: #d1ecf1;
    border-left: 5px solid #00b4b4;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}

.pfl-tip h4 {
    color: #0c5460;
    margin: 0 0 12px 0;
    font-size: 1.3em;
}

.pfl-tip ul {
    margin: 0;
    padding-left: 20px;
}

.pfl-tip li {
    color: #0c5460;
    margin-bottom: 8px;
}

.pfl-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.pfl-table th {
    background: #6b7456;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
}

.pfl-table td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
}

.pfl-table tr:nth-child(even) {
    background: #f8f9fa;
}

.pfl-footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 25px;
    border-top: 2px solid #ddd;
    color: #666;
}

.pfl-footer p {
    margin: 5px 0;
}

.pfl-contact {
    background: linear-gradient(135deg, #9ba687 0%, #6b7456 100%);
    color: white;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    margin-top: 30px;
}

.pfl-contact h3 {
    margin: 0 0 15px 0;
    font-size: 1.5em;
}

.pfl-contact p {
    margin: 5px 0;
    opacity: 0.95;
}
</style>
`;

// =========================================
// 🔧 PFLEGEANLEITUNG-TEMPLATES
// =========================================

const PFLEGEANLEITUNGEN = {

    /**
     * 🌿 UNIVERSELLE PFLANZANLEITUNG
     */
    pflanzanleitung: {
        id: 'pflanzanleitung',
        title: 'Pflanz- & Pflegeanleitung',
        subtitle: 'Für Ihre gardenKeeper Pflanzenbestellung',

        keywords: [
            'bepflanzung', 'pflanz', 'stauden', 'gehölze', 'sträucher',
            'pflanzen', 'neu gepflanzt', 'bepflanzt', 'gesetzt', 'pflanzung'
        ],

        htmlContent: `
<div class="pflegeanleitung-container">
    <div class="pfl-header">
        <h1>🌿 Pflanz- & Pflegeanleitung</h1>
        <div class="subtitle">Für Ihre gardenKeeper Pflanzenbestellung</div>
    </div>

    <div class="pfl-welcome-box">
        <h2>Herzlich willkommen!</h2>
        <p>Ihre neuen Pflanzen wurden fachgerecht gesetzt. Damit sie gut anwachsen und gedeihen, beachten Sie bitte die folgenden Pflegehinweise:</p>
        <p><strong>Die ersten 4 Wochen sind entscheidend!</strong> In dieser kritischen Anwachsphase benötigen Ihre Pflanzen besondere Aufmerksamkeit.</p>
    </div>

    <div class="pfl-section">
        <h2 data-icon="💧">Wässern in der Anwachsphase</h2>
        <p>Die Wasserversorgung ist der wichtigste Faktor für erfolgreiches Anwachsen!</p>

        <div class="pfl-important">
            <h4>⚠️ Kritische erste 4 Wochen:</h4>
            <ul>
                <li><strong>Täglich</strong> die Bodenfeuchtigkeit kontrollieren</li>
                <li>Bei Trockenheit <strong>durchdringend wässern</strong> (5-10 Liter pro m²)</li>
                <li>Morgens (6-8 Uhr) oder abends (nach 18 Uhr) gießen</li>
                <li><strong>Niemals in der Mittagshitze</strong> gießen!</li>
                <li>Lieber seltener, aber dafür gründlich wässern</li>
            </ul>
        </div>

        <div class="pfl-tip">
            <h4>💡 Fingerprobe:</h4>
            <ul>
                <li>Stecken Sie Ihren Finger 5 cm tief in die Erde</li>
                <li>Fühlt es sich trocken an? → Gießen!</li>
                <li>Noch feucht? → Kein Wasser nötig</li>
            </ul>
        </div>

        <p><strong>Nach den ersten 4 Wochen:</strong> Reduzieren Sie langsam auf 2-3x pro Woche, je nach Wetterlage.</p>
    </div>

    <div class="pfl-section">
        <h2 data-icon="🌱">Unkraut entfernen</h2>
        <p>Unkraut konkurriert mit Ihren neuen Pflanzen um Wasser und Nährstoffe!</p>

        <div class="pfl-important">
            <h4>Regelmäßige Kontrolle:</h4>
            <ul>
                <li>1-2x pro Woche Unkraut entfernen</li>
                <li>Am besten nach Regen (Wurzeln lassen sich leichter ziehen)</li>
                <li>Unkraut MIT Wurzel entfernen (nicht nur abschneiden!)</li>
                <li>Besonders wichtig in den ersten 8 Wochen</li>
            </ul>
        </div>

        <div class="pfl-tip">
            <h4>💡 Profi-Tipp: Mulchen</h4>
            <ul>
                <li>Rindenmulch (5-7 cm dick) unterdrückt Unkraut</li>
                <li>Hält Bodenfeuchtigkeit länger</li>
                <li>Schützt vor Austrocknung</li>
            </ul>
        </div>
    </div>

    <div class="pfl-section">
        <h2 data-icon="☀️">Standort & Wetter</h2>

        <div class="pfl-warning">
            <h4>⚠️ Bei Hitze & Trockenheit:</h4>
            <ul>
                <li>Wassergaben VERDOPPELN!</li>
                <li>Notfalls auch mittags wässern (direkt an die Wurzeln, nicht über Blätter)</li>
                <li>Schattierung mit Jute-Tüchern kann helfen</li>
                <li>Oberflächlich lockern (verhindert Verdunstung)</li>
            </ul>
        </div>

        <div class="pfl-tip">
            <h4>💡 Bei längerem Regen:</h4>
            <ul>
                <li>Staunässe vermeiden (evtl. Drainagelöcher schaffen)</li>
                <li>Trotzdem Bodenfeuchtigkeit prüfen (Regen dringt oft nicht tief genug ein!)</li>
            </ul>
        </div>
    </div>

    <div class="pfl-section">
        <h2 data-icon="🍂">Düngung</h2>
        <p>Neu gepflanzte Gehölze und Stauden benötigen in den ersten 4-6 Wochen <strong>KEINE Düngung</strong>.</p>

        <div class="pfl-important">
            <h4>Dünge-Zeitplan:</h4>
            <ul>
                <li><strong>Erste 6 Wochen:</strong> NICHT düngen!</li>
                <li><strong>Ab Woche 7:</strong> Leichte Startdüngung möglich (organischer Langzeitdünger)</li>
                <li><strong>Frühjahr (März/April):</strong> Hauptdüngung mit Kompost oder Hornspänen</li>
                <li><strong>Sommer (Juni):</strong> Optional Nachdüngung bei Bedarf</li>
            </ul>
        </div>
    </div>

    <div class="pfl-section">
        <h2 data-icon="✂️">Schnitt & Pflege</h2>

        <div class="pfl-warning">
            <h4>⚠️ KEIN Formschnitt im ersten Jahr!</h4>
            <ul>
                <li>Pflanzen sollen sich etablieren und Wurzeln bilden</li>
                <li>Nur abgestorbene oder beschädigte Triebe entfernen</li>
                <li>Verblühtes regelmäßig ausputzen (bei Stauden)</li>
            </ul>
        </div>

        <p><strong>Ab dem 2. Jahr:</strong> Formschnitt im zeitigen Frühjahr (März) oder nach der Blüte.</p>
    </div>

    <div class="pfl-section">
        <h2 data-icon="❄️">Winter</h2>

        <div class="pfl-important">
            <h4>Vorbereitung auf die kalte Jahreszeit:</h4>
            <ul>
                <li><strong>Immergrüne Gehölze:</strong> Auch im Winter an frostfreien Tagen gießen!</li>
                <li><strong>Stauden:</strong> Rückschnitt im Spätherbst oder Frühjahr</li>
                <li><strong>Wurzelschutz:</strong> Mulchschicht (10 cm) schützt vor Frost</li>
                <li><strong>Jungpflanzen:</strong> Evtl. mit Vlies schützen</li>
            </ul>
        </div>
    </div>

    <div class="pfl-footer">
        <p><strong>Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung!</strong></p>
        <p>Ihr gardenKeeper Team wünscht Ihnen viel Freude mit Ihren neuen Pflanzen!</p>
    </div>

    <div class="pfl-contact">
        <h3>📞 Kontakt</h3>
        <p><strong>gardenKeeper GmbH - Sven Krämer</strong></p>
        <p>Großblittersdorfer Str. 329, 66130 Saarbrücken</p>
        <p>Tel: 0681 9378 4009 | info@gardenkeeper.de</p>
        <p style="margin-top: 15px; font-style: italic;">"Weil Ihr Zuhause es verdient - made by gardenKeeper"</p>
    </div>
</div>
        `,

        emailTeaser: `
🌱 PFLANZ- & PFLEGEANLEITUNG

Ihre neuen Pflanzen benötigen besondere Aufmerksamkeit:

ERSTE 4 WOCHEN (KRITISCH):
▪ Täglich auf Bodenfeuchtigkeit prüfen
▪ Bei Trockenheit durchdringend wässern (5-10 Liter/m²)
▪ Morgens oder abends gießen (nie in Mittagshitze!)
▪ Unkraut regelmäßig entfernen

WICHTIG:
Die Wasserversorgung in der Anwachsphase ist entscheidend!
Natürlicher Niederschlag reicht meist NICHT aus.

Die vollständige Pflanz- und Pflegeanleitung mit allen
Details finden Sie im angehängten PDF.
        `
    },

    /**
     * 🌱 RASENPFLEGE
     */
    rasenpflege: {
        id: 'rasenpflege',
        title: 'Rasenpflege-Anleitung',
        subtitle: 'Perfekter Rasen in 4 Wochen',

        keywords: [
            'rasen', 'rasenfläche', 'aussaat', 'rasen angelegt',
            'rasen angesät', 'grünfläche', 'rasen eingesät'
        ],

        htmlContent: `
<div class="pflegeanleitung-container">
    <div class="pfl-header">
        <h1>🌱 Rasenpflege-Anleitung</h1>
        <div class="subtitle">Perfekter Rasen in 4 Wochen</div>
    </div>

    <div class="pfl-welcome-box">
        <h2>Ihr neuer Rasen braucht jetzt Ihre Aufmerksamkeit!</h2>
        <p>Die ersten 3-4 Wochen sind entscheidend für einen dichten, gesunden Rasen. Mit der richtigen Pflege wird Ihr Rasen zu einer prächtigen Grünfläche!</p>
        <p><strong>Wichtig:</strong> Konsequentes Wässern ist jetzt das A und O!</p>
    </div>

    <div class="pfl-section">
        <h2 data-icon="💧">Wässern - DER WICHTIGSTE PUNKT!</h2>

        <div class="pfl-important">
            <h4>⚠️ Erste 3 Wochen (Keimphase):</h4>
            <ul>
                <li><strong>TÄGLICH 20 Minuten wässern</strong> (früh morgens 6-8 Uhr)</li>
                <li>Gleichmäßig beregnen - keine Pfützen!</li>
                <li>Boden muss <strong>konstant feucht</strong> bleiben (NICHT nass!)</li>
                <li>Bei Hitze: Zusätzlich abends wässern</li>
                <li><strong>ABSOLUT NICHT austrocknen lassen!</strong> → Keimlinge sterben sofort ab</li>
            </ul>
        </div>

        <div class="pfl-warning">
            <h4>⚠️ HÄUFIGSTER FEHLER:</h4>
            <ul>
                <li>Zu wenig oder unregelmäßig wässern</li>
                <li>Einmal austrocknen = Neuaussaat nötig!</li>
                <li>Auch bei Regen zusätzlich wässern (reicht meist nicht)</li>
            </ul>
        </div>

        <p><strong>Ab Woche 4:</strong> Langsam reduzieren auf 3-4x pro Woche, aber dafür länger (30-40 Min.)</p>
    </div>

    <div class="pfl-section">
        <h2 data-icon="🚫">NICHT betreten!</h2>

        <div class="pfl-warning">
            <h4>⚠️ Erste 2 Wochen:</h4>
            <ul>
                <li><strong>ABSOLUT NICHT betreten!</strong></li>
                <li>Keimlinge sind extrem empfindlich</li>
                <li>Fußabdrücke = kahle Stellen</li>
                <li>Auch Haustiere fernhalten!</li>
            </ul>
        </div>

        <p><strong>Ab Woche 3:</strong> Vorsichtig betreten möglich, aber nur wenn nötig</p>
        <p><strong>Ab Woche 5:</strong> Nach dem ersten Schnitt normal nutzbar</p>
    </div>

    <div class="pfl-section">
        <h2 data-icon="✂️">Erste Mahd - Der richtige Zeitpunkt!</h2>

        <div class="pfl-important">
            <h4>Wann mähen?</h4>
            <ul>
                <li><strong>Bei 8-10 cm Höhe</strong> erstmals mähen (meist nach 3-4 Wochen)</li>
                <li><strong>Mähhöhe: 4-5 cm</strong> (NICHT kürzer!)</li>
                <li>Mäher muss <strong>scharfes Messer</strong> haben (sonst werden Halme gerissen)</li>
                <li>Rasen sollte <strong>trocken</strong> sein beim Mähen</li>
                <li>Schnittgut aufsammeln (sonst fault es)</li>
            </ul>
        </div>

        <div class="pfl-tip">
            <h4>💡 Profi-Tipp:</h4>
            <ul>
                <li>Erste 3 Schnitte: Immer auf höchster Stufe mähen</li>
                <li>Danach schrittweise auf 3-4 cm reduzieren</li>
                <li>Regelmäßig mähen (alle 5-7 Tage) → dichter Rasen!</li>
            </ul>
        </div>
    </div>

    <div class="pfl-section">
        <h2 data-icon="🌱">Düngung</h2>

        <div class="pfl-important">
            <h4>Dünge-Plan:</h4>
            <ul>
                <li><strong>Erste 4 Wochen:</strong> NICHT düngen! (Saatgut enthält Startdünger)</li>
                <li><strong>Nach dem 3. Schnitt:</strong> Erste Düngung mit Rasen-Langzeitdünger</li>
                <li><strong>Ab dann:</strong> 3-4x pro Jahr düngen (Frühjahr, Frühsommer, Spätsommer, Herbst)</li>
            </ul>
        </div>
    </div>

    <div class="pfl-section">
        <h2 data-icon="🌿">Unkraut</h2>

        <div class="pfl-tip">
            <h4>💡 Umgang mit Unkraut:</h4>
            <ul>
                <li><strong>Erste 8 Wochen:</strong> Unkraut NICHT entfernen! (würde Keimlinge stören)</li>
                <li><strong>Ab Woche 9:</strong> Unkraut von Hand ausstechen</li>
                <li><strong>Langfristig:</strong> Dichter Rasen (regelmäßig mähen + düngen) verdrängt Unkraut</li>
            </ul>
        </div>
    </div>

    <div class="pfl-footer">
        <p><strong>Geduld zahlt sich aus!</strong></p>
        <p>In 6-8 Wochen haben Sie einen dichten, belastbaren Rasen, an dem Sie viele Jahre Freude haben werden!</p>
    </div>

    <div class="pfl-contact">
        <h3>📞 Fragen? Wir helfen gerne!</h3>
        <p><strong>gardenKeeper GmbH - Sven Krämer</strong></p>
        <p>Großblittersdorfer Str. 329, 66130 Saarbrücken</p>
        <p>Tel: 0681 9378 4009 | info@gardenkeeper.de</p>
        <p style="margin-top: 15px; font-style: italic;">"Weil Ihr Zuhause es verdient - made by gardenKeeper"</p>
    </div>
</div>
        `,

        emailTeaser: `
🌱 RASENPFLEGE-ANLEITUNG

Ihr neuer Rasen braucht jetzt Ihre Aufmerksamkeit:

ERSTE 3 WOCHEN (KEIMPHASE):
▪ TÄGLICH 20 Minuten wässern (früh morgens 6-8 Uhr)
▪ Bei Hitze zusätzlich abends wässern
▪ NICHT betreten in den ersten 2 Wochen!
▪ Auf gleichmäßige Feuchtigkeit achten

ERSTE MAHD:
▪ Bei 8-10 cm Höhe erstmals mähen
▪ Mähhöhe: 4-5 cm (nicht kürzer!)
▪ Nur mit scharfem Messer

WICHTIG:
Einmal austrocknen lassen = Neuaussaat nötig!
Konsequentes Wässern ist entscheidend.

Die vollständige Rasenpflege-Anleitung finden Sie
im angehängten PDF.
        `
    }

    // ✅ WEITERE ANLEITUNGEN KÖNNEN HIER NACH DEM GLEICHEN SCHEMA HINZUGEFÜGT WERDEN!
    // Siehe ANLEITUNG am Ende der Datei
};

// =========================================
// 🔍 INTELLIGENTE KEYWORD-ERKENNUNG
// =========================================

/**
 * Analysiert den Arbeitstext und findet passende Pflegeanleitungen
 * @param {string} arbeitstext - Text aus "Durchgeführte Arbeiten"
 * @returns {Array} - Liste der gefundenen Anleitungs-IDs
 */
function detectPflegeanleitungen(arbeitstext) {
    if (!arbeitstext) return [];

    const text = arbeitstext.toLowerCase();
    const gefundeneAnleitungen = [];

    // Durchsuche alle Pflegeanleitungen
    for (const [key, anleitung] of Object.entries(PFLEGEANLEITUNGEN)) {
        // Prüfe ob ein Keyword im Text vorkommt
        const keywordGefunden = anleitung.keywords.some(keyword =>
            text.includes(keyword.toLowerCase())
        );

        if (keywordGefunden && !gefundeneAnleitungen.includes(anleitung.id)) {
            gefundeneAnleitungen.push(anleitung.id);
        }
    }

    console.log(`🔍 Gefundene Pflegeanleitungen: ${gefundeneAnleitungen.join(', ')}`);
    return gefundeneAnleitungen;
}

/**
 * Holt die Pflegeanleitung-Objekte basierend auf IDs
 * @param {Array} anleitungIds - Liste der Anleitungs-IDs
 * @returns {Array} - Liste der Pflegeanleitung-Objekte
 */
function getPflegeanleitungen(anleitungIds) {
    return anleitungIds.map(id => PFLEGEANLEITUNGEN[id]).filter(Boolean);
}

/**
 * Generiert E-Mail-Teaser für alle erkannten Anleitungen
 * @param {Array} anleitungen - Liste der Pflegeanleitung-Objekte
 * @returns {string} - Formatierter E-Mail-Text
 */
function generateEmailTeaser(anleitungen) {
    if (!anleitungen || anleitungen.length === 0) {
        return '';
    }

    let teaser = '\n\n';
    teaser += '═══════════════════════════════════════════════\n';
    teaser += '🌱 WICHTIGE PFLEGEHINWEISE\n';
    teaser += '═══════════════════════════════════════════════\n\n';

    anleitungen.forEach((anleitung, index) => {
        if (index > 0) teaser += '\n---\n\n';
        teaser += anleitung.emailTeaser;
    });

    teaser += '\n\n';
    teaser += '═══════════════════════════════════════════════\n';
    teaser += 'VOLLSTÄNDIGE ANLEITUNGEN IM PDF-ANHANG!\n';
    teaser += '═══════════════════════════════════════════════\n';

    return teaser;
}

/**
 * Generiert HTML für PDF (CSS + alle erkannten Anleitungen)
 * @param {Array} anleitungen - Liste der Pflegeanleitung-Objekte
 * @returns {string} - Formatiertes HTML inkl. CSS
 */
function generatePflegeanleitungHTML(anleitungen) {
    if (!anleitungen || anleitungen.length === 0) {
        return '';
    }

    let html = PFLEGEANLEITUNG_CSS;

    anleitungen.forEach((anleitung, index) => {
        html += anleitung.htmlContent;

        // Seitenumbruch nach jeder Anleitung (außer der letzten)
        if (index < anleitungen.length - 1) {
            html += '\n<div style="page-break-after: always;"></div>\n\n';
        }
    });

    return html;
}

// =========================================
// 🚀 HAUPTFUNKTION - WIRD VOM FORMULAR AUFGERUFEN
// =========================================

/**
 * Analysiert alle Arbeitstage und generiert entsprechende Pflegeanleitungen
 * @param {Array} days - Array mit allen Arbeitstagen aus dem Formular
 * @returns {Object} - { anleitungen, emailText, pdfHTML }
 */
function analyzePflegeanleitungen(days) {
    console.log('🌱 Analysiere Pflegeanleitungen...');

    // Sammle alle Arbeitsbeschreibungen
    let gesamterArbeitstext = '';
    days.forEach(day => {
        if (day.beschreibungArbeiten) {
            gesamterArbeitstext += ' ' + day.beschreibungArbeiten;
        }
    });

    // Erkenne Anleitungen
    const anleitungIds = detectPflegeanleitungen(gesamterArbeitstext);
    const anleitungen = getPflegeanleitungen(anleitungIds);

    // Generiere Outputs
    const emailText = generateEmailTeaser(anleitungen);
    const pdfHTML = generatePflegeanleitungHTML(anleitungen);

    console.log(`✅ ${anleitungen.length} Pflegeanleitung(en) gefunden`);

    return {
        anleitungen,
        emailText,
        pdfHTML,
        count: anleitungen.length
    };
}

// =========================================
// 📝 ANLEITUNG: NEUE PFLEGEANLEITUNG HINZUFÜGEN
// =========================================

/**
 * SO EINFACH FÜGEN SIE NEUE ANLEITUNGEN HINZU:
 *
 * 1. Kopieren Sie ein bestehendes Template (z.B. 'pflanzanleitung')
 * 2. Ändern Sie:
 *    - id (muss einzigartig sein!)
 *    - title & subtitle
 *    - keywords (alle relevanten Begriffe)
 *    - htmlContent (nutzen Sie die vorhandenen CSS-Klassen!)
 *    - emailTeaser (kurz & knackig)
 * 3. Fügen Sie das neue Objekt zu PFLEGEANLEITUNGEN hinzu
 *
 * FERTIG! Das System erkennt es automatisch!
 *
 * BEISPIEL:
 *
 * baumpflege: {
 *     id: 'baumpflege',
 *     title: 'Baumpflege-Anleitung',
 *     subtitle: 'Starke, gesunde Bäume',
 *     keywords: ['baum', 'baumpflanzung', 'obstbaum', 'zierbaum'],
 *     htmlContent: `<div class="pflegeanleitung-container">...</div>`,
 *     emailTeaser: `🌳 BAUMPFLEGE-ANLEITUNG\n\n...`
 * }
 *
 * VERFÜGBARE CSS-KLASSEN:
 * - .pflegeanleitung-container  (Hauptcontainer)
 * - .pfl-header                 (Kopfzeile mit Titel)
 * - .pfl-welcome-box            (Willkommensbox)
 * - .pfl-section                (Hauptabschnitt)
 * - .pfl-important              (Gelbe Wichtig-Box)
 * - .pfl-warning                (Rote Warnungs-Box)
 * - .pfl-tip                    (Türkise Tipp-Box)
 * - .pfl-table                  (Tabelle)
 * - .pfl-footer                 (Fußzeile)
 * - .pfl-contact                (Kontakt-Box)
 */

// Export für Browser-Verwendung
if (typeof window !== 'undefined') {
    window.PFLEGEANLEITUNGEN = PFLEGEANLEITUNGEN;
    window.detectPflegeanleitungen = detectPflegeanleitungen;
    window.getPflegeanleitungen = getPflegeanleitungen;
    window.generateEmailTeaser = generateEmailTeaser;
    window.generatePflegeanleitungHTML = generatePflegeanleitungHTML;
    window.analyzePflegeanleitungen = analyzePflegeanleitungen;

    console.log('✅ Pflegeanleitung-System geladen!');
}
