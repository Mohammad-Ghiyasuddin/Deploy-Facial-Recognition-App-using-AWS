import {useState} from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.png');
  const [isAuth, setAuth] = useState(false);
  
  
  
  
  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://sttea8d5i0.execute-api.ap-south-1.amazonaws.com/dev/vertex-employee-visitors/${visitorImageName}.jpeg`,{
         method: 'PUT',
         headers: {
          'Content-Type': 'image/jpeg'
         },
         body: image
    }).then(async () =>{
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage (`Hi ${response['firstName']} ${response['lastName']},Welcome to work. Hope you have a great day today!!`)
      } else {
        setAuth(false);
        setUploadResultMessage ('Authentication Failed: this person is not an employee.')
      }
    }).catch(error => {
      setAuth(false);
       setUploadResultMessage('There is an error during the authentication process please try again ')
      console.error(error);
    })
  }

  async function authenticate (visitorImageName) {
   const requestUrl = 'https://sttea8d5i0.execute-api.ap-south-1.amazonaws.com/dev/employee?' + new URLSearchParams({
     objectKey: `${visitorImageName}.jpeg`
   });
   return await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
   }).then(response => response.json())
   .then((data) => {
       return data;

   }).catch(error => console.error(error));
   
  }

  return (
    <div className="App">
       <h2>Felix's Facial Recognition System</h2>
       <form onSubmit={sendImage}>
       <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
       <button type='submit'>Authenticate</button>
       </form>
       <div className={isAuth ? 'success' : 'fsilure'}> {uploadResultMessage}</div>
       <img src={ require(`./visitors/${visitorName}`)} alt="visitors" height={250} width={250}/>
    </div>
  );
}

export default App;
