A floating action button component

### FABs with Ripple

```js
<div className="margin">
    <Fab icon="favorite"/>
    <Fab mini icon="favorite"/>                      
</div>
```

### CSS Only FABs

```js
<div className="margin">
    <Fab ripple={false} icon="favorite"/>
    <Fab ripple={false} mini icon="favorite"/>                      
</div>
```

### Example of Enter and Exit Motions

```js
initialState = { exited: false };
<div className="margin">
<Fab exited={state.exited} icon="favorite"/>
<Button stroked onClick={() => setState(prev => ({exited: !prev.exited}))}>Toggle Exited</Button>
</div>
```