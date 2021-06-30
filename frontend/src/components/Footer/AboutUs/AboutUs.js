import Header from '../../Home/Header/Header';
import Footer from '../Footer';
import Member from './Member/Member';

import './AboutUs.css'

import imageAboutUs from '../../../img/AboutUs.png'

function AboutUs (){

    return(
        <div id='aboutus'>
            <header id='aboutus-header'>
                <Header/>
            </header>
            <img src={imageAboutUs} className="title-image-footer"/>
            <div class="container">
                <div class="row align-items-start">
                    <div id = "aboutus-team" className = "aboutus-content">
                         <div class="col">
                            <h2 className="aboutus-headline">Unser Team</h2>
                            <Member name = 'Timothy Geiger' role = 'Developer/ Design'></Member>
                            <Member name = 'Alexander Kraus' role = 'Developer/ Design'></Member>
                            <Member name = 'Susanne Weiß' role = 'Developer/ Design'></Member>
                            <Member name = 'Kira Frankenfeld' role = 'UI/ UX Design'></Member>
                        </div>
                    </div>
                    <div id="aboutus-project" className = "aboutus-content">
                        <div class="col">
                            <h2 className="aboutus-headline">Unser Projekt</h2>
                            <p>Die virtuelle Spielesammlung "Chat N' Play" entstand im Rahmen unseres Softwareprojekts. </p>
                            <p>In den letzten Monaten war es besonders schwer, über weite Distanzen Freundschaften aufrecht zu erhalten. Deshalb kam uns die Idee, die Plattform "Chat N' Play" zu entwickeln. Egal ob ihr euch aufgrund der Coronapandemie nicht treffen könnt, eure Freunde*innen tausende Kilometer entfernt wohnen oder ihr einfach keine Lust habt, abends aus dem Haus zu gehen - mit "Chat N' Play" hat man trotzdem die Möglichkeit, zu quatschen und spielen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className = "footer" style={{position: "fixed", bottom: 0}}>
                <Footer/>
            </footer>    
        </div>
    )
}

export default AboutUs;