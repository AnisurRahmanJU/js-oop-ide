// ==========================================================================
// 1. Initial State Definition (Virtual File System Database)
// ==========================================================================
let fileSystem = {
    "Shape.js": {
        "type": "file",
        "content": `// Parent Class: Shape\nclass Shape {\n    constructor(name, color) {\n        this.name = name;\n        this.color = color;\n    }\n\n    describe() {\n        return \`This is a \${this.color} \${this.name}.\`;\n    }\n}`
    },
    "Rectangle.js": {
        "type": "file",
        "content": `// Child Class: Rectangle extending Shape\nclass Rectangle extends Shape {\n    constructor(color, width, height) {\n        super("Rectangle", color);\n        this.width = width;\n        this.height = height;\n    }\n\n    getArea() {\n        return this.width * this.height;\n    }\n\n    displayDetails() {\n        console.log(\`[Shape Analysis Mode]\`);\n        return this.describe() + \` It has an area of \` + this.getArea() + \` square units.\`;\n    }\n}`
    },
    "Main.js": {
        "type": "file",
        "content": `console.log("--- Executing Shape & Rectangle OOP Flow ---");\n\nconst myBox = new Rectangle("Neon Blue", 10, 5);\nconsole.log(myBox.displayDetails());\n\nconsole.log("\\n--- Testing Direct Instance Property State ---");\nconsole.log("Width of Rectangle:", myBox.width);\nconsole.log("Color of Shape:", myBox.color);`
    }
};

let currentFilePath = ["Main.js"]; 
let editor = null;
let currentActionTarget = null; // 'file', 'folder', 'rename_file', 'rename_folder'
let renamePathRef = null;        // Holds target path tracking matrix during rename cycles
const bootstrapModal = new bootstrap.Modal(document.getElementById('inputModal'));

// ==========================================================================
// 2. Application Ingestion Lifecycle Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize CodeMirror Editor
    editor = CodeMirror.fromTextArea(document.getElementById("codeTextArea"), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true
    });

    // Real-time synchronization of editor buffer with data schema
    editor.on("change", () => {
        const activeFile = getFileByPath(currentFilePath);
        if (activeFile && activeFile.type !== "folder") {
            activeFile.content = editor.getValue();
            parseAndVisualizeOOP();
        }
    });

    // Wire Up Action Handlers
    document.getElementById("runBtn").addEventListener("click", runGlobalPipeline);
    
    // 🌟 ফিক্সড: হেডার প্যানেলের ভেতরের Clear Console বাটনের ইভেন্ট ম্যাপিং 🌟
    document.getElementById("clearConsoleBtn").addEventListener("click", () => {
        document.getElementById("consoleContainer").innerHTML = "";
    });
    
    document.getElementById("newFileBtn").addEventListener("click", () => openAssetCreationModal('file'));
    document.getElementById("newFolderBtn").addEventListener("click", () => openAssetCreationModal('folder'));
    document.getElementById("modalSubmitBtn").addEventListener("click", handleAssetCreationSubmit);

    // Bootstrap Initial System Render
    renderFileTree();
    openFile(["Main.js"]);
});

// Helper: Traverse system tree directory safely via string array paths
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
// 3. UI File System Compilation View Engine (Render, Add, Delete, Rename)
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

function openFile(pathArray) {
    if (pathArray.length === 0) return;
    currentFilePath = pathArray;
    const file = getFileByPath(pathArray);
    if (file && file.type !== "folder") {
        document.getElementById("currentFileName").innerHTML = `<i class="bi bi-file-code text-info me-2"></i> ${pathArray.join("/")}`;
        editor.setValue(file.content);
        renderFileTree();
        parseAndVisualizeOOP();
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
        customLog(`Compilation Conflict: Target name "${newName}" already exists within this scope level.`, "error");
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
    customLog(`Asset successfully renamed from "${oldName}" to "${newName}"`, "system");
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
        } else {
            let current = fileSystem;
            for(let i=0; i<path.length-1; i++){
                current = current[path[i]].children;
            }
            delete current[targetName];
        }
    }

    customLog(`Asset successfully destroyed: "${targetName}"`, "system");

    if (currentFilePath.join(",") === pathString) {
        editor.setValue("// Select or create an alternate module context from the explorer shell.");
        document.getElementById("currentFileName").innerText = "Select a file to start coding...";
        currentFilePath = [];
    }

    renderFileTree();
    parseAndVisualizeOOP();
}

// ==========================================================================
// 4. Advanced Regular Expression Parsing Visualization Logic
// ==========================================================================
function parseAndVisualizeOOP() {
    const visualizerArea = document.getElementById("visualizerArea");
    visualizerArea.innerHTML = "";
    let totalClassesFound = [];

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
        visualizerArea.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-code-slash fs-1 mb-2"></i>
                <p>No valid ES6 classes identified in Workspace.</p>
            </div>`;
        return;
    }

    totalClassesFound.forEach(cls => {
        const card = document.createElement("div");
        card.className = "oop-card";
        let extendsHtml = cls.parent ? `<span class="oop-extends"><i class="bi bi-arrow-up-short"></i> extends ${cls.parent}</span>` : '';
        let propsHtml = cls.properties.map(p => `<div class="oop-item oop-prop"><i class="bi bi-box-seam me-1"></i> this.${p}</div>`).join("");
        let methodsHtml = cls.methods.map(m => `<div class="oop-item oop-method"><i class="bi bi-lightning-charge me-1"></i> ${m}()</div>`).join("");

        card.innerHTML = `
            <div class="oop-class-name">
                <span><i class="bi bi-bricks text-warning me-1"></i> ${cls.name}</span>
                ${extendsHtml}
            </div>
            <div class="small text-muted mb-1" style="font-size:10px;"><i class="bi bi-file-earmark"></i> Scope: ${cls.file}</div>
            <div class="ps-1">
                ${propsHtml || '<div class="text-muted italic small" style="font-size:11px;">No local states detected</div>'}
                <div class="border-top border-secondary my-1"></div>
                ${methodsHtml || '<div class="text-muted italic small" style="font-size:11px;">No operational routines</div>'}
            </div>
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
        const startIdx = match.index;
        const remainingText = codeText.substring(startIdx);
        const classBlockText = getBraceEnclosedBlock(remainingText);
        
        const propRegex = /this\.(\w+)\s*=/g;
        const properties = [];
        let propMatch;
        while ((propMatch = propRegex.exec(classBlockText)) !== null) {
            if (!properties.includes(propMatch[1])) properties.push(propMatch[1]);
        }

        const methodRegex = /(?<!\b(if|for|while|switch|catch))\b([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{/g;
        const methods = [];
        let methodMatch;
        while ((methodMatch = methodRegex.exec(classBlockText)) !== null) {
            const mName = methodMatch[2];
            if (mName !== "constructor" && !methods.includes(mName)) methods.push(mName);
        }

        classes.push({ name: className, parent: parentName, properties: properties, methods: methods, file: fileName });
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
    return text;
}

// ==========================================================================
// 5. Native Compiling Evaluation Pipeline Engine (100% Secure Order Matrix)
// ==========================================================================
function runGlobalPipeline() {
    customLog("--- Compiling Global Workspace Context ---", "system");
    
    let baseClasses = "";       
    let derivedClasses = "";    
    let executionModules = "";  
    
    function collectModules(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key].type === "folder") {
                collectModules(obj[key].children);
            } else {
                const fileCode = obj[key].content;
                
                if (/\bextends\s+/.test(fileCode)) {
                    derivedClasses += `\n/* Module: ${key} (Derived) */\n` + fileCode + "\n";
                } else if (/\bclass\s+\w+/.test(fileCode)) {
                    baseClasses += `\n/* Module: ${key} (Base) */\n` + fileCode + "\n";
                } else {
                    executionModules += `\n/* Entry Point: ${key} */\n` + fileCode + "\n";
                }
            }
        });
    }
    
    collectModules(fileSystem);

    let unifiedCodeBuffer = baseClasses + "\n" + derivedClasses + "\n" + executionModules;

    const originalConsoleLog = console.log;
    console.log = function(...args) {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(" ");
        customLog(message, 'log');
        originalConsoleLog.apply(console, args);
    };

    try {
        window.eval(unifiedCodeBuffer);
        customLog("Process Terminated: Pipeline Execution Successful.", "success");
    } catch (runtimeError) {
        customLog("Runtime Compilation Error: " + runtimeError.message, "error");
    } finally {
        console.log = originalConsoleLog;
    }
}

function customLog(message, type) {
    const consoleContainer = document.getElementById("consoleContainer");
    const logDiv = document.createElement("div");
    
    if (type === 'log') {
        logDiv.className = `console-log user-output`; 
        logDiv.innerText = message;
    } else if (type === 'success') {
        logDiv.className = `console-log success`; 
        logDiv.innerText = message.replace("[System] ", ""); 
    } else {
        logDiv.className = `console-log ${type}`;
        logDiv.innerText = `[System] ${message}`;
    }
    
    consoleContainer.appendChild(logDiv);
    consoleContainer.scrollTop = consoleContainer.scrollHeight;
}