const consoleElement = document.getElementById('console');
const iframeOutput = document.getElementById('iframe-output');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const fileInput = document.getElementById('file-input');

// Initialize Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.37.1/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
            value: `print("Hello, Pyodide!")`,
                    language: 'python',
                            theme: 'vs-dark',
                                    automaticLayout: true
                                        });
                                        });

                                        let pyodideReadyPromise = loadPyodide({
                                            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.2/full/"
                                            });

                                            // Function to run Python code using Pyodide
                                            async function runPythonCode(code) {
                                                const pyodide = await pyodideReadyPromise;

                                                    // Clear the console
                                                        consoleElement.textContent = "";

                                                            try {
                                                                    // Capture output (stdout)
                                                                            pyodide.setStdout((output) => {
                                                                                        consoleElement.textContent += output + '\n';
                                                                                                });

                                                                                                        // Capture errors (stderr)
                                                                                                                pyodide.setStderr((error) => {
                                                                                                                            consoleElement.textContent += "Error: " + error + '\n';
                                                                                                                                    });

                                                                                                                                            // Execute the Python code
                                                                                                                                                    await pyodide.runPythonAsync(code);
                                                                                                                                                        } catch (err) {
                                                                                                                                                                consoleElement.textContent += "Error: " + err + '\n';
                                                                                                                                                                    }
                                                                                                                                                                    }

                                                                                                                                                                    // Function to run HTML code inside the iframe
                                                                                                                                                                    function runHtmlCode(code) {
                                                                                                                                                                        iframeOutput.srcdoc = code;
                                                                                                                                                                        }

                                                                                                                                                                        // Event listeners for the buttons
                                                                                                                                                                        document.getElementById('run-python').addEventListener('click', function () {
                                                                                                                                                                            const code = editor.getValue();
                                                                                                                                                                                runPythonCode(code);
                                                                                                                                                                                });

                                                                                                                                                                                document.getElementById('run-html').addEventListener('click', function () {
                                                                                                                                                                                    const code = editor.getValue();
                                                                                                                                                                                        runHtmlCode(code);
                                                                                                                                                                                        });

                                                                                                                                                                                        // Save code to file
                                                                                                                                                                                        saveButton.addEventListener('click', () => {
                                                                                                                                                                                            const code = editor.getValue();
                                                                                                                                                                                                const blob = new Blob([code], { type: 'text/plain' });
                                                                                                                                                                                                    const url = URL.createObjectURL(blob);
                                                                                                                                                                                                        
                                                                                                                                                                                                            const a = document.createElement('a');
                                                                                                                                                                                                                a.href = url;
                                                                                                                                                                                                                    a.download = 'code.txt'; // Default file name
                                                                                                                                                                                                                        a.click();
                                                                                                                                                                                                                            URL.revokeObjectURL(url);
                                                                                                                                                                                                                            });

                                                                                                                                                                                                                            // Load code from file
                                                                                                                                                                                                                            loadButton.addEventListener('click', () => fileInput.click());

                                                                                                                                                                                                                            fileInput.addEventListener('change', function () {
                                                                                                                                                                                                                                const file = this.files[0];
                                                                                                                                                                                                                                    const reader = new FileReader();
                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                            reader.onload = function (e) {
                                                                                                                                                                                                                                                    editor.setValue(e.target.result);
                                                                                                                                                                                                                                                        };

                                                                                                                                                                                                                                                            reader.readAsText(file);
                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                            // Override console.log, console.error, and console.warn to capture logs
                                                                                                                                                                                                                                                            (function captureConsole() {
                                                                                                                                                                                                                                                                const originalLog = console.log;
                                                                                                                                                                                                                                                                    const originalError = console.error;
                                                                                                                                                                                                                                                                        const originalWarn = console.warn;

                                                                                                                                                                                                                                                                            console.log = function (...args) {
                                                                                                                                                                                                                                                                                    consoleElement.textContent += "Log: " + args.join(' ') + '\n';
                                                                                                                                                                                                                                                                                            originalLog.apply(console, args);
                                                                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                                                                    console.error = function (...args) {
                                                                                                                                                                                                                                                                                                            consoleElement.textContent += "Error: " + args.join(' ') + '\n';
                                                                                                                                                                                                                                                                                                                    originalError.apply(console, args);
                                                                                                                                                                                                                                                                                                                        };

                                                                                                                                                                                                                                                                                                                            console.warn = function (...args) {
                                                                                                                                                                                                                                                                                                                                    consoleElement.textContent += "Warning: " + args.join(' ') + '\n';
                                                                                                                                                                                                                                                                                                                                            originalWarn.apply(console, args);
                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                })();