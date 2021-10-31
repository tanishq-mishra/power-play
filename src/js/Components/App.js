import React, { useState } from 'react';
import { ipcRenderer } from 'electron'
function App() {
    const [file, setFile] = useState(null);
    ipcRenderer.on('open-file', (event, message) => {
        setFile(message.filePaths[0])
    })
    return (
        <div id="player-container">

            <video id="player" src={file} controls={true} />
        </div>
    )
}

export default App;