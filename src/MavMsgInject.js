
import MavlinkHandler from './MavlinkHandler'

const MavMsgInject = (props) => {

    const mavlinkHandler = new MavlinkHandler()
    const reg = mavlinkHandler.REGISTRY

    
    return (
        <>
            <h1>MavMsgInject</h1>
            <div height={`300px`} style={{overflowY:"scroll"}}>
                <div>
                    {Object.keys(reg).map((k) => {
                        return (
                            <>
                                <div key={k} onClick={(evk,ev) => {
                                    let col_el = document.getElementById(`${reg[k].MSG_NAME}-edit`)
                                    col_el.style.display= col_el.style.display==="none"?"flex":"none"
                                }}>
                                    {reg[k].MSG_NAME} ( #{k} )
                                </div>
                                <div id={`${reg[k].MSG_NAME}-edit`} style={{display: "none", marginLeft: "16px", flexDirection: "column"}}>
                                    <div>MSG EDIT</div>
                                    <div>
                                        {reg[k].FIELDS.map((e) => {
                                            return (
                                                <div key={`${k}-${e.name}`}>{e.name} [{e.type }]</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default MavMsgInject