import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import "./awtrix-live-card-editor.js";
import { handleAction } from "./utils.js";

class AwtrixLiveCard extends LitElement {
  static properties = {
    hass: {},
    config: {},
    pictureUrl: {},
  };

  _refreshInterval;

  constructor() {
    super();
    this.pictureUrl = "";
  }

  static getConfigElement() {
    return document.createElement("awtrix-live-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:awtrix-live-card",
      title: "AWTRIX Live",
      refresh_interval: 5,
      url: "",
      noMargin: true,
      tap_action: { action: "none" },
    };
  }

  setConfig(config) {
    if (!config.url) {
      throw new Error("You need to define your awtrix ip");
    }
    this.config = config;
  }

  connectedCallback() {
    super.connectedCallback?.();

    const refreshTime = (this.config.refresh_interval || 2000) ;
    clearInterval(this._refreshInterval);
    this._refreshInterval = setInterval(
      () => (this.pictureUrl = this._getTimestampedUrl()),
      refreshTime
    );
    this.pictureUrl = this._getTimestampedUrl();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
    }
  }

  render() {
    const { noMargin, title } = this.config;
    return html`
      <ha-card header=${title} @click="${this._onClick}">
        <div class=${noMargin ? "withoutMargin" : "withMargin"}>
          <img class="center" src="${this.pictureUrl}" />
        </div>
      </ha-card>
    `;
  }

  _onClick() {
    const { config, hass } = this;
    const { tap_action } = config;
    if (!tap_action) {
      return;
    }
    handleAction(this, hass, config, tap_action);
  }

  static styles = css`
    .center {
      display: block;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: auto;
      margin-right: auto;
      background: var(
        --ha-card-background,
        var(--card-background-color, white)
      );
      box-shadow: var(--ha-card-box-shadow, none);
      box-sizing: border-box;
      border-width: var(--ha-card-border-width, 1px);
      border-style: solid;
      border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      color: var(--primary-text-color);
      transition: all 0.3s ease-out 0s;
      position: relative;
      border-radius: var(--ha-card-border-radius, 12px);
      width: 100%;
      image-rendering: pixelated;
    }
    .withMargin {
      margin: 5%;
    }
    .withoutMargin {
      margin: 0;
    }
    .txt {
      color: var(--ha-card-header-color, --primary-text-color);
      font-family: var(--ha-card-header-font-family, inherit);
      font-size: var(--ha-card-header-font-size, 24px);
      letter-spacing: -0.012em;
      line-height: 32px;
    }
  `;

  _getPictureUrl() {
    const { url } = this.config;
      return url;
  }

  _getTimestampedUrl() {
    let url = this._getPictureUrl();
    
    if(url.indexOf("?") > -1){
        url = url + "&currentTimeCache=" + (new Date().getTime())
      }else{
        url = url + "?currentTimeCache=" + (new Date().getTime())
      }
    
    return url || "";
  }

  getCardSize() {
    return 3;
  }
}

const cardDef = {
  type: "awtrix-live-card",
  name: "AWTRIX Live Card",
  description:
    "Shows the actual matrix",
  preview: true,
  documentationURL: "https://github.com/blueforcer/awtrix-live-card",
  configurable: true,
};
window.customCards = window.customCards || [];
window.customCards.push(cardDef);

customElements.define("awtrix-live-card", AwtrixLiveCard);
