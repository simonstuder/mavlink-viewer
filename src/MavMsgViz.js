
import { useSelector } from "react-redux"


const MavMsgViz = () => {

    const SState  = useSelector((state) => state.mavlink_systems)

    const expandableList = (el, pa) => {
        return Object.keys(el).map((e) => (
            <div style={{marginLeft: "16px"}} key={`${pa}${e}`}>
                {(typeof el[e]) == 'object' ?
                    <>
                        <div>
                            <span
                                style={{backgroundColor: "#444", padding: "3px"}}
                                onClick={(ev) => {
                                    let col_el = document.getElementById(`col_${pa}${e}`)
                                    col_el.style.display= col_el.style.display==="none"?"flex":"none"
                                }}>
                                {e}
                            </span>
                        </div>
                        <div id={`col_${pa}${e}`} style={{display: "none", flexDirection:"column", gap: "4px"}}>
                            {expandableList(el[e], `${pa}${e}_`)}
                        </div>
                    </>
                    :
                    `${e}\t${el[e]}`
                }
            </div>
        ))
    }

    return (
        <>
            <h1>MavMsgViz</h1>
            <h5>Systems/Components</h5>
            <div style={{display:"flex", flexDirection: "column", gap:"4px"}}>
                {(typeof SState=='object') ? expandableList(SState, ``):<div>none</div>}
            </div>
        </>
    )
}

export default MavMsgViz
