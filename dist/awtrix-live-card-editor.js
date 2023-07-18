import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import { fireEvent } from "./utils.js";

const SCHEMA = [
  { name: "title",
   selector: { text: {} }
  },
  { name: "awtrix_ip",
   selector: { text: {}},
  required: true
  },
  {
    name: "refresh_interval",
    required: true,
    selector: { number: { min: 1 } },
  },
  { name: "noMargin", selector: { boolean: {} } },
];

class AwtrixLiveCardEditor extends LitElement {
  static properties = {
    hass: {},
    _config: {},
  };

  setConfig(config) {
    this._config = config;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabelCallback}
        @value-changed=${this._valueChanged}
      />
    `;
  }

  _valueChanged = (ev) =>
    fireEvent(this, "config-changed", { config: ev.detail.value });

  _computeLabelCallback = (schema) => {
    const { name } = schema;
    switch (name) {
      case "noMargin":
        return "Remove margin";
      // return this.hass.localize(
      //   `awtrix-live-card.${name}`
      // );
      case "refresh_interval":
        return this.hass.localize(
          `ui.panel.lovelace.editor.card.generic.${name}`
        );
      default:
        return `${this.hass.localize(
          `ui.panel.lovelace.editor.card.generic.${name}`
        )} (${this.hass.localize(
          "ui.panel.lovelace.editor.card.config.optional"
        )})`;
    }
  };

  static styles = css`
    .card-config {
      /* Cancels overlapping Margins for HAForm + Card Config options */
      overflow: auto;
    }
    ha-switch {
      padding: 16px 6px;
    }
    .side-by-side {
      display: flex;
      align-items: flex-end;
    }
    .side-by-side > * {
      flex: 1;
      padding-right: 8px;
    }
    .side-by-side > *:last-child {
      flex: 1;
      padding-right: 0;
    }
    .suffix {
      margin: 0 8px;
    }
    hui-action-editor,
    ha-select,
    ha-textfield,
    ha-icon-picker {
      margin-top: 8px;
      display: block;
    }
  `;
}

customElements.define(
  "awtrix-live-card-editor",
  AwtrixLiveCardEditor
);
