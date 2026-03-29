/**
 * Color Theme Manager
 * Manages application theme colors via CSS variables
 * Saves preferences to localStorage
 */

const ColorManager = {
    // Default colors for both applications
    defaults: {
        primary: '#007AFF',
        secondary: '#34C759',
        accent: '#FF9500'
    },

    /**
     * Initialize color manager
     */
    async init() {
        // Load colors from server or use defaults
        await this.loadColors();
        
        // Setup event listeners if we're in admin panel (settings-primary-color exists)
        if (document.getElementById('settings-primary-color')) {
            this.setupColorInputs();
        }
    },

    /**
     * Apply colors to CSS variables
     */
    applyColors(colors) {
        if (!colors) return;
        
        const root = document.documentElement;
        root.style.setProperty('--primary-color', colors.primary || this.defaults.primary);
        root.style.setProperty('--secondary-color', colors.secondary || this.defaults.secondary);
        root.style.setProperty('--accent-color', colors.accent || this.defaults.accent);
        
        // Also update legacy variables for compatibility
        root.style.setProperty('--primary', colors.primary || this.defaults.primary);
        root.style.setProperty('--secondary', colors.secondary || this.defaults.secondary);
        root.style.setProperty('--accent', colors.accent || this.defaults.accent);
        
        // Update accent colors derived from primary/secondary
        root.style.setProperty('--accent-green', colors.secondary || this.defaults.secondary);
        root.style.setProperty('--accent-orange', colors.accent || this.defaults.accent);
    },

    /**
     * Load colors from server and apply them
     */
    async loadColors() {
        try {
            // Check if loadColorsApi is available (it should be in storage.js)
            if (typeof window.loadColorsApi === 'function') {
                const colors = await window.loadColorsApi();
                this.applyColors(colors);
                return colors;
            } else {
                console.warn('loadColorsApi not found, using defaults');
                this.applyColors(this.defaults);
                return this.defaults;
            }
        } catch (error) {
            console.error('Error loading colors:', error);
            this.applyColors(this.defaults);
            return this.defaults;
        }
    },

    /**
     * Save colors to server
     */
    async saveColors(colors) {
        try {
            if (typeof window.saveColorsApi === 'function') {
                await window.saveColorsApi(colors);
                this.applyColors(colors);
                return true;
            } else {
                console.warn('saveColorsApi not found');
                return false;
            }
        } catch (error) {
            console.error('Error saving colors:', error);
            return false;
        }
    },

    /**
     * Get current colors
     */
    getColors() {
        const root = document.documentElement;
        return {
            primary: root.style.getPropertyValue('--primary-color').trim() || this.defaults.primary,
            secondary: root.style.getPropertyValue('--secondary-color').trim() || this.defaults.secondary,
            accent: root.style.getPropertyValue('--accent-color').trim() || this.defaults.accent
        };
    },

    /**
     * Setup color input listeners in admin panel
     */
    setupColorInputs() {
        const colors = this.getColors();

        // Primary color
        const primaryInput = document.getElementById('settings-primary-color');
        const primaryHex = document.getElementById('settings-primary-color-hex');
        
        if (primaryInput) {
            primaryInput.value = this.rgbToHex(colors.primary);
            primaryInput.addEventListener('change', (e) => {
                this.updateColorInput(e.target, primaryHex, 'primary');
            });
        }

        if (primaryHex) {
            primaryHex.value = colors.primary;
            primaryHex.addEventListener('change', (e) => {
                this.updateHexInput(e.target, primaryInput, 'primary');
            });
            primaryHex.addEventListener('input', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    this.updateHexInput(e.target, primaryInput, 'primary');
                }
            });
        }

        // Secondary color
        const secondaryInput = document.getElementById('settings-secondary-color');
        const secondaryHex = document.getElementById('settings-secondary-color-hex');
        
        if (secondaryInput) {
            secondaryInput.value = this.rgbToHex(colors.secondary);
            secondaryInput.addEventListener('change', (e) => {
                this.updateColorInput(e.target, secondaryHex, 'secondary');
            });
        }

        if (secondaryHex) {
            secondaryHex.value = colors.secondary;
            secondaryHex.addEventListener('change', (e) => {
                this.updateHexInput(e.target, secondaryInput, 'secondary');
            });
            secondaryHex.addEventListener('input', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    this.updateHexInput(e.target, secondaryInput, 'secondary');
                }
            });
        }

        // Accent color
        const accentInput = document.getElementById('settings-accent-color');
        const accentHex = document.getElementById('settings-accent-color-hex');
        
        if (accentInput) {
            accentInput.value = this.rgbToHex(colors.accent);
            accentInput.addEventListener('change', (e) => {
                this.updateColorInput(e.target, accentHex, 'accent');
            });
        }

        if (accentHex) {
            accentHex.value = colors.accent;
            accentHex.addEventListener('change', (e) => {
                this.updateHexInput(e.target, accentInput, 'accent');
            });
            accentHex.addEventListener('input', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    this.updateHexInput(e.target, accentInput, 'accent');
                }
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-colors-button');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetColors();
                this.showColorsSaved();
            });
        }
    },

    /**
     * Update color input and apply changes
     */
    updateColorInput(colorInput, hexInput, colorType) {
        const hex = this.rgbToHex(colorInput.value);
        if (hexInput) hexInput.value = hex;
        this.updateCurrentColors(colorType, hex);
    },

    /**
     * Update hex input and apply changes
     */
    updateHexInput(hexInput, colorInput, colorType) {
        const hex = hexInput.value.startsWith('#') ? hexInput.value : '#' + hexInput.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            if (colorInput) colorInput.value = hex;
            this.updateCurrentColors(colorType, hex);
        }
    },

    /**
     * Update current colors
     */
    updateCurrentColors(colorType, value) {
        const colors = this.getColors();
        colors[colorType] = value;
        this.saveColors(colors);
    },

    /**
     * Reset colors to defaults
     */
    resetColors() {
        this.saveColors(this.defaults);
        
        // Update inputs
        const primaryInput = document.getElementById('settings-primary-color');
        const primaryHex = document.getElementById('settings-primary-color-hex');
        if (primaryInput) primaryInput.value = this.rgbToHex(this.defaults.primary);
        if (primaryHex) primaryHex.value = this.defaults.primary;

        const secondaryInput = document.getElementById('settings-secondary-color');
        const secondaryHex = document.getElementById('settings-secondary-color-hex');
        if (secondaryInput) secondaryInput.value = this.rgbToHex(this.defaults.secondary);
        if (secondaryHex) secondaryHex.value = this.defaults.secondary;

        const accentInput = document.getElementById('settings-accent-color');
        const accentHex = document.getElementById('settings-accent-color-hex');
        if (accentInput) accentInput.value = this.rgbToHex(this.defaults.accent);
        if (accentHex) accentHex.value = this.defaults.accent;
    },

    /**
     * Show colors saved message (if in admin panel)
     */
    showColorsSaved() {
        // This can be integrated with existing notification system
        console.log('Cores salvas com sucesso!');
    },

    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert RGB to hex color
     */
    rgbToHex(rgb) {
        // If already hex, return it
        if (typeof rgb === 'string' && rgb.startsWith('#')) {
            return rgb;
        }
        
        // Parse rgb string format
        if (typeof rgb === 'string' && rgb.startsWith('rgb')) {
            const match = rgb.match(/\d+/g);
            if (match && match.length >= 3) {
                return '#' + [
                    parseInt(match[0]).toString(16).padStart(2, '0'),
                    parseInt(match[1]).toString(16).padStart(2, '0'),
                    parseInt(match[2]).toString(16).padStart(2, '0')
                ].join('').toUpperCase();
            }
        }
        
        return rgb;
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ColorManager.init());
} else {
    ColorManager.init();
}
