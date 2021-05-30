import React from 'react'
import styles from './Notification.module.scss';

const Notification = props => {
  const [openNotification, setOpenNotification] = React.useState(true)
  return (
    <>
      {openNotification && (
        <div className={styles.notificationContainer}>
          <div className={styles[props.status]}>
            <span className={styles.status}>{props.status}:</span>
            <span className={styles.notificationText}>{props.message}</span>
            <span className={styles.times} onClick={() => setOpenNotification(false)}>&times;</span>
          </div>
        </div>
      )}
    </>
  )
}

export default Notification;