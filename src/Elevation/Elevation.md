Shadows provide important visual cues about objects’ depth and directional movement. They are the only visual cue indicating the amount of separation between surfaces. An object’s elevation determines the appearance of its shadow. The elevation values are mapped out in a "z-space" and range from 0 to 24.

```js
initialState = { elevation: 0 };
<div className="demo-surfaces">    
    <Elevation z={10}>10dp</Elevation>    
    <Elevation 
        z={state.elevation}
        transition={true}
        onMouseOver={() => setState({elevation: 24})}
        onMouseOut={() => setState({elevation: 0})}
        >
            Hover Me 
            {state.elevation}dp            
    </Elevation>
</div>
```