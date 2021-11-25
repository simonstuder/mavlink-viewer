
import { MavLinkPacketSplitter, MavLinkPacketParser, send, MavLinkProtocolV1 } from 'node-mavlink'
import { minimal, common, ardupilotmega, uavionix, icarous } from 'node-mavlink'

const eventEmitter = require('events')

export class MavlinkHandler extends eventEmitter {

    constructor() {
        super()

        this.serialport = undefined

        this.mavpsplit = new MavLinkPacketSplitter()
        this.mavpparse = new MavLinkPacketParser()
        this.mavpsplit.pipe(this.mavpparse)

        this.REGISTRY = {
            ...minimal.REGISTRY,
            ...common.REGISTRY,
            ...ardupilotmega.REGISTRY,
            ...uavionix.REGISTRY,
            ...icarous.REGISTRY,
        }

        this.getMsgFromMSGID = (id) => {
            return this.REGISTRY[id]
        }

        this.mavpparse.on('data', (packet) => {
            const clazz = this.REGISTRY[packet.header.msgid]
            if (clazz) {
                const data = packet.protocol.data(packet.payload, clazz)
                const fields = clazz.FIELDS.map((e)=>e.name)
                const tdata = {sysid: packet.header.sysid, compid: packet.header.compid, msgid: packet.header.msgid, msgname: clazz.MSG_NAME, data: data, fields: fields}
                this.emit(packet.header.sysid+"||"+packet.header.compid+"||"+clazz.MSG_NAME, tdata)
                this.emit(packet.header.sysid+"||"+clazz.MSG_NAME, tdata)
                this.emit("ANY", tdata)
            }
        })
        
        if (!MavlinkHandler._instance) {
            MavlinkHandler._instance = this;
      }
      return MavlinkHandler._instance;
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new MavlinkHandler()
        }
        return this._instance
    }

    write(data) {
        this.mavpsplit.write(data)
    }

    async send(msg) {
        if (this.serialport===undefined) {
            console.log("serialport is undefined")
        } else {
            await send(this.serialport, msg, new MavLinkProtocolV1())
        }
    }

}

export default MavlinkHandler
