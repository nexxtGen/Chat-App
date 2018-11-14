import React from 'react';

import styles from './MessageList.css';

// id: props.id
const Message = props => (
    <div className={styles.Message}>
      <strong>{props.from} :</strong>
      <span>({props.date}):</span>    
      <span>{props.text}</span> 
      <button onClick={() => props.deleteMessage(props.nameClient, props.id, props.from)}>X</button> 
       
    </div>
);

//id: message.id
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
              nameClient={props.nameClient}
              deleteMessage={props.deleteMessage}
            />
          );
        })
      }
    </div>
  );

  export default MessageList;