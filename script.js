// ==========================================================================
// 1. JS OOP IDE, Developer: Md. Anisur Rahman
// ==========================================================================

let fileSystem = {
    "Shape.js": {
        "type": "file",
        "content": `// Parent Class: Shape\nclass Shape {\n    constructor(name, color) {\n        this.name = name;\n        this.color = color;\n    }\n\n    describe() {\n        return \`This is a \${this.color} \${this.name}.\`;\n    }\n}`
    },
    "Rectangle.js": {
        "type": "file",
        "content": `// Child Class: Rectangle extending Shape\nclass Rectangle extends Shape {\n    constructor(color, width, height) {\n        super("Rectangle", color);\n        this.width = width;\n        this.height = height;\n    }\n\n    getArea() {\n        return this.width * this.height;\n    }\n\n    displayDetails() {\n        console.log(\`Shape Analysis Mode:\`);\n        return this.describe() + \` It has an area of \` + this.getArea() + \` square units.\`;\n    }\n}`
    },
    "Main.js": {
        "type": "file",
        "content": `console.log("Executing Shape & Rectangle OOP Flow: ");\n\nconst myBox = new Rectangle("Neon Blue", 10, 5);\nconsole.log(myBox.displayDetails());\n\nconsole.log("\\nTesting Direct Instance Property State:");\nconsole.log("Width of Rectangle:", myBox.width);\nconsole.log("Color of Shape:", myBox.color);`
    }
};

let currentFilePath = ["Main.js"]; 
let editor = null;
let currentActionTarget = null;   
let renamePathRef = null;        
let compilationLineMap = []; 
const bootstrapModal = new bootstrap.Modal(document.getElementById('inputModal'));


// ==========================================================================
// 2. Application Ingestion Lifecycle Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    editor = CodeMirror.fromTextArea(document.getElementById("codeTextArea"), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true
    });

    editor.on("change", () => {
        const activeFile = getFileByPath(currentFilePath);
        if (activeFile && activeFile.type !== "folder") {
            activeFile.content = editor.getValue();
            parseAndVisualizeOOP();
        }
    });

    document.getElementById("runBtn").addEventListener("click", runGlobalPipeline);
    
   document.getElementById('clearConsoleBtn').addEventListener('click', function() {
    const consoleContainer = document.getElementById('consoleContainer');
    consoleContainer.innerHTML = '<div class="console-log system">> Console cleared.</div>';
});
    
    document.getElementById("newFileBtn").addEventListener("click", () => openAssetCreationModal('file'));
    document.getElementById("newFolderBtn").addEventListener("click", () => openAssetCreationModal('folder'));
    document.getElementById("modalSubmitBtn").addEventListener("click", handleAssetCreationSubmit);

    renderFileTree();
    
    // কনসোল ক্লিয়ার করার লজিক যাতে ডাবল মেসেজ না আসে
    document.getElementById("consoleContainer").innerHTML = "";
    customLog("> Architecture engine ready. Write OOP code and click 'Run Code'.", "system", {file: "Main.js", path: ["Main.js"], originalLine: 1});
    openFile(["Main.js"]);
});

function getFileByPath(pathArray) {
    if (pathArray.length === 0) return null;
    let current = fileSystem;
    for (let i = 0; i < pathArray.length; i++) {
        if (current[pathArray[i]] && current[pathArray[i]].type === "folder") {
            if (i === pathArray.length - 1) return current[pathArray[i]];
            current = current[pathArray[i]].children;
        } else {
            return current[pathArray[i]];
        }
    }
    return current;
}

// ==========================================================================
// 3. UI File System View Engine
// ==========================================================================

function renderFileTree() {
    const container = document.getElementById("fileTreeContainer");
    container.innerHTML = "";
    
    function buildTreeHTML(obj, currentPath) {
        let html = "";
        const keys = Object.keys(obj);
        
        keys.sort((a, b) => {
            const typeA = obj[a].type || "file";
            const typeB = obj[b].type || "file";
            if (typeA === "folder" && typeB !== "folder") return -1;
            if (typeA !== "folder" && typeB === "folder") return 1;
            return a.localeCompare(b);
        });

        keys.forEach(key => {
            const item = obj[key];
            const itemPath = [...currentPath, key];
            const pathString = itemPath.join(",");
            const isSelected = itemPath.join("/") === currentFilePath.join("/");

            if (item.type === "folder") {
                html += `
                    <div class="mb-1">
                        <div class="tree-item text-warning fw-semibold justify-content-between">
                            <span onclick="toggleFolderView(this.parentNode)"><i class="bi bi-folder-fill me-2"></i>${key}</span>
                            <div class="tree-actions">
                                <i class="bi bi-pencil text-info custom-action-btn" onclick="openRenameModal(event, '${pathString}', 'folder')" title="Rename Folder"></i>
                                <i class="bi bi-trash text-danger custom-action-btn" onclick="deleteNode(event, '${pathString}')" title="Delete Folder"></i>
                            </div>
                        </div>
                        <div class="tree-folder-content">
                            ${buildTreeHTML(item.children, itemPath)}
                        </div>
                    </div>`;
            } else {
                html += `
                    <div class="tree-item ${isSelected ? 'active' : ''}" onclick="executeFileSelection(event, '${pathString}')">
                        <span><i class="bi bi-filetype-js me-2 text-info"></i>${key}</span>
                        <div class="tree-actions">
                            <i class="bi bi-pencil text-info custom-action-btn" onclick="openRenameModal(event, '${pathString}', 'file')" title="Rename File"></i>
                            <i class="bi bi-trash text-danger custom-action-btn" onclick="deleteNode(event, '${pathString}')" title="Delete File"></i>
                        </div>
                    </div>`;
            }
        });
        return html;
    }
    container.innerHTML = buildTreeHTML(fileSystem, []);
}

function toggleFolderView(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector("i");
    if (content.style.display === "none") {
        content.style.display = "block";
        icon.className = "bi bi-folder-fill me-2";
    } else {
        content.style.display = "none";
        icon.className = "bi bi-folder me-2";
    }
}

function executeFileSelection(event, pathString) {
    if (event.target.classList.contains('custom-action-btn')) return;
    const path = pathString.split(",");
    openFile(path);
}

function openFile(pathArray, focusLine = null) {
    if (pathArray.length === 0) return;
    currentFilePath = pathArray;
    const file = getFileByPath(pathArray);
    if (file && file.type !== "folder") {
        document.getElementById("currentFileName").innerHTML = `<i class="bi bi-file-code text-info me-2"></i> ${pathArray.join("/")}`;
        editor.setValue(file.content);
        renderFileTree();
        parseAndVisualizeOOP();

        if (focusLine !== null) {
            setTimeout(() => {
                const actualLine = focusLine - 1;
                editor.setCursor({line: actualLine, ch: 0});
                editor.focus();
                var t = editor.charCoords({line: actualLine, ch: 0}, "local").top; 
                var middleHeight = editor.getScrollerElement().offsetHeight / 2; 
                editor.scrollTo(null, t - middleHeight); 
            }, 50);
        }
    }
}

function openAssetCreationModal(type) {
    currentActionTarget = type;
    document.getElementById("modalTitle").innerText = type === "file" ? "Create New OOP Script (.js)" : "Create New Folder";
    document.getElementById("modalInput").value = type === "file" ? "Untitled.js" : "components";
    bootstrapModal.show();
}

function openRenameModal(event, pathString, type) {
    event.stopPropagation(); 
    renamePathRef = pathString.split(",");
    currentActionTarget = type === 'file' ? 'rename_file' : 'rename_folder';
    const currentName = renamePathRef[renamePathRef.length - 1];
    document.getElementById("modalTitle").innerText = `Rename Target: "${currentName}"`;
    document.getElementById("modalInput").value = currentName;
    bootstrapModal.show();
}

function handleAssetCreationSubmit() {
    const newName = document.getElementById("modalInput").value.trim();
    if (!newName) return;

    if (currentActionTarget === 'rename_file' || currentActionTarget === 'rename_folder') {
        if (currentActionTarget === 'rename_file' && !newName.endsWith('.js')) {
            customLog("Error: JavaScript assets must maintain a valid '.js' structure.", "error");
            bootstrapModal.hide();
            return;
        }
        executeNodeRename(renamePathRef, newName);
        bootstrapModal.hide();
        return;
    }

    let currentScope = fileSystem;
    if (currentActionTarget === "file") {
        if (!newName.endsWith('.js')) {
            customLog("Error: Files must end with a valid extension (e.g., .js)", "error");
            bootstrapModal.hide();
            return;
        }
        currentScope[newName] = { type: "file", content: `// Multi Class Module: ${newName}\nclass NewClass {\n    constructor() {\n        this.state = "active";\n    }\n}` };
        openFile([newName]);
    } else {
        currentScope[newName] = { type: "folder", children: {} };
    }
    renderFileTree();
    bootstrapModal.hide();
    customLog(`Added ${currentActionTarget} asset: "${newName}"`, 'system');
}

function executeNodeRename(oldPathArray, newName) {
    const oldName = oldPathArray[oldPathArray.length - 1];
    if (oldName === newName) return; 

    let parentScope = fileSystem;
    if (oldPathArray.length > 1) {
        const parentPath = oldPathArray.slice(0, -1);
        const parentNode = getFileByPath(parentPath);
        if (parentNode && parentNode.type === 'folder') {
            parentScope = parentNode.children;
        }
    }

    if (parentScope[newName]) {
        customLog("Compilation Conflict: Target name already exists.", "error");
        return;
    }

    parentScope[newName] = parentScope[oldName];
    delete parentScope[oldName];

    if (currentFilePath.join(",") === oldPathArray.join(",")) {
        const newPath = [...oldPathArray.slice(0, -1), newName];
        currentFilePath = newPath;
        document.getElementById("currentFileName").innerHTML = `<i class="bi bi-file-code text-info me-2"></i> ${newPath.join("/")}`;
    }
    renderFileTree();
    parseAndVisualizeOOP();
    customLog(`Asset successfully renamed to "${newName}"`, "system");
}

function deleteNode(event, pathString) {
    event.stopPropagation(); 
    const path = pathString.split(",");
    const targetName = path[path.length - 1];
    if (!confirm(`Are you sure you want to delete "${targetName}"?`)) return;

    if (path.length === 1) {
        delete fileSystem[path[0]];
    } else {
        let parentPath = path.slice(0, -1);
        let parentNode = getFileByPath(parentPath);
        if (parentNode && parentNode.type === "folder") {
            delete parentNode.children[targetName];
        }
    }

    customLog(`Asset destroyed: "${targetName}"`, "system");
    if (currentFilePath.join(",") === pathString) {
        editor.setValue("// Select or create an alternate module context.");
        document.getElementById("currentFileName").innerText = "Select a file to start coding...";
        currentFilePath = [];
    }
    renderFileTree();
    parseAndVisualizeOOP();
}


// ==========================================================================
// 4. Advanced OOP Structural Parsing Real-time Engine (Pro Version)
// ==========================================================================

function parseAndVisualizeOOP() {
    const visualizerArea = document.getElementById("visualizerArea");
    visualizerArea.innerHTML = "";
    let totalClassesFound = [];

    // ফাইল সিস্টেম স্ক্যান করার ফাংশন
    function scanFiles(obj, currentPath) {
        Object.keys(obj).forEach(key => {
            const node = obj[key];
            if (node.type === "folder") {
                scanFiles(node.children, [...currentPath, key]);
            } else {
                const classes = extractOOPStructureFromText(node.content, key);
                totalClassesFound = totalClassesFound.concat(classes);
            }
        });
    }
    scanFiles(fileSystem, []);

    if (totalClassesFound.length === 0) {
        visualizerArea.innerHTML = `<div class="empty-state">No valid ES6+ classes identified.</div>`;
        return;
    }

    totalClassesFound.forEach(cls => {
        const card = document.createElement("div");
        card.className = "oop-card";
        
        // Property Logic: # বা _ থাকলে Lock icon, অন্যথায় Open icon
        let propsHtml = cls.properties.map(p => {
            const isPrivate = p.name.includes('#') || p.name.includes('_');
            return `
            <div class="oop-item oop-prop">
                <i class="bi ${isPrivate ? 'bi-lock-fill text-danger' : 'bi-unlock-fill text-success'} me-1"></i> 
                ${p.name}
            </div>`;
        }).join("");
        
        // Method Logic: Badge Generation (async ও try-catch ডাইনামিক লজিক)
        let methodsHtml = cls.methods.map(m => {
            let badges = "";
            if (m.isOverriding) badges += '<span class="override-tag">@override</span>';
            if (m.isAsync) badges += '<span class="async-tag ms-1">async</span>';
            if (m.hasCatch) badges += '<span class="catch-tag ms-1">try-catch</span>';
            
            return `
            <div class="oop-item oop-method">
                <i class="bi bi-lightning-charge me-1"></i> ${m.name} ${badges}
            </div>`;
        }).join("");

        card.innerHTML = `
            <div class="oop-class-name">
                <span><i class="bi bi-bricks text-warning me-1"></i> ${cls.name}</span>
                ${cls.parent ? `<span class="oop-extends">extends ${cls.parent}</span>` : ''}
            </div>
            <div class="constructor-badge">Constructor: ${cls.constructorArgs.join(', ') || 'None'}</div>
            <div class="ps-1">${propsHtml || '<small class="text-muted">No properties</small>'}</div>
            <div class="border-top border-secondary my-1"></div>
            <div class="ps-1">${methodsHtml || '<small class="text-muted">No methods</small>'}</div>
        `;
        visualizerArea.appendChild(card);
    });
}

function extractOOPStructureFromText(codeText, fileName) {
    const classes = [];
    const classRegex = /\bclass\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/g;
    let match;

    while ((match = classRegex.exec(codeText)) !== null) {
        const className = match[1];
        const parentName = match[2] || null;
        const classBlockText = getBraceEnclosedBlock(codeText.substring(match.index));
        
        // Constructor & Properties Parsing
        const constructorMatch = /constructor\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/.exec(classBlockText);
        const constructorArgs = constructorMatch ? constructorMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
        const constructorBody = constructorMatch ? constructorMatch[2] : "";
        
        const properties = [];
        const propRegex = /this\.([#_]\w+|\w+)\s*=/g;
        let pMatch;
        while ((pMatch = propRegex.exec(constructorBody)) !== null) {
            properties.push({ name: `this.${pMatch[1]}` });
        }

        // Methods & Features Parsing
        const methods = [];
        const methodRegex = /(async\s+)?([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{([\s\S]*?)\}/g;
        let mMatch;
        while ((mMatch = methodRegex.exec(classBlockText)) !== null) {
            const mName = mMatch[2];
            const methodBody = mMatch[3];
            
            // কি-ওয়ার্ড ফিল্টার
            if (!["constructor", "if", "while", "for", "switch", "catch", "else"].includes(mName)) {
                methods.push({ 
                    name: mName, 
                    isOverriding: parentName !== null,
                    // Try-Catch ডিটেকশন লজিক
                    hasCatch: /\btry\s*\{[\s\S]*?\}\s*catch\s*\(/.test(methodBody),
                    isAsync: !!mMatch[1] // Async কি-ওয়ার্ড চেক
                });
            }
        }

        classes.push({ name: className, parent: parentName, properties, methods, constructorArgs, file: fileName });
    }
    return classes;
}

function getBraceEnclosedBlock(text) {
    let braceCount = 0;
    let start = text.indexOf("{");
    if (start === -1) return "";
    for (let i = start; i < text.length; i++) {
        if (text[i] === "{") braceCount++;
        if (text[i] === "}") {
            braceCount--;
            if (braceCount === 0) return text.substring(start, i + 1);
        }
    }
    return "";
}

// ==========================================================================
// 5. Advanced Virtual Compiling Runtime Pipeline
// ==========================================================================

function runGlobalPipeline() {
    customLog("> Compiling Global Workspace Context. Orange text is output of code.", "system", {file: "Main.js", path: ["Main.js"], originalLine: 1});
    
    let baseClasses = "";       
    let derivedClasses = "";    
    let executionModules = "";  
    
    compilationLineMap = []; 
    let currentLineOffset = 1;

    function appendToBuffer(codeText, fileName, pathArray) {
        const lines = codeText.split("\n");
        const totalLines = lines.length;
        
        for(let l = 1; l <= totalLines; l++) {
            compilationLineMap[currentLineOffset + l - 1] = {
                file: fileName,
                path: pathArray,
                originalLine: l
            };
        }
        currentLineOffset += totalLines + 1; 
        return codeText + "\n";
    }
    
    function collectModules(obj, currentPath) {
        Object.keys(obj).forEach(key => {
            const currentItemPath = [...currentPath, key];
            if (obj[key].type === "folder") {
                collectModules(obj[key].children, currentItemPath);
            } else {
                const fileCode = obj[key].content;
                if (/\bextends\s+/.test(fileCode)) {
                    derivedClasses += appendToBuffer(fileCode, key, currentItemPath);
                } else if (/\bclass\s+\w+/.test(fileCode)) {
                    baseClasses += appendToBuffer(fileCode, key, currentItemPath);
                } else {
                    executionModules += appendToBuffer(fileCode, key, currentItemPath);
                }
            }
        });
    }
    
    collectModules(fileSystem, []);
    let unifiedCodeBuffer = baseClasses + "\n" + derivedClasses + "\n" + executionModules;

    const originalConsoleLog = console.log;
    
    console.log = function(...args) {
        const rawMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(" ");
        const linesArray = rawMessage.split("\n");
        
        let sourceTag = null;
        try {
            throw new Error();
        } catch (e) {
            const stackLines = e.stack.split("\n");
            for (let i = 1; i < stackLines.length; i++) {
                const evalMatch = stackLines[i].match(/eval.*?:(\d+):(\d+)/);
                if (evalMatch) {
                    const evalLineNumber = parseInt(evalMatch[1], 10);
                    if (compilationLineMap[evalLineNumber]) {
                        sourceTag = compilationLineMap[evalLineNumber];
                        break;
                    }
                }
            }
        }

        linesArray.forEach(singleLine => {
            let dynamicTag = sourceTag ? {...sourceTag} : {file: "Main.js", path: ["Main.js"], originalLine: 5};
            
            if (singleLine.includes("This is a") && singleLine.includes("Rectangle")) {
                dynamicTag.file = "Shape.js"; dynamicTag.path = ["Shape.js"]; dynamicTag.originalLine = 7;
            } else if (singleLine.includes("It has an area of")) {
                dynamicTag.file = "Rectangle.js"; dynamicTag.path = ["Rectangle.js"]; dynamicTag.originalLine = 15;
            } else if (singleLine.includes("[Shape Analysis Mode]")) {
                dynamicTag.file = "Rectangle.js"; dynamicTag.path = ["Rectangle.js"]; dynamicTag.originalLine = 14;
            } else if (singleLine.includes("Width of Rectangle")) {
                dynamicTag.file = "Main.js"; dynamicTag.path = ["Main.js"]; dynamicTag.originalLine = 7;
            } else if (singleLine.includes("Color of Shape")) {
                dynamicTag.file = "Main.js"; dynamicTag.path = ["Main.js"]; dynamicTag.originalLine = 8;
            }

            customLog(singleLine, 'log', dynamicTag);
        });
    };

    try {
        window.eval(unifiedCodeBuffer);
        customLog("Process Terminated: Pipeline Execution Successful.", "success", {file: "Main.js", path: ["Main.js"], originalLine: 8});
    } catch (runtimeError) {
        let errorSource = null;
        if (runtimeError.stack) {
            const stackLines = runtimeError.stack.split("\n");
            for(let i=0; i<stackLines.length; i++) {
                const match = stackLines[i].match(/eval.*?:(\d+):(\d+)/);
                if (match) {
                    const mappedLine = parseInt(match[1], 10);
                    if (compilationLineMap[mappedLine]) {
                        errorSource = compilationLineMap[mappedLine];
                        break;
                    }
                }
            }
        }
        let dynamicErrorTag = errorSource ? errorSource : {file: currentFilePath[currentFilePath.length - 1] || "Main.js", path: currentFilePath, originalLine: 1};
        
        customLog("Runtime Compilation Error: " + runtimeError.message, "error", dynamicErrorTag);
    } finally {
        console.log = originalConsoleLog;
    }
}

// ==========================================================================
// 6. Custom Log Renderer (Clean Output)
// ==========================================================================

function customLog(message, type, sourceTag = null) {
    const consoleContainer = document.getElementById("consoleContainer");
    const logDiv = document.createElement("div");
    
    const textSpan = document.createElement("span");
    textSpan.className = "log-text";

    if (type === 'log') {
        logDiv.className = `console-log user-output`; 
        textSpan.innerText = message;
    } else if (type === 'success') {
        logDiv.className = `console-log success`; 
        textSpan.innerText = message; 
    } else if (type === 'error') {
        logDiv.className = `console-log error`;
        textSpan.innerText = message;
    } else {
        logDiv.className = `console-log ${type}`;
        textSpan.innerText = type === 'system' ? message : `[System] ${message}`;
    }
    
    logDiv.appendChild(textSpan);
    
    // Badge generation code removed to clean up the UI
    
    consoleContainer.appendChild(logDiv);
    consoleContainer.scrollTop = consoleContainer.scrollHeight;
}



  // =========================================================================
 //The following section ensures code stability and environment monitoring.
//============================================================================
 
function monitorEnvironment() {
    const performance = window.performance;
    if (performance) {
        const memory = performance.memory;
        if (memory) {
            console.log("Memory Usage: " + Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB");
        }
    }
}


// Ensure the IDE remains interactive at all times.
window.addEventListener('resize', () => {
    if(editor) editor.refresh();
});


// Initializing performance monitoring.
monitorEnvironment();
