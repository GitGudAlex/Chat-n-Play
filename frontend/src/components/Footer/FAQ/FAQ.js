import { useState, useCallback, useEffect, useContext } from 'react';
import $ from 'jquery';

import Header from "../../Home/Header/Header";
import Footer from "../Footer";

import '../Footer.css'

function FAQ (){

    const [isCollapsed, setIsCollapsed] = useState(false);

    const setCollapse = () => {
        setIsCollapsed((state) => !state);
    }

    useEffect(() => {
        if(isCollapsed) {
            $('#button-question1').css({ transform: 'rotateZ(90deg)' });
        } else {
            $('#button-question1').css({ transform: 'rotateZ(0deg)' });
        }

    }, [isCollapsed]);


    return(
        <div id='faq'>
            <header id='faq-header' className="sticky-top">
                <Header/>
            </header>
            <h1 className="title-footer">FAQ</h1>
            <div id = 'faq-questions'>
                <div className="d-flex align-items-center justify-content-center">
                    <button type="button" className ="button-faq" id="button-question1" data-toggle="collapse" data-target="#answer1" aria-expanded="false" aria-controls="collapseExample" onClick={ setCollapse }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                    <h2>Wie kann ich im Browser in den Vollbildmodus wechseln?</h2>
                </div>
                <p className="answer collapse" id="answer1" >Über F11 kannnst du in den Browsern Chrome, Firefox und Microsoft Edge in den Vollbildmodus wechseln.</p>
               
                <div className="d-flex align-items-center justify-content-center">
                    <button type="button" className ="button-faq" id="button-question2" data-toggle="collapse" data-target="#answer2" aria-expanded="false" aria-controls="collapseExample">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <h2>Wie kann ich mein Mikrofon in Chrome wechseln?</h2>
                </div>
                <p className="answer collapse" id="answer2">Wechsle in Chrome in die Browsereinstellungen (3 Punkte oben rechts). Unter "Datenschutz und Sicherheit" &lt;  "Website-Einstelllungen" &lt;  "Berechtigungen" &lt;  "Mikrofon" kannst du im Menü das Mikrofon wechseln. Anschließend muss der Browser neu gestartet werden.</p>
                
                <div className="d-flex align-items-center justify-content-center">
                    <button type="button" className ="button-faq" data-toggle="collapse" data-target="#answer3" aria-expanded="false" aria-controls="collapseExample">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <h2>Zu wievielt kann ein Spiel gespielt werden?</h2>
                </div>
                <p className="answer collapse" id="answer3">Jedes Spiel kann von mindestents zwei Spielern und maximal vier Spielern gespielt werden.</p>
            
                <div className="d-flex align-items-center justify-content-center">
                    <button type="button" className ="button-faq" data-toggle="collapse" data-target="#answer4" aria-expanded="false" aria-controls="collapseExample" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <h2>Wie kann ich einen Raum erstellen?</h2>
                </div>
                <p className="answer collapse" id="answer4">Auf der Startseite gibt es mehrere Kategorien von Spielen zur Auswahl. Darunter werden die Spiele in den jeweiligen kategorien aufgelistet. Klicke auf den Button "Raum erstellen" der hinter jedem Spiel ist, danach wirst du nach deinem Spielernamen gefragt und du kannst den Raum starten.</p>

                <div className="d-flex align-items-center justify-content-center">
                    <button type="button" className ="button-faq" data-toggle="collapse" data-target="#answer5" aria-expanded="false" aria-controls="collapseExample" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <h2>Wie kann ich einem Raum beitreten?</h2>
                </div>
                <p className="answer collapse" id="answer5">Zuerst muss ein Freund von dir einen Raum erstellt haben. Danach gibt es zwei Möglichkeiten, wenn dein Freund dir den Code zukommen lässt, besuche unsere Seite unter "https://chat-n-play.vm.mi.hdm-stuttgart.de" und gebe dort den Code und deinen Spielernamen unter "Raum beitreten" ein. Wenn dein Freund dir den Link schickt, kannst du einfach dem Link folgen und deinen Spielernamen eingeben. Zuletzt musst du noch auf "Raum beitreten" klicken.</p>

            </div>
            <div id='faq-email'>
                <p id="paragraph-faq">Deine Frage wurde nicht beantwortet? Dann schreib uns einfach eine E-Mail an: chat-n-play@web.de</p>
            </div>
            <footer className = "footer" style={{position: "fixed", bottom: 0}}>
                <Footer start='false'/>
            </footer>   
        </div>
    )
}

export default FAQ;