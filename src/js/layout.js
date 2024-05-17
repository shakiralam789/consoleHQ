let ipadView = window.matchMedia("(max-width: 1024px)");

let sidebar = document.getElementById("sidebar");
let mainSection = document.getElementById("main-section");
let overlay = document.getElementById('overlay')
let allToggleBtn = document.querySelectorAll('.collapse-sidebar-button')

window.addEventListener('click',(e)=>{
    if(e.target.closest('.collapse-sidebar-button')){
        let collapseSidebarButton = e.target.closest('.collapse-sidebar-button')
        if(!ipadView.matches){
            sidebar?.classList.toggle("collapse-sidebar");
        
            if (sidebar?.classList.contains("collapse-sidebar")) {
              sidebar?.classList.remove("h-screen");
              mainSection?.classList.remove("h-screen");
              collapseSidebarButton?.classList.add("rotate-180");
            } else {
              sidebar.classList.add("h-screen");
              mainSection.classList.add("h-screen");
              collapseSidebarButton?.classList.remove("rotate-180");
            }
          }else{
                sidebar?.classList.add("h-screen");
                mainSection?.classList.add("h-screen");
                sidebar?.classList.toggle("mobile-collapse");

              if(sidebar?.classList.contains("mobile-collapse")){
                    collapseSidebarButton?.classList.remove('active')
                    overlay.classList.remove('active')
                }else{
                    collapseSidebarButton?.classList.add('active')
                    overlay.classList.add('active')
              }
          }
    }else{
        if(!e.target.closest('#sidebar') && ipadView.matches){
            overlay.classList.remove('active')
            allToggleBtn[0]?.classList.remove('active')
            sidebar?.classList.add("mobile-collapse");
        }
    }
})

window.addEventListener("load", () => {
  menuResponse();
});

window.addEventListener("resize", () => {
  menuResponse();
});

function menuResponse() {
  if (ipadView.matches) {
        sidebar?.classList.add("mobile-collapse","absolute");
        sidebar?.classList.remove("relative","collapse-sidebar");
    }else{
        sidebar?.classList.remove("mobile-collapse","absolute");
        sidebar?.classList.add("relative");
    }
    
    overlay.classList.remove('active')
}