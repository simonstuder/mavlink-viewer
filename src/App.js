import './App.css'

import MavlinkHandler from './MavlinkHandler'
import OrientationViz from './OrientationViz'

import 'bootstrap/dist/css/bootstrap.min.css'
import "./styles.css"
import { useEffect } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateSystem } from './MavlinkSystemSlice'
import { serialize_helper } from './helper'
import MavMsgViz from './MavMsgViz'
import MavMsgInject from './MavMsgInject'


const SerialPort = require('chrome-apps-serialport').SerialPort
const mavlinkHandler = new MavlinkHandler()
var sport


var connectedUSB = []
function findConnectedUSB() {
  SerialPort.list().then(ports => {
    connectedUSB = ports.filter((e) => e.manufacturer!==undefined)

    if (connectedUSB.length>0) {
      sport = new SerialPort(connectedUSB[0].path, {
        baudRate: 57600
      })
      console.log("connecting to",connectedUSB[0].path)

      sport.on('data', function (data) {
        mavlinkHandler.write(data)
      })

    } else {
      console.log("no usb connection found")
    }
  })
}
findConnectedUSB()




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
          /*
          sysid: `vehicle-${sysid}`,
          compid: `component-${compid}`,
          */
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
