// Copyright (c) 2025 NTT InfraNet
import React from 'react'

export class LanguageSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      language: props.i18n.language
    }
    props.i18n.on('languageChanged', this.onLanguageChanged)
  }

  componentWillUnmount () {
    this.props.i18n.off('languageChanged', this.onLanguageChanged)
  }

  onLanguageChanged = language => {
    this.setState({
      language
    })
  }

  onChange = event => {
    this.props.i18n.changeLanguage(event.target.value)
  }

  render () {
    return (
      <select value={this.state.language} onChange={this.onChange}>
        {this.props.languages.map((language, index) => (
          <option value={language} key={index}>
            {language}
          </option>
        ))}
      </select>
    )
  }
}

LanguageSelect.defaultProps = {
  languages: ['en', 'pt', 'jp', 'ar', 'cimode']
}
