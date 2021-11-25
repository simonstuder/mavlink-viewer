import './App.css'


import 'bootstrap/dist/css/bootstrap.min.css'
import "./styles.css"
import { useEffect } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateSystem } from './MavlinkSystemSlice'
import { serialize_helper } from './helper'
import MavMsgViz from './MavMsgViz'
import MavMsgInject from './MavMsgInject'
import { findConnectedUSB } from './Connections'
import MavlinkHandler from './MavlinkHandler'
import { common, minimal } from 'mavlink-mappings'
import OrientationViz from './OrientationViz'



findConnectedUSB()

const mavlinkHandler = MavlinkHandler.getInstance()



function App() {

  const dispatchStore = useDispatch()



  useEffect(() => {
    // register eventListener once
      const any_listener = mavlinkHandler.on("ANY", (tdata) => {
        const {sysid, compid, msgid, msgname, data, fields} = tdata
        const p = {}
        for (let k of fields) {
          p[k] = serialize_helper(data[k])
        }
        dispatchStore(updateSystem({
          sysid: sysid,
          compid: compid,
          msgid: msgid,
          msgname: msgname,
          data: p
        }))
      })

    return () => {
      // unregister eventListener once
      mavlinkHandler.removeListener("ANY", any_listener)
    };
  }, [dispatchStore]);

  return (
    <>
      <h1>MAVLINK Viewer</h1>
      <div><OrientationViz /></div>
      <div><MavMsgViz /></div>
      <div><MavMsgInject /></div>
    </>
  );
}

export default App;
