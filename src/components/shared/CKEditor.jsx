import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorField = ({ value, onChange, placeholder, config = {} }) => {
    // Tất cả toolbar items có sẵn trong Classic Build
    const fullToolbarConfig = {
        toolbar: {
            items: [
                // Heading và Paragraph
                'heading',
                'paragraph',
                '|',
                
                // Font styling
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                
                // Text formatting
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                'code',
                '|',
                
                // Alignment
                'alignment:left',
                'alignment:center', 
                'alignment:right',
                'alignment:justify',
                '|',
                
                // Lists
                'bulletedList',
                'numberedList',
                'todoList',
                '|',
                
                // Indentation
                'outdent',
                'indent',
                '|',
                
                // Links and Media
                'link',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'imageUpload',
                'imageInsert',
                '|',
                
                // Special characters
                'specialCharacters',
                'horizontalLine',
                'pageBreak',
                '|',
                
                // Code blocks
                'codeBlock',
                '|',
                
                // History
                'undo',
                'redo',
                '|',
                
                // Find and Replace
                'findAndReplace',
                '|',
                
                // Source editing (nếu có plugin)
                'sourceEditing'
            ],
            shouldNotGroupWhenFull: false
        },
        
        // Font size options
        fontSize: {
            options: [
                9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
            ],
            supportAllValues: true
        },
        
        // Font family options
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        
        // Heading options
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        
        // Table options
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
            ]
        },
        
        // Image options
        image: {
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                'linkImage'
            ]
        },
        
        // Link options
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        
        // Code block languages
        codeBlock: {
            languages: [
                { language: 'plaintext', label: 'Plain text' },
                { language: 'c', label: 'C' },
                { language: 'cs', label: 'C#' },
                { language: 'cpp', label: 'C++' },
                { language: 'css', label: 'CSS' },
                { language: 'diff', label: 'Diff' },
                { language: 'html', label: 'HTML' },
                { language: 'java', label: 'Java' },
                { language: 'javascript', label: 'JavaScript' },
                { language: 'php', label: 'PHP' },
                { language: 'python', label: 'Python' },
                { language: 'ruby', label: 'Ruby' },
                { language: 'typescript', label: 'TypeScript' },
                { language: 'xml', label: 'XML' }
            ]
        },
        
        placeholder: placeholder || 'Nhập nội dung...',
        height: 200,
        language: 'vi'
    };

    // Toolbar đơn giản cho basic usage
    const basicToolbarConfig = {
        toolbar: [
            'heading', '|',
            'bold', 'italic', 'underline', '|',
            'bulletedList', 'numberedList', '|',
            'link', '|',
            'undo', 'redo'
        ],
        placeholder: placeholder || 'Nhập nội dung...',
        height: 200
    };

    // Toolbar medium với các tính năng phổ biến
    const mediumToolbarConfig = {
        toolbar: [
            'heading', '|',
            'fontSize', 'fontColor', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'alignment', '|',
            'bulletedList', 'numberedList', '|',
            'outdent', 'indent', '|',
            'link', 'blockQuote', 'insertTable', '|',
            'undo', 'redo'
        ],
        fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        placeholder: placeholder || 'Nhập nội dung...',
        height: 200
    };

    // Chọn config dựa trên props
    let selectedConfig;
    if (config.type === 'full') {
        selectedConfig = { ...fullToolbarConfig, ...config };
    } else if (config.type === 'medium') {
        selectedConfig = { ...mediumToolbarConfig, ...config };
    } else if (config.type === 'basic') {
        selectedConfig = { ...basicToolbarConfig, ...config };
    } else {
        // Default medium config
        selectedConfig = { ...mediumToolbarConfig, ...config };
    }

    return (
        <div style={{ minHeight: config.height || 200 }}>
            <CKEditor
                editor={ClassicEditor}
                config={selectedConfig}
                data={value || ''}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange && onChange(data);
                }}
            />
            <style jsx>{`
                div :global(.ck-editor__editable) {
                    min-height: ${config.height || 200}px !important;
                }
            `}</style>
        </div>
    );
};

// Component wrapper để dễ sử dụng với các preset
export const BasicCKEditor = (props) => (
    <CKEditorField {...props} config={{ type: 'basic', ...props.config }} />
);

export const MediumCKEditor = (props) => (
    <CKEditorField {...props} config={{ type: 'medium', ...props.config }} />
);

export const FullCKEditor = (props) => (
    <CKEditorField {...props} config={{ type: 'full', ...props.config }} />
);

export default CKEditorField;

