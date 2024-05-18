class ToDo {
    constructor(name, date, hour, urgent) {
        this.name = name;

        this.date = date;
        this.hour = hour;
        this.urgent = urgent;
    }

    getName() {
        return this.name;
    }

    changeName(newName) {
        this.name = newName;
    }

    getDate() {
        return this.date;
    }

    getDay() {
        const [year, month, day] = String(this.date).split("-");
        return day;
    }

    getMonth() {
        const  [year, month, day] = String(this.date).split("-");
        return month;
    }

    getYear() {
        const  [year, month, day] = String(this.date).split("-");
        return year;
    }

    changeDate(day, month, year) {
        this.date = `${day}-${month}-${year}`;
    }

    getHour() {
        return this.hour;
    }

    getUrgent() {
        return this.urgent;
    }

    changeUrgent() {
        this.urgent = !this.urgent;
    }
}

class ToDoDate extends ToDo {
    constructor(name,  date, hour, urgent, place) {
        super(name, date, hour, urgent);
        this.place = place;
    }
}

function guardarColor() {
    localStorage.setItem('color', JSON.stringify(color));
}

function guardarToDo() {
    localStorage.setItem('to_do', JSON.stringify(noleido));
}

document.addEventListener("DOMContentLoaded", () => {

    // Remove loading screen
    setTimeout(() => {
        document.querySelector(".window").style.display = "none";
        document.querySelectorAll(".square").forEach(w => w.style.display = "none");
        document.querySelector(".loader").style.display = "none";
    }, 500);


    //   

    
    // Color palette functionality
    const paletaNeutra = document.querySelector(".default");
    const paletaFem = document.querySelector(".femenino");
    const paletaMasc = document.querySelector(".masculino");
    const root = document.documentElement;

    function setColorPalette(color) {
        for (let i = 0; i < 6; i++) {
            root.style.setProperty(`--usando${i}`, getComputedStyle(root).getPropertyValue(`--paleta-${color}${i}`));
        }
        localStorage.setItem('color', color); // Update local storage
    }

    // Load color from localStorage
    let color = localStorage.getItem('color') || "n"; // Default color
    setColorPalette(color);

    // Load active view from localStorage
    let active="Weekly";
    const divActive = document.querySelector(".active");
    if (localStorage.getItem("vista")) {
        active = localStorage.getItem("vista");
        divActive.innerText = active;
    }
    // Load tasks from localStorage
    let tasks = [];
    if (localStorage.getItem("tasks")) {
        const t = JSON.parse(localStorage.getItem("tasks")).map(todo => new ToDo(todo.name,  todo.date, todo.hour, todo.urgent));;
        t.forEach(task => tasks.push(task));
    }

//----------------Actualizacion de los rangos------------------
var date = new Date();
function actualizarCeldas() {
    let count;
    let grid = document.querySelector(".grid");
    let titulo = document.querySelector(".titulo");
    
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    if (active === "Daily") {
        count = 1;
        grid.style.gridTemplateColumns = "1fr";
        grid.style.fontSize = "2rem";
        titulo.innerText = `${date.toLocaleString('en-us', { month: 'long' })} ${date.getDate()}`;
        const tasksForDay = tasks.filter(todo => {
            const taskDate = new Date(todo.date); // Assuming todo.date is a date string or Date object
            return taskDate.getDate() === date.getDate() - 1&&
                   taskDate.getMonth() === date.getMonth() &&
                   taskDate.getFullYear() === date.getFullYear();
        });
        const taskOrdered = tasksForDay.sort((a,b)=>(a.urgent === b.urgent)? 0 : a? -1 : 1);
        const taskDetails = taskOrdered.map(task => `${task.getName()} at ${task.getHour()}`).join(', ');
        grid.innerHTML = `<div>
            <div class="ref">${days[date.getDay()]}</div>
            <div class="info">${taskDetails}</div>
        </div>`;

    } else if (active === "Weekly") {
        count = 7;
        let startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay());
        let endDate = addDays(startDate, 6);
        titulo.innerText = `${startDate.toLocaleString('en-us', { month: 'long' })} ${startDate.getDate()} to ${endDate.toLocaleString('en-us', { month: 'long' })} ${endDate.getDate()}`;
        grid.innerHTML = ""; // Clear previous content

        for (let i = 1; i <= count; i++) {
            let currentDay = addDays(startDate, i);
            const tasksForDay = tasks.filter(todo => {
                const taskDate = new Date(todo.date);
                return taskDate.getDate() === currentDay.getDate() - 1&&
                       taskDate.getMonth() === currentDay.getMonth() &&
                       taskDate.getFullYear() === currentDay.getFullYear();
            });
            const taskOrdered = tasksForDay.sort((a,b)=>(a.urgent === b.urgent)? 0 : a? -1 : 1);
            const taskDetails = taskOrdered.map(task => `${task.getName()} at ${task.getHour()}`).join(', ');
            grid.innerHTML += `<div>
                <div class="ref">${days[currentDay.getDay()]}</div>
                <div class="info">${taskDetails}</div>
            </div>`;
        }

    } else {
        count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Number of days in the month
        grid.style.minHeight = "600px";
        grid.style.gridTemplateColumns = "repeat(7, minmax(100px, 1fr))";
        titulo.style.fontSize = "4rem";
        titulo.innerText = `${date.toLocaleString('en-us', { month: 'long' })}`;
        grid.innerHTML = ""; // Clear previous content

//Agregar los espacios del inicio para que quede en orden


        var countStart = new Date(date.getFullYear(), date.getMonth(), 1).getDay()-1;
        
        for (let i = 0; i <countStart;i++){
            grid.innerHTML += `<div>
            <div class="ref"></div>
            <div class="info"></div>
        </div>`;
        }

//Agregar las celdad con su respectivo valor
        for (let i = 0; i < count; i++) {
            let currentDay = addDays(new Date(date.getFullYear(), date.getMonth(), 1), i); // Correct day calculation for the month
            const tasksForDay = tasks.filter(todo => {
                const taskDate = new Date(todo.date);
                return taskDate.getDate() === currentDay.getDate() - 1 &&
                       taskDate.getMonth() === currentDay.getMonth() &&
                       taskDate.getFullYear() === currentDay.getFullYear();
            });
            const taskOrdered = tasksForDay.sort((a,b)=>(a.urgent === b.urgent)? 0 : a? -1 : 1);
            const taskDetails = taskOrdered.map(task => `${task.getName()} at ${task.getHour()}`).join(', ');
            grid.innerHTML += `<div>
                <div class="ref">${days[currentDay.getDay()]} ${i + 1}</div>
                <div class="info">${taskDetails}</div>
            </div>`;
        }
        for (let i = 0; i< 7-((count+countStart)%7);i++){
            if (7-((count+countStart)%7)===7) break;
            grid.innerHTML += `<div>
            <div class="ref"></div>
            <div class="info"></div>
        </div>`;
        }
    }
    }
    function adelante(numeroDias){
        if (numeroDias===1) date = new Date(date.getFullYear(),date.getMonth(), date.getDate()+1);
        else if (numeroDias===7) date = new Date(date.getFullYear(),date.getMonth(), date.getDate()+7);
        else if (numeroDias === 30) date = new Date(date.getFullYear(),date.getMonth()+1, date.getDate());
    }
    function atras(numeroDias){
        if (numeroDias===1) date = new Date(date.getFullYear(),date.getMonth(), date.getDate()-1);
        else if (numeroDias===7) date = new Date(date.getFullYear(),date.getMonth(), date.getDate()-7);
        else if (numeroDias === 30) date = new Date(date.getFullYear(),date.getMonth()-1, date.getDate());
    }

    document.querySelector("#left").addEventListener("click",()=>{
        if (active==="Daily") atras(1);
        else if (active==="Weekly") atras(7);
        else if (active==="Monthly") atras(30);
        actualizarCeldas();
    });

    document.querySelector("#right").addEventListener("click",()=>{
        if (active==="Daily") adelante(1);
        else if (active==="Weekly") adelante(7);
        else if (active==="Monthly") adelante(30);
        actualizarCeldas();
    });
    actualizarCeldas();
    /*date
: 
"2024-05-16"
description
: 
"a"
hour
: 
"18:00"
name
: 
"a"
urgent
: 
true*/
    // Form submission handling
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get("name");
        const date = data.get("date");
        const hour = data.get("time");
        const urgent = data.get("urgent") === "on";

        tasks.push(new ToDo(name,  date, hour, urgent));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        location.reload();
    });
    

    // Event listeners for palette buttons
    paletaNeutra.addEventListener("click", () => setColorPalette("n"));
    paletaFem.addEventListener("click", () => setColorPalette("fem"));
    paletaMasc.addEventListener("click", () => setColorPalette("masc"));

    // Add button functionality
    document.querySelector(".agregar").addEventListener("click", () => {
        const div = document.querySelector(".div");
        div.style.display = "flex";
        div.style.animationName = "abrir";
        div.style.animationPlayState = "running";
        setTimeout(() => {
            div.style.height = "auto";
        }, 300);
    });

    // Close button functionality
    document.querySelector(".cerrar").addEventListener("click", () => {
        const div = document.querySelector(".div");
        div.style.transition = ".3s ease-in-out";
        div.style.height = "0px";
        setTimeout(() => {
            div.style.display = "none";
        }, 300);
    });

    // View selection functionality
    const show = document.querySelectorAll(".show");
    const vista = document.querySelector(".vista");

    function loadVista() {
        localStorage.setItem("vista", active);
    }

    function abrirDisplay() {
        divActive.style.display = "none";
        show.forEach(a => a.style.display = "flex");
        show.forEach(sh => sh.addEventListener("click", () => {
            active = sh.innerText;
            divActive.style.display = "flex";
            divActive.innerText = active;
            show.forEach(s => s.style.display = "none");
            loadVista();
            location.reload();
        }));
        vista.removeEventListener("click", abrirDisplay);
    }

    vista.addEventListener("click", abrirDisplay);

});