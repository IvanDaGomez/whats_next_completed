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
    constructor(place) {
        super();
        this.place = place;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector(".window").style.display = "none";
        document.querySelectorAll(".square").forEach(w => w.style.display = "none");
        document.querySelector(".loader").style.display = "none";
    }, 500);

    const paletaNeutra = document.querySelector(".default");
    const paletaFem = document.querySelector(".femenino");
    const paletaMasc = document.querySelector(".masculino");
    const root = document.documentElement;

    function setColorPalette(color) {
        for (let i = 0; i < 6; i++) {
            root.style.setProperty(`--usando${i}`, getComputedStyle(root).getPropertyValue(`--paleta-${color}${i}`));
        }
        localStorage.setItem('color', color);
    }

    let color;
    if (localStorage.getItem('color')) {
        color = localStorage.getItem('color');
        setColorPalette(color);
    } else {
        color = "n";
    }

    paletaNeutra.addEventListener("click", () => {
        setColorPalette("n");
    });

    paletaFem.addEventListener("click", () => {
        setColorPalette("fem");
    });

    paletaMasc.addEventListener("click", () => {
        setColorPalette("masc");
    });

    let tasks = [];
    let done = 0;
    let urgente = 0;
    if (localStorage.getItem("tasks")) {
        let t = JSON.parse(localStorage.getItem("tasks")).map(todo => new ToDo(
            todo.name, todo.date, todo.hour, todo.urgent
        ));
        t.forEach(task => tasks.push(task));
    }

    if (localStorage.getItem("done")) {
        done = parseInt(localStorage.getItem("done"));
    }
    if (localStorage.getItem("urgent")) {
        urgente = parseInt(localStorage.getItem("urgent"));
    }

    function actualizar() {
        if (tasks.length === 0) {
            document.querySelector(".appointments p").innerText = "You don't have any tasks";
        }
        let orderedTasks = tasks.sort((a, b) => {
            let [aYear, aMonth, aDay] = a.getDate().split("-");
            let [bYear, bMonth, bDay] = b.getDate().split("-");

            if (aDay !== bDay) {
                return aDay - bDay;
            }
            if (aMonth !== bMonth) {
                return aMonth - bMonth;
            }
            return aYear - bYear;
        });

        const months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];

        let today = document.querySelector(".today");
        today.innerHTML = "";
        orderedTasks.forEach(task => {
            today.innerHTML += `
                <label class="cl-checkbox" data-id="${task.name}">
                    <input type="checkbox">
                    <span> ${months[parseInt(task.getMonth()) - 1]} ${parseInt(task.getDay())}: ${task.getName()}</span>
                </label>`;
        });

        let urgent = document.querySelector(".urgent");
        let urgentTasks = tasks.filter(task => task.urgent);

        urgent.innerHTML = "<h2>Some of your <i>urgent</i> tasks:</h2>";
        if (urgentTasks.length === 0) {
            urgent.innerHTML += "You don't have any urgent tasks";
        }
        urgentTasks.forEach(task => {
            urgent.innerHTML += `
                <label class="cl-checkbox" data-id="${task.name}">
                    <input type="checkbox">
                    <span> ${months[parseInt(task.getMonth()) - 1]} ${parseInt(task.getDay())}: ${task.getName()}</span>
                </label>`;
        });

        document.querySelector("#done").innerText = done;
        document.querySelector("#urgent").innerText = urgente;
        
        addCheckboxListeners();

        //---------------------------------------------------Grafico------------------------------------------------
        const ctx = document.getElementById('stats');

        let date = new Date()
        new Chart(ctx, {
        type: 'line',
    
    
        data: {
            labels : [
                date.toLocaleString('en-us', { month: 'long' }),
                new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()).toLocaleString('en-us', { month: 'long' }),
                new Date(date.getFullYear(), date.getMonth() + 2, date.getDate()).toLocaleString('en-us', { month: 'long' }),
                new Date(date.getFullYear(), date.getMonth() + 3, date.getDate()).toLocaleString('en-us', { month: 'long' }),
                new Date(date.getFullYear(), date.getMonth() + 4, date.getDate()).toLocaleString('en-us', { month: 'long' })
                
            ],
          datasets: [{
            label: '# of tasks', 
    
            data: [tasks.filter((a)=> parseInt(a.getMonth())===date.getMonth()+1).length,
                tasks.filter((a)=> parseInt(a.getMonth())===date.getMonth()+2).length,
                tasks.filter((a)=> parseInt(a.getMonth())===date.getMonth()+3).length,
                tasks.filter((a)=> parseInt(a.getMonth())===date.getMonth()+4).length,
                tasks.filter((a)=> parseInt(a.getMonth())===date.getMonth()+5).length],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Background color for the filled area
            borderColor: getComputedStyle(root).getPropertyValue("--usando0"),   
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
    
      });
      
    }

    function addCheckboxListeners() {
        let checkboxes = document.querySelectorAll('.cl-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("click", (event) => {
                let parentLabel = event.target.closest('label');
                let taskId = parentLabel.getAttribute("data-id");
                let task = tasks.find(t => t.name === taskId);

                let index = tasks.indexOf(task);
                if (index !== -1) {
                    tasks.splice(index, 1);
                    done += 1;

                    if (task.urgent) {
                        urgente += 1;
                    }

                    parentLabel.remove();
                    localStorage.setItem("urgent", urgente);
                    localStorage.setItem("done", done);
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    actualizar();
                }
            });
        });
    }

    actualizar();


    //-------------------------------------------GRAFICO----------------------------------------------------------




});