export const hide = (elements) => {
    elements.forEach((element) => {
       element.classList.add("hidden");
       element.classList.remove("visible");
    });
}
 
export const show = (element) => {
    element.classList.add("visible");
    element.classList.remove("hidden");   
}