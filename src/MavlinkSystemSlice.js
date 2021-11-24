import { createSlice } from '@reduxjs/toolkit'

export const mavlinkSystemSlice = createSlice({
  name: 'mavlink_systems',
  initialState: {},
  reducers: {
    updateSystem: (state, action) => {
      const {sysid, compid, msgid, msgname, data} = action.payload
      const msg_desc = `${msgname} ( #${msgid} )`
      if (!(sysid in state)) {
        state[sysid]= {}
      }
      if (!(compid in state[sysid])) {
        state[sysid][compid] = {}
      }
      if (!(msgid in state[sysid][compid])) {
        state[sysid][compid][msg_desc] = {}
      }
      state[sysid][compid][msg_desc] = data
      state[sysid][msg_desc] = data
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateSystem } = mavlinkSystemSlice.actions

export default mavlinkSystemSlice.reducer
