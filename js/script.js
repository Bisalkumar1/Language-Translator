
const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchangeIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i"),
translateBtn = document.querySelector("button");

selectTag.forEach((tag, id) =>{
    for (let country_code in countries) {
        // selected english default as from language and hindi as to language
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); // adding option tag inside select tag
    }
}); 

exchangeIcon.addEventListener("click",()=>{
    // exchanging text and select tag value 
let temp=fromText.value,
templang=selectTag[0].value;
fromText.value=toText.value;
selectTag[0].value=selectTag[1].value;
toText.value=temp;
selectTag[1].value=templang;



});
fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value, // getting fromSelect tag Value
    translateTo = selectTag[1].value;   // getting toSelect tag value
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;   
    //5000-chars/day limit
    // fetching api response and returning it with parsing into js obj
    // and in another then method receiving that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        // console.log(data);
        toText.value = data.responseData.translatedText;

     
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        // console.log(target);   // which type of button is clicking
        if(!fromText.value || !toText.value) return;

        if(target.classList.contains("fa-copy")) {  //if clicked icon has copy button 
            // if clicked icon has from id, copy the fromTextarea value else copy the ToTextarea value
            if(target.id == "from") {   
                navigator.clipboard.writeText(fromText.value); // copy from from text
            } else {
                navigator.clipboard.writeText(toText.value);  // copy from totext
            }
             }
             else{
                let utterance;
 // if clicked icon has from id, speak the fromTextarea value else speak the ToTextarea value

                if(target.id=="from"){
 utterance = new SpeechSynthesisUtterance(fromText.value);
 utterance.lang=selectTag[0].value;          //setting utterance language to fromSelect tag value
                }
                else{
                    utterance=new SpeechSynthesisUtterance(toText.value);
                    utterance.lang=selectTag[1].value;   //setting utterance language to toSelect tag value
                }
                speechSynthesis.speak(utterance); // speak the passed utterance
             }
        
    });

});