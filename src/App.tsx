import { useRef, useState } from 'react';

import Tesseract from 'tesseract.js';

import './App.css';

const Title = () => {
  return (
    <h1 className='font-bold text-blue-300'>OCR + React</h1>
  )
}

const InputFields = ({ image, setImage, setResult }: any) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const extract = () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          Tesseract.recognize(
            reader.result as string,
            'eng',
            { logger: (info) => console.log(info) }
          )
            .then(({ data: { text } }) => {
              setResult(text);
            })
            .catch((err) => console.error('OCR Error: ', err));
        }
      };
      reader.readAsDataURL(image);
    }
  };

  const remove = () => {
    setImage(null);
    setResult(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
          }
        }}
        ref={inputRef}
        style={{ marginTop: '20px' }}
      />
      <div className={`${!image ? 'invisible' : 'visible inline-flex gap-2'}`}>
        <button onClick={extract} disabled={!image} className='bg-blue-700'>
          Extract
        </button>
        <button onClick={remove} disabled={!image} className='bg-red-700'>
          Remove
        </button>
      </div>
    </>
  )
}

const Preview = ({ image }: any) => {
  return (
    image ?
      <div style={{ display: 'flex', justifyContent: 'center' }
      } >
        <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '300px', display: 'block', marginTop: '20px' }} />
      </div >
      : null
  )
}

const Result = ({ result }: any) => {
  return (
    result ?
      <div style={{ display: 'block', margin: '30px 0' }}>
        <h4 style={{ marginBottom: '20px' }}>Result of Extraction:</h4>
        <p>{result}</p>
      </div> : null
  )
}

const App = () => {
  const [result, setResult] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  return (
    <>
      <Title />
      <InputFields image={image} setImage={setImage} setResult={setResult} />
      <Preview image={image} />
      <Result result={result} />
    </>
  );
}

export default App;
