let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textAreaCont = document.querySelector(".textarea-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let lockELem = document.querySelector(".ticket-lock");
let toolBoxColors = document.querySelectorAll(".color")



let colors = ["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = colors[colors.length-1];

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketArr = [];

if(localStorage.getItem("jira_tickets")){
    //Retrieve and display tickets

    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    // localStorage.clear("jira_tickets")
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID)
    })
}

for(let i = 0; i<toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click",function(e){
        let currentToolBoxColor = toolBoxColors[i].classList[0];
            
        let filteredTickets = ticketArr.filter((ticketObj , idx)=>{
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        // remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i = 0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
       

        // Display new filter tickets

        filteredTickets.forEach((ticketObj , idx)=>{
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })

    toolBoxColors[i].addEventListener("dblclick",(e)=>{
              // remove previous tickets
              let allTicketsCont = document.querySelectorAll(".ticket-cont");
              for(let i = 0;i<allTicketsCont.length;i++){
                  allTicketsCont[i].remove();
              }

              ticketArr.forEach((ticketObj  , idx)=>{
                  createTicket(ticketObj.ticketColor, ticketObj.ticketTask,ticketObj.ticketID)
              })

               
        

    })
     

}




addBtn.addEventListener("click",(e)=>{
    //Display Modal
    //Generate ticket

    //AddFlag --> True --> Modal Display
    //AddFlag --> False --> Modal None

    addFlag = !addFlag;
    if(addFlag){
        modalCont.style.display = "flex";
    }
    else{
        modalCont.style.display = "none"
    }
})

removeBtn.addEventListener("click",(e)=>{
    removeFlag = !removeFlag;

})

modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key === "Enter"){
        createTicket(modalPriorityColor, textAreaCont.value);
        addFlag = false;
        setModalToDefault();
    }
})


//Listener for modal priority Color 
allPriorityColor.forEach((colorElem , idx)=>{
    colorElem.addEventListener("click",(e)=>{
        allPriorityColor.forEach((prColorElem, idx)=>{
            prColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0]
    })
})




function createTicket(ticketColor , ticketTask , ticketID){
    let id = ticketID ||  shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `
    
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">Ticket ID --> ${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
</div>


    `
    mainCont.appendChild(ticketCont);


    //create object of ticket and add to array

    if(!ticketID){

        ticketArr.push({ticketColor , ticketTask , ticketID :id});
        //Local Storage
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    }

    



    handleRemoval(ticketCont , id);
    handleLock(ticketCont , id);
    handleColor(ticketCont , id);
    

}

function handleRemoval(ticket , id){
    //removeFlag --> true --> remove
ticket.addEventListener("click",(e)=>{
    
    if(!removeFlag)return;

    let idx = getTicketIdx(id);

    //DB removal

    ticketArr.splice(idx , 1);
    let strTicketArr = JSON.stringify(ticketArr);
    localStorage.setItem("jira_tickets", strTicketArr);

    ticket.remove(); // UI removal

})
}
function handleLock(ticket , id){
    let ticketElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketElem.children[0];

    let ticketTaskArea = document.querySelector(".task-area");
    ticketLock.addEventListener("click",function(e){
        let ticketIdx = getTicketIdx(id);
            if(ticketLock.classList.contains(lockClass)){
                ticketLock.classList.remove(lockClass);       
                ticketLock.classList.add(unlockClass);   
                ticketTaskArea.setAttribute("contenteditable","true")    
            }
            else{
                ticketLock.classList.remove(unlockClass);       
                ticketLock.classList.add(lockClass);  
                ticketTaskArea.setAttribute("contenteditable","false")      
            }

            //Modify Data in local Storage (Ticket Task)

            ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
            localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));

    })
}

function handleColor(ticket , id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        //get ticketidx from the tckt arry
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx = colors.findIndex((color)=>{
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor  = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //Modify Data in Local Storage(priorty clr change)

        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr))

    })

   
}

function getTicketIdx (id){
    let ticketIdx = ticketArr.findIndex((ticketsObj)=>{
        return ticketsObj.ticketID === id;
    })
    return ticketIdx;
}

function setModalToDefault(){
    modalCont.style.display = "none";
    textAreaCont.value = " ";
    modalPriorityColor = colors[colors.length-1];
    allPriorityColor.forEach((priorityclrElem , idx)=>{
        priorityclrElem.classList.remove("border");

    })
    allPriorityColor[allPriorityColor.length-1].classList.add("border");
}



