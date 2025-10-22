/**
 * Main Entry Point
 *
 * Entry point for the React application.
 * Handles both standard React mounting and Liferay Custom Element registration.
 *
 * UPDATED: Enhanced for Liferay 7.4 GA129+ compatibility
 * - Improved lifecycle management
 * - Support for Liferay properties via data attributes
 * - Better error handling
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/main.scss';

/**
 * Standard React mount for development
 */
const mountApp = (elementId = 'root', props = {}) => {
  const container = document.getElementById(elementId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App {...props} />
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
    this._root = null;
    this._mountPoint = null;
  }

  /**
   * Parse Liferay configuration from data attributes
   */
  _getLiferayConfig() {
    try {
      // Liferay passes configuration via data-liferay-config attribute
      const configAttr = this.getAttribute('data-liferay-config');
      if (configAttr) {
        return JSON.parse(configAttr);
      }
    } catch (error) {
      console.warn('Failed to parse Liferay configuration:', error);
    }
    return {};
  }

  /**
   * Get properties to pass to React app
   */
  _getAppProps() {
    const liferayConfig = this._getLiferayConfig();

    return {
      // Pass Liferay configuration if available
      liferayConfig,
      // Check if running inside Liferay
      isLiferayEnvironment: typeof window.Liferay !== 'undefined',
      // Pass any custom attributes
      ...this.dataset,
    };
  }

  connectedCallback() {
    try {
      // Create mount point for React app
      // Don't use Shadow DOM for Liferay compatibility
      this._mountPoint = document.createElement('div');
      this._mountPoint.style.height = '100%';
      this._mountPoint.style.width = '100%';
      this.appendChild(this._mountPoint);

      // Create React root
      this._root = ReactDOM.createRoot(this._mountPoint);

      // Get props from Liferay
      const appProps = this._getAppProps();

      // Render the React app with props
      this._root.render(
        <React.StrictMode>
          <App {...appProps} />
        </React.StrictMode>
      );

      // Log success in development
      if (import.meta.env.DEV) {
        console.log('DxpDataTable Custom Element mounted successfully', appProps);
      }
    } catch (error) {
      console.error('Error mounting DxpDataTable Custom Element:', error);
      // Show error in the element
      this.innerHTML = `
        <div style="padding: 20px; color: #d32f2f; border: 1px solid #d32f2f; border-radius: 4px;">
          <strong>Error loading DxpDataTable:</strong><br/>
          ${error.message}
        </div>
      `;
    }
  }

  disconnectedCallback() {
    try {
      // Cleanup when element is removed from DOM
      if (this._root) {
        this._root.unmount();
        this._root = null;
      }

      if (this._mountPoint) {
        this._mountPoint.remove();
        this._mountPoint = null;
      }

      // Log cleanup in development
      if (import.meta.env.DEV) {
        console.log('DxpDataTable Custom Element unmounted successfully');
      }
    } catch (error) {
      console.error('Error unmounting DxpDataTable Custom Element:', error);
    }
  }

  /**
   * Handle attribute changes (optional)
   * Allows dynamic updates from Liferay
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._root) {
      // Re-render with new props
      const appProps = this._getAppProps();
      this._root.render(
        <React.StrictMode>
          <App {...appProps} />
        </React.StrictMode>
      );
    }
  }

  /**
   * Specify which attributes to observe
   */
  static get observedAttributes() {
    return ['data-liferay-config'];
  }
}

/**
 * Register the custom element for Liferay
 * The element name should match what's defined in your Liferay client-extension.yaml
 */
const ELEMENT_NAME = 'dxp-datatable';

if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, DxpDataTableElement);
  console.log(`Custom Element "${ELEMENT_NAME}" registered successfully`);
}

/**
 * For development: mount app directly if root element exists
 * For production: Liferay will instantiate the custom element
 */
if (import.meta.env.DEV) {
  mountApp('root');
}

export default DxpDataTableElement;
