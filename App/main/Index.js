"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const $ = require("jquery");
    const ElectronMenusRemote = require("electron").remote;
    const MainWindow = ElectronMenusRemote.getCurrentWindow();
    const FSInMenus = require("fs");
    const powershell = require("node-powershell");

    ///////////////////////////////////////////////////////////// Start Section Variables
    let DivEditor = document.querySelector("#editor");
    let StatusBarInMenu = document.querySelector("#status_bar");
    let FileNameInMenu = document.querySelector("#fileName");
    let ModeFileInMenu = document.querySelector("#modeFile");
    let LinesColumns = document.querySelector("#lineColumn");
    let Terminal = document.querySelector("#terminal");
    let CommandsPackageJson = document.querySelector(".commands-package-json");
    let project = document.querySelector("#sect-project");
    let NameFile = document.querySelector(".sect-name-file");
    let CloseNewFile = document.querySelector(".close-new-file");
    let NameFolder = document.querySelector(".sect-name-folder");
    let CloseNewFolder = document.querySelector(".close-new-folder");
    let SectRename = document.querySelector(".sect-rename");
    let CloseRename = document.querySelector(".close-rename");
    let ClickOkNameFile = document.querySelector(".click-ok-name-file");
    let ClickOkNameFolder = document.querySelector(".click-ok-name-folder");
    let ClickOkRename = document.querySelector(".click-ok-rename");
    let SectionDelete = document.querySelector(".sect-delete");
    let StatusBarTerminal = document.querySelector("#status_bar_terminal");
    let project_click = document.querySelector(".div-container-icon");
    let SectDragProject = document.querySelector(".sect-drag-project");
    let Lock_Lock = document.querySelector(".lock-status-bar-lock");
    let Lock_Open = document.querySelector(".lock-status-bar-open");
    let SectionBodyFolder = document.querySelector(".sect-body-project ul");
    let HeaderEditor = document.querySelector("#section-header-editor");
    let SelectModeFile = document.querySelector("#select-mode-file");
    ///////////////////////////////////////////////////////////////////////// Start Section Variables For Language
    let DivStatusBarLeft = document.querySelector(".div-container-icon");
    let DivStatusBarLeftP = document.querySelector(".div-container-icon div p");
    let ValueNameFile = document.querySelector(".value-name-file");
    let ValueNameFolder = document.querySelector(".value-name-folder");
    let ValueRename = document.querySelector(".value-rename");
    let ButtonDelete = document.querySelector(".button-delete");
    let ButtonCancel = document.querySelector(".button-cancel");
    let OpenDialog = document.querySelector("#sect-open-dialog");
    let OpenDialogP = document.querySelector("#sect-open-dialog span");
    let NewFile = document.querySelector("#new-file");
    let NewFolder = document.querySelector("#new-folder");
    let RefreshSectProject = document.querySelector("#refresh-sect-project");
    let CloseSectProject = document.querySelector("#close-sect-project");
    let TerminalClickOpen = document.querySelector(".div_terminal span");
    let DivStatusBarForNameFile = document.querySelector(".name-file div:first-child");
    let DivStatusBarForModeFile = document.querySelector(".mode-file div:first-child");
    let DivStatusBarForLineCol = document.querySelector(".line-col div:first-child");
    let StatusBarForLockLock = document.querySelector(".lock i.lock-status-bar-lock");
    let StatusBarForLockOpen = document.querySelector(".lock i.lock-status-bar-open");
    let StatusBarForSetModeFile = document.querySelector(".sect-set-mode-file");
    let TextStatusBarTerminal = document.querySelector("#status_bar_terminal p");
    let SectSelectCommand = document.querySelector(".sect-select-command");
    let RunCode = document.querySelector(".run-code-selected");
    let ClickClose = document.querySelector(".click_close");
    let MinimizeTerminal = document.querySelector(".click_minimize");
    ///////////////////////////////////////////////////////////////////////// End Section Variables For Language
    let EditorCodeMirror;
    let WindowGoogle;
    let StateSectProject = true;
    let StateStatusBar = true;
    let StateAutoSave = false;
    let StateLineWrapping = true;
    let StateTerminal = true;
    let StateSetDirectoryTerminal = true;
    let stateFuncCreatePowerShell = true;
    let StateSaveFile = true;
    let FilePathSave = "";
    let FilePathSaveAs = "";
    let FilePathOpen = "";
    let DirectoryTerminal = "";
    let PageXProject;
    let ___dirname = __dirname.replace("app.asar\\", "");
    ///////////////////////////////////////////////////////////// End Section Variables


    ///////////////////////////////////////////////////////////// Start Section Code Mirror
    EditorCodeMirror = CodeMirror(DivEditor, {
        theme: "darcula",
        lineNumbers: true,
        smartIndent: true,
        tabSize: 4,
        matchBrackets: true,
        indentWithTabs: true,
        debug: true,
        tabindex: 4,
        keyMap: "sublime",
        autofocus: true,
        addModeClass: true,
        showTrailingSpace: true,
        search: true,
        searchArgs: true,
        highlightSelectionMatches: true,
        searchOverlay: true,
        comment: true,
        indentUnit: 4,
        scrollPastEnd: true,
        autoCloseTags: true,
        enableSearchTools: true,
        enableCodeFolding: true,
        foldGutter: true,
        autoFormatOnModeChange: true,
        enableCodeFormatting: true,
        autoFormatOnStart: true,
        autoCloseBrackets: true,
        showSearchButton: true,
        dragDrop: true,
        newlineAndIndentContinueMarkdownList: true,
        autoFormatOnUncomment: true,
        showFormatButton: true,
        showCommentButton: true,
        indent: true,
        showUncommentButton: true,
        showAutoCompleteButton: true,
        highlightMatches: true,
        showCursorWhenSelecting: true,
        overlay: true,
        multiplex: true,
        showHint: true,
        styleSelectedText: true,
        styleActiveLine: true,
        selectionPointer: true,
        ContinueComments: true,
        fullScreen: true,
        annotateScrollbar: true,
        rulers: true,
        tern: true,
        spellcheck: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        lint: true,
        matchTags: {
            bothTags: true
        },
        extraKeys: {
            "Ctrl-Space": "autocomplete",
        },
    });
    let EditorInMenu = document.querySelector("#editor .CodeMirror textarea");
    let CodeMirrorInMenu = document.querySelector(".CodeMirror");
    CodeMirrorInMenu.style.height = "";
    ///////////////////////////////////////////////////////////// End Section Code Mirror


    ///////////////////////////////////////////////////////////// Start Section Show Auto Complete
    document.addEventListener("keypress", () => {
        EditorCodeMirror.showHint();
    })
    ///////////////////////////////////////////////////////////// End Section Show Auto Complete


    ///////////////////////////////////////////////////////////// Start Section DataBase
    const knex = require("knex")({
        client: "sqlite3",
        connection: {
            filename: "./DbEditor.sqlite",
        },
        useNullAsDefault: true,
    });
    knex.schema.createTableIfNotExists("Editor", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("AutoSave");
        TableBuilder.string("Theme");
        TableBuilder.string("keyMap");
        TableBuilder.string("LineWrapping");
        TableBuilder.string("DirectoryProject");
        TableBuilder.string("FileNameProject");
        TableBuilder.string("Language");
    }).then();
    const FuncInsertData = () => {
        knex("Editor").insert({
            AutoSave: "false",
            Theme: "darcula",
            keyMap: "sublime",
            LineWrapping: "false",
            DirectoryProject: "",
            FileNameProject: "",
            Language: "",
        }).then(() => {
        });
    };
    knex("Editor").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertData();
        } else {
            if (val[0]["LineWrapping"] === "true") {
                EditorCodeMirror.setOption("lineWrapping", true);
            } else if (val[0]["LineWrapping"] === "false") {
                EditorCodeMirror.setOption("lineWrapping", false);
            }
            if (val[0]["AutoSave"] === "false") {
                StateAutoSave = false;
            } else if (val[0]["AutoSave"] === "true") {
                StateAutoSave = true;
            }
            EditorCodeMirror.setOption("theme", val[0]["Theme"]);
            EditorCodeMirror.setOption("keyMap", val[0]["keyMap"]);
            if (val[0]["DirectoryProject"] !== "") {
                FuncReadDirectory(val[0]["DirectoryProject"]);
            }
            if (val[0]["Language"] === "Chinese") {
                FuncSetLanguageChinese();
            } else if (val[0]["Language"] === "Spanish") {
                FuncSetLanguageSpanish();
            } else if (val[0]["Language"] === "English") {
                FuncSetLanguageEnglish();
            } else if (val[0]["Language"] === "Hindi") {
                FuncSetLanguageHindi();
            } else if (val[0]["Language"] === "Persian") {
                FuncSetLanguagePersian();
            } else if (val[0]["Language"] === "German") {
                FuncSetLanguageGerman();
            } else if (val[0]["Language"] === "French") {
                FuncSetLanguageFrench();
            } else if (val[0]["Language"] === "Portuguese") {
                FuncSetLanguagePortuguese();
            } else if (val[0]["Language"] === "Russian") {
                FuncSetLanguageRussian();
            }
        }
    });
    ///////////////////////////////////////////////////////////// End Section DataBase


    ///////////////////////////////////////////////////////////// Start Section DataBase For Text Content
    // Start Section DataBase For Text Content English
    knex.schema.createTableIfNotExists("EditorContentEnglish", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentEnglish = () => {
        knex("EditorContentEnglish").insert({
            TitleStatusBarLeft: "Explorer",
            TextStatusBarLeft: "Project",
            placeholderNewFile: "Enter the file name",
            placeholderNewFolder: "Enter the Folder name",
            placeholderRename: "Enter a name",
            TextButtonDelete: "Delete",
            TextButtonCancel: "Cancel",
            TitleProject: "Open Project",
            TextProject: "Project",
            TitleIconNewFile: "New File In This Directory",
            TitleIconNewFolder: "New Folder In This Directory",
            TitleIconRefresh: "Refresh Section Project",
            TitleIconMinimize: "Minimize Section Project",
            TitleTerminal: "Terminal",
            TextTerminal: "Terminal",
            TextDivStatusBarForNameFile: "File Name :",
            TextDivStatusBarForModeFile: "Mode :",
            TextDivStatusBarForLineCol: "Line / Column :",
            TitleStatusBarForLockLock: "Lock Page Opening",
            TitleStatusBarForLockOpen: "Locking Page",
            TitleStatusBarForSetModeFile: "Set Mode File",
            TextStatusBarTerminal: "Terminal :",
            TitleSectSelectCommand: "Important commands",
            TitleRunCode: "Run Code",
            TitleClickClose: "Close Terminal",
            TitleMinimizeTerminal: "Minimize Terminal",
        }).then(() => {
        });
    };
    knex("EditorContentEnglish").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentEnglish();
        }
    });
    // End Section DataBase For Text Content English


    // Start Section DataBase For Text Content Chinese
    knex.schema.createTableIfNotExists("EditorContentChinese", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentChinese = () => {
        knex("EditorContentChinese").insert({
            TitleStatusBarLeft: "探险家",
            TextStatusBarLeft: "项目",
            placeholderNewFile: "输入文件名",
            placeholderNewFolder: "输入文件夹名称",
            placeholderRename: "输入名称",
            TextButtonDelete: "删除",
            TextButtonCancel: "取消",
            TitleProject: "开放项目",
            TextProject: "项目",
            TitleIconNewFile: "此目录中的新文件",
            TitleIconNewFolder: "此目录中的新文件夹",
            TitleIconRefresh: "刷新部分项目",
            TitleIconMinimize: "最小化截面项目",
            TitleTerminal: "终端",
            TextTerminal: "终端",
            TextDivStatusBarForNameFile: "文件名 :",
            TextDivStatusBarForModeFile: "模式 :",
            TextDivStatusBarForLineCol: "行 / 列 :",
            TitleStatusBarForLockLock: "锁定页面打开",
            TitleStatusBarForLockOpen: "锁定页面",
            TitleStatusBarForSetModeFile: "设置模式文件",
            TextStatusBarTerminal: "终端 :",
            TitleSectSelectCommand: "重要命令",
            TitleRunCode: "运行代码",
            TitleClickClose: "关闭终端",
            TitleMinimizeTerminal: "最小化终端",
        }).then(() => {
        });
    };
    knex("EditorContentChinese").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentChinese();
        }
    });
    // End Section DataBase For Text Content Chinese


    // Start Section DataBase For Text Content Spanish
    knex.schema.createTableIfNotExists("EditorContentSpanish", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentSpanish = () => {
        knex("EditorContentSpanish").insert({
            TitleStatusBarLeft: "Explorador",
            TextStatusBarLeft: "Proyecto",
            placeholderNewFile: "Ingrese el nombre del archivo",
            placeholderNewFolder: "Ingrese el nombre de la carpeta",
            placeholderRename: "Ingresa un nombre",
            TextButtonDelete: "Borrar",
            TextButtonCancel: "Cancelar",
            TitleProject: "Proyecto abierto",
            TextProject: "Proyecto",
            TitleIconNewFile: "Nuevo archivo en este directorio",
            TitleIconNewFolder: "Nueva carpeta en este directorio",
            TitleIconRefresh: "Actualizar proyecto de sección",
            TitleIconMinimize: "Minimizar proyecto de sección",
            TitleTerminal: "Terminal",
            TextTerminal: "Terminal",
            TextDivStatusBarForNameFile: "Nombre del archivo :",
            TextDivStatusBarForModeFile: "Modo :",
            TextDivStatusBarForLineCol: "Línea / Columna :",
            TitleStatusBarForLockLock: "Bloquear apertura de página",
            TitleStatusBarForLockOpen: "Página de bloqueo",
            TitleStatusBarForSetModeFile: "Archivo de modo de configuración",
            TextStatusBarTerminal: "Terminal :",
            TitleSectSelectCommand: "Comandos importantes",
            TitleRunCode: "Ejecutar código",
            TitleClickClose: "Cerrar terminal",
            TitleMinimizeTerminal: "Minimizar Terminal",
        }).then(() => {
        });
    };
    knex("EditorContentSpanish").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentSpanish();
        }
    });
    // End Section DataBase For Text Content Spanish


    // Start Section DataBase For Text Content Hindi
    knex.schema.createTableIfNotExists("EditorContentHindi", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentHindi = () => {
        knex("EditorContentHindi").insert({
            TitleStatusBarLeft: "एक्सप्लोरर",
            TextStatusBarLeft: "परियोजना",
            placeholderNewFile: "फ़ाइल का नाम दर्ज करें",
            placeholderNewFolder: "फ़ोल्डर का नाम दर्ज करें",
            placeholderRename: "नाम डालें",
            TextButtonDelete: "हटाएं",
            TextButtonCancel: "रद्द करना",
            TitleProject: "ओपन प्रोजेक्ट",
            TextProject: "परियोजना",
            TitleIconNewFile: "इस निर्देशिका में नई फ़ाइल",
            TitleIconNewFolder: "इस निर्देशिका में नया फ़ोल्डर",
            TitleIconRefresh: "रिफ्रेश सेक्शन प्रोजेक्ट",
            TitleIconMinimize: "अनुभाग परियोजना को छोटा करें",
            TitleTerminal: "टर्मिनल",
            TextTerminal: "टर्मिनल",
            TextDivStatusBarForNameFile: "फ़ाइल का नाम :",
            TextDivStatusBarForModeFile: "मोड :",
            TextDivStatusBarForLineCol: "लाइन / कॉलम :",
            TitleStatusBarForLockLock: "लॉक पेज ओपनिंग",
            TitleStatusBarForLockOpen: "लॉकिंग पेज",
            TitleStatusBarForSetModeFile: "मोड फ़ाइल सेट करें",
            TextStatusBarTerminal: "टर्मिनल :",
            TitleSectSelectCommand: "महत्वपूर्ण आदेश",
            TitleRunCode: "रन कोड",
            TitleClickClose: "टर्मिनल बंद करें",
            TitleMinimizeTerminal: "टर्मिनल को छोटा करें",
        }).then(() => {
        });
    };
    knex("EditorContentHindi").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentHindi();
        }
    });
    // End Section DataBase For Text Content Hindi


    // Start Section DataBase For Text Content Persian
    knex.schema.createTableIfNotExists("EditorContentPersian", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentPersian = () => {
        knex("EditorContentPersian").insert({
            TitleStatusBarLeft: "کاوشگر",
            TextStatusBarLeft: "پروژه",
            placeholderNewFile: "نام فایل را وارد کنید",
            placeholderNewFolder: "نام پوشه را وارد کنید",
            placeholderRename: "نام را وارد کنید",
            TextButtonDelete: "حذف",
            TextButtonCancel: "انصراف",
            TitleProject: "بازکردن پروژه",
            TextProject: "پروژه",
            TitleIconNewFile: "ایجاد فایل جدید در این مسیر",
            TitleIconNewFolder: "ایجاد پوشه جدید در این مسیر",
            TitleIconRefresh: "تازه سازی بخش پروژه",
            TitleIconMinimize: "کوچک کردن بخش پروژه",
            TitleTerminal: "ترمینال",
            TextTerminal: "ترمینال",
            TextDivStatusBarForNameFile: "نام فایل :",
            TextDivStatusBarForModeFile: "نوع :",
            TextDivStatusBarForLineCol: "ستون / خط :",
            TitleStatusBarForLockLock: "بازکردن قفل صفحه",
            TitleStatusBarForLockOpen: "قفل کردن صفحه",
            TitleStatusBarForSetModeFile: "ست کردن مود فایل",
            TextStatusBarTerminal: "ترمینال :",
            TitleSectSelectCommand: "دستورات مهم",
            TitleRunCode: "اجرا دستور",
            TitleClickClose: "بستن ترمینال",
            TitleMinimizeTerminal: "کوچک کردن ترمینال",
        }).then(() => {
        });
    };
    knex("EditorContentPersian").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentPersian();
        }
    });
    // End Section DataBase For Text Content Persian


    // Start Section DataBase For Text Content
    knex.schema.createTableIfNotExists("EditorContentGerman", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentGerman = () => {
        knex("EditorContentGerman").insert({
            TitleStatusBarLeft: "Forscher",
            TextStatusBarLeft: "Projekt",
            placeholderNewFile: "Geben Sie den Dateinamen ein",
            placeholderNewFolder: "Geben Sie den Ordnernamen ein",
            placeholderRename: "Geben Sie einen Namen ein",
            TextButtonDelete: "Löschen",
            TextButtonCancel: "Stornieren",
            TitleProject: "Offenes Projekt",
            TextProject: "Projekt",
            TitleIconNewFile: "Neue Datei in diesem Verzeichnis",
            TitleIconNewFolder: "Neuer Ordner in diesem Verzeichnis",
            TitleIconRefresh: "Abschnittsprojekt aktualisieren",
            TitleIconMinimize: "Abschnittsprojekt minimieren",
            TitleTerminal: "Terminal",
            TextTerminal: "Terminal",
            TextDivStatusBarForNameFile: "Dateiname :",
            TextDivStatusBarForModeFile: "Modus :",
            TextDivStatusBarForLineCol: "Zeile / Spalte :",
            TitleStatusBarForLockLock: "Seitenöffnung sperren",
            TitleStatusBarForLockOpen: "Sperrseite",
            TitleStatusBarForSetModeFile: "Set-Modus-Datei",
            TextStatusBarTerminal: "Terminal :",
            TitleSectSelectCommand: "Wichtige Befehle",
            TitleRunCode: "Code ausführen",
            TitleClickClose: "Terminal schließen",
            TitleMinimizeTerminal: "Terminal minimieren",
        }).then(() => {
        });
    };
    knex("EditorContentGerman").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentGerman();
        }
    });
    // End Section DataBase For Text Content


    // Start Section DataBase For Text Content
    knex.schema.createTableIfNotExists("EditorContentFrench", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentFrench = () => {
        knex("EditorContentFrench").insert({
            TitleStatusBarLeft: "Explorateur",
            TextStatusBarLeft: "Projet",
            placeholderNewFile: "Entrez le nom du fichier",
            placeholderNewFolder: "Entrez le nom du dossier",
            placeholderRename: "Entrez un nom",
            TextButtonDelete: "Effacer",
            TextButtonCancel: "Annuler",
            TitleProject: "Projet ouvert",
            TextProject: "Projet",
            TitleIconNewFile: "Nouveau fichier dans ce répertoire",
            TitleIconNewFolder: "Nouveau dossier dans ce répertoire",
            TitleIconRefresh: "Projet de section de rafraîchissement",
            TitleIconMinimize: "Minimiser le projet de section",
            TitleTerminal: "Terminal",
            TextTerminal: "Terminal",
            TextDivStatusBarForNameFile: "Nom de fichier :",
            TextDivStatusBarForModeFile: "Mode :",
            TextDivStatusBarForLineCol: "Ligne / Colonne :",
            TitleStatusBarForLockLock: "Verrouiller l'ouverture de la page",
            TitleStatusBarForLockOpen: "Page de verrouillage",
            TitleStatusBarForSetModeFile: "Définir le fichier de mode",
            TextStatusBarTerminal: "Terminal :",
            TitleSectSelectCommand: "Commandes importantes",
            TitleRunCode: "Exécuter le code",
            TitleClickClose: "Fermer le terminal",
            TitleMinimizeTerminal: "Minimiser le terminal",
        }).then(() => {
        });
    };
    knex("EditorContentFrench").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentFrench();
        }
    });
    // End Section DataBase For Text Content


    // Start Section DataBase For Text Content
    knex.schema.createTableIfNotExists("EditorContentPortuguese", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentPortuguese = () => {
        knex("EditorContentPortuguese").insert({
            TitleStatusBarLeft: "Explorador",
            TextStatusBarLeft: "Projeto",
            placeholderNewFile: "Digite o nome do arquivo",
            placeholderNewFolder: "Insira o nome da pasta",
            placeholderRename: "Insira o nome",
            TextButtonDelete: "Excluir",
            TextButtonCancel: "Cancelar",
            TitleProject: "Projeto aberto",
            TextProject: "Projeto",
            TitleIconNewFile: "Novo arquivo neste diretório",
            TitleIconNewFolder: "Nova pasta neste diretório",
            TitleIconRefresh: "Projeto de atualização da seção",
            TitleIconMinimize: "Minimizar Projeto de Seção",
            TitleTerminal: "terminal",
            TextTerminal: "terminal",
            TextDivStatusBarForNameFile: "Nome do arquivo :",
            TextDivStatusBarForModeFile: "Modo :",
            TextDivStatusBarForLineCol: "Coluna / linha :",
            TitleStatusBarForLockLock: "Bloquear a abertura da página",
            TitleStatusBarForLockOpen: "Página de bloqueio",
            TitleStatusBarForSetModeFile: "Arquivo de modo de definição",
            TextStatusBarTerminal: "Terminal :",
            TitleSectSelectCommand: "Comandos importantes",
            TitleRunCode: "Código de execução",
            TitleClickClose: "Fechar Terminal",
            TitleMinimizeTerminal: "Minimize Terminal",
        }).then(() => {
        });
    };
    knex("EditorContentPortuguese").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentPortuguese();
        }
    });
    // End Section DataBase For Text Content


    // Start Section DataBase For Text Content
    knex.schema.createTableIfNotExists("EditorContentRussian", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("TitleStatusBarLeft");
        TableBuilder.string("TextStatusBarLeft");
        TableBuilder.string("placeholderNewFile");
        TableBuilder.string("placeholderNewFolder");
        TableBuilder.string("placeholderRename");
        TableBuilder.string("TextButtonDelete");
        TableBuilder.string("TextButtonCancel");
        TableBuilder.string("TitleProject");
        TableBuilder.string("TextProject");
        TableBuilder.string("TitleIconNewFile");
        TableBuilder.string("TitleIconNewFolder");
        TableBuilder.string("TitleIconRefresh");
        TableBuilder.string("TitleIconMinimize");
        TableBuilder.string("TitleTerminal");
        TableBuilder.string("TextTerminal");
        TableBuilder.string("TextDivStatusBarForNameFile");
        TableBuilder.string("TextDivStatusBarForModeFile");
        TableBuilder.string("TextDivStatusBarForLineCol");
        TableBuilder.string("TitleStatusBarForLockLock");
        TableBuilder.string("TitleStatusBarForLockOpen");
        TableBuilder.string("TitleStatusBarForSetModeFile");
        TableBuilder.string("TextStatusBarTerminal");
        TableBuilder.string("TitleSectSelectCommand");
        TableBuilder.string("TitleRunCode");
        TableBuilder.string("TitleClickClose");
        TableBuilder.string("TitleMinimizeTerminal");
    }).then();
    const FuncInsertDataForTextContentRussian = () => {
        knex("EditorContentRussian").insert({
            TitleStatusBarLeft: "Исследователь",
            TextStatusBarLeft: "Проект",
            placeholderNewFile: "Введите имя файла",
            placeholderNewFolder: "Введите имя папки",
            placeholderRename: "Введите имя",
            TextButtonDelete: "Удалить",
            TextButtonCancel: "Отмена",
            TitleProject: "Открыть проект",
            TextProject: "Проект",
            TitleIconNewFile: "Новый файл в этом каталоге",
            TitleIconNewFolder: "Новая папка в этом каталоге",
            TitleIconRefresh: "Обновить проект раздела",
            TitleIconMinimize: "Свернуть проект раздела",
            TitleTerminal: "Терминал",
            TextTerminal: "Терминал",
            TextDivStatusBarForNameFile: "Имя файла :",
            TextDivStatusBarForModeFile: "Режим :",
            TextDivStatusBarForLineCol: "Строка / столбец :",
            TitleStatusBarForLockLock: "Заблокировать открытие страницы",
            TitleStatusBarForLockOpen: "Страница блокировки",
            TitleStatusBarForSetModeFile: "Файл настроек режима",
            TextStatusBarTerminal: "Терминал :",
            TitleSectSelectCommand: "Важные команды",
            TitleRunCode: "Выполнить код",
            TitleClickClose: "Закрыть Терминал",
            TitleMinimizeTerminal: "Свернуть терминал",
        }).then(() => {
        });
    };
    knex("EditorContentRussian").select("*").then((val) => {
        if (val["length"] === 0) {
            FuncInsertDataForTextContentRussian();
        }
    });
    // End Section DataBase For Text Content


    // Start Section DataBase For Text Content Function
    const FuncSetLanguageChinese = () => {
        knex("Editor").update("Language", "Chinese", () => {
        }).then();

        knex("EditorContentChinese").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguageSpanish = () => {
        knex("Editor").update("Language", "Spanish", () => {
        }).then();

        knex("EditorContentSpanish").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguageEnglish = () => {
        knex("Editor").update("Language", "English", () => {
        }).then();

        knex("EditorContentEnglish").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguageHindi = () => {
        knex("Editor").update("Language", "Hindi", () => {
        }).then();

        knex("EditorContentHindi").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguagePersian = () => {
        knex("Editor").update("Language", "Persian", () => {
        }).then();

        knex("EditorContentPersian").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguageGerman = () => {
        knex("Editor").update("Language", "German", () => {
        }).then();

        knex("EditorContentGerman").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguageFrench = () => {
        knex("Editor").update("Language", "French", () => {
        }).then();

        knex("EditorContentFrench").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguagePortuguese = () => {
        knex("Editor").update("Language", "Portuguese", () => {
        }).then();

        knex("EditorContentPortuguese").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    const FuncSetLanguageRussian = () => {
        knex("Editor").update("Language", "Russian", () => {
        }).then();

        knex("EditorContentRussian").select("*").then((val) => {
            DivStatusBarLeft.setAttribute("title", val[0]["TitleStatusBarLeft"]);
            DivStatusBarLeftP.innerHTML = val[0]["TextStatusBarLeft"];
            ValueNameFile.setAttribute("placeholder", val[0]["placeholderNewFile"]);
            ValueNameFolder.setAttribute("placeholder", val[0]["placeholderNewFolder"]);
            ValueRename.setAttribute("placeholder", val[0]["placeholderRename"]);
            ButtonDelete.innerHTML = val[0]["TextButtonDelete"];
            ButtonCancel.innerHTML = val[0]["TextButtonCancel"];
            OpenDialog.setAttribute("title", val[0]["TitleProject"]);
            OpenDialogP.innerHTML = val[0]["TextProject"];
            NewFile.setAttribute("title", val[0]["TitleIconNewFile"]);
            NewFolder.setAttribute("title", val[0]["TitleIconNewFolder"]);
            RefreshSectProject.setAttribute("title", val[0]["TitleIconRefresh"]);
            CloseSectProject.setAttribute("title", val[0]["TitleIconMinimize"]);
            TerminalClickOpen.setAttribute("title", val[0]["TitleTerminal"]);
            TerminalClickOpen.innerHTML = val[0]["TextTerminal"];
            DivStatusBarForNameFile.innerHTML = val[0]["TextDivStatusBarForNameFile"];
            DivStatusBarForModeFile.innerHTML = val[0]["TextDivStatusBarForModeFile"];
            DivStatusBarForLineCol.innerHTML = val[0]["TextDivStatusBarForLineCol"];
            StatusBarForLockLock.setAttribute("title", val[0]["TitleStatusBarForLockLock"]);
            StatusBarForLockOpen.setAttribute("title", val[0]["TitleStatusBarForLockOpen"]);
            StatusBarForSetModeFile.setAttribute("title", val[0]["TitleStatusBarForSetModeFile"]);
            TextStatusBarTerminal.innerHTML = val[0]["TextStatusBarTerminal"];
            SectSelectCommand.setAttribute("title", val[0]["TitleSectSelectCommand"]);
            RunCode.setAttribute("title", val[0]["TitleRunCode"]);
            ClickClose.setAttribute("title", val[0]["TitleClickClose"]);
            MinimizeTerminal.setAttribute("title", val[0]["TitleMinimizeTerminal"]);
        });
    };
    // End Section DataBase For Text Content Function
    ///////////////////////////////////////////////////////////// End Section DataBase For Text Content


    ///////////////////////////////////////////////////////////// Start Section Set Theme From Database
    const FuncSetThemeFromDB = () => {
        let OptionTheme = EditorCodeMirror.getOption("theme");
        knex("Editor").update("Theme", OptionTheme, () => {
        }).then();
    };
    ///////////////////////////////////////////////////////////// End Section Set Theme From Database


    ///////////////////////////////////////////////////////////// Start Section Set KeyMap From Database
    const FuncSetKeyMapFromDB = () => {
        let OptionKeyMap = EditorCodeMirror.getOption("keyMap");
        knex("Editor").update("keyMap", OptionKeyMap, () => {
        }).then();
    };
    ///////////////////////////////////////////////////////////// End Section Set KeyMap From Database


    ///////////////////////////////////////////////////////////// Start Section Functions
    ////////////////////////////////// Start Section Set Select Mode Files
    SelectModeFile.addEventListener("change", () => {
        FuncSetModeFiles("E:\\project\\project\\script." + SelectModeFile.value);
    });
    ////////////////////////////////// End Section Set Select Mode Files


    ////////////////////////////////// Start Section Set Mode Files
    const FuncSetModeFiles = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        let ModeFile = FileName.split(".")[1];
        switch (ModeFile) {
            case "apl": {
                EditorCodeMirror.setOption("mode", "text/apl");
                break;
            }
            case "asn1": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn-asn");
                break;
            }
            case "ael": {
                EditorCodeMirror.setOption("mode", "text/x-asterisk");
                break;
            }
            case "bf": {
                EditorCodeMirror.setOption("mode", "text/x-brainfuck");
                break;
            }
            case "c": {
                EditorCodeMirror.setOption("mode", "text/x-csrc");
                break;
            }
            case "cpp": {
                EditorCodeMirror.setOption("mode", "text/x-c++src");
                break;
            }
            case "cxx": {
                EditorCodeMirror.setOption("mode", "text/x-c++src");
                break;
            }
            case "CXX": {
                EditorCodeMirror.setOption("mode", "text/x-c++src");
                break;
            }
            case "java": {
                EditorCodeMirror.setOption("mode", "text/x-java");
                break;
            }
            case "jar": {
                EditorCodeMirror.setOption("mode", "text/x-java");
                break;
            }
            case "jsp": {
                EditorCodeMirror.setOption("mode", "text/x-java");
                break;
            }
            case "cs": {
                EditorCodeMirror.setOption("mode", "text/x-csharp");
                break;
            }
            case "h": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "m": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "mm": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "M": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "scala": {
                EditorCodeMirror.setOption("mode", "text/x-scala");
                break;
            }
            case "vert": {
                EditorCodeMirror.setOption("mode", "text/x-vertex");
                break;
            }
            case "frag": {
                EditorCodeMirror.setOption("mode", "x-shader/x-fragment");
                break;
            }
            case "squirrel": {
                EditorCodeMirror.setOption("mode", "text/x-squirrel");
                break;
            }
            case "ceylon": {
                EditorCodeMirror.setOption("mode", "text/x-ceylon");
                break;
            }
            case "clj": {
                EditorCodeMirror.setOption("mode", "text/x-clojure");
                break;
            }
            case "edn": {
                EditorCodeMirror.setOption("mode", "text/x-gss");
                break;
            }
            case "cmake": {
                EditorCodeMirror.setOption("mode", "text/x-cmake");
                break;
            }
            case "coffee": {
                EditorCodeMirror.setOption("mode", "application/vnd.coffeescript");
                break;
            }
            case "coffee": {
                EditorCodeMirror.setOption("mode", "text/coffeescript");
                break;
            }
            case "coffee": {
                EditorCodeMirror.setOption("mode", "text/x-coffeescript");
                break;
            }
            case "lisp": {
                EditorCodeMirror.setOption("mode", "text/x-common-lisp");
                break;
            }
            case "lsp": {
                EditorCodeMirror.setOption("mode", "text/x-common-lisp");
                break;
            }
            case "rpt": {
                EditorCodeMirror.setOption("mode", "text/x-crystal");
                break;
            }
            case "css": {
                EditorCodeMirror.setOption("mode", "text/css");
                break;
            }
            case "scss": {
                EditorCodeMirror.setOption("mode", "text/x-scss");
                break;
            }
            case "less": {
                EditorCodeMirror.setOption("mode", "text/x-less");
                break;
            }
            case "cypher": {
                EditorCodeMirror.setOption("mode", "application/x-cypher-query");
                break;
            }
            case "py": {
                EditorCodeMirror.setOption("mode", "text/x-python");
                break;
            }
            case "pyx": {
                EditorCodeMirror.setOption("mode", "text/x-cython");
                break;
            }
            case "d": {
                EditorCodeMirror.setOption("mode", "text/x-d");
                break;
            }
            case "djt": {
                EditorCodeMirror.setOption("mode", "text/x-django");
                break;
            }
            case "dockerfile ": {
                EditorCodeMirror.setOption("mode", "text/x-dockerfile");
                break;
            }
            case "diff": {
                EditorCodeMirror.setOption("mode", "text/x-diff");
                break;
            }
            case "dtd": {
                EditorCodeMirror.setOption("mode", "application/xml-dtd");
                break;
            }
            case "lid": {
                EditorCodeMirror.setOption("mode", "text/x-dylan");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/ecmascript");
                break;
            }
            case "ecl": {
                EditorCodeMirror.setOption("mode", "text/x-ecl");
                break;
            }
            case "e": {
                EditorCodeMirror.setOption("mode", "text/x-eiffel");
                break;
            }
            case "elm": {
                EditorCodeMirror.setOption("mode", "text/x-elm");
                break;
            }
            case "erl": {
                EditorCodeMirror.setOption("mode", "text/x-erlang");
                break;
            }
            case "yaws": {
                EditorCodeMirror.setOption("mode", "text/x-erlang");
                break;
            }
            case "factor": {
                EditorCodeMirror.setOption("mode", "text/x-factor");
                break;
            }
            case "fcl": {
                EditorCodeMirror.setOption("mode", "text/x-fcl");
                break;
            }
            case "f": {
                EditorCodeMirror.setOption("mode", "text/x-forth");
                break;
            }
            case "for": {
                EditorCodeMirror.setOption("mode", "text/x-forth");
                break;
            }
            case "4th": {
                EditorCodeMirror.setOption("mode", "text/x-fortran");
                break;
            }
            case "cmi": {
                EditorCodeMirror.setOption("mode", "text/x-ocaml");
                break;
            }
            case "fs": {
                EditorCodeMirror.setOption("mode", "text/x-fsharp");
                break;
            }
            case "s": {
                EditorCodeMirror.setOption("mode", "text/x-gas");
                break;
            }
            case "feature": {
                EditorCodeMirror.setOption("mode", "text/x-feature");
                break;
            }
            case "go": {
                EditorCodeMirror.setOption("mode", "text/x-go");
                break;
            }
            case "groovy": {
                EditorCodeMirror.setOption("mode", "text/x-groovy");
                break;
            }
            case "haml": {
                EditorCodeMirror.setOption("mode", "text/x-haml");
                break;
            }
            case "hbs": {
                EditorCodeMirror.setOption("mode", "text/x-handlebars-template");
                break;
            }
            case "hs": {
                EditorCodeMirror.setOption("mode", "text/x-haskell");
                break;
            }
            case "lhs": {
                EditorCodeMirror.setOption("mode", "text/x-literate-haskell");
                break;
            }
            case "hx": {
                EditorCodeMirror.setOption("mode", "text/x-haxe");
                break;
            }
            case "hxml": {
                EditorCodeMirror.setOption("mode", "text/x-hxml");
                break;
            }
            case "cs": {
                EditorCodeMirror.setOption("mode", "application/x-aspx");
                break;
            }
            case "asp": {
                EditorCodeMirror.setOption("mode", "application/x-aspx");
                break;
            }
            case "aspx": {
                EditorCodeMirror.setOption("mode", "application/x-aspx");
                break;
            }
            case "ejs": {
                EditorCodeMirror.setOption("mode", "application/x-ejs");
                break;
            }
            case "jsp": {
                EditorCodeMirror.setOption("mode", "application/x-jsp");
                break;
            }
            case "erb": {
                EditorCodeMirror.setOption("mode", "application/x-erb");
                break;
            }
            case "http": {
                EditorCodeMirror.setOption("mode", "message/http");
                break;
            }
            case "idl": {
                EditorCodeMirror.setOption("mode", "text/x-idl");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "text/javascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/javascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/x-javascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "text/ecmascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/ecmascript");
                break;
            }
            case "json": {
                EditorCodeMirror.setOption("mode", "application/jsonapplication/x-json");
                break;
            }
            case "json": {
                EditorCodeMirror.setOption("mode", "application/manifest+json");
                break;
            }
            case "json": {
                EditorCodeMirror.setOption("mode", "application/ld+json");
                break;
            }
            case "ts": {
                EditorCodeMirror.setOption("mode", "text/typescript");
                break;
            }
            case "ts": {
                EditorCodeMirror.setOption("mode", "application/typescript");
                break;
            }
            case "jl": {
                EditorCodeMirror.setOption("mode", "text/x-julia");
                break;
            }
            case "ls": {
                EditorCodeMirror.setOption("mode", "text/x-livescript");
                break;
            }
            case "lua": {
                EditorCodeMirror.setOption("mode", "text/x-lua");
                break;
            }
            case "md": {
                EditorCodeMirror.setOption("mode", "text/x-markdown");
                break;
            }
            case "m": {
                EditorCodeMirror.setOption("mode", "text/x-mathematica");
                break;
            }
            case "mbox": {
                EditorCodeMirror.setOption("mode", "application/mbox");
                break;
            }
            case "mrc": {
                EditorCodeMirror.setOption("mode", "text/mirc");
                break;
            }
            case "ini": {
                EditorCodeMirror.setOption("mode", "text/mirc");
                break;
            }
            case "mo": {
                EditorCodeMirror.setOption("mode", "text/x-modelica");
                break;
            }
            case "mscgen": {
                EditorCodeMirror.setOption("mode", "text/x-mscgen");
                break;
            }
            case "msc": {
                EditorCodeMirror.setOption("mode", "text/x-mscgen");
                break;
            }
            case "xu": {
                EditorCodeMirror.setOption("mode", "text/x-xu");
                break;
            }
            case "mscgen": {
                EditorCodeMirror.setOption("mode", "text/x-msgenny");
                break;
            }
            case "msc": {
                EditorCodeMirror.setOption("mode", "text/x-msgenny");
                break;
            }
            case "nginx": {
                EditorCodeMirror.setOption("mode", "text/x-nginx-conf");
                break;
            }
            case "nsi": {
                EditorCodeMirror.setOption("mode", "text/x-nsis");
                break;
            }
            case "pl": {
                EditorCodeMirror.setOption("mode", "application/n-quads");
                break;
            }
            case "f#": {
                EditorCodeMirror.setOption("mode", "text/x-fsharp");
                break;
            }
            case "m": {
                EditorCodeMirror.setOption("mode", "text/x-octave");
                break;
            }
            case "oz": {
                EditorCodeMirror.setOption("mode", "text/x-oz");
                break;
            }
            case "p": {
                EditorCodeMirror.setOption("mode", "text/x-pascal");
                break;
            }
            case "pas": {
                EditorCodeMirror.setOption("mode", "text/x-pascal");
                break;
            }
            case "pascal": {
                EditorCodeMirror.setOption("mode", "text/x-pascal");
                break;
            }
            case "perl": {
                EditorCodeMirror.setOption("mode", "text/x-perl");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp-encrypted");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp-keys");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp-signature");
                break;
            }
            case "php": {
                EditorCodeMirror.setOption("mode", "application/x-httpd-php");
                break;
            }
            case "php": {
                EditorCodeMirror.setOption("mode", "text/x-php");
                break;
            }
            case "pig": {
                EditorCodeMirror.setOption("mode", "text/x-pig");
                break;
            }
            case "ps1": {
                EditorCodeMirror.setOption("mode", "application/x-powershell");
                break;
            }
            case "ps2": {
                EditorCodeMirror.setOption("mode", "application/x-powershell");
                break;
            }
            case "ps3": {
                EditorCodeMirror.setOption("mode", "application/x-powershell");
                break;
            }
            case "properties": {
                EditorCodeMirror.setOption("mode", "text/x-properties");
                break;
            }
            case "properties": {
                EditorCodeMirror.setOption("mode", "text/x-ini");
                break;
            }
            case "proto": {
                EditorCodeMirror.setOption("mode", "text/x-protobuf");
                break;
            }
            case "pug": {
                EditorCodeMirror.setOption("mode", "text/x-pug");
                break;
            }
            case "jade": {
                EditorCodeMirror.setOption("mode", "text/x-jade");
                break;
            }
            case "puppet": {
                EditorCodeMirror.setOption("mode", "text/x-puppet");
                break;
            }
            case "q": {
                EditorCodeMirror.setOption("mode", "text/x-q");
                break;
            }
            case "r": {
                EditorCodeMirror.setOption("mode", "text/x-rsrc");
                break;
            }
            case "spec": {
                EditorCodeMirror.setOption("mode", "text/x-rpm-spec");
                break;
            }
            case "spec": {
                EditorCodeMirror.setOption("mode", "text/x-rpm-changes");
                break;
            }
            case "rst": {
                EditorCodeMirror.setOption("mode", "text/x-rst");
                break;
            }
            case "rb": {
                EditorCodeMirror.setOption("mode", "text/x-ruby");
                break;
            }
            case "rs": {
                EditorCodeMirror.setOption("mode", "text/x-rustsrc");
                break;
            }
            case "rlib": {
                EditorCodeMirror.setOption("mode", "text/x-rustsrc");
                break;
            }
            case "sas": {
                EditorCodeMirror.setOption("mode", "text/x-sas");
                break;
            }
            case "sass": {
                EditorCodeMirror.setOption("mode", "text/x-sass");
                break;
            }
            case "xlsm": {
                EditorCodeMirror.setOption("mode", "text/x-spreadsheet");
                break;
            }
            case "xls": {
                EditorCodeMirror.setOption("mode", "text/x-spreadsheet");
                break;
            }
            case "xlsx": {
                EditorCodeMirror.setOption("mode", "text/x-spreadsheet");
                break;
            }
            case "scm": {
                EditorCodeMirror.setOption("mode", "text/x-scheme");
                break;
            }
            case "sh": {
                EditorCodeMirror.setOption("mode", "text/x-sh");
                break;
            }
            case "sh": {
                EditorCodeMirror.setOption("mode", "application/x-sh");
                break;
            }
            case "sieve": {
                EditorCodeMirror.setOption("mode", "application/sieve");
                break;
            }
            case "slim": {
                EditorCodeMirror.setOption("mode", "application/x-slim");
                break;
            }
            case "smalltalk": {
                EditorCodeMirror.setOption("mode", "text/x-stsrc");
                break;
            }
            case "stsrc": {
                EditorCodeMirror.setOption("mode", "text/x-stsrc");
                break;
            }
            case "tpl": {
                EditorCodeMirror.setOption("mode", "text/x-smarty");
                break;
            }
            case "solr": {
                EditorCodeMirror.setOption("mode", "text/x-solr");
                break;
            }
            case "soy": {
                EditorCodeMirror.setOption("mode", "text/x-soy");
                break;
            }
            case "styl": {
                EditorCodeMirror.setOption("mode", "text/x-styl");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-sql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-mysql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-mariadb");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-cassandra");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-plsql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-mssql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-hive");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-pgsql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-gql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-gpsql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-esper");
                break;
            }
            case "sparql": {
                EditorCodeMirror.setOption("mode", "application/sparql-query");
                break;
            }
            case "swift": {
                EditorCodeMirror.setOption("mode", "text/x-swift");
                break;
            }
            case "stex": {
                EditorCodeMirror.setOption("mode", "text/x-stex");
                break;
            }
            case "tcl": {
                EditorCodeMirror.setOption("mode", "text/x-tcl");
                break;
            }
            case "textile": {
                EditorCodeMirror.setOption("mode", "text/x-textile");
                break;
            }
            case "tid": {
                EditorCodeMirror.setOption("mode", "text/x-tiddlywiki");
                break;
            }
            case "toml": {
                EditorCodeMirror.setOption("mode", "text/x-toml");
                break;
            }
            case "tornado": {
                EditorCodeMirror.setOption("mode", "text/x-tornado");
                break;
            }
            case "troff": {
                EditorCodeMirror.setOption("mode", "troff");
                break;
            }
            case "ttcn": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn");
                break;
            }
            case "ttcn3": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn3");
                break;
            }
            case "ttcnpp": {
                EditorCodeMirror.setOption("mode", "text/x-ttcnpp");
                break;
            }
            case "cfg": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn-cfg");
                break;
            }
            case "turtle": {
                EditorCodeMirror.setOption("mode", "text/turtle");
                break;
            }
            case "vb": {
                EditorCodeMirror.setOption("mode", "text/x-vb");
                break;
            }
            case "vbs": {
                EditorCodeMirror.setOption("mode", "text/vbscript");
                break;
            }
            case "vm": {
                EditorCodeMirror.setOption("mode", "text/velocity");
                break;
            }
            case "vm": {
                EditorCodeMirror.setOption("mode", "text/x-verilog");
                break;
            }
            case "sv": {
                EditorCodeMirror.setOption("mode", "text/x-systemverilog");
                break;
            }
            case "vhd": {
                EditorCodeMirror.setOption("mode", "text/x-vhdl");
                break;
            }
            case "vue": {
                EditorCodeMirror.setOption("mode", "text/x-vue");
                break;
            }
            case "webidl": {
                EditorCodeMirror.setOption("mode", "text/x-webidl");
                break;
            }
            case "wasm": {
                EditorCodeMirror.setOption("mode", "text/webassembly");
                break;
            }
            case "xml": {
                EditorCodeMirror.setOption("mode", "application/xml");
                break;
            }
            case "html": {
                EditorCodeMirror.setOption("mode", "text/html");
                break;
            }
            case "htm": {
                EditorCodeMirror.setOption("mode", "text/html");
                break;
            }
            case "xquery": {
                EditorCodeMirror.setOption("mode", "application/xquery");
                break;
            }
            case "yacas": {
                EditorCodeMirror.setOption("mode", "text/x-yacas");
                break;
            }
            case "yaml": {
                EditorCodeMirror.setOption("mode", "text/x-yaml");
                break;
            }
            case "z80": {
                EditorCodeMirror.setOption("mode", "text/x-z80");
                break;
            }
            case "ez80": {
                EditorCodeMirror.setOption("mode", "text/x-ez80");
                break;
            }
            default : {
                break;
            }
        }
    };
    ////////////////////////////////// End Section Set Mode Files


    ////////////////////////////////// Start Section Folder
    OpenDialog.addEventListener("click", () => {
        FuncOpenFolder();
    });
    let fnReadDirectory = "Code";
    const FuncReadDirectory = (val) => {
        FSInMenus.readdir(val, "utf8", (err, files) => {
            if (files !== undefined) {
                files.forEach((filesOne) => {
                    let TagLi = document.createElement("li");
                    let TagIconArrow = document.createElement("span");
                    TagIconArrow.classList.add("icon-arrow");
                    let TagIconFolder = document.createElement("span");
                    TagIconFolder.classList.add("icon-folder");
                    let TagImg = document.createElement("img");
                    let text = document.createTextNode(`${filesOne}`);

                    let filePathsOpenDir = val + filesOne;
                    let FileNameLength = filePathsOpenDir.split("\\").length - 1;
                    let FileName = filePathsOpenDir.split("\\")[FileNameLength];
                    let ModeFile = FileName.split(".")[1];
                    let FilePathFormat = filePathsOpenDir.replace(filesOne, "\\") + filesOne;

                    if (ModeFile === undefined) {
                        TagLi.appendChild(TagIconArrow);
                        TagLi.appendChild(TagIconFolder);
                    }

                    if (ModeFile !== undefined) {
                        TagLi.appendChild(TagImg);
                        TagImg.style.margin = "0 0 0 20px";
                        TagImg.style.width = "18px";
                        TagImg.style.height = "18px";
                        TagImg.style.position = "relative";
                        TagImg.style.top = "3px";
                        FuncSetIconFiles(ModeFile, TagImg);
                        TagLi.addEventListener("dblclick", () => {
                            if (FilePathFormat) {
                                FSInMenus.readFile(FilePathFormat, "utf8", (err, data) => {
                                    FilePathSave = FilePathFormat;
                                    FuncSetStatusBar(FilePathFormat);
                                    FuncSetModeFiles(FilePathFormat);
                                    FuncSetTitle(FilePathFormat);
                                    FuncSetHeaderEditor(FilePathFormat);
                                    EditorCodeMirror.setValue(data);
                                });
                            }
                        });
                    }

                    TagImg.setAttribute("draggable", "false");
                    TagLi.appendChild(text);
                    TagLi.style.whiteSpace = "nowrap";
                    SectionBodyFolder.appendChild(TagLi);
                    if (TagLi) {
                        TagLi.addEventListener("mousedown", () => {
                            FuncSetActiveLi(TagLi);
                            knex("Editor").update("DirectoryProject", val).then();
                        });
                        FuncSetActiveLi(TagLi);
                    }

                    if (fnReadDirectory === "Code") {
                        project.addEventListener("mousedown", (event) => {
                            FuncSetNameFile(event);
                        });
                        fnReadDirectory = null;
                    }
                });
            }
        });
        knex("Editor").update("DirectoryProject", val).then();
    };
    const FuncSetActiveLi = (Li) => {
        let LiGetOfPage = document.querySelectorAll(".sect-body-project li");
        LiGetOfPage.forEach((li) => {
            li.style.background = "";
            li.className = "no-active";
        });
        Li.style.background = "linear-gradient(45deg, skyblue 0%, rgba(0,163,255,1) 100%)";
        Li.className = "active";
    };
    const FuncSetNameFile = (event) => {
        let LiActive = document.querySelector(".sect-body-project li.active");
        let LiLength = LiActive.innerHTML.split(">").length - 1;
        let LiText = LiActive.innerHTML.split(">")[LiLength];
        knex("Editor").update("FileNameProject", LiText).then();
        if (event.buttons === 2) {
            ContextMenusProject.popup({
                x: event.x,
                y: event.y,
            });
        }
    };
    NewFile.addEventListener("click", () => {
        let fnNewFile = "Code";
        knex("Editor").select("DirectoryProject").then((val) => {
            NameFile.style.display = "flex";
            ValueNameFile.focus();
            document.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    FuncClickOkNameFile();
                }
            });
            ClickOkNameFile.addEventListener("click", () => {
                FuncClickOkNameFile();
            });
            const FuncClickOkNameFile = () => {
                let fileName;
                fileName = ValueNameFile.value;
                if (fileName === "") {
                    ValueNameFile.focus();
                } else {
                    if (fnNewFile === "Code") {
                        FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + fileName, "", {}, () => {
                            NameFile.style.display = "none";
                            ValueNameFile.value = "";
                            FuncRefreshFolder();
                        });
                        fnNewFile = null;
                    }
                }
            };
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                FuncCloseNewFile();
            }
        });
        CloseNewFile.addEventListener("click", () => {
            FuncCloseNewFile();
        });
        const FuncCloseNewFile = () => {
            NameFile.style.display = "none";
            ValueNameFile.value = "";
            fnNewFile = null;
        };
    });
    NewFolder.addEventListener("click", () => {
        let fnNewFolder = "Code";
        knex("Editor").select("DirectoryProject").then((val) => {
            NameFolder.style.display = "flex";
            ValueNameFolder.focus();
            document.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    FuncClickOkNameFolder();
                }
            });
            ClickOkNameFolder.addEventListener("click", () => {
                FuncClickOkNameFolder();
            });
            const FuncClickOkNameFolder = () => {
                let folderName;
                folderName = ValueNameFolder.value;
                if (folderName === "") {
                    ValueNameFolder.focus();
                } else {
                    if (fnNewFolder === "Code") {
                        FSInMenus.mkdir(val[0]["DirectoryProject"] + "\\" + folderName, {}, () => {
                            NameFolder.style.display = "none";
                            ValueNameFolder.value = "";
                            FuncRefreshFolder();
                        });
                        fnNewFolder = null;
                    }
                }
            };
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                FuncCloseNewFolder();
            }
        });
        CloseNewFolder.addEventListener("click", () => {
            FuncCloseNewFolder();
        });
        const FuncCloseNewFolder = () => {
            NameFolder.style.display = "none";
            ValueNameFolder.value = "";
            fnNewFolder = null;
        };
    });
    const FuncRenameItemFolder = () => {
        let fnRenameItem = "Code";
        let FileName;
        knex("Editor").select("FileNameProject").then((val) => {
            FileName = val[0]["FileNameProject"];
        });
        knex("Editor").select("DirectoryProject").then((val) => {
            SectRename.style.display = "flex";
            ValueRename.value = FileName;
            ValueRename.focus();
            document.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    FuncClickOkRename();
                }
            });
            ClickOkRename.addEventListener("click", () => {
                FuncClickOkRename();
            });
            const FuncClickOkRename = () => {
                let fileRename;
                fileRename = ValueRename.value;
                if (fileRename === "") {
                    ValueRename.focus();
                } else {
                    let SelectTagDiv = $(`#section-header-editor div:contains(${FileName})`);
                    let SelectTextTagDiv = document.querySelectorAll("#section-header-editor div");
                    if (fnRenameItem === "Code") {
                        FSInMenus.rename(val[0]["DirectoryProject"] + "\\" + FileName, val[0]["DirectoryProject"] + "\\" + fileRename, () => {
                            SectRename.style.display = "none";
                            ValueRename.value = "";
                            SelectTextTagDiv.forEach((ItemDiv) => {
                                if (ItemDiv.textContent === FileName) {
                                    FuncSetTitle(val[0]["DirectoryProject"] + "\\" + fileRename);
                                    FuncSetHeaderEditor(val[0]["DirectoryProject"] + "\\" + fileRename);
                                    FuncSetStatusBar(val[0]["DirectoryProject"] + "\\" + fileRename);
                                    FuncSetModeFiles(val[0]["DirectoryProject"] + "\\" + fileRename);
                                }
                            });
                            SelectTagDiv.remove();
                            FuncRefreshFolder();
                        });
                        fnRenameItem = null;
                    }
                }
            };
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    FuncCloseRename();
                }
            });
            CloseRename.addEventListener("click", () => {
                FuncCloseRename();
            });
            const FuncCloseRename = () => {
                SectRename.style.display = "none";
                ValueRename.value = "";
                fnRenameItem = null;
            };
        });
    };
    const FuncRevealInFileExplorer = () => {
        let FileName;
        knex("Editor").select("FileNameProject").then((val) => {
            FileName = val[0]["FileNameProject"];
        });
        knex("Editor").select("DirectoryProject").then((val) => {
            let FilePathForOpen = val[0]["DirectoryProject"] + "\\" + FileName;
            if (FilePathForOpen.search("\\\\")) {
                let ReplaceFilePathForOpen = FilePathForOpen.replace("\\\\", "\\");
                ElectronMenusRemote.shell.showItemInFolder(ReplaceFilePathForOpen);
            } else {
                ElectronMenusRemote.shell.showItemInFolder(FilePathForOpen);
            }
        });
    };
    const FuncDeleteItemFolder = () => {
        let fnDeleteFile = "Code";
        let FileName;
        SectionDelete.style.display = "flex";
        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                FuncDelete();
            }
        });
        ButtonDelete.addEventListener("click", () => {
            FuncDelete();
        });
        const FuncDelete = () => {
            if (fnDeleteFile === "Code") {
                knex("Editor").select("FileNameProject").then((val) => {
                    FileName = val[0]["FileNameProject"];
                    let SelectTagDiv = $(`#section-header-editor div:contains(${FileName})`);
                    StateSaveFile = false;
                    FilePathSave = "";
                    EditorInMenu.focus();
                    MainWindow.title = "Editor Code";
                    FileNameInMenu.innerHTML = "";
                    ModeFileInMenu.innerHTML = "";
                    EditorCodeMirror.setValue("");
                    SelectTagDiv.remove();
                });
                knex("Editor").select("DirectoryProject").then((val) => {
                    FSInMenus.rmdir(val[0]["DirectoryProject"] + "\\" + FileName, () => {
                    });
                    FSInMenus.unlink(val[0]["DirectoryProject"] + "\\" + FileName, () => {
                    });
                    FuncRefreshFolder();
                });
                SectionDelete.style.display = "none";
                fnDeleteFile = null;
            }
        };
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                FuncCancelDelete();
            }
        });
        ButtonCancel.addEventListener("click", () => {
            FuncCancelDelete();
        });
        const FuncCancelDelete = () => {
            SectionDelete.style.display = "none";
            fnDeleteFile = null;
        };
    };
    const FuncNewFileInProject = () => {
        let fnNewFile = "Code";
        let ModeFile;
        let FileName;
        knex("Editor").select("FileNameProject").then((val) => {
            FileName = val[0]["FileNameProject"];
            ModeFile = FileName.split(".")[1];
        });
        knex("Editor").select("DirectoryProject").then((val) => {
            NameFile.style.display = "flex";
            ValueNameFile.focus();
            document.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    FuncClickOkNameFile();
                }
            });
            ClickOkNameFile.addEventListener("click", () => {
                FuncClickOkNameFile();
            });
            const FuncClickOkNameFile = () => {
                let fileName;
                fileName = ValueNameFile.value;
                if (fileName === "") {
                    ValueNameFile.focus();
                } else {
                    if (ModeFile === undefined) {
                        if (fnNewFile === "Code") {
                            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + FileName + "\\" + fileName, "", {}, () => {
                                NameFile.style.display = "none";
                                ValueNameFile.value = "";
                                FuncRefreshFolder();
                            });
                            fnNewFile = null;
                        }
                    } else {
                        if (fnNewFile === "Code") {
                            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + fileName, "", {}, () => {
                                NameFile.style.display = "none";
                                ValueNameFile.value = "";
                                FuncRefreshFolder();
                            });
                            fnNewFile = null;
                        }
                    }
                }
            };
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                FuncCloseNewFile();
            }
        });
        CloseNewFile.addEventListener("click", () => {
            FuncCloseNewFile();
        });
        const FuncCloseNewFile = () => {
            NameFile.style.display = "none";
            ValueNameFile.value = "";
            fnNewFile = null;
        };
    };
    const FuncNewFolderInProject = () => {
        let fnNewFolder = "Code";
        let ModeFile;
        let FileName;
        knex("Editor").select("FileNameProject").then((val) => {
            FileName = val[0]["FileNameProject"];
            ModeFile = FileName.split(".")[1];
        });
        knex("Editor").select("DirectoryProject").then((val) => {
            NameFolder.style.display = "flex";
            ValueNameFolder.focus();
            document.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    FuncClickOkNameFolder();
                }
            });
            ClickOkNameFolder.addEventListener("click", () => {
                FuncClickOkNameFolder();
            });
            const FuncClickOkNameFolder = () => {
                let folderName;
                folderName = ValueNameFolder.value;
                if (folderName === "") {
                    ValueNameFolder.focus();
                } else {
                    if (ModeFile === undefined) {
                        if (fnNewFolder === "Code") {
                            FSInMenus.mkdir(val[0]["DirectoryProject"] + "\\" + FileName + "\\" + folderName, {}, () => {
                                NameFolder.style.display = "none";
                                ValueNameFolder.value = "";
                                FuncRefreshFolder();
                            });
                            fnNewFolder = null;
                        }
                    } else {
                        if (fnNewFolder === "Code") {
                            FSInMenus.mkdir(val[0]["DirectoryProject"] + "\\" + folderName, {}, () => {
                                NameFolder.style.display = "none";
                                ValueNameFolder.value = "";
                                FuncRefreshFolder();
                            });
                            fnNewFolder = null;
                        }
                    }
                }
            };
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                FuncCloseNewFolder();
            }
        });
        CloseNewFolder.addEventListener("click", () => {
            FuncCloseNewFolder();
        });
        const FuncCloseNewFolder = () => {
            NameFolder.style.display = "none";
            ValueNameFolder.value = "";
            fnNewFolder = null;
        };
    };
    const FuncOpenFileInCodeEditor = () => {
        let FileName;
        let ModeFile;
        knex("Editor").select("FileNameProject").then((val) => {
            FileName = val[0]["FileNameProject"];
        });
        knex("Editor").select("DirectoryProject").then((val) => {
            let FilePathFormat = val[0]["DirectoryProject"] + FileName;
            ModeFile = FileName.split(".")[1];
            if (FilePathFormat) {
                if (ModeFile === undefined) {
                    ElectronMenusRemote.dialog.showMessageBox(MainWindow, {
                        title: "Error",
                        message: "This Not Is a File",
                        type: "error",
                        buttons: ["Ok"],
                    }).then();
                } else {
                    FSInMenus.readFile(FilePathFormat, "utf8", (err, data) => {
                        FilePathSave = FilePathFormat;
                        FuncSetStatusBar(FilePathFormat);
                        FuncSetModeFiles(FilePathFormat);
                        FuncSetTitle(FilePathFormat);
                        FuncSetHeaderEditor(FilePathFormat);
                        EditorCodeMirror.setValue(data);
                    });
                }
            }
        });
    };
    const FuncCopyPathFileFolder = () => {
        knex("Editor").select("FileNameProject").then((val) => {
            let FileNameCopy = val[0]["FileNameProject"];
            knex("Editor").select("DirectoryProject").then((val) => {
                let FilenameForCopy = val[0]["DirectoryProject"] + "\\" + FileNameCopy;
                ElectronMenusRemote.clipboard.writeText(FilenameForCopy, "clipboard");
            });
        });
    };
    const FuncCopyNameFileFolder = () => {
        knex("Editor").select("FileNameProject").then((val) => {
            let FileName = val[0]["FileNameProject"];
            ElectronMenusRemote.clipboard.writeText(FileName, "clipboard");
        });
    };
    RefreshSectProject.addEventListener("click", () => {
        FuncRefreshFolder();
    });
    const FuncRefreshFolder = () => {
        SectionBodyFolder.innerHTML = "";
        knex("Editor").select("DirectoryProject").then((val) => {
            FuncReadDirectory(val[0]["DirectoryProject"]);
        });
    };
    const FuncOpenFolder = () => {
        SectionBodyFolder.innerHTML = "";
        ElectronMenusRemote.dialog.showOpenDialog(MainWindow, {
            properties: ["openDirectory"],
            title: "Open Folder",
        }).then((val) => {
            if (val.filePaths[0] !== undefined) {
                FuncReadDirectory(val.filePaths[0]);
            } else {
                knex("Editor").select("DirectoryProject").then((val) => {
                    FuncReadDirectory(val[0]["DirectoryProject"]);
                });
            }
        });
    };
    ////////////////////////////////// End Section Folder


    //////////////////////////////// Start Section Create Template Files
    const FuncCreateTemplateHtml = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "index.html", `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Title</title>
		<link rel="stylesheet" href="">
	</head>
	<body>
	</body>
	<script src=""></script>
</html>`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateCss = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "style.css", `* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateJavaScript = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.js", `'use strict';`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateSql = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "main.sql", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateSass = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "style.scss", `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "JetBrains Mono", serif;
    font-size: 16px;
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplatePhp = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "index.html", `<?php  ?>`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplatePython = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "main.py", `print('Hello, World!')`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateCpp = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "main.cpp", `#include <iostream>
using namespace std;
int main()
{
	
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateCsharp = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "main.cs", `#using System;
namespace HelloWorld;
{
	class Program
	{
		static void Main(string[] args);
		{
			
		}
	}
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateKivy = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "style.kv", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateJava = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.jar", `public class Main {
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateKotlin = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.kt", `fun main() {
	
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateXml = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "index.xml", `<?xml version="1.0" encoding="UTF-8"?>
<note>
	<to>Tove</to>
	<from>Jani</from>
	<heading>Reminder</heading>
	<body>Don't forget me this weekend!</body>
</note>`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateTypeScript = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.ts", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateGo = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.go", `package main
import "fmt"
func main() {

}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateCython = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.pyx", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateD = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.d", `import std.stdio, std.array, std.algorithm;
void main()
{
	stdin ;
}`, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateDiff = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.diff", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateLiveScript = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.ls", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    const FuncCreateTemplateLua = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            FSInMenus.writeFile(val[0]["DirectoryProject"] + "\\" + "script.lua", ``, {}, () => {
                FuncRefreshFolder();
            });
        });
    };
    //////////////////////////////// End Section Create Template Files


    ////////////////////////////////// Start Section Lock
    Lock_Lock.addEventListener("click", () => {
        Lock_Lock.style.display = "none";
        Lock_Open.style.display = "block";
        EditorCodeMirror.setOption("readOnly", false);
    });
    Lock_Open.addEventListener("click", () => {
        Lock_Lock.style.display = "block";
        Lock_Open.style.display = "none";
        EditorCodeMirror.setOption("readOnly", true);
    });
    CodeMirrorInMenu.addEventListener("keyup", () => {
        if (EditorCodeMirror.getOption("readOnly") === true) {
            ElectronMenusRemote.dialog.showMessageBox(MainWindow, {
                title: "readOnly",
                message: "Read-only mode is enabled, you must press the lock button to write",
                buttons: ["Ok"],
            }).then();
        }
    });
    ////////////////////////////////// End Section Lock


    ////////////////////////////////// Start Section Set Icon Files
    const FuncSetIconFiles = (ModeFile, TagImg) => {
        switch (ModeFile) {
            case "txt": {
                TagImg.src = ___dirname + "\\assets\\Icons\\text.png";
                break;
            }
            case "apl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "asn1": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "ael": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "bf": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "c": {
                TagImg.src = ___dirname + "\\assets\\Icons\\c.png";
                break;
            }
            case "cpp": {
                TagImg.src = ___dirname + "assets\\Icons\\cpp.svg";
                break;
            }
            case "cxx": {
                TagImg.src = ___dirname + "\\assets\\Icons\\cpp.svg";
                break;
            }
            case "CXX": {
                TagImg.src = ___dirname + "\\assets\\Icons\\cpp.svg";
                break;
            }
            case "java": {
                TagImg.src = ___dirname + "\\assets\\Icons\\java.svg";
                break;
            }
            case "jar": {
                TagImg.src = ___dirname + "\\assets\\Icons\\java.svg";
                break;
            }
            case "jsp": {
                TagImg.src = ___dirname + "\\assets\\Icons\\java-alt.svg";
                break;
            }
            case "cs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\csharp.svg";
                break;
            }
            case "h": {
                TagImg.src = ___dirname + "\\assets\\Icons\\c-h.png";
                break;
            }
            case "m": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "mm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\mm.png";
                break;
            }
            case "M": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "scala": {
                TagImg.src = ___dirname + "\\assets\\Icons\\scala.svg";
                break;
            }
            case "vert": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "frag": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "squirrel": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "ceylon": {
                TagImg.src = ___dirname + "\\assets\\Icons\\ceylon.png";
                break;
            }
            case "clj": {
                TagImg.src = ___dirname + "\\assets\\Icons\\clojure.svg";
                break;
            }
            case "edn": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "cmake": {
                TagImg.src = ___dirname + "\\assets\\Icons\\cmake.svg";
                break;
            }
            case "coffee": {
                TagImg.src = ___dirname + "\\assets\\Icons\\coffeescript.svg";
                break;
            }
            case "coffee": {
                TagImg.src = ___dirname + "\\assets\\Icons\\coffeescript.svg";
                break;
            }
            case "coffee": {
                TagImg.src = ___dirname + "\\assets\\Icons\\coffeescript.svg";
                break;
            }
            case "lisp": {
                TagImg.src = ___dirname + "\\assets\\Icons\\lisp.png";
                break;
            }
            case "lsp": {
                TagImg.src = ___dirname + "\\assets\\Icons\\lisp.png";
                break;
            }
            case "rpt": {
                TagImg.src = ___dirname + "\\assets\\Icons\\crystal.svg";
                break;
            }
            case "css": {
                TagImg.src = ___dirname + "\\assets\\Icons\\css.svg";
                break;
            }
            case "scss": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sass.svg";
                break;
            }
            case "less": {
                TagImg.src = ___dirname + "\\assets\\Icons\\less.svg";
                break;
            }
            case "cypher": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "py": {
                TagImg.src = ___dirname + "\\assets\\Icons\\python.svg";
                break;
            }
            case "pyx": {
                TagImg.src = ___dirname + "\\assets\\Icons\\cython.png";
                break;
            }
            case "d": {
                TagImg.src = ___dirname + "\\assets\\Icons\\d.png";
                break;
            }
            case "djt": {
                TagImg.src = ___dirname + "\\assets\\Icons\\Django.png";
                break;
            }
            case "dockerfile ": {
                TagImg.src = ___dirname + "\\assets\\Icons\\docker.svg";
                break;
            }
            case "diff": {
                TagImg.src = ___dirname + "\\assets\\Icons\\diff.png";
                break;
            }
            case "dtd": {
                TagImg.src = ___dirname + "\\assets\\Icons\\dtd.png";
                break;
            }
            case "lid": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "ecl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\ecl.png";
                break;
            }
            case "e": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "elm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\elm.svg";
                break;
            }
            case "erl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\erlang.png";
                break;
            }
            case "yaws": {
                TagImg.src = ___dirname + "\\assets\\Icons\\erlang.png";
                break;
            }
            case "factor": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "fcl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\fcl.png";
                break;
            }
            case "f": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "for": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "4th": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "cmi": {
                TagImg.src = ___dirname + "\\assets\\Icons\\cmi.png";
                break;
            }
            case "fs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\fsharp.png";
                break;
            }
            case "s": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "feature": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "go": {
                TagImg.src = ___dirname + "\\assets\\Icons\\go.svg";
                break;
            }
            case "groovy": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "haml": {
                TagImg.src = ___dirname + "\\assets\\Icons\\haml.png";
                break;
            }
            case "hbs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\hbs.png";
                break;
            }
            case "hs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\haskell.png";
                break;
            }
            case "lhs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\haskell.png";
                break;
            }
            case "hx": {
                TagImg.src = ___dirname + "\\assets\\Icons\\haxe.png";
                break;
            }
            case "hxml": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "cs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\cs.png";
                break;
            }
            case "asp": {
                TagImg.src = ___dirname + "\\assets\\Icons\\asp.png";
                break;
            }
            case "aspx": {
                TagImg.src = ___dirname + "\\assets\\Icons\\aspx.png";
                break;
            }
            case "ejs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\ejs.png";
                break;
            }
            case "jsp": {
                TagImg.src = ___dirname + "\\assets\\Icons\\jsp.png";
                break;
            }
            case "erb": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "http": {
                TagImg.src = ___dirname + "\\assets\\Icons\\http.png";
                break;
            }
            case "idl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\idl.png";
                break;
            }
            case "js": {
                TagImg.src = ___dirname + "\\assets\\Icons\\javascript.svg";
                break;
            }
            case "json": {
                TagImg.src = ___dirname + "\\assets\\Icons\\json.png";
                break;
            }
            case "ts": {
                TagImg.src = ___dirname + "\\assets\\Icons\\typescript.svg";
                break;
            }
            case "jl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\julia.svg";
                break;
            }
            case "ls": {
                TagImg.src = ___dirname + "\\assets\\Icons\\livescript.svg";
                break;
            }
            case "lua": {
                TagImg.src = ___dirname + "\\assets\\Icons\\lua.svg";
                break;
            }
            case "md": {
                TagImg.src = ___dirname + "\\assets\\Icons\\md.png";
                break;
            }
            case "m": {
                TagImg.src = ___dirname + "\\assets\\Icons\\m.png";
                break;
            }
            case "mbox": {
                TagImg.src = ___dirname + "\\assets\\Icons\\mbox.png";
                break;
            }
            case "mrc": {
                TagImg.src = ___dirname + "\\assets\\Icons\\mirc.png";
                break;
            }
            case "ini": {
                TagImg.src = ___dirname + "\\assets\\Icons\\mirc.png";
                break;
            }
            case "mo": {
                TagImg.src = ___dirname + "\\assets\\Icons\\mo.png";
                break;
            }
            case "msc": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "xu": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "mscgen": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "msc": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "nginx": {
                TagImg.src = ___dirname + "\\assets\\Icons\\nginx.png";
                break;
            }
            case "nsi": {
                TagImg.src = ___dirname + "\\assets\\Icons\\nsi.png";
                break;
            }
            case "pl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\pl.png";
                break;
            }
            case "f#": {
                TagImg.src = ___dirname + "\\assets\\Icons\\fsharp.png";
                break;
            }
            case "oz": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "p": {
                TagImg.src = ___dirname + "\\assets\\Icons\\pascal.png";
                break;
            }
            case "pas": {
                TagImg.src = ___dirname + "\\assets\\Icons\\pascal.png";
                break;
            }
            case "pascal": {
                TagImg.src = ___dirname + "\\assets\\Icons\\pascal-project.svg";
                break;
            }
            case "perl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\perl.png";
                break;
            }
            case "asc": {
                TagImg.src = ___dirname + "\\assets\\Icons\\asc.png";
                break;
            }
            case "php": {
                TagImg.src = ___dirname + "\\assets\\Icons\\php.svg";
                break;
            }
            case "pig": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "ps1": {
                TagImg.src = ___dirname + "\\assets\\Icons\\powerpoint.svg";
                break;
            }
            case "ps2": {
                TagImg.src = ___dirname + "\\assets\\Icons\\powerpoint.svg";
                break;
            }
            case "ps3": {
                TagImg.src = ___dirname + "\\assets\\Icons\\powerpoint.svg";
                break;
            }
            case "properties": {
                TagImg.src = ___dirname + "\\assets\\Icons\\properties.png";
                break;
            }
            case "proto": {
                TagImg.src = ___dirname + "\\assets\\Icons\\proto.png";
                break;
            }
            case "pug": {
                TagImg.src = ___dirname + "\\assets\\Icons\\pug.png";
                break;
            }
            case "jade": {
                TagImg.src = ___dirname + "\\assets\\Icons\\jade.svg";
                break;
            }
            case "puppet": {
                TagImg.src = ___dirname + "\\assets\\Icons\\puppet.svg";
                break;
            }
            case "q": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "r": {
                TagImg.src = ___dirname + "\\assets\\Icons\\r.png";
                break;
            }
            case "spec": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "rst": {
                TagImg.src = ___dirname + "\\assets\\Icons\\rst.png";
                break;
            }
            case "rb": {
                TagImg.src = ___dirname + "\\assets\\Icons\\ruby.svg";
                break;
            }
            case "rs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\rs.png";
                break;
            }
            case "rlib": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "sas": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sas.png";
                break;
            }
            case "sass": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sass.svg";
                break;
            }
            case "xlsm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sp.png";
                break;
            }
            case "xls": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sp.png";
                break;
            }
            case "xlsx": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sp.png";
                break;
            }
            case "scm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\scheme.svg";
                break;
            }
            case "sh": {
                TagImg.src = ___dirname + "\\assets\\Icons\\shell.png";
                break;
            }
            case "sieve": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "slim": {
                TagImg.src = ___dirname + "\\assets\\Icons\\slim.svg";
                break;
            }
            case "smalltalk": {
                TagImg.src = ___dirname + "\\assets\\Icons\\smalltalk.png";
                break;
            }
            case "stsrc": {
                TagImg.src = ___dirname + "\\assets\\Icons\\smarty.png";
                break;
            }
            case "tpl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\tpl.png";
                break;
            }
            case "solr": {
                TagImg.src = ___dirname + "\\assets\\Icons\\solr.png";
                break;
            }
            case "soy": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "styl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "sql": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sql.png";
                break;
            }
            case "sparql": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sparql.png";
                break;
            }
            case "swift": {
                TagImg.src = ___dirname + "\\assets\\Icons\\swift.svg";
                break;
            }
            case "stex": {
                TagImg.src = ___dirname + "\\assets\\Icons\\stex.png";
                break;
            }
            case "tcl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\tcl.png";
                break;
            }
            case "textile": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "tid": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "toml": {
                TagImg.src = ___dirname + "\\assets\\Icons\\toml.png";
                break;
            }
            case "tornado": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "troff": {
                TagImg.src = ___dirname + "\\assets\\Icons\\troff.png";
                break;
            }
            case "ttcn": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "ttcn3": {
                TagImg.src = ___dirname + "\\assets\\Icons\\ttcn3.png";
                break;
            }
            case "ttcnpp": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "cfg": {
                TagImg.src = ___dirname + "\\assets\\Icons\\config.png";
                break;
            }
            case "turtle": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "vb": {
                TagImg.src = ___dirname + "\\assets\\Icons\\vb.png";
                break;
            }
            case "vbs": {
                TagImg.src = ___dirname + "\\assets\\Icons\\vbs.png";
                break;
            }
            case "vm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\vm.png";
                break;
            }
            case "sv": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sv.png";
                break;
            }
            case "sqlite": {
                TagImg.src = ___dirname + "\\assets\\Icons\\sqlite.png";
                break;
            }
            case "vhd": {
                TagImg.src = ___dirname + "\\assets\\Icons\\vhd.png";
                break;
            }
            case "vue": {
                TagImg.src = ___dirname + "\\assets\\Icons\\vue.svg";
                break;
            }
            case "webidl": {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
            case "wasm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\wasm.png";
                break;
            }
            case "xml": {
                TagImg.src = ___dirname + "\\assets\\Icons\\xml.png";
                break;
            }
            case "html": {
                TagImg.src = ___dirname + "\\assets\\Icons\\html.png";
                break;
            }
            case "htm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\html.png";
                break;
            }
            case "xquery": {
                TagImg.src = ___dirname + "\\assets\\Icons\\xquery.png";
                break;
            }
            case "yacas": {
                TagImg.src = ___dirname + "\\assets\\Icons\\yacas.png";
                break;
            }
            case "yaml": {
                TagImg.src = ___dirname + "\\assets\\Icons\\yaml.png";
                break;
            }
            case "z80": {
                TagImg.src = ___dirname + "\\assets\\Icons\\z80.png";
                break;
            }
            case "ez80": {
                TagImg.src = ___dirname + "\\assets\\Icons\\z80.png";
                break;
            }
            case "zip": {
                TagImg.src = ___dirname + "\\assets\\Icons\\zip.svg";
                break;
            }
            case "word": {
                TagImg.src = ___dirname + "\\assets\\Icons\\word.svg";
                break;
            }
            case "ps": {
                TagImg.src = ___dirname + "\\assets\\Icons\\photoshop.svg";
                break;
            }
            case "pdf": {
                TagImg.src = ___dirname + "\\assets\\Icons\\pdf.svg";
                break;
            }
            case "gitignore": {
                TagImg.src = ___dirname + "\\assets\\Icons\\git.svg";
                break;
            }
            case "gitattributes": {
                TagImg.src = ___dirname + "\\assets\\Icons\\git.svg";
                break;
            }
            case "exe": {
                TagImg.src = ___dirname + "\\assets\\Icons\\exe.png";
                break;
            }
            case "babelrc": {
                TagImg.src = ___dirname + "\\assets\\Icons\\babel.svg";
                break;
            }
            case "babel": {
                TagImg.src = ___dirname + "\\assets\\Icons\\babel.svg";
                break;
            }
            case "babel.config.json": {
                TagImg.src = ___dirname + "\\assets\\Icons\\babel.svg";
                break;
            }
            case "kv": {
                TagImg.src = ___dirname + "\\assets\\Icons\\kivy.png";
                break;
            }
            case "kt": {
                TagImg.src = ___dirname + "\\assets\\Icons\\kotlin.svg";
                break;
            }
            case "wma": {
                TagImg.src = ___dirname + "\\assets\\Icons\\audio.png";
                break;
            }
            case "ogg": {
                TagImg.src = ___dirname + "\\assets\\Icons\\audio.png";
                break;
            }
            case "aac": {
                TagImg.src = ___dirname + "\\assets\\Icons\\audio.png";
                break;
            }
            case "mp3": {
                TagImg.src = ___dirname + "\\assets\\Icons\\audio.png";
                break;
            }
            case "pcm": {
                TagImg.src = ___dirname + "\\assets\\Icons\\audio.png";
                break;
            }
            case "wav": {
                TagImg.src = ___dirname + "\\assets\\Icons\\audio.png";
                break;
            }
            case "rar": {
                TagImg.src = ___dirname + "\\assets\\Icons\\rar.png";
                break;
            }
            default : {
                TagImg.src = ___dirname + "\\assets\\Icons\\notFound.png";
                break;
            }
        }
    };
    ////////////////////////////////// End Section Set Icon Files


    ////////////////////////////////// Start Section Set Header Editor
    const FuncSetHeaderEditor = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        let ModeFile = FileName.split(".")[1];
        let TagDiv = document.createElement("div");
        let TagImg = document.createElement("img");
        let TagSpan = document.createElement("span");
        let TagB = document.createElement("b");
        let text = document.createTextNode(`${FileName}`);
        let SelectElementDivSpan = document.querySelectorAll("#section-header-editor div span");
        let SelectTagDiv = $(`#section-header-editor div:contains(${FileName})`);

        TagImg.setAttribute("draggable", "false");
        TagB.setAttribute("title", "Close");
        TagDiv.appendChild(TagImg);
        TagDiv.appendChild(TagSpan);
        TagSpan.appendChild(text);
        TagDiv.appendChild(TagB);
        FuncSetIconFiles(ModeFile, TagImg);
        HeaderEditor.appendChild(TagDiv);

        const FuncStateActive = () => {
            let Div = document.querySelectorAll("#section-header-editor div");
            Div.forEach((div) => {
                div.style.background = "#888";
            });
            TagDiv.style.background = "linear-gradient(225deg, #87ceeb 40%, #90ee90 100%)";
        };

        FuncStateActive();
        SelectElementDivSpan.forEach((textInFor) => {
            if (textInFor.innerHTML === FileName) {
                SelectTagDiv.css("background", "linear-gradient(225deg, #87ceeb 40%, #90ee90 100%)");
                EditorInMenu.focus();
                HeaderEditor.removeChild(TagDiv);
            }
        });
        TagDiv.addEventListener("click", () => {
            FuncReadFile();
            FuncStateActive();
        });
        TagB.addEventListener("click", () => {
            FuncClose();
        });
        const FuncReadFile = () => {
            if (StateSaveFile === true) {
                FilePathSave = FilePathOpen;
                FSInMenus.readFile(FilePathOpen, "utf8", (err, data) => {
                    EditorInMenu.focus();
                    if (EditorCodeMirror.getValue() !== data) {
                        EditorCodeMirror.setValue(data);
                        FuncSetTitle(FilePathOpen);
                        FuncSetStatusBar(FilePathOpen);
                        FuncSetModeFiles(FilePathOpen);
                        if (HeaderEditor.innerHTML === "") {
                            FilePathSave = "";
                            EditorCodeMirror.setValue("");
                            MainWindow.title = "Editor Code";
                            FileNameInMenu.innerHTML = "";
                            ModeFileInMenu.innerHTML = "";
                            EditorInMenu.focus();
                        }
                    }
                });
            }
            StateSaveFile = true;
        };
        const FuncClose = () => {
            StateSaveFile = false;
            FilePathSave = "";
            EditorInMenu.focus();
            MainWindow.title = "Editor Code";
            FileNameInMenu.innerHTML = "";
            ModeFileInMenu.innerHTML = "";
            HeaderEditor.removeChild(TagDiv);
            EditorCodeMirror.setValue("");
        };
    };
    ////////////////////////////////// End Section Set Header Editor


    ////////////////////////////////// Start Section Set Star Save
    EditorInMenu.addEventListener("input", () => {
        MainWindow.title = MainWindow.title + "*";
        MainWindow.title = MainWindow.title.replace("**", "*");
    });
    ////////////////////////////////// End Section Set Star Save


    ////////////////////////////////// Start Section Project
    project_click.addEventListener("click", () => {
        if (StateSectProject === true) {
            if (PageXProject) {
                project.style.left = "25px";
                project.style.display = "block";
                HeaderEditor.style.left = PageXProject;
                CodeMirrorInMenu.style.left = PageXProject;
                SectDragProject.style.left = PageXProject - "5px";
                SectDragProject.style.display = "block";
                StateSectProject = false;
            } else {
                project.style.left = "25px";
                project.style.right = "1446px";
                project.style.display = "block";
                HeaderEditor.style.left = "300px";
                CodeMirrorInMenu.style.left = "300px";
                SectDragProject.style.left = "295px";
                SectDragProject.style.display = "block";
                StateSectProject = false;
            }
        } else {
            project.style.left = "25px";
            project.style.display = "none";
            CodeMirrorInMenu.style.left = "25px";
            HeaderEditor.style.left = "25px";
            SectDragProject.style.display = "none";
            StateSectProject = true;
            EditorInMenu.focus();
        }
        CloseSectProject.addEventListener("click", () => {
            project.style.left = "25px";
            project.style.display = "none";
            CodeMirrorInMenu.style.left = "25px";
            HeaderEditor.style.left = "25px";
            SectDragProject.style.display = "none";
            StateSectProject = true;
            EditorInMenu.focus();
        });
        SectDragProject.addEventListener("drag", (e) => {
            if (e.pageX !== 0 && e.pageX > 200) {
                PageXProject = e.pageX + "px";
                CodeMirrorInMenu.style.left = e.pageX + "px";
                HeaderEditor.style.left = e.pageX + "px";
                project.style.right = document.body.offsetWidth - e.pageX + "px";
                SectDragProject.style.left = e.pageX - 5 + "px";
            }
        });
    });
    ////////////////////////////////// End Section Project


    ////////////////////////////////// Start Section Set Terminal
    TerminalClickOpen.addEventListener("click", () => {
        if (StateTerminal === true) {
            Terminal.style.display = "block";
            StatusBarTerminal.style.display = "flex";
            StateTerminal = false;
            FuncFindCommandFromPackage();
            Terminal.focus();
            if (stateFuncCreatePowerShell === true) {
                stateFuncCreatePowerShell = false;
                StateSetDirectoryTerminal = true;
                FuncCreatePowerShell();
            }
        } else if (StateTerminal === false) {
            EditorInMenu.focus();
            Terminal.style.display = "none";
            StatusBarTerminal.style.display = "none";
            StateTerminal = true;
        }
    });
    MinimizeTerminal.addEventListener("click", () => {
        EditorInMenu.focus();
        Terminal.style.display = "none";
        StatusBarTerminal.style.display = "none";
        StateTerminal = true;
    });
    const FuncCreatePowerShell = () => {
        try {
            const ps = new powershell({
                executionPolicy: "Bypass",
                noProfile: false,
                verbose: true,
                pwsh: false,
            });
            const FuncGetDirectory = () => {
                knex("Editor").select("DirectoryProject").then((val) => {
                    if (val[0]["DirectoryProject"] !== "" && StateSetDirectoryTerminal === true) {
                        StateSetDirectoryTerminal = false;
                        let command = `cd ${val[0]["DirectoryProject"]}`;
                        ps.addCommand(command).then();
                        ps.invoke().then(() => {
                            ps.addCommand("dir").then();
                            ps.invoke().then((output) => {
                                DirectoryTerminal = output.split("Directory: ")[1].split("Mode")[0].trim();
                                Terminal.value = `PS ${DirectoryTerminal}> `;
                            });
                        });
                    } else {
                        ps.addCommand("dir").then();
                        ps.invoke().then((output) => {
                            DirectoryTerminal = output.split("Directory: ")[1].split("Mode")[0].trim();
                            Terminal.value = `PS ${DirectoryTerminal}> `;
                        });
                    }
                });
            };
            const FuncTerminal = () => {
                Terminal.addEventListener("keyup", (e) => {
                    let LengthValueTerminal = Terminal.value.split(">").length - 1;
                    let ValueTerminal = Terminal.value.split(">")[LengthValueTerminal].trim();
                    if (e.keyCode === 13) {
                        ps.addCommand(ValueTerminal, {}).then();
                        ps.invoke().then((output) => {
                                Terminal.value += `${output}PS ${DirectoryTerminal}> `;
                                Terminal.focus();
                                if (ValueTerminal.search("cd") === 0) {
                                    FuncGetDirectory();
                                } else if (ValueTerminal === "clear" || ValueTerminal === "cls") {
                                    FuncGetDirectory();
                                }
                            }
                        ).catch((err) => {
                            Terminal.value += `${err}PS ${DirectoryTerminal}> `;
                        });
                    }
                });
            };
            ClickClose.addEventListener("click", () => {
                EditorInMenu.focus();
                Terminal.value = "";
                ps.dispose().then();
                stateFuncCreatePowerShell = true;
                StateTerminal = true;
                Terminal.style.display = "none";
                StatusBarTerminal.style.display = "none";
            });
            RunCode.addEventListener("click", () => {
                ps.addCommand(`${SectSelectCommand.value}`).then();
                ps.invoke().then((output) => {
                    Terminal.value += `

${output}PS ${DirectoryTerminal}> `;
                    Terminal.focus();
                }).catch((err) => {
                    Terminal.value += `

${err}PS ${DirectoryTerminal}> `;
                });
            });
            FuncGetDirectory();
            FuncTerminal();
        } catch (err) {
            ElectronMenusRemote.dialog.showErrorBox("Error", `${err}`);
        }
    };
    const FuncFindCommandFromPackage = () => {
        knex("Editor").select("DirectoryProject").then((val) => {
            if (val[0]["DirectoryProject"] !== "") {
                FSInMenus.readdir(val[0]["DirectoryProject"], "utf8", (err, files) => {
                    files.forEach((FilesInFor) => {
                        if (FilesInFor === "package.json") {
                            FSInMenus.readFile(val[0]["DirectoryProject"] + "\\" + FilesInFor, "utf8", (err, data) => {
                                CommandsPackageJson.innerHTML = "";
                                data.split('"scripts"')[1].split("{")[1].split("}")[0].split(",").forEach((Item) => {
                                    let ItemLength = Item.split(":").length - 1;
                                    let SplitItem = Item.split(":")[ItemLength].split('"')[1].split('"')[0].trim();
                                    let TagOption = document.createElement("option");
                                    let Text = document.createTextNode(`${SplitItem}`);
                                    TagOption.setAttribute("value", `${SplitItem}`);
                                    TagOption.appendChild(Text);
                                    CommandsPackageJson.appendChild(TagOption);
                                });
                            });
                        } else {
                            CommandsPackageJson.innerHTML = "";
                            let TagOption = document.createElement("option");
                            let Text = document.createTextNode("Not Found File Package.json");
                            TagOption.appendChild(Text);
                            CommandsPackageJson.appendChild(TagOption);
                        }
                    });
                });
            } else {
                CommandsPackageJson.innerHTML = "";
                let TagOption = document.createElement("option");
                let Text = document.createTextNode("Not Found File Package.json");
                TagOption.appendChild(Text);
                CommandsPackageJson.appendChild(TagOption);
            }
        });
    };
    StatusBarTerminal.addEventListener("drag", (e) => {
        let PageY = Math.abs(document.body.offsetHeight - e.pageY);
        if (e.pageY !== 0 && PageY > 80 && PageY < 850) {
            StatusBarTerminal.style.top = e.pageY - 30 + "px";
            Terminal.style.top = e.pageY + "px";
        }
    });
    StatusBarTerminal.addEventListener("dragstart", (e) => {
        let TagImg = document.createElement("img");
        e.dataTransfer.setDragImage(TagImg, 0, 0);
    });
    ////////////////////////////////// End Section Set Terminal


    ////////////////////////////////// Start Functions Get Line Number And Get Line Columns
    CodeMirrorInMenu.addEventListener("input", () => {
        GetLineColumnNumber();
    });
    CodeMirrorInMenu.addEventListener("keyup", () => {
        GetLineColumnNumber();
    });
    CodeMirrorInMenu.addEventListener("mousedown", () => {
        GetLineColumnNumber();
    });
    const GetLineColumnNumber = () => {
        let LineCol = EditorCodeMirror.doc.getCursor();
        LinesColumns.innerHTML = `${LineCol.line + 1} : ${LineCol.ch}`;
    };
    GetLineColumnNumber();
    ////////////////////////////////// End Functions Get Line Number And Get Line Columns


    ////////////////////////////////// Start Functions Set Status Bar
    const FuncSetStatusBar = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        let ModeFile = FileName.split(".")[1];
        FileNameInMenu.innerHTML = FileName.split(".")[0];
        ModeFileInMenu.innerHTML = ModeFile;
    };
    ////////////////////////////////// End Functions Set Status Bar


    ////////////////////////////////// Start Functions Set Title
    const FuncSetTitle = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        MainWindow.title = `Editor Code - ${FileName}`;
    };
    ////////////////////////////////// End Functions Set Title


    ////////////////////////////////// Start Functions Files
    const FuncNewFile = () => {
        MainWindow.title = "Editor Code - Untitled.txt";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "Untitled";
        ModeFileInMenu.innerHTML = "txt";
        FilePathSave = "";
    };
    const FuncOpenFile = () => {
        ElectronMenusRemote.dialog.showOpenDialog(MainWindow, {}).then((result) => {
            if (result.filePaths[0]) {
                FilePathOpen = result.filePaths[0];
                FilePathSave = result.filePaths[0];
                FSInMenus.readFile(FilePathOpen, "utf8", (err, data) => {
                    EditorCodeMirror.setValue(data);
                    FuncSetTitle(FilePathOpen);
                    FuncSetHeaderEditor(FilePathOpen);
                    FuncSetStatusBar(FilePathOpen);
                    FuncSetModeFiles(FilePathOpen);
                    FuncRefreshFolder();
                });
            }
        });
    };
    const FuncSave = () => {
        if (FilePathSave !== "") {
            FSInMenus.writeFile(FilePathSave, EditorCodeMirror.getValue(), "utf8", () => {
                MainWindow.title = MainWindow.title.replace("*", "");
                FuncRefreshFolder();
            });
        } else {
            FuncSaveAs();
        }
    };
    const FuncSaveAs = () => {
        ElectronMenusRemote.dialog.showSaveDialog(MainWindow, {}
        ).then((result) => {
                if (result.filePath) {
                    FilePathSaveAs = result.filePath;
                    FSInMenus.writeFile(FilePathSaveAs, EditorCodeMirror.getValue(), "utf8", () => {
                        FuncSetTitle(FilePathSaveAs);
                        FuncSetHeaderEditor(FilePathSaveAs);
                        FuncSetStatusBar(FilePathSaveAs);
                        FuncSetModeFiles(FilePathSaveAs);
                        FuncRefreshFolder();
                    });
                }
            }
        ).catch((err) => {
            ElectronMenusRemote.dialog.showErrorBox("Error", `${err}`);
        });
    };
    EditorInMenu.addEventListener("keyup", () => {
        if (StateAutoSave === true) {
            FuncSave();
            knex("Editor").update("AutoSave", "true", () => {
            }).then();
        } else if (StateAutoSave === false) {
            knex("Editor").update("AutoSave", "false", () => {
            }).then();
            return null;
        }
    });
    const FuncPrint = () => {
        MainWindow.webContents.print({}, () => {

        });
    };
    ////////////////////////////////// End Functions Files


    ////////////////////////////////// Start Functions Edit
    const FuncUndo = () => {
        EditorCodeMirror.undo();
    };
    const FuncRedo = () => {
        EditorCodeMirror.redo();
    };
    const FuncDuplicate = () => {
        let Selection = EditorCodeMirror.getSelection();
        if (Selection !== "") {
            EditorCodeMirror.doc.replaceSelection(Selection.repeat(2));
        } else {
            let LineCol = EditorCodeMirror.doc.getCursor();
            let ValueLine = EditorCodeMirror.doc.getLine(LineCol.line);
            EditorCodeMirror.doc.replaceSelection(`
` + ValueLine.repeat(1));
        }
    };
    const FuncSearchWithGoogle = () => {
        WindowGoogle = new ElectronMenusRemote.BrowserWindow({
            show: false,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nodeIntegrationInWorker: true,
            },
        });
        WindowGoogle.loadURL("https://google.com").then(() => {
        });
        WindowGoogle.maximize();
        WindowGoogle.on("ready-to-show", () => {
            WindowGoogle.show();
        });
    };
    const FuncFind = () => {
        EditorCodeMirror.execCommand("find");
    };
    const FuncFindNext = () => {
        EditorCodeMirror.execCommand("findNext");
    };
    const FuncFindPrev = () => {
        EditorCodeMirror.execCommand("findPrev");
    };
    const FuncReplace = () => {
        EditorCodeMirror.execCommand("replace");
    };
    const FuncReplaceAll = () => {
        EditorCodeMirror.execCommand("replaceAll");
    };
    const FuncSelectAll = () => {
        EditorCodeMirror.execCommand("selectAll");
    };
    ////////////////////////////////// End Functions Edit


    ////////////////////////////////// Start Functions Templates
    const FuncHTML = () => {
        MainWindow.title = "Editor Code - index.html";
        EditorCodeMirror.setValue(`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Title</title>
		<link rel="stylesheet" href="">
	</head>
	<body>
	</body>
	<script src=""></script>
</html>`);
        FileNameInMenu.innerHTML = "index";
        ModeFileInMenu.innerHTML = "html";
        EditorCodeMirror.setOption("mode", "text/html");
    };
    const FuncCss = () => {
        MainWindow.title = "Editor Code - style.css";
        EditorCodeMirror.setValue(`* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}`);
        FileNameInMenu.innerHTML = "style";
        ModeFileInMenu.innerHTML = "css";
        EditorCodeMirror.setOption("mode", "text/css");
    };
    const FuncJavaScript = () => {
        MainWindow.title = "Editor Code - script.js";
        EditorCodeMirror.setValue("'use strict';");
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "js";
        EditorCodeMirror.setOption("mode", "text/javascript");
    };
    const FuncSql = () => {
        MainWindow.title = "Editor Code - main.sql";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "sql";
        EditorCodeMirror.setOption("mode", "text/x-sql");
    };
    const FuncSass = () => {
        MainWindow.title = "Editor Code - style.scss";
        EditorCodeMirror.setValue(`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "JetBrains Mono", serif;
    font-size: 16px;
}`);
        FileNameInMenu.innerHTML = "style";
        ModeFileInMenu.innerHTML = "scss";
        EditorCodeMirror.setOption("mode", "text/x-scss");
    };
    const FuncPhp = () => {
        MainWindow.title = "Editor Code - index.html";
        EditorCodeMirror.setValue("<?php  ?>");
        FileNameInMenu.innerHTML = "index";
        ModeFileInMenu.innerHTML = "php";
        EditorCodeMirror.setOption("mode", "application/x-httpd-php");
    };
    const FuncPython = () => {
        MainWindow.title = "Editor Code - main.py";
        EditorCodeMirror.setValue("print('Hello, World!')");
        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "py";
        EditorCodeMirror.setOption("mode", "text/x-python");
    };
    const FuncCpp = () => {
        MainWindow.title = "Editor Code - main.cpp";
        EditorCodeMirror.setValue(`#include <iostream>
using namespace std;
int main()
{
	
}`);
        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "cpp";
        EditorCodeMirror.setOption("mode", "text/x-c++src");
    };
    const FuncCSharp = () => {
        MainWindow.title = "Editor Code - main.cs";
        EditorCodeMirror.setValue(`#using System;
namespace HelloWorld;
{
	class Program
	{
		static void Main(string[] args);
		{
			
		}
	}
}`);
        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "cs";
        EditorCodeMirror.setOption("mode", "text/x-csharp");
    };
    const FuncKivy = () => {
        MainWindow.title = "Editor Code - style.kv";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "style";
        ModeFileInMenu.innerHTML = "ky";
    };
    const FuncJava = () => {
        MainWindow.title = "Editor Code - script.jar";
        EditorCodeMirror.setValue(`public class Main {
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}`);
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "jar";
        EditorCodeMirror.setOption("mode", "text/x-java");
    };
    const FuncKotlin = () => {
        MainWindow.title = "Editor Code - script.kt";
        EditorCodeMirror.setValue(`fun main() {
	
}`);
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "kt";
        EditorCodeMirror.setOption("mode", "text/x-squirrel");
    };
    const FuncXml = () => {
        MainWindow.title = "Editor Code - index.xml";
        EditorCodeMirror.setValue(`<?xml version="1.0" encoding="UTF-8"?>
<note>
	<to>Tove</to>
	<from>Jani</from>
	<heading>Reminder</heading>
	<body>Don't forget me this weekend!</body>
</note>`);
        FileNameInMenu.innerHTML = "index";
        ModeFileInMenu.innerHTML = "xml";
        EditorCodeMirror.setOption("mode", "application/xml");
    };
    const FuncTypeScript = () => {
        MainWindow.title = "Editor Code - script.ts";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "ts";
        EditorCodeMirror.setOption("mode", "text/typescript");
    };
    const FuncGo = () => {
        MainWindow.title = "Editor Code - script.go";
        EditorCodeMirror.setValue(`package main
import "fmt"
func main() {

}`);
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "go";
        EditorCodeMirror.setOption("mode", "text/x-go");
    };
    const FuncCython = () => {
        MainWindow.title = "Editor Code - script.pyx";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "pyx";
        EditorCodeMirror.setOption("mode", "text/x-cython");
    };
    const FuncD = () => {
        MainWindow.title = "Editor Code - script.d";
        EditorCodeMirror.setValue(`import std.stdio, std.array, std.algorithm;
void main()
{
	stdin ;
}`);
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "d";
        EditorCodeMirror.setOption("mode", "text/x-d");
    };
    const FuncDiff = () => {
        MainWindow.title = "Editor Code - script.diff";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "diff";
        EditorCodeMirror.setOption("mode", "text/x-diff");
    };
    const FuncLiveScript = () => {
        MainWindow.title = "Editor Code - script.ls";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "ls";
        EditorCodeMirror.setOption("mode", "text/x-livescript");
    };
    const FuncLua = () => {
        MainWindow.title = "Editor Code - script.lua";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "lua";
        EditorCodeMirror.setOption("mode", "text/x-lua");
    };
    ////////////////////////////////// End Functions Templates


    ////////////////////////////////// Start Functions View
    const FuncStatusBar = () => {
        if (StateStatusBar === true) {
            CodeMirrorInMenu.style.height = "100%";
            StatusBarInMenu.style.bottom = "-35px";
            project.style.bottom = "0";
            SectDragProject.style.bottom = "0";
            StateStatusBar = false;
        } else {
            CodeMirrorInMenu.style.height = "calc(100% - 65px)";
            StatusBarInMenu.style.bottom = "0";
            project.style.bottom = "35px";
            SectDragProject.style.bottom = "35px";
            StateStatusBar = true;
        }
    };
    const FuncSetPositionTerminal = () => {
        if (StateStatusBar === false) {
            Terminal.style.bottom = "0";
            StatusBarTerminal.style.bottom = "200px";
        } else if (StateStatusBar === true) {
            Terminal.style.bottom = "35px";
            StatusBarTerminal.style.bottom = "235px";
        }
    }
    const FuncLineWrapping = () => {
        if (StateLineWrapping === true) {
            knex("Editor").update("LineWrapping", "true").then();
            EditorCodeMirror.setOption("lineWrapping", true);
            StateLineWrapping = false;
        } else {
            knex("Editor").update("LineWrapping", "false").then();
            EditorCodeMirror.setOption("lineWrapping", false);
            StateLineWrapping = true;
        }
    };
    ////////////////////////////////// End Functions View


    ////////////////////////////////// Start Functions Code
    const autoFormatAllCode = () => {
        let Cursor = EditorCodeMirror.getCursor();
        let totalLines = EditorCodeMirror.lineCount();
        let totalChars = EditorCodeMirror.getValue().length;
        EditorCodeMirror.autoFormatRange({line: 0, ch: 0}, {line: totalLines, ch: totalChars});
        EditorCodeMirror.setCursor(Cursor.line, Cursor.ch);
    };
    const FuncToggleComment = () => {
        EditorCodeMirror.toggleComment(getSelection());
    };
    ////////////////////////////////// End Functions Code


    ////////////////////////////////// Start Functions KeyMap
    const FuncEmacs = () => {
        EditorCodeMirror.setOption("keyMap", "emacs");
    };
    const FuncSublime = () => {
        EditorCodeMirror.setOption("keyMap", "sublime");
    };
    const FuncVim = () => {
        EditorCodeMirror.setOption("keyMap", "vim");
    };
    ////////////////////////////////// Start Functions KeyMap


    ////////////////////////////////// Start Functions Theme
    const FuncDay = () => {
        EditorCodeMirror.setOption("theme", "3024-day");
        FuncSetThemeFromDB();
    };
    const Func3024Night = () => {
        EditorCodeMirror.setOption("theme", "3024-night");
        FuncSetThemeFromDB();
    };
    const FuncAbbott = () => {
        EditorCodeMirror.setOption("theme", "abbott");
        FuncSetThemeFromDB();
    };
    const FuncABCDef = () => {
        EditorCodeMirror.setOption("theme", "abcdef");
        FuncSetThemeFromDB();
    };
    const FuncAmbiance = () => {
        EditorCodeMirror.setOption("theme", "ambiance");
        FuncSetThemeFromDB();
    };
    const FuncAmbianceMobile = () => {
        EditorCodeMirror.setOption("theme", "ambiance-mobile");
        FuncSetThemeFromDB();
    };
    const FuncAyuDark = () => {
        EditorCodeMirror.setOption("theme", "ayu-dark");
        FuncSetThemeFromDB();
    };
    const FuncAyuMirage = () => {
        EditorCodeMirror.setOption("theme", "ayu-mirage");
        FuncSetThemeFromDB();
    };
    const FuncBaseDark = () => {
        EditorCodeMirror.setOption("theme", "base16-dark");
        FuncSetThemeFromDB();
    };
    const FuncBaseLight = () => {
        EditorCodeMirror.setOption("theme", "base16-light");
        FuncSetThemeFromDB();
    };
    const FuncBespin = () => {
        EditorCodeMirror.setOption("theme", "bespin");
        FuncSetThemeFromDB();
    };
    const FuncBlackBoard = () => {
        EditorCodeMirror.setOption("theme", "blackboard");
        FuncSetThemeFromDB();
    };
    const FuncCobalt = () => {
        EditorCodeMirror.setOption("theme", "cobalt");
        FuncSetThemeFromDB();
    };
    const FuncColorForth = () => {
        EditorCodeMirror.setOption("theme", "colorforth");
        FuncSetThemeFromDB();
    };
    const FuncDarcula = () => {
        EditorCodeMirror.setOption("theme", "darcula");
        FuncSetThemeFromDB();
    };
    const FuncDracula = () => {
        EditorCodeMirror.setOption("theme", "dracula");
        FuncSetThemeFromDB();
    };
    const FuncDuotoneDark = () => {
        EditorCodeMirror.setOption("theme", "duotone-dark");
        FuncSetThemeFromDB();
    };
    const FuncDuotoneLight = () => {
        EditorCodeMirror.setOption("theme", "duotone-light");
        FuncSetThemeFromDB();
    };
    const FuncEclipse = () => {
        EditorCodeMirror.setOption("theme", "eclipse");
        FuncSetThemeFromDB();
    };
    const FuncElegant = () => {
        EditorCodeMirror.setOption("theme", "elegant");
        FuncSetThemeFromDB();
    };
    const FuncErlangDark = () => {
        EditorCodeMirror.setOption("theme", "erlang-dark");
        FuncSetThemeFromDB();
    };
    const FuncGruvboxDark = () => {
        EditorCodeMirror.setOption("theme", "gruvbox-dark");
        FuncSetThemeFromDB();
    };
    const FuncHopscotch = () => {
        EditorCodeMirror.setOption("theme", "hopscotch");
        FuncSetThemeFromDB();
    };
    const FuncIcecoder = () => {
        EditorCodeMirror.setOption("theme", "icecoder");
        FuncSetThemeFromDB();
    };
    const FuncIdea = () => {
        EditorCodeMirror.setOption("theme", "idea");
        FuncSetThemeFromDB();
    };
    const FuncIsotope = () => {
        EditorCodeMirror.setOption("theme", "isotope");
        FuncSetThemeFromDB();
    };
    const FuncLesserDark = () => {
        EditorCodeMirror.setOption("theme", "lesser-dark");
        FuncSetThemeFromDB();
    };
    const FuncLiquiByte = () => {
        EditorCodeMirror.setOption("theme", "liquibyte");
        FuncSetThemeFromDB();
    };
    const FuncLucario = () => {
        EditorCodeMirror.setOption("theme", "lucario");
        FuncSetThemeFromDB();
    };
    const FuncMaterial = () => {
        EditorCodeMirror.setOption("theme", "material");
        FuncSetThemeFromDB();
    };
    const FuncMaterialDarker = () => {
        EditorCodeMirror.setOption("theme", "material-darker");
        FuncSetThemeFromDB();
    };
    const FuncMaterialOcean = () => {
        EditorCodeMirror.setOption("theme", "material-ocean");
        FuncSetThemeFromDB();
    };
    const FuncMaterialPalenight = () => {
        EditorCodeMirror.setOption("theme", "material-palenight");
        FuncSetThemeFromDB();
    };
    const FuncMbo = () => {
        EditorCodeMirror.setOption("theme", "mbo");
        FuncSetThemeFromDB();
    };
    const FuncMdnLike = () => {
        EditorCodeMirror.setOption("theme", "mdn-like");
        FuncSetThemeFromDB();
    };
    const FuncMidnight = () => {
        EditorCodeMirror.setOption("theme", "midnight");
        FuncSetThemeFromDB();
    };
    const FuncMonokai = () => {
        EditorCodeMirror.setOption("theme", "monokai");
        FuncSetThemeFromDB();
    };
    const FuncMoxer = () => {
        EditorCodeMirror.setOption("theme", "moxer");
        FuncSetThemeFromDB();
    };
    const FuncNeat = () => {
        EditorCodeMirror.setOption("theme", "neat");
        FuncSetThemeFromDB();
    };
    const FuncNeo = () => {
        EditorCodeMirror.setOption("theme", "neo");
        FuncSetThemeFromDB();
    };
    const FuncNight = () => {
        EditorCodeMirror.setOption("theme", "night");
        FuncSetThemeFromDB();
    };
    const FuncNord = () => {
        EditorCodeMirror.setOption("theme", "nord");
        FuncSetThemeFromDB();
    };
    const FuncPandaSyntax = () => {
        EditorCodeMirror.setOption("theme", "panda-syntax");
        FuncSetThemeFromDB();
    };
    const FuncParaisoDark = () => {
        EditorCodeMirror.setOption("theme", "paraiso-dark");
        FuncSetThemeFromDB();
    };
    const FuncParaisoLight = () => {
        EditorCodeMirror.setOption("theme", "paraiso-light");
        FuncSetThemeFromDB();
    };
    const FuncPastelOnDark = () => {
        EditorCodeMirror.setOption("theme", "pastel-on-dark");
        FuncSetThemeFromDB();
    };
    const FuncRailscasts = () => {
        EditorCodeMirror.setOption("theme", "railscasts");
        FuncSetThemeFromDB();
    };
    const FuncRubyblue = () => {
        EditorCodeMirror.setOption("theme", "rubyblue");
        FuncSetThemeFromDB();
    };
    const FuncSeti = () => {
        EditorCodeMirror.setOption("theme", "seti");
        FuncSetThemeFromDB();
    };
    const FuncShadowFox = () => {
        EditorCodeMirror.setOption("theme", "shadowfox");
        FuncSetThemeFromDB();
    };
    const FuncSolarized = () => {
        EditorCodeMirror.setOption("theme", "solarized");
        FuncSetThemeFromDB();
    };
    const FuncSsms = () => {
        EditorCodeMirror.setOption("theme", "ssms");
        FuncSetThemeFromDB();
    };
    const FuncMatrix = () => {
        EditorCodeMirror.setOption("theme", "the-matrix");
        FuncSetThemeFromDB();
    };
    const FuncTomorrowNightBright = () => {
        EditorCodeMirror.setOption("theme", "tomorrow-night-bright");
        FuncSetThemeFromDB();
    };
    const FuncTomorrowNightEighties = () => {
        EditorCodeMirror.setOption("theme", "tomorrow-night-eighties");
        FuncSetThemeFromDB();
    };
    const FuncTtcn = () => {
        EditorCodeMirror.setOption("theme", "ttcn");
        FuncSetThemeFromDB();
    };
    const FuncTwilight = () => {
        EditorCodeMirror.setOption("theme", "twilight");
        FuncSetThemeFromDB();
    };
    const FuncVibrantInk = () => {
        EditorCodeMirror.setOption("theme", "vibrant-ink");
        FuncSetThemeFromDB();
    };
    const FuncXqDark = () => {
        EditorCodeMirror.setOption("theme", "xq-dark");
        FuncSetThemeFromDB();
    };
    const FuncXqLight = () => {
        EditorCodeMirror.setOption("theme", "xq-light");
        FuncSetThemeFromDB();
    };
    const FuncYeti = () => {
        EditorCodeMirror.setOption("theme", "yeti");
        FuncSetThemeFromDB();
    };
    const FuncYonce = () => {
        EditorCodeMirror.setOption("theme", "yonce");
        FuncSetThemeFromDB();
    };
    const FuncZenburn = () => {
        EditorCodeMirror.setOption("theme", "zenburn");
        FuncSetThemeFromDB();
    };
    ////////////////////////////////// End Functions Theme


    ////////////////////////////////// Start Functions Help
    const FuncAbout = () => {
        ElectronMenusRemote.dialog.showMessageBox(MainWindow, {
            title: "About",
            message: `Another : Amir Mohammad
Address Github : https://github.com/amirmohammad0000
Version : 1.0.0
Electron : v13.1.6
Chrome : v91.0.4472.124
NodeJs : v14.16.0
V8 : v9.1.269.36-electron.0`,
            type: "info",
            buttons: ["Ok", "copy"],
            icon: ___dirname + "\\assets\\Images\\icon.png",
        }).then((val) => {
            if (val.response === 1) {
                ElectronMenusRemote.clipboard.writeText(`Another : Amir Mohammad
Address Github : https://github.com/amirmohammad0000
Version : 1.0.0
Electron : v13.1.6
Chrome : v91.0.4472.124
NodeJs : v14.16.0
V8 : v9.1.269.36-electron.0`, "clipboard");
            }
        });
    };
    const FuncDonate = () => {
        ElectronMenusRemote.dialog.showMessageBox(MainWindow, {
            title: "Donate",
            message: `Hi, this is an open source program. If you are satisfied with this program, it is great.You can give us a small donation and pay us a little money.So that we can create other and better open source projects, and you have supported open source projects with this payment, and you have supported the openness of such projects.


Account Number Payeer : P1033138596
Bitcoin : 39EfFAs4KFUizf2v3gRLR9hDBVVLCkB6VK`,
            type: "info",
            buttons: ["Ok", "copy"],
            icon: ___dirname + "\\assets\\Images\\icon.png",
        }).then((val) => {
            if (val.response === 1) {
                ElectronMenusRemote.clipboard.writeText(`Hi, this is an open source program. If you are satisfied with this program, it is great.You can give us a small donation and pay us a little money.So that we can create other and better open source projects, and you have supported open source projects with this payment, and you have supported the openness of such projects.
Account Number Payeer : P1033138596
Bitcoin : 39EfFAs4KFUizf2v3gRLR9hDBVVLCkB6VK`, "clipboard");
            }
        });
    };
    ////////////////////////////////// End Functions Help
    ///////////////////////////////////////////////////////////// End Section Functions


    ///////////////////////////////////////////////////////////// Start Section Menu File
    let MenuFile = new ElectronMenusRemote.MenuItem({
        label: "File",
        submenu: [
            {
                label: "New",
                icon: ___dirname + "\\assets\\Icons\\New.png",
                accelerator: "CmdOrCtrl+N",
                click() {
                    FuncNewFile();
                },
            },
            {
                label: "Open Project",
                icon: ___dirname + "\\assets\\Icons\\OpenFolder.png",
                accelerator: "CmdOrCtrl+O",
                click() {
                    FuncOpenFolder();
                },
            },
            {
                label: "Open File",
                icon: ___dirname + "\\assets\\Icons\\OpenFile.png",
                accelerator: "CmdOrCtrl+shift+O",
                click() {
                    FuncOpenFile();
                },
            },
            {
                label: "Save",
                icon: ___dirname + "\\assets\\Icons\\Save.png",
                accelerator: "CmdOrCtrl+S",
                click() {
                    FuncSave();
                },
            },
            {
                label: "Save As...",
                icon: ___dirname + "\\assets\\Icons\\Save.png",
                accelerator: "CmdOrCtrl+shift+S",
                click() {
                    FuncSaveAs();
                },
            },
            {
                type: "separator",
            },
            {
                label: "Auto Save",
                icon: ___dirname + "\\assets\\Icons\\AutoSave.png",
                click() {
                    if (StateAutoSave === false) {
                        StateAutoSave = true;
                    } else if (StateAutoSave === true) {
                        StateAutoSave = false;
                    }
                },
            },
            {
                label: "Print...",
                icon: ___dirname + "\\assets\\Icons\\Print.png",
                accelerator: "CmdOrCtrl+P",
                click() {
                    FuncPrint();
                },
            },
            {
                type: "separator",
            },
            {
                role: "quit",
                icon: ___dirname + "\\assets\\Icons\\Quit.png",
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu File


    ///////////////////////////////////////////////////////////// Start Section Menu Edit
    let MenuEdit = new ElectronMenusRemote.MenuItem({
        label: "Edit",
        submenu: [
            {
                label: "Undo",
                icon: ___dirname + "\\assets\\Icons\\Undo.png",
                click() {
                    FuncUndo();
                },
                accelerator: "CmdOrCtrl+Z",
            },
            {
                label: "Redo",
                icon: ___dirname + "\\assets\\Icons\\Redo.png",
                click() {
                    FuncRedo();
                },
                accelerator: "CmdOrCtrl+shift+Z",
            },
            {
                type: "separator",
            },
            {
                role: "Cut",
                icon: ___dirname + "\\assets\\Icons\\Cut.png",
            },
            {
                role: "Copy",
                icon: ___dirname + "\\assets\\Icons\\Copy.png",
            },
            {
                role: "Paste",
                icon: ___dirname + "\\assets\\Icons\\Paste.png",
            },
            {
                role: "Delete",
                icon: ___dirname + "\\assets\\Icons\\Delete.png",
            },
            {
                label: "Duplicate",
                icon: ___dirname + "\\assets\\Icons\\Duplicate.png",
                accelerator: "CmdOrCtrl+shift+D",
                click() {
                    FuncDuplicate();
                },
            },
            {
                type: "separator",
            },
            {
                label: "Search With Google",
                icon: ___dirname + "\\assets\\Icons\\SearchWithGoogle.png",
                accelerator: "Alt+S",
                click() {
                    FuncSearchWithGoogle();
                },
            },
            {
                label: "Find",
                icon: ___dirname + "\\assets\\Icons\\Find.png",
                accelerator: "CmdOrCtrl+F",
                click() {
                    FuncFind();
                },
            },
            {
                label: "Find Next",
                icon: ___dirname + "\\assets\\Icons\\ArrowRightFind.png",
                accelerator: "CmdOrCtrl+G",
                click() {
                    FuncFindNext();
                },
            },
            {
                label: "Find Prev",
                icon: ___dirname + "\\assets\\Icons\\ArrowLeftFind.png",
                accelerator: "CmdOrCtrl+shift+G",
                click() {
                    FuncFindPrev();
                },
            },
            {
                label: "Replace",
                icon: ___dirname + "\\assets\\Icons\\Replace.png",
                accelerator: "CmdOrCtrl+Shift+F",
                click() {
                    FuncReplace();
                },
            },
            {
                label: "Replace All",
                icon: ___dirname + "\\assets\\Icons\\ReplaceAll.png",
                accelerator: "CmdOrCtrl+Shift+R",
                click() {
                    FuncReplaceAll();
                },
            },
            {
                type: "separator",
            },
            {
                label: "Select All",
                icon: ___dirname + "\\assets\\Icons\\SelectAll.png",
                click() {
                    FuncSelectAll();
                },
                accelerator: "CmdOrCtrl+A",
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Edit


    ///////////////////////////////////////////////////////////// Start Section Menu Templates
    let MenuTemplates = new ElectronMenusRemote.MenuItem({
        label: "Templates",
        submenu: [
            {
                label: "HTML",
                icon: ___dirname + "\\assets\\Icons\\Html.png",
                click() {
                    FuncHTML();
                },
            },
            {
                label: "CSS",
                icon: ___dirname + "\\assets\\Icons\\Css.png",
                click() {
                    FuncCss();
                },
            },
            {
                label: "Java Script",
                icon: ___dirname + "\\assets\\Icons\\JavaScript.png",
                click() {
                    FuncJavaScript();
                },
            },
            {
                label: "Sql",
                icon: ___dirname + "\\assets\\Icons\\sql.png",
                click() {
                    FuncSql();
                },
            },
            {
                label: "Sass",
                icon: ___dirname + "\\assets\\Icons\\Sass.png",
                click() {
                    FuncSass();
                },
            },
            {
                label: "Php",
                icon: ___dirname + "\\assets\\Icons\\Php.png",
                click() {
                    FuncPhp();
                },
            },
            {
                label: "Python",
                icon: ___dirname + "\\assets\\Icons\\Python.png",
                click() {
                    FuncPython();
                },
            },
            {
                label: "C++",
                icon: ___dirname + "\\assets\\Icons\\Cpp.png",
                click() {
                    FuncCpp();
                },
            },
            {
                label: "C#",
                icon: ___dirname + "\\assets\\Icons\\cs.png",
                click() {
                    FuncCSharp();
                },
            },
            {
                label: "Kivy",
                icon: ___dirname + "\\assets\\Icons\\kivy.png",
                click() {
                    FuncKivy();
                },
            },
            {
                label: "Java",
                icon: ___dirname + "\\assets\\Icons\\Java.png",
                click() {
                    FuncJava();
                },
            },
            {
                label: "Kotlin",
                icon: ___dirname + "\\assets\\Icons\\Kotlin.png",
                click() {
                    FuncKotlin();
                },
            },
            {
                label: "XML",
                icon: ___dirname + "\\assets\\Icons\\xml.png",
                click() {
                    FuncXml();
                },
            },
            {
                label: "Type Script",
                icon: ___dirname + "\\assets\\Icons\\TypeScript.png",
                click() {
                    FuncTypeScript();
                },
            },
            {
                label: "Go",
                icon: ___dirname + "\\assets\\Icons\\Go.png",
                click() {
                    FuncGo();
                },
            },
            {
                label: "Cython",
                icon: ___dirname + "\\assets\\Icons\\cython.png",
                click() {
                    FuncCython();
                },
            },
            {
                label: "D",
                icon: ___dirname + "\\assets\\Icons\\d.png",
                click() {
                    FuncD();
                },
            },
            {
                label: "Diff",
                icon: ___dirname + "\\assets\\Icons\\diff.png",
                click() {
                    FuncDiff();
                },
            },
            {
                label: "Live Script",
                icon: ___dirname + "\\assets\\Icons\\LiveScript.png",
                click() {
                    FuncLiveScript();
                },
            },
            {
                label: "Lua",
                icon: ___dirname + "\\assets\\Icons\\Lua.png",
                click() {
                    FuncLua();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Templates


    ///////////////////////////////////////////////////////////// Start Section Menu View
    let MenuView = new ElectronMenusRemote.MenuItem({
        label: "View",
        submenu: [
            {
                label: "Zoom",
                icon: ___dirname + "\\assets\\Icons\\Zoom.png",
                submenu: [
                    {
                        role: "zoomIn",
                        icon: ___dirname + "\\assets\\Icons\\ZoomIn.png",
                    },
                    {
                        role: "zoomOut",
                        icon: ___dirname + "\\assets\\Icons\\ZoomOut.png",
                    },
                    {
                        role: "resetZoom",
                        icon: ___dirname + "\\assets\\Icons\\ResetZoom.png",
                    },
                ],
            },
            {
                type: "checkbox",
                checked: true,
                label: "Status Bar",
                click() {
                    FuncStatusBar();
                    FuncSetPositionTerminal();
                },
            },
            {
                label: "Line Wrapping",
                icon: ___dirname + "\\assets\\Icons\\LineWrapping.png",
                click() {
                    FuncLineWrapping();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu View


    ///////////////////////////////////////////////////////////// Start Section Menu Code
    let MenuCode = new ElectronMenusRemote.MenuItem({
        label: "Code",
        submenu: [
            {
                label: "Format All Code",
                icon: ___dirname + "\\assets\\Icons\\FormatCode.png",
                click() {
                    autoFormatAllCode();
                },
                accelerator: "CmdOrCtrl+alt+L",
            },
            {
                label: "Comment",
                icon: ___dirname + "\\assets\\Icons\\Comment.png",
                click() {
                    FuncToggleComment();
                },
                accelerator: "CmdOrCtrl+/",
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Code


    ///////////////////////////////////////////////////////////// Start Section Menu Key Maps
    let MenuKeyMaps = new ElectronMenusRemote.MenuItem({
        label: "key Map",
        submenu: [
            {
                label: "Emacs",
                icon: ___dirname + "\\assets\\Icons\\Emacs.png",
                click() {
                    FuncEmacs();
                    FuncSetKeyMapFromDB();
                },
            },
            {
                label: "Sublime",
                icon: ___dirname + "\\assets\\Icons\\Sublime.png",
                click() {
                    FuncSublime();
                    FuncSetKeyMapFromDB();
                },
            },
            {
                label: "Vim",
                icon: ___dirname + "\\assets\\Icons\\Vim.png",
                click() {
                    FuncVim();
                    FuncSetKeyMapFromDB();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Key Maps


    ///////////////////////////////////////////////////////////// Start Section Menu Language
    let MenuLanguage = new ElectronMenusRemote.MenuItem({
        label: "Language App",
        submenu: [
            {
                label: "Language Chinese",
                icon: ___dirname + "\\assets\\Icons\\Chinese.png",
                click() {
                    FuncSetLanguageChinese();
                },
            },
            {
                label: "Language Spanish",
                icon: ___dirname + "\\assets\\Icons\\Spanish.png",
                click() {
                    FuncSetLanguageSpanish();
                },
            },
            {
                label: "Language English",
                icon: ___dirname + "\\assets\\Icons\\English.png",
                click() {
                    FuncSetLanguageEnglish();
                },
            },
            {
                label: "Language Hindi",
                icon: ___dirname + "\\assets\\Icons\\Hindi.png",
                click() {
                    FuncSetLanguageHindi();
                },
            },
            {
                label: "Language Persian",
                icon: ___dirname + "\\assets\\Icons\\Persian.png",
                click() {
                    FuncSetLanguagePersian();
                },
            },
            {
                label: "Language German",
                icon: ___dirname + "\\assets\\Icons\\German.png",
                click() {
                    FuncSetLanguageGerman();
                },
            },
            {
                label: "Language French",
                icon: ___dirname + "\\assets\\Icons\\French.png",
                click() {
                    FuncSetLanguageFrench();
                },
            },
            {
                label: "Language Portuguese",
                icon: ___dirname + "\\assets\\Icons\\Portuguese.png",
                click() {
                    FuncSetLanguagePortuguese();
                },
            },
            {
                label: "Language Russian",
                icon: ___dirname + "\\assets\\Icons\\Russian.png",
                click() {
                    FuncSetLanguageRussian();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Language


    ///////////////////////////////////////////////////////////// Start Section Menu Theme
    let MenuTheme = new ElectronMenusRemote.MenuItem({
        label: "Theme",
        submenu: [
            {
                label: "Day",
                click() {
                    FuncDay();
                },
            },
            {
                label: "Night",
                click() {
                    Func3024Night();
                },
            },
            {
                label: "Abbott",
                click() {
                    FuncAbbott();
                },
            },
            {
                label: "ABCDef",
                click() {
                    FuncABCDef();
                },
            },
            {
                label: "Ambiance",
                click() {
                    FuncAmbiance();
                },
            },
            {
                label: "Ambiance Mobile",
                click() {
                    FuncAmbianceMobile();
                },
            },
            {
                label: "Ayu Dark",
                click() {
                    FuncAyuDark();
                },
            },
            {
                label: "Ayu Mirage",
                click() {
                    FuncAyuMirage();
                },
            },
            {
                label: "Base Dark",
                click() {
                    FuncBaseDark();
                },
            },
            {
                label: "Base Light",
                click() {
                    FuncBaseLight();
                },
            },
            {
                label: "Bespin",
                click() {
                    FuncBespin();
                },
            },
            {
                label: "Black Board",
                click() {
                    FuncBlackBoard();
                },
            },
            {
                label: "Cobalt",
                click() {
                    FuncCobalt();
                },
            },
            {
                label: "Color Forth",
                click() {
                    FuncColorForth();
                },
            },
            {
                label: "Darcula",
                click() {
                    FuncDarcula();
                },
            },
            {
                label: "Dracula",
                click() {
                    FuncDracula();
                },
            },
            {
                label: "Duotone Dark",
                click() {
                    FuncDuotoneDark();
                },
            },
            {
                label: "Duotone Light",
                click() {
                    FuncDuotoneLight();
                },
            },
            {
                label: "Eclipse",
                click() {
                    FuncEclipse();
                },
            },
            {
                label: "Elegant",
                click() {
                    FuncElegant();
                },
            },
            {
                label: "Erlang Dark",
                click() {
                    FuncErlangDark();
                },
            },
            {
                label: "Gruvbox Dark",
                click() {
                    FuncGruvboxDark();
                },
            },
            {
                label: "Hopscotch",
                click() {
                    FuncHopscotch();
                },
            },
            {
                label: "Icecoder",
                click() {
                    FuncIcecoder();
                },
            },
            {
                label: "Idea",
                click() {
                    FuncIdea();
                },
            },
            {
                label: "Isotope",
                click() {
                    FuncIsotope();
                },
            },
            {
                label: "Lesser Dark",
                click() {
                    FuncLesserDark();
                },
            },
            {
                label: "Liqui Byte",
                click() {
                    FuncLiquiByte();
                },
            },
            {
                label: "Lucario",
                click() {
                    FuncLucario();
                },
            },
            {
                label: "Material",
                click() {
                    FuncMaterial();
                },
            },
            {
                label: "Material Darker",
                click() {
                    FuncMaterialDarker();
                },
            },
            {
                label: "Material Ocean",
                click() {
                    FuncMaterialOcean();
                },
            }, {
                label: "Material Palenight",
                click() {
                    FuncMaterialPalenight();
                },
            },
            {
                label: "Mbo",
                click() {
                    FuncMbo();
                },
            },
            {
                label: "Mdn Like",
                click() {
                    FuncMdnLike();
                },
            },
            {
                label: "Midnight",
                click() {
                    FuncMidnight();
                },
            },
            {
                label: "Monokai",
                click() {
                    FuncMonokai();
                },
            },
            {
                label: "Moxer",
                click() {
                    FuncMoxer();
                },
            },
            {
                label: "Neat",
                click() {
                    FuncNeat();
                },
            },
            {
                label: "Neo",
                click() {
                    FuncNeo();
                },
            },
            {
                label: "Night",
                click() {
                    FuncNight();
                },
            },
            {
                label: "Nord",
                click() {
                    FuncNord();
                },
            },
            {
                label: "Panda Syntax",
                click() {
                    FuncPandaSyntax();
                },
            },
            {
                label: "Paraiso Dark",
                click() {
                    FuncParaisoDark();
                },
            },
            {
                label: "Paraiso Light",
                click() {
                    FuncParaisoLight();
                },
            },
            {
                label: "Pastel On Dark",
                click() {
                    FuncPastelOnDark();
                },
            },
            {
                label: "Railscasts",
                click() {
                    FuncRailscasts();
                },
            },
            {
                label: "Rubyblue",
                click() {
                    FuncRubyblue();
                },
            },
            {
                label: "Seti",
                click() {
                    FuncSeti();
                },
            },
            {
                label: "Shadow Fox",
                click() {
                    FuncShadowFox();
                },
            },
            {
                label: "Solarized",
                click() {
                    FuncSolarized();
                },
            },
            {
                label: "Ssms",
                click() {
                    FuncSsms();
                },
            },
            {
                label: "Matrix",
                click() {
                    FuncMatrix();
                },
            },
            {
                label: "Tomorrow Night Bright",
                click() {
                    FuncTomorrowNightBright();
                },
            },
            {
                label: "Tomorrow Night Eighties",
                click() {
                    FuncTomorrowNightEighties();
                },
            },
            {
                label: "Ttcn",
                click() {
                    FuncTtcn();
                },
            },
            {
                label: "Twilight",
                click() {
                    FuncTwilight();
                },
            },
            {
                label: "Vibrant Ink",
                click() {
                    FuncVibrantInk();
                },
            },
            {
                label: "Xq Dark",
                click() {
                    FuncXqDark();
                },
            },
            {
                label: "Xq Light",
                click() {
                    FuncXqLight();
                },
            },
            {
                label: "Yeti",
                click() {
                    FuncYeti();
                },
            },
            {
                label: "Yonce",
                click() {
                    FuncYonce();
                },
            },
            {
                label: "Zenburn",
                click() {
                    FuncZenburn();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Theme


    ///////////////////////////////////////////////////////////// Start Section Menu Help
    let MenuHelp = new ElectronMenusRemote.MenuItem({
        label: "Help",
        submenu: [
            {
                label: "About",
                icon: ___dirname + "\\assets\\Icons\\EditorCode.png",
                click() {
                    FuncAbout();
                },
            },
            {
                label: "Donate",
                icon: ___dirname + "\\assets\\Icons\\Donate.png",
                click() {
                    FuncDonate();
                },
            },
            {
                role: "toggleDevTools",
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Help


    ///////////////////////////////////////////////////////////// Start Section Context Menus Window
    let ContextMenusWindow = ElectronMenusRemote.Menu.buildFromTemplate([
        {
            label: "Undo",
            icon: ___dirname + "\\assets\\Icons\\Undo.png",
            click() {
                FuncUndo();
            },
            accelerator: "CmdOrCtrl+Z",
        },
        {
            label: "Redo",
            icon: ___dirname + "\\assets\\Icons\\Redo.png",
            click() {
                FuncRedo();
            },
            accelerator: "CmdOrCtrl+Shift+Z",
        },
        {
            type: "separator",
        },
        {
            role: "Copy",
            icon: ___dirname + "\\assets\\Icons\\Copy.png",
        },
        {
            role: "Cut",
            icon: ___dirname + "\\assets\\Icons\\Cut.png",
        },
        {
            role: "Paste",
            icon: ___dirname + "\\assets\\Icons\\Paste.png",
        },
        {
            label: "Duplicate",
            icon: ___dirname + "\\assets\\Icons\\Duplicate.png",
            click() {
                FuncDuplicate();
            },
            accelerator: "CmdOrCtrl+Shift+D",
        },
        {
            label: "Select All",
            icon: ___dirname + "\\assets\\Icons\\SelectAll.png",
            click() {
                FuncSelectAll();
            },
            accelerator: "CmdOrCtrl+A",
        },
        {
            type: "separator",
        },
        {
            label: "Find",
            icon: ___dirname + "\\assets\\Icons\\Find.png",
            accelerator: "CmdOrCtrl+F",
            click() {
                FuncFind();
            },
        },
        {
            label: "Find Next",
            icon: ___dirname + "\\assets\\Icons\\ArrowRightFind.png",
            accelerator: "CmdOrCtrl+G",
            click() {
                FuncFindNext();
            },
        },
        {
            label: "Find Prev",
            icon: ___dirname + "\\assets\\Icons\\ArrowLeftFind.png",
            accelerator: "CmdOrCtrl+shift+G",
            click() {
                FuncFindPrev();
            },
        },
        {
            label: "Replace",
            icon: ___dirname + "\\assets\\Icons\\Replace.png",
            accelerator: "CmdOrCtrl+Shift+F",
            click() {
                FuncReplace();
            },
        },
        {
            label: "Replace All",
            icon: ___dirname + "\\assets\\Icons\\ReplaceAll.png",
            accelerator: "CmdOrCtrl+Shift+R",
            click() {
                FuncReplaceAll();
            },
        },
        {
            type: "separator",
        },
        {
            label: "Open File",
            icon: ___dirname + "\\assets\\Icons\\OpenFile.png",
            click() {
                FuncOpenFile();
            },
        },
        {
            label: "Open Folder",
            icon: ___dirname + "\\assets\\Icons\\OpenFolder.png",
            click() {
                FuncOpenFolder();
            },
        },
        {
            label: "Save",
            icon: ___dirname + "\\assets\\Icons\\Save.png",
            click() {
                FuncSave();
            },
        },
    ]);
    ///////////////////////////////////////////////////////////// End Section Context Menus Window


    ///////////////////////////////////////////////////////////// Start Section Context Menus Project
    let ContextMenusProject = ElectronMenusRemote.Menu.buildFromTemplate([
        {
            label: "New Template",
            icon: ___dirname + "\\assets\\Icons\\Template.png",
            submenu: [
                {
                    label: "HTML",
                    icon: ___dirname + "\\assets\\Icons\\Html.png",
                    click() {
                        FuncCreateTemplateHtml();
                    },
                },
                {
                    label: "Css",
                    icon: ___dirname + "\\assets\\Icons\\Css.png",
                    click() {
                        FuncCreateTemplateCss();
                    },
                },
                {
                    label: "Java Script",
                    icon: ___dirname + "\\assets\\Icons\\JavaScript.png",
                    click() {
                        FuncCreateTemplateJavaScript();
                    },
                },
                {
                    label: "Sql",
                    icon: ___dirname + "\\assets\\Icons\\sql.png",
                    click() {
                        FuncCreateTemplateSql();
                    },
                },
                {
                    label: "Sass",
                    icon: ___dirname + "\\assets\\Icons\\Sass.png",
                    click() {
                        FuncCreateTemplateSass();
                    },
                },
                {
                    label: "Php",
                    icon: ___dirname + "\\assets\\Icons\\Php.png",
                    click() {
                        FuncCreateTemplatePhp();
                    },
                },
                {
                    label: "Python",
                    icon: ___dirname + "\\assets\\Icons\\Python.png",
                    click() {
                        FuncCreateTemplatePython();
                    },
                },
                {
                    label: "C++",
                    icon: ___dirname + "\\assets\\Icons\\Cpp.png",
                    click() {
                        FuncCreateTemplateCpp();
                    },
                },
                {
                    label: "C#",
                    icon: ___dirname + "\\assets\\Icons\\cs.png",
                    click() {
                        FuncCreateTemplateCsharp();
                    },
                },
                {
                    label: "Kivy",
                    icon: ___dirname + "\\assets\\Icons\\kivy.png",
                    click() {
                        FuncCreateTemplateKivy();
                    },
                },
                {
                    label: "Java",
                    icon: ___dirname + "\\assets\\Icons\\Java.png",
                    click() {
                        FuncCreateTemplateJava();
                    },
                },
                {
                    label: "Kotlin",
                    icon: ___dirname + "\\assets\\Icons\\Kotlin.png",
                    click() {
                        FuncCreateTemplateKotlin();
                    },
                },
                {
                    label: "XML",
                    icon: ___dirname + "\\assets\\Icons\\xml.png",
                    click() {
                        FuncCreateTemplateXml();
                    },
                },
                {
                    label: "Type Script",
                    icon: ___dirname + "\\assets\\Icons\\TypeScript.png",
                    click() {
                        FuncCreateTemplateTypeScript();
                    },
                },
                {
                    label: "Go",
                    icon: ___dirname + "\\assets\\Icons\\Go.png",
                    click() {
                        FuncCreateTemplateGo();
                    },
                },
                {
                    label: "Cython",
                    icon: ___dirname + "\\assets\\Icons\\cython.png",
                    click() {
                        FuncCreateTemplateCython();
                    },
                },
                {
                    label: "D",
                    icon: ___dirname + "\\assets\\Icons\\d.png",
                    click() {
                        FuncCreateTemplateD();
                    },
                },
                {
                    label: "Diff",
                    icon: ___dirname + "\\assets\\Icons\\diff.png",
                    click() {
                        FuncCreateTemplateDiff();
                    },
                },
                {
                    label: "Live Script",
                    icon: ___dirname + "\\assets\\Icons\\LiveScript.png",
                    click() {
                        FuncCreateTemplateLiveScript();
                    },
                },
                {
                    label: "Lua",
                    icon: ___dirname + "\\assets\\Icons\\Lua.png",
                    click() {
                        FuncCreateTemplateLua();
                    },
                },
            ],
        }, {
            label: "New File",
            icon: ___dirname + "\\assets\\Icons\\NewFile.png",
            click() {
                FuncNewFileInProject();
            },
        },
        {
            label: "New Folder",
            icon: ___dirname + "\\assets\\Icons\\NewFolder.png",
            click() {
                FuncNewFolderInProject();
            },
        },
        {
            label: "Open File",
            icon: ___dirname + "\\assets\\Icons\\OpenFileInEditor.png",
            click() {
                FuncOpenFileInCodeEditor();
            },
        },
        {
            label: "Copy Path",
            icon: ___dirname + "\\assets\\Icons\\CopyPath.png",
            click() {
                FuncCopyPathFileFolder();
            },
        },
        {
            label: "Copy File Name",
            icon: ___dirname + "\\assets\\Icons\\CopyNameFile.png",
            click() {
                FuncCopyNameFileFolder();
            },
        },
        {
            label: "Refresh Explorer",
            icon: ___dirname + "\\assets\\Icons\\RefreshExplorer.png",
            click() {
                FuncRefreshFolder();
            },
        },
        {
            label: "Rename",
            icon: ___dirname + "\\assets\\Icons\\Rename.png",
            click() {
                FuncRenameItemFolder();
            },
        },
        {
            label: "Delete",
            icon: ___dirname + "\\assets\\Icons\\Delete.png",
            click() {
                FuncDeleteItemFolder();
            },
        },
        {
            label: "Reveal In File Explorer",
            icon: ___dirname + "\\assets\\Icons\\RevealInFileExplorer.png",
            click() {
                FuncRevealInFileExplorer();
            },
        },
    ]);
    ///////////////////////////////////////////////////////////// End Section Context Menus Project


    ///////////////////////////////////////////////////////////// Start Section Set Menus And Context Menu
    let Menus = ElectronMenusRemote.Menu.buildFromTemplate([MenuFile, MenuEdit, MenuTemplates, MenuView, MenuCode, MenuKeyMaps, MenuLanguage, MenuTheme, MenuHelp]);
    ElectronMenusRemote.Menu.setApplicationMenu(Menus);
    window.addEventListener("contextmenu", (event) => {
        ContextMenusWindow.popup({
            x: event.x,
            y: event.y,
            window: MainWindow,
        });
    });
    ///////////////////////////////////////////////////////////// End Section Set Menus And Context Menu
});