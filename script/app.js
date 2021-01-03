var currentEntryDate;

// load from localstorage or initialize if doesn't exist
function init(){

    // set up localstorage
    if(!localStorage.getItem("journal"))
        localStorage.setItem("journal", JSON.stringify([]));

    // set up template if doesn't exist
    if(!localStorage.getItem("template"))
        localStorage.setItem("template", "What happened yesterday?\n- \n\nToday I want to \n\nI am grateful for ");
    
    // enable older if more than 2 entries
    if(JSON.parse(localStorage.getItem("journal")).length > 2){
        document.getElementById("older-button").style.display = "block";
    }

    // hopefully not a direct link to anything other than the menu, but load the page they ask for anyway
    loadScreen(window.location.hash);
}

// show ui to add/edit an entry
function showEntry(day){
    var today = new Date();
    if(day == "tomorrow"){
        currentEntryDate = new Date(new Date().setDate(today.getDate()+1));
    } else if(day == "today"){
        currentEntryDate = new Date();
    } else if(day == "yesterday"){
        currentEntryDate = new Date(new Date().setDate(today.getDate()-1));
    }

    //set date
    document.getElementById("date").innerText = currentEntryDate.toDateString();

    // check if entry exists
    var match = JSON.parse(localStorage.getItem("journal")).filter(function(e) { return e.date === currentEntryDate.toDateString(); })
    if(match.length > 0){

        // use previously save version
        document.getElementById("entry").value = match[0].text;
    } else{

        // use template
        document.getElementById("entry").value = localStorage.getItem("template");
    }
}

// save changes and go to menu
function saveEntry(){
    var entry = {
        "date" : currentEntryDate.toDateString(),
        "text" : document.getElementById("entry").value
    };

    var journal = JSON.parse(localStorage.getItem("journal"));
    
    if(entry.text == localStorage.getItem("template") || entry.text == ""){
        // don't save and actually delete stored entry if it exists
        journal = journal.filter(function(e) { return e.date != entry.date; })
    } else if (journal.filter(function(e) { return e.date === entry.date; }).length < 1){
        journal.push(entry);
    } else {
        journal.filter(function(e) { return e.date === entry.date; })[0].text = entry.text;
    }
    localStorage.setItem("journal", JSON.stringify(journal));
}

// show older entries (uneditable)
function showOlder(){
    document.getElementById("older").innerHTML = "";

    var journal = JSON.parse(localStorage.getItem("journal"));
    journal.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    journal.forEach(entry => {
        if(true || entry.date != today.toDateString() && entry.date != yesterday.toDateString()){
            document.getElementById("older").innerHTML+="<span>" + entry.date+"</span><p>"+entry.text+"</p>";
        }
    });
}

// populate settings page
function showSettings(){
    document.getElementById("templateField").value = localStorage.getItem("template");
}

function saveSettings(){
    localStorage.setItem("template", document.getElementById("templateField").value);
}

// export json backup
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

// import from json backup
function importFromJSON(jsonImport){
    localStorage.setItem("journal", JSON.stringify(jsonImport.journal));
    localStorage.setItem("template", jsonImport.template);
    init();
}

// store theme preference
function setTheme(style){
    localStorage.setItem("theme", style);
    if(localStorage.getItem("theme") == 'dark'){
        document.querySelector("html").className = "dark";
    } else {
        document.querySelector("html").className = "light";
    }
}

// lol my shitty page router
function loadScreen(hash){
    if(hash == "#menu" || hash == "#" || hash == ""){
        document.getElementById("menu").style.display = 'flex';
        document.getElementById("entryPage").style.display = 'none';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#settings"){
        showSettings();
        document.getElementById("menu").style.display = 'none';
        document.getElementById("entryPage").style.display = 'none';
        document.getElementById("settings").style.display = 'block';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#journal-today"){
        showEntry("today");
        document.getElementById("menu").style.display = 'none';
        document.getElementById("entryPage").style.display = 'block';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#journal-yesterday"){
        showEntry("yesterday");
        document.getElementById("menu").style.display = 'none';
        document.getElementById("entryPage").style.display = 'block';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("older").style.display = 'none';
    } else if(hash == "#older"){
        showOlder();
        document.getElementById("menu").style.display = 'none';
        document.getElementById("entryPage").style.display = 'none';
        document.getElementById("settings").style.display = 'none';
        document.getElementById("older").style.display = 'block';
    }
}

window.addEventListener("hashchange", function(){
    loadScreen(window.location.hash);
});

// click to trigger upload
document.getElementById("uploadButton").addEventListener("click", function () {
    document.getElementById("default-file").click();
});

// upload json file
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

init();