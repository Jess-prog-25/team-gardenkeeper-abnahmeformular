/* ========================================
   🍁 gardenKeeper® - GOOGLEDOCS.JS
   Version: 2026.01 - Google Docs Integration
   ======================================== */

// ========================================
// 📄 GOOGLE DOCS POSITION PARSER
// ========================================

/**
 * Parst Google Doc Text und extrahiert Arbeitspositionen
 * @param {string} docText - Der komplette Text aus dem Google Doc
 * @returns {Array} Array mit Position-Objekten
 */
function parseGoogleDocPositions(docText) {
    if (!docText || typeof docText !== 'string') {
        console.error('❌ Ungültiger docText:', docText);
        return [];
    }

    const positions = [];
    const positionRegex = /[▶►]?\s*Position\s+(\d+)\s*:\s*([^\n]+)/gi;
    let match;
    const matches = [];

    // Sammle alle Positionen
    while ((match = positionRegex.exec(docText)) !== null) {
        matches.push({
            index: match.index,
            id: match[1],
            title: match[2].trim(),
            fullMatch: match[0]
        });
    }

    // Extrahiere Details für jede Position
    matches.forEach((currentMatch, idx) => {
        const nextMatch = matches[idx + 1];
        const startIndex = currentMatch.index + currentMatch.fullMatch.length;
        const endIndex = nextMatch ? nextMatch.index : docText.length;
        
        const sectionText = docText.substring(startIndex, endIndex);
        
        // Extrahiere Menge
        const quantityData = extractQuantityAndUnit(sectionText);
        
        // Extrahiere Beschreibung
        const descMatch = sectionText.match(/Beschreibung:\s*([^\n]+)/i);
        const description = descMatch ? descMatch[1].trim() : '';
        
        // Kategorisiere Position
        const category = categorizePosition(currentMatch.title, description);
        
        positions.push({
            id: currentMatch.id,
            title: currentMatch.title,
            description: description,
            quantity: quantityData.quantity,
            unit: quantityData.unit,
            category: category,
            fullText: sectionText.trim()
        });
    });

    console.log(`✅ ${positions.length} Positionen gefunden`);
    return positions;
}

/**
 * Extrahiert Menge und Einheit aus Text
 * @param {string} text - Text-Abschnitt
 * @returns {Object} {quantity, unit}
 */
function extractQuantityAndUnit(text) {
    const patterns = [
        /Menge:\s*(\d+(?:[.,]\d+)?)\s*([^\n]+)/i,
        /(\d+(?:[.,]\d+)?)\s*(m²|m2|qm|lfm|lfd\.\s*m|Stück|Stk|St\.|cbm|m³|m3)/i
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return {
                quantity: parseFloat(match[1].replace(',', '.')),
                unit: match[2].trim()
            };
        }
    }
    
    return { quantity: null, unit: null };
}

/**
 * Kategorisiert eine Position
 * @param {string} title - Positions-Titel
 * @param {string} description - Beschreibung
 * @returns {string} Kategorie: 'plant', 'skip', 'default'
 */
function categorizePosition(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    // Pflanzen-Keywords
    const plantKeywords = [
        'pflanzen', 'pflanze', 'liefern und pflanzen', 
        'staude', 'gehölz', 'baum', 'strauch',
        'lavandula', 'rosa', 'prunus'
    ];
    
    if (plantKeywords.some(keyword => text.includes(keyword))) {
        return 'plant';
    }
    
    // Überspringen-Keywords
    const skipKeywords = [
        'std', 'stunden', 'anfahrt', 'pauschal',
        'km', 'kilometer', 'kostenschätzung'
    ];
    
    if (skipKeywords.some(keyword => text.includes(keyword))) {
        return 'skip';
    }
    
    return 'default';
}

// ========================================
// 🎨 CHECKBOX-GENERIERUNG
// ========================================

/**
 * Generiert HTML-Checkboxen aus Positionen
 * @param {Array} positions - Array mit Position-Objekten
 * @returns {string} HTML-String
 */
function generateDynamicCheckboxes(positions) {
    if (!positions || positions.length === 0) {
        return '<p style="color: #666; font-style: italic;">Keine Positionen gefunden.</p>';
    }

    let html = '<div class="positions-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; margin-top: 20px;">';
    
    positions.forEach(pos => {
        // Überspringe SKIP Positionen
        if (pos.category === 'skip') {
            console.log(`⏭️ Überspringe Position: ${pos.title}`);
            return;
        }
        
        const categoryClass = pos.category === 'plant' ? 'position-plant' : 'position-work';
        const categoryIcon = pos.category === 'plant' ? '🌱' : '🔧';
        
        html += `
            <div class="position-item ${categoryClass}" 
                 data-category="${pos.category}"
                 style="background: #f5f3f0; padding: 15px; border-radius: 10px; border: 2px solid #e8e5e2;">
                <label style="display: flex; align-items: start; gap: 10px; cursor: pointer;">
                    <input type="checkbox" 
                           class="position-checkbox" 
                           data-position-id="${pos.id}"
                           data-position-title="${escapeHtml(pos.title)}"
                           data-position-description="${escapeHtml(pos.description)}"
                           onchange="updateDescriptionFromCheckboxes()"
                           style="margin-top: 4px; width: 18px; height: 18px; accent-color: #8a9876;">
                    <div style="flex: 1;">
                        <strong style="color: #2d3e2d;">${categoryIcon} ${escapeHtml(pos.title)}</strong>
                        ${pos.description ? `<p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">${escapeHtml(pos.description)}</p>` : ''}
                        ${pos.quantity ? `<span style="display: inline-block; margin-top: 5px; padding: 3px 8px; background: #8a9876; color: white; border-radius: 5px; font-size: 0.85rem;">📏 ${pos.quantity} ${pos.unit || ''}</span>` : ''}
                    </div>
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Info-Text
    html += `
        <div style="margin-top: 20px; padding: 12px; background: #d1ecf1; border-left: 4px solid #0c5460; border-radius: 5px;">
            <strong>💡 Hinweis:</strong> Haken Sie die erledigten Positionen ab. 
            Die Beschreibung wird automatisch generiert.
        </div>
    `;
    
    return html;
}

/**
 * Aktualisiert die Arbeits-Beschreibung basierend auf Checkboxen
 */
function updateDescriptionFromCheckboxes() {
    const checkboxes = document.querySelectorAll('.position-checkbox:checked');
    const descriptions = [];
    
    checkboxes.forEach(checkbox => {
        const title = checkbox.dataset.positionTitle;
        const description = checkbox.dataset.positionDescription;
        
        if (title) {
            let text = `✓ ${title}`;
            if (description) {
                text += ` (${description})`;
            }
            descriptions.push(text);
        }
    });
    
    // Finde Textarea für Arbeitsbeschreibung
    const textarea = document.querySelector('.beschreibung-arbeiten');
    if (textarea) {
        if (descriptions.length > 0) {
            textarea.value = descriptions.join('\n\n');
            textarea.style.display = 'none'; // Verstecken wenn Checkboxen genutzt werden
        } else {
            textarea.style.display = 'block'; // Zeigen wenn keine Checkboxen aktiv
        }
    }
}

/**
 * Initialisiert Checkbox-Handler
 */
function initializeCheckboxHandlers() {
    const checkboxes = document.querySelectorAll('.position-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDescriptionFromCheckboxes);
    });
    console.log(`✅ ${checkboxes.length} Checkbox-Handler initialisiert`);
}

/**
 * Schaltet zwischen Checkbox- und Manual-Modus um
 * @param {boolean} useCheckboxes - true = Checkboxen, false = Textarea
 */
function toggleManualDescription(useCheckboxes) {
    const positionsContainer = document.getElementById('positions-container');
    const textarea = document.querySelector('.beschreibung-arbeiten');
    
    if (useCheckboxes && positionsContainer) {
        positionsContainer.style.display = 'block';
        if (textarea) textarea.style.display = 'none';
    } else {
        if (positionsContainer) positionsContainer.style.display = 'none';
        if (textarea) textarea.style.display = 'block';
    }
}

// ========================================
// 📥 GOOGLE DOC LADEN
// ========================================

/**
 * Lädt Google Doc und parsed Positionen
 * @param {Object} eventData - Event-Daten mit Google Doc Link
 * @returns {Promise<Array|null>} Positionen oder null bei Fehler
 */
async function loadGoogleDocPositions(eventData) {
    try {
        console.log('📄 Lade Google Doc Positionen...');
        
        if (!eventData || !eventData.description) {
            console.log('❌ Keine Event-Beschreibung vorhanden');
            return null;
        }
        
        // Suche Google Doc Link in Beschreibung
        const description = eventData.description || '';
        const docLinkMatch = description.match(/https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
        
        if (!docLinkMatch) {
            console.log('ℹ️ Kein Google Doc Link gefunden');
            return null;
        }
        
        const docId = docLinkMatch[1];
        console.log('📄 Google Doc ID gefunden:', docId);
        
        // Rufe Apps Script auf
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getGoogleDoc&docId=${docId}`;
        console.log('🔗 API Call:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Google Doc konnte nicht geladen werden');
        }
        
        console.log(`✅ Google Doc geladen (${data.docText.length} Zeichen)`);
        
        // Parse Positionen
        const positions = parseGoogleDocPositions(data.docText);
        
        if (positions.length === 0) {
            console.log('⚠️ Keine Positionen im Google Doc gefunden');
            return null;
        }
        
        // Zeige Checkboxen an
        displayPositionsAsCheckboxes(positions);
        
        return positions;
        
    } catch (error) {
        console.error('❌ Fehler beim Laden von Google Doc:', error);
        showMessage('❌ Google Doc konnte nicht geladen werden: ' + error.message, 'error');
        return null;
    }
}

/**
 * Zeigt Positionen als Checkboxen im UI an
 * @param {Array} positions - Array mit Positionen
 */
function displayPositionsAsCheckboxes(positions) {
    const container = document.getElementById('positions-container');
    
    if (!container) {
        console.warn('⚠️ #positions-container nicht gefunden im HTML!');
        return;
    }
    
    // Generiere HTML
    const html = generateDynamicCheckboxes(positions);
    container.innerHTML = html;
    
    // Initialisiere Handler
    initializeCheckboxHandlers();
    
    // Verstecke manuelle Textarea
    const textarea = document.querySelector('.beschreibung-arbeiten');
    if (textarea) {
        textarea.style.display = 'none';
    }
    
    console.log(`✅ ${positions.length} Positionen als Checkboxen angezeigt`);
}

// ========================================
// 🔧 HILFSFUNKTIONEN
// ========================================

/**
 * Escaped HTML um XSS zu verhindern
 * @param {string} text - Text zum escapen
 * @returns {string} Escaped Text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// 📤 EXPORT FÜR ANDERE MODULE
// ========================================

if (typeof window !== 'undefined') {
    window.parseGoogleDocPositions = parseGoogleDocPositions;
    window.extractQuantityAndUnit = extractQuantityAndUnit;
    window.categorizePosition = categorizePosition;
    window.generateDynamicCheckboxes = generateDynamicCheckboxes;
    window.updateDescriptionFromCheckboxes = updateDescriptionFromCheckboxes;
    window.initializeCheckboxHandlers = initializeCheckboxHandlers;
    window.toggleManualDescription = toggleManualDescription;
    window.loadGoogleDocPositions = loadGoogleDocPositions;
    window.displayPositionsAsCheckboxes = displayPositionsAsCheckboxes;
    window.escapeHtml = escapeHtml;
}

console.log('✅ Google Docs-Modul geladen');
