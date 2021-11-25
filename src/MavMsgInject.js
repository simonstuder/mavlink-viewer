
import { numberRanges } from './helper'
import MavlinkHandler from './MavlinkHandler'
import {common, minimal} from 'mavlink-mappings'

const MavMsgInject = (props) => {

    const mavlinkHandler = MavlinkHandler.getInstance()
    const reg = mavlinkHandler.REGISTRY


    const createInput = (field, msgid) => {
        const {type,length} = field
        const intRe = /^[u]?int\d+_t$/
        const stringRe = /^char\[\]$/
        let id = `${reg[msgid].MSG_NAME}-${field.name}-input`
        if (intRe.test(type)) {
            let ranges = numberRanges(type)
            return <input id={id} type="number" min={ranges.min} max={ranges.max} defaultValue={0} />
        } else if (stringRe.test(type)) {
            return (<input id={id} maxLength={field.length}/>)
        } else {
            return <input id={id} defaultValue={0} />
        }
    }
    
    return (
        <>
            <h1>MavMsgInject</h1>
            <div style={{height: `300px`,overflowY:"scroll"}}>
                <div>
                    {Object.keys(reg).map((k) => {
                        return (
                            <div key={k}>
                                <div onClick={(evk,ev) => {
                                    let col_el = document.getElementById(`${reg[k].MSG_NAME}-edit`)
                                    col_el.style.display= col_el.style.display==="none"?"flex":"none"
                                }}>
                                    {reg[k].MSG_NAME} ( #{k} )
                                </div>
                                <div id={`${reg[k].MSG_NAME}-edit`} style={{display: "none", marginLeft: "16px", flexDirection: "column"}}>
                                    <div>EDIT MSG</div>
                                    <div style={{marginLeft: "8px"}}>
                                        {reg[k].FIELDS.map((e) => {
                                            return (
                                                <div key={`${k}-${e.name}`}>{e.name} {createInput(e,k)} [{e.type }, {e.length}]</div>
                                            )
                                        })}
                                    </div>
                                    <span style={{backgroundColor:"#444", display:"inline"}}
                                        onClick={async () => {
                                            const msg = new reg[k]
                                            for (let f of reg[k].FIELDS) {
                                                let inf = document.getElementById(`${reg[k].MSG_NAME}-${f.name}-input`)
                                                msg[f.name] = inf.value
                                            }
                                            console.log(msg)
                                            mavlinkHandler.send(msg)
                                        }}>
                                            SEND MSG
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default MavMsgInject