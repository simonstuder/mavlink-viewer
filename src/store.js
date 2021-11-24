import { configureStore } from '@reduxjs/toolkit'
import { mavlinkSystemSlice } from './MavlinkSystemSlice'

export default configureStore({
  reducer: {
      mavlink_systems: mavlinkSystemSlice.reducer
  },
})