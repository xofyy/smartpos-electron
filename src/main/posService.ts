import { SerialPort } from 'serialport'

let port: SerialPort | null = null

export function initSerialPort(path: string, baudRate: number = 9600) {
  if (port && port.isOpen) {
    port.close()
  }

  try {
    port = new SerialPort({ path, baudRate })
    
    port.on('open', () => {
      console.log('Serial Port Opened:', path)
    })

    port.on('error', (err) => {
      console.error('Serial Port Error:', err.message)
    })
  } catch (error) {
    console.error('Failed to initialize SerialPort:', error)
  }
}

export function sendToPos(data: string | Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!port || !port.isOpen) {
      console.warn('Serial Port not open, simulating send:', data)
      // For development without hardware, we resolve anyway
      resolve()
      return
    }

    port.write(data, (err) => {
      if (err) {
        console.error('Error writing to SerialPort:', err.message)
        reject(err)
      } else {
        console.log('Data sent to POS:', data)
        resolve()
      }
    })
  })
}

export async function listPorts() {
  return await SerialPort.list()
}
