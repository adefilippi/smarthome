import * as miio from 'miio'
import {serverStore} from "~/server/store.ts";

export default defineEventHandler(async (event) => {
    function getDevice(id) {
        const devices = serverStore.data.devices

        let device = null
        devices.forEach(d => {
            if (d.id === id) {
                device = d
            }

            for (const child of d.children()) {
                if (child.id === id) {
                    device = child
                }
            }
        })
        return device
    }


    try {
        const body = await readBody(event)
        let device = getDevice(body.id)

        if (device === null) {
            return {
                status: 404,
                message: 'Device not found'
            }
        }

        if (body.call === 'power') {
            device.setPower(body.value)
        }
        if (body.call === 'brightness') {
            device.setBrightness(body.value)
        }
        if (body.call === 'color') {
            device.setColor(body.value)
        }
    } catch (e) {
        return {
            status: 404,
            message: e.message
        }
    }
});