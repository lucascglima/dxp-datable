/**
 * HTML Sanitizer Utility
 *
 * Sanitizes HTML content to prevent XSS attacks.
 * Uses a whitelist approach for allowed tags and attributes.
 */

/**
 * Whitelist of allowed HTML tags
 */
const ALLOWED_TAGS = [
  'span',
  'div',
  'p',
  'strong',
  'em',
  'b',
  'i',
  'u',
  'br',
  'a',
  'img',
  'ul',
  'ol',
  'li',
  'table',
  'tr',
  'td',
  'th',
  'thead',
  'tbody',
];

/**
 * Whitelist of allowed HTML attributes per tag
 */
const ALLOWED_ATTRIBUTES = {
  '*': ['class', 'style', 'title', 'id'],
  'a': ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height'],
  'span': ['class', 'style'],
  'div': ['class', 'style'],
};

/**
 * Patterns to block in style attribute (prevent CSS injection)
 */
const BLOCKED_STYLE_PATTERNS = [
  /javascript:/gi,
  /expression\(/gi,
  /import/gi,
  /@import/gi,
  /behavior:/gi,
];

/**
 * Sanitizes HTML string by removing dangerous tags and attributes
 *
 * @param {string} html - HTML string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html, options = {}) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const {
    allowedTags = ALLOWED_TAGS,
    allowedAttributes = ALLOWED_ATTRIBUTES,
    stripAll = false,
  } = options;

  // If stripAll is true, remove all HTML tags
  if (stripAll) {
    return html.replace(/<[^>]*>/g, '');
  }

  try {
    // Create a temporary DOM element
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Recursively sanitize all nodes
    sanitizeNode(temp, allowedTags, allowedAttributes);

    return temp.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // Fallback: strip all tags if sanitization fails
    return html.replace(/<[^>]*>/g, '');
  }
};

/**
 * Recursively sanitizes a DOM node
 *
 * @param {HTMLElement} node - Node to sanitize
 * @param {Array} allowedTags - Allowed tag names
 * @param {Object} allowedAttributes - Allowed attributes per tag
 */
const sanitizeNode = (node, allowedTags, allowedAttributes) => {
  const nodesToRemove = [];

  // Iterate through all child nodes
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    // If it's an element node
    if (child.nodeType === 1) {
      const tagName = child.tagName.toLowerCase();

      // Check if tag is allowed
      if (!allowedTags.includes(tagName)) {
        nodesToRemove.push(child);
        continue;
      }

      // Sanitize attributes
      sanitizeAttributes(child, allowedAttributes);

      // Recursively sanitize children
      sanitizeNode(child, allowedTags, allowedAttributes);
    }
    // If it's a text node, keep it as is
    else if (child.nodeType === 3) {
      // Text nodes are safe
      continue;
    }
    // Remove all other node types (comments, etc.)
    else {
      nodesToRemove.push(child);
    }
  }

  // Remove disallowed nodes
  nodesToRemove.forEach((nodeToRemove) => {
    node.removeChild(nodeToRemove);
  });
};

/**
 * Sanitizes attributes of an element
 *
 * @param {HTMLElement} element - Element to sanitize
 * @param {Object} allowedAttributes - Allowed attributes configuration
 */
const sanitizeAttributes = (element, allowedAttributes) => {
  const tagName = element.tagName.toLowerCase();
  const allowedForTag = [
    ...(allowedAttributes['*'] || []),
    ...(allowedAttributes[tagName] || []),
  ];

  const attributesToRemove = [];

  // Check all attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    const attrName = attr.name.toLowerCase();

    // Remove if not in whitelist
    if (!allowedForTag.includes(attrName)) {
      attributesToRemove.push(attrName);
      continue;
    }

    // Special handling for href (prevent javascript: URLs)
    if (attrName === 'href') {
      const href = attr.value.trim().toLowerCase();
      if (href.startsWith('javascript:') || href.startsWith('data:')) {
        attributesToRemove.push(attrName);
        continue;
      }
    }

    // Special handling for style attribute
    if (attrName === 'style') {
      const style = attr.value;
      if (isStyleDangerous(style)) {
        attributesToRemove.push(attrName);
        continue;
      }
    }

    // Special handling for src (images)
    if (attrName === 'src') {
      const src = attr.value.trim().toLowerCase();
      if (src.startsWith('javascript:') || src.startsWith('data:text/html')) {
        attributesToRemove.push(attrName);
        continue;
      }
    }
  }

  // Remove dangerous attributes
  attributesToRemove.forEach((attrName) => {
    element.removeAttribute(attrName);
  });

  // Add rel="noopener noreferrer" to external links
  if (tagName === 'a' && element.hasAttribute('href')) {
    const href = element.getAttribute('href');
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      element.setAttribute('rel', 'noopener noreferrer');
      if (!element.hasAttribute('target')) {
        element.setAttribute('target', '_blank');
      }
    }
  }
};

/**
 * Checks if style string contains dangerous patterns
 *
 * @param {string} style - Style string to check
 * @returns {boolean} True if style is dangerous
 */
const isStyleDangerous = (style) => {
  if (!style) return false;

  for (const pattern of BLOCKED_STYLE_PATTERNS) {
    if (pattern.test(style)) {
      return true;
    }
  }

  return false;
};

/**
 * Escapes HTML special characters
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Strips all HTML tags from string
 *
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

/**
 * Validates if HTML string is safe
 *
 * @param {string} html - HTML to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateHtml = (html) => {
  const errors = [];

  if (!html) {
    return { isValid: true, errors: [] };
  }

  // Check for script tags
  if (/<script/gi.test(html)) {
    errors.push('Script tags are not allowed');
  }

  // Check for javascript: protocol
  if (/javascript:/gi.test(html)) {
    errors.push('JavaScript URLs are not allowed');
  }

  // Check for on* event handlers
  if (/\son\w+\s*=/gi.test(html)) {
    errors.push('Event handler attributes (onclick, onload, etc.) are not allowed');
  }

  // Check for iframe
  if (/<iframe/gi.test(html)) {
    errors.push('iframes are not allowed');
  }

  // Check for object/embed
  if (/<(object|embed)/gi.test(html)) {
    errors.push('Object and embed tags are not allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  sanitizeHtml,
  escapeHtml,
  stripHtml,
  validateHtml,
  ALLOWED_TAGS,
  ALLOWED_ATTRIBUTES,
};
