import React, {Component} from 'react';
import styles from './MessageForm.css';
import uuid from 'uuid';
import moment from 'moment';

console.log('id:', uuid.v4());
console.log('Data:', moment().format('MMM DD | HH:mm'));

class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    const message = {
      from: this.props.name,
      text: this.state.text,
      id: uuid.v4(), 
      date: moment().format('MMM DD | HH:mm')     
    };
    this.props.onMessageSubmit(message);
    this.setState({ text: '' });
  }

  changeHandler(event) {
    this.setState({ text : event.target.value });
  }

  render() {
    return(
      <form className={styles.MessageForm} onSubmit={e => this.handleSubmit(e)}>
        <input
          className={styles.MessageInput}
          onChange={event => this.changeHandler(event)}
          value={this.state.text}
          placeholder='Message'
        />
      </form>
    );
  }
}

export default MessageForm;