
import MavlinkHandler from './MavlinkHandler'

const SerialPort = require('chrome-apps-serialport').SerialPort
const mavlinkHandler = new MavlinkHandler()

var connectedUSB = []
export const findConnectedUSB = () => {
  SerialPort.list().then(ports => {
    connectedUSB = ports.filter((e) => e.manufacturer!==undefined)


    

    if (connectedUSB.length>0) {
      mavlinkHandler.serialport = new SerialPort(connectedUSB[0].path, {
        baudRate: 57600
      })
      mavlinkHandler.serialport.on('open', async () => {
        //console.log("port open")
        // the port is open - we're ready to send data
        //const msg = new common.StatusText()
        //msg.text = "statustext test"
        //await send(mavlinkHandler.serialport, msg, new MavLinkProtocolV1())
    })
      console.log("connecting to", connectedUSB[0].path)

      mavlinkHandler.serialport.on('data', function (data) {
        mavlinkHandler.write(data)
      })

    } else {
      console.log("no usb connection found")
    }
  })
}
