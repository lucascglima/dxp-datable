/**
 * JSON Configuration Editor Component
 *
 * Provides a Monaco-based JSON editor with real-time validation,
 * syntax highlighting, and error display.
 */

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, Alert, Space, Button, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CopyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * JSON Configuration Editor Component
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current JSON text
 * @param {Function} props.onChange - Callback when JSON changes
 * @param {boolean} props.isValid - Whether current JSON is valid
 * @param {Array<string>} props.errors - Validation error messages
 * @param {number} props.height - Editor height in pixels
 */
const JsonConfigEditor = ({
  value = '{}',
  onChange,
  isValid = true,
  errors = [],
  height = 800,
}) => {
  const [editorInstance, setEditorInstance] = useState(null);

  /**
   * Handles editor mount event
   */
  const handleEditorDidMount = (editor) => {
    setEditorInstance(editor);
  };

  /**
   * Handles JSON text change
   */
  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue || '');
    }
  };

  /**
   * Formats current JSON
   */
  const handleFormatJson = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
    }
  };

  /**
   * Copies JSON to clipboard
   */
  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // Could show a success message here
    } catch (error) {
      console.error('Falha ao copiar JSON:', error);
    }
  };

  return (
    <Card style={{ gap: 8 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Editor Actions */}
        <Space style={{ justifyContent: 'end', width: '100%' }}>
          <Button onClick={handleFormatJson}>Formatar JSON</Button>
          <Button icon={<CopyOutlined />} onClick={handleCopyJson}>
            Copiar
          </Button>
        </Space>
        {/* Monaco Editor */}
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
          <Editor
            height={height}
            defaultLanguage="json"
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
              quickSuggestions: true,
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        </div>
        {/* Validation Status */}
        {isValid ? (
          <Alert
            message="JSON Válido"
            description="A configuração está válida e pode ser aplicada."
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            style={{ marginBottom: '8px', marginTop: '8px' }}
          />
        ) : (
          <Alert
            message="Erros de Validação"
            description={
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
            type="error"
            icon={<CloseCircleOutlined />}
            showIcon
          />
        )}

        {/* Help Text */}
        <Alert
          message="Dicas"
          description={
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Use Ctrl+Espaço para autocompletar</li>
              <li>Use Ctrl+F para buscar no código</li>
              <li>Use Alt+Shift+F para formatar o JSON</li>
              <li>Erros de sintaxe são destacados automaticamente</li>
            </ul>
          }
          type="info"
          style={{ marginBottom: '8px', marginTop: '8px' }}
          closable
        />
      </Space>
    </Card>
  );
};

export default JsonConfigEditor;
