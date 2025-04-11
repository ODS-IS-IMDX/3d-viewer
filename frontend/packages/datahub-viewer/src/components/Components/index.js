// Copyright (c) 2025 NTT InfraNet
import { connect } from 'react-redux'
import { Components } from './Components'

export default connect(state => ({
  slots: state.components.slots
}))(Components)
