import { useEffect, useState } from 'react';
import firebase from "firebase/app";

const TimesList = () => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const timesRef = firebase.firestore().collection("times").where("user_id", "==", firebase.auth().currentUser.uid);
    var unsubscribe = timesRef.onSnapshot((querySnapshot) => {
      var newTimes = [];
      querySnapshot.forEach((doc) => {
        newTimes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTimes(newTimes);
    });
    return () => unsubscribe();
  },[]);

  const handleDelete = id => {
      firebase.firestore().collection("times").doc(id).delete();
  }

  return (
      <div>
          <h2>Times List</h2>
          <ol>
              {times.map(time => (
                  <li key={time.id}>
                      <div className="time-entry">
                        {time.title}
                        <code className="time">{time.time_seconds}</code>
                        <button onClick={() => handleDelete(time.id)}>Delete</button>
                      </div>
                  </li>
              ))}
          </ol>
      </div>
  );
};

export default TimesList;