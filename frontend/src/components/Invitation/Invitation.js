import { useEffect } from 'react';
import { useHistory } from "react-router-dom";

function Invitation({ match }) {

    // Router Stuff
    const history = useHistory();

    /**
     * 1. RoomId von url bekommen
     * 2. Testen ob Raum exestiert
     * 3. Namen abfragen
     * 4. Raum joinen
     * 5. ZU Lobby redirecten
     */

    useEffect(() => {
        // versuchen Raum zu joinen
        let id = match.params.roomid;
        
        history.push({
            pathname: '/',
            state: { roomId: id }
          });

    }, [history, match]);

  return (
    <div>

    </div>
  );
}

export default Invitation;
