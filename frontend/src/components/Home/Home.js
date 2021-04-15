import './Home.css'

import Title from './Title/Title';
import Description from './Description/Description';
import GameCategoriesList from './GameCategoriesList/GameCategoriesList';


function Home() {
    return (
        <div className='p-0'>
            <header className="sticky-top">
                <Title />
            </header>
            <main>
                <div className='container-fluid'>
                    <div className='row justify-content-center'>
                        <div className="col">
                            <Description />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className="col p-0">
                            <GameCategoriesList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;