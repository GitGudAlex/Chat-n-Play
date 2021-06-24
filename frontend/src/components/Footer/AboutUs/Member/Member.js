function Member (props){

    return(
        <div id='member'>
            <p id="member-name">{props.name}</p>
            <p>{props.role}</p>
            <img src={props.scr}></img>
        </div>
    )
}

export default Member;