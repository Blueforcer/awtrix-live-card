class AwtrixLiveCard  extends HTMLElement {

    set hass(hass) {
      if (!this.content) {
        const card = document.createElement('ha-card');
        this.content = document.createElement('div');
        this.content.style.padding = '0 16px 16px';
        card.appendChild(this.content);
        this.appendChild(card);
      }
  
      const entityId = this.config.entity;
      const state = hass.states[entityId];
      const updateInterval = this.config.update_interval || 10; // default to 10 seconds if not provided
  
      if(this._updateTimeout) {
        clearTimeout(this._updateTimeout);
      }
  
      this._updateTimeout = setTimeout(() => this.hass = hass, updateInterval * 1000);
  
      this.content.innerHTML = `
        <ha-camera-card .hass=${hass} .stateObj=${state}></ha-camera-card>
      `;
    }
  
    setConfig(config) {
      if (!config.entity) {
        throw new Error('You need to define an entity');
      }
      this.config = config;
    }
  
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define('awtrix-live-card', AwtrixLiveCard);
  