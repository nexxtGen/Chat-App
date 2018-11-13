import React from 'react';

import styles from './MessageList.css';


const Message = props => (
    <div className={styles.Message}>
      <strong>{props.from} :</strong>
      <span>({props.date}):</span>    
      <span>{props.text}</span> 
      <button>X</button>    
       
    </div>
);

const MessageList = props => (
    <div className={styles.MessageList}>
      {
        props.messages.map((message, i) => {
          return (
            <Message
              key={i}
              from={message.from}
              text={message.text}
              id={message.id}
              date={message.date}
            />
          );
        })
      }
    </div>
  );

  export default MessageList;