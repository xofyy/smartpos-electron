import { ipcMain, IpcMainInvokeEvent } from 'electron'

export const registerHandler = (
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any>
) => {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      return await handler(event, ...args)
    } catch (error: any) {
      console.error(`[IPC Error] Channel: ${channel}`, error)
      throw error
    }
  })
}
