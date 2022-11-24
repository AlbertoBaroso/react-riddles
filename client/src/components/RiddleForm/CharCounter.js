function CharCounter(props) {

    const limitClass = props.actual >= props.limit ? "text-danger" : "";
    const classes = `text-end mt-1 d-block ${limitClass}`;

    return (
        <label className={classes}>
          {props.actual} / {props.limit} Characters 
        </label>
    );
}

export default CharCounter;