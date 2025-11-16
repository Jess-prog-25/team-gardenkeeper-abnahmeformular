/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🍁 gardenKeeper® - EVENT AUTO-LOADER
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Lädt automatisch Daten aus Google Calendar Events:
 * - Kundenname
 * - Kunden-Email
 * - LexOffice-ID
 * - Projektbeschreibung
 * - Google Doc Link (für Arbeitspositionen)
 *
 * VERSION: 2025.11.15
 * © gardenKeeper GmbH 2025
 * ═══════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════
    // KONFIGURATION
    // ═══════════════════════════════════════════════════════════════════

    const CONFIG = {
        // ⚠️ WICHTIG: Hier die Apps Script URL eintragen!
        // Nach dem Deployment: Apps Script → "Bereitstellen" → "Als Web-App bereitstellen"
        // Die URL kopieren und hier einfügen:
        APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxajxH7qCrerYJKQTZQxPPkVhGJvTjYDOoFGtuPcoF6S2ggxMZCcNKdoiGdf3RgSdbBng/exec',

        TIMEOUT: 10000, // 10 Sekunden Timeout für API-Aufrufe
        DEBUG: true     // Debug-Modus (Console-Logs)
    };

    // ═══════════════════════════════════════════════════════════════════
    // HILFSFUNKTIONEN
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Extrahiert Event-ID aus URL
     */
    function getEventIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('event');
    }

    /**
     * Debug-Log
     */
    function log(message, data) {
        if (CONFIG.DEBUG) {
            if (data !== undefined) {
                console.log('🍁 EventLoader:', message, data);
            } else {
                console.log('🍁 EventLoader:', message);
            }
        }
    }

    /**
     * Zeigt Lade-Indikator
     */
    function showLoadingIndicator(message) {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.textContent = message || '⏳ Lade Event-Daten...';
            indicator.style.display = 'block';
        }
    }

    /**
     * Versteckt Lade-Indikator
     */
    function hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // API-AUFRUFE
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Lädt Event-Daten vom Apps Script
     */
    async function loadEventData(eventId) {
        log('Lade Event-Daten für ID:', eventId);

        // URL prüfen
        if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL === 'HIER_APPS_SCRIPT_URL_EINTRAGEN') {
            log('❌ Apps Script URL nicht konfiguriert!');
            return null;
        }

        try {
            const url = `${CONFIG.APPS_SCRIPT_URL}?action=getEventData&eventId=${encodeURIComponent(eventId)}`;

            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            log('Event-Daten empfangen:', data);

            return data;

        } catch (error) {
            log('❌ Fehler beim Laden der Event-Daten:', error);
            return null;
        }
    }

    /**
     * Lädt Positionen aus Google Doc
     */
    async function loadDocPositions(docUrl) {
        log('Lade Positionen aus Google Doc:', docUrl);

        if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL === 'HIER_APPS_SCRIPT_URL_EINTRAGEN') {
            log('❌ Apps Script URL nicht konfiguriert!');
            return [];
        }

        try {
            const url = `${CONFIG.APPS_SCRIPT_URL}?action=parseDoc&docUrl=${encodeURIComponent(docUrl)}`;

            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && data.positions) {
                log('Positionen empfangen:', data.positions);
                return data.positions;
            }

            return [];

        } catch (error) {
            log('❌ Fehler beim Laden der Positionen:', error);
            return [];
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // FORMULAR-BEFÜLLUNG
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Füllt Formular-Felder aus
     */
    function fillFormFields(eventData) {
        if (!eventData || !eventData.success) {
            log('❌ Keine gültigen Event-Daten zum Befüllen');
            return;
        }

        log('Fülle Formular-Felder aus...');

        // Kundenname
        if (eventData.kunde) {
            const kundeField = document.getElementById('kunde');
            if (kundeField && !kundeField.value) {
                kundeField.value = eventData.kunde;
                log('✅ Kunde gesetzt:', eventData.kunde);
            }
        }

        // Kunden-Email
        if (eventData.kundenEmail) {
            const emailField = document.getElementById('kundenEmail');
            if (emailField && !emailField.value) {
                emailField.value = eventData.kundenEmail;
                log('✅ Email gesetzt:', eventData.kundenEmail);
            }
        }

        // LexOffice-ID
        if (eventData.lexofficeId) {
            const lexField = document.getElementById('lexofficeId');
            if (lexField && !lexField.value) {
                lexField.value = eventData.lexofficeId;
                log('✅ LexOffice-ID gesetzt:', eventData.lexofficeId);
            }
        }

        // Projektbeschreibung (optional)
        if (eventData.projektbeschreibung) {
            const beschreibungField = document.querySelector('textarea[name="projektbeschreibung"]');
            if (beschreibungField && !beschreibungField.value) {
                beschreibungField.value = eventData.projektbeschreibung;
                log('✅ Projektbeschreibung gesetzt');
            }
        }

        // Event-ID speichern (für spätere Verwendung)
        if (eventData.eventId) {
            const eventIdField = document.getElementById('eventId');
            if (eventIdField) {
                eventIdField.value = eventData.eventId;
            }
        }
    }

    /**
     * Erstellt Checkboxen für Arbeitspositionen
     */
    function createPositionCheckboxes(positions) {
        if (!positions || positions.length === 0) {
            log('Keine Positionen zum Anzeigen');
            return;
        }

        log('Erstelle Checkboxen für Positionen:', positions);

        // Container finden oder erstellen
        let container = document.getElementById('positions-container');
        if (!container) {
            // Wenn Container nicht existiert, nach einem geeigneten Platz suchen
            const form = document.querySelector('form');
            if (form) {
                container = document.createElement('div');
                container.id = 'positions-container';
                container.className = 'section';

                // Nach Kunde/LexOffice Feldern einfügen
                const kundeSection = document.querySelector('.section:has(#kunde)');
                if (kundeSection && kundeSection.nextSibling) {
                    form.insertBefore(container, kundeSection.nextSibling);
                } else {
                    form.insertBefore(container, form.firstChild);
                }
            } else {
                log('❌ Kein Formular gefunden!');
                return;
            }
        }

        // HTML für Positionen erstellen
        let html = '<div class="section-header">';
        html += '<h3>📋 Arbeitspositionen (aus Google Doc)</h3>';
        html += '<p style="color: #666; font-size: 0.9em;">Wählen Sie die erledigten Positionen aus:</p>';
        html += '</div>';
        html += '<div class="checkbox-grid">';

        positions.forEach((position, index) => {
            const id = `position-${index}`;
            html += `
                <div class="checkbox-item">
                    <input type="checkbox"
                           id="${id}"
                           name="position"
                           value="${position.text || position}"
                           class="position-checkbox">
                    <label for="${id}">
                        <strong>Position ${index + 1}:</strong>
                        ${position.text || position}
                    </label>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        log('✅ Checkboxen erstellt für', positions.length, 'Positionen');
    }

    // ═══════════════════════════════════════════════════════════════════
    // HAUPT-FUNKTION
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Initialisiert Auto-Loading
     */
    async function initAutoLoader() {
        log('🚀 Event Auto-Loader gestartet');

        // Event-ID aus URL lesen
        const eventId = getEventIdFromURL();

        if (!eventId) {
            log('ℹ️ Keine Event-ID in URL gefunden - normaler Modus');
            return;
        }

        log('Event-ID gefunden:', eventId);
        showLoadingIndicator('⏳ Lade Event-Daten...');

        // Event-Daten laden
        const eventData = await loadEventData(eventId);

        if (eventData && eventData.success) {
            log('✅ Event-Daten erfolgreich geladen');

            // Formular befüllen
            fillFormFields(eventData);

            // Wenn Google Doc Link vorhanden, Positionen laden
            if (eventData.googleDocLink) {
                showLoadingIndicator('⏳ Lade Arbeitspositionen...');
                const positions = await loadDocPositions(eventData.googleDocLink);

                if (positions && positions.length > 0) {
                    createPositionCheckboxes(positions);
                }
            }

            hideLoadingIndicator();

            // Info-Nachricht anzeigen
            const infoDiv = document.createElement('div');
            infoDiv.className = 'success-message';
            infoDiv.style.cssText = 'background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;';
            infoDiv.innerHTML = `
                <strong>✅ Event-Daten automatisch geladen!</strong><br>
                <small>Kunde: ${eventData.kunde || '-'} | LexOffice: ${eventData.lexofficeId || '-'}</small>
            `;

            const form = document.querySelector('form');
            if (form && form.firstChild) {
                form.insertBefore(infoDiv, form.firstChild);
            }

        } else {
            hideLoadingIndicator();
            log('⚠️ Event-Daten konnten nicht geladen werden');

            // Warnung anzeigen
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning-message';
            warningDiv.style.cssText = 'background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;';
            warningDiv.innerHTML = `
                <strong>⚠️ Event-Daten konnten nicht geladen werden</strong><br>
                <small>Bitte Daten manuell eingeben. Event-ID: ${eventId}</small>
            `;

            const form = document.querySelector('form');
            if (form && form.firstChild) {
                form.insertBefore(warningDiv, form.firstChild);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // INITIALISIERUNG
    // ═══════════════════════════════════════════════════════════════════

    // Warte auf DOM-Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoLoader);
    } else {
        // DOM bereits geladen
        initAutoLoader();
    }

    // Export für Debug
    window.gardenKeeperEventLoader = {
        loadEventData,
        loadDocPositions,
        fillFormFields,
        createPositionCheckboxes,
        getEventIdFromURL,
        version: '2025.11.15'
    };

    log('✅ Event Auto-Loader Modul geladen');

})();
