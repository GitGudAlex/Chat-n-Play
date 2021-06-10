import Title from "../../Home/Title/Title";
import Footer from "../Footer";

function FAQ (){

    return(
        <div id='faq'>
            <header id='faq-header'>
                <Title text="FAQ" height="10vh" fontSize="4vw"/>
            </header>
            <div id = 'faq-questions'>
                <h2>Wie kann ich im Browser in den Vollbildmodus wechseln?</h2>
                <p>Über F11 kannnst du in den Browsern Chrome, Firefox und Microsoft Edge in den Vollbildmodus wechseln.</p>
                <h2>Wie kann ich mein Mikrofon in Chrome wechseln?</h2>
                <p>Wechsle in Chrome in die Browsereinstellungen (3 Punkte oben rechts). Unter "Datenschutz und Sicherheit" &lt;  "Website-Einstelllungen" &lt;  "Berechtigungen" &lt;  "Mikrofon" kannst du im Menü das Mikrofon wechseln. Anschließend muss der Browser neu gestartet werden.</p>
            </div>
            <div id='faq-email'>
                <p>Deine Frage wurde nicht beantwortet? Dann schreib uns einfach eine E-Mail an: chat-n-play@web.de</p>
            </div>
            <footer className = "footer">
                <Footer start='false'/>
            </footer>    
        </div>
    )
}

export default FAQ;