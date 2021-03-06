import React, { useEffect, useState } from 'react';
import SpeedIndicator from './SpeedIndicator';
function App() {
    const [file, setFile] = useState(null);
    const [speed, setSpeed] = useState(1)
    const [lastSpeed, setLastSpeed] = useState()
    const [hideControls, setHideControls] = useState(true)

    useEffect(() => {
        const player = document.getElementById("player")
        if (player) {
            player.playbackRate = speed;
        }
    }, [speed])

    window.api.openFile((event, message) => {
        setFile(message.filePaths[0])

        document.title = message.filePaths[0]
    })
    return (
        <div id="player-container"
            onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();

            }}
            onDrop={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const droppedFile = e.dataTransfer.files;

                const isValidFile = await window.api.isValidFile(droppedFile[0].path);
                console.log(isValidFile);
                if (isValidFile) {
                    setFile(droppedFile[0].path);
                }
            }}
            onMouseMove={(e) => {
                if (hideControls === true) {
                    setHideControls(false)
                }
            }}
            onMouseLeave={(e) => {
                if (hideControls === false) {
                    setHideControls(true)
                }
            }}

        >

            <SpeedIndicator speed={speed} hidden={hideControls} />
            <video id="player" src={file} controls={true}
                onKeyDown={(e) => {
                    if (e.key === 'f') {

                        e.target.requestFullscreen();

                    }

                    if (e.key === ' ') {
                        console.log(e.target.paused)
                        if (!e.target.paused) {

                            e.target.play();

                        } else if (e.target.paused) {

                            e.target.pause();

                        }
                    }

                    if (e.key === 's') {

                        setSpeed(speed - 0.1)
                        e.target.playbackRate = speed;

                    } else if (e.key === 'd') {

                        setSpeed(speed + 0.1)
                        e.target.playbackRate = speed;

                    } else if (e.key === 'r') {

                        if (speed === 1) {
                            setSpeed(lastSpeed)
                        } else {

                            setLastSpeed(speed)
                            setSpeed(1)
                        }

                    }
                }}
            />
        </div>
    )
}

export default App;