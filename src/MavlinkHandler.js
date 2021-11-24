
import { MavLinkPacketSplitter, MavLinkPacketParser } from 'node-mavlink'
import { minimal, common, ardupilotmega, uavionix, icarous } from 'node-mavlink'

const eventEmitter = require('events');


class MavlinkHandler extends eventEmitter {

    constructor() {
        super()
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
        
    }

    write(data) {
        this.mavpsplit.write(data)
    }


}

export default MavlinkHandler
