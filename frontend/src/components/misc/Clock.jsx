import React, { Component } from 'react';

/**
 * Demonstrates: Component, State, Lifecycle, Binding, Handling Events
 */
class Clock extends Component {
  constructor(props) {
    super(props);
    // Khởi tạo State
    this.state = {
      date: new Date(),
      isHovered: false
    };

    // Binding ngữ cảnh 'this' cho hàm xử lý sự kiện
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  // Lifecycle Methods
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // Custom Method thay đổi State
  tick() {
    this.setState({
      date: new Date()
    });
  }

  // Event Handlers
  handleMouseEnter(e) {
    // Handling Events
    e.preventDefault();
    this.setState({ isHovered: true });
  }

  handleMouseLeave(e) {
    e.preventDefault();
    this.setState({ isHovered: false });
  }

  // Render Method
  render() {
    // Lấy Props nếu có (Destructuring Props)
    const { prefixLabel = "Time: " } = this.props;

    return (
      <div 
        onMouseEnter={this.handleMouseEnter} 
        onMouseLeave={this.handleMouseLeave}
        className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-colors ${this.state.isHovered ? 'bg-primary text-on_primary' : 'bg-surface_container text-on_surface_variant'}`}
      >
        <span>{prefixLabel}</span>
        <time suppressHydrationWarning>
          {this.state.date.toLocaleTimeString()}
        </time>
      </div>
    );
  }
}

export default Clock;
