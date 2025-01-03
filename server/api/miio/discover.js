import * as miio from 'miio'
import fs from 'fs'
import {serverStore} from "~/server/store.ts";

import YeelightColor from 'miio/lib/devices/yeelight.color'
import YeelightMono from "miio/lib/devices/yeelight.mono.js";
miio.models['yeelink.light.bslamp2'] = YeelightColor
miio.models['yeelink.light.lamp4'] = YeelightMono

export default defineEventHandler(async (event) => {
    async function getDevices(event) {
        const devices = [];
        const devicesList = []
        try {

            // Load file devices.json
            const data = fs.readFileSync('./server/devices.json', 'utf8');
            const devicesListFromJson = JSON.parse(data);
            for (const deviceItem of devicesListFromJson.devices) {
                if (deviceItem.ip === undefined) {
                    const d = {
                        id: deviceItem.model,
                        model: deviceItem.model,
                    }
                    devices.push(d)
                    continue
                }

                console.log("Connecting to " + deviceItem.ip)
                await miio.device({address: deviceItem.ip, token: deviceItem.token})
                    .then(async device => {
                        devicesList.push(device)
                        const name = devicesListFromJson.names.find(n => n.id === device.id)

                        const d = {
                            id: device.id,
                            name: name === undefined ? deviceItem.name : name.name,
                            model: device.miioModel,
                            capabilities: [...device.metadata.capabilities],
                            types: [...device.metadata.types],
                            values: await getDeviceValues(device),
                            childs: []
                        }

                        if (device.children !== undefined) {
                            for (const child of device.children()) {
                                const childName = devicesListFromJson.names.find(n => n.id === child.id)

                                if (child.miioModel === undefined) {
                                    const t = [...child.metadata.types]
                                    t.splice(t.indexOf('miio:subdevice'), 1)
                                    child.miioModel = t[0]
                                }
                                const ch = {
                                    id: child.id,
                                    name: childName === undefined ? device.id : childName.name,
                                    model: child.miioModel,
                                    capabilities: [...child.metadata.capabilities],
                                    types: [...child.metadata.types],
                                    values: await getDeviceValues(child)
                                }
                                devices.push(ch)
                            }
                        }
                        devices.push(d)
                    })
                    .catch(err => console.error(err));
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du statut du hub:', error);
        }
        serverStore.data.devices = devicesList;
        return devices
    }

    async function getDeviceValues(device) {
        const values = []
        if (device.matches('state')) {
            values.push({
                name: 'state',
                value: (await device.state())
            })
        }

        if (device.matches('cap:illuminance')) {
            values.push({
                name: 'illuminance',
                value: (await device.illuminance()).value,
                unit: 'lux'
            })
        }

        if (device.matches('cap:light')) {
            console.log('aaaa')
            values.push({
                name: 'light',
                value: (await device.light()).value,
                unit: 'lux'
            })
        }

        if (device.matches('cap:temperature')) {
            values.push({
                name: 'temperature',
                value: (await device.temperature()).value,
                unit: '°C'
            })
        }

        if (device.matches('cap:relative-humidity')) {
            values.push({
                name: 'relative-humidity',
                value: await device.relativeHumidity(),
                unit: '%'
            })
        }

        if (device.matches('cap:atmospheric-pressure')) {
            values.push({
                name: 'atmospheric-pressure',
                value: (await device.atmosphericPressure).value,
                unit: (await device.atmosphericPressure).unit
            })
        }

        if (device.matches('cap:battery-level')) {
            values.push({
                name: 'battery-level',
                value: (await device.batteryLevel()),
                unit: '%'
            })
        }

        if (device.matches('cap:colorable')) {
            values.push({
                name: 'color',
                value: (await device.color()).hex,
                unit: 'hex'
            })
        }

        if (device.matches('cap:dimmable')) {
            values.push({
                name: 'dimmable',
                value: (await device.brightness()),
                unit: '%'
            })
        }

        if (device.matches('cap:switchable-power') || device.matches('cap:power')) {
            values.push({
                name: 'switchable-power',
                value: (await device.power())
            })
        }

        return values
    }

    return await getDevices(event)
})