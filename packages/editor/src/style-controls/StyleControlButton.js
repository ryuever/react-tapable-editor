import React from 'react'

export default class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    const { active, label } = this.props

    let className = 'miuffy-styleButton';
    if (this.props.active) {
      className += ' miuffy-activeButton';
    }

    const labelMap = {
      'H1': 'fas fa-heading',
      'Blockquote': 'fas fa-quote-left',
      'UL': 'fas fa-list-ul',
      'OL': 'fas fa-list-ol',
      'Code Block': 'fas fa-code',
    }

    return (
      <button className={className} onMouseDown={this.onToggle}>
        <span className="label-text">
          {label}
          <i className={labelMap[label]}></i>
        </span>
      </button>
    );
  }
}
