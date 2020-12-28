var journal = [];
var defaultTemplate = "What happened yesterday?\n- \n\nToday I want to \n\nI am grateful for ";
var currentTemplate;
var oldTemplate;
var today = new Date();
var yesterday = new Date(new Date().setDate(today.getDate()-1));

var todayEntry;
var yesterdayEntry;

var isTodaySelected = true;

init();

//add current drafts to localstorage
function update(){
    if(isTodaySelected){
        updateEntry(today, document.getElementById("today").value);
    }else {
        updateEntry(yesterday, document.getElementById("yesterday").value);
    }   
}

// ui - show yesterday entry
function showYesterday(){
    isTodaySelected = false;
    if(!yesterdayEntry){
        yesterdayEntry = {
            "date" : yesterday.toDateString(),
            "text" : currentTemplate
        };
    } else if(yesterdayEntry.text == oldTemplate){
        yesterdayEntry.text = currentTemplate;
    }
    document.getElementById("yesterday").value = yesterdayEntry.text;
    document.getElementById("date").innerText = yesterday.toDateString();
}

// ui - show today entry
function showToday(){
    isTodaySelected = true;
    if(!todayEntry){
        todayEntry = {
            "date" : today.toDateString(),
            "text" : currentTemplate
        };
    } else if(todayEntry.text == oldTemplate){
        todayEntry.text = currentTemplate;
    }
    document.getElementById("today").value = todayEntry.text;
    document.getElementById("date").innerText = today.toDateString();
}

// ui - show older entries (uneditable)
function showOlder(){
    document.getElementById("older").innerHTML = "";
    journal.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    journal.forEach(entry => {
        if(true || entry.date != today.toDateString() && entry.date != yesterday.toDateString()){
            document.getElementById("older").innerHTML+="<span>" + entry.date+"</span><p>"+entry.text+"</p>";
        }
    });
}

window.addEventListener("hashchange", function(){
    loadScreen(window.location.hash);
});

function saveJSON() {
    var content = {
        journal : JSON.parse(localStorage.getItem("journal")),
        template : localStorage.getItem("template")
    };
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = "journal.json";
    a.click();
}

//click actual upload input
document.getElementById("uploadButton").addEventListener("click", function () {
    document.getElementById("default-file").click();
});

//when file input changes
document.getElementById("default-file").addEventListener("change", function () {
    if (document.getElementById("default-file").value) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", function () {
            // convert image to base64 encoded string
            importFromJSON(JSON.parse(this.result));
            
        });
        fileReader.readAsText(document.getElementById("default-file").files[0]);
    }
});

function importFromJSON(jsonImport){
    console.log(jsonImport);
    localStorage.setItem("journal", JSON.stringify(jsonImport.journal));
    localStorage.setItem("template", jsonImport.template);
    console.log(localStorage);
    init();
    loadScreen("#menu");
}

function loadScreen (hash){
    if(hash == "#menu"){
        document.getElementById("menu").style.display = 'flex';
        document.getElementById("today").style.display = 'none';
        document.getElementById("yesterday").style.display = 'none';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("topbar").style.display = 'none';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#settings"){
        showSettings();
        document.getElementById("menu").style.display = 'none';
        document.getElementById("today").style.display = 'none';
        document.getElementById("yesterday").style.display = 'none';
        document.getElementById("settings").style.display = 'block';
        document.getElementById("topbar").style.display = 'none';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#journal-today"){
        showToday();
        document.getElementById("menu").style.display = 'none';
        document.getElementById("today").style.display = 'block';
        document.getElementById("yesterday").style.display = 'none';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("topbar").style.display = 'flex';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#journal-yesterday"){
        showYesterday();
        document.getElementById("menu").style.display = 'none';
        document.getElementById("today").style.display = 'none';
        document.getElementById("yesterday").style.display = 'block';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("topbar").style.display = 'flex';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#older"){
        showOlder();
        document.getElementById("menu").style.display = 'none';
        document.getElementById("today").style.display = 'none';
        document.getElementById("yesterday").style.display = 'none';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("topbar").style.display = 'none';
        document.getElementById("older").style.display = 'block';
    }
}

function showSettings(){
    document.getElementById("templateField").value = currentTemplate;
}

function saveSettings(){
    oldTemplate = currentTemplate;
    currentTemplate = document.getElementById("templateField").value;
    localStorage.setItem("template", currentTemplate);
}

// ui - ignore changes and go to menu
function back(){
    init();
}

// ui - save changes and go to menu
function save(){
    update();
}

function updateEntry(date, text){
    var entry = {
        "date" : date.toDateString(),
        "text" : text
    }
    addToStorage(entry);
}

// add single entry to storage
function addToStorage(entry){
    if(journal.filter(function(e) { return e.date === entry.date; }).length < 1){
        journal.push(entry);
    }else{
        journal.filter(function(e) { return e.date === entry.date; })[0].text = entry.text;
    }
    localStorage.setItem("journal",JSON.stringify(journal));
}

// load from localstorage or initialize if doesn't exist
function init(){
    // load journal and set today and yesterday if they exist
    if(localStorage.getItem("journal")){
        journal = JSON.parse(localStorage.getItem("journal"));
        journal.forEach(entry => {
            if(entry.date == today.toDateString()){
                todayEntry = entry;
                
            } else if(entry.date == yesterday.toDateString()){
                yesterdayEntry = entry;
                
            }
        });
    }
    // load template
    if(localStorage.getItem("template")){
        currentTemplate = localStorage.getItem("template");
    } else {
        currentTemplate = defaultTemplate;
        localStorage.setItem("template", defaultTemplate);
    }

    if(journal.length > 2){
        document.getElementById("older-button").style.display = "block";
    }

    loadScreen(window.location.hash);
}