import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import './PhaserGame.css';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef();
    const inputRef = useRef();

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");
            
            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    useEffect(() => {
        // Focus the input element when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="input-text">
            <div id="game-container"></div>
            <input 
                ref={inputRef} 
                type="text" 
                name="name" 
                className="input" 
                placeholder="Enter chinese character" 
            />
        </div>
    );
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func 
}
