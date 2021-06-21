import Header from '../../Home/Header/Header';
import Footer from '../Footer';
import Member from './Member/Member';

import './AboutUs.css'


function AboutUs (){

    return(
        <div id='aboutus'>
            <header id='aboutus-header'>
                <Header/>
            </header>
            <h1 className="title-footer"> Über uns</h1>
            <div id = "aboutus-team" className = "aboutus-content">
                <h2>Unser Team</h2>
                <Member name = 'Timothy Geiger' role = 'Developer'></Member>
                <Member name = 'Alexander Kraus' role = 'Developer'></Member>
                <Member name = 'Susanne Weiß' role = 'Developer/ Design'></Member>
                <Member name = 'Kira Frankenfeld' role = 'UI/ UX Design'></Member>
            </div>
            <div id="aboutus-project" className = "aboutus-content">
                <h2>Unser Projekt</h2>
                <p> Die virtuelle Spielesammlung Chat n' Play entstand im Rahmen unseres Softwareprojekts. </p>
                <p style={{paddingBottom: "60px"}}>In den letzten Monaten war es besonders schwer über weite Distanzen Freundschaften aufrecht zu erhalten. Deshalb kam uns die Idee die Plattform Chat n' Play zu entwickeln. Egal ob Ihr euch aufgrund der Coronapandemie nicht treffen könnt, eure Freunde tausende Kilometer entfernt wohnen oder Ihr einfach keine Lust habt abends aus dem Haus zu gehen - mit Chat n' Play hat man trotzdem die Möglichkeit zu quatschen und spielen.
                </p>
            </div>
            <footer className = "footer" style={{position: "fixed", bottom: 0}}>
                <Footer start='flase'/>
            </footer>    
        </div>
    )
}

export default AboutUs;