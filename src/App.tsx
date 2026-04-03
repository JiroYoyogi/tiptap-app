import './App.css';
import { useState } from 'react';
import MyEditor from './components/MyEditor';

function App() {
  return (
    <>
      <main>
        <h1>
          <img src="/tiptap-logo.png" alt="" />
        </h1>
        <MyEditor />
      </main>
    </>
  );
}

export default App;
