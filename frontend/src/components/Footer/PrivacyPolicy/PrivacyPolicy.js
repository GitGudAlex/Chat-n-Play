import Title from "../../Home/Title/Title";
import Footer from "../Footer";


function PrivacyPolicy (){

    return(
        <div id='privacy-policy'>
            <header id='privacy-policy-header'>
                <Title text="Datenschutzerklärung" height="10vh" fontSize="4vw"/>
            </header>
            <div id = 'privacy-policy-hdm'>
                <p>Es werden langfristig keine personenbezogenen Daten abgespeichert. </p>
                <h2>Audio, Video und Textdateien: </h2>
                <p>Um die Video- und Chatfunktion während eines Spiels bereitzustellen, werden entsprechend der Dauer des Spiels die Daten vom Mikrofon und der Webcam Ihres Endgerät verarbeitet. Sie können das Mikrofon und/ oder die Kamera jederzeit selbst über die Buttons in der Sidebar (links) abschalten. Im Chat werden Ihre Eingaben verarbeitet und mit Ihrem selbst gewählten Namen angezeigt.</p>  
                <p>Da dieser Server von der HdM gehostet wird, entnehmen Sie bitte weiteres der <a href ='https://www.hdm-stuttgart.de/datenschutz'>Datenschutzerklärung der Hochschule der Medien</a>.</p>
            </div>
            <footer className = "footer">
                <Footer start='false'/>
            </footer>    
        </div>
    )
}

export default PrivacyPolicy;