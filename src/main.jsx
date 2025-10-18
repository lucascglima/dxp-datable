/**
 * Main Entry Point
 *
 * Entry point for the React application.
 * Handles both standard React mounting and Liferay Custom Element registration.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Standard React mount for development
 */
const mountApp = (elementId = 'root') => {
  const container = document.getElementById(elementId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

/**
 * Liferay Custom Element class
 * Extends HTMLElement to create a web component compatible with Liferay
 */
class DxpDataTableElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Create a shadow root or use the element itself
    // For Liferay compatibility, we typically don't use Shadow DOM
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    // Store root for cleanup
    this._root = ReactDOM.createRoot(mountPoint);

    // Render the React app
    this._root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

  disconnectedCallback() {
    // Cleanup when element is removed
    if (this._root) {
      this._root.unmount();
    }
  }
}

/**
 * Register the custom element for Liferay
 * The element name should match what's defined in your Liferay client-extension.yaml
 */
const ELEMENT_NAME = 'dxp-datatable';

if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, DxpDataTableElement);
}

/**
 * For development: mount app directly if root element exists
 * For production: Liferay will instantiate the custom element
 */
if (import.meta.env.DEV) {
  mountApp('root');
}

export default DxpDataTableElement;
