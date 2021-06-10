function Member (props){

    return(
        <div id='member'>
            <p>{props.name}</p>
            <p>{props.role}</p>
            <img src={props.scr}></img>
        </div>
    )
}

export default Member;